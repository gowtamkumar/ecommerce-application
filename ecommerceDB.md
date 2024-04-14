<!-- ## user_role
id,
name,
created_at,
update_at, -->

## users:

id,
username:,
password,
email,
name,
type:[User, Vendor, DeliveryMan, Admin]
phone,
birthday,
status(Active/Inactive/Block)
img_url,
addresses:[come from address table]
last_login: date with time zone
last_logout: date with time zone
createdAt
updatedAt

## address

id,
user_id,
address_line_1:string(billing/home/office),
address_line_2:string
state,
city,
country:string
zip_code,

## products:

id,
name,
price,
color,
url_slug(unique),
images:array
brand_id,
category_id,
stock_qty,
user_id,
description
status,
createdAt
updatedAt

## product_variants (color) need to study about

id,
name,
product_id
size(option),
color(option)
price,
stock_qty,

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
is_active,
user_id
createdAt
updatedAt

## categories:

id,
name,
url_slug(unique)
parent_category_id,
user_id,
description
status:(Active/Inactive)
createdAt
updatedAt

## wishlists:

id,
product_id,
user_id,

<!-- product_variant_id -->

createdAt,
updatedAt

## carts:

id,
product_id,
user_id,
product_variant_id (optional)
qty,
createdAt,
updatedAt

## brands:

id,
user_id,
name
status:(Active/Inactive),
createdAt,
updatedAt

## orders:

id,
user_id,
order_date,
tracking_no,
is_paid,
total_amount
is_shipped,
discount_amount,
net_amount,
shiping_amount,
tax,
payment_status(Paid/NotPaid/PertialPaid),
payment_type(Online/Offline)
payment_transaction_id,
status:(Processing/Pending/Completed/Failed),
createdAt
updatedAt

<!-- ## order_shipping_address

id,
order_id,
shipping_address_id,
full_address,
state,
city,
zip_code, -->

## orderItems:

id,
order_id,
price,

<!-- parchase_price, -->

total_amount,

<!-- discount_id, -->

product_id,
product_variant_id(optional)
qty,
color(optional)
size(optional)
createdAt
updatedAt

## reviews:

id,
product_id,
user_id,
rating,
comment,
status:(Reject/Approved),
createdAt
updatedAt

## payments:

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

## brands:

id,
name,
photo,
description
status:(Active/Inactive),,
user_id,
createdAt
updatedAt

## logs:

id,
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
product_variant_id,
message/descripiton,
createdAt
updatedAt
