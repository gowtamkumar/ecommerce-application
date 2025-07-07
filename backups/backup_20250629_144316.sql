--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: banners_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.banners_type_enum AS ENUM (
    'Slider',
    'Banner',
    'Slider Right',
    'Footer'
);


ALTER TYPE public.banners_type_enum OWNER TO admin;

--
-- Name: brands_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.brands_status_enum AS ENUM (
    'Active',
    'Inactive'
);


ALTER TYPE public.brands_status_enum OWNER TO admin;

--
-- Name: coupons_discount_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.coupons_discount_type_enum AS ENUM (
    'Percentage',
    'Fixed',
    'FreeShipping'
);


ALTER TYPE public.coupons_discount_type_enum OWNER TO admin;

--
-- Name: coupons_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.coupons_type_enum AS ENUM (
    'Order',
    'Product',
    'FreeShipping'
);


ALTER TYPE public.coupons_type_enum OWNER TO admin;

--
-- Name: discounts_discount_strategy_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.discounts_discount_strategy_enum AS ENUM (
    'Percentage',
    'Fixed',
    'FreeShipping',
    'Bogo',
    'freeGift'
);


ALTER TYPE public.discounts_discount_strategy_enum OWNER TO admin;

--
-- Name: discounts_promotion_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.discounts_promotion_type_enum AS ENUM (
    'Discount',
    'Offer',
    'FlashSale',
    'Seasonal'
);


ALTER TYPE public.discounts_promotion_type_enum OWNER TO admin;

--
-- Name: discounts_scope_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.discounts_scope_enum AS ENUM (
    'Global',
    'Products',
    'Product',
    'Category',
    'Brand'
);


ALTER TYPE public.discounts_scope_enum OWNER TO admin;

--
-- Name: discounts_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.discounts_status_enum AS ENUM (
    'Active',
    'Inactive'
);


ALTER TYPE public.discounts_status_enum OWNER TO admin;

--
-- Name: order_trackings_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.order_trackings_status_enum AS ENUM (
    'Order Placed',
    'Order is Being Processed',
    'Order Approved',
    'Order Ready to Ship',
    'Order Shipped',
    'Order Delivered',
    'Order Returned',
    'Order Canceled'
);


ALTER TYPE public.order_trackings_status_enum OWNER TO admin;

--
-- Name: orders_payment_method_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.orders_payment_method_enum AS ENUM (
    'Cash',
    'SSLCOMMERZ',
    'Stripe'
);


ALTER TYPE public.orders_payment_method_enum OWNER TO admin;

--
-- Name: orders_payment_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.orders_payment_status_enum AS ENUM (
    'Paid',
    'Not Paid',
    'Failed',
    'Canceled',
    'Partial Paid'
);


ALTER TYPE public.orders_payment_status_enum OWNER TO admin;

--
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'Processing',
    'Approved',
    'On Shipping',
    'Shipped',
    'Canceled',
    'Completed',
    'Pending',
    'Returned'
);


ALTER TYPE public.orders_status_enum OWNER TO admin;

--
-- Name: payments_payment_method_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.payments_payment_method_enum AS ENUM (
    'Cash',
    'SSLCOMMERZ',
    'Stripe'
);


ALTER TYPE public.payments_payment_method_enum OWNER TO admin;

--
-- Name: payments_payment_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.payments_payment_type_enum AS ENUM (
    'Debit',
    'Credit'
);


ALTER TYPE public.payments_payment_type_enum OWNER TO admin;

--
-- Name: products_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.products_status_enum AS ENUM (
    'Active',
    'Inactive'
);


ALTER TYPE public.products_status_enum OWNER TO admin;

--
-- Name: reviews_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.reviews_status_enum AS ENUM (
    'Rejected',
    'Approved',
    'Pending'
);


ALTER TYPE public.reviews_status_enum OWNER TO admin;

--
-- Name: shipping_addresses_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.shipping_addresses_type_enum AS ENUM (
    'Home',
    'Office'
);


ALTER TYPE public.shipping_addresses_type_enum OWNER TO admin;

--
-- Name: stock_adjusts_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.stock_adjusts_type_enum AS ENUM (
    'Add',
    'Subtract'
);


ALTER TYPE public.stock_adjusts_type_enum OWNER TO admin;

--
-- Name: taxs_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.taxs_status_enum AS ENUM (
    'Active',
    'Inactive'
);


ALTER TYPE public.taxs_status_enum OWNER TO admin;

--
-- Name: users_gender_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_gender_enum AS ENUM (
    'Male',
    'Female'
);


ALTER TYPE public.users_gender_enum OWNER TO admin;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_role_enum AS ENUM (
    'Admin',
    'User'
);


ALTER TYPE public.users_role_enum OWNER TO admin;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_status_enum AS ENUM (
    'Active',
    'Inactive',
    'Block'
);


ALTER TYPE public.users_status_enum OWNER TO admin;

--
-- Name: users_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.users_type_enum AS ENUM (
    'Customer',
    'Vendor',
    'Delivery Man',
    'Admin'
);


