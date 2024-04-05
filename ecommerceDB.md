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
type:[User, Vendor, Admin]
phone,
birthday,
address,
status(enum- active/inactive/block)
imgUrl,
createdAt
updatedAt

## shipping_address (user address)

id,
user_id,
full_address
state,
city,
zip_code,

## orders:

id,
user_id,
date,
tracking_number,
is_paid,
total_amount
is_shipped,
discount_amount,
net_amount,
shiping_amount,
tax,
payment_status(paid/not paid/pertial paid),
payment_type(online/ofline)
payment_transaction_id,
status,
createdAt
updatedAt

## order_shipping_address

id,
order_id,
shipping_address_id,
full_address,
state,
city,
zip_code,

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

## categories:

id,
name,
url_slug(unique)
parent_category_id,

<!-- user_id, -->

description
status(active/inactive)
createdAt
updatedAt

## reviews:

id,
product_id,
user_id,
rating,
review_text,
status[reject, approved],
createdAt
updatedAt

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
type:(percentage, fixed amount, free shipping).
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

## payments:

id,
order_id,
date,
payment_method,
amount,
user_id,
is_successfull,
transaction_id,
createdAt
updatedAt

## brands:

id,
name,
photo,
description
isActive,,
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
variant_id,
message/descripiton,
createdAt
updatedAt
