# 🚀 Must-Have Features — E-Commerce Application
> **Purpose:** Features required to make this application fully production-ready and competitive  
> **Date:** 2026-05-16  
> **Based on:** Live codebase audit + industry e-commerce standards

---

## 📊 Priority Legend

| Symbol | Priority | Timeframe |
|--------|----------|-----------|
| 🔴 | **Critical** — Broken or missing core functionality | Fix now |
| 🟠 | **High** — Needed for production quality | 1–4 weeks |
| 🟡 | **Medium** — Competitive necessity | 1–3 months |
| 🟢 | **Low / Future** — Growth & scale features | 3–6 months |

---

## 🔴 CRITICAL — Fix These First
> These are bugs or broken stubs in the current codebase

---

### 1. Customer Management Dashboard Page
**Current State:** `/dashboard/customers` renders only `<div>Customer</div>` — completely empty  
**What's needed:**
- [ ] Customer list table with avatar, name, email, phone, status
- [ ] Search & filter by name, email, status (Active / Inactive / Block)
- [ ] View order count and total spend per customer
- [ ] Block / Unblock customer action
- [ ] Click to view customer detail with order history
- [ ] Export customer list to CSV

---

### 2. Membership / Loyalty System (Backend)
**Current State:** Full controller + 2 entities written — but **no route file, not registered**  
**What's needed:**
- [ ] Create `membership.route.ts` and register in `routes.ts`
- [ ] Membership tier CRUD (e.g., Silver, Gold, Platinum)
- [ ] Assign membership to user on qualifying order amount
- [ ] Apply membership discount at checkout
- [ ] Show membership badge on customer profile
- [ ] Membership management page in dashboard

---

### 3. Visitor / Traffic Analytics (Backend)
**Current State:** Full controller written — route commented out in `routes.ts`  
**What's needed:**
- [ ] Uncomment `visitorRoute` in `routes.ts`
- [ ] Track daily unique visitors
- [ ] Show total visitor count in dashboard home
- [ ] Visitor trend graph (daily / weekly / monthly)

---

### 4. Wishlists Dashboard Page
**Current State:** 54-line page — incomplete data integration  
**What's needed:**
- [ ] List all customer wishlists (who, what products, when added)
- [ ] Filter by product, customer
- [ ] Wishlist analytics (most wishlisted products)
- [ ] Use this data for "price drop" notification targeting

---

## 🟠 HIGH PRIORITY — Production Requirements

---

### 5. Email Notification System
**Current State:** Notifications exist in-app only — no emails sent  
**What's needed:**
- [ ] Transactional emails via SMTP / SendGrid / Resend:
  - [ ] Order placed confirmation
  - [ ] Order status change (Shipped, Delivered)
  - [ ] Payment success / failure
  - [ ] Password reset
  - [ ] New user welcome email
  - [ ] Return request received
  - [ ] Refund processed
- [ ] Email template builder in admin settings
- [ ] Email log in audit trail

---

### 6. Guest Checkout (Without Registration)
**Current State:** Checkout requires user login — no guest option  
**What's needed:**
- [ ] Allow checkout without account
- [ ] Collect email for order tracking
- [ ] Prompt account creation after order placed
- [ ] Link guest order to account if they register later

---

### 7. Advanced Product Search & Filter
**Current State:** Basic product listing — no real search or advanced filters  
**What's needed:**
- [ ] Search bar with live suggestions / autocomplete
- [ ] Filter by: price range, category, brand, color, size, rating, availability
- [ ] Sort by: price (low/high), newest, best-selling, rating
- [ ] Multi-select filter support
- [ ] Search result count display
- [ ] "No results found" with suggestions

---

### 8. Product Reviews — Full UI Integration
**Current State:** Review API exists (`/api/v1/reviews`) — storefront UI not wired  
**What's needed:**
- [ ] Display star rating + review text on product detail page
- [ ] Allow logged-in user to submit review (only for purchased products)
- [ ] Average rating display on product card
- [ ] Review moderation in admin dashboard (`/dashboard/review` exists but thin)
- [ ] Verified purchase badge on reviews
- [ ] Helpful / Not helpful vote

---

