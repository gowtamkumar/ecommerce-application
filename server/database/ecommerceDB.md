## users

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

## shipping_address

id,
type:[Home/Office]
name:
phone_no,
email,
alternative_phone_no,
country:string
user_id,
divisionId,
districtId
upazilaId,
unionId,
address,
status,

## shipping_charge

id,
district_id,
weight
shippingCharge,
note,
status,

## products

id!: number;
name!: string;
slug!: string;
variant?: boolean;
isReturnable?: boolean;
featured?: boolean;
description?: string;
shortDescription?: string;
taxId?: number;
discountId?: number;
enableReview?: boolean;
limitPurchaseQty?: number;
alertQty!: number;
status!: Status;
brandId?: number;
unitId!: number;
tags!: string[];
thumbnailImage!: string;
hoverImage!: string;
images!: string[];
userId!: number;
createdAt?: string;
updatedAt?: string;

## product variants

id!: number;
sku!: string;
unitPrice!: number;
purchasePrice!: number;
productId!: number;
sizeId?: number;
colorId?: number;
material!: string;
image!: string;
default?: boolean;
stockQty?: number;

## product_category

id,
category_id,
product_id

## size

id,
name,
status,
userId

## color

id,
name,
color,

## unit

id,
name,

## coupon

id,
type:['order', 'product', "FreeShipping"]'free_gift', 'bogo', 'cashback',
code,
discountType:(Percentage, Fixed, FreeShipping).
value,
image
start_date,
expiry_Date
min_order_amount,
minimum_cart_value
max_discount_value
max_user,
usage_count,
usage_limit,
usage_per_user,
user_id,
active:boolean
createdAt
updatedAt

## coupon_products

id,
product_id,
coupon_id
createdAt
updatedAt

## applied_coupon

id,
user_id,
coupon_id,
order_id,
discount_amount,
applied_at:

## categories

id,
name,
slug,
user_id,
description
image;
status:(Active/Inactive)
tags:[""] (need to add)
createdAt
updatedAt

## wishlists

id,
product_id,
user_id,
createdAt,
updatedAt

## carts

id,
product_id,
product_variant_id,
user_id,
qty,
createdAt,
updatedAt

## brands

id,
name,
slug,
image,
description
status:(Active/Inactive),,
userId,
createdAt
updatedAt

## orders

id!: number;
trackingNo!: string;
totalQty!: number
subTotal!: number;
totalItemsDiscount!: number;
couponDiscount!: number;
totalTax!: number;
shippingCharge?: number;
grandTotal!: number;
shippingAddressId?: number;
couponId?: number;
cancelResson!: string;
paymentStatus!: enum;
paymentMethod!: enum;
status!: enum;
tranId?: string;
userId?: number;
deliveryId?: number;
createdAt?: string;
updatedAt?: string;

## order_items

id!: number;
orderId!: number;
unitPrice!: string;
purchasePrice!: string;
qty!: number;
taxAmount!: string;
discountedUnitPrice!: string;
totalDiscountedPrice!: string;
discountAmountPerUnit!: string;
totalDiscountAmount!: string;
subTotal!: string; //need to remove nullable
productId!: number;
productVariantId!: number;

## order_status

id,
status:string,

## order_tracking

id!: number;
orderId!: number;
userId!: number;
location!: string;
status!: emum;
createdAt?: string;
updatedAt?: string;

## tax

id,
name
value,
status:boolean

## reviews

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

## payments

id!: number;
orderId!: number;
paymentDate!: string;
paymentType!: enum;
paymentMethod!: enum;
amount!: number;
userId!: number;
tranId!: string;
createdAt?: string;
updatedAt?: string;

## logs
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
id!: number;
siteName!: string;
image!: string;
favicon!: string;
address!: string;
phone!: string;
email!: string;
currencyId!: number;
socialLink!: string;
seo!: string;
emailConfig!: string;
paymentAccount!: string;
homePage!: string;
aboutPage!: string;
contactPage!: string;
termPolicyPage!: string;
footerOption!: string;
headerOption!: string;
helpSupport!: string;
updatedAt?: string;

## banner

title,
type:["Slider", "Middle", 'Left', 'Right', 'Footer'],
image,
description,
url,
status: boolean,

## leads

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

## menu
id!: number;
name!: string;
items!: string;
footerMenu!: boolean;
topBarMenu!: boolean;
mainMenu!: boolean;
active!: boolean;
userId!: number;
createdAt?: string;
updatedAt?: string;

# notification

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

## contacts

name,
email,
phone,
subject,
message

## coupons // offer

id!: number;
type!: CouponType;
code!: string;
discountType!: DiscountType;
value!: number;
startDate!: string;
expiryDate!: string;
minOrderAmount!: number;
mincartValue!: number;
maxUser!: number;
maxDiscountValue!: number;
usageCount!: number;
usageLimit!: number;
usagePerUser!: number;
image!: string;
active!: boolean;
userId?: number;
createdAt?: string;
updatedAt?: string;

## coupon_products

id!: number;
productId!: number;
couponId?: number;
createdAt?: string;
updatedAt?: string;

## applied_coupons

id!: number;
couponId!: number;
orderId!: number;
discountAmount!: string;
userId!: number;
appliedAt?: string;

## discount

id!: number;
name!: string;
key!: string;
scope!: enum;
slug!: string;
promotionType!: enum;
discountStrategy!: enum;
offerDetails!: object;
value!: number;
startDate!: string;
endDate!: string;
priority!: number; // Higher number = Higher priority for applied first
stackable!: boolean; // If true, this discount can be combined with others
status!: Status;
image!: string;
description!: string;
userId?: number;
createdAt?: string;
updatedAt?: string;

## applicable_products 

id!: number;
productId!: number;
discountId?: number;
createdAt?: string;
updatedAt?: string;

## applicable_categories 

id!: number;
categoryId!: number;
discountId?: number;
createdAt?: string;
updatedAt?: string;

## applicable_brands 

id!: number;
brandId!: number;
discountId!: number;
createdAt?: string;
updatedAt?: string;

## stock_adjusts
id!: number;
productId!: number;
type!: enum;
productVariantId!: number;
qty!: number;
userId!: number;