ALTER TYPE public.users_type_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applicable_brands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.applicable_brands (
    id integer NOT NULL,
    brand_id integer NOT NULL,
    discount_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applicable_brands OWNER TO admin;

--
-- Name: applicable_brands_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.applicable_brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicable_brands_id_seq OWNER TO admin;

--
-- Name: applicable_brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.applicable_brands_id_seq OWNED BY public.applicable_brands.id;


--
-- Name: applicable_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.applicable_categories (
    id integer NOT NULL,
    category_id integer NOT NULL,
    discount_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applicable_categories OWNER TO admin;

--
-- Name: applicable_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.applicable_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicable_categories_id_seq OWNER TO admin;

--
-- Name: applicable_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.applicable_categories_id_seq OWNED BY public.applicable_categories.id;


--
-- Name: applicable_products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.applicable_products (
    id integer NOT NULL,
    product_id integer NOT NULL,
    discount_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applicable_products OWNER TO admin;

--
-- Name: applicable_products_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.applicable_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicable_products_id_seq OWNER TO admin;

--
-- Name: applicable_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.applicable_products_id_seq OWNED BY public.applicable_products.id;


--
-- Name: applied_coupons; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.applied_coupons (
    id integer NOT NULL,
    coupon_id integer NOT NULL,
    order_id integer NOT NULL,
    discount_amount numeric(10,2) NOT NULL,
    user_id integer NOT NULL,
    applied_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applied_coupons OWNER TO admin;

--
-- Name: applied_coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.applied_coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applied_coupons_id_seq OWNER TO admin;

--
-- Name: applied_coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.applied_coupons_id_seq OWNED BY public.applied_coupons.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title character varying NOT NULL,
    type public.banners_type_enum DEFAULT 'Slider'::public.banners_type_enum NOT NULL,
    image character varying NOT NULL,
    url character varying,
    description character varying,
    active boolean DEFAULT true NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.banners OWNER TO admin;

--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banners_id_seq OWNER TO admin;

--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying,
    image character varying,
    description character varying,
    status public.brands_status_enum DEFAULT 'Active'::public.brands_status_enum NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brands OWNER TO admin;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO admin;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    product_id integer NOT NULL,
    product_variant_id integer NOT NULL,
    qty integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO admin;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO admin;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying,
    slug character varying NOT NULL,
    image character varying,
    level integer,
    description character varying,
    active boolean DEFAULT true NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    mpath character varying DEFAULT ''::character varying,
    "parentId" integer
);


ALTER TABLE public.categories OWNER TO admin;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO admin;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: colors; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.colors (
    id integer NOT NULL,
    name character varying NOT NULL,
    color character varying NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.colors OWNER TO admin;

--
-- Name: colors_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.colors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colors_id_seq OWNER TO admin;

--
-- Name: colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.colors_id_seq OWNED BY public.colors.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying,
    phone character varying NOT NULL,
    subject character varying NOT NULL,
    message character varying NOT NULL
);


ALTER TABLE public.contacts OWNER TO admin;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO admin;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: coupon_products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.coupon_products (
    id integer NOT NULL,
    product_id integer NOT NULL,
    coupon_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.coupon_products OWNER TO admin;

--
-- Name: coupon_products_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.coupon_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupon_products_id_seq OWNER TO admin;

--
-- Name: coupon_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.coupon_products_id_seq OWNED BY public.coupon_products.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    type public.coupons_type_enum NOT NULL,
    code character varying NOT NULL,
    discount_type public.coupons_discount_type_enum NOT NULL,
    value integer NOT NULL,
    start_date timestamp with time zone,
    expiry_date timestamp with time zone,
    min_order_amount numeric,
    min_cart_value numeric,
    max_user integer,
    max_discount_value integer,
    usage_count integer,
    usage_limit integer,
    usage_per_user integer,
    image character varying,
    active boolean DEFAULT true NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.coupons OWNER TO admin;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO admin;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: discounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.discounts (
    id integer NOT NULL,
    name character varying NOT NULL,
    key character varying(50),
    scope public.discounts_scope_enum NOT NULL,
    slug character varying,
    promotion_type public.discounts_promotion_type_enum NOT NULL,
    discount_strategy public.discounts_discount_strategy_enum NOT NULL,
    offer_details jsonb,
    value numeric(10,2),
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    priority integer DEFAULT 1 NOT NULL,
    stackable boolean DEFAULT false NOT NULL,
    status public.discounts_status_enum DEFAULT 'Active'::public.discounts_status_enum NOT NULL,
    image character varying,
    description character varying,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.discounts OWNER TO admin;

--
-- Name: discounts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.discounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discounts_id_seq OWNER TO admin;

--
-- Name: discounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.discounts_id_seq OWNED BY public.discounts.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.districts (
    id integer NOT NULL,
    division_id integer,
    name character varying NOT NULL,
    bn_name character varying NOT NULL,
    lat character varying NOT NULL,
    lon character varying NOT NULL,
    url character varying
);


ALTER TABLE public.districts OWNER TO admin;

--
-- Name: districts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.districts_id_seq OWNER TO admin;

--
-- Name: districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.districts_id_seq OWNED BY public.districts.id;


--
-- Name: divisions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.divisions (
    id integer NOT NULL,
    name character varying NOT NULL,
    bn_name character varying NOT NULL,
    url character varying NOT NULL
);


ALTER TABLE public.divisions OWNER TO admin;

--
-- Name: divisions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.divisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.divisions_id_seq OWNER TO admin;

--
-- Name: divisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.divisions_id_seq OWNED BY public.divisions.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.files (
    id integer NOT NULL,
    fieldname character varying,
    originalname character varying,
    encoding character varying,
    mimetype character varying,
    destination character varying,
    filename character varying,
    path character varying,
    size integer
);


ALTER TABLE public.files OWNER TO admin;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO admin;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leads OWNER TO admin;

--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO admin;

--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    name character varying NOT NULL,
    items text,
    footer_menu boolean DEFAULT false NOT NULL,
    top_bar_menu boolean DEFAULT false NOT NULL,
    main_menu boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menus OWNER TO admin;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO admin;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title character varying NOT NULL,
    type character varying NOT NULL,
    message character varying NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    user_id integer NOT NULL,
    order_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO admin;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO admin;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    purchase_price numeric(10,2) NOT NULL,
    qty integer NOT NULL,
    tax_amount numeric(10,2),
    discounted_unit_pice numeric(10,2),
    total_discounted_price numeric(10,2),
    discount_amount_per_unit numeric(10,2),
    total_discount_amount numeric(10,2),
    sub_total numeric(10,2) NOT NULL,
    product_id integer NOT NULL,
    product_variant_id integer NOT NULL
);


ALTER TABLE public.order_items OWNER TO admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO admin;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: order_trackings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.order_trackings (
    id integer NOT NULL,
    order_id integer NOT NULL,
    user_id integer,
    location character varying,
    status public.order_trackings_status_enum DEFAULT 'Order Placed'::public.order_trackings_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_trackings OWNER TO admin;

--
-- Name: order_trackings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.order_trackings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_trackings_id_seq OWNER TO admin;

--
-- Name: order_trackings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.order_trackings_id_seq OWNED BY public.order_trackings.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    tracking_no character varying NOT NULL,
    total_qty integer NOT NULL,
    sub_total numeric(15,2) NOT NULL,
    total_items_discount numeric(10,2),
    coupon_discount numeric(10,2),
    total_tax numeric(15,2),
    shipping_charge numeric(15,2) NOT NULL,
    grand_total numeric(10,2) NOT NULL,
    shipping_address_id integer NOT NULL,
    coupon_id integer,
    cancel_resson character varying,
    payment_status public.orders_payment_status_enum NOT NULL,
    payment_method public.orders_payment_method_enum NOT NULL,
    status public.orders_status_enum DEFAULT 'Pending'::public.orders_status_enum NOT NULL,
    tran_id character varying,
    user_id integer NOT NULL,
    delivery_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO admin;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO admin;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    payment_date timestamp with time zone NOT NULL,
    payment_type public.payments_payment_type_enum NOT NULL,
    payment_method public.payments_payment_method_enum NOT NULL,
    amount numeric(15,2) NOT NULL,
    user_id integer,
    tran_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO admin;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO admin;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    category_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.product_categories OWNER TO admin;

--
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_categories_id_seq OWNER TO admin;

--
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    sku character varying,
    unit_price numeric(15,2) NOT NULL,
    purchase_price numeric(15,2) NOT NULL,
    product_id integer NOT NULL,
    size_id integer,
    color_id integer,
    material character varying,
    image character varying,
    "default" boolean DEFAULT false NOT NULL,
    stock_qty integer NOT NULL
);


ALTER TABLE public.product_variants OWNER TO admin;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_id_seq OWNER TO admin;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    variant boolean DEFAULT false NOT NULL,
    is_returnable boolean DEFAULT true NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    description character varying NOT NULL,
    short_description character varying NOT NULL,
    tax_id integer NOT NULL,
    discount_id integer,
    enable_review boolean DEFAULT true NOT NULL,
    limit_purchase_qty integer,
    alert_qty integer NOT NULL,
    status public.products_status_enum DEFAULT 'Active'::public.products_status_enum NOT NULL,
    brand_id integer,
    unit_id integer NOT NULL,
    tags text,
    thumbnail_image character varying,
    hover_image character varying,
    images text NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO admin;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    rating character varying NOT NULL,
    comment character varying,
    "like" integer,
    dis_like integer,
    status public.reviews_status_enum DEFAULT 'Pending'::public.reviews_status_enum NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reviews OWNER TO admin;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO admin;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    site_name character varying NOT NULL,
    image character varying,
    favicon character varying,
    address character varying,
    phone character varying,
    email character varying,
    "currencyId" integer,
    social_link text,
    seo text,
    email_config text,
    payment_account text,
    home_page text,
    about_page text,
    contact_page text,
    term_policy_page text,
    footer_option text,
    header_option text,
    help_support text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.settings OWNER TO admin;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO admin;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: shipping_addresses; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.shipping_addresses (
    id integer NOT NULL,
    type public.shipping_addresses_type_enum NOT NULL,
    name character varying NOT NULL,
    phone_no character varying NOT NULL,
    email character varying,
    alternative_phone_no character varying,
    country character varying NOT NULL,
    division_id integer,
    district_id integer,
    upazila_id integer,
    union_id integer,
    address character varying NOT NULL,
    user_id integer NOT NULL,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public.shipping_addresses OWNER TO admin;

--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.shipping_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_addresses_id_seq OWNER TO admin;

--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.shipping_addresses_id_seq OWNED BY public.shipping_addresses.id;


--
-- Name: shipping_charges; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.shipping_charges (
    id integer NOT NULL,
    division_id integer NOT NULL,
    shipping_amount numeric(15,2) NOT NULL,
    note character varying,
    user_id integer NOT NULL,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public.shipping_charges OWNER TO admin;

--
-- Name: shipping_charges_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.shipping_charges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_charges_id_seq OWNER TO admin;

--
-- Name: shipping_charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.shipping_charges_id_seq OWNED BY public.shipping_charges.id;


--
-- Name: sizes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sizes (
    id integer NOT NULL,
    name character varying NOT NULL,
    status boolean DEFAULT true NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.sizes OWNER TO admin;

--
-- Name: sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sizes_id_seq OWNER TO admin;

--
-- Name: sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.sizes_id_seq OWNED BY public.sizes.id;


--
-- Name: stock_adjusts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.stock_adjusts (
    id integer NOT NULL,
    product_id integer NOT NULL,
    type public.stock_adjusts_type_enum NOT NULL,
    product_variant_id integer NOT NULL,
    qty integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.stock_adjusts OWNER TO admin;

--
-- Name: stock_adjusts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.stock_adjusts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_adjusts_id_seq OWNER TO admin;

--
-- Name: stock_adjusts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.stock_adjusts_id_seq OWNED BY public.stock_adjusts.id;


--
-- Name: taxs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.taxs (
    id integer NOT NULL,
    name character varying NOT NULL,
    value integer NOT NULL,
    user_id integer NOT NULL,
    status public.taxs_status_enum DEFAULT 'Active'::public.taxs_status_enum NOT NULL
);


ALTER TABLE public.taxs OWNER TO admin;

--
-- Name: taxs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.taxs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taxs_id_seq OWNER TO admin;

--
-- Name: taxs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.taxs_id_seq OWNED BY public.taxs.id;


--
-- Name: unions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.unions (
    id integer NOT NULL,
    upazila_id integer,
    name character varying NOT NULL,
    bn_name character varying NOT NULL,
    url character varying
);


ALTER TABLE public.unions OWNER TO admin;

--
-- Name: unions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.unions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unions_id_seq OWNER TO admin;

--
-- Name: unions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.unions_id_seq OWNED BY public.unions.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.units (
    id integer NOT NULL,
    name character varying NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.units OWNER TO admin;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.units_id_seq OWNER TO admin;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: upazilas; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.upazilas (
    id integer NOT NULL,
    district_id integer,
    name character varying NOT NULL,
    bn_name character varying NOT NULL,
    url character varying
);


ALTER TABLE public.upazilas OWNER TO admin;

--
-- Name: upazilas_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.upazilas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upazilas_id_seq OWNER TO admin;

--
-- Name: upazilas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.upazilas_id_seq OWNED BY public.upazilas.id;


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_activities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "timestamp" character varying NOT NULL
);


ALTER TABLE public.user_activities OWNER TO admin;

--
-- Name: user_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_activities_id_seq OWNER TO admin;

--
-- Name: user_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_activities_id_seq OWNED BY public.user_activities.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    username character varying,
    password character varying,
    email character varying NOT NULL,
    type public.users_type_enum DEFAULT 'Customer'::public.users_type_enum NOT NULL,
    phone character varying,
    dob character varying,
    gender public.users_gender_enum,
    point character varying,
    address character varying,
    image character varying,
    role public.users_role_enum DEFAULT 'User'::public.users_role_enum NOT NULL,
    status public.users_status_enum DEFAULT 'Active'::public.users_status_enum NOT NULL,
    last_login timestamp without time zone,
    last_logout timestamp without time zone,
    ip_address character varying,
    divice_id character varying,
    reset_token character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wishlists OWNER TO admin;

--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlists_id_seq OWNER TO admin;

--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: applicable_brands id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_brands ALTER COLUMN id SET DEFAULT nextval('public.applicable_brands_id_seq'::regclass);


--
-- Name: applicable_categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_categories ALTER COLUMN id SET DEFAULT nextval('public.applicable_categories_id_seq'::regclass);


--
-- Name: applicable_products id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_products ALTER COLUMN id SET DEFAULT nextval('public.applicable_products_id_seq'::regclass);


--
-- Name: applied_coupons id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applied_coupons ALTER COLUMN id SET DEFAULT nextval('public.applied_coupons_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: colors id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.colors ALTER COLUMN id SET DEFAULT nextval('public.colors_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: coupon_products id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupon_products ALTER COLUMN id SET DEFAULT nextval('public.coupon_products_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: discounts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.discounts ALTER COLUMN id SET DEFAULT nextval('public.discounts_id_seq'::regclass);


--
-- Name: districts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.districts ALTER COLUMN id SET DEFAULT nextval('public.districts_id_seq'::regclass);


--
-- Name: divisions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.divisions ALTER COLUMN id SET DEFAULT nextval('public.divisions_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: order_trackings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_trackings ALTER COLUMN id SET DEFAULT nextval('public.order_trackings_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: product_categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: shipping_addresses id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses ALTER COLUMN id SET DEFAULT nextval('public.shipping_addresses_id_seq'::regclass);


--
-- Name: shipping_charges id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges ALTER COLUMN id SET DEFAULT nextval('public.shipping_charges_id_seq'::regclass);


--
-- Name: sizes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sizes ALTER COLUMN id SET DEFAULT nextval('public.sizes_id_seq'::regclass);


--
-- Name: stock_adjusts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_adjusts ALTER COLUMN id SET DEFAULT nextval('public.stock_adjusts_id_seq'::regclass);


--
-- Name: taxs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.taxs ALTER COLUMN id SET DEFAULT nextval('public.taxs_id_seq'::regclass);


--
-- Name: unions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.unions ALTER COLUMN id SET DEFAULT nextval('public.unions_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: upazilas id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.upazilas ALTER COLUMN id SET DEFAULT nextval('public.upazilas_id_seq'::regclass);


--
-- Name: user_activities id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_activities ALTER COLUMN id SET DEFAULT nextval('public.user_activities_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: applicable_brands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.applicable_brands (id, brand_id, discount_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: applicable_categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.applicable_categories (id, category_id, discount_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: applicable_products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.applicable_products (id, product_id, discount_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: applied_coupons; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.applied_coupons (id, coupon_id, order_id, discount_amount, user_id, applied_at) FROM stdin;
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.banners (id, title, type, image, url, description, active, user_id) FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.brands (id, name, slug, image, description, status, user_id, created_at, updated_at) FROM stdin;
1	Honda	honda	image-1750902782332.png	\N	Active	1	2025-06-26 01:53:09.52051	2025-06-26 01:53:09.52051
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.carts (id, product_id, product_variant_id, qty, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categories (id, name, slug, image, level, description, active, user_id, created_at, updated_at, mpath, "parentId") FROM stdin;
\.


--
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.colors (id, name, color, user_id) FROM stdin;
1	red	red	1
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.contacts (id, name, email, phone, subject, message) FROM stdin;
\.


--
-- Data for Name: coupon_products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.coupon_products (id, product_id, coupon_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.coupons (id, type, code, discount_type, value, start_date, expiry_date, min_order_amount, min_cart_value, max_user, max_discount_value, usage_count, usage_limit, usage_per_user, image, active, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.discounts (id, name, key, scope, slug, promotion_type, discount_strategy, offer_details, value, start_date, end_date, priority, stackable, status, image, description, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.districts (id, division_id, name, bn_name, lat, lon, url) FROM stdin;
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.divisions (id, name, bn_name, url) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.files (id, fieldname, originalname, encoding, mimetype, destination, filename, path, size) FROM stdin;
1	image	Honda.png	7bit	image/png	public/uploads	image-1750902782332.png	public/uploads/image-1750902782332.png	148600
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.leads (id, email, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.menus (id, name, items, footer_menu, top_bar_menu, main_menu, active, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notifications (id, title, type, message, is_read, user_id, order_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_items (id, order_id, unit_price, purchase_price, qty, tax_amount, discounted_unit_pice, total_discounted_price, discount_amount_per_unit, total_discount_amount, sub_total, product_id, product_variant_id) FROM stdin;
\.


--
-- Data for Name: order_trackings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_trackings (id, order_id, user_id, location, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.orders (id, tracking_no, total_qty, sub_total, total_items_discount, coupon_discount, total_tax, shipping_charge, grand_total, shipping_address_id, coupon_id, cancel_resson, payment_status, payment_method, status, tran_id, user_id, delivery_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.payments (id, order_id, payment_date, payment_type, payment_method, amount, user_id, tran_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_categories (id, category_id, product_id) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_variants (id, sku, unit_price, purchase_price, product_id, size_id, color_id, material, image, "default", stock_qty) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.products (id, name, slug, variant, is_returnable, featured, description, short_description, tax_id, discount_id, enable_review, limit_purchase_qty, alert_qty, status, brand_id, unit_id, tags, thumbnail_image, hover_image, images, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reviews (id, product_id, rating, comment, "like", dis_like, status, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.settings (id, site_name, image, favicon, address, phone, email, "currencyId", social_link, seo, email_config, payment_account, home_page, about_page, contact_page, term_policy_page, footer_option, header_option, help_support, updated_at) FROM stdin;
\.


--
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.shipping_addresses (id, type, name, phone_no, email, alternative_phone_no, country, division_id, district_id, upazila_id, union_id, address, user_id, status) FROM stdin;
\.


--
-- Data for Name: shipping_charges; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.shipping_charges (id, division_id, shipping_amount, note, user_id, status) FROM stdin;
\.


--
-- Data for Name: sizes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sizes (id, name, status, user_id) FROM stdin;
1	Lg	t	1
2	Sm	t	1
\.


--
-- Data for Name: stock_adjusts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.stock_adjusts (id, product_id, type, product_variant_id, qty, user_id) FROM stdin;
\.


--
-- Data for Name: taxs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.taxs (id, name, value, user_id, status) FROM stdin;
1	10%	10	1	Active
\.


--
-- Data for Name: unions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.unions (id, upazila_id, name, bn_name, url) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.units (id, name, user_id) FROM stdin;
1	kg	1
2	pieces	1
\.


--
-- Data for Name: upazilas; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.upazilas (id, district_id, name, bn_name, url) FROM stdin;
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_activities (id, user_id, "timestamp") FROM stdin;
1	1	2025-06-26T01:29:58.040+00:00
2	1	2025-06-26T01:30:48.296+00:00
3	1	2025-06-27T06:58:58.737+00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, name, username, password, email, type, phone, dob, gender, point, address, image, role, status, last_login, last_logout, ip_address, divice_id, reset_token, created_at, updated_at) FROM stdin;
1	gowtam kumar	gowtamkumar	$2a$10$KZkB1lyQePSqsXC.YzPd1Op7txHtdZ.NPTV85mF.cowLK289lv/Xq	gowtampaul0@gmail.com	Admin	\N	\N	\N	\N	\N	\N	Admin	Active	2025-06-27 06:58:58.722	\N	::ffff:172.20.0.5	\N	\N	2025-06-26 01:29:52.362724	2025-06-27 06:58:58.728013
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.wishlists (id, product_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: applicable_brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.applicable_brands_id_seq', 1, false);


--
-- Name: applicable_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.applicable_categories_id_seq', 1, false);


--
-- Name: applicable_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.applicable_products_id_seq', 1, false);


--
-- Name: applied_coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.applied_coupons_id_seq', 1, false);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.banners_id_seq', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.brands_id_seq', 1, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.colors_id_seq', 1, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.contacts_id_seq', 1, false);


--
-- Name: coupon_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.coupon_products_id_seq', 1, false);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: discounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.discounts_id_seq', 1, false);


--
-- Name: districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.districts_id_seq', 1, false);


--
-- Name: divisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.divisions_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.files_id_seq', 2, true);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.leads_id_seq', 1, false);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.menus_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: order_trackings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.order_trackings_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 1, false);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.shipping_addresses_id_seq', 1, false);


--
-- Name: shipping_charges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.shipping_charges_id_seq', 1, false);


--
-- Name: sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.sizes_id_seq', 2, true);


--
-- Name: stock_adjusts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.stock_adjusts_id_seq', 1, false);


--
-- Name: taxs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.taxs_id_seq', 1, true);


--
-- Name: unions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.unions_id_seq', 1, false);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.units_id_seq', 2, true);


--
-- Name: upazilas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.upazilas_id_seq', 1, false);


--
-- Name: user_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_activities_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: sizes PK_09ffc681886e25eb5ce3b319fab; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT "PK_09ffc681886e25eb5ce3b319fab" PRIMARY KEY (id);


--
-- Name: user_activities PK_1245d4d2cf04ba7743f2924d951; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT "PK_1245d4d2cf04ba7743f2924d951" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: reviews PK_231ae565c273ee700b283f15c1d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: product_variants PK_281e3f2c55652d6a22c0aa59fd7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY (id);


--
-- Name: colors PK_3a62edc12d29307872ab1777ced; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT "PK_3a62edc12d29307872ab1777ced" PRIMARY KEY (id);


--
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- Name: stock_adjusts PK_55537619b8f01206a8256c6bda7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_adjusts
    ADD CONSTRAINT "PK_55537619b8f01206a8256c6bda7" PRIMARY KEY (id);


--
-- Name: units PK_5a8f2f064919b587d93936cb223; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY (id);


--
-- Name: applied_coupons PK_622ef788ea19852beecf105cbf7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applied_coupons
    ADD CONSTRAINT "PK_622ef788ea19852beecf105cbf7" PRIMARY KEY (id);


--
-- Name: applicable_products PK_634d9907d610ea1b332d9a428a8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_products
    ADD CONSTRAINT "PK_634d9907d610ea1b332d9a428a8" PRIMARY KEY (id);


--
-- Name: taxs PK_638c67865702518fe536b6fe0b5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.taxs
    ADD CONSTRAINT "PK_638c67865702518fe536b6fe0b5" PRIMARY KEY (id);


--
-- Name: discounts PK_66c522004212dc814d6e2f14ecc; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: files PK_6c16b9093a142e0e7613b04a3d9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY (id);


--
-- Name: product_categories PK_7069dac60d88408eca56fdc9e0c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: applicable_brands PK_727b9e0dc511464d591c8e5eb2c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_brands
    ADD CONSTRAINT "PK_727b9e0dc511464d591c8e5eb2c" PRIMARY KEY (id);


--
-- Name: coupon_products PK_7890462e3f0e52ce4d550b4f450; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT "PK_7890462e3f0e52ce4d550b4f450" PRIMARY KEY (id);


--
-- Name: order_trackings PK_93a04602a708829cd28ad158495; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_trackings
    ADD CONSTRAINT "PK_93a04602a708829cd28ad158495" PRIMARY KEY (id);


--
-- Name: districts PK_972a72ff4e3bea5c7f43a2b98af; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY (id);


--
-- Name: unions PK_97b35789dd5101a3e05e4f4eced; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.unions
    ADD CONSTRAINT "PK_97b35789dd5101a3e05e4f4eced" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: upazilas PK_ab2d8d9c35677f393b9fc6d8ce7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.upazilas
    ADD CONSTRAINT "PK_ab2d8d9c35677f393b9fc6d8ce7" PRIMARY KEY (id);


--
-- Name: brands PK_b0c437120b624da1034a81fc561; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY (id);


--
-- Name: carts PK_b5f695a59f5ebb50af3c8160816; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id);


--
-- Name: contacts PK_b99cd40cfd66a99f1571f4f72e6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY (id);


--
-- Name: divisions PK_c1f864477b3fd0954564108ed96; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT "PK_c1f864477b3fd0954564108ed96" PRIMARY KEY (id);


--
-- Name: shipping_addresses PK_cced78984eddbbe24470f226692; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "PK_cced78984eddbbe24470f226692" PRIMARY KEY (id);


--
-- Name: leads PK_cd102ed7a9a4ca7d4d8bfeba406; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY (id);


--
-- Name: wishlists PK_d0a37f2848c5d268d315325f359; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY (id);


--
-- Name: shipping_charges PK_d1779603e8652656b27b3f1a53c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges
    ADD CONSTRAINT "PK_d1779603e8652656b27b3f1a53c" PRIMARY KEY (id);


--
-- Name: coupons PK_d7ea8864a0150183770f3e9a8cb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY (id);


--
-- Name: applicable_categories PK_e78d20342e0531532b75ec5a22c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_categories
    ADD CONSTRAINT "PK_e78d20342e0531532b75ec5a22c" PRIMARY KEY (id);


--
-- Name: banners PK_e9b186b959296fcb940790d31c3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY (id);


--
-- Name: brands UQ_96db6bbbaa6f23cad26871339b6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_a000cca60bcf04454e727699490; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE (phone);


--
-- Name: shipping_charges UQ_b0df04804589a263817bad3a398; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges
    ADD CONSTRAINT "UQ_b0df04804589a263817bad3a398" UNIQUE (division_id);


--
-- Name: leads UQ_b3eea7add0e16594dba102716c5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "UQ_b3eea7add0e16594dba102716c5" UNIQUE (email);


--
-- Name: coupons UQ_e025109230e82925843f2a14c48; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT "UQ_e025109230e82925843f2a14c48" UNIQUE (code);


--
-- Name: discounts UQ_f05a508aabd8bf3a398073b4ad1; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT "UQ_f05a508aabd8bf3a398073b4ad1" UNIQUE (key);


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: applicable_categories FK_02d53e156421918f336ec1ef2fc; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_categories
    ADD CONSTRAINT "FK_02d53e156421918f336ec1ef2fc" FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE CASCADE;


--
-- Name: applicable_products FK_09043769fe590be47dfb14e570c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_products
    ADD CONSTRAINT "FK_09043769fe590be47dfb14e570c" FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE CASCADE;


--
-- Name: products FK_0b97249dd9e17bbc604a5ba3d07; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_0b97249dd9e17bbc604a5ba3d07" FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: order_items FK_11836543386b9135a47d54cab70; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_11836543386b9135a47d54cab70" FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL;


--
-- Name: orders FK_141cb5f1928caf8b0e77cb8bd66; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_141cb5f1928caf8b0e77cb8bd66" FOREIGN KEY (delivery_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: order_items FK_145532db85752b29c57d2b7b1f1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: products FK_1530a6f15d3c79d1b70be98f2be; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: shipping_addresses FK_155ed026eb1df1e0a6e4ecf97d5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "FK_155ed026eb1df1e0a6e4ecf97d5" FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: products FK_176b502c5ebd6e72cafbd9d6f70; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: products FK_1b3cc8583760313fe1ec86baaa1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_1b3cc8583760313fe1ec86baaa1" FOREIGN KEY (discount_id) REFERENCES public.discounts(id);


--
-- Name: wishlists FK_2662acbb3868b1f0077fda61dd2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "FK_2662acbb3868b1f0077fda61dd2" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: applied_coupons FK_2a839e13d75261c6e4f1f7d3a5a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applied_coupons
    ADD CONSTRAINT "FK_2a839e13d75261c6e4f1f7d3a5a" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: products FK_2e8085cbdd7bbe100b2748ef0b1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_2e8085cbdd7bbe100b2748ef0b1" FOREIGN KEY (tax_id) REFERENCES public.taxs(id);


--
-- Name: carts FK_2ec1c94a977b940d85a4f498aea; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_trackings FK_3e58f77a1b9f5ad64ccf536d957; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_trackings
    ADD CONSTRAINT "FK_3e58f77a1b9f5ad64ccf536d957" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payments FK_427785468fb7d2733f59e7d7d39; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stock_adjusts FK_44f9446e0adc9d780452206db84; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stock_adjusts
    ADD CONSTRAINT "FK_44f9446e0adc9d780452206db84" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: coupon_products FK_4897e96fb4b70bd6ac1d4735bae; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT "FK_4897e96fb4b70bd6ac1d4735bae" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: applicable_products FK_5c93b40855d50fd014ad53c2bc0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_products
    ADD CONSTRAINT "FK_5c93b40855d50fd014ad53c2bc0" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: applicable_brands FK_6106b92eb5e77ee64accf1f1271; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_brands
    ADD CONSTRAINT "FK_6106b92eb5e77ee64accf1f1271" FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: product_variants FK_6343513e20e2deab45edfce1316; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: shipping_addresses FK_634680041e04bad04ff868ef27f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "FK_634680041e04bad04ff868ef27f" FOREIGN KEY (union_id) REFERENCES public.unions(id) ON DELETE CASCADE;


--
-- Name: orders FK_67b8be57fc38bda573d2a8513ec; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_67b8be57fc38bda573d2a8513ec" FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_addresses(id) ON DELETE CASCADE;


--
-- Name: reviews FK_728447781a30bc3fcfe5c2f1cdf; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: shipping_addresses FK_75ab21980cabc5be328df3e49cc; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "FK_75ab21980cabc5be328df3e49cc" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: carts FK_7d0e145ebd287c1565f15114a18; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_7d0e145ebd287c1565f15114a18" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: shipping_addresses FK_81341858fda986f445ba51c5177; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "FK_81341858fda986f445ba51c5177" FOREIGN KEY (upazila_id) REFERENCES public.upazilas(id) ON DELETE CASCADE;


--
-- Name: product_categories FK_8748b4a0e8de6d266f2bbc877f6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_variants FK_8b91b27dcad5b2bdb13977a176d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "FK_8b91b27dcad5b2bdb13977a176d" FOREIGN KEY (color_id) REFERENCES public.colors(id) ON DELETE SET NULL;


--
-- Name: product_categories FK_9148da8f26fc248e77a387e3112; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: order_items FK_9263386c35b6b242540f9493b00; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews FK_9482e9567d8dcc2bc615981ef44; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: categories FK_9a6f051e66982b5f0318981bcaa; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: notifications FK_9a8a82462cab47c73d25f49261f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: applicable_brands FK_9d8ee5aae9b75bf797ff43f9b1c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_brands
    ADD CONSTRAINT "FK_9d8ee5aae9b75bf797ff43f9b1c" FOREIGN KEY (discount_id) REFERENCES public.discounts(id) ON DELETE CASCADE;


--
-- Name: user_activities FK_a283f37e08edf5e37d38b375eec; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT "FK_a283f37e08edf5e37d38b375eec" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders FK_a922b820eeef29ac1c6800e826a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: carts FK_af240c59314c01f6cc8ae3bcaa8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_af240c59314c01f6cc8ae3bcaa8" FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: shipping_charges FK_b0df04804589a263817bad3a398; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges
    ADD CONSTRAINT "FK_b0df04804589a263817bad3a398" FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: districts FK_b0f53665358e2fee2fd290d115f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT "FK_b0f53665358e2fee2fd290d115f" FOREIGN KEY (division_id) REFERENCES public.divisions(id);


--
-- Name: payments FK_b2f7b823a21562eeca20e72b006; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: wishlists FK_b5e6331a1a7d61c25d7a25cab8f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT "FK_b5e6331a1a7d61c25d7a25cab8f" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: product_variants FK_bf3e96b7fc720a0ea3a81953373; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "FK_bf3e96b7fc720a0ea3a81953373" FOREIGN KEY (size_id) REFERENCES public.sizes(id) ON DELETE SET NULL;


--
-- Name: applicable_categories FK_d60f0baba770c008c856f5c7e17; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applicable_categories
    ADD CONSTRAINT "FK_d60f0baba770c008c856f5c7e17" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: upazilas FK_e04fa8599f5eea91baf26fbbfdb; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.upazilas
    ADD CONSTRAINT "FK_e04fa8599f5eea91baf26fbbfdb" FOREIGN KEY (district_id) REFERENCES public.districts(id);


--
-- Name: shipping_addresses FK_e4a66fac19b161897b3425b80db; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "FK_e4a66fac19b161897b3425b80db" FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: coupon_products FK_edd5b3b5e912ada7e6d28277e2c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coupon_products
    ADD CONSTRAINT "FK_edd5b3b5e912ada7e6d28277e2c" FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE CASCADE;


--
-- Name: applied_coupons FK_f8b3212295815e14c6fb72baf5b; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.applied_coupons
    ADD CONSTRAINT "FK_f8b3212295815e14c6fb72baf5b" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: unions FK_fe9cc1eb5a2e33a6c25f6b81985; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.unions
    ADD CONSTRAINT "FK_fe9cc1eb5a2e33a6c25f6b81985" FOREIGN KEY (upazila_id) REFERENCES public.upazilas(id);


--
-- PostgreSQL database dump complete
--