### 9. Rate Limiting & API Security
**Current State:** No rate limiting on API endpoints  
**What's needed:**
- [ ] Add `express-rate-limit` middleware on all public routes
- [ ] Stricter limits on auth routes (login, register, forgot-password)
- [ ] Helmet.js for security headers
- [ ] CSRF protection on state-changing endpoints
- [ ] Input sanitization (prevent XSS / SQL injection beyond TypeORM)

---

### 10. Bulk Product Import / Export
**Current State:** Products managed one by one only  
**What's needed:**
- [ ] CSV / Excel import for products (with validation & error report)
- [ ] CSV / Excel export of product catalog
- [ ] Bulk price update
- [ ] Bulk status change (Active / Inactive)
- [ ] Import template download

---

### 11. Invoice / PDF Generation
**Current State:** Orders exist but no downloadable invoice  
**What's needed:**
- [ ] Auto-generate PDF invoice on order confirmation
- [ ] Download invoice from order detail (customer profile)
- [ ] Download invoice from admin order detail
- [ ] Invoice includes: order items, pricing, tax, shipping, customer info, company info

---

### 12. Real-time Notifications (WebSocket)
**Current State:** Notifications are database-polled only  
**What's needed:**
- [ ] WebSocket or SSE integration (Socket.io)
- [ ] Admin gets real-time bell notification on:
  - New order placed
  - New return request
  - Low stock alert
  - New contact message
- [ ] Customer gets real-time order status updates

---

## 🟡 MEDIUM PRIORITY — Competitive Necessity

---

### 13. Advanced Analytics & Reports
**Current State:** Basic dashboard report exists — limited visualization  
**What's needed:**
- [ ] Sales chart: daily / weekly / monthly / yearly (line + bar)
- [ ] Revenue trend visualization
- [ ] Customer acquisition chart (new vs returning)
- [ ] Best-selling products chart (bar chart top 10)
- [ ] Inventory turnover report
- [ ] Refund / return rate report
- [ ] Payment method breakdown (pie chart)
- [ ] Export reports to CSV / Excel / PDF
- [ ] Date range picker for all reports

---

### 14. Abandoned Cart Recovery
**Current State:** Cart exists but no recovery mechanism  
**What's needed:**
- [ ] Detect cart abandoned after 1 hour of inactivity
- [ ] Send automated reminder email (after 1h, 24h, 48h)
- [ ] Include cart items and direct checkout link in email
- [ ] Admin dashboard showing abandoned cart stats
- [ ] Recovery rate KPI on report page

---

### 15. Product Comparison
**Current State:** Not implemented  
**What's needed:**
- [ ] "Add to compare" button on product cards
- [ ] Compare up to 4 products side by side
- [ ] Compare: price, specs, rating, availability
- [ ] Persistent compare tray at bottom of page
- [ ] Share comparison link

---

### 16. Recently Viewed Products
**Current State:** Not implemented  
**What's needed:**
- [ ] Track last 10 viewed products per user (localStorage + server)
- [ ] "Recently Viewed" section on product detail page
- [ ] "Recently Viewed" section on homepage
- [ ] Clear recently viewed option in profile

---

### 17. Related / Recommended Products
**Current State:** Not implemented  
**What's needed:**
- [ ] "You may also like" section on product detail page — same category/brand
- [ ] "Customers also bought" — based on order item co-occurrence
- [ ] "Frequently bought together" bundle suggestion

---

### 18. Social Login Integration
**Current State:** Only email/password login via NextAuth  
**What's needed:**
- [ ] Google OAuth login / register
- [ ] Facebook OAuth login / register
- [ ] Auto-fill profile from social provider
- [ ] Link multiple social accounts to one profile

---

### 19. Push Notifications (PWA)
**Current State:** Foundation exists but not active  
**What's needed:**
- [ ] Web push notification subscription (browser permission)
- [ ] Push on: order shipped, delivery, flash sale
- [ ] Admin can send broadcast push to all subscribers
- [ ] PWA manifest + service worker for "Add to Home Screen"

---

### 20. Multi-language / i18n Support
**Current State:** English only  
**What's needed:**
- [ ] Language switcher in header (at minimum: English + Bangla)
- [ ] All static strings moved to translation files
- [ ] Product name / description in multiple languages
- [ ] RTL layout support (if Arabic added later)
- [ ] Admin dashboard language toggle

