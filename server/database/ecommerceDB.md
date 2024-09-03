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
division_id,
shipping_amount,
note,
status,

## products :(done)

id,
name:string,
url_slug(unique),
single_image,
images:array

<!-- shipping_cost:numeric, -->

brand_id,
unit_id,
limit_purchase_qty:number,
tax_id: number,
discount_id:number
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

## purchase

id,
product_id:numeric,
variant_id:numeric,
price:numeric,(optional)
qty:number,

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
deliveryId(assing addmin),
tracking_no,
shiping_amount,

<!-- is_paid, -->

order_total_amount
orderTax,

<!-- is_shipped, -->

discount_amount,
net_amount,
note,

<!-- should be add delivery amount -->

<!-- order_items: array -->

shipping_address_id,
payment_status(Paid/NotPaid/PertialPaid),
payment_method(cash/ssecommer/strip)
payment_type(Online/Offline)
payment_transaction_id,
status: ["Processing","Approved","On Shipping","Shipped","Completed","Pending","Returned"],
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
status:acitve/inactive

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

## banner: ToDo

title,
type:["Slider", "Middle", 'Left', 'Right', 'Footer'],
image,
description,
url,
status: boolean,

## blog(done back end)

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

## Comments

id,
post_id,
user_id,
content TEXT NOT NULL,
status ENUM('approved', 'pending', 'spam') DEFAULT 'pending',
created_at,
updated_at,

## leads

id,
email,
created_at,
updated_at,
