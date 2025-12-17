# Ecommerce Database Schema

## users
- id: integer (PK, Auto Increment)
- name: varchar
- username: varchar (unique, nullable)
- password: varchar (nullable)
- email: varchar (unique)
- type: enum ('Customer', 'Vendor', 'Delivery Man', 'Admin') (default: 'Customer')
- phone: varchar (unique, nullable)
- dob: varchar (nullable)
- gender: enum ('Male', 'Female', 'Other') (nullable)
- point: varchar (nullable)
- address: varchar (nullable)
- image: varchar (nullable)
- role: enum ('user', 'admin') (default: 'user')
- status: enum ('Active', 'Inactive', 'Block') (default: 'Active')
- last_login: timestamp (nullable)
- last_logout: timestamp (nullable)
- ip_address: varchar (nullable)
- device_id: varchar (nullable)
- is_verified: boolean (default: false)
- verification_token: varchar (nullable)
- reset_token: varchar (nullable)
- failed_login_attempts: int (default: 0)
- block_until: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp

## user_activity
- id: integer (PK)
- type: varchar
- timestamp: timestamp

## shipping_addresses
- id: integer (PK)
- type: enum ('Home', 'Office')
- name: varchar
- phone_no: varchar
- email: varchar (nullable)
- alternative_phone_no: varchar (nullable)
- division_id: integer (FK -> divisions.id, nullable)
- district_id: integer (FK -> districts.id, nullable)
- upazila_id: integer (FK -> upazilas.id, nullable)
- union_id: integer (FK -> unions.id, nullable)
- address: varchar
- user_id: integer (FK -> users.id)
- status: boolean (default: true)

## products
- id: integer (PK)
- name: varchar
- slug: varchar
- variant: boolean (default: false)
- is_returnable: boolean (default: true)
- is_new_arrival: boolean (default: false)
- featured: boolean (default: false)
- description: varchar
- short_description: varchar
- tax_id: integer (FK -> taxs.id, nullable)
- discount_id: integer (FK -> discounts.id, nullable)
- enable_review: boolean (default: true)
- limit_purchase_qty: integer (nullable)
- alert_qty: integer
- status: enum ('Active', 'Inactive') (default: 'Active')
- brand_id: integer (FK -> brands.id, nullable)
- unit_id: integer (FK -> units.id)
- tags: simple-array (nullable)
- thumbnail_image: varchar
- hover_image: varchar
- images: simple-array
- user_id: integer (FK -> users.id)
- created_at: timestamp
- updated_at: timestamp

## product_variants
- id: integer (PK)
- sku: varchar (nullable)
- unit_price: numeric(15, 2)
- purchase_price: numeric(15, 2)
- product_id: integer (FK -> products.id)
- size_id: integer (FK -> sizes.id, nullable)
- color_id: integer (FK -> colors.id, nullable)
- material: varchar (nullable)
- image: varchar (nullable)
- default: boolean (default: false)
- stock_qty: integer

## categories
- id: integer (PK)
- name: varchar (nullable)
- slug: varchar
- image: varchar (nullable)
- level: integer (nullable)
- description: varchar (nullable)
- active: boolean (default: true)
- is_featured: boolean (default: false)
- parent_id: integer (FK -> categories.id, nullable)
- user_id: integer
- created_at: timestamp
- updated_at: timestamp

## brands
- id: integer (PK)
- name: varchar (unique)
- slug: varchar (nullable)
- image: varchar (nullable)
- description: varchar (nullable)
- status: enum ('Active', 'Inactive') (default: 'Active')
- user_id: integer
- created_at: timestamp
- updated_at: timestamp

## units
- id: integer (PK)
- name: varchar
- user_id: integer

## sizes
- id: integer (PK)
- name: varchar
- status: boolean (default: true)
- user_id: integer

## colors
- id: integer (PK)
- name: varchar
- color: varchar
- user_id: integer

## taxs
- id: integer (PK)
- name: varchar
- value: numeric
- user_id: integer
- status: enum ('Active', 'Inactive') (default: 'Active')