---

### 21. Return & Refund — Customer Self-Service
**Current State:** Return API exists but self-service UI limited  
**What's needed:**
- [ ] "Request Return" button on delivered orders in customer profile
- [ ] Select items and reason for return
- [ ] Upload return evidence photos
- [ ] Track return status in customer profile
- [ ] Refund method selection (original payment / wallet / coupon)

---

### 22. Delivery Man / Rider Module
**Current State:** Role exists in enum but no dedicated module  
**What's needed:**
- [ ] Delivery person registration and profile
- [ ] Admin assigns orders to delivery persons
- [ ] Delivery person dashboard (assigned orders, delivery history)
- [ ] Mark order as "Out for Delivery" / "Delivered"
- [ ] Track delivery performance (on-time rate, deliveries count)

---

### 23. Product Q&A Section
**Current State:** Only reviews — no Q&A  
**What's needed:**
- [ ] Customers can ask questions on product page
- [ ] Admin / seller answers questions
- [ ] Other customers mark answers as helpful
- [ ] Q&A shows on product detail page

---

## 🟢 FUTURE — Growth & Scale Features

---

### 24. Mobile App — Full Implementation
**Current State:** Only HomeScreen.js scaffold  
**What's needed (full scope):**
- [ ] Auth screens (Login, Register, Forgot Password)
- [ ] Home screen with banners, featured products
- [ ] Product listing with filter/search
- [ ] Product detail with add-to-cart
- [ ] Cart & checkout flow
- [ ] Payment gateway integration
- [ ] Order history & tracking
- [ ] User profile management
- [ ] Push notifications
- [ ] Wishlist

---

### 25. Vendor / Multi-Seller Marketplace
**Current State:** Single-seller only  
**What's needed:**
- [ ] Vendor registration with admin approval
- [ ] Vendor dashboard (products, orders, earnings)
- [ ] Commission percentage configuration per vendor
- [ ] Vendor payout management
- [ ] Vendor rating & reviews
- [ ] Product approval workflow

---

### 26. Subscription / Recurring Orders
**Current State:** Not implemented  
**What's needed:**
- [ ] "Subscribe & Save" option on eligible products
- [ ] Frequency selection (weekly / monthly / quarterly)
- [ ] Auto-renew order on schedule
- [ ] Subscription management in customer profile
- [ ] Pause / cancel subscription anytime
- [ ] Auto-billing via saved payment method

---

### 27. Gift Card System
**Current State:** Not implemented  
**What's needed:**
- [ ] Purchase gift cards with custom amounts
- [ ] Send gift card via email
- [ ] Redeem gift card at checkout
- [ ] Gift card balance tracking
- [ ] Admin gift card management

---

### 28. Automated Marketing Campaigns
**Current State:** No marketing automation  
**What's needed:**
- [ ] Abandoned cart email series (1h, 24h, 72h)
- [ ] Welcome email sequence for new users
- [ ] Re-engagement campaign for inactive users (30/60/90 days)
- [ ] Birthday discount email
- [ ] "Back in stock" alert for wishlisted products
- [ ] Campaign analytics (open rate, click rate, conversion)

---

### 29. Reward Points / Cashback System
**Current State:** Membership model exists but not connected  
**What's needed:**
- [ ] Earn points on every purchase (configurable ratio)
- [ ] Bonus points for: review, referral, birthday
- [ ] Redeem points as discount at checkout
- [ ] Points expiry system
- [ ] Points history in customer profile
- [ ] Admin configure point earning rules

---

### 30. CI/CD Pipeline & Automated Testing
**Current State:** Manual deployments, no test suite  
**What's needed:**
- [ ] GitHub Actions workflow for: lint → test → build → deploy
- [ ] Unit tests for server business logic (Jest)
- [ ] API integration tests (Supertest)
- [ ] E2E tests for critical flows (Playwright): login, checkout, payment
- [ ] Code coverage reporting (target: 60%+)
- [ ] Automated Docker image builds on merge to main

---

## 📋 Complete Feature Checklist Summary

