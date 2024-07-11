## users:(done)

id,
name,
username:,
password,
email,
type:[Customer, Vendor, Delivery Man, Admin]
phone,
dob,
point:number
status(Active/Inactive/Block)
img_url,
shippingAddresses:[from shipping_address table]
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

## shipping_address

id,
type:[Home/Ofice]
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

## products :(done)

id,
name:string,
url_slug(unique),
single_image,
images:array
shipping_cost:numeric,
brand_id,
unit_id,
limit_purchase_qty:number,
tax_id: number,
discount_id:number
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
type: ['Simple Product', "Varient Product"]

## product variants:(done)

id,
regular_price:numeric,
sale_price:numeric,(optional)
size_id,
colorId,
weight(kg):numeric
product_id
stock_qty:number,

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

## discounts:(done)

id,
type:discount/couponCode
coupon_code,
discount_type:(Percentage, FixedAmount, FreeShipping).
value,
start_date,
expiry_date
min_order_amount,
max_user,
usageCount,
status:(Active/Inactive)
user_id
createdAt
updatedAt

## categories:(done)

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

## wishlists:(done)

id,
product_id,
user_id,
createdAt,
updatedAt

## carts:(optional)

id,
product_id,
user_id,
qty,
createdAt,
updatedAt

## brands:(done)

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
deliveryId(assing addmin),
tracking_no,
shiping_amount,

<!-- is_paid, -->

order_total_amount

<!-- is_shipped, -->

discount_amount,
net_amount,
note,

<!-- order_items: array -->

shipping_address_id,
payment_status(Paid/NotPaid/PertialPaid),
payment_type(Online/Offline)
payment_transaction_id,
status:(Processing/Pending/Completed/Failed),
createdAt
updatedAt

## orderItems:

id,
order_id,
total_amount,
product_id,
price,
tax,
qty,

## order_status (optional)

id,
status:string,

  <!-- ["Order placed", "Order Approved", 'order Ready to Ship', "Order Handover to Courier", "Order Delivered"] -->

## order_traking

order_id,
location:string,
status_id,
createdAt
updatedAt

## tax:(done)

id,
type: (Percentage, FixedAmount)
value,
status:acitve/inactive

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
