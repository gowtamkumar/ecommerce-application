# Semicolon E-Commerce: Core Pricing & Discount Rules
**Target Audience**: Backend Engineers, Frontend Developers, QA

This document serves as the **source of truth** for how prices, discounts, and taxes are calculated across the application. 

> [!IMPORTANT]
> **All pricing math must be performed within the PostgreSQL database using raw SQL Common Table Expressions (CTEs)**. Do not calculate localized pricing or subtract discounts on the Node.js or React layer unless it applies to Checkout Coupons.

---

## 1. Core Pricing Concepts & Field Mappings

To ensure smooth communication between the API and the React frontend, we strictly standardize on the following terminology:

| Frontend Field | DB Source / Formula | Description |
| :--- | :--- | :--- |
| `unitPrice` | `product_variants.unit_price` | The absolute base price of the selected variant before ANY discounts or taxes. |
| `purchasePrice` | `product_variants.purchase_price` | Cost price (used primarily for admin profit calculations). |
| `discountAmount`| `unitPrice - discountedPrice` | The raw monetary value saved by the active discount (excludes tax). |
| `taxAmount` | `discountedPrice * (tax_percent / 100)` | The tax charge, calculated purely on the **discounted** amount. |
| `discountedPrice` | `unitPrice - discountAmount` | Intermediary calculation. The price after discount, but *before* tax. |
| `salePrice` | `unitPrice + Tax on unitPrice` | The **Original Strikethrough Price** visible to the user. Includes standard tax but ignores discounts. |
| `finalPrice` | `discountedPrice + taxAmount` | The **Current Offer Price**. What the customer actually pays today. |

---

## 2. Order of Operations Pipeline

The pricing logic strictly follows a 3-step hierarchical pipeline within our SQL queries (`productsQuery`, `productDetailQuery`, `topSellingProductQuery`).

### Step 1: Base Table Resolution
The API selects the base price from the `product_variants` table. 
*   If a user requests a specific variant via `?productVariantId=X`, it pulls that variant's `unit_price`.
*   If no variant is specified, it relies on an `ORDER BY "default" DESC` clause to select the default variant.

### Step 2: Discount Selection Engine (Priority Rules)
Products can be eligible for multiple discounts (Global, Category-wide, Brand-wide, or Specific products). The application relies on a strictly ordered SQL sequence `DISTINCT ON (p.id)` to resolve conflicts:

```sql
ORDER BY p.id, dis.priority DESC, dis.value DESC
```
1.  **Date Validation**: Ensure `NOW()` is between `start_date` and `end_date`.
2.  **Priority**: A discount structurally defined with Priority `10` overrides Priority `1`.
3.  **Value**: If Priority is tied, the discount with the loftier monetary value overrides the lesser.

### Step 3: The Calculation Engine (`base_price` CTE)
Once the "Best" discount is determined, the mathematical transformation calculates the intermediary `discounted_price`:

```sql
-- Evaluates within the 'base_price' CTE
CASE 
    WHEN sd.discount_strategy = 'Percentage' THEN 
        unit_price - (unit_price * sd.discount_value / 100)
    WHEN sd.discount_strategy = 'Fixed' THEN 
        unit_price - sd.discount_value
    ELSE 
        unit_price
END AS discounted_price
```

Then we use `discounted_price` in the outer query to arrive at `finalPrice` and `salePrice`.

> [!CAUTION]
> **To prevent calculation mismatches across pages, use this exact formula bloc in all new catalog queries:**
>
> `ROUND(discounted_price * tax_percent / 100, 2) AS "taxAmount"`
> `ROUND(discounted_price + (discounted_price * tax_percent / 100), 2) AS "finalPrice"`
> `ROUND(unit_price + (unit_price * tax_percent / 100), 2) AS "salePrice"`

---

## 3. Disambiguation: Discounts vs Coupons

It is highly important for developers extending checkout features to separate **Discounts** from **Coupons**:

*   **Discounts (`discounts` table)**: Evaluated at the **Product-level**. Visually changes `finalPrice` dynamically as the customer browses the catalog. Processed entirely in the aforementioned Postgres SQL queries.
*   **Coupons (`coupons` table)**: Evaluated at the **Cart-level**. Processed primarily in the Node.js business logic. Applied as a deduction `(SUM(OrderItems) - CouponValue)` immediately prior to payment gateway initialization. Coupons should NEVER modify the `finalPrice` or `unitPrice` property of a single product API response.

## 4. Rule of Thumb for Modifications
If you need to change how numbers appear on the frontend (e.g. changing the application to calculate tax *before* discount instead of after), you MUST update **ALL THREE** queries concurrently in `/server/src/sqlQuery/index.ts`. 

Editing one query while omitting the others will cause the frontend to break (e.g. `unitPrice` returning undefined) or display conflicting values between the shop index page and individual product displays.