### 🔴 Critical (Fix Now) — 4 items
- [ ] Customer Management Dashboard Page
- [ ] Membership / Loyalty System (register route + UI)
- [ ] Visitor Traffic Analytics (uncomment route)
- [ ] Wishlists Dashboard Page (full implementation)

### 🟠 High Priority — 8 items
- [ ] Email Notification System (transactional emails)
- [ ] Guest Checkout
- [ ] Advanced Product Search & Filter
- [ ] Product Reviews — Full UI Integration
- [ ] Rate Limiting & API Security
- [ ] Bulk Product Import / Export
- [ ] Invoice / PDF Generation
- [ ] Real-time Notifications (WebSocket)

### 🟡 Medium Priority — 11 items
- [ ] Advanced Analytics & Reports (charts + export)
- [ ] Abandoned Cart Recovery
- [ ] Product Comparison
- [ ] Recently Viewed Products
- [ ] Related / Recommended Products
- [ ] Social Login (Google, Facebook)
- [ ] Push Notifications (PWA)
- [ ] Multi-language / i18n Support
- [ ] Return & Refund — Customer Self-Service UI
- [ ] Delivery Man / Rider Module
- [ ] Product Q&A Section

### 🟢 Future / Growth — 7 items
- [ ] Mobile App (full React Native implementation)
- [ ] Vendor / Multi-Seller Marketplace
- [ ] Subscription / Recurring Orders
- [ ] Gift Card System
- [ ] Automated Marketing Campaigns
- [ ] Reward Points / Cashback System
- [ ] CI/CD Pipeline & Automated Testing

---

## 📈 Impact vs Effort Matrix

| Feature | Business Impact | Dev Effort |
|---------|----------------|------------|
| Customer Dashboard Page | 🔴 High | 🟢 Low (2–3 days) |
| Membership Route Fix | 🔴 High | 🟢 Low (1 day) |
| Email Notifications | 🔴 High | 🟡 Medium (1 week) |
| Guest Checkout | 🟠 High | 🟡 Medium (1 week) |
| Search & Filter | 🟠 High | 🟡 Medium (2 weeks) |
| Invoice PDF | 🟠 High | 🟢 Low (3 days) |
| Product Reviews UI | 🟠 High | 🟢 Low (3 days) |
| Rate Limiting | 🟠 High | 🟢 Low (1 day) |
| Advanced Analytics | 🟡 Medium | 🟠 High (3 weeks) |
| Abandoned Cart | 🟠 High | 🟡 Medium (1 week) |
| Social Login | 🟡 Medium | 🟡 Medium (1 week) |
| Delivery Man Module | 🟡 Medium | 🟠 High (3 weeks) |
| Mobile App | 🟠 High | 🔴 Very High (3+ months) |
| Multi-vendor | 🟡 Medium | 🔴 Very High (4+ months) |
| Reward Points | 🟡 Medium | 🟡 Medium (2 weeks) |

---

## 🗂️ Files to Create / Fix

| # | Action | File Path |
|---|--------|-----------|
| 1 | Create | `server/src/modules/user/membership/route/membership.route.ts` |
| 2 | Edit | `server/src/routes/routes.ts` — uncomment visitorRoute, add membershipRoute |
| 3 | Create | `client/app/dashboard/customers/page.tsx` — full implementation |
| 4 | Create | `server/src/services/email.service.ts` |
| 5 | Create | `server/src/middlewares/rate-limit.middleware.ts` |
| 6 | Create | `client/components/website/product/ReviewSection.tsx` |
| 7 | Create | `client/components/website/product/RelatedProducts.tsx` |
| 8 | Create | `server/src/modules/sales/cart/service/abandoned-cart.service.ts` |
| 9 | Create | `client/components/website/product/CompareDrawer.tsx` |
| 10 | Edit | `client/NavBarRoute.tsx` — fix `webSiteNavbarItems` placeholder links |

---

*Document generated: 2026-05-16*  
*Location: `/docs/MUST_HAVE_FEATURES.md`*  
*See also: [`FEATURE_STATUS.md`](./FEATURE_STATUS.md) · [`ROADMAP.md`](./ROADMAP.md)*
