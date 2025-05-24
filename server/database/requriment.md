<!-- important feature:  -->
<!-- note: ai driven ecommerce systecm need to build by ai  -->
note: delivery change depend for location

1. user and auth management
2. login opt system
3. email/sms marketing
4. product management
5. category management
6. wishlist management
7. account and profit management
8. checkout system
9. search engine opitmized code and layout
10. product rating and comments ratings
11. customer relationship managemen
12. order and delivery managemnet
    1. delivery man assign and add delivery charge
    2. dashboard total delivery
13. discount and promotion management
14. multiple mayment option(sslecommerce etc)
15. Search and Filtering
16. chat option,
17. Performance Optimization
18. Security
19. report
20. website edit option
21. event module(need to study)
    1. all email send,
    2. mobile sms,
    3. notification(optional)

#Todo 1. error handling, 2. error message show 3. all api a userid input kora

need to work order update and partial return and return product ar je shipping cost seta loss profit add hove kin na?
# must need to check and testing when every table cascade how many table data delete?

## product list a published ar radio button rakte hobe
## need to add attribute as like wordpress
## need to add combopackage for product
## need to modify discount role kiser jonno disouct dibo, exam: category, product, total order, for number of items, for shipping, . that mine kivabe all category, ba singe category, single product, all product, qty upor virty kore discount hoy. dicount ar moddha couponcode dite hobe. discount and coupon ar  expiry date thakbe.

# need to dynamic menu
# order cancel hole product qty increment hobe number of sale decrement hobe



## user point:

# User points are a loyalty mechanism where customers earn points for actions like:

1. Making purchases
2. Referring friends
3. Writing reviews
4. Signing up or completing their profile
5. Membership upgrades

## point Database Desing:

## Table: points_transactions

- id (UUID)
- user_id (FK to users)
- points (int) — positive or negative
- reason (string) — 'purchase', 'referral', etc.
- created_at (timestamp)

## ✅ 2. Point Rules Definition

Purchase (per $1 spent) => 1 point
First signup => 50 points
Product review => 10 points
Friend referral => 100 points
Birthday bonus => 50 points

Store these in a config table or environment file to make them adjustable.

## ✅ 3. Redemption Rules

Example:

100 points = $1 off

Minimum redemption: 500 points

So if a user has 1200 points, they can get $12 off.

You can:

Apply during checkout

Show available rewards on user profile

## ✅ 5. Frontend Display

Show point balance on dashboard

Show earned points per order

Show rewards available to redeem

Allow point-based filters (e.g., “Shop with Points”)

## What Is a Membership?

# A membership is a customer tier or subscription that provides exclusive benefits, such as:

Extra discounts

Early access to sales

Free shipping

Bonus reward points

Exclusive products or services

# 🎯 Examples of Membership Models

    Paid => 	Amazon Prime, Flipkart Plus => 	Pay monthly/yearly for benefits
    Points-Based =>	Earned after spending a threshold =>	"Gold Member after spending ₹10,000"
    Invite Only =>	Given by admins or high loyalty users =>	Elite or VIP club
    Tiered Levels =>	Silver / Gold / Platinum =>	Benefits increase with each level

# Database Design

    Table: memberships
    - id
    - name (Silver, Gold, Prime)
    - fee (nullable)
    - duration_days (e.g., 365)
    - discount_percentage
    - bonus_points_multiplier
    - free_shipping (boolean)
    - active

    Table: user_memberships
    - id
    - user_id
    - membership_id
    - start_date
    - end_date

# How It Works

1. User Joins Membership
   Either by paying (e.g., ₹999/year) or by qualifying (e.g., ₹50,000 total spend)

2. System Applies Benefits

💰 Cart discounts:
Apply extra discount if user is a member

    Example: if (user.membership) apply 5% extra

🚚 Free Shipping:

    Skip shipping fee for members

🎁 Bonus Points:

    Multiply earned points by 2x or 3x

3. Membership Expiry
   On login or checkout, check end_date


    Deactivate if expired
