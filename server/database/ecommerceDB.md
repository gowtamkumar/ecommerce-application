## users:

id,
name,
username:,
password,
email,
type:[Customer, Vendor, Delivery Man, Admin]
phone,
birthday,
point:number
status(Active/Inactive/Block)
img_url,
addresses:[come from address table]
last_login: date with time zone
last_logout: date with time zone
ip_address(optional),
divice_id(optional),
resetToken
createdAt
updatedAt

<!-- ## login_tracking
id,
last_login: date with time zone
last_logout: date with time zone,
ip_address(optional),
divice_id(optional),
 -->

## address

id,
user_id,
address_line_1:string(billing/home/office),
address_line_2:string
state,
city,
country:string
zip_code,

## products table :

id,
name:string,
shipping_cost:numeric,
tax_id: number,

<!-- discount_id: number(this copun number), -->

url_slug(unique),
images:array
single_image,
brand_id,
limit_purchase_qty:number,
tags: ['ddd','aa']
user_id,
description,
short_description,
enable_review: boolean,
status:['acitve/inactive'],
createdAt,
updatedAt

<!-- product single and varient hole array get hobe product variant a -->

type: ['Simple Product', "Varient Product"]

## product_category

id,
category_id,
product_id

## product variants

id,
regular_price:numeric,
sale_price:numeric,
size_id,
size: string(this field only for single product)
color(red, green, yellow)
weight(kg):numeric

  <!-- stock qty thankle stock status hobe na -->

stock_qty,
stock_status:(In Stock/Out Stock),

## size

id,
name,
status,

## discounts:

id,
coupon_code,
type:(Percentage, FixedAmount, FreeShipping).
value,
start_date,
expiry_date
end_date,
min_order_amount,
min_user,
usage_count
is_single_use: Boolean
status:(Active/Inactive)
user_id
createdAt
updatedAt

## categories:

id,
name,
url_slug(unique)
parent_id,
user_id,
description
image;
status:(Active/Inactive)
createdAt
updatedAt

## wishlists:

id,
product_id,

<!-- user_id, -->

createdAt,
updatedAt

## carts:(optional)

id,
product_id,
user_id,
qty,
createdAt,
updatedAt

## brands:

id,
name,
photo,
description
status:(Active/Inactive),,
user_id,
createdAt
updatedAt

## orders:

id,
user_id,
order_date,
tracking_no,
is_paid,
order_total_amount
is_shipped,
discount_amount,
net_amount,
shiping_amount,
order_note,

<!-- order_items: array -->

phone_no,
email_address,
delivery_address,
payment_status(Paid/NotPaid/PertialPaid),
payment_type(Online/Offline)
payment_transaction_id,

<!-- status:(Processing/Pending/Completed/Failed), -->

createdAt
updatedAt

## orderItems:

id,
order_id,
total_amount,
product_id,
qty,

## order_traking

order_id,
data: timestamp
note:string,
status:["Order placed", "Order Approved", 'order Ready to Ship', "Order Handover to Courier", "Order Delivered"]

## tax

id,
type: (Percentage, FixedAmount)
value,
status:boolean

## reviews:

id,
product_id,
user_id,
rating,
comment,
status:(Reject/Approved),
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