## orders
- id: integer (PK)
- tracking_no: varchar
- total_qty: integer
- sub_total: numeric(15, 2)
- total_items_discount: numeric(10, 2) (nullable)
- coupon_discount: numeric(10, 2) (nullable)
- total_tax: numeric(15, 2) (nullable)
- shipping_charge: numeric(15, 2)
- grand_total: numeric(10, 2)
- shipping_address_id: integer (FK -> shipping_addresses.id)
- coupon_id: integer (nullable)
- cancel_resson: varchar (nullable)
- payment_status: enum ('Pending', 'Paid', 'Failed')
- payment_method: enum ('COD', 'Online', 'Card', 'MobileBanking')
- status: enum ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned') (default: 'Pending')
- tran_id: varchar (nullable)
- user_id: integer (FK -> users.id)
- delivery_id: integer (FK -> users.id, nullable)
- created_at: timestamp with time zone
- updated_at: timestamp with time zone

## order_items
- id: integer (PK)
- order_id: integer (FK -> orders.id)
- unit_price: numeric(10, 2)
- purchase_price: numeric(10, 2)
- qty: integer
- tax_amount: numeric(10, 2) (nullable)
- discounted_unit_pice: numeric(10, 2) (nullable)
- total_discounted_price: numeric(10, 2) (nullable)
- discount_amount_per_unit: numeric(10, 2) (nullable)
- total_discount_amount: numeric(10, 2) (nullable)
- sub_total: numeric(10, 2)
- product_id: integer (FK -> products.id)
- product_variant_id: integer (FK -> product_variants.id)

