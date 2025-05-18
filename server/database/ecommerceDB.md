## users:(done)

id,
name,
username:,
password,
email,
type:[Customer, Vendor, Delivery Man, Admin]
phone,
dob,
gender,
point:number
status(Active/Inactive/Block)
image,
shippingAddresses:[from shipping_address table]
last_login: date with time zone
last_logout: date with time zone
ip_address(optional),
divice_id(optional),
resetToken
createdAt
updatedAt

## user_activity

id,
type,
timestamp

## shipping_address :(done)

id,
type:[Home/Office]
name:
phone_no,
email,
alternative_phone_no,
country:string
user_id,
city,
thana
union,
zip_code,
address,
status,

## shipping_charge :(done)

id,
district_id,
weight
amount,
note,
status,

## products :(done)

id,
featured: boolean, this field for only show home page(need to add)
name:string,

slug(unique),
hover_image,
thumbnail_image,
images:array

<!-- shipping_cost:numeric, -->

brand_id,
unit_id,
limit_purchase_qty:number,
tax_id: number,

<!-- discount_id:number -->

discountStrategy,
discount_value
alert_qty
tags: ['ddd','aa']
user_id,
description,
short_description,
enable_review: boolean,
status:['acitve/inactive'],
createdAt,
updatedAt
product_varient:array come from onther table
product_category:array come from onther table
isReturnable:boolean
variant:boolean

## product variants:(done)

id,
purchase_price:numeric,
unit_price:numeric
product_id
size_id
sku(unique),
color_id
material
image: string,
stock_qty:number,
default:boolean

## product_category:(done)

id,
category_id,
product_id

## size (done)

id,
name,
status,

## color (done)

id,
name,
color,

## unit (done)

id,
name,

## coupon

id,
type:['order', 'product', "FreeShipping"]'free_gift', 'bogo', 'cashback',
code,
discountStrategy:(Percentage, Fixed, FreeShipping).
value,
image
start_date,
expiry_Date
min_order_amount,
minimum_cart_value
max_discount_value
usage_limit,
usage_per_user,
max_user,
usage_count,
products:[],(optoinal)
user_id,
status:boolean
createdAt
updatedAt

## coupon_products

id,
product_id,
coupon_id
createdAt
updatedAt

## applied_coupon(not applied)

id,
user_id,
coupon_id,
order_id,
discount_amount,
applied_at:

## categories:(done)

id,
name,
parent_id,
user_id,
description
image;
status:(Active/Inactive)
tags:[""] (need to add)
createdAt
updatedAt

## wishlists:(done)

id,
product_id,
user_id,
createdAt,
updatedAt

## carts:(need to implemnent)

id,
product_id,
product_variant_id,
user_id,
qty,
cart_status:[active, saved]
createdAt,
updatedAt

## brands:(done)

id,
name,
image,
description
status:(Active/Inactive),,
user_id,
createdAt
updatedAt

## orders:

id,
user_id,
order_date,
delivery_id(assing addmin),
tracking_no,
shipping_charge,
total_tax,
total_discount,
sub_total,
coupon_discount
grand_total,
note,
cancel_resson
coupon_id,
shipping_address_id,
payment_status(Paid/Not Paid/Partial Paid),
payment_method(cash/ssecommer/strip)
payment_type(Online/Offline)
payment_transaction_id,
status: ["Processing","Approved","On Shipping","Shipped","Completed","Pending","Returned", "Canceled"],
createdAt
updatedAt

## orderItems:

id,
order_id,

<!-- total_amount, -->

product_id,
price,
purchase_price,
product_variant_id,
color_id,
size_id,
qty,
tax,
discount_amount,

## order_status (optional)

id,
status:string,

  <!-- ["Order placed", "Order Approved", 'order Ready to Ship', "Order Handover to Courier", "Order Delivered"] -->

## order_tracking

order_id,
location:string,
status: ["Order placed", "Order Approved", 'order Ready to Ship', "Order Handover to Courier", "Order Delivered"]
createdAt
updatedAt

## tax:(done)

id,
name
value,
status:boolean

## reviews:(done)

id,
product_id,
user_id,
rating,
comment,
status:(Reject/Approved, Pending),
like:number,
dislike:number
createdAt
updatedAt

## payments:(need to implement sslecommerce)

id,
order_id,
date,
payment_method,
amount,
user_id,
is_successfull:boolean,
transaction_id,
createdAt
updatedAt

## logs:

id,
error:boolean,
user_id,
product_id,
order_id,
order_item_id,
category_id,
wishlist_id,
discount_id,
review_id,
shiping_cart_id,
brand_id,
payment_id,
variant_id,
message/descripiton,
createdAt
updatedAt

## currency

id,
name,
symble

## setting

id,
companyName
logo,
address,
phone,
email
currencyId,
social_link: jsonb
email_config:jsonb,
payment_account:jsonb,
home_page: jsonb,
about_page: jsonb,
contact_page: jsonb,
term_policy_page: jsonb,
footer_option: jsonb,
header_option: jsonb,
help_Support: jsonb
mobile_notification:boolean(this field defind for mobile sms to user)

## banner: ToDo

title,
type:["Slider", "Middle", 'Left', 'Right', 'Footer'],
image,
description,
url,
status: boolean,

## leads(done)

id,
email,
created_at,
updated_at,

## post(back end done)

title,
user_id,
image,
tags:[]

<!-- slug(UNIQUE), -->

content,
status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
createdAt
updatedAt

## blog_category(done back end)

id
post_id,
category_id,

## Comments(back end done)

id,
post_id,
user_id,
content TEXT NOT NULL,
status ENUM('Approved', 'Pending', 'Rejected') DEFAULT 'Pending',
created_at,
updated_at,

## menu (working)

id,
user_id,
item:any,
status boolean,
main_menu boolean,
top_bar_menu boolean,
footer_menu boolean,
created_at,
updated_at,

# notification(done)

id,
user_id: nmber,
order_id: nmber,
type: string,
title: string,,
message:stirng,
is_read: boolean,
created_at,
updated_at

## stock adjustment
  type:[add, subtract]
  productId,
  variantId,
  qty

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

