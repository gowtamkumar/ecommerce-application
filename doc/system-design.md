# High-Level Design of an E-Commerce Platform

## Objective

Design a scalable, reliable, and high-performance e-commerce platform that supports critical features such as product search, authentication, order management, inventory updates, and payment processing.
**Out of scope:** delivery logistics and customer support.

---

## What Is an E-Commerce System?

An **e-commerce system** is a SaaS platform that allows businesses to sell products (and sometimes services) online. It provides digital storefronts where customers can browse, purchase, and manage orders. The system integrates multiple software components to enable transactions, inventory management, payments, and automation.

---

## Benefits of E-Commerce Systems

- **Global Reach:** Break geographical barriers and reach a worldwide audience.
- **Convenience:** 24/7 online shopping from anywhere.
- **Scalability:** Handle millions of users and transactions with growing demand.
- **Cost Efficiency:** Lower operational costs compared to physical stores.
- **Personalization:** Recommendation engines improve shopping experience.
- **Automation:** Streamlined order management, inventory tracking, and returns.

---

## Requirements and Goals

### Functional Requirements (FR)

- Authorization & Authentication
- Product Search
- Cart Management
- Order Placement & Payment Processing
- Notifications (order stages)
- User Service (profiles, preferences)
- Inventory Management
- Order History
- _(Stretch Goal: Recommendation System)_

### Non-Functional Requirements (NFR)

- **Availability** – high uptime for the platform
- **Consistency** – especially for inventory data
- **Reliability** – no data loss for users or sellers
- _(Stretch Goals: Monitoring, Observability)_

### Out of Scope

- Delivery logistics (shipping, returns, customer support)
- API design details
- Data model implementation

---

## Design Considerations

- **Read-heavy system**: browsing & searching far exceed purchasing.
- **Low-latency search & recommendations**: <100ms target.
- **Data reliability is critical**: account creation, product listings, orders.
- **Inventory management** must prevent overselling.
- **Notifications** can tolerate high latency but must be reliable.
- **Order storage strategy:**

  - **Hot storage**: orders <1 year (RDS)
  - **Cold storage**: orders >1 year (S3 + Athena)

---

## Scale Estimates (Back-of-the-Envelope)

- **Daily Active Users (DAU):** \~10M (10% peak = 1M concurrent)
- **Search Requests:** \~1M searches/hour
- **Item Views:** 50–100M views/day
- **Cart Activity:** \~100K cart actions/day
- **Purchases:** 10–20K orders/day
- **Inventory Updates:** \~10M updates/day
- **Data Storage:**

  - Users: \~100GB
  - Items: \~100GB (+media in CDN/S3)
  - Orders: \~100TB

---

## Storage & Infrastructure Choices

- **Search:** OpenSearch/Elasticsearch
- **Order Storage:** RDS (hot), S3 + Athena (cold)
- **Databases:** RDBMS for users, items, and orders
- **Queueing:** Kafka for async processing (notifications, updates)
- **Caching:**

  - **Distributed (e.g., Redis Cluster):** search, recommendations, inventory
  - **Centralized (e.g., Memcached):** user profiles, cart, authentication

---

## Handling Race Conditions in Inventory

- **Options:**

  1. **DB Locking:** row-level locks (simple, but high latency)
  2. **Optimistic Concurrency Control:** retry failed transactions
  3. **Queueing Mechanism:** FCFS, but slow
  4. **Stock Reservation (best choice):**

     - Reserve items in a separate `ItemReservations` table
     - Expire reservations via scheduled job
     - Adjust stock accordingly

---

## High-Level System Architecture (Diagram in Drive Link)

📎 [System Design Diagram](https://drive.google.com/file/d/1F8wKzSxrdB0Y4XbEGoMEfLNeh6Gw5b9R/view?usp=sharing)

---

## Component Design

### 1. **API Gateway & Load Balancer**

- Entry point for all requests
- Handles routing, auth, rate limiting, caching
- Load balances traffic across services

### 2. **Search Service**

- Product search with filters & fuzzy matching
- Powered by OpenSearch cluster

### 3. **Detail Page Service**

- Fetches detailed product data (price, reviews, availability)
- Calls supporting services (media, reviews, metadata)

### 4. **Location Service**

- Manages user location data (compliance-aware)
- Supports location-based recommendations & delivery estimates

### 5. **Auth Service**

- Authentication & authorization
- Manages tokens, sessions, external login providers

### 6. **User Service**

- Stores user profiles, addresses, preferences
- Powers personalization & recommendations

### 7. **Cart Service**

- Handles add/update/remove cart operations
- Integrates with Purchase Service during checkout

### 8. **Purchase Service**

- Checkout flow & payment calculation
- Integrates with external Payment Gateway

### 9. **Item Service**

- Manages product catalog and availability
- Integrates with Search and Inventory Services

### 10. **Inventory Service**

- Real-time stock tracking
- Prevents overselling by syncing with Item Service

### 11. **Item Management Service**

- Allows sellers to add/update/remove product listings

### 12. **Order Service**

- Stores and tracks orders from placement to fulfillment

### 13. **Order Status Service**

- Provides real-time updates on order stages

### 14. **Migration Service**

- Moves old orders to cold storage (S3 + Athena)

### 15. **Notification Service**

- Sends order confirmations, shipping updates, promotions
- Uses Kafka for async delivery

### 16. **Recommendation Service**

- Suggests products based on browsing & purchase history

### 17. **ES/OpenSearch Cluster**

- Indexes items for full-text search & fuzzy matching

### 18. **Payment Gateway**

- Secure payments via providers (Visa, MasterCard, etc.)

---

## Conclusion

This **service-oriented, microservices-based design** ensures:

- **Scalability**: supports millions of users and products
- **Reliability**: resilient services with fault tolerance
- **Performance**: low-latency search & recommendations
- **Maintainability**: loosely coupled services, easy upgrades