## order_trackings
- id: integer (PK)
- order_id: integer (FK -> orders.id)
- user_id: integer (nullable)
- location: varchar (nullable)
- status: enum ('OrderPlaced', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled', 'Returned') (default: 'OrderPlaced')
- created_at: timestamp
- updated_at: timestamp

## carts
- id: integer (PK)
- product_id: integer (FK -> products.id)
- product_variant_id: integer (FK -> product_variants.id)
- qty: integer
- user_id: integer (FK -> users.id)
- abandoned_email_sent: boolean (default: false)
- created_at: timestamp
- updated_at: timestamp

## wishlists
- id: integer (PK)
- product_id: integer (FK -> products.id)
- user_id: integer (FK -> users.id)
- created_at: timestamp
- updated_at: timestamp

## coupons
- id: integer (PK)
- type: enum ('order', 'product', 'category', 'shipping')
- code: varchar (unique)
- discount_type: enum ('Percentage', 'Fixed', 'FreeShipping', 'BOGO')
- value: numeric
- start_date: timestamp with time zone (nullable)
- expiry_date: timestamp with time zone (nullable)
- min_order_amount: numeric (nullable)
- min_cart_value: numeric (nullable)
- max_user: integer (nullable)
- max_discount_value: numeric (nullable)
- usage_count: integer (nullable)
- usage_limit: integer (nullable)
- usage_per_user: integer (nullable)
- image: varchar (nullable)
- active: boolean (default: true)
- user_id: integer
- created_at: timestamp
- updated_at: timestamp

## coupon_products
- id: integer (PK)
- product_id: integer (FK -> products.id)
- coupon_id: integer (FK -> coupons.id)
- created_at: timestamp
- updated_at: timestamp

## applied_coupons
- id: integer (PK)
- user_id: integer
- coupon_id: integer
- order_id: integer
- discount_amount: numeric
- applied_at: timestamp

## discounts
- id: integer (PK)
- name: varchar
- key: varchar (length: 50, unique, nullable)
- scope: enum ('Order', 'Product', 'Category', 'Brand')
- slug: varchar (nullable)
- promotion_type: enum ('Couple', 'FlashSale', 'Seasonal', 'Clearance', 'BuyMoreSaveMore')
- discount_strategy: enum ('Percentage', 'FixedAmount', 'FreeShipping', 'BuyOneGetOne', 'Tiered')
- offer_details: jsonb (nullable)
- value: decimal(10, 2) (nullable)
- start_date: timestamp with time zone (nullable)
- end_date: timestamp with time zone (nullable)
- priority: integer (default: 1)
- stackable: boolean (default: false)
- status: enum ('Active', 'Inactive') (default: 'Active')
- image: varchar (nullable)
- description: varchar (nullable)
- user_id: integer
- created_at: timestamp
- updated_at: timestamp

## applicable_products
- id: integer (PK)
- product_id: integer
- discount_id: integer (FK -> discounts.id)
- created_at: timestamp
- updated_at: timestamp

## applicable_categories
- id: integer (PK)
- category_id: integer
- discount_id: integer (FK -> discounts.id)
- created_at: timestamp
- updated_at: timestamp

## applicable_brands
- id: integer (PK)
- brand_id: integer
- discount_id: integer (FK -> discounts.id)
- created_at: timestamp
- updated_at: timestamp

## payments
- id: integer (PK)
- order_id: integer (FK -> orders.id, nullable)
- payment_date: timestamp with time zone
- payment_type: enum ('Credit', 'Debit')
- payment_method: enum ('COD', 'Online', 'Card', 'MobileBanking')
- amount: numeric(15, 2)
- user_id: integer (FK -> users.id, nullable)
- tran_id: varchar (nullable)
- created_at: timestamp with time zone
- updated_at: timestamp with time zone

## settings
- id: integer (PK)
- site_name: varchar
- image: varchar (nullable)
- order_free_shipping_amount: numeric(10, 2) (nullable)
- favicon: varchar (nullable)
- address: varchar (nullable)
- phone: varchar (nullable)
- email: varchar (nullable)
- description: varchar (nullable)
- social_link: simple-json (nullable)
- seo: simple-json (nullable)
- email_config: simple-json (nullable)
- whats_app_widget: simple-json (nullable)
- payment_account: simple-json (nullable)
- home_page: simple-json (nullable)
- about_page: simple-json (nullable)
- contact_page: simple-json (nullable)
- term_policy_page: simple-json (nullable)
- footer_option: simple-json (nullable)
- header_option: simple-json (nullable)
- faq: simple-json (nullable)
- help_support: simple-json (nullable)
- updated_at: timestamp

## banners
- id: integer (PK)
- title: varchar
- type: enum ('Slider', 'Mid', 'Bottom') (default: 'Slider')
- image: varchar
- url: varchar (nullable)
- description: varchar (nullable)
- active: boolean (default: true)
- user_id: integer

## posts
- id: integer (PK)
- slug: varchar
- title: varchar
- image: varchar
- tags: simple-array (nullable)
- content: varchar
- user_id: integer (FK -> users.id)
- status: enum ('Published', 'Draft', 'Archived') (default: 'Draft')
- created_at: timestamp with time zone
- updated_at: timestamp with time zone

## comments
- id: integer (PK)
- post_id: integer (FK -> posts.id)
- content: varchar (nullable)
- status: enum ('Pending', 'Approved', 'Rejected') (default: 'Pending')
- user_id: integer (FK -> users.id)
- created_at: timestamp
- updated_at: timestamp

## menus
- id: integer (PK)
- name: varchar
- items: simple-json (nullable)
- footer_menu: boolean (default: false)
- top_bar_menu: boolean (default: false)
- main_menu: boolean (default: false)
- active: boolean (default: true)
- user_id: integer
- created_at: timestamp
- updated_at: timestamp

## notifications
- id: integer (PK)
- title: varchar
- type: varchar
- message: varchar
- is_read: boolean (default: false)
- user_id: integer (FK -> users.id)
- order_id: integer (nullable)
- created_at: timestamp with time zone
- updated_at: timestamp with time zone

## stock_adjusts
- id: integer (PK)
- product_id: integer (FK -> products.id)
- type: enum ('Increment', 'Decrement')
- product_variant_id: integer
- qty: integer
- user_id: integer
## returns
- id: integer (PK, Auto Increment)
- order_id: integer (FK -> orders.id)
- order_item_id: integer (FK -> order_items.id)
- reason: varchar (nullable)
- requested_qty: integer (default: 0)
- approved_qty: integer (default: 0)
- phone: varchar (nullable)
- image: varchar (nullable)
- status: enum ('Requested', 'Processing', 'Approved', 'Rejected', 'Completed', 'Refunded') (default: 'Requested')
- user_id: integer (FK -> users.id)
- requested_at: timestamp
- updated_at: timestamp
