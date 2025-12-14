--
-- PostgreSQL database dump
--

\restrict Wxwad785ceWoquj8jfiqLQVxaB3WbQUpZTMUWGEfXa49tzrWgn1WCJA7bDZCxam

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: audit_logs_action_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.audit_logs_action_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'FAILED_LOGIN'
);


ALTER TYPE public.audit_logs_action_enum OWNER TO admin;

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
-- Name: comments_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.comments_status_enum AS ENUM (
    'Rejected',
    'Approved',
    'Pending'
);


ALTER TYPE public.comments_status_enum OWNER TO admin;

--
-- Name: coupons_discount_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.coupons_discount_type_enum AS ENUM (
    'Percentage',
    'Fixed'
);


ALTER TYPE public.coupons_discount_type_enum OWNER TO admin;

--
-- Name: coupons_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.coupons_type_enum AS ENUM (
    'Order',
    'Product'
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
    'Pending',
    'Processing',
    'Shipped',
    'Canceled',
    'Delivered'
);


ALTER TYPE public.orders_status_enum OWNER TO admin;

--
-- Name: pages_content_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.pages_content_type_enum AS ENUM (
    'html',
    'markdown'
);


ALTER TYPE public.pages_content_type_enum OWNER TO admin;

--
-- Name: pages_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.pages_status_enum AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.pages_status_enum OWNER TO admin;

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
-- Name: posts_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.posts_status_enum AS ENUM (
    'Draft',
    'Published',
    'Archived'
);


ALTER TYPE public.posts_status_enum OWNER TO admin;

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
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying,
    "userName" character varying,
    "userEmail" character varying,
    "userRole" character varying,
    action public.audit_logs_action_enum NOT NULL,
    "resourceType" character varying NOT NULL,
    "resourceId" character varying,
    "resourceName" character varying,
    "oldValues" jsonb,
    "newValues" jsonb,
    metadata jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO admin;

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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    abandoned_email_sent boolean DEFAULT false NOT NULL
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
    "parentId" integer,
    is_featured boolean DEFAULT false NOT NULL
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
-- Name: comments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    post_id integer NOT NULL,
    content character varying,
    status public.comments_status_enum DEFAULT 'Pending'::public.comments_status_enum NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO admin;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO admin;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


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
-- Name: currencies; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.currencies (
    id integer NOT NULL,
    name character varying NOT NULL,
    symbol character varying NOT NULL,
    exchange_rate double precision DEFAULT '1'::double precision NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.currencies OWNER TO admin;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.currencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.currencies_id_seq OWNER TO admin;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.currencies_id_seq OWNED BY public.currencies.id;


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
    size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
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
-- Name: pages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    content text NOT NULL,
    content_type public.pages_content_type_enum DEFAULT 'markdown'::public.pages_content_type_enum NOT NULL,
    meta_description text,
    status public.pages_status_enum DEFAULT 'draft'::public.pages_status_enum NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pages OWNER TO admin;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pages_id_seq OWNER TO admin;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


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
-- Name: post_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.post_categories (
    id integer NOT NULL,
    post_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.post_categories OWNER TO admin;

--
-- Name: post_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.post_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_categories_id_seq OWNER TO admin;

--
-- Name: post_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.post_categories_id_seq OWNED BY public.post_categories.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    slug character varying NOT NULL,
    title character varying NOT NULL,
    image character varying NOT NULL,
    tags text,
    content character varying NOT NULL,
    user_id integer NOT NULL,
    status public.posts_status_enum DEFAULT 'Draft'::public.posts_status_enum NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO admin;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO admin;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_new_arrival boolean DEFAULT false NOT NULL
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    order_free_shipping_amount numeric(10,2),
    whats_app_widget text,
    description character varying,
    faq text
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
    district_id integer NOT NULL,
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    verification_token character varying,
    failed_login_attempts integer DEFAULT 0 NOT NULL,
    block_until timestamp without time zone
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
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


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
-- Name: currencies id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.currencies ALTER COLUMN id SET DEFAULT nextval('public.currencies_id_seq'::regclass);


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
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: post_categories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post_categories ALTER COLUMN id SET DEFAULT nextval('public.post_categories_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


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
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.audit_logs (id, "userId", "userName", "userEmail", "userRole", action, "resourceType", "resourceId", "resourceName", "oldValues", "newValues", metadata, "createdAt") FROM stdin;
5429f212-50e4-47f4-a004-396464a2c69d	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	hello test 	\N	{"name": "hello test ", "image": "image-1765475745065.jpg", "active": true, "fileList": [{"uid": "137.61798272053727", "url": "http://localhost:3900/uploads/image-1765475745065.jpg", "name": "photo 6588.456048921696", "status": "done", "fileName": "image-1765475745065.jpg"}], "isFeatured": true, "description": "dasf"}	{"ip": "::ffff:172.19.0.5", "path": "/", "method": "POST", "userAgent": "node"}	2025-12-11 17:55:46.172243
6fc79cc4-0cf1-425e-bdc3-aa7c49378b86	1	gowtam kumar	Unknown	Admin	DELETE	Unknown	4	hello test 	\N	\N	{"ip": "::ffff:172.19.0.5", "path": "/4", "method": "DELETE", "userAgent": "node"}	2025-12-11 17:57:49.4934
4efca277-3794-4da7-90ca-4d52d9fd437e	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	3	new testging category	\N	{"id": 3, "name": "new testging category", "image": "image-1765474918003.jpg", "active": true, "fileList": [{"uid": "431.4354152517599", "url": "http://localhost:3900/uploads/image-1765474918003.jpg", "name": "image", "status": "done", "fileName": "image-1765474918003.jpg"}], "isFeatured": false, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/3", "method": "PUT", "userAgent": "node"}	2025-12-11 18:01:51.609432
50fd5e93-9c79-4ade-aafe-c8d6972378bb	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	3	new testging	\N	{"id": 3, "name": "new testging", "image": "image-1765474918003.jpg", "active": true, "fileList": [{"uid": "255.2301659629498", "url": "http://localhost:3900/uploads/image-1765474918003.jpg", "name": "image", "status": "done", "fileName": "image-1765474918003.jpg"}], "isFeatured": false, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/3", "method": "PUT", "userAgent": "node"}	2025-12-11 18:04:57.687406
718d3bd0-90b7-4d34-b9c3-58d9398f2359	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	3	new testging gg	\N	{"id": 3, "name": "new testging gg", "image": "image-1765474918003.jpg", "active": true, "fileList": [{"uid": "785.9901849727007", "url": "http://localhost:3900/uploads/image-1765474918003.jpg", "name": "image", "status": "done", "fileName": "image-1765474918003.jpg"}], "isFeatured": false, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/3", "method": "PUT", "userAgent": "node"}	2025-12-11 18:07:19.859091
7d0aff0a-27d4-4f90-8122-48caef1f7793	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 1, "qty": 1, "name": "(FP-M-20) Smart Executive office chair China mesh /premium quality/1 years warranty/original China chair/ gaming chair /Furniture Plus", "slug": "(fp-m-20)-smart-executive-office-chair-china-mesh-/premium-quality/1-years-warranty/original-china-chair/-gaming-chair-/furniture-plus", "scope": null, "total": "1", "brandId": 1, "variant": false, "featured": false, "avgRating": null, "productId": 1, "salePrice": "220.00", "taxAmount": "20.00", "unitPrice": "200.00", "discountId": null, "finalPrice": "220.00", "hoverImage": "hoverImage-1765415833283.jpg", "discountSlug": null, "reviewsCount": null, "discountValue": null, "promotionType": null, "purchasePrice": "100.00", "discountAmount": null, "thumbnailImage": "thumbnailImage-1765415824708.jpg", "discountedPrice": "200.00", "discountStrategy": null, "productVariantId": 1, "shortDescription": "🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\\n\\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\\n\\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\\n\\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\\n\\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\\n\\n✅ প্রতিটি পণ্যে থাকছে:\\n\\n১ বছরের ওয়ারেন্টি\\n\\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\\n\\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\\n\\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\\n\\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা\\n\\nক্যাশ অন ডেলিভারি সুবিধা 🥰\\n\\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\\n\\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\\n\\nFurniture Plus আপনার পাশে আছি সবসময়"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-11 18:35:49.521213
ea36d1b6-1ee6-4364-ad0c-c8df2555aeda	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	testing banner	\N	{"url": "asdf", "type": "Slider", "image": "image-1765480188042.jpg", "title": "testing banner", "fileList": [{"uid": "257.2115731921042", "url": "http://localhost:3900/uploads/image-1765480188042.jpg", "name": "photo 5406.6968768433635", "status": "done", "fileName": "image-1765480188042.jpg"}], "description": "adsf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-11 19:09:54.65314
0d85fec4-cd48-47c7-8767-4b6352ca5c1b	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	second banner	\N	{"url": "d", "type": "Slider", "image": "image-1765480234563.jpg", "title": "second banner", "fileList": [{"uid": "278.9620415972551", "url": "http://localhost:3900/uploads/image-1765480234563.jpg", "name": "photo 1069.1601783363647", "status": "done", "fileName": "image-1765480234563.jpg"}], "description": "asdfasdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-11 19:10:35.863224
daff4bc2-8aae-415b-8586-e00aa5039568	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Fashin	\N	{"name": "Fashin", "image": "image-1765480785022.jpg", "active": true, "fileList": [{"uid": "461.3595688828733", "url": "http://localhost:3900/uploads/image-1765480785022.jpg", "name": "photo 9740.837669828106", "status": "done", "fileName": "image-1765480785022.jpg"}], "isFeatured": true, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-11 19:19:46.437326
1410568f-8f4c-4b63-804b-fc31fa2052ce	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	5	Fashion	\N	{"id": 5, "name": "Fashion", "image": "image-1765480785022.jpg", "active": true, "fileList": [{"uid": "435.813747503657", "url": "http://localhost:3900/uploads/image-1765480785022.jpg", "name": "image", "status": "done", "fileName": "image-1765480785022.jpg"}], "isFeatured": false, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/5", "method": "PUT", "userAgent": "node"}	2025-12-11 19:20:03.785034
3fd2b32d-9875-4a93-9bc3-95e1986d1890	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	high school	\N	{"name": "high school", "image": "image-1765501980012.png", "active": true, "fileList": [{"uid": "685.7758040140052", "url": "http://localhost:3900/uploads/image-1765501980012.png", "name": "photo 4924.495463238104", "status": "done", "fileName": "image-1765501980012.png"}], "isFeatured": true, "description": "high school  high school"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:13:04.007052
615bcc2f-8def-4959-a292-4eff04d8a207	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	6	high school	\N	{"id": 6, "name": "high school", "image": "image-1765501980012.png", "active": true, "fileList": [{"uid": "962.6469599575053", "url": "http://localhost:3900/uploads/image-1765501980012.png", "name": "image", "status": "done", "fileName": "image-1765501980012.png"}], "isFeatured": true, "description": "high school  high school"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/6", "method": "PUT", "userAgent": "node"}	2025-12-12 01:17:16.349738
e0c10811-7063-4860-a339-d893a54b0d45	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	5	Fashion	\N	{"id": 5, "name": "Fashion", "image": "image-1765480785022.jpg", "active": true, "fileList": [{"uid": "631.2572935863176", "url": "http://localhost:3900/uploads/image-1765480785022.jpg", "name": "image", "status": "done", "fileName": "image-1765480785022.jpg"}], "isFeatured": true, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/5", "method": "PUT", "userAgent": "node"}	2025-12-12 01:17:22.56655
f6d8a64c-448d-4c29-90d3-bc3256296aad	1	gowtam kumar	Unknown	Admin	DELETE	Unknown	10	\N	\N	\N	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts/10", "method": "DELETE", "userAgent": "node"}	2025-12-13 15:53:58.970482
545733d0-ef86-4634-abab-6d1dd94a92ff	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	warmers sterilizers	\N	{"name": "warmers sterilizers", "image": "image-1765502328220.png", "active": true, "fileList": [{"uid": "839.9100883862387", "url": "http://localhost:3900/uploads/image-1765502328220.png", "name": "photo 8090.4795940859385", "status": "done", "fileName": "image-1765502328220.png"}], "isFeatured": true, "description": "warmers sterilizers\\n"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:18:49.730638
06a5e25b-77b2-4466-8829-6a6a5ba76296	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	monoculars	\N	{"name": "monoculars", "image": "image-1765502425785.png", "active": true, "fileList": [{"uid": "935.3101101479588", "url": "http://localhost:3900/uploads/image-1765502425785.png", "name": "photo 9840.844202058513", "status": "done", "fileName": "image-1765502425785.png"}], "isFeatured": true, "description": "monoculars"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:20:27.832838
a179c157-35ec-4a9b-8b99-1ea955656ef8	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	projector accessories	\N	{"name": "projector accessories", "image": "image-1765502482603.png", "active": true, "fileList": [{"uid": "986.4324331355153", "url": "http://localhost:3900/uploads/image-1765502482603.png", "name": "photo 8010.948141592356", "status": "done", "fileName": "image-1765502482603.png"}], "isFeatured": true, "description": "projector accessories\\nprojector accessories"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:21:25.668378
95fbda46-a478-4d58-a7bb-bae3396ab069	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Kitchen Fittings	\N	{"name": "Kitchen Fittings", "image": "image-1765502539709.jpg", "active": true, "fileList": [{"uid": "864.4691847851208", "url": "http://localhost:3900/uploads/image-1765502539709.jpg", "name": "photo 5125.679265595731", "status": "done", "fileName": "image-1765502539709.jpg"}], "isFeatured": true, "description": "Kitchen Fittings"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:22:20.900155
d1f4d074-b55a-4802-b748-a74338d69509	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Kitchen Fittings	\N	{"name": "Kitchen Fittings", "image": "image-1765502893950.jpg", "active": true, "fileList": [{"uid": "641.5952807691062", "url": "http://localhost:3900/uploads/image-1765502893950.jpg", "name": "photo 7141.22075421701", "status": "done", "fileName": "image-1765502893950.jpg"}], "isFeatured": true, "description": "Kitchen Fittings\\nKitchen Fittings"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories", "method": "POST", "userAgent": "node"}	2025-12-12 01:28:15.867556
9aeee85c-96fa-43bf-9432-65c6a74b1abe	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	3	New Category	\N	{"id": 3, "name": "New Category", "image": "image-1765474918003.jpg", "active": true, "fileList": [{"uid": "174.35720483905436", "url": "http://localhost:3900/uploads/image-1765474918003.jpg", "name": "image", "status": "done", "fileName": "image-1765474918003.jpg"}], "isFeatured": false, "description": "asdf"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/3", "method": "PUT", "userAgent": "node"}	2025-12-12 01:29:19.554301
369fe6f2-08a9-4904-a93f-9ccf9829c0c0	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Comforter | King Size Winter Comforter (86" x 84") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print	\N	{"name": "Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print", "slug": "comforter-|-king-size-winter-comforter-(86\\"-x-84\\")-|-lightweight-&-cozy-with-poly-filler-[micro-fiber-padding]-|-ash-blue-and-white-floral-print", "tags": ["new tag", " new product"], "taxId": 1, "images": ["images-1765503096896.jpg"], "status": "Active", "unitId": 2, "brandId": 1, "alertQty": 10, "featured": true, "stockQty": 1000, "unitPrice": 300, "hoverImage": "hoverImage-1765503092000.png", "description": "\\"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n- Material: Cotton\\n- Poly Filler Inside\\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\\n- Package: Comes with Plastic Packed Box.\\n- Machine Washable\\"\\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n\\n\\n\\nQuality Material:\\n\\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\\n\\n\\nUnique Design:\\n\\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\\n\\n\\nPerfect Size:\\n\\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\\n\\n\\nColor may be slightly differ for Photo shoot or your computer resolution.\\n\\nSpecifications of Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain", "enableReview": true, "purchasePrice": 200, "thumbnailImage": "thumbnailImage-1765503085981.jpg", "productVariants": [{"stockQty": 1000, "unitPrice": 300, "purchasePrice": 200}], "limitPurchaseQty": 10, "shortDescription": "\\"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n- Material: Cotton\\n- Poly Filler Inside\\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\\n- Package: Comes with Plastic Packed Box.\\n- Machine Washable\\"\\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n\\n\\n\\nQuality Material:\\n\\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\\n\\n\\nUnique Design:\\n\\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\\n\\n\\nPerfect Size:\\n\\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\\n\\n\\nColor may be slightly differ for Photo shoot or your computer resolution.\\n\\nSpecifications of Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain", "productCategories": [7, 1, 6, 5]}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/products", "method": "POST", "userAgent": "node"}	2025-12-12 01:31:40.639925
61d35c8d-e49f-4742-b1e4-8f1e9157b31a	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"note": "sdafasdf", "districtId": 20, "shippingCharge": 100}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/shipping-charges", "method": "POST", "userAgent": "node"}	2025-12-12 01:34:57.194892
18f9e07a-77c5-4b24-899d-d556690fca31	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 2, "qty": 1, "name": "Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print", "slug": "comforter-|-king-size-winter-comforter-(86\\"-x-84\\")-|-lightweight-&-cozy-with-poly-filler-[micro-fiber-padding]-|-ash-blue-and-white-floral-print", "scope": null, "total": "5", "brandId": 1, "variant": false, "featured": true, "avgRating": null, "productId": 2, "salePrice": "330.00", "taxAmount": "30.00", "unitPrice": "300.00", "discountId": null, "finalPrice": "330.00", "hoverImage": "hoverImage-1765503092000.png", "discountSlug": null, "reviewsCount": null, "discountValue": null, "promotionType": null, "purchasePrice": "200.00", "discountAmount": null, "thumbnailImage": "thumbnailImage-1765503085981.jpg", "discountedPrice": "300.00", "discountStrategy": null, "productVariantId": 2, "shortDescription": "\\"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n- Material: Cotton\\n- Poly Filler Inside\\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\\n- Package: Comes with Plastic Packed Box.\\n- Machine Washable\\"\\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n\\n\\n\\nQuality Material:\\n\\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\\n\\n\\nUnique Design:\\n\\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\\n\\n\\nPerfect Size:\\n\\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\\n\\n\\nColor may be slightly differ for Photo shoot or your computer resolution.\\n\\nSpecifications of Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-12 01:47:28.780132
0eb0ee92-5f5d-4f43-900c-fda4d244a373	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"type": "Add", "productId": 2, "productVariants": [{"id": 2, "qty": 100, "sku": null, "size": null, "color": null, "image": null, "sizeId": null, "colorId": null, "default": false, "material": null, "stockQty": 1000, "productId": 2, "unitPrice": "300.00", "purchasePrice": "200.00"}]}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/stock-adjusts", "method": "POST", "userAgent": "node"}	2025-12-12 02:01:57.347312
9b2299a5-6338-47ee-a221-a19353abee84	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"type": "Add", "productId": 2, "productVariants": [{"id": 2, "qty": 10, "sku": null, "size": null, "color": null, "image": null, "sizeId": null, "colorId": null, "default": false, "material": null, "stockQty": 1100, "productId": 2, "unitPrice": "300.00", "purchasePrice": "200.00"}]}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/stock-adjusts", "method": "POST", "userAgent": "node"}	2025-12-12 02:02:49.686428
5fe7e83f-bfb9-44a4-995b-e93b350ef399	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"type": "Add", "productId": 2, "productVariants": [{"id": 2, "qty": 10, "sku": null, "size": null, "color": null, "image": null, "sizeId": null, "colorId": null, "default": false, "material": null, "stockQty": 1110, "productId": 2, "unitPrice": "300.00", "purchasePrice": "200.00"}]}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/stock-adjusts", "method": "POST", "userAgent": "node"}	2025-12-12 02:03:14.68038
7562a5c7-7f44-4dce-9578-dedf662b379d	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Winter sale	\N	{"name": "Winter sale", "image": "image-1765510885665.jpg", "scope": "Global", "value": 10, "status": "Active", "endDate": "2025-12-24T18:00:00.000Z", "fileList": [{"uid": "584.6683432281706", "url": "http://localhost:3900/uploads/image-1765510885665.jpg", "name": "photo 3867.539559320896", "status": "done", "fileName": "image-1765510885665.jpg"}], "startDate": "2025-12-10T18:00:00.000Z", "description": "asdfasdf dasfasdf", "promotionType": "Seasonal", "discountStrategy": "Percentage"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/discounts", "method": "POST", "userAgent": "node"}	2025-12-12 03:41:32.117791
3fdcbdc8-134a-4926-9568-5d5d57dba23e	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"code": "gowtamkumar", "type": "Order", "value": 10, "maxUser": "1000", "startDate": "2025-12-10T18:00:00.000Z", "expiryDate": "2025-12-18T18:00:00.000Z", "usageLimit": "10", "discountType": "Fixed", "mincartValue": "50", "usagePerUser": "2", "minOrderAmount": "50", "maxDiscountValue": "500"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/coupons", "method": "POST", "userAgent": "node"}	2025-12-12 03:50:48.596624
d5dd738d-0f4f-4b5f-bad7-f5e7f417ca95	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	main	\N	{"name": "main"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/menus", "method": "POST", "userAgent": "node"}	2025-12-12 04:08:18.45882
31f693e9-177a-4dc8-94d8-62f85c8d7af5	1	gowtam kumar	Unknown	Admin	DELETE	Unknown	1	\N	\N	\N	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/orders/1", "method": "DELETE", "userAgent": "node"}	2025-12-12 04:10:57.064406
00614e1c-4f20-486b-9c84-2aac64e4d590	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"couponId": null, "subTotal": "495.00", "totalQty": 2, "totalTax": "45.00", "grandTotal": "495.00", "orderItems": [{"qty": 1, "subTotal": "198.00", "productId": 1, "taxAmount": "18.00", "unitPrice": "200.00", "purchasePrice": "100.00", "productVariantId": 1, "discountedUnitPrice": "180.00", "totalDiscountAmount": "20.00", "totalDiscountedPrice": "180.00", "discountAmountPerUnit": "20.00"}, {"qty": 1, "subTotal": "297.00", "productId": 2, "taxAmount": "27.00", "unitPrice": "300.00", "purchasePrice": "200.00", "productVariantId": 2, "discountedUnitPrice": "270.00", "totalDiscountAmount": "30.00", "totalDiscountedPrice": "270.00", "discountAmountPerUnit": "30.00"}], "paymentMethod": "Cash", "couponDiscount": "0.00", "shippingCharge": "0.00", "shippingAddressId": 1, "totalItemsDiscount": "50.00"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/orders", "method": "POST", "userAgent": "node"}	2025-12-12 04:32:31.206724
e63a2281-1e0a-4f76-89c6-ee5983ab2ae3	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 1, "qty": 1, "name": "(FP-M-20) Smart Executive office chair China mesh /premium quality/1 years warranty/original China chair/ gaming chair /Furniture Plus", "slug": "(fp-m-20)-smart-executive-office-chair-china-mesh-/premium-quality/1-years-warranty/original-china-chair/-gaming-chair-/furniture-plus", "scope": "Global", "total": "5", "brandId": 1, "variant": false, "featured": false, "avgRating": null, "productId": 1, "salePrice": "218.00", "taxAmount": "18.00", "unitPrice": "200.00", "discountId": 1, "finalPrice": "198.00", "hoverImage": "hoverImage-1765415833283.jpg", "discountSlug": "winter-sale", "reviewsCount": null, "discountValue": "10.00", "promotionType": "Seasonal", "purchasePrice": "100.00", "discountAmount": "20.00", "thumbnailImage": "thumbnailImage-1765415824708.jpg", "discountedPrice": "180.00", "discountStrategy": "Percentage", "productVariantId": 1, "shortDescription": "🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\\n\\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\\n\\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\\n\\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\\n\\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\\n\\n✅ প্রতিটি পণ্যে থাকছে:\\n\\n১ বছরের ওয়ারেন্টি\\n\\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\\n\\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\\n\\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\\n\\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা\\n\\nক্যাশ অন ডেলিভারি সুবিধা 🥰\\n\\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\\n\\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\\n\\nFurniture Plus আপনার পাশে আছি সবসময়"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-12 04:37:33.46654
a9f7247f-bf81-4876-94a2-12115ec0f961	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"couponId": null, "subTotal": "198.00", "totalQty": 1, "totalTax": "18.00", "grandTotal": "198.00", "orderItems": [{"qty": 1, "subTotal": "198.00", "productId": 1, "taxAmount": "18.00", "unitPrice": "200.00", "purchasePrice": "100.00", "productVariantId": 1, "discountedUnitPrice": "180.00", "totalDiscountAmount": "20.00", "totalDiscountedPrice": "180.00", "discountAmountPerUnit": "20.00"}], "paymentMethod": "SSLCOMMERZ", "couponDiscount": "0.00", "shippingCharge": "0.00", "shippingAddressId": 1, "totalItemsDiscount": "20.00"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/orders", "method": "POST", "userAgent": "node"}	2025-12-12 04:37:48.704804
967920ce-48e9-4588-b218-05978b003281	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 1, "qty": 1, "name": "(FP-M-20) Smart Executive office chair China mesh /premium quality/1 years warranty/original China chair/ gaming chair /Furniture Plus", "slug": "(fp-m-20)-smart-executive-office-chair-china-mesh-/premium-quality/1-years-warranty/original-china-chair/-gaming-chair-/furniture-plus", "scope": "Global", "total": "5", "brandId": 1, "variant": false, "featured": false, "avgRating": null, "productId": 1, "salePrice": "218.00", "taxAmount": "18.00", "unitPrice": "200.00", "discountId": 1, "finalPrice": "198.00", "hoverImage": "hoverImage-1765415833283.jpg", "discountSlug": "winter-sale", "reviewsCount": null, "discountValue": "10.00", "promotionType": "Seasonal", "purchasePrice": "100.00", "discountAmount": "20.00", "thumbnailImage": "thumbnailImage-1765415824708.jpg", "discountedPrice": "180.00", "discountStrategy": "Percentage", "productVariantId": 1, "shortDescription": "🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\\n\\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\\n\\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\\n\\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\\n\\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\\n\\n✅ প্রতিটি পণ্যে থাকছে:\\n\\n১ বছরের ওয়ারেন্টি\\n\\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\\n\\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\\n\\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\\n\\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা\\n\\nক্যাশ অন ডেলিভারি সুবিধা 🥰\\n\\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\\n\\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\\n\\nFurniture Plus আপনার পাশে আছি সবসময়"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-12 04:40:38.118316
9a2d91d4-959e-4ab4-8553-3aea585de50d	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"couponId": null, "subTotal": "198.00", "totalQty": 1, "totalTax": "18.00", "grandTotal": "198.00", "orderItems": [{"qty": 1, "subTotal": "198.00", "productId": 1, "taxAmount": "18.00", "unitPrice": "200.00", "purchasePrice": "100.00", "productVariantId": 1, "discountedUnitPrice": "180.00", "totalDiscountAmount": "20.00", "totalDiscountedPrice": "180.00", "discountAmountPerUnit": "20.00"}], "paymentMethod": "SSLCOMMERZ", "couponDiscount": "0.00", "shippingCharge": "0.00", "shippingAddressId": 1, "totalItemsDiscount": "20.00"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/orders", "method": "POST", "userAgent": "node"}	2025-12-12 04:41:02.346701
2771b34c-8b0e-4ba4-b3ce-4b6e42d15bce	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 2, "qty": 1, "name": "Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print", "slug": "comforter-|-king-size-winter-comforter-(86\\"-x-84\\")-|-lightweight-&-cozy-with-poly-filler-[micro-fiber-padding]-|-ash-blue-and-white-floral-print", "scope": "Global", "total": "5", "brandId": 1, "variant": false, "featured": true, "avgRating": null, "productId": 2, "salePrice": "327.00", "taxAmount": "27.00", "unitPrice": "300.00", "discountId": 1, "finalPrice": "297.00", "hoverImage": "hoverImage-1765503092000.png", "discountSlug": "winter-sale", "reviewsCount": null, "discountValue": "10.00", "promotionType": "Seasonal", "purchasePrice": "200.00", "discountAmount": "30.00", "thumbnailImage": "thumbnailImage-1765503085981.jpg", "discountedPrice": "270.00", "discountStrategy": "Percentage", "productVariantId": 2, "shortDescription": "\\"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n- Material: Cotton\\n- Poly Filler Inside\\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\\n- Package: Comes with Plastic Packed Box.\\n- Machine Washable\\"\\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n\\n\\n\\nQuality Material:\\n\\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\\n\\n\\nUnique Design:\\n\\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\\n\\n\\nPerfect Size:\\n\\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\\n\\n\\nColor may be slightly differ for Photo shoot or your computer resolution.\\n\\nSpecifications of Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-12 06:43:30.035259
0c8b7fff-8e7b-4d71-84ca-d1b7357bd00d	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"productId": 2}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/wishlists", "method": "POST", "userAgent": "node"}	2025-12-12 08:32:51.896843
aac2f661-6a73-4231-a4dc-eff926ce4e18	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	New Offer	\N	{"url": "/", "type": "Banner", "image": "image-1765528504746.png", "title": "New Offer", "fileList": [{"uid": "432.45751803133805", "url": "http://localhost:3900/uploads/image-1765528504746.png", "name": "photo 6179.190420014552", "status": "done", "fileName": "image-1765528504746.png"}], "description": "dddde"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-12 08:35:06.603249
a37f3f84-c1da-46c8-926b-262c9ee917e7	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Sessnal offer today	\N	{"url": "/", "type": "Banner", "image": "image-1765528590808.jpg", "title": "Sessnal offer today", "fileList": [{"uid": "384.24865343898904", "url": "http://localhost:3900/uploads/image-1765528590808.jpg", "name": "photo 1059.0150453989954", "status": "done", "fileName": "image-1765528590808.jpg"}], "description": "eeeeee"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-12 08:36:32.11785
61743ae5-cbca-45bf-af9a-c092e791ba6c	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Weekly Offer	\N	{"url": "/", "type": "Banner", "image": "image-1765528756827.webp", "title": "Weekly Offer", "fileList": [{"uid": "639.0071997000382", "url": "http://localhost:3900/uploads/image-1765528756827.webp", "name": "photo 946.8935551810265", "status": "done", "fileName": "image-1765528756827.webp"}], "description": "Weekly Offer Weekly Offer"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-12 08:39:18.950605
f5facad1-af17-4d54-99ea-05d0dd3b526a	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	Footer Offer	\N	{"url": "/", "type": "Footer", "image": "image-1765528885403.webp", "title": "Footer Offer", "fileList": [{"uid": "69.78553318060577", "url": "http://localhost:3900/uploads/image-1765528885403.webp", "name": "photo 587.492168243472", "status": "done", "fileName": "image-1765528885403.webp"}], "description": "Footer Offer"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/banners", "method": "POST", "userAgent": "node"}	2025-12-12 08:41:28.85279
b2c06ff5-9f6d-47ba-99ae-dc57091fe953	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	1	Honda	\N	{"id": 1, "name": "Honda", "image": "image-1765475165379.jpg", "active": true, "fileList": [{"uid": "50.65175154500634", "url": "http://localhost:3900/uploads/image-1765475165379.jpg", "name": "image", "status": "done", "fileName": "image-1765475165379.jpg"}], "isFeatured": true, "description": null}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/1", "method": "PUT", "userAgent": "node"}	2025-12-13 12:38:02.409495
ab527862-3a30-4d83-9df0-034d72d692ab	1	gowtam kumar	Unknown	Admin	UPDATE	Unknown	6	high school	\N	{"id": 6, "name": "high school", "image": "image-1765501980012.png", "active": true, "fileList": [{"uid": "25.123199129641115", "url": "http://localhost:3900/uploads/image-1765501980012.png", "name": "image", "status": "done", "fileName": "image-1765501980012.png"}], "isFeatured": false, "description": "high school  high school"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/categories/6", "method": "PUT", "userAgent": "node"}	2025-12-13 12:53:15.781027
bdefcdbf-0a0c-4c57-8ff2-64efa18c61ae	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	React Labs: What We've Been Working On – June 2022	\N	{"slug": "react-labs:-what-we've-been-working-on-–-june-2022", "tags": ["dsaf"], "image": "image-1765631920959.jpg", "title": "React Labs: What We've Been Working On – June 2022", "status": "Published", "content": "React 18 was years in the making, and with it brought valuable lessons for the React team. Its release was the result of many years of research and exploring many paths. Some of those paths were successful; many more were dead-ends that led to new insights. One lesson we’ve learned is that it’s frustrating for the community to wait for new features without having insight into these paths that we’re exploring.\\n\\nWe typically have a number of projects being worked on at any time, ranging from the more experimental to the clearly defined. Looking ahead, we’d like to start regularly sharing more about what we’ve been working on with the community across these projects.\\n\\nTo set expectations, this is not a roadmap with clear timelines. Many of these projects are under active research and are difficult to put concrete ship dates on. They may possibly never even ship in their current iteration depending on what we learn. Instead, we want to share with you the problem spaces we’re actively thinking about, and what we’ve learned so far.", "fileList": [{"uid": "996.6910365334099", "url": "http://localhost:3900/uploads/image-1765631920959.jpg", "name": "photo 6900.968738935385", "status": "done", "fileName": "image-1765631920959.jpg"}], "postCategories": [2]}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/posts", "method": "POST", "userAgent": "node"}	2025-12-13 13:18:43.168315
ab397a46-d4bb-4e14-ab9a-f195969b55f5	\N	Unknown	Unknown	Unknown	CREATE	Unknown	\N	\N	\N	{"email": "helo@gamil.com"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/leads", "method": "POST", "userAgent": "node"}	2025-12-13 13:33:14.150127
edf2597a-5250-4140-85ad-bbf29424e8d2	1	gowtam kumar	Unknown	Admin	CREATE	Unknown	\N	\N	\N	{"id": 2, "qty": 1, "name": "Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print", "slug": "comforter-|-king-size-winter-comforter-(86\\"-x-84\\")-|-lightweight-&-cozy-with-poly-filler-[micro-fiber-padding]-|-ash-blue-and-white-floral-print", "scope": "Global", "total": "1", "brandId": 1, "variant": false, "featured": true, "avgRating": null, "productId": 2, "salePrice": "327.00", "taxAmount": "27.00", "unitPrice": "300.00", "discountId": 1, "finalPrice": "297.00", "hoverImage": "hoverImage-1765503092000.png", "discountSlug": "winter-sale", "isNewArrival": false, "reviewsCount": null, "discountValue": "10.00", "promotionType": "Seasonal", "purchasePrice": "200.00", "discountAmount": "30.00", "thumbnailImage": "thumbnailImage-1765503085981.jpg", "discountedPrice": "270.00", "discountStrategy": "Percentage", "productVariantId": 2, "shortDescription": "\\"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n- Material: Cotton\\n- Poly Filler Inside\\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\\n- Package: Comes with Plastic Packed Box.\\n- Machine Washable\\"\\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\\n\\n\\n\\nQuality Material:\\n\\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\\n\\n\\nUnique Design:\\n\\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\\n\\n\\nPerfect Size:\\n\\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\\n\\n\\nColor may be slightly differ for Photo shoot or your computer resolution.\\n\\nSpecifications of Comforter | King Size Winter Comforter (86\\" x 84\\") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain"}	{"ip": "::ffff:172.19.0.5", "path": "/api/v1/carts", "method": "POST", "userAgent": "node"}	2025-12-13 15:54:02.683211
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.banners (id, title, type, image, url, description, active, user_id) FROM stdin;
1	testing banner	Slider	image-1765480188042.jpg	asdf	adsf	t	1
2	second banner	Slider	image-1765480234563.jpg	d	asdfasdf	t	1
3	New Offer	Banner	image-1765528504746.png	/	dddde	t	1
4	Sessnal offer today	Banner	image-1765528590808.jpg	/	eeeeee	t	1
5	Weekly Offer	Banner	image-1765528756827.webp	/	Weekly Offer Weekly Offer	t	1
6	Footer Offer	Footer	image-1765528885403.webp	/	Footer Offer	t	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.brands (id, name, slug, image, description, status, user_id, created_at, updated_at) FROM stdin;
1	Honda	honda	image-1765480724497.jpg	\N	Active	1	2025-06-26 01:53:09.52051	2025-12-11 19:18:46.112887
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.carts (id, product_id, product_variant_id, qty, user_id, created_at, updated_at, abandoned_email_sent) FROM stdin;
43	2	2	1	1	2025-12-13 15:54:01.843029	2025-12-13 15:54:01.843029	f
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categories (id, name, slug, image, level, description, active, user_id, created_at, updated_at, mpath, "parentId", is_featured) FROM stdin;
2	Yahama	yahama	\N	1	\N	t	1	2025-08-08 04:05:10.266491	2025-08-08 04:05:10.266491	2.	\N	f
5	Fashion	fashin	image-1765480785022.jpg	1	asdf	t	1	2025-12-11 19:19:46.421698	2025-12-12 01:17:22.532523	5.	\N	t
7	warmers sterilizers	warmers-sterilizers	image-1765502328220.png	1	warmers sterilizers\n	t	1	2025-12-12 01:18:49.714467	2025-12-12 01:18:49.714467	7.	\N	t
8	monoculars	monoculars	image-1765502425785.png	1	monoculars	t	1	2025-12-12 01:20:27.827678	2025-12-12 01:20:27.827678	8.	\N	t
9	projector accessories	projector-accessories	image-1765502482603.png	1	projector accessories\nprojector accessories	t	1	2025-12-12 01:21:25.642479	2025-12-12 01:21:25.642479	9.	\N	t
10	Kitchen Fittings	kitchen-fittings	image-1765502539709.jpg	1	Kitchen Fittings	t	1	2025-12-12 01:22:20.874119	2025-12-12 01:22:20.874119	10.	\N	t
11	Kitchen Fittings	kitchen-fittings	image-1765502893950.jpg	1	Kitchen Fittings\nKitchen Fittings	t	1	2025-12-12 01:28:15.857391	2025-12-12 01:28:15.857391	11.	\N	t
3	New Category	test-category	image-1765474918003.jpg	1	asdf	t	1	2025-12-11 17:41:59.131506	2025-12-12 01:29:19.544406	3.	\N	f
1	Honda	honda	image-1765475165379.jpg	1	\N	t	1	2025-08-08 04:02:59.000581	2025-12-13 12:38:02.394426	1.	\N	t
6	high school	high-school	image-1765501980012.png	1	high school  high school	t	1	2025-12-12 01:13:03.997073	2025-12-13 12:53:15.774597	6.	\N	f
\.


--
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.colors (id, name, color, user_id) FROM stdin;
1	red	#52c41a	1
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.comments (id, post_id, content, status, user_id, created_at, updated_at) FROM stdin;
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
1	Order	gowtamkumar	Fixed	10	2025-12-10 18:00:00+00	2025-12-18 18:00:00+00	50	50	1000	500	\N	10	2	\N	t	1	2025-12-12 03:50:48.57776	2025-12-12 03:50:48.57776
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.currencies (id, name, symbol, exchange_rate, user_id) FROM stdin;
1	USD	$	122.17	1
2	BDT	৳	1	1
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.discounts (id, name, key, scope, slug, promotion_type, discount_strategy, offer_details, value, start_date, end_date, priority, stackable, status, image, description, user_id, created_at, updated_at) FROM stdin;
1	Winter sale	DISC-0.P7J6JQWB7KD	Global	winter-sale	Seasonal	Percentage	\N	10.00	2025-12-10 18:00:00+00	2025-12-24 18:00:00+00	1	f	Active	image-1765510885665.jpg	asdfasdf dasfasdf	1	2025-12-12 03:41:32.110711	2025-12-12 03:41:32.110711
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.districts (id, division_id, name, bn_name, lat, lon, url) FROM stdin;
1	1	Comilla	কুমিল্লা	23.4682747	91.1788135	\N
2	1	Feni	ফেনী	23.023231	91.3840844	\N
3	1	Brahmanbaria	ব্রাহ্মণবাড়িয়া	23.9570904	91.1119286	\N
4	1	Rangamati	রাঙ্গামাটি	22.65561018	92.17541121	\N
5	1	Noakhali	নোয়াখালী	22.869563	91.099398	\N
6	1	Chandpur	চাঁদপুর	23.2332585	90.6712912	\N
7	1	Lakshmipur	লক্ষ্মীপুর	22.942477	90.841184	\N
8	1	Chattogram	চট্টগ্রাম	22.335109	91.834073	\N
9	1	Coxsbazar	কক্সবাজার	21.44315751	91.97381741	\N
10	1	Khagrachhari	খাগড়াছড়ি	23.119285	91.984663	\N
11	1	Bandarban	বান্দরবান	22.1953275	92.2183773	\N
12	2	Sirajganj	সিরাজগঞ্জ	24.4533978	89.7006815	\N
13	2	Pabna	পাবনা	23.998524	89.233645	\N
14	2	Bogura	বগুড়া	24.8465228	89.377755	\N
15	2	Rajshahi	রাজশাহী	24.37230298	88.56307623	\N
16	2	Natore	নাটোর	24.420556	89.000282	\N
17	2	Joypurhat	জয়পুরহাট	25.09636876	89.04004280	\N
18	2	Chapainawabganj	চাঁপাইনবাবগঞ্জ	24.5965034	88.2775122	\N
19	2	Naogaon	নওগাঁ	24.83256191	88.92485205	\N
20	3	Jashore	যশোর	23.16643	89.2081126	\N
21	3	Satkhira	সাতক্ষীরা	22.7180905	89.0687033	\N
22	3	Meherpur	মেহেরপুর	23.762213	88.631821	\N
23	3	Narail	নড়াইল	23.172534	89.512672	\N
24	3	Chuadanga	চুয়াডাঙ্গা	23.6401961	88.841841	\N
25	3	Kushtia	কুষ্টিয়া	23.901258	89.120482	\N
26	3	Magura	মাগুরা	23.487337	89.419956	\N
27	3	Khulna	খুলনা	22.815774	89.568679	\N
28	3	Bagerhat	বাগেরহাট	22.651568	89.785938	\N
29	3	Jhenaidah	ঝিনাইদহ	23.5448176	89.1539213	\N
30	4	Jhalakathi	ঝালকাঠি	22.6422689	90.2003932	\N
31	4	Patuakhali	পটুয়াখালী	22.3596316	90.3298712	\N
32	4	Pirojpur	পিরোজপুর	22.5781398	89.9983909	\N
33	4	Barisal	বরিশাল	22.7004179	90.3731568	\N
34	4	Bhola	ভোলা	22.685923	90.648179	\N
35	4	Barguna	বরগুনা	22.159182	90.125581	\N
36	5	Sylhet	সিলেট	24.8897956	91.8697894	\N
37	5	Moulvibazar	মৌলভীবাজার	24.482934	91.777417	\N
38	5	Habiganj	হবিগঞ্জ	24.374945	91.41553	\N
39	5	Sunamganj	সুনামগঞ্জ	25.0658042	91.3950115	\N
40	6	Narsingdi	নরসিংদী	23.932233	90.71541	\N
41	6	Gazipur	গাজীপুর	24.0022858	90.4264283	\N
42	6	Shariatpur	শরীয়তপুর	23.2060195	90.3477725	\N
43	6	Narayanganj	নারায়ণগঞ্জ	23.63366	90.496482	\N
44	6	Tangail	টাঙ্গাইল	24.264145	89.918029	\N
45	6	Kishoreganj	কিশোরগঞ্জ	24.444937	90.776575	\N
46	6	Manikganj	মানিকগঞ্জ	23.8602262	90.0018293	\N
47	6	Dhaka	ঢাকা	23.7115253	90.4111451	\N
48	6	Munshiganj	মুন্সিগঞ্জ	23.5435742	90.5354327	\N
49	6	Rajbari	রাজবাড়ী	23.7574305	89.6444665	\N
50	6	Madaripur	মাদারীপুর	23.164102	90.1896805	\N
51	6	Gopalganj	গোপালগঞ্জ	23.0050857	89.8266059	\N
52	6	Faridpur	ফরিদপুর	23.6070822	89.8429406	\N
53	7	Panchagarh	পঞ্চগড়	26.3411	88.5541606	\N
54	7	Dinajpur	দিনাজপুর	25.6217061	88.6354504	\N
55	7	Lalmonirhat	লালমনিরহাট	25.9165451	89.4532409	\N
56	7	Nilphamari	নীলফামারী	25.931794	88.856006	\N
57	7	Gaibandha	গাইবান্ধা	25.328751	89.528088	\N
58	7	Thakurgaon	ঠাকুরগাঁও	26.0336945	88.4616834	\N
59	7	Rangpur	রংপুর	25.7558096	89.244462	\N
60	7	Kurigram	কুড়িগ্রাম	25.805445	89.636174	\N
61	8	Sherpur	শেরপুর	25.0204933	90.0152966	\N
62	8	Mymensingh	ময়মনসিংহ	24.7465670	90.4072093	\N
63	8	Jamalpur	জামালপুর	24.937533	89.937775	\N
64	8	Netrokona	নেত্রকোণা	24.870955	90.727887	\N
65	1	Comilla	কুমিল্লা	23.4682747	91.1788135	\N
66	1	Feni	ফেনী	23.023231	91.3840844	\N
67	1	Brahmanbaria	ব্রাহ্মণবাড়িয়া	23.9570904	91.1119286	\N
68	1	Rangamati	রাঙ্গামাটি	22.65561018	92.17541121	\N
69	1	Noakhali	নোয়াখালী	22.869563	91.099398	\N
70	1	Chandpur	চাঁদপুর	23.2332585	90.6712912	\N
71	1	Lakshmipur	লক্ষ্মীপুর	22.942477	90.841184	\N
72	1	Chattogram	চট্টগ্রাম	22.335109	91.834073	\N
73	1	Coxsbazar	কক্সবাজার	21.44315751	91.97381741	\N
74	1	Khagrachhari	খাগড়াছড়ি	23.119285	91.984663	\N
75	1	Bandarban	বান্দরবান	22.1953275	92.2183773	\N
76	2	Sirajganj	সিরাজগঞ্জ	24.4533978	89.7006815	\N
77	2	Pabna	পাবনা	23.998524	89.233645	\N
78	2	Bogura	বগুড়া	24.8465228	89.377755	\N
79	2	Rajshahi	রাজশাহী	24.37230298	88.56307623	\N
80	2	Natore	নাটোর	24.420556	89.000282	\N
81	2	Joypurhat	জয়পুরহাট	25.09636876	89.04004280	\N
82	2	Chapainawabganj	চাঁপাইনবাবগঞ্জ	24.5965034	88.2775122	\N
83	2	Naogaon	নওগাঁ	24.83256191	88.92485205	\N
84	3	Jashore	যশোর	23.16643	89.2081126	\N
85	3	Satkhira	সাতক্ষীরা	22.7180905	89.0687033	\N
86	3	Meherpur	মেহেরপুর	23.762213	88.631821	\N
87	3	Narail	নড়াইল	23.172534	89.512672	\N
88	3	Chuadanga	চুয়াডাঙ্গা	23.6401961	88.841841	\N
89	3	Kushtia	কুষ্টিয়া	23.901258	89.120482	\N
90	3	Magura	মাগুরা	23.487337	89.419956	\N
91	3	Khulna	খুলনা	22.815774	89.568679	\N
92	3	Bagerhat	বাগেরহাট	22.651568	89.785938	\N
93	3	Jhenaidah	ঝিনাইদহ	23.5448176	89.1539213	\N
94	4	Jhalakathi	ঝালকাঠি	22.6422689	90.2003932	\N
95	4	Patuakhali	পটুয়াখালী	22.3596316	90.3298712	\N
96	4	Pirojpur	পিরোজপুর	22.5781398	89.9983909	\N
97	4	Barisal	বরিশাল	22.7004179	90.3731568	\N
98	4	Bhola	ভোলা	22.685923	90.648179	\N
99	4	Barguna	বরগুনা	22.159182	90.125581	\N
100	5	Sylhet	সিলেট	24.8897956	91.8697894	\N
101	5	Moulvibazar	মৌলভীবাজার	24.482934	91.777417	\N
102	5	Habiganj	হবিগঞ্জ	24.374945	91.41553	\N
103	5	Sunamganj	সুনামগঞ্জ	25.0658042	91.3950115	\N
104	6	Narsingdi	নরসিংদী	23.932233	90.71541	\N
105	6	Gazipur	গাজীপুর	24.0022858	90.4264283	\N
106	6	Shariatpur	শরীয়তপুর	23.2060195	90.3477725	\N
107	6	Narayanganj	নারায়ণগঞ্জ	23.63366	90.496482	\N
108	6	Tangail	টাঙ্গাইল	24.264145	89.918029	\N
109	6	Kishoreganj	কিশোরগঞ্জ	24.444937	90.776575	\N
110	6	Manikganj	মানিকগঞ্জ	23.8602262	90.0018293	\N
111	6	Dhaka	ঢাকা	23.7115253	90.4111451	\N
112	6	Munshiganj	মুন্সিগঞ্জ	23.5435742	90.5354327	\N
113	6	Rajbari	রাজবাড়ী	23.7574305	89.6444665	\N
114	6	Madaripur	মাদারীপুর	23.164102	90.1896805	\N
115	6	Gopalganj	গোপালগঞ্জ	23.0050857	89.8266059	\N
116	6	Faridpur	ফরিদপুর	23.6070822	89.8429406	\N
117	7	Panchagarh	পঞ্চগড়	26.3411	88.5541606	\N
118	7	Dinajpur	দিনাজপুর	25.6217061	88.6354504	\N
119	7	Lalmonirhat	লালমনিরহাট	25.9165451	89.4532409	\N
120	7	Nilphamari	নীলফামারী	25.931794	88.856006	\N
121	7	Gaibandha	গাইবান্ধা	25.328751	89.528088	\N
122	7	Thakurgaon	ঠাকুরগাঁও	26.0336945	88.4616834	\N
123	7	Rangpur	রংপুর	25.7558096	89.244462	\N
124	7	Kurigram	কুড়িগ্রাম	25.805445	89.636174	\N
125	8	Sherpur	শেরপুর	25.0204933	90.0152966	\N
126	8	Mymensingh	ময়মনসিংহ	24.7465670	90.4072093	\N
127	8	Jamalpur	জামালপুর	24.937533	89.937775	\N
128	8	Netrokona	নেত্রকোণা	24.870955	90.727887	\N
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.divisions (id, name, bn_name, url) FROM stdin;
1	Chattagram	চট্টগ্রাম	www.chittagongdiv.gov.bd
2	Rajshahi	রাজশাহী	www.rajshahidiv.gov.bd
3	Khulna	খুলনা	www.khulnadiv.gov.bd
4	Barisal	বরিশাল	www.barisaldiv.gov.bd
5	Sylhet	সিলেট	www.sylhetdiv.gov.bd
6	Dhaka	ঢাকা	www.dhakadiv.gov.bd
7	Rangpur	রংপুর	www.rangpurdiv.gov.bd
8	Mymensingh	ময়মনসিংহ	www.mymensinghdiv.gov.bd
9	Chattagram	চট্টগ্রাম	www.chittagongdiv.gov.bd
10	Rajshahi	রাজশাহী	www.rajshahidiv.gov.bd
11	Khulna	খুলনা	www.khulnadiv.gov.bd
12	Barisal	বরিশাল	www.barisaldiv.gov.bd
13	Sylhet	সিলেট	www.sylhetdiv.gov.bd
14	Dhaka	ঢাকা	www.dhakadiv.gov.bd
15	Rangpur	রংপুর	www.rangpurdiv.gov.bd
16	Mymensingh	ময়মনসিংহ	www.mymensinghdiv.gov.bd
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.files (id, fieldname, originalname, encoding, mimetype, destination, filename, path, size, created_at, updated_at) FROM stdin;
9	thumbnailImage	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	thumbnailImage-1765415824708.jpg	public/uploads/thumbnailImage-1765415824708.jpg	72685	2025-12-11 01:17:04.711998+00	2025-12-11 01:17:04.711998+00
10	hoverImage	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	hoverImage-1765415833283.jpg	public/uploads/hoverImage-1765415833283.jpg	72685	2025-12-11 01:17:13.284911+00	2025-12-11 01:17:13.284911+00
11	images	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	images-1765415838674.jpg	public/uploads/images-1765415838674.jpg	72685	2025-12-11 01:17:18.677548+00	2025-12-11 01:17:18.677548+00
12	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765416420880.jpg	public/uploads/image-1765416420880.jpg	72685	2025-12-11 01:27:00.883087+00	2025-12-11 01:27:00.883087+00
14	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765418573917.jpg	public/uploads/image-1765418573917.jpg	7944	2025-12-11 02:02:53.923123+00	2025-12-11 02:02:53.923123+00
15	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765474918003.jpg	public/uploads/image-1765474918003.jpg	9971	2025-12-11 17:41:58.01119+00	2025-12-11 17:41:58.01119+00
16	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765475165379.jpg	public/uploads/image-1765475165379.jpg	72685	2025-12-11 17:46:05.382577+00	2025-12-11 17:46:05.382577+00
18	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765476549606.jpg	public/uploads/image-1765476549606.jpg	169609	2025-12-11 18:09:09.61115+00	2025-12-11 18:09:09.61115+00
19	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765476757190.jpg	public/uploads/image-1765476757190.jpg	169609	2025-12-11 18:12:37.19843+00	2025-12-11 18:12:37.19843+00
20	image	d5f7b2a799d63bc1e695fb6ae31dfdc693938e2f.jpg	7bit	image/jpeg	public/uploads	image-1765480188042.jpg	public/uploads/image-1765480188042.jpg	345621	2025-12-11 19:09:48.051746+00	2025-12-11 19:09:48.051746+00
21	image	e9164aecb80fea19ebf031d585b34289fe655cd3.jpg	7bit	image/jpeg	public/uploads	image-1765480234563.jpg	public/uploads/image-1765480234563.jpg	7466	2025-12-11 19:10:34.569678+00	2025-12-11 19:10:34.569678+00
22	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765480724497.jpg	public/uploads/image-1765480724497.jpg	42501	2025-12-11 19:18:44.499076+00	2025-12-11 19:18:44.499076+00
23	image	3448809f7e0a7134ca8f657f7b44fcc5.jpg	7bit	image/jpeg	public/uploads	image-1765480785022.jpg	public/uploads/image-1765480785022.jpg	82465	2025-12-11 19:19:45.029456+00	2025-12-11 19:19:45.029456+00
24	image	Screenshot from 2025-12-04 20-46-04.png	7bit	image/png	public/uploads	image-1765501980012.png	public/uploads/image-1765501980012.png	4667	2025-12-12 01:13:00.02507+00	2025-12-12 01:13:00.02507+00
25	image	d6363a621b143fdd4113ceff36cbcefe.jpg_200x200q80.png	7bit	image/png	public/uploads	image-1765502328220.png	public/uploads/image-1765502328220.png	75043	2025-12-12 01:18:48.233902+00	2025-12-12 01:18:48.233902+00
26	image	34624cd55a78074f89e9b1fb7515f158.png_200x200q80.png	7bit	image/png	public/uploads	image-1765502425785.png	public/uploads/image-1765502425785.png	69418	2025-12-12 01:20:25.793599+00	2025-12-12 01:20:25.793599+00
27	image	30aeeeb6ca71c2e311a225f02e613827.jpg_200x200q80.png	7bit	image/png	public/uploads	image-1765502482603.png	public/uploads/image-1765502482603.png	31383	2025-12-12 01:21:22.610336+00	2025-12-12 01:21:22.610336+00
28	image	c1ce4f7a627c4759fc7037fa6f7cb11d.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	image-1765502539709.jpg	public/uploads/image-1765502539709.jpg	48772	2025-12-12 01:22:19.715966+00	2025-12-12 01:22:19.715966+00
29	image	Sbf7298547a8a48539d367de5792f6ab2I.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	image-1765502893950.jpg	public/uploads/image-1765502893950.jpg	23683	2025-12-12 01:28:13.951316+00	2025-12-12 01:28:13.951316+00
30	thumbnailImage	c1ce4f7a627c4759fc7037fa6f7cb11d.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	thumbnailImage-1765503085981.jpg	public/uploads/thumbnailImage-1765503085981.jpg	5839	2025-12-12 01:31:25.983133+00	2025-12-12 01:31:25.983133+00
31	hoverImage	30aeeeb6ca71c2e311a225f02e613827.jpg_200x200q80.png	7bit	image/png	public/uploads	hoverImage-1765503092000.png	public/uploads/hoverImage-1765503092000.png	31383	2025-12-12 01:31:32.001108+00	2025-12-12 01:31:32.001108+00
32	images	Sbf7298547a8a48539d367de5792f6ab2I.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	images-1765503096896.jpg	public/uploads/images-1765503096896.jpg	4164	2025-12-12 01:31:36.897064+00	2025-12-12 01:31:36.897064+00
33	image	d5f7b2a799d63bc1e695fb6ae31dfdc693938e2f.jpg	7bit	image/jpeg	public/uploads	image-1765510885665.jpg	public/uploads/image-1765510885665.jpg	330073	2025-12-12 03:41:25.675128+00	2025-12-12 03:41:25.675128+00
35	image	banglargonji-payment-methods.png.png	7bit	image/png	public/uploads	image-1765512284558.png	public/uploads/image-1765512284558.png	11400	2025-12-12 04:04:44.564879+00	2025-12-12 04:04:44.564879+00
36	image	grocery-banner.png	7bit	image/png	public/uploads	image-1765528504746.png	public/uploads/image-1765528504746.png	319500	2025-12-12 08:35:04.755561+00	2025-12-12 08:35:04.755561+00
37	image	e9164aecb80fea19ebf031d585b34289fe655cd3.jpg	7bit	image/jpeg	public/uploads	image-1765528590808.jpg	public/uploads/image-1765528590808.jpg	7631	2025-12-12 08:36:30.814668+00	2025-12-12 08:36:30.814668+00
38	image	images-1745804129901.webp	7bit	image/webp	public/uploads	image-1765528756827.webp	public/uploads/image-1765528756827.webp	8340	2025-12-12 08:39:16.834161+00	2025-12-12 08:39:16.834161+00
39	image	images-1745804129901 (1).webp	7bit	image/webp	public/uploads	image-1765528885403.webp	public/uploads/image-1765528885403.webp	6784	2025-12-12 08:41:25.404735+00	2025-12-12 08:41:25.404735+00
40	image	c1ce4f7a627c4759fc7037fa6f7cb11d.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	image-1765631422756.jpg	public/uploads/image-1765631422756.jpg	5839	2025-12-13 13:10:22.76377+00	2025-12-13 13:10:22.76377+00
41	image	Sbf7298547a8a48539d367de5792f6ab2I.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	image-1765631549074.jpg	public/uploads/image-1765631549074.jpg	4164	2025-12-13 13:12:29.081315+00	2025-12-13 13:12:29.081315+00
42	image	Sbf7298547a8a48539d367de5792f6ab2I.jpg_200x200q80.jpg	7bit	image/jpeg	public/uploads	image-1765631920959.jpg	public/uploads/image-1765631920959.jpg	4164	2025-12-13 13:18:40.967509+00	2025-12-13 13:18:40.967509+00
43	favicon	banglargonji-payment-methods.png.png	7bit	image/png	public/uploads	favicon-1765639747311.png	public/uploads/favicon-1765639747311.png	1699	2025-12-13 15:29:07.314148+00	2025-12-13 15:29:07.314148+00
1	image	Honda.png	7bit	image/png	public/uploads	image-1750902782332.png	public/uploads/image-1750902782332.png	148600	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
3	image	Honda.png	7bit	image/png	public/uploads	image-1754624609987.png	public/uploads/image-1754624609987.png	80835	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
4	favicon	Honda.png	7bit	image/png	public/uploads	favicon-1754624633867.png	public/uploads/favicon-1754624633867.png	217079	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
5	image	Honda.png	7bit	image/png	public/uploads	image-1754625777853.png	public/uploads/image-1754625777853.png	163138	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
6	thumbnailImage	grocery-banner.png	7bit	image/png	public/uploads	thumbnailImage-1754626649285.png	public/uploads/thumbnailImage-1754626649285.png	222311	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
7	hoverImage	grocery-banner-2.jpg	7bit	image/jpeg	public/uploads	hoverImage-1754626695286.jpg	public/uploads/hoverImage-1754626695286.jpg	9172	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
8	images	product-single-img-1.jpg	7bit	image/jpeg	public/uploads	images-1754626713844.jpg	public/uploads/images-1754626713844.jpg	21855	2025-12-14 13:16:31.798365+00	2025-12-14 13:16:31.798365+00
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.leads (id, email, created_at, updated_at) FROM stdin;
1	gowtamkumar2019@gmail.com	2025-08-08 04:07:33.464106+00	2025-08-08 04:07:33.464106+00
2	helo@gamil.com	2025-12-13 13:33:14.143279+00	2025-12-13 13:33:14.143279+00
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.menus (id, name, items, footer_menu, top_bar_menu, main_menu, active, user_id, created_at, updated_at) FROM stdin;
1	main	\N	f	f	f	t	1	2025-12-12 04:08:18.453258	2025-12-12 04:08:18.453258
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notifications (id, title, type, message, is_read, user_id, order_id, created_at, updated_at) FROM stdin;
1	Order Placed	Order	Your order has been placed successfully. Order Tracking No: TRK-0000000001	f	1	1	2025-08-08 04:28:05.078824+00	2025-08-08 04:28:05.078824+00
2	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:16:21.035852+00	2025-12-11 16:16:21.035852+00
3	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:46:57.484943+00	2025-12-11 16:46:57.484943+00
4	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:54:07.147833+00	2025-12-11 16:54:07.147833+00
5	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:54:23.747207+00	2025-12-11 16:54:23.747207+00
6	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:54:49.995428+00	2025-12-11 16:54:49.995428+00
7	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:54:59.877604+00	2025-12-11 16:54:59.877604+00
8	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:55:07.797015+00	2025-12-11 16:55:07.797015+00
9	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:57:43.510179+00	2025-12-11 16:57:43.510179+00
10	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:57:55.179731+00	2025-12-11 16:57:55.179731+00
11	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:58:07.683123+00	2025-12-11 16:58:07.683123+00
12	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:58:46.860056+00	2025-12-11 16:58:46.860056+00
13	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 16:59:59.668439+00	2025-12-11 16:59:59.668439+00
14	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:00:58.585077+00	2025-12-11 17:00:58.585077+00
15	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:09:19.067661+00	2025-12-11 17:09:19.067661+00
16	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:09:41.880975+00	2025-12-11 17:09:41.880975+00
17	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:09:50.977361+00	2025-12-11 17:09:50.977361+00
18	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:10:08.206382+00	2025-12-11 17:10:08.206382+00
19	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:10:21.746324+00	2025-12-11 17:10:21.746324+00
20	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:11:28.07438+00	2025-12-11 17:11:28.07438+00
21	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:11:33.866213+00	2025-12-11 17:11:33.866213+00
22	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:14:44.30981+00	2025-12-11 17:14:44.30981+00
23	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:21:24.46244+00	2025-12-11 17:21:24.46244+00
27	Server Alert	ServerDown	Server successfully started/restarted.	t	1	\N	2025-12-11 17:39:46.220875+00	2025-12-11 17:40:26.413205+00
26	Server Alert	ServerDown	Server successfully started/restarted.	t	1	\N	2025-12-11 17:38:04.913984+00	2025-12-11 17:40:30.277623+00
25	Server Alert	ServerDown	Server successfully started/restarted.	t	1	\N	2025-12-11 17:35:49.954359+00	2025-12-11 17:40:31.695077+00
24	Server Alert	ServerDown	Server successfully started/restarted.	t	1	\N	2025-12-11 17:28:11.808721+00	2025-12-11 17:40:32.54682+00
28	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:43:50.110353+00	2025-12-11 17:43:50.110353+00
29	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:43:56.101+00	2025-12-11 17:43:56.101+00
30	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:45:18.351488+00	2025-12-11 17:45:18.351488+00
31	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:45:34.789801+00	2025-12-11 17:45:34.789801+00
32	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:47:08.57632+00	2025-12-11 17:47:08.57632+00
33	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:47:16.81087+00	2025-12-11 17:47:16.81087+00
34	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:47:31.992375+00	2025-12-11 17:47:31.992375+00
35	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:48:07.654031+00	2025-12-11 17:48:07.654031+00
36	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:48:15.663176+00	2025-12-11 17:48:15.663176+00
37	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:50:02.568872+00	2025-12-11 17:50:02.568872+00
38	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:51:01.005032+00	2025-12-11 17:51:01.005032+00
39	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:51:52.102016+00	2025-12-11 17:51:52.102016+00
40	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:51:56.810029+00	2025-12-11 17:51:56.810029+00
41	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:52:05.795544+00	2025-12-11 17:52:05.795544+00
42	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:54:25.90102+00	2025-12-11 17:54:25.90102+00
43	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:54:47.05901+00	2025-12-11 17:54:47.05901+00
44	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:56:52.086401+00	2025-12-11 17:56:52.086401+00
45	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 17:57:24.742299+00	2025-12-11 17:57:24.742299+00
46	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 18:01:07.703845+00	2025-12-11 18:01:07.703845+00
47	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 18:01:32.640101+00	2025-12-11 18:01:32.640101+00
48	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 18:02:29.966788+00	2025-12-11 18:02:29.966788+00
49	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 18:06:44.634946+00	2025-12-11 18:06:44.634946+00
50	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 18:07:04.705697+00	2025-12-11 18:07:04.705697+00
51	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 19:07:09.418202+00	2025-12-11 19:07:09.418202+00
52	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-11 19:21:43.176709+00	2025-12-11 19:21:43.176709+00
53	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:10:12.414151+00	2025-12-12 01:10:12.414151+00
54	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:16:30.196106+00	2025-12-12 01:16:30.196106+00
55	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:16:46.633271+00	2025-12-12 01:16:46.633271+00
56	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:17:01.148622+00	2025-12-12 01:17:01.148622+00
57	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:17:09.010931+00	2025-12-12 01:17:09.010931+00
58	Processing	Order	Your order has been Processing. Order Tracking No: TRK-0000000001	f	1	1	2025-12-12 01:33:04.926112+00	2025-12-12 01:33:04.926112+00
59	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:38:29.476163+00	2025-12-12 01:38:29.476163+00
60	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:39:26.469061+00	2025-12-12 01:39:26.469061+00
61	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:39:45.919854+00	2025-12-12 01:39:45.919854+00
62	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 01:40:29.52527+00	2025-12-12 01:40:29.52527+00
63	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 02:47:52.361049+00	2025-12-12 02:47:52.361049+00
64	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 02:53:29.095892+00	2025-12-12 02:53:29.095892+00
65	Coupon Applied	CouponApplied	Coupon gowtamkumar applied successfully! Discount: 10	f	1	\N	2025-12-12 04:17:35.702825+00	2025-12-12 04:17:35.702825+00
66	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:19:15.652934+00	2025-12-12 04:19:15.652934+00
67	Coupon Applied	CouponApplied	Coupon gowtamkumar applied successfully! Discount: 10	f	1	\N	2025-12-12 04:19:21.714383+00	2025-12-12 04:19:21.714383+00
68	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:21:14.980439+00	2025-12-12 04:21:14.980439+00
69	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:21:55.1923+00	2025-12-12 04:21:55.1923+00
70	Coupon Applied	CouponApplied	Coupon gowtamkumar applied successfully! Discount: 10	f	1	\N	2025-12-12 04:22:36.066315+00	2025-12-12 04:22:36.066315+00
71	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:23:06.548544+00	2025-12-12 04:23:06.548544+00
72	Order Placed	OrderPlaced	Your order has been placed successfully. Order Tracking No: TRK-0000000001	f	1	2	2025-12-12 04:32:31.197179+00	2025-12-12 04:32:31.197179+00
73	New Order Received	ADMIN_NEW_ORDER	New order #2 received from User 1. Tracking No: TRK-0000000001	f	1	2	2025-12-12 04:32:31.182957+00	2025-12-12 04:32:31.182957+00
74	Processing	Order	Your order has been Processing. Order Tracking No: TRK-0000000001	f	1	2	2025-12-12 04:34:21.977451+00	2025-12-12 04:34:21.977451+00
75	Order Placed	OrderPlaced	Your order has been placed successfully. Order Tracking No: TRK-0000000002	f	1	3	2025-12-12 04:37:48.550665+00	2025-12-12 04:37:48.550665+00
76	New Order Received	ADMIN_NEW_ORDER	New order #3 received from User 1. Tracking No: TRK-0000000002	f	1	3	2025-12-12 04:37:48.543585+00	2025-12-12 04:37:48.543585+00
77	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:39:34.686533+00	2025-12-12 04:39:34.686533+00
78	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:39:44.939813+00	2025-12-12 04:39:44.939813+00
79	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 04:40:13.366997+00	2025-12-12 04:40:13.366997+00
80	Order Placed	OrderPlaced	Your order has been placed successfully. Order Tracking No: TRK-0000000003	f	1	4	2025-12-12 04:40:57.303174+00	2025-12-12 04:40:57.303174+00
81	New Order Received	ADMIN_NEW_ORDER	New order #4 received from User 1. Tracking No: TRK-0000000003	f	1	4	2025-12-12 04:40:57.283657+00	2025-12-12 04:40:57.283657+00
82	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 06:07:42.348853+00	2025-12-12 06:07:42.348853+00
83	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 06:44:15.894428+00	2025-12-12 06:44:15.894428+00
84	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 06:48:56.346081+00	2025-12-12 06:48:56.346081+00
85	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-12 08:21:09.529265+00	2025-12-12 08:21:09.529265+00
86	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:27:03.801769+00	2025-12-13 12:27:03.801769+00
87	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:36:18.906625+00	2025-12-13 12:36:18.906625+00
88	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:40:20.082208+00	2025-12-13 12:40:20.082208+00
89	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:43:01.653186+00	2025-12-13 12:43:01.653186+00
90	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:44:40.634309+00	2025-12-13 12:44:40.634309+00
91	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:45:05.100927+00	2025-12-13 12:45:05.100927+00
92	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:45:11.620212+00	2025-12-13 12:45:11.620212+00
93	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:45:46.714851+00	2025-12-13 12:45:46.714851+00
94	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:46:48.902784+00	2025-12-13 12:46:48.902784+00
95	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:46:56.786441+00	2025-12-13 12:46:56.786441+00
96	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 12:51:54.078611+00	2025-12-13 12:51:54.078611+00
97	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:23:37.824862+00	2025-12-13 13:23:37.824862+00
98	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:24:02.130658+00	2025-12-13 13:24:02.130658+00
99	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:24:17.876691+00	2025-12-13 13:24:17.876691+00
100	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:24:50.880283+00	2025-12-13 13:24:50.880283+00
101	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:25:02.030392+00	2025-12-13 13:25:02.030392+00
102	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:26:27.335847+00	2025-12-13 13:26:27.335847+00
103	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:26:56.896325+00	2025-12-13 13:26:56.896325+00
104	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:28:07.28852+00	2025-12-13 13:28:07.28852+00
105	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:28:36.666251+00	2025-12-13 13:28:36.666251+00
106	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 13:28:49.05861+00	2025-12-13 13:28:49.05861+00
107	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:07:11.927935+00	2025-12-13 15:07:11.927935+00
108	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:11:46.287092+00	2025-12-13 15:11:46.287092+00
109	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:15:05.036383+00	2025-12-13 15:15:05.036383+00
110	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:15:19.592506+00	2025-12-13 15:15:19.592506+00
111	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:16:02.706596+00	2025-12-13 15:16:02.706596+00
112	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:17:39.39761+00	2025-12-13 15:17:39.39761+00
113	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:18:29.235196+00	2025-12-13 15:18:29.235196+00
114	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:18:34.05207+00	2025-12-13 15:18:34.05207+00
115	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:19:00.124297+00	2025-12-13 15:19:00.124297+00
116	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:20:01.626031+00	2025-12-13 15:20:01.626031+00
117	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:20:11.486772+00	2025-12-13 15:20:11.486772+00
118	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:20:43.211015+00	2025-12-13 15:20:43.211015+00
119	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:21:38.460164+00	2025-12-13 15:21:38.460164+00
120	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:21:47.751636+00	2025-12-13 15:21:47.751636+00
121	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:21:54.668939+00	2025-12-13 15:21:54.668939+00
122	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:42:04.356324+00	2025-12-13 15:42:04.356324+00
123	Server Alert	ServerDown	Server successfully started/restarted.	f	1	\N	2025-12-13 15:47:39.795245+00	2025-12-13 15:47:39.795245+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_items (id, order_id, unit_price, purchase_price, qty, tax_amount, discounted_unit_pice, total_discounted_price, discount_amount_per_unit, total_discount_amount, sub_total, product_id, product_variant_id) FROM stdin;
2	2	200.00	100.00	1	18.00	180.00	180.00	20.00	20.00	198.00	1	1
3	2	300.00	200.00	1	27.00	270.00	270.00	30.00	30.00	297.00	2	2
4	3	200.00	100.00	1	18.00	180.00	180.00	20.00	20.00	198.00	1	1
5	4	200.00	100.00	1	18.00	180.00	180.00	20.00	20.00	198.00	1	1
\.


--
-- Data for Name: order_trackings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_trackings (id, order_id, user_id, location, status, created_at, updated_at) FROM stdin;
3	2	1	অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।	Order Placed	2025-12-12 04:32:31.182957	2025-12-12 04:32:31.182957
4	2	1	\N	Order is Being Processed	2025-12-12 04:34:21.614663	2025-12-12 04:34:21.614663
5	3	1	অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।	Order Placed	2025-12-12 04:37:48.543585	2025-12-12 04:37:48.543585
6	4	1	অর্ডারটি গ্রহন করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।	Order Placed	2025-12-12 04:40:57.283657	2025-12-12 04:40:57.283657
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.orders (id, tracking_no, total_qty, sub_total, total_items_discount, coupon_discount, total_tax, shipping_charge, grand_total, shipping_address_id, coupon_id, cancel_resson, payment_status, payment_method, status, tran_id, user_id, delivery_id, created_at, updated_at) FROM stdin;
2	TRK-0000000001	2	495.00	50.00	0.00	45.00	0.00	495.00	1	\N	\N	Not Paid	Cash	Processing	1765513951181	1	\N	2025-12-12 04:32:31.182957+00	2025-12-12 04:34:21.614663+00
3	TRK-0000000002	1	198.00	20.00	0.00	18.00	0.00	198.00	1	\N	\N	Not Paid	SSLCOMMERZ	Pending	1765514268543	1	\N	2025-12-12 04:37:48.543585+00	2025-12-12 04:37:48.543585+00
4	TRK-0000000003	1	198.00	20.00	0.00	18.00	0.00	198.00	1	\N	\N	Not Paid	SSLCOMMERZ	Pending	1765514457275	1	\N	2025-12-12 04:40:57.283657+00	2025-12-12 04:40:57.283657+00
1	TRK-0000000001	1	220.00	0.00	0.00	20.00	0.00	220.00	1	\N	\N	Not Paid	Cash	Pending	1754627285034	1	\N	2025-08-08 04:28:05.047495+00	2025-08-08 04:28:05.047495+00
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pages (id, title, slug, content, content_type, meta_description, status, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.payments (id, order_id, payment_date, payment_type, payment_method, amount, user_id, tran_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.post_categories (id, post_id, category_id) FROM stdin;
1	1	2
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.posts (id, slug, title, image, tags, content, user_id, status, created_at, updated_at) FROM stdin;
1	react-labs:-what-we've-been-working-on-–-june-2022	React Labs: What We've Been Working On – June 2022	image-1765631920959.jpg	dsaf	React 18 was years in the making, and with it brought valuable lessons for the React team. Its release was the result of many years of research and exploring many paths. Some of those paths were successful; many more were dead-ends that led to new insights. One lesson we’ve learned is that it’s frustrating for the community to wait for new features without having insight into these paths that we’re exploring.\n\nWe typically have a number of projects being worked on at any time, ranging from the more experimental to the clearly defined. Looking ahead, we’d like to start regularly sharing more about what we’ve been working on with the community across these projects.\n\nTo set expectations, this is not a roadmap with clear timelines. Many of these projects are under active research and are difficult to put concrete ship dates on. They may possibly never even ship in their current iteration depending on what we learn. Instead, we want to share with you the problem spaces we’re actively thinking about, and what we’ve learned so far.	1	Published	2025-12-13 13:18:43.158081+00	2025-12-13 13:18:43.158081+00
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_categories (id, category_id, product_id) FROM stdin;
4	7	2
5	1	2
6	6	2
7	5	2
8	1	1
2	1	1
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.product_variants (id, sku, unit_price, purchase_price, product_id, size_id, color_id, material, image, "default", stock_qty) FROM stdin;
2	\N	300.00	200.00	2	\N	\N	\N	\N	f	1120
1	\N	200.00	100.00	1	\N	\N	\N	\N	f	200
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.products (id, name, slug, variant, is_returnable, featured, description, short_description, tax_id, discount_id, enable_review, limit_purchase_qty, alert_qty, status, brand_id, unit_id, tags, thumbnail_image, hover_image, images, user_id, created_at, updated_at, is_new_arrival) FROM stdin;
2	Comforter | King Size Winter Comforter (86" x 84") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print	comforter-|-king-size-winter-comforter-(86"-x-84")-|-lightweight-&-cozy-with-poly-filler-[micro-fiber-padding]-|-ash-blue-and-white-floral-print	f	t	t	"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\n- Material: Cotton\n- Poly Filler Inside\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\n- Package: Comes with Plastic Packed Box.\n- Machine Washable"\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\n\n\n\nQuality Material:\n\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\n\n\nUnique Design:\n\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\n\n\nPerfect Size:\n\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\n\n\nColor may be slightly differ for Photo shoot or your computer resolution.\n\nSpecifications of Comforter | King Size Winter Comforter (86" x 84") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain	"King Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\n- Material: Cotton\n- Poly Filler Inside\n- Size: Double Size: 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft\n- Package: Comes with Plastic Packed Box.\n- Machine Washable"\nKing Size Comforter_ Poly Filler Inside Feather Like Comforter_White with Red Small Floral Print_Lightweight Comforter Comes With Box Perfect For winter\n\n\n\nQuality Material:\n\nMade of 100% High-Quality Fabric that makes the Comforter really soft and comfortable for your body. Even with the best fabric, the Comforter is really light-weighted.\n\n\nUnique Design:\n\nAll the Comforters are purely manufactured from scratch to provide our customers with uniquely designed and high-quality Comforters. You also can check out our All Collection for Comforter section.\n\n\nPerfect Size:\n\nThe Comforter that measures 86 X 84 inch (+- 2 inch) or 7.16 X 7 ft which is the perfect fit for your bed.\n\n\nColor may be slightly differ for Photo shoot or your computer resolution.\n\nSpecifications of Comforter | King Size Winter Comforter (86" x 84") | Lightweight & Cozy with Poly Filler [Micro-fiber Padding] | Ash Blue and White Floral Print\nBrandNo BrandSKU458401545_BD-2197936228FillingMicrofiberPatternPlain	1	\N	t	10	10	Active	1	2	new tag, new product	thumbnailImage-1765503085981.jpg	hoverImage-1765503092000.png	images-1765503096896.jpg	1	2025-12-12 01:31:40.616001	2025-12-12 01:31:40.616001	f
1	(FP-M-20) Smart Executive office chair China mesh /premium quality/1 years warranty/original China chair/ gaming chair /Furniture Plus	(fp-m-20)-smart-executive-office-chair-china-mesh-/premium-quality/1-years-warranty/original-china-chair/-gaming-chair-/furniture-plus	f	t	f	🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\n\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\n\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\n\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\n\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\n\n✅ প্রতিটি পণ্যে থাকছে:\n\n১ বছরের ওয়ারেন্টি\n\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\n\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\n\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\n\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা\n\nক্যাশ অন ডেলিভারি সুবিধা 🥰\n\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\n\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\n\nFurniture Plus আপনার পাশে আছি সবসময়\n\n🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\n\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\n\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\n\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\n\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\n\n✅ প্রতিটি পণ্যে থাকছে:\n\n১ বছরের ওয়ারেন্টি \n\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\n\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\n\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\n\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা \n\nক্যাশ অন ডেলিভারি সুবিধা 🥰\n\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\n\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\n\nFurniture Plus আপনার পাশে আছি সবসময়।	🌟 কেন হাজারো কাস্টমার Furniture Plus-কে বেছে নিয়েছে?\n\nFurniture Plus® — শুধু পণ্য নয়, আমরা দিচ্ছি আপনার বিশ্বাসের গ্যারান্টি।\n\n🔹 আমাদের থেকে যারা একবার কিনেছেন, তারা পরবর্তীবারও আমাদের কাছেই ফিরেছেন।\n\n🔹 ৯৭% পজিটিভ রেটিং আর হাজারো সন্তুষ্ট কাস্টমারই আমাদের শক্তি।\n\n🔹 আমরা কম দামে নয়, মান ও সার্ভিসে সেরা হতে চাই।\n\n✅ প্রতিটি পণ্যে থাকছে:\n\n১ বছরের ওয়ারেন্টি\n\nAfter-Sales সার্ভিস ও ফ্রি গাইডলাইন\n\nসঠিক কোয়ালিটি, নিখুঁত ফিনিশিং\n\nসরাসরি আমাদের Verified Store থেকে ডেলিভারি\n\n🇧🇩 সারাদেশে হোম ডেলিভারি সুবিধা\n\nক্যাশ অন ডেলিভারি সুবিধা 🥰\n\n⚠️ বাজারে অনেকে অল্প দামে পণ্য দেয়, কিন্তু মান নিয়ে করে আপস।\n\nআমরা করি না। কারণ আমরা জানি – সস্তার জিনিস বারবার কিনতে হয়, ভালো জিনিস একবারই যথেষ্ট।\n\nFurniture Plus আপনার পাশে আছি সবসময়	1	\N	t	10	100	Active	1	1	new product, hello, nice product	thumbnailImage-1765415824708.jpg	hoverImage-1765415833283.jpg	images-1765415838674.jpg	1	2025-08-08 04:18:53.669065	2025-12-13 12:34:17.523741	t
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reviews (id, product_id, rating, comment, "like", dis_like, status, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.settings (id, site_name, image, favicon, address, phone, email, social_link, seo, email_config, payment_account, home_page, about_page, contact_page, term_policy_page, footer_option, header_option, help_support, updated_at, order_free_shipping_amount, whats_app_widget, description, faq) FROM stdin;
1	Arko store	image-1765418573917.jpg	favicon-1765639747311.png	Monoharpur, Kayemkola Bazar, Jhikargacha, Jashore	01767163576	arko@gmail.com	{"facebookUrl":"/","instagramUrl":"/","linkedinUrl":"/","twitterUrl":"/"}	{}	\N	\N	{"metaKeywords":["hello","hello\\\\","new account"]}	\N	\N	\N	{"copyRight":"Copyright in E-Commerce","image":"image-1765512284558.png"}	{"leftText":"Welcome to our Store"}	{"returnSupport":"Return Support","originalProduct":"Original Product","guarantee":"100% Guarantee","cashDelivery":"Cash Delivery"}	2025-12-13 15:33:10.012288	3000.00	{"message":"Hello! How can you help me?","phone":"01767163576"}	test descripiton	\N
\.


--
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.shipping_addresses (id, type, name, phone_no, email, alternative_phone_no, division_id, district_id, upazila_id, union_id, address, user_id, status) FROM stdin;
1	Office	Gowtam Kumar	01767163576	gowtamkumar2019@gmail.com	\N	3	20	175	1	Monoharpur,kayemkola bazar, Jhikargacha, Jashore	1	t
\.


--
-- Data for Name: shipping_charges; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.shipping_charges (id, district_id, shipping_amount, note, user_id, status) FROM stdin;
1	20	100.00	sdafasdf	1	t
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
1	2	Add	2	100	1
2	2	Add	2	10	1
3	2	Add	2	10	1
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
1	\N	Subil	সুবিল	subilup.comilla.gov.bd
2	\N	North Gunaighor	উত্তর গুনাইঘর	gunaighornorthup.comilla.gov.bd
3	\N	South Gunaighor	দক্ষিণ গুনাইঘর	gunaighorsouth.comilla.gov.bd
4	\N	Boroshalghor	বড়শালঘর	boroshalghorup.comilla.gov.bd
5	\N	Rajameher	রাজামেহার	rajameherup.comila.gov.bd
6	\N	Yousufpur	ইউসুফপুর	yousufpurup.comilla.gov.bd
7	\N	Rasulpur	রসুলপুর	rasulpurup.comilla.gov.bd
8	\N	Fatehabad	ফতেহাবাদ	fatehabadup.comilla.gov.bd
9	\N	Elahabad	এলাহাবাদ	elahabadup.comilla.gov.bd
10	\N	Jafargonj	জাফরগঞ্জ	jafargonjup.comilla.gov.bd
11	\N	Dhampti	ধামতী	dhamptiup.comilla.gov.bd
12	\N	Mohanpur	মোহনপুর	mohanpurup.comilla.gov.bd
13	\N	Vani	ভানী	vaniup.comilla.gov.bd
14	\N	Barkamta	বরকামতা	barkamtaup.comilla.gov.bd
15	\N	Sultanpur	সুলতানপুর	sultanpurup.comilla.gov.bd
16	\N	Aganagar	আগানগর	aganagarup.comilla.gov.bd
17	\N	Bhabanipur	ভবানীপুর	bhabanipurup.comilla.gov.bd
18	\N	North Khoshbas	উত্তর খোশবাস	khoshbasnorthup.comilla.gov.bd
19	\N	South Khoshbas	দক্ষিন খোশবাস	khoshbassouthup.comilla.gov.bd
20	\N	Jhalam	ঝলম	jhalamup.comilla.gov.bd
21	\N	Chitodda	চিতড্ডা	chitoddaup.comilla.gov.bd
22	\N	North Shilmuri	উত্তর শিলমুড়ি	shilmurinorthup.comilla.gov.bd
23	\N	South Shilmuri	দক্ষিন শিলমুড়ি	shilmurisouthup.comilla.gov.bd
24	\N	Galimpur	গালিমপুর	galimpurup.comilla.gov.bd
25	\N	Shakpur	শাকপুর	shakpurup.comilla.gov.bd
26	\N	Bhaukshar	ভাউকসার	bhauksharup.comilla.gov.bd
27	\N	Adda	আড্ডা	addaup.comilla.gov.bd
28	\N	Adra	আদ্রা	adraup.comilla.gov.bd
29	\N	Payalgacha	পয়ালগাছা	payalgachaup.comilla.gov.bd
30	\N	Laxmipur	লক্ষীপুর	laxmipurup.comilla.gov.bd
31	\N	Shidli	শিদলাই	shidliup.comilla.gov.bd
32	\N	Chandla	চান্দলা	chandlaup.comilla.gov.bd
33	\N	Shashidal	শশীদল	shashidalup.comilla.gov.bd
34	\N	Dulalpur	দুলালপুর	dulalpurup2.comilla.gov.bd
35	\N	Brahmanpara Sadar	ব্রাহ্মনপাড়া সদর	brahmanparasadarup.comilla.gov.bd
36	\N	Shahebabad	সাহেবাবাদ	shahebabadup.comilla.gov.bd
37	\N	Malapara	মালাপাড়া	malaparaup.comilla.gov.bd
38	\N	Madhabpur	মাধবপুর	madhabpurup.comilla.gov.bd
39	\N	Shuhilpur	সুহিলপুর	shuhilpurup.comilla.gov.bd
40	\N	Bataghashi	বাতাঘাসি	bataghashiup.comilla.gov.bd
41	\N	Joag	জোয়াগ	joagup.comilla.gov.bd
42	\N	Borcarai	বরকরই	borcaraiup.comilla.gov.bd
43	\N	Madhaiya	মাধাইয়া	madhaiyaup.comilla.gov.bd
44	\N	Dollai Nowabpur	দোল্লাই নবাবপুর	dollainowabpurup.comilla.gov.bd
45	\N	Mohichial	মহিচাইল	mohichialup.comilla.gov.bd
46	\N	Gollai	গল্লাই	gollaiup.comilla.gov.bd
47	\N	Keronkhal	কেরণখাল	keronkhalup.comilla.gov.bd
48	\N	Maijkhar	মাইজখার	maijkharup.comilla.gov.bd
49	\N	Etberpur	এতবারপুর	etberpurup.comilla.gov.bd
50	\N	Barera	বাড়েরা	bareraup.comilla.gov.bd
51	\N	Borcoit	বরকইট	borcoitup.comilla.gov.bd
52	\N	Sreepur	শ্রীপুর	sreepurup.comilla.gov.bd
53	\N	Kashinagar	কাশিনগর	kashinagarup.comilla.gov.bd
54	\N	Kalikapur	কালিকাপুর	kalikapurup.comilla.gov.bd
55	\N	Shuvapur	শুভপুর	shuvapurup.comilla.gov.bd
56	\N	Ghulpasha	ঘোলপাশা	ghulpashaup.comilla.gov.bd
57	\N	Moonshirhat	মুন্সীরহাট	moonshirhatup.comilla.gov.bd
58	\N	Batisha	বাতিসা	batishaup.comilla.gov.bd
59	\N	Kankapait	কনকাপৈত	kankapaitup.comilla.gov.bd
60	\N	Cheora	চিওড়া	cheoraup.comilla.gov.bd
61	\N	Jagannatdighi	জগন্নাথদিঘী	jagannatdighiup.comilla.gov.bd
62	\N	Goonabati	গুনবতী	goonabatiup.comilla.gov.bd
63	\N	Alkara	আলকরা	alkaraup.comilla.gov.bd
64	\N	Doulotpur	দৌলতপুর	doulotpurup.comilla.gov.bd
65	\N	Daudkandi	দাউদকান্দি	daudkandinorthup.comilla.gov.bd
66	\N	North Eliotgonj	উত্তর ইলিয়টগঞ্জ	eliotgonjnorthup.comilla.gov.bd
67	\N	South Eliotgonj	দক্ষিন ইলিয়টগঞ্জ	eliotgonjsouthup.comilla.gov.bd
68	\N	Zinglatoli	জিংলাতলী	zinglatoliup.comilla.gov.bd
69	\N	Sundolpur	সুন্দলপুর	sundolpurup.comilla.gov.bd
70	\N	Gouripur	গৌরীপুর	gouripurup.comilla.gov.bd
71	\N	East Mohammadpur	পুর্ব মোহাম্মদপুর	mohammadpureastup.comilla.gov.bd
72	\N	West Mohammadpur	পশ্চিম মোহাম্মদপুর	mohammadpurwestup.comilla.gov.bd
73	\N	Goalmari	গোয়ালমারী	goalmariup.comilla.gov.bd
74	\N	Maruka	মারুকা	marukaup.comilla.gov.bd
75	\N	Betessor	বিটেশ্বর	betessorup.comilla.gov.bd
76	\N	Podua	পদুয়া	poduaup.comilla.gov.bd
77	\N	West Passgacia	পশ্চিম পাচঁগাছিয়া	passgaciawestup.comilla.gov.bd
78	\N	Baropara	বারপাড়া	baroparaup2.comilla.gov.bd
79	\N	Mathabanga	মাথাভাঙ্গা	mathabangaup.comilla.gov.bd
80	\N	Gagutiea	ঘাগুটিয়া	gagutieaup.comilla.gov.bd
81	\N	Asadpur	আছাদপুর	asadpurup.comilla.gov.bd
82	\N	Chanderchor	চান্দেরচর	chanderchorup.comilla.gov.bd
83	\N	Vashania	ভাষানিয়া	vashaniaup.comilla.gov.bd
84	\N	Nilokhi	নিলখী	nilokhiup.comilla.gov.bd
85	\N	Garmora	ঘারমোড়া	garmoraup.comilla.gov.bd
86	\N	Joypur	জয়পুর	joypurup.comilla.gov.bd
87	\N	Dulalpur	দুলালপুর	dulalpurup1.comilla.gov.bd
88	\N	Bakoi	বাকই	bakoiup.comilla.gov.bd
89	\N	Mudafargonj	মুদাফফর গঞ্জ	mudafargonjup.comilla.gov.bd
90	\N	Kandirpar	কান্দিরপাড়	kandirparup.comilla.gov.bd
91	\N	Gobindapur	গোবিন্দপুর	gobindapurup.comilla.gov.bd
92	\N	Uttarda	উত্তরদা	uttardaup.comilla.gov.bd
93	\N	Laksam Purba	লাকসাম পুর্ব	laksampurbaup.comilla.gov.bd
94	\N	Azgora	আজগরা	azgoraup.comilla.gov.bd
95	\N	Sreekil	শ্রীকাইল	sreekilup.comilla.gov.bd
96	\N	Akubpur	আকুবপুর	akubpurup.comilla.gov.bd
97	\N	Andicot	আন্দিকোট	andicotup.comilla.gov.bd
98	\N	Purbadair (East)	পুর্বধৈইর (পুর্ব)	purbadaireastup.comilla.gov.bd
99	\N	Purbadair (West)	পুর্বধৈইর (পশ্চিম)	purbadairwestup.comilla.gov.bd
100	\N	Bangara (East)	বাঙ্গরা (পূর্ব)	bangaraeastup.comilla.gov.bd
101	\N	Bangara (West)	বাঙ্গরা (পশ্চিম)	bangarawestup.comilla.gov.bd
102	\N	Chapitala	চাপিতলা	chapitalaup.comilla.gov.bd
103	\N	Camalla	কামাল্লা	camallaup.comilla.gov.bd
104	\N	Jatrapur	যাত্রাপুর	jatrapurup.comilla.gov.bd
105	\N	Ramachandrapur (North)	রামচন্দ্রপুর (উত্তর)	ramachandrapurnorthup.comilla.gov.bd
106	\N	Ramachandrapur (South)	রামচন্দ্রপুর (দক্ষিন)	ramachandrapursouthup.comilla.gov.bd
107	\N	Muradnagar Sadar	মুরাদনগর সদর	muradnagarsadarup.comilla.gov.bd
108	\N	Nobipur (East)	নবীপুর (পুর্ব)	nobipureastup.comilla.gov.bd
109	\N	Nobipur (West)	নবীপুর (পশ্চিম)	nobipurwestup.comilla.gov.bd
110	\N	Damgar	ধামঘর	damgarup.comilla.gov.bd
111	\N	Jahapur	জাহাপুর	jahapurup.comilla.gov.bd
112	\N	Salikandi	ছালিয়াকান্দি	salikandiup.comilla.gov.bd
113	\N	Darura	দারোরা	daruraup.comilla.gov.bd
114	\N	Paharpur	পাহাড়পুর	paharpurup.comilla.gov.bd
115	\N	Babutipara	বাবুটিপাড়া	babutiparaup.comilla.gov.bd
116	\N	Tanki	টনকী	tankiup.comilla.gov.bd
117	\N	Bangadda	বাঙ্গড্ডা	bangadda.comilla.gov.bd
118	\N	Paria	পেরিয়া	pariaup.comilla.gov.bd
119	\N	Raykot	রায়কোট	raykotup.comilla.gov.bd
120	\N	Mokara	মোকরা	mokaraup.comilla.gov.bd
121	\N	Makrabpur	মক্রবপুর	makrabpurup.comilla.gov.bd
122	\N	Heshakhal	হেসাখাল	heshakhalup.comilla.gov.bd
123	\N	Adra	আদ্রা	adraup.comilla.gov.bd
124	\N	Judda	জোড্ডা	juddaup.comilla.gov.bd
125	\N	Dhalua	ঢালুয়া	dhaluaup.comilla.gov.bd
126	\N	Doulkha	দৌলখাঁড়	doulkhaup.comilla.gov.bd
127	\N	Boxgonj	বক্সগঞ্জ	boxgonjup.comilla.gov.bd
128	\N	Satbaria	সাতবাড়ীয়া	satbariaup.comilla.gov.bd
129	\N	Kalirbazer	কালীর বাজার	kalirbazerup.comilla.gov.bd
130	\N	North Durgapur	উত্তর দুর্গাপুর	durgapurnorthup.comilla.gov.bd
131	\N	South Durgapur	দক্ষিন দুর্গাপুর	durgapursouthup.comilla.gov.bd
132	\N	Amratoli	আমড়াতলী	amratoliup.comilla.gov.bd
133	\N	Panchthubi	পাঁচথুবী	panchthubiup.comilla.gov.bd
134	\N	Jagannatpur	জগন্নাথপুর	jagannatpurup.comilla.gov.bd
135	\N	Chandanpur	চন্দনপুর	chandanpurup.comilla.gov.bd
136	\N	Chalibanga	চালিভাঙ্গা	chalibangaup.comilla.gov.bd
137	\N	Radanagar	রাধানগর	radanagarup.comilla.gov.bd
138	\N	Manikarchar	মানিকারচর	manikarcharup.comilla.gov.bd
139	\N	Barakanda	বড়কান্দা	barakandaup.comilla.gov.bd
140	\N	Govindapur	গোবিন্দপুর	govindapurup1.comilla.gov.bd
141	\N	Luterchar	লুটেরচর	lutercharup.comilla.gov.bd
142	\N	Vaorkhola	ভাওরখোলা	vaorkholaup.comilla.gov.bd
143	\N	Baishgaon	বাইশগাঁও	baishgaonup.comilla.gov.bd
144	\N	Shoroshpur	সরসপুর	shoroshpurup.comilla.gov.bd
145	\N	Hasnabad	হাসনাবাদ	hasnabadup.comilla.gov.bd
146	\N	Jholam (North)	ঝলম (উত্তর)	jholamnorthup.comilla.gov.bd
147	\N	Jholam (South)	ঝলম (দক্ষিন)	jholamsouthup.comilla.gov.bd
148	\N	Moishatua	মৈশাতুয়া	moishatuaup.comilla.gov.bd
149	\N	Lokkhanpur	লক্ষনপুর	lokkhanpurup.comilla.gov.bd
150	\N	Khela	খিলা	khelaup.comilla.gov.bd
151	\N	Uttarhowla	উত্তর হাওলা	uttarhowlaup.comilla.gov.bd
152	\N	Natherpetua	নাথেরপেটুয়া	natherpetuaup.comilla.gov.bd
153	\N	Bipulashar	বিপুলাসার	bipulasharup.comilla.gov.bd
154	\N	Chuwara	চৌয়ারা	chuwaraup.comilla.gov.bd
155	\N	Baropara	বারপাড়া	baroparaup1.comilla.gov.bd
156	\N	Jorkanoneast	জোড়কানন (পুর্ব)	jorkanoneastup.comilla.gov.bd
157	\N	Goliara	গলিয়ারা	goliaraup.comilla.gov.bd
158	\N	Jorkanonwest	জোড়কানন (পশ্চিম)	jorkanonwestup.comilla.gov.bd
159	\N	Bagmara (North)	বাগমারা (উত্তর)	bagmaranorthup.comilla.gov.bd
160	\N	Bagmara (South)	বাগমারা (দক্ষিন)	bagmarasouthup.comilla.gov.bd
161	\N	Bhuloin (North)	ভূলইন (উত্তর)	bhuloinnorthup.comilla.gov.bd
162	\N	Bhuloin (South)	ভূলইন (দক্ষিন)	bhuloinsouthup.comilla.gov.bd
163	\N	Belgor (North)	বেলঘর (উত্তর)	belgornorthup.comilla.gov.bd
164	\N	Belgor (South)	বেলঘর (দক্ষিন)	belgorsouthup.comilla.gov.bd
165	\N	Perul (North)	পেরুল (উত্তর)	perulnorthup.comilla.gov.bd
166	\N	Perul (South)	পেরুল (দক্ষিন)	perulsouthup.comilla.gov.bd
167	\N	Bijoypur	বিজয়পুর	bijoypurup.comilla.gov.bd
168	\N	Satani	সাতানী	sataniup.comilla.gov.bd
169	\N	Jagatpur	জগতপুর	jagatpurup.comilla.gov.bd
170	\N	Balorampur	বলরামপুর	balorampurup.comilla.gov.bd
171	\N	Karikandi	কড়িকান্দি	karikandiup.comilla.gov.bd
172	\N	Kalakandi	কলাকান্দি	kalakandiup.comilla.gov.bd
173	\N	Vitikandi	ভিটিকান্দি	vitikandiup.comilla.gov.bd
174	\N	Narayandia	নারান্দিয়া	narayandiaup.comilla.gov.bd
175	\N	Zearkandi	জিয়ারকান্দি	zearkandiup.comilla.gov.bd
176	\N	Majidpur	মজিদপুর	majidpurup.comilla.gov.bd
177	\N	Moynamoti	ময়নামতি	moynamotiup.comilla.gov.bd
178	\N	Varella	ভারেল্লা	varellaup.comilla.gov.bd
179	\N	Mokam	মোকাম	mokamup.comilla.gov.bd
180	\N	Burichang Sadar	বুড়িচং সদর	burichangsadarup.comilla.gov.bd
181	\N	Bakshimul	বাকশীমূল	bakshimulup.comilla.gov.bd
182	\N	Pirjatrapur	পীরযাত্রাপুর	pirjatrapurup.comilla.gov.bd
183	\N	Sholonal	ষোলনল	sholonalup.comilla.gov.bd
184	\N	Rajapur	রাজাপুর	rajapurup.comilla.gov.bd
185	\N	Bagmara (North)	বাগমারা (উত্তর)	bagmaranorthup.comilla.gov.bd
186	\N	Bagmara (South)	বাগমারা (দক্ষিন)	bagmarasouthup.comilla.gov.bd
187	\N	Bhuloin (North)	ভূলইন (উত্তর)	bhuloinnorthup.comilla.gov.bd
188	\N	Bhuloin (South)	ভূলইন (দক্ষিন)	bhuloinsouthup.comilla.gov.bd
189	\N	Belgor (North)	বেলঘর (উত্তর)	belgornorthup.comilla.gov.bd
190	\N	Belgor (South)	বেলঘর (দক্ষিন)	belgorsouthup.comilla.gov.bd
191	\N	Perul (North)	পেরুল (উত্তর)	perulnorthup.comilla.gov.bd
192	\N	Perul (South)	পেরুল (দক্ষিন)	perulsouthup.comilla.gov.bd
193	\N	Mohamaya	মহামায়া	mohamayaup.feni.gov.bd
194	\N	Pathannagar	পাঠাননগর	pathannagarup.feni.gov.bd
195	\N	Subhapur	শুভপুর	subhapurup.feni.gov.bd
196	\N	Radhanagar	রাধানগর	radhanagarup.feni.gov.bd
197	\N	Gopal	ঘোপাল	gopalup.feni.gov.bd
198	\N	Sarishadi	শর্শদি	sarishadiup.feni.gov.bd
199	\N	Panchgachia	পাঁচগাছিয়া	panchgachiaup.feni.gov.bd
200	\N	Dhormapur	ধর্মপুর	dhormapurup.feni.gov.bd
201	\N	Kazirbag	কাজিরবাগ	kazirbagup.feni.gov.bd
202	\N	Kalidah	কালিদহ	kalidahup.feni.gov.bd
203	\N	Baligaon	বালিগাঁও	baligaonup.feni.gov.bd
204	\N	Dholia	ধলিয়া	dholiaup.feni.gov.bd
205	\N	Lemua	লেমুয়া	lemuaup.feni.gov.bd
206	\N	Chonua	ছনুয়া	chonuaup.feni.gov.bd
207	\N	Motobi	মোটবী	motobiup.feni.gov.bd
208	\N	Fazilpur	ফাজিলপুর	fazilpurup.feni.gov.bd
209	\N	Forhadnogor	ফরহাদনগর	forhadnogorup.feni.gov.bd
210	\N	Charmozlishpur	চরমজলিশপুর	charmozlishpurup.feni.gov.bd
211	\N	Bogadana	বগাদানা	bogadanaup.feni.gov.bd
212	\N	Motigonj	মতিগঞ্জ	motigonjup.feni.gov.bd
213	\N	Mongolkandi	মঙ্গলকান্দি	mongolkandiup.feni.gov.bd
214	\N	Chardorbesh	চরদরবেশ	chardorbeshup.feni.gov.bd
215	\N	Chorchandia	চরচান্দিয়া	chorchandiaup.feni.gov.bd
216	\N	Sonagazi	সোনাগাজী	sonagaziup.feni.gov.bd
217	\N	Amirabad	আমিরাবাদ	amirabadup.feni.gov.bd
218	\N	Nababpur	নবাবপুর	nababpurup.feni.gov.bd
219	\N	Fulgazi	ফুলগাজী	fulgaziup.feni.gov.bd
220	\N	Munshirhat	মুন্সিরহাট	munshirhatup.feni.gov.bd
221	\N	Dorbarpur	দরবারপুর	dorbarpurup.feni.gov.bd
222	\N	Anandopur	আনন্দপুর	anandopurup.feni.gov.bd
223	\N	Amzadhat	আমজাদহাট	amzadhatup.feni.gov.bd
224	\N	Gmhat	জি,এম, হাট	gmhatup.feni.gov.bd
225	\N	Mizanagar	মির্জানগর	mizanagarup.feni.gov.bd
226	\N	Ctholia	চিথলিয়া	ctholiaup.feni.gov.bd
227	\N	Boxmahmmud	বক্সমাহমুদ	boxmahmmudup.feni.gov.bd
228	\N	Sindurpur	সিন্দুরপুর	sindurpurup.feni.gov.bd
229	\N	Rajapur	রাজাপুর	rajapurup.feni.gov.bd
230	\N	Purbachandrapur	পূর্বচন্দ্রপুর	purbachandrapurup.feni.gov.bd
231	\N	Ramnagar	রামনগর	ramnagarup.feni.gov.bd
232	\N	Yeakubpur	ইয়াকুবপুর	yeakubpur.feni.gov.bd
233	\N	Daganbhuiyan	দাগনভূঞা	daganbhuiyanup.feni.gov.bd
234	\N	Matubhuiyan	মাতুভূঞা	matubhuiyanup.feni.gov.bd
235	\N	Jayloskor	জায়লস্কর	jayloskorup.feni.gov.bd
236	\N	Basudeb	বাসুদেব	basudeb.brahmanbaria.gov.bd
237	\N	Machihata	মাছিহাতা	machihata.brahmanbaria.gov.bd
238	\N	Sultanpur	সুলতানপুর	sultanpur.brahmanbaria.gov.bd
239	\N	Ramrail	রামরাইল	ramrail.brahmanbaria.gov.bd
240	\N	Sadekpur	সাদেকপুর	sadekpur.brahmanbaria.gov.bd
241	\N	Talsahar	তালশহর	talsahar.brahmanbaria.gov.bd
242	\N	Natai	নাটাই (দক্ষিন)	natais.brahmanbaria.gov.bd
243	\N	Natai	নাটাই (উত্তর)	natain.brahmanbaria.gov.bd
244	\N	Shuhilpur	সুহিলপুর	shuhilpur.brahmanbaria.gov.bd
245	\N	Bodhal	বুধল	bodhal.brahmanbaria.gov.bd
246	\N	Majlishpur	মজলিশপুর	majlishpur.brahmanbaria.gov.bd
247	\N	Mulagram	মূলগ্রাম	mulagramup.brahmanbaria.gov.bd
248	\N	Mehari	মেহারী	mehariup.brahmanbaria.gov.bd
249	\N	Badair	বাদৈর	badairup.brahmanbaria.gov.bd
250	\N	Kharera	খাড়েরা	khareraup.brahmanbaria.gov.bd
251	\N	Benauty	বিনাউটি	benautyup.brahmanbaria.gov.bd
252	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.brahmanbaria.gov.bd
253	\N	Kasbaw	কসবা	kasbawup.brahmanbaria.gov.bd
254	\N	Kuti	কুটি	kutiup.brahmanbaria.gov.bd
255	\N	Kayempur	কাইমপুর	kayempurup.brahmanbaria.gov.bd
256	\N	Bayek	বায়েক	bayekup.brahmanbaria.gov.bd
257	\N	Chatalpar	চাতলপাড়	chatalparup.brahmanbaria.gov.bd
258	\N	Bhalakut	ভলাকুট	bhalakutup.brahmanbaria.gov.bd
259	\N	Kunda	কুন্ডা	kundaup.brahmanbaria.gov.bd
260	\N	Goalnagar	গোয়ালনগর	goalnagarup.brahmanbaria.gov.bd
261	\N	Nasirnagar	নাসিরনগর	nasirnagarup.brahmanbaria.gov.bd
262	\N	Burishwar	বুড়িশ্বর	burishwarup.brahmanbaria.gov.bd
263	\N	Fandauk	ফান্দাউক	fandaukup.brahmanbaria.gov.bd
264	\N	Goniauk	গুনিয়াউক	goniaukup.brahmanbaria.gov.bd
265	\N	Chapartala	চাপৈরতলা	chapartalaup.brahmanbaria.gov.bd
266	\N	Dharnondol	ধরমন্ডল	dharnondolup.brahmanbaria.gov.bd
267	\N	Haripur	হরিপুর	haripurup.brahmanbaria.gov.bd
268	\N	Purbabhag	পূর্বভাগ	purbabhagup.brahmanbaria.gov.bd
269	\N	Gokarna	গোকর্ণ	gokarnaup.brahmanbaria.gov.bd
270	\N	Auraol	অরুয়াইল	auraolup.brahmanbaria.gov.bd
271	\N	Pakshimuul	পাকশিমুল	pakshimuulup.brahmanbaria.gov.bd
272	\N	Chunta	চুন্টা	chuntaup.brahmanbaria.gov.bd
273	\N	Kalikaccha	কালীকচ্ছ	kalikacchaup.brahmanbaria.gov.bd
274	\N	Panishor	পানিশ্বর	panishorup.brahmanbaria.gov.bd
275	\N	Sarail	সরাইল সদর	sarailup.brahmanbaria.gov.bd
276	\N	Noagoun	নোয়াগাঁও	noagounup.brahmanbaria.gov.bd
277	\N	Shahajadapur	শাহজাদাপুর	shahajadapurup.brahmanbaria.gov.bd
278	\N	Shahbazpur	শাহবাজপুর	shahbazpurup.brahmanbaria.gov.bd
279	\N	Ashuganj	আশুগঞ্জ সদর	ashuganjup.brahmanbaria.gov.bd
280	\N	Charchartala	চরচারতলা	charchartalaup.brahmanbaria.gov.bd
281	\N	Durgapur	দুর্গাপুর	durgapurup.brahmanbaria.gov.bd
282	\N	Araishidha	আড়াইসিধা	araishidhaup.brahmanbaria.gov.bd
283	\N	Talshaharw	তালশহর(পঃ)	talshaharwup.brahmanbaria.gov.bd
284	\N	Sarifpur	শরীফপুর	sarifpurup.brahmanbaria.gov.bd
285	\N	Lalpur	লালপুর	lalpurup.brahmanbaria.gov.bd
286	\N	Tarua	তারুয়া	taruaup.brahmanbaria.gov.bd
287	\N	Monionda	মনিয়ন্দ	moniondaup.brahmanbaria.gov.bd
288	\N	Dharkhar	ধরখার	dharkharup.brahmanbaria.gov.bd
289	\N	Mogra	মোগড়া	mograup.brahmanbaria.gov.bd
290	\N	Akhauran	আখাউড়া (উঃ)	akhauranup.brahmanbaria.gov.bd
291	\N	Akhauras	আখাউড়া (দঃ)	akhaurasup.brahmanbaria.gov.bd
292	\N	Barail	বড়াইল	barailup.brahmanbaria.gov.bd
293	\N	Birgaon	বীরগাঁও	birgaonup.brahmanbaria.gov.bd
294	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.brahmanbaria.gov.bd
295	\N	Nathghar	নাটঘর	nathgharup.brahmanbaria.gov.bd
296	\N	Biddayakut	বিদ্যাকুট	biddayakutup.brahmanbaria.gov.bd
297	\N	Nabinagare	নবীনগর (পূর্ব)	nabinagareup.brahmanbaria.gov.bd
298	\N	Nabinagarw	নবীনগর(পশ্চিম)	nabinagarwup.brahmanbaria.gov.bd
299	\N	Bitghar	বিটঘর	bitgharup.brahmanbaria.gov.bd
300	\N	Shibpur	শিবপুর	shibpurup.brahmanbaria.gov.bd
301	\N	Sreerampur	শ্রীরামপুর	sreerampurup.brahmanbaria.gov.bd
302	\N	Jinudpur	জিনোদপুর	jinudpurup.brahmanbaria.gov.bd
303	\N	Laurfatehpur	লাউরফতেপুর	laurfatehpurup.brahmanbaria.gov.bd
304	\N	Ibrahimpur	ইব্রাহিমপুর	ibrahimpurup.brahmanbaria.gov.bd
305	\N	Satmura	সাতমোড়া	satmuraup.brahmanbaria.gov.bd
306	\N	Shamogram	শ্যামগ্রাম	shamogramup.brahmanbaria.gov.bd
307	\N	Rasullabad	রসুল্লাবাদ	rasullabadup.brahmanbaria.gov.bd
308	\N	Barikandi	বড়িকান্দি	barikandiup.brahmanbaria.gov.bd
309	\N	Salimganj	ছলিমগঞ্জ	salimganjup.brahmanbaria.gov.bd
310	\N	Ratanpur	রতনপুর	ratanpurup.brahmanbaria.gov.bd
311	\N	Kaitala (North)	কাইতলা (উত্তর)	kaitalanup.brahmanbaria.gov.bd
312	\N	Kaitala (South)	কাইতলা (দক্ষিন)	kaitalasup.brahmanbaria.gov.bd
313	\N	Tazkhali	তেজখালী	tazkhaliup.brahmanbaria.gov.bd
314	\N	Pahariya Kandi	পাহাড়িয়া কান্দি	pahariyakandiup.brahmanbaria.gov.bd
315	\N	Dariadulat	দরিয়াদৌলত	dariadulatup.brahmanbaria.gov.bd
316	\N	Sonarampur	সোনারামপুর	sonarampurup.brahmanbaria.gov.bd
317	\N	Darikandi	দড়িকান্দি	darikandiup.brahmanbaria.gov.bd
318	\N	Saifullyakandi	ছয়ফুল্লাকান্দি	saifullyakandiup.brahmanbaria.gov.bd
319	\N	Bancharampur	বাঞ্ছারামপুর	bancharampurup.brahmanbaria.gov.bd
320	\N	Ayabpur	আইয়ুবপুর	ayabpurup.brahmanbaria.gov.bd
321	\N	Fardabad	ফরদাবাদ	fardabadup.brahmanbaria.gov.bd
322	\N	Rupushdi	রুপসদী পশ্চিম	rupushdiup.brahmanbaria.gov.bd
323	\N	Salimabad	ছলিমাবাদ	salimabadup.brahmanbaria.gov.bd
324	\N	Ujanchar	উজানচর পূর্ব	ujancharup.brahmanbaria.gov.bd
325	\N	Manikpur	মানিকপুর	manikpurup.brahmanbaria.gov.bd
326	\N	Bhudanty	বুধন্তি	bhudantyup.brahmanbaria.gov.bd
327	\N	Chandura	চান্দুরা	chanduraup.brahmanbaria.gov.bd
328	\N	Ichapura	ইছাপুরা	ichapuraup.brahmanbaria.gov.bd
329	\N	Champaknagar	চম্পকনগর	champaknagarup.brahmanbaria.gov.bd
330	\N	Harashpur	হরষপুর	harashpurup.brahmanbaria.gov.bd
331	\N	Pattan	পত্তন	pattanup.brahmanbaria.gov.bd
332	\N	Singerbil	সিংগারবিল	singerbilup.brahmanbaria.gov.bd
333	\N	Bishupor	বিষ্ণুপুর	bishuporup.brahmanbaria.gov.bd
334	\N	Charislampur	চর-ইসলামপুর	charislampurup.brahmanbaria.gov.bd
335	\N	Paharpur	পাহাড়পুর	paharpurup.brahmanbaria.gov.bd
336	\N	Jibtali	জীবতলি	jibtaliup.rangamati.gov.bd
337	\N	Sapchari	সাপছড়ি	sapchariup.rangamati.gov.bd
338	\N	Kutukchari	কুতুকছড়ি	kutukchariup.rangamati.gov.bd
339	\N	Bandukbhanga	বন্দুকভাঙ্গা	bandukbhangaup.rangamati.gov.bd
340	\N	Balukhali	বালুখালী	balukhaliup.rangamati.gov.bd
341	\N	Mogban	মগবান	mogbanup.rangamati.gov.bd
342	\N	Raikhali	রাইখালী	raikhaliup.rangamati.gov.bd
343	\N	Kaptai	কাপ্তাই	kaptaiup.rangamati.gov.bd
344	\N	Wagga	ওয়াজ্ঞা	waggaup.rangamati.gov.bd
345	\N	Chandraghona	চন্দ্রঘোনা	chandraghonaup.rangamati.gov.bd
346	\N	Chitmorom	চিৎমরম	chitmoromup.rangamati.gov.bd
347	\N	Ghagra	ঘাগড়া	ghagraup.rangamati.gov.bd
348	\N	Fatikchari	ফটিকছড়ি	fatikchariup.rangamati.gov.bd
349	\N	Betbunia	বেতবুনিয়া	betbuniaup.rangamati.gov.bd
350	\N	Kalampati	কলমপতি	kalampatiup.rangamati.gov.bd
351	\N	Sajek	সাজেক	sajekup.rangamati.gov.bd
352	\N	Amtali	আমতলী	amtaliup.rangamati.gov.bd
353	\N	Bongoltali	বঙ্গলতলী	bongoltaliup.rangamati.gov.bd
354	\N	Rupokari	রুপকারী	rupokariup.rangamati.gov.bd
355	\N	Marisha	মারিশ্যা	marishaup.rangamati.gov.bd
356	\N	Khedarmara	খেদারমারা	khedarmaraup.rangamati.gov.bd
357	\N	Sharoyatali	সারোয়াতলী	sharoyataliup.rangamati.gov.bd
358	\N	Baghaichari	বাঘাইছড়ি	baghaichariup.rangamati.gov.bd
359	\N	Subalong	সুবলং	subalongup.rangamati.gov.bd
360	\N	Barkal	বরকল	barkalup.rangamati.gov.bd
361	\N	Bushanchara	ভূষনছড়া	bushancharaup.rangamati.gov.bd
362	\N	Aimachara	আইমাছড়া	aimacharaup.rangamati.gov.bd
363	\N	Borohorina	বড় হরিণা	borohorinaup.rangamati.gov.bd
364	\N	Langad	লংগদু	langaduup.rangamati.gov.bd
365	\N	Maeinimukh	মাইনীমুখ	maeinimukhup.rangamati.gov.bd
366	\N	Vasannadam	ভাসান্যাদম	vasannadamup.rangamati.gov.bd
367	\N	Bogachattar	বগাচতর	bogachattarup.rangamati.gov.bd
368	\N	Gulshakhali	গুলশাখালী	gulshakhaliup.rangamati.gov.bd
369	\N	Kalapakujja	কালাপাকুজ্যা	kalapakujjaup.rangamati.gov.bd
370	\N	Atarakchara	আটারকছড়া	atarakcharaup.rangamati.gov.bd
371	\N	Ghilachari	ঘিলাছড়ি	ghilachariup.rangamati.gov.bd
372	\N	Gaindya	গাইন্দ্যা	gaindyaup.rangamati.gov.bd
373	\N	Bangalhalia	বাঙ্গালহালিয়া	bangalhaliaup.rangamati.gov.bd
374	\N	Kengrachari	কেংড়াছড়ি	kengrachariup.rangamati.gov.bd
375	\N	Belaichari	বিলাইছড়ি	belaichariup.rangamati.gov.bd
376	\N	Farua	ফারুয়া	faruaup.rangamati.gov.bd
377	\N	Juraichari	জুরাছড়ি	juraichariup.rangamati.gov.bd
378	\N	Banajogichara	বনযোগীছড়া	banajogicharaup.rangamati.gov.bd
379	\N	Moidong	মৈদং	moidongup.rangamati.gov.bd
380	\N	Dumdumya	দুমদুম্যা	dumdumyaup.rangamati.gov.bd
381	\N	Sabekkhong	সাবেক্ষ্যং	sabekkhongup.rangamati.gov.bd
382	\N	Naniarchar	নানিয়ারচর	naniarcharup.rangamati.gov.bd
383	\N	Burighat	বুড়িঘাট	burighatup.rangamati.gov.bd
384	\N	Ghilachhari	ঘিলাছড়ি	ghilachhariup.rangamati.gov.bd
385	\N	Charmatua	চরমটুয়া	charmatuaup.noakhali.gov.bd
386	\N	Dadpur	দাদপুর	dadpurup.noakhali.gov.bd
387	\N	Noannoi	নোয়ান্নই	noannoiup.noakhali.gov.bd
388	\N	Kadirhanif	কাদির হানিফ	kadirhanifup.noakhali.gov.bd
389	\N	Binodpur	বিনোদপুর	binodpurup.noakhali.gov.bd
390	\N	Dharmapur	ধর্মপুর	dharmapurup.noakhali.gov.bd
391	\N	Aujbalia	এওজবালিয়া	aujbaliaup.noakhali.gov.bd
392	\N	Kaladara	কালাদরপ	kaladarapup.noakhali.gov.bd
393	\N	Ashwadia	অশ্বদিয়া	ashwadiaup.noakhali.gov.bd
394	\N	Newajpur	নিয়াজপুর	newajpurup.noakhali.gov.bd
395	\N	East Charmatua	পূর্ব চরমটুয়া	eastcharmatuap.noakhali.gov.bd
396	\N	Andarchar	আন্ডারচর	andarcharup.noakhali.gov.bd
397	\N	Noakhali	নোয়াখালী	noakhaliup.noakhali.gov.bd
398	\N	Sirajpur	সিরাজপুর	sirajpurup.noakhali.gov.bd
399	\N	Charparboti	চরপার্বতী	charparbotiup.noakhali.gov.bd
400	\N	Charhazari	চরহাজারী	charhazariup.noakhali.gov.bd
401	\N	Charkakra	চরকাঁকড়া	charkakraup.noakhali.gov.bd
402	\N	Charfakira	চরফকিরা	charfakiraup.noakhali.gov.bd
403	\N	Musapur	মুসাপুর	musapurup.noakhali.gov.bd
404	\N	Charelahi	চরএলাহী	charelahiup.noakhali.gov.bd
405	\N	Rampur	রামপুর	rampurup.noakhali.gov.bd
406	\N	Amanullapur	আমানউল্ল্যাপুর	amanullapurup.noakhali.gov.bd
407	\N	Gopalpur	গোপালপুর	gopalpurup.noakhali.gov.bd
408	\N	Jirtali	জিরতলী	jirtaliup.noakhali.gov.bd
409	\N	Kutubpur	কুতবপুর	kutubpurup.noakhali.gov.bd
410	\N	Alyearpur	আলাইয়ারপুর	alyearpurup.noakhali.gov.bd
411	\N	Chayani	ছয়ানী	chayaniup.noakhali.gov.bd
412	\N	Rajganj	রাজগঞ্জ	rajganjup.noakhali.gov.bd
413	\N	Eklashpur	একলাশপুর	eklashpurup.noakhali.gov.bd
414	\N	Begumganj	বেগমগঞ্জ	begumganjup.noakhali.gov.bd
415	\N	Mirwarishpur	মিরওয়ারিশপুর	mirwarishpurup.noakhali.gov.bd
416	\N	Narottampur	নরোত্তমপুর	narottampurup.noakhali.gov.bd
417	\N	Durgapur	দূর্গাপুর	durgapurup.noakhali.gov.bd
418	\N	Rasulpur	রসুলপুর	rasulpurup.noakhali.gov.bd
419	\N	Hajipur	হাজীপুর	hajipurup.noakhali.gov.bd
420	\N	Sharifpur	শরীফপুর	sharifpurup.noakhali.gov.bd
421	\N	Kadirpur	কাদিরপুর	kadirpurup.noakhali.gov.bd
422	\N	Sukhchar	সুখচর	sukhcharup.noakhali.gov.bd
423	\N	Nolchira	নলচিরা	nolchiraup.noakhali.gov.bd
424	\N	Charishwar	চরঈশ্বর	charishwarup.noakhali.gov.bd
425	\N	Charking	চরকিং	charkingup.noakhali.gov.bd
426	\N	Tomoroddi	তমরদ্দি	tomoroddiup.noakhali.gov.bd
427	\N	Sonadiya	সোনাদিয়া	sonadiyaup.noakhali.gov.bd
428	\N	Burirchar	বুড়িরচর	burircharup.noakhali.gov.bd
429	\N	Jahajmara	জাহাজমারা	jahajmaraup.noakhali.gov.bd
430	\N	Nijhumdwi	নিঝুমদ্বীপ	nijhumdwipup.noakhali.gov.bd
431	\N	Charjabbar	চরজাব্বার	charjabbarup.noakhali.gov.bd
432	\N	Charbata	চরবাটা	charbataup.noakhali.gov.bd
433	\N	Charclerk	চরক্লার্ক	charclerkup.noakhali.gov.bd
434	\N	Charwapda	চরওয়াপদা	charwapdaup.noakhali.gov.bd
435	\N	Charjubilee	চরজুবলী	charjubileeup.noakhali.gov.bd
436	\N	Charaman Ullah	চরআমান উল্যা	charamanullahup.noakhali.gov.bd
437	\N	East Charbata	পূর্ব চরবাটা	eastcharbataup.noakhali.gov.bd
438	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.noakhali.gov.bd
439	\N	Narottampur	নরোত্তমপুর	narottampurup1.noakhali.gov.bd
440	\N	Dhanshiri	ধানসিঁড়ি	dhanshiriup.noakhali.gov.bd
441	\N	Sundalpur	সুন্দলপুর	sundalpurup.noakhali.gov.bd
442	\N	Ghoshbag	ঘোষবাগ	ghoshbagup.noakhali.gov.bd
443	\N	Chaprashirhat	চাপরাশিরহাট	chaprashirhatup.noakhali.gov.bd
444	\N	Dhanshalik	ধানশালিক	dhanshalikup.noakhali.gov.bd
445	\N	Batoiya	বাটইয়া	batoiyaup.noakhali.gov.bd
446	\N	Chhatarpaia	ছাতারপাইয়া	chhatarpaiaup.noakhali.gov.bd
447	\N	Kesharpar	কেশরপাড়া	kesharparup.noakhali.gov.bd
448	\N	Dumurua	ডুমুরুয়া	dumuruaup.noakhali.gov.bd
449	\N	Kadra	কাদরা	kadraup.noakhali.gov.bd
450	\N	Arjuntala	অর্জুনতলা	arjuntalaup.noakhali.gov.bd
451	\N	Kabilpur	কাবিলপুর	kabilpurup.noakhali.gov.bd
452	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup7.noakhali.gov.bd
453	\N	Nabipur	নবীপুর	nabipurup.noakhali.gov.bd
454	\N	Bejbagh	বিজবাগ	bejbaghup.noakhali.gov.bd
455	\N	Sahapur	সাহাপুর	sahapurup.noakhali.gov.bd
456	\N	Ramnarayanpur	রামনারায়নপুর	ramnarayanpurup.noakhali.gov.bd
457	\N	Porokote	পরকোট	porokoteup.noakhali.gov.bd
458	\N	Badalkot	বাদলকোট	badalkotup.noakhali.gov.bd
459	\N	Panchgaon	পাঁচগাঁও	panchgaonup.noakhali.gov.bd
460	\N	Hat-Pukuria Ghatlabag	হাট-পুকুরিয়া ঘাটলাবাগ	hatpukuriaghatlabagup.noakhali.gov.bd
461	\N	Noakhala	নোয়াখলা	noakhalaup.noakhali.gov.bd
462	\N	Khilpara	খিলপাড়া	khilparaup.noakhali.gov.bd
463	\N	Mohammadpur	মোহাম্মদপুর	mohammadpuru5p.noakhali.gov.bd
464	\N	Joyag	জয়াগ	joyagup.noakhali.gov.bd
465	\N	Nodona	নদনা	nodonaup.noakhali.gov.bd
466	\N	Chashirhat	চাষীরহাট	chashirhatup.noakhali.gov.bd
467	\N	Barogaon	বারগাঁও	barogaonup.noakhali.gov.bd
468	\N	Ambarnagor	অম্বরনগর	ambarnagorup.noakhali.gov.bd
469	\N	Nateshwar	নাটেশ্বর	nateshwarup.noakhali.gov.bd
470	\N	Bajra	বজরা	bajraup.noakhali.gov.bd
471	\N	Sonapur	সোনাপুর	sonapurup.noakhali.gov.bd
472	\N	Deoti	দেওটি	deotiup.noakhali.gov.bd
473	\N	Amishapara	আমিশাপাড়া	amishaparaup.noakhali.gov.bd
474	\N	Gazipur	গাজীপুর	gazipurup.chandpur.gov.bd
475	\N	Algidurgapur (North)	আলগী দুর্গাপুর (উত্তর)	algidurgapurnorthup.chandpur.gov.bd
476	\N	Algidurgapur (South)	আলগী দুর্গাপুর (দক্ষিণ)	algidurgapursouth.chandpur.gov.bd
477	\N	Nilkamal	নীলকমল	nilkamalup.chandpur.gov.bd
478	\N	Haimchar	হাইমচর	haimcharup.chandpur.gov.bd
479	\N	Charbhairabi	চরভৈরবী	charbhairabiup.chandpur.gov.bd
480	\N	Pathair	পাথৈর	pathairup.chandpur.gov.bd
481	\N	Bitara	বিতারা	bitaraup.chandpur.gov.bd
482	\N	Shohodebpur (East)	সহদেবপুর (পূর্ব)	shohodebpureastup.chandpur.gov.bd
483	\N	Shohodebpur (West)	সহদেবপুর (পশ্চিম)	shohodebpurwestup.chandpur.gov.bd
484	\N	Kachua (North)	কচুয়া (উত্তর)	kachuanorthup.chandpur.gov.bd
485	\N	Kachua (South)	কচুয়া (দক্ষিণ)	kachuasouthup.chandpur.gov.bd
486	\N	Gohat (North)	গোহাট (উত্তর)	gohatnorthup.chandpur.gov.bd
487	\N	Kadla	কাদলা	kadlaup.chandpur.gov.bd
488	\N	Ashrafpur	আসরাফপুর	ashrafpurup.chandpur.gov.bd
489	\N	Gohat (South)	গোহাট (দক্ষিণ)	gohatsouthup.chandpur.gov.bd
490	\N	Sachar	সাচার	sacharup.chandpur.gov.bd
491	\N	Koroia	কড়ইয়া	koroiaup.chandpur.gov.bd
492	\N	Tamta (South)	টামটা (দক্ষিণ)	tamtasouthup.chandpur.gov.bd
493	\N	Tamta (North)	টামটা (উত্তর)	tamtanorthup.chandpur.gov.bd
494	\N	Meher (North)	মেহের (উত্তর)	mehernorthup.chandpur.gov.bd
495	\N	Meher (South)	মেহের (দক্ষিণ)	mehersouthup.chandpur.gov.bd
496	\N	Suchipara (North)	সুচিপাড়া (উত্তর)	suchiparanorthup.chandpur.gov.bd
497	\N	Suchipara (South)	সুচিপাড়া (দক্ষিণ)	suchiparasouthup.chandpur.gov.bd
498	\N	Chitoshi (East)	চিতষী (পূর্ব)	chitoshieastup.chandpur.gov.bd
499	\N	Raysree (South)	রায়শ্রী (দক্ষিন)	raysreesouthup.chandpur.gov.bd
500	\N	Raysree (North)	রায়শ্রী (উত্তর)	raysreenorthup.chandpur.gov.bd
501	\N	Chitoshiwest	চিতষী (পশ্চিম)	chitoshiwestup.chandpur.gov.bd
502	\N	Bishnapur	বিষ্ণপুর	bishnapurup.chandpur.gov.bd
503	\N	Ashikati	আশিকাটি	ashikatiup.chandpur.gov.bd
504	\N	Shahmahmudpur	শাহ্‌ মাহমুদপুর	shahmahmudpurup.chandpur.gov.bd
505	\N	Kalyanpur	কল্যাণপুর	kalyanpurup.chandpur.gov.bd
506	\N	Rampur	রামপুর	rampurup.chandpur.gov.bd
507	\N	Maishadi	মৈশাদী	maishadiup.chandpur.gov.bd
508	\N	Tarpurchandi	তরপুচন্ডী	tarpurchandiup.chandpur.gov.bd
509	\N	Baghadi	বাগাদী	baghadiup.chandpur.gov.bd
510	\N	Laxmipur Model	লক্ষীপুর মডেল	laxmipurmodelup.chandpur.gov.bd
511	\N	Hanarchar	হানারচর	hanarcharup.chandpur.gov.bd
512	\N	Chandra	চান্দ্রা	chandraup.chandpur.gov.bd
513	\N	Rajrajeshwar	রাজরাজেশ্বর	rajrajeshwarup.chandpur.gov.bd
514	\N	Ibrahimpur	ইব্রাহীমপুর	ibrahimpurup.chandpur.gov.bd
515	\N	Balia	বালিয়া	baliaup.chandpur.gov.bd
516	\N	Nayergaon (North)	নায়েরগাঁও (উত্তর)	nayergaonnorthup.chandpur.gov.bd
517	\N	Nayergaon (South)	নায়েরগাঁও (দক্ষিন)	nayergaonsouthup.chandpur.gov.bd
518	\N	Khadergaon	খাদেরগাঁও	khadergaonup.chandpur.gov.bd
519	\N	Narayanpur	নারায়নপুর	narayanpurup.chandpur.gov.bd
520	\N	Upadi (South)	উপাদী (দক্ষিণ)	upadisouthup.chandpur.gov.bd
521	\N	Upadi (North)	উপাদী (উত্তর)	upadinorthup.chandpur.gov.bd
522	\N	Rajargaon (North)	রাজারগাঁও (উত্তর)	rajargaonnorthup.chandpur.gov.bd
523	\N	Bakila	বাকিলা	bakilaup.chandpur.gov.bd
524	\N	Kalocho (North)	কালচোঁ (উত্তর)	kalochonorthup.chandpur.gov.bd
525	\N	Hajiganj Sadar	হাজীগঞ্জ সদর	hajiganjsadarup.chandpur.gov.bd
526	\N	Kalocho (South)	কালচোঁ (দক্ষিণ)	kalochosouthup.chandpur.gov.bd
527	\N	Barkul (East)	বড়কুল (পূর্ব)	barkuleastup.chandpur.gov.bd
528	\N	Barkul (West)	বড়কুল (পশ্চিম)	barkulwestup.chandpur.gov.bd
529	\N	Hatila (East)	হাটিলা (পূর্ব)	hatilaeastup.chandpur.gov.bd
530	\N	Hatila (West)	হাটিলা (পশ্চিম)	hatilawestup.chandpur.gov.bd
531	\N	Gandharbapur (North)	গন্ধর্ব্যপুর (উত্তর)	gandharbapurnorthup.chandpur.gov.bd
532	\N	Gandharbapur (South)	গন্ধর্ব্যপুর (দক্ষিণ)	gandharbapursouthup.chandpur.gov.bd
533	\N	Satnal	ষাটনল	satnalup.chandpur.gov.bd
534	\N	Banganbari	বাগানবাড়ী	banganbariup.chandpur.gov.bd
535	\N	Sadullapur	সাদুল্ল্যাপুর	sadullapurup.chandpur.gov.bd
536	\N	Durgapur	দূর্গাপুর	durgapurup.chandpur.gov.bd
537	\N	Kalakanda	কালাকান্দা	kalakandaup.chandpur.gov.bd
538	\N	Mohanpur	মোহনপুর	mohanpurup.chandpur.gov.bd
539	\N	Eklaspur	এখলাছপুর	eklaspurup.chandpur.gov.bd
540	\N	Jahirabad	জহিরাবাদ	jahirabadup.chandpur.gov.bd
541	\N	Fatehpur (East)	ফতেহপুর (পূর্ব)	eastfatehpur.chandpur.gov.bd
542	\N	Fatehpur (West)	ফতেহপুর (পশ্চিম)	westfatehpurup.chandpur.gov.bd
543	\N	Farajikandi	ফরাজীকান্দি	farajikandiup.chandpur.gov.bd
544	\N	Islamabad	ইসলামাবাদ	islamabadup.chandpur.gov.bd
545	\N	Sultanabad	সুলতানাবাদ	sultanabadup.chandpur.gov.bd
546	\N	Gazra	গজরা	gazraup.chandpur.gov.bd
547	\N	Balithuba (West)	বালিথুবা (পশ্চিম)	balithubawestup.chandpur.gov.bd
548	\N	Balithuba (East)	বালিথুবা (পূর্ব)	balithubaeastup.chandpur.gov.bd
549	\N	Subidpur (East)	সুবিদপুর (পূর্ব)	subidpureastup.chandpur.gov.bd
550	\N	Subidpur (West)	সুবিদপুর (পশ্চিম)	subidpurwestup.chandpur.gov.bd
551	\N	Gupti (West)	গুপ্তি (পশ্চিম)	guptiwestup.chandpur.gov.bd
552	\N	Gupti (East)	গুপ্তি (পূর্ব)	guptieastup.chandpur.gov.bd
553	\N	Paikpara (North)	পাইকপাড়া (উত্তর)	paikparanorthup.chandpur.gov.bd
554	\N	Paikpara (South)	পাইকপাড়া (দক্ষিণ)	paikparasouthup.chandpur.gov.bd
555	\N	Gobindapur (North)	গবিন্দপুর (উত্তর)	gobindapurnorthup.chandpur.gov.bd
556	\N	Gobindapur (South)	গবিন্দপুর (দক্ষিণ)	gobindapursouthup.chandpur.gov.bd
557	\N	Chardukhia (East)	চরদুখিয়া (পূর্ব)	chardukhiaeastup.chandpur.gov.bd
558	\N	Chardukhia (West)	চরদুঃখিয়া (পশ্চিম)	chardukhiawestup.chandpur.gov.bd
559	\N	Faridgonj (South)	ফরিদ্গঞ্জ (দক্ষিণ)	faridgonjsouthup.chandpur.gov.bd
560	\N	Rupsha (South)	রুপসা (দক্ষিণ)	rupshasouthup.chandpur.gov.bd
561	\N	Rupsha (North)	রুপসা (উত্তর)	rupshanorthup.chandpur.gov.bd
562	\N	Hamsadi (North)	হামছাদী (উত্তর)	northhamsadiup.lakshmipur.gov.bd
563	\N	Hamsadi (South)	হামছাদী (দক্ষিন)	southhamsadiup.lakshmipur.gov.bd
564	\N	Dalalbazar	দালাল বাজার	dalalbazarup.lakshmipur.gov.bd
565	\N	Charruhita	চররুহিতা	charruhitaup.lakshmipur.gov.bd
566	\N	Parbotinagar	পার্বতীনগর	parbotinagarup.lakshmipur.gov.bd
567	\N	Bangakha	বাঙ্গাখাঁ	bangakhaup.lakshmipur.gov.bd
568	\N	Dattapara	দত্তপাড়া	dattaparaup.lakshmipur.gov.bd
569	\N	Basikpur	বশিকপুর	basikpurup.lakshmipur.gov.bd
570	\N	Chandrogonj	চন্দ্রগঞ্জ	chandrogonjup.lakshmipur.gov.bd
571	\N	Nourthjoypur	উত্তর জয়পুর	nourthjoypurup.lakshmipur.gov.bd
572	\N	Hazirpara	হাজিরপাড়া	hazirparaup.lakshmipur.gov.bd
573	\N	Charshahi	চরশাহী	charshahiup.lakshmipur.gov.bd
574	\N	Digli	দিঘলী	digliup.lakshmipur.gov.bd
575	\N	Laharkandi	লাহারকান্দি	laharkandiup.lakshmipur.gov.bd
576	\N	Vobanigonj	ভবানীগঞ্জ	vobanigonjup.lakshmipur.gov.bd
577	\N	Kusakhali	কুশাখালী	kusakhaliup.lakshmipur.gov.bd
578	\N	Sakchor	শাকচর	sakchorup.lakshmipur.gov.bd
579	\N	Tearigonj	তেয়ারীগঞ্জ	tearigonjup.lakshmipur.gov.bd
580	\N	Tumchor	টুমচর	tumchorup.lakshmipur.gov.bd
581	\N	Charramoni Mohon	চররমনী মোহন	charramonimohonup.lakshmipur.gov.bd
582	\N	Charkalkini	চর কালকিনি	charkalkiniup.lakshmipur.gov.bd
583	\N	Shaheberhat	সাহেবেরহাট	shaheberhatup.lakshmipur.gov.bd
584	\N	Char Martin	চর মার্টিন	charmartinup.lakshmipur.gov.bd
585	\N	Char Folcon	চর ফলকন	charfolconup.lakshmipur.gov.bd
586	\N	Patarirhat	পাটারীরহাট	patarirhatup.lakshmipur.gov.bd
587	\N	Hajirhat	হাজিরহাট	hajirhatup.lakshmipur.gov.bd
588	\N	Char Kadira	চর কাদিরা	charkadiraup.lakshmipur.gov.bd
589	\N	Torabgonj	তোরাবগঞ্জ	torabgonjup.lakshmipur.gov.bd
590	\N	Charlorench	চর লরেঞ্চ	charlorenchup.lakshmipur.gov.bd
591	\N	North Char Ababil	উত্তর চর আবাবিল	northcharababilup.lakshmipur.gov.bd
592	\N	North Char Bangshi	উত্তর চর বংশী	northcharbangshiup.lakshmipur.gov.bd
593	\N	Char Mohana	চর মোহনা	charmohanaup.lakshmipur.gov.bd
594	\N	Sonapur	সোনাপুর	sonapurup.lakshmipur.gov.bd
595	\N	Charpata	চর পাতা	charpataup.lakshmipur.gov.bd
596	\N	Bamni	বামনী	bamniup.lakshmipur.gov.bd
597	\N	South Char Bangshi	দক্ষিন চর বংশী	southcharbangshiup.lakshmipur.gov.bd
598	\N	South Char Ababil	দক্ষিন চর আবাবিল	southcharababilup.lakshmipur.gov.bd
599	\N	Raipur	রায়পুর	raipurup.lakshmipur.gov.bd
600	\N	Keora	কেরোয়া	keoraup.lakshmipur.gov.bd
601	\N	Char Poragacha	চর পোড়াগাছা	charporagachaup.lakshmipur.gov.bd
602	\N	Charbadam	চর বাদাম	charbadamup.lakshmipur.gov.bd
603	\N	Char Abdullah	চর আবদুল্যাহ	charabdullahup.lakshmipur.gov.bd
604	\N	Alxendar	আলেকজান্ডার	alxendarup.lakshmipur.gov.bd
605	\N	Char Algi	চর আলগী	charalgiup.lakshmipur.gov.bd
606	\N	Char Ramiz	চর রমিজ	charramizup.lakshmipur.gov.bd
607	\N	Borokheri	বড়খেড়ী	borokheriup.lakshmipur.gov.bd
608	\N	Chargazi	চরগাজী	chargaziup.lakshmipur.gov.bd
609	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.lakshmipur.gov.bd
610	\N	Noagaon	নোয়াগাঁও	noagaonup.lakshmipur.gov.bd
611	\N	Bhadur	ভাদুর	bhadurup.lakshmipur.gov.bd
612	\N	Ichhapur	ইছাপুর	ichhapurup.lakshmipur.gov.bd
613	\N	Chandipur	চন্ডিপুর	chandipurup.lakshmipur.gov.bd
614	\N	Lamchar	লামচর	lamcharup.lakshmipur.gov.bd
615	\N	Darbeshpur	দরবেশপুর	darbeshpurup.lakshmipur.gov.bd
616	\N	Karpara	করপাড়া	karparaup.lakshmipur.gov.bd
617	\N	Bholakot	ভোলাকোট	bholakotup.lakshmipur.gov.bd
618	\N	Bhatra	ভাটরা	bhatraup.lakshmipur.gov.bd
619	\N	Rajanagar	রাজানগর	rajanagarup.chittagong.gov.bd
620	\N	Hosnabad	হোছনাবাদ	hosnabadup.chittagong.gov.bd
621	\N	Swanirbor Rangunia	স্বনির্ভর রাঙ্গুনিয়া	swanirborranguniaup.chittagong.gov.bd
622	\N	Mariumnagar	মরিয়মনগর	mariumnagarup.chittagong.gov.bd
623	\N	Parua	পারুয়া	paruaup.chittagong.gov.bd
624	\N	Pomra	পোমরা	pomraup.chittagong.gov.bd
625	\N	Betagi	বেতাগী	betagiup.chittagong.gov.bd
626	\N	Sharafbhata	সরফভাটা	sharafbhataup.chittagong.gov.bd
627	\N	Shilok	শিলক	shilokup.chittagong.gov.bd
628	\N	Chandraghona	চন্দ্রঘোনা	chandraghonaup.chittagong.gov.bd
629	\N	Kodala	কোদালা	kodalaup.chittagong.gov.bd
630	\N	Islampur	ইসলামপুর	islampurup.chittagong.gov.bd
631	\N	South Rajanagar	দক্ষিণ রাজানগর	southrajanagarup.chittagong.gov.bd
632	\N	Lalanagar	লালানগর	lalanagarup.chittagong.gov.bd
633	\N	Kumira	কুমিরা	kumiraup.chittagong.gov.bd
634	\N	Banshbaria	বাঁশবারীয়া	banshbariaup.chittagong.gov.bd
635	\N	Barabkunda	বারবকুন্ড	barabkundaup.chittagong.gov.bd
636	\N	Bariadyala	বাড়িয়াডিয়ালা	bariadyalaup.chittagong.gov.bd
637	\N	Muradpur	মুরাদপুর	muradpurup.chittagong.gov.bd
638	\N	Saidpur	সাঈদপুর	saidpurup.chittagong.gov.bd
639	\N	Salimpur	সালিমপুর	salimpurup.chittagong.gov.bd
640	\N	Sonaichhari	সোনাইছড়ি	sonaichhariup.chittagong.gov.bd
641	\N	Bhatiari	ভাটিয়ারী	bhatiariup.chittagong.gov.bd
642	\N	Korerhat	করেরহাট	korerhatup.chittagong.gov.bd
643	\N	Hinguli	হিংগুলি	hinguliup.chittagong.gov.bd
644	\N	Jorarganj	জোরারগঞ্জ	jorarganjup.chittagong.gov.bd
645	\N	Dhoom	ধুম	dhoomup.chittagong.gov.bd
646	\N	Osmanpur	ওসমানপুর	osmanpurup.chittagong.gov.bd
647	\N	Ichakhali	ইছাখালী	ichakhaliup.chittagong.gov.bd
648	\N	Katachhara	কাটাছরা	katachharaup.chittagong.gov.bd
649	\N	Durgapur	দূর্গাপুর	durgapurup.chittagong.gov.bd
650	\N	Mirsharai	মীরসরাই	mirsharaiup.chittagong.gov.bd
651	\N	Mithanala	মিঠানালা	mithanalaup.chittagong.gov.bd
652	\N	Maghadia	মঘাদিয়া	maghadiaup.chittagong.gov.bd
653	\N	Khaiyachhara	খৈয়াছরা	khaiyachharaup.chittagong.gov.bd
654	\N	Mayani	মায়ানী	mayaniup.chittagong.gov.bd
655	\N	Haitkandi	হাইতকান্দি	haitkandiup.chittagong.gov.bd
656	\N	Wahedpur	ওয়াহেদপুর	wahedpurup.chittagong.gov.bd
657	\N	Saherkhali	সাহেরখালী	saherkhaliup.chittagong.gov.bd
658	\N	Asia	আশিয়া	asiaup.chittagong.gov.bd
659	\N	Kachuai	কাচুয়াই	kachuaiup.chittagong.gov.bd
660	\N	Kasiais	কাশিয়াইশ	kasiaisup.chittagong.gov.bd
661	\N	Kusumpura	কুসুমপুরা	kusumpuraup.chittagong.gov.bd
662	\N	Kelishahar	কেলিশহর	kelishaharup.chittagong.gov.bd
663	\N	Kolagaon	কোলাগাঁও	kolagaonup.chittagong.gov.bd
664	\N	Kharana	খরনা	kharanaup.chittagong.gov.bd
665	\N	Char Patharghata	চর পাথরঘাটা	charpatharghataup.chittagong.gov.bd
666	\N	Char Lakshya	চর লক্ষ্যা	charlakshyaup.chittagong.gov.bd
667	\N	Chanhara	ছনহরা	chanharaup.chittagong.gov.bd
668	\N	Janglukhain	জঙ্গলখাইন	janglukhainup.chittagong.gov.bd
669	\N	Jiri	জিরি	jiriup.chittagong.gov.bd
670	\N	Juldha	জুলধা	juldhaup.chittagong.gov.bd
671	\N	Dakkhin Bhurshi	দক্ষিণ ভূর্ষি	dakhinbhurshiup.chittagong.gov.bd
672	\N	Dhalghat	ধলঘাট	dhalghatup.chittagong.gov.bd
673	\N	Bara Uthan	বড় উঠান	barauthanup.chittagong.gov.bd
674	\N	Baralia	বরলিয়া	baraliaup.chittagong.gov.bd
675	\N	Bhatikhain	ভাটিখাইন	bhatikhainup.chittagong.gov.bd
676	\N	Sikalbaha	শিকলবাহা	sikalbahaup.chittagong.gov.bd
677	\N	Sobhandandi	শোভনদন্ডী	sobhandandiup.chittagong.gov.bd
678	\N	Habilasdwi	হাবিলাসদ্বীপ	habilasdwipup.chittagong.gov.bd
679	\N	Haidgaon	হাইদগাঁও	haidgaonup.chittagong.gov.bd
680	\N	Rahmatpur	রহমতপুর	rahmatpurup.chittagong.gov.bd
681	\N	Harispur	হরিশপুর	harispurup.chittagong.gov.bd
682	\N	Kalapania	কালাপানিয়া	kalapaniaup.chittagong.gov.bd
683	\N	Amanullah	আমানউল্যা	amanullahup.chittagong.gov.bd
684	\N	Santoshpur	সন্তোষপুর	santoshpurup.chittagong.gov.bd
685	\N	Gachhua	গাছুয়া	gachhuaup.chittagong.gov.bd
686	\N	Bauria	বাউরিয়া	bauriaup.chittagong.gov.bd
687	\N	Haramia	হারামিয়া	haramiaup.chittagong.gov.bd
688	\N	Magdhara	মগধরা	magdharaup.chittagong.gov.bd
689	\N	Maitbhanga	মাইটভাঙ্গা	maitbhangaup.chittagong.gov.bd
690	\N	Sarikait	সারিকাইত	sarikaitup.chittagong.gov.bd
691	\N	Musapur	মুছাপুর	musapurup.chittagong.gov.bd
692	\N	Azimpur	আজিমপুর	azimpurup.chittagong.gov.bd
693	\N	Urirchar	উড়িরচর	urircharup.chittagong.gov.bd
694	\N	Pukuria	পুকুরিয়া	pukuriaup.chittagong.gov.bd
695	\N	Sadhanpur	সাধনপুর	sadhanpurup.chittagong.gov.bd
696	\N	Khankhanabad	খানখানাবাদ	khankhanabadup.chittagong.gov.bd
697	\N	Baharchhara	বাহারছড়া	baharchharaup.chittagong.gov.bd
698	\N	Kalipur	কালীপুর	kalipurup.chittagong.gov.bd
699	\N	Bailchhari	বৈলছড়ি	bailchhariup.chittagong.gov.bd
700	\N	Katharia	কাথরিয়া	kathariaup.chittagong.gov.bd
701	\N	Saral	সরল	saralup.chittagong.gov.bd
702	\N	Silk	শীলকুপ	silkupup.chittagong.gov.bd
703	\N	Chambal	চাম্বল	chambalup.chittagong.gov.bd
704	\N	Gandamara	গন্ডামারা	gandamaraup.chittagong.gov.bd
705	\N	Sekherkhil	শেখেরখীল	sekherkhilup.chittagong.gov.bd
706	\N	Puichhari	পুঁইছড়ি	puichhariup.chittagong.gov.bd
707	\N	Chhanua	ছনুয়া	chhanuaup.chittagong.gov.bd
708	\N	Kandhurkhil	কধুরখীল	kandhurkhilup.chittagong.gov.bd
709	\N	Pashchim Gamdandi	পশ্চিম গোমদন্ডী	pashchimgamdandiup.chittagong.gov.bd
710	\N	Purba Gomdandi	পুর্ব গোমদন্ডী	purbagomdandiup.chittagong.gov.bd
711	\N	Sakpura	শাকপুরা	sakpuraup.chittagong.gov.bd
712	\N	Saroatali	সারোয়াতলী	saroataliup.chittagong.gov.bd
713	\N	Popadia	পোপাদিয়া	popadiaup.chittagong.gov.bd
714	\N	Charandwi	চরনদ্বীপ	charandwipup.chittagong.gov.bd
715	\N	Sreepur-Kharandwi	শ্রীপুর-খরন্দীপ	sreepurkharandwipup.chittagong.gov.bd
716	\N	Amuchia	আমুচিয়া	amuchiaup.chittagong.gov.bd
717	\N	Ahla Karaldenga	আহল্লা করলডেঙ্গা	ahlakaraldengaup.chittagong.gov.bd
718	\N	Boirag	বৈরাগ	boiragup.chittagong.gov.bd
719	\N	Barasat	বারশত	barasatup.chittagong.gov.bd
720	\N	Raipur	রায়পুর	raipurup.chittagong.gov.bd
721	\N	Battali	বটতলী	battaliup.chittagong.gov.bd
722	\N	Barumchara	বরম্নমচড়া	barumcharaup.chittagong.gov.bd
723	\N	Baroakhan	বারখাইন	baroakhanup.chittagong.gov.bd
724	\N	Anwara	আনোয়ারা	anwaraup.chittagong.gov.bd
725	\N	Chatari	চাতরী	chatariup.chittagong.gov.bd
726	\N	Paraikora	পরৈকোড়া	paraikoraup.chittagong.gov.bd
727	\N	Haildhar	হাইলধর	haildharup.chittagong.gov.bd
728	\N	Juidandi	জুঁইদন্ডী	juidandiup.chittagong.gov.bd
729	\N	Kanchanabad	কাঞ্চনাবাদ	kanchanabadup.chittagong.gov.bd
730	\N	Joara	জোয়ারা	joaraup.chittagong.gov.bd
731	\N	Barkal	বরকল	barkalup.chittagong.gov.bd
732	\N	Barama	বরমা	baramaup.chittagong.gov.bd
733	\N	Bailtali	বৈলতলী	bailtaliup.chittagong.gov.bd
734	\N	Satbaria	সাতবাড়িয়া	satbariaup.chittagong.gov.bd
735	\N	Hashimpur	হাশিমপুর	hashimpurup.chittagong.gov.bd
736	\N	Dohazari	দোহাজারী	dohazariup.chittagong.gov.bd
737	\N	Dhopachhari	ধোপাছড়ী	dhopachhariup.chittagong.gov.bd
738	\N	Charati	চরতী	charatiup.chittagong.gov.bd
739	\N	Khagaria	খাগরিয়া	khagariaup.chittagong.gov.bd
740	\N	Nalua	নলুয়া	naluaup.chittagong.gov.bd
741	\N	Kanchana	কাঞ্চনা	kanchanaup.chittagong.gov.bd
742	\N	Amilaisi	আমিলাইশ	amilaisiup.chittagong.gov.bd
743	\N	Eochiai	এওচিয়া	eochiaiup.chittagong.gov.bd
744	\N	Madarsa	মাদার্শা	madarsaup.chittagong.gov.bd
745	\N	Dhemsa	ঢেমশা	dhemsaup.chittagong.gov.bd
746	\N	Paschim Dhemsa	পশ্চিম ঢেমশা	paschimdhemsaup.chittagong.gov.bd
747	\N	Keochia	কেঁওচিয়া	keochiaup.chittagong.gov.bd
748	\N	Kaliais	কালিয়াইশ	kaliaisup.chittagong.gov.bd
749	\N	Bazalia	বাজালিয়া	bazaliaup.chittagong.gov.bd
750	\N	Puranagar	পুরানগড়	puranagarup.chittagong.gov.bd
751	\N	Sadaha	ছদাহা	sadahaup.chittagong.gov.bd
752	\N	Satkania	সাতকানিয়া	satkaniaup.chittagong.gov.bd
753	\N	Sonakania	সোনাকানিয়া	sonakaniaup.chittagong.gov.bd
754	\N	Padua	পদুয়া	paduaup.chittagong.gov.bd
755	\N	Barahatia	বড়হাতিয়া	barahatiaup.chittagong.gov.bd
756	\N	Amirabad	আমিরাবাদ	amirabadup.chittagong.gov.bd
757	\N	Charamba	চরম্বা	charambaup.chittagong.gov.bd
758	\N	Kalauzan	কলাউজান	kalauzanup.chittagong.gov.bd
759	\N	Lohagara	লোহাগাড়া	lohagaraup.chittagong.gov.bd
760	\N	Putibila	পুটিবিলা	putibilaup.chittagong.gov.bd
761	\N	Chunati	চুনতি	chunatiup.chittagong.gov.bd
762	\N	Adhunagar	আধুনগর	adhunagarup.chittagong.gov.bd
763	\N	Farhadabad	ফরহাদাবাদ	farhadabadup.chittagong.gov.bd
764	\N	Dhalai	ধলই	dhalaiup.chittagong.gov.bd
765	\N	Mirjapur	মির্জাপুর	mirjapurup.chittagong.gov.bd
766	\N	Nangolmora	নাঙ্গলমোরা	nangolmoraup.chittagong.gov.bd
767	\N	Gomanmordan	গুমানমর্দ্দন	gomanmordanup.chittagong.gov.bd
768	\N	Chipatali	ছিপাতলী	chipataliup.chittagong.gov.bd
769	\N	Mekhal	মেখল	mekhalup.chittagong.gov.bd
770	\N	Garduara	গড়দুয়ারা	garduaraup.chittagong.gov.bd
771	\N	Fathepur	ফতেপুর	fathepurup.chittagong.gov.bd
772	\N	Chikondandi	চিকনদন্ডী	chikondandiup.chittagong.gov.bd
773	\N	Uttar Madrasha	উত্তর মাদার্শা	uttarmadrashaup.chittagong.gov.bd
774	\N	Dakkin Madrasha	দক্ষিন মাদার্শা	dakkinmadrashaup.chittagong.gov.bd
775	\N	Sikarpur	শিকারপুর	sikarpurup.chittagong.gov.bd
776	\N	Budirchar	বুডিরশ্চর	budircharup.chittagong.gov.bd
777	\N	Hathazari	হাটহাজারী	hathazariup.chittagong.gov.bd
778	\N	Dharmapur	ধর্মপুর	dharmapurup.chittagong.gov.bd
779	\N	Baganbazar	বাগান বাজার	baganbazarup.chittagong.gov.bd
780	\N	Dantmara	দাঁতমারা	dantmaraup.chittagong.gov.bd
781	\N	Narayanhat	নারায়নহাট	narayanhatup.chittagong.gov.bd
782	\N	Bhujpur	ভূজপুর	bhujpurup.chittagong.gov.bd
783	\N	Harualchari	হারুয়ালছড়ি	harualchariup.chittagong.gov.bd
784	\N	Paindong	পাইনদং	paindongup.chittagong.gov.bd
785	\N	Kanchannagor	কাঞ্চনগর	kanchannagorup.chittagong.gov.bd
786	\N	Sunderpur	সুনদরপুর	sunderpurup.chittagong.gov.bd
787	\N	Suabil	সুয়াবিল	Suabilup.chittagong.gov.bd
788	\N	Abdullapur	আবদুল্লাপুর	abdullapurup.chittagong.gov.bd
789	\N	Samitirhat	সমিতির হাট	samitirhatup.chittagong.gov.bd
790	\N	Jafathagar	জাফতনগর	jafathagarup.chittagong.gov.bd
791	\N	Bokhtapur	বক্তপুর	bokhtapurup.chittagong.gov.bd
792	\N	Roshangiri	রোসাংগিরী	roshangiriup.chittagong.gov.bd
793	\N	Nanupur	নানুপুর	nanupurup.chittagong.gov.bd
794	\N	Lelang	লেলাং	lelangup.chittagong.gov.bd
795	\N	Daulatpur	দৌলতপুর	daulatpurup.chittagong.gov.bd
796	\N	Raozan	রাউজান	raozanup.chittagong.gov.bd
797	\N	Bagoan	বাগোয়ান	bagoanup.chittagong.gov.bd
798	\N	Binajuri	বিনাজুরী	binajuriup.chittagong.gov.bd
799	\N	Chikdair	চিকদাইর	chikdairup.chittagong.gov.bd
800	\N	Dabua	ডাবুয়া	dabuaup.chittagong.gov.bd
801	\N	Purbagujra	পূর্ব গুজরা	purbagujraup.chittagong.gov.bd
802	\N	Paschim Gujra	পশ্চিম গুজরা	paschimgujraup.chittagong.gov.bd
803	\N	Gohira	গহিরা	gohiraup.chittagong.gov.bd
804	\N	Holdia	হলদিয়া	holdiaup.chittagong.gov.bd
805	\N	Kodolpur	কদলপূর	kodolpurup.chittagong.gov.bd
806	\N	Noapara	নোয়াপাড়া	noaparaup.chittagong.gov.bd
807	\N	Pahartali	পাহাড়তলী	pahartaliup.chittagong.gov.bd
808	\N	Urkirchar	উড়কিরচর	urkircharup.chittagong.gov.bd
809	\N	Nowajushpur	নওয়াজিশপুর	nowajushpurup.chittagong.gov.bd
810	\N	Char Patharghata	চর পাথরঘাটা	charpatharghataup.chittagong.gov.bd
811	\N	Char Lakshya	চর লক্ষ্যা	charlakshyaup.chittagong.gov.bd
812	\N	Juldha	জুলধা	juldhaup.chittagong.gov.bd
813	\N	Barauthan	বড় উঠান	barauthanup.chittagong.gov.bd
814	\N	Sikalbaha	শিকলবাহা	sikalbahaup.chittagong.gov.bd
815	\N	Islamabad	ইসলামাবাদ	islamabadup.coxsbazar.gov.bd
816	\N	Islampur	ইসলামপুর	islampurup.coxsbazar.gov.bd
817	\N	Pokkhali	পোকখালী	pokkhaliup.coxsbazar.gov.bd
818	\N	Eidgaon	ঈদগাঁও	eidgaonup.coxsbazar.gov.bd
819	\N	Jalalabad	জালালাবাদ	jalalabadup.coxsbazar.gov.bd
820	\N	Chowfaldandi	চৌফলদন্ডী	chowfaldandi.coxsbazar.gov.bd
821	\N	Varuakhali	ভারুয়াখালী	varuakhaliup.coxsbazar.gov.bd
822	\N	Pmkhali	পিএমখালী	pmkhaliup.coxsbazar.gov.bd
823	\N	Khurushkhul	খুরুশকুল	khurushkhulup.coxsbazar.gov.bd
824	\N	Jhilongjha	ঝিলংঝা	jhilongjhaup.coxsbazar.gov.bd
825	\N	Kakhara	কাকারা	Kakharaup.coxsbazar.gov.bd
826	\N	Kaiar Bil	কাইয়ার বিল	kaiarbilup.coxsbazar.gov.bd
827	\N	Konakhali	কোনাখালী	konakhaliup.coxsbazar.gov.bd
828	\N	Khuntakhali	খুটাখালী	khuntakhaliup.coxsbazar.gov.bd
829	\N	Chiringa	চিরিঙ্গা	chiringaup.coxsbazar.gov.bd
830	\N	Demusia	ঢেমুশিয়া	demusiaup.coxsbazar.gov.bd
831	\N	Dulahazara	ডুলাহাজারা	dulahazaraup.coxsbazar.gov.bd
832	\N	Paschim Bara Bheola	পশ্চিম বড় ভেওলা	paschimbarabheolaup.coxsbazar.gov.bd
833	\N	Badarkhali	বদরখালী	badarkhaliup.coxsbazar.gov.bd
834	\N	Bamobil Chari	বামু বিলছড়ি	bamobilchariup.coxsbazar.gov.bd
835	\N	Baraitali	বড়ইতলী	baraitaliup.coxsbazar.gov.bd
836	\N	Bheola Manik Char	ভেওলা মানিক চর	bheolamanikcharup.coxsbazar.gov.bd
837	\N	Saharbil	শাহারবিল	saharbilup.coxsbazar.gov.bd
838	\N	Surajpur Manikpur	সুরজপুর মানিকপুর	surajpurmanikpurup.coxsbazar.gov.bd
839	\N	Harbang	হারবাঙ্গ	harbangup.coxsbazar.gov.bd
840	\N	Fashiakhali	ফাঁসিয়াখালী	fashiakhaliup.coxsbazar.gov.bd
841	\N	Ali Akbar Deil	আলি আকবর ডেইল	aliakbardeilup.coxsbazar.gov.bd
842	\N	Uttar Dhurung	উত্তর ধুরুং	uttardhurungup.coxsbazar.gov.bd
843	\N	Kaiyarbil	কৈয়ারবিল	kaiyarbilup.coxsbazar.gov.bd
844	\N	Dakshi Dhurung	দক্ষিণ ধুরুং	dakshidhurungup.coxsbazar.gov.bd
845	\N	Baragho	বড়ঘোপ	baraghopup.coxsbazar.gov.bd
846	\N	Lemsikhali	লেমসিখালী	lemsikhaliup.coxsbazar.gov.bd
847	\N	Rajapalong	রাজাপালং	rajapalongup.coxsbazar.gov.bd
848	\N	Jaliapalong	জালিয়াপালং	jaliapalongup.coxsbazar.gov.bd
849	\N	Holdiapalong	হলদিয়াপালং	holdiapalongup.coxsbazar.gov.bd
850	\N	Ratnapalong	রত্নাপালং	ratnapalongup.coxsbazar.gov.bd
851	\N	Palongkhali	পালংখালী	palongkhali.coxsbazar.gov.bd
852	\N	Boro Moheshkhali	বড় মহেশখালী	boramoheshkhaliup.coxsbazar.gov.bd
853	\N	Choto Moheshkhali	ছোট মহেশখালী	chotamoheshkhaliup.coxsbazar.gov.bd
854	\N	Shaplapur	শাপলাপুর	shaplapurup.coxsbazar.gov.bd
855	\N	Kutubjum	কুতুবজোম	kutubjumup.coxsbazar.gov.bd
856	\N	Hoanak	হোয়ানক	hoanakup.coxsbazar.gov.bd
857	\N	Kalarmarchhara	কালারমারছড়া	kalarmarchharaup.coxsbazar.gov.bd
858	\N	Matarbari	মাতারবাড়ী	matarbariup.coxsbazar.gov.bd
859	\N	Dhalghata	ধলঘাটা	dhalghataup.coxsbazar.gov.bd
860	\N	Ujantia	উজানটিয়া	ujantiaup.coxsbazar.gov.bd
861	\N	Taitong	টাইটং	taitongup.coxsbazar.gov.bd
862	\N	Pekua	পেকুয়া	pekuaup.coxsbazar.gov.bd
863	\N	Barabakia	বড় বাকিয়া	barabakiaup.coxsbazar.gov.bd
864	\N	Magnama	মগনামা	magnamaup.coxsbazar.gov.bd
865	\N	Rajakhali	রাজাখালী	rajakhaliup.coxsbazar.gov.bd
866	\N	Shilkhali	শীলখালী	shilkhaliup.coxsbazar.gov.bd
867	\N	Fotekharkul	ফতেখাঁরকুল	fotekharkulup.coxsbazar.gov.bd
868	\N	Rajarkul	রাজারকুল	rajarkulup.coxsbazar.gov.bd
869	\N	Rashidnagar	রশীদনগর	rashidnagarup.coxsbazar.gov.bd
870	\N	Khuniapalong	খুনিয়াপালং	khuniapalongup.coxsbazar.gov.bd
871	\N	Eidghar	ঈদগড়	eidgharup.coxsbazar.gov.bd
872	\N	Chakmarkul	চাকমারকুল	chakmarkulup.coxsbazar.gov.bd
873	\N	Kacchapia	কচ্ছপিয়া	kacchapiaup.coxsbazar.gov.bd
874	\N	Kauwarkho	কাউয়ারখোপ	kauwarkhopup.coxsbazar.gov.bd
875	\N	Dakkhin Mithachhari	দক্ষিণ মিঠাছড়ি	dakkhinmithachhariup.coxsbazar.gov.bd
876	\N	Jouarianala	জোয়ারিয়া নালা	jouarianalaup.coxsbazar.gov.bd
877	\N	Garjoniya	গর্জনিয়া	garjoniyaup.coxsbazar.gov.bd
878	\N	Subrang	সাবরাং	subrangup.coxsbazar.gov.bd
879	\N	Baharchara	বাহারছড়া	baharcharaup.coxsbazar.gov.bd
880	\N	Hnila	হ্নীলা	hnilaup.coxsbazar.gov.bd
881	\N	Whykong	হোয়াইক্যং	whykongup.coxsbazar.gov.bd
882	\N	Saintmartin	সেন্ট মার্টিন	saintmartinup.coxsbazar.gov.bd
883	\N	Teknaf Sadar	টেকনাফ সদর	teknafsadarup.coxsbazar.gov.bd
884	\N	Khagrachhari Sadar	খাগরাছড়ি সদর	sadarup.khagrachhari.gov.bd
885	\N	Golabari	গোলাবাড়ী	golabariup.khagrachhari.gov.bd
886	\N	Parachara	পেরাছড়া	paracharaup.khagrachhari.gov.bd
887	\N	Kamalchari	কমলছড়ি	kamalchariup.khagrachhari.gov.bd
888	\N	Merung	মেরুং	merungup.khagrachhari.gov.bd
889	\N	Boalkhali	বোয়ালখালী	boalkhaliup.khagrachhari.gov.bd
890	\N	Kabakhali	কবাখালী	kabakhaliup.khagrachhari.gov.bd
891	\N	Dighinala	দিঘীনালা	dighinalaup.khagrachhari.gov.bd
892	\N	Babuchara	বাবুছড়া	babucharaup.khagrachhari.gov.bd
893	\N	Logang	লোগাং	logangup.khagrachhari.gov.bd
894	\N	Changi	চেংগী	changiup.khagrachhari.gov.bd
895	\N	Panchari	পানছড়ি	panchariup.khagrachhari.gov.bd
896	\N	Latiban	লতিবান	latibanup.khagrachhari.gov.bd
897	\N	Dullyatali	দুল্যাতলী	dullyataliup.khagrachhari.gov.bd
898	\N	Barmachari	বর্মাছড়ি	barmachariup.khagrachhari.gov.bd
899	\N	Laxmichhari	লক্ষীছড়ি	laxmichhariup.khagrachhari.gov.bd
900	\N	Bhaibonchara	ভাইবোনছড়া	bhaiboncharaup.khagrachhari.gov.bd
901	\N	Mahalchari	মহালছড়ি	mahalchariup.khagrachhari.gov.bd
902	\N	Mobachari	মুবাছড়ি	mobachariup.khagrachhari.gov.bd
903	\N	Kayanghat	ক্যায়াংঘাট	kayanghatup.khagrachhari.gov.bd
904	\N	Maischari	মাইসছড়ি	maischariup.khagrachhari.gov.bd
905	\N	Manikchari	মানিকছড়ি	manikchariup.khagrachhari.gov.bd
906	\N	Batnatali	বাটনাতলী	batnataliup.khagrachhari.gov.bd
907	\N	Jogyachola	যোগ্যছোলা	jogyacholaup.khagrachhari.gov.bd
908	\N	Tintahari	তিনটহরী	tintahariup.khagrachhari.gov.bd
909	\N	Ramgarh	রামগড়	ramgarhup.khagrachhari.gov.bd
910	\N	Patachara	পাতাছড়া	patacharaup.khagrachhari.gov.bd
911	\N	Hafchari	হাফছড়ি	hafchariup.khagrachhari.gov.bd
912	\N	Taindong	তাইন্দং	taindongup.khagrachhari.gov.bd
913	\N	Tabalchari	তবলছড়ি	tabalchariup.khagrachhari.gov.bd
914	\N	Barnal	বর্ণাল	barnalup.khagrachhari.gov.bd
915	\N	Gomti	গোমতি	gomtiup.khagrachhari.gov.bd
916	\N	Balchari	বেলছড়ি	balchariup.khagrachhari.gov.bd
917	\N	Matiranga	মাটিরাঙ্গা	matirangaup.khagrachhari.gov.bd
918	\N	Guimara	গুইমারা	guimaraup.khagrachhari.gov.bd
919	\N	Amtali	আমতলি	amtaliup.khagrachhari.gov.bd
920	\N	Rajbila	রাজবিলা	rajbilaup.bandarban.gov.bd
921	\N	Tongkaboty	টংকাবতী	tongkabotyup.bandarban.gov.bd
922	\N	Suwalok	সুয়ালক	suwalokup.bandarban.gov.bd
923	\N	Bandarban Sadar	বান্দরবান সদর	bandarbansadarup.bandarban.gov.bd
924	\N	Kuhalong	কুহালং	kuhalongup.bandarban.gov.bd
925	\N	Alikadam Sadar	আলীকদম সদর	alikadamsadarup.bandarban.gov.bd
926	\N	Chwekhyong	চৈক্ষ্যং	chwekhyongup.bandarban.gov.bd
927	\N	Naikhyongchari Sadar	নাইক্ষ্যংছড়ি সদর	naikhyongcharisadarup.bandarban.gov.bd
928	\N	Gumdhum	ঘুমধুম	gumdhumup.bandarban.gov.bd
929	\N	Baishari	বাইশারী	baishariup.bandarban.gov.bd
930	\N	Sonaychari	সোনাইছড়ি	sonaychariup.bandarban.gov.bd
931	\N	Duwchari	দোছড়ি	duwchariup.bandarban.gov.bd
932	\N	Rowangchari Sadar	রোয়াংছড়ি সদর	rowangcharisadarup.bandarban.gov.bd
933	\N	Taracha	তারাছা	tarachaup.bandarban.gov.bd
934	\N	Alekyong	আলেক্ষ্যং	alekyongup.bandarban.gov.bd
935	\N	Nawapotong	নোয়াপতং	nawapotongup.bandarban.gov.bd
936	\N	Gajalia	গজালিয়া	gajaliaup.bandarban.gov.bd
937	\N	Lama Sadar	লামা সদর	lamasadarup.bandarban.gov.bd
938	\N	Fasiakhali	ফাসিয়াখালী	fasiakhaliup.bandarban.gov.bd
939	\N	Fythong	ফাইতং	fythongup.bandarban.gov.bd
940	\N	Rupushipara	রূপসীপাড়া	rupushiparaup.bandarban.gov.bd
941	\N	Sarai	সরই	saraiup.bandarban.gov.bd
942	\N	Aziznagar	আজিজনগর	aziznagarup.bandarban.gov.bd
943	\N	Paind	পাইন্দু	painduup.bandarban.gov.bd
944	\N	Ruma Sadar	রুমা সদর	rumasadarup.bandarban.gov.bd
945	\N	Ramakreprangsa	রেমাক্রীপ্রাংসা	ramakreprangsaup.bandarban.gov.bd
946	\N	Galanggya	গ্যালেংগ্যা	galanggyaup.bandarban.gov.bd
947	\N	Remakre	রেমাক্রী	remakreup.bandarban.gov.bd
948	\N	Tind	তিন্দু	tinduup.bandarban.gov.bd
949	\N	Thanchi Sadar	থানচি সদর	thanchisadarup.bandarban.gov.bd
950	\N	Balipara	বলিপাড়া	baliparaup.bandarban.gov.bd
951	\N	Rajapur	রাজাপুর	rajapurup.sirajganj.gov.bd
952	\N	Baradhul	বড়ধুল	baradhulup.sirajganj.gov.bd
953	\N	Belkuchi Sadar	বেলকুচি সদর	belkuchisadarup.sirajganj.gov.bd
954	\N	Dhukuriabera	ধুকুরিয়া বেড়া	dhukuriaberaup.sirajganj.gov.bd
955	\N	Doulatpur	দৌলতপুর	doulatpurup.sirajganj.gov.bd
956	\N	Bhangabari	ভাঙ্গাবাড়ী	bhangabariup.sirajganj.gov.bd
957	\N	Baghutia	বাঘুটিয়া	baghutiaup.sirajganj.gov.bd
958	\N	Gharjan	ঘোরজান	gharjanup.sirajganj.gov.bd
959	\N	Khaskaulia	খাসকাউলিয়া	khaskauliaup.sirajganj.gov.bd
960	\N	Khaspukuria	খাসপুকুরিয়া	khaspukuriaup.sirajganj.gov.bd
961	\N	Omarpur	উমারপুর	omarpurup.sirajganj.gov.bd
1046	\N	Dashuria	দাশুরিয়া	dashuriaup.pabna.gov.bd
962	\N	Sadia Chandpur	সদিয়া চাঁদপুর	sadiachandpurup.sirajganj.gov.bd
963	\N	Sthal	স্থল	sthalup.sirajganj.gov.bd
964	\N	Bhadraghat	ভদ্রঘাট	bhadraghatup.sirajganj.gov.bd
965	\N	Jamtail	জামতৈল	jamtailup.sirajganj.gov.bd
966	\N	Jhawail	ঝাঐল	jhawailup.sirajganj.gov.bd
967	\N	Roydaulatpur	রায়দৌলতপুর	roydaulatpurup.sirajganj.gov.bd
968	\N	Chalitadangha	চালিতাডাঙ্গা	chalitadanghaup.sirajganj.gov.bd
969	\N	Chargirish	চরগিরিশ	chargirishup.sirajganj.gov.bd
970	\N	Gandail	গান্ধাইল	gandailup.sirajganj.gov.bd
971	\N	Kazipur Sadar	কাজিপুর সদর	kazipursadarup.sirajganj.gov.bd
972	\N	Khasrajbari	খাসরাজবাড়ী	khasrajbariup.sirajganj.gov.bd
973	\N	Maijbari	মাইজবাড়ী	maijbariup.sirajganj.gov.bd
974	\N	Monsur Nagar	মনসুর নগর	monsurnagarup.sirajganj.gov.bd
975	\N	Natuarpara	নাটুয়ারপাড়া	natuarparaup.sirajganj.gov.bd
976	\N	Nishchintapur	নিশ্চিন্তপুর	nishchintapurup.sirajganj.gov.bd
977	\N	Sonamukhi	সোনামুখী	sonamukhiup.sirajganj.gov.bd
978	\N	Subhagacha	শুভগাছা	subhagachaup.sirajganj.gov.bd
979	\N	Tekani	তেকানী	tekaniup.sirajganj.gov.bd
980	\N	Brommogacha	ব্রহ্মগাছা	brommogachaup.sirajganj.gov.bd
981	\N	Chandaikona	চান্দাইকোনা	chandaikonaup.sirajganj.gov.bd
982	\N	Dhamainagar	ধামাইনগর	dhamainagarup.sirajganj.gov.bd
983	\N	Dhangora	ধানগড়া	dhangoraup.sirajganj.gov.bd
984	\N	Dhubil	ধুবিল	dhubilup.sirajganj.gov.bd
985	\N	Ghurka	ঘুড়কা	ghurkaup.sirajganj.gov.bd
986	\N	Nalka	নলকা	nalkaup.sirajganj.gov.bd
987	\N	Pangashi	পাঙ্গাসী	pangashiup.sirajganj.gov.bd
988	\N	Sonakhara	সোনাখাড়া	sonakharaup.sirajganj.gov.bd
989	\N	Beltail	বেলতৈল	beltailup.sirajganj.gov.bd
990	\N	Jalalpur	জালালপুর	jalalpurup.sirajganj.gov.bd
991	\N	Kayempure	কায়েমপুর	kayempureup.sirajganj.gov.bd
992	\N	Garadah	গাড়াদহ	garadahup.sirajganj.gov.bd
993	\N	Potazia	পোতাজিয়া	potaziaup.sirajganj.gov.bd
994	\N	Rupbati	রূপবাটি	rupbatiup.sirajganj.gov.bd
995	\N	Gala	গালা	galaup.sirajganj.gov.bd
996	\N	Porzona	পোরজনা	porzonaup.sirajganj.gov.bd
997	\N	Habibullah Nagar	হাবিবুল্লাহ নগর	habibullahnagarup.sirajganj.gov.bd
998	\N	Khukni	খুকনী	khukniup.sirajganj.gov.bd
999	\N	Koizuri	কৈজুরী	koizuriup.sirajganj.gov.bd
1000	\N	Sonatoni	সোনাতনী	sonatoniup.sirajganj.gov.bd
1001	\N	Narina	নরিনা	narinaup.sirajganj.gov.bd
1002	\N	Bagbati	বাগবাটি	bagbatiup.sirajganj.gov.bd
1003	\N	Ratankandi	রতনকান্দি	ratankandiup.sirajganj.gov.bd
1004	\N	Bohuli	বহুলী	bohuliup.sirajganj.gov.bd
1005	\N	Sheyalkol	শিয়ালকোল	sheyalkolup.sirajganj.gov.bd
1006	\N	Khokshabari	খোকশাবাড়ী	khokshabariup.nilphamari.gov.bd
1007	\N	Songacha	ছোনগাছা	songachaup.sirajganj.gov.bd
1008	\N	Mesra	মেছড়া	mesraup.sirajganj.gov.bd
1009	\N	Kowakhola	কাওয়াখোলা	kowakholaup.sirajganj.gov.bd
1010	\N	Kaliahoripur	কালিয়াহরিপুর	kaliahoripurup.sirajganj.gov.bd
1011	\N	Soydabad	সয়দাবাদ	soydabadup.sirajganj.gov.bd
1012	\N	Baruhas	বারুহাস	baruhasup.sirajganj.gov.bd
1013	\N	Talam	তালম	talamup.sirajganj.gov.bd
1014	\N	Soguna	সগুনা	sogunaup.sirajganj.gov.bd
1015	\N	Magura Binod	মাগুড়া বিনোদ	magurabinodup.sirajganj.gov.bd
1016	\N	Naogaon	নওগাঁ	naogaonup.sirajganj.gov.bd
1017	\N	Tarash Sadar	তাড়াশ সদর	tarashsadarup.sirajganj.gov.bd
1018	\N	Madhainagar	মাধাইনগর	madhainagarup.sirajganj.gov.bd
1019	\N	Deshigram	দেশীগ্রাম	deshigramup.sirajganj.gov.bd
1020	\N	Ullapara Sadar	উল্লাপাড়া সদর	ullaparasadarup.sirajganj.gov.bd
1021	\N	Ramkrisnopur	রামকৃষ্ণপুর	ramkrisnopurup.sirajganj.gov.bd
1022	\N	Bangala	বাঙ্গালা	bangalaup.sirajganj.gov.bd
1023	\N	Udhunia	উধুনিয়া	udhuniaup.sirajganj.gov.bd
1024	\N	Boropangashi	বড়পাঙ্গাসী	boropangashiup.sirajganj.gov.bd
1025	\N	Durga Nagar	দুর্গা নগর	durganagarup.sirajganj.gov.bd
1026	\N	Purnimagati	পূর্ণিমাগাতী	purnimagatiup.sirajganj.gov.bd
1027	\N	Salanga	সলঙ্গা	salangaup.sirajganj.gov.bd
1028	\N	Hatikumrul	হটিকুমরুল	hatikumrulup.sirajganj.gov.bd
1029	\N	Borohor	বড়হর	borohorup.sirajganj.gov.bd
1030	\N	Ponchocroshi	পঞ্চক্রোশী	ponchocroshiup.sirajganj.gov.bd
1031	\N	Salo	সলপ	salopup.sirajganj.gov.bd
1032	\N	Mohonpur	মোহনপুর	mohonpurup.sirajganj.gov.bd
1033	\N	Vaina	ভায়না	vainaup.pabna.gov.bd
1034	\N	Tantibonda	তাঁতিবন্দ	tantibondaup.pabna.gov.bd
1035	\N	Manikhat	মানিকহাট	manikhatup.pabna.gov.bd
1036	\N	Dulai	দুলাই	dulaiup.pabna.gov.bd
1037	\N	Ahammadpur	আহম্মদপুর	ahammadpurup.pabna.gov.bd
1038	\N	Raninagar	রাণীনগর	raninagarup.pabna.gov.bd
1039	\N	Satbaria	সাতবাড়ীয়া	satbariaup.pabna.gov.bd
1040	\N	Hatkhali	হাটখালী	hatkhaliup.pabna.gov.bd
1041	\N	Nazirganj	নাজিরগঞ্জ	nazirganjup.pabna.gov.bd
1042	\N	Sagorkandi	সাগরকান্দি	sagorkandiup.pabna.gov.bd
1043	\N	Sara	সাঁড়া	saraup.pabna.gov.bd
1044	\N	Pakshi	পাকশী	pakshiup.pabna.gov.bd
1045	\N	Muladuli	মুলাডুলি	muladuliup.pabna.gov.bd
1047	\N	Silimpur	ছলিমপুর	silimpurup.pabna.gov.bd
1048	\N	Sahapur	সাহাপুর	sahapurup.pabna.gov.bd
1049	\N	Luxmikunda	লক্ষীকুন্ডা	luxmikundaup.pabna.gov.bd
1050	\N	Bhangura	ভাঙ্গুড়া	bhanguraup.pabna.gov.bd
1051	\N	Khanmarich	খানমরিচ	khanmarichup.pabna.gov.bd
1052	\N	Ashtamanisha	অষ্টমণিষা	ashtamanishaup.pabna.gov.bd
1053	\N	Dilpasar	দিলপাশার	dilpasarup.pabna.gov.bd
1054	\N	Parbhangura	পারভাঙ্গুড়া	parbhanguraup.pabna.gov.bd
1055	\N	Maligachha	মালিগাছা	maligachhaup.pabna.gov.bd
1056	\N	Malanchi	মালঞ্চি	malanchiup.pabna.gov.bd
1057	\N	Gayeshpur	গয়েশপুর	gayeshpurup.pabna.gov.bd
1058	\N	Ataikula	আতাইকুলা	ataikulaup.pabna.gov.bd
1059	\N	Chartarapur	চরতারাপুর	chartarapurup.pabna.gov.bd
1060	\N	Sadullahpur	সাদুল্লাপুর	sadullahpurup.pabna.gov.bd
1061	\N	Bharara	ভাঁড়ারা	bhararaup.pabna.gov.bd
1062	\N	Dogachi	দোগাছী	dogachiup.pabna.gov.bd
1063	\N	Hemayetpur	হেমায়েতপুর	hemayetpurup.pabna.gov.bd
1064	\N	Dapunia	দাপুনিয়া	dapuniaup.pabna.gov.bd
1065	\N	Haturia Nakalia	হাটুরিয়া নাকালিয়া	haturianakaliaup.pabna.gov.bd
1066	\N	Notun Varenga	নতুন ভারেঙ্গা	notunvarengaup.pabna.gov.bd
1067	\N	Koitola	কৈটোলা	koitolaup.pabna.gov.bd
1068	\N	Chakla	চাকলা	chaklaup.pabna.gov.bd
1069	\N	Jatsakhini	জাতসাখিনি	jatsakhiniup.pabna.gov.bd
1070	\N	Puran Varenga	পুরান ভারেঙ্গা	puranvarengaup.pabna.gov.bd
1071	\N	Ruppur	রূপপুর	ruppurup.pabna.gov.bd
1072	\N	Masumdia	মাসুমদিয়া	masumdiaup.pabna.gov.bd
1073	\N	Dhalar Char	ঢালার চর	dhalarcharup.pabna.gov.bd
1074	\N	Majhpara	মাজপাড়া	majhparaup.pabna.gov.bd
1075	\N	Chandba	চাঁদভা	chandbaup.pabna.gov.bd
1076	\N	Debottar	দেবোত্তর	debottarup.pabna.gov.bd
1077	\N	Ekdanta	একদন্ত	ekdantaup.pabna.gov.bd
1078	\N	Laxshmipur	লক্ষীপুর	laxshmipurup.pabna.gov.bd
1079	\N	Handial	হান্ডিয়াল	handialup.pabna.gov.bd
1080	\N	Chhaikola	ছাইকোলা	chhaikolaup.pabna.gov.bd
1081	\N	Nimaichara	নিমাইচড়া	nimaicharaup.pabna.gov.bd
1082	\N	Gunaigachha	গুনাইগাছা	gunaigachhaup.pabna.gov.bd
1083	\N	Parshadanga	পার্শ্বডাঙ্গা	parshadangaup.pabna.gov.bd
1084	\N	Failjana	ফৈলজানা	failjanaup.pabna.gov.bd
1085	\N	Mulgram	মুলগ্রাম	mulgramup.pabna.gov.bd
1086	\N	Haripur	হরিপুর	haripurup.pabna.gov.bd
1087	\N	Mothurapur	মথুরাপুর	mothurapurup.pabna.gov.bd
1088	\N	Bilchalan	বিলচলন	bilchalanup.pabna.gov.bd
1089	\N	Danthia Bamangram	দাতিয়া বামনগ্রাম	danthiabamangramup.pabna.gov.bd
1090	\N	Nagdemra	নাগডেমড়া	nagdemraup.pabna.gov.bd
1091	\N	Dhulauri	ধুলাউড়ি	dhulauriup.pabna.gov.bd
1092	\N	Bhulbaria	ভুলবাড়ীয়া	bhulbariaup.pabna.gov.bd
1093	\N	Dhopadaha	ধোপাদহ	dhopadahaup.pabna.gov.bd
1094	\N	Karamja	করমজা	karamjaup.pabna.gov.bd
1095	\N	Kashinathpur	কাশিনাথপুর	kashinathpurup.pabna.gov.bd
1096	\N	Gaurigram	গৌরীগ্রাম	gaurigramup.pabna.gov.bd
1097	\N	Nandanpur	নন্দনপুর	nandanpurup.pabna.gov.bd
1098	\N	Khetupara	ক্ষেতুপাড়া	khetuparaup.pabna.gov.bd
1099	\N	Ar-Ataikula	আর-আতাইকুলা	rataiqulaup.pabna.gov.bd
1100	\N	Brilahiribari	বৃলাহিড়ীবাড়ী	brilahiribariup.pabna.gov.bd
1101	\N	Pungali	পুঙ্গুলি	pungaliup.pabna.gov.bd
1102	\N	Faridpur	ফরিদপুর	faridpurup.pabna.gov.bd
1103	\N	Hadal	হাদল	hadalup.pabna.gov.bd
1104	\N	Banwarinagar	বনওয়ারীনগর	banwarinagarup.pabna.gov.bd
1105	\N	Demra	ডেমড়া	demraup.pabna.gov.bd
1106	\N	Birkedar	বীরকেদার	birkedarup.bogra.gov.bd
1107	\N	Kalai	কালাই	kalaiup.bogra.gov.bd
1108	\N	Paikar	পাইকড়	paikarup.bogra.gov.bd
1109	\N	Narhatta	নারহট্ট	narhattaup.bogra.gov.bd
1110	\N	Murail	মুরইল	murailup.bogra.gov.bd
1111	\N	Kahaloo	কাহালু	kahalooup.bogra.gov.bd
1112	\N	Durgapur	দূর্গাপুর	durgapurup.bogra.gov.bd
1113	\N	Jamgaon	জামগ্রাম	jamgaonup.bogra.gov.bd
1114	\N	Malancha	মালঞ্চা	malanchaup.bogra.gov.bd
1115	\N	Fapore	ফাঁপোর	faporeup.bogra.gov.bd
1116	\N	Shabgram	সাবগ্রাম	shabgramup.bogra.gov.bd
1117	\N	Nishindara	নিশিন্দারা	nishindaraup.bogra.gov.bd
1118	\N	Erulia	এরুলিয়া	eruliaup.bogra.gov.bd
1119	\N	Rajapur	রাজাপুর	rajapurup.bogra.gov.bd
1120	\N	Shakharia	শাখারিয়া	shakhariaup.bogra.gov.bd
1121	\N	Sekherkola	শেখেরকোলা	sekherkolaup.bogra.gov.bd
1122	\N	Gokul	গোকুল	gokulup.bogra.gov.bd
1123	\N	Noongola	নুনগোলা	noongolaup.bogra.gov.bd
1124	\N	Lahiripara	লাহিড়ীপাড়া	lahiriparaup.bogra.gov.bd
1125	\N	Namuja	নামুজা	namujaup.bogra.gov.bd
1126	\N	Sariakandi Sadar	সারিয়াকান্দি সদর	sariakandisadarup.bogra.gov.bd
1127	\N	Narchi	নারচী	narchiup.bogra.gov.bd
1128	\N	Bohail	বোহাইল	bohailup.bogra.gov.bd
1129	\N	Chaluabari	চালুয়াবাড়ী	chaluabariup.bogra.gov.bd
1130	\N	Chandanbaisha	চন্দনবাইশা	chandanbaishaup.bogra.gov.bd
1131	\N	Hatfulbari	হাটফুলবাড়ী	hatfulbariup.bogra.gov.bd
1132	\N	Hatsherpur	হাটশেরপুর	hatsherpurup.bogra.gov.bd
1133	\N	Karnibari	কর্ণিবাড়ী	karnibariup.bogra.gov.bd
1134	\N	Kazla	কাজলা	kazlaup.bogra.gov.bd
1135	\N	Kutubpur	কুতুবপুর	kutubpurup.bogra.gov.bd
1136	\N	Kamalpur	কামালপুর	kamalpur.bogra.gov.bd
1137	\N	Bhelabari	ভেলাবাড়ী	bhelabari.bogra.gov.bd
1138	\N	Asekpur	আশেকপুর	asekpurup.bogra.gov.bd
1139	\N	Madla	মাদলা	madlaup.bogra.gov.bd
1140	\N	Majhira	মাঝিড়া	majhiraup.bogra.gov.bd
1141	\N	Aria	আড়িয়া	ariaup.bogra.gov.bd
1142	\N	Kharna	খরনা	kharnaup.bogra.gov.bd
1143	\N	Khottapara	খোট্টাপাড়া	Khottaparaup.bogra.gov.bd
1144	\N	Chopinagar	চোপিনগর	chopinagarup.bogra.gov.bd
1145	\N	Amrul	আমরুল	amrulup.bogra.gov.bd
1146	\N	Gohail	গোহাইল	gohailup.bogra.gov.bd
1147	\N	Zianagar	জিয়ানগর	zianagarup.bogra.gov.bd
1148	\N	Chamrul	চামরুল	chamrulup.bogra.gov.bd
1149	\N	Dupchanchia	দুপচাঁচিয়া	dupchanchiaup.bogra.gov.bd
1150	\N	Gunahar	গুনাহার	gunaharup.bogra.gov.bd
1151	\N	Gobindapur	গোবিন্দপুর	gobindapurup.bogra.gov.bd
1152	\N	Talora	তালোড়া	taloraup.bogra.gov.bd
1153	\N	Chhatiangram	ছাতিয়ানগ্রাম	chhatiangramup.bogra.gov.bd
1154	\N	Nasaratpur	নশরতপুর	nasaratpurup.bogra.gov.bd
1155	\N	Adamdighi	আদমদিঘি	adamdighiup.bogra.gov.bd
1156	\N	Kundagram	কুন্দগ্রাম	kundagramup.bogra.gov.bd
1157	\N	Chapapur	চাঁপাপুর	chapapurup.bogra.gov.bd
1158	\N	Shantahar	সান্তাহার	shantaharup.bogra.gov.bd
1159	\N	Burail	বুড়ইল	burailup.bogra.gov.bd
1160	\N	Nandigram	নন্দিগ্রাম	nandigramup.bogra.gov.bd
1161	\N	Bhatra	ভাটরা	bhatraup.bogra.gov.bd
1162	\N	Thalta Majhgram	থালতা মাঝগ্রাম	thaltamajhgramup.bogra.gov.bd
1163	\N	Bhatgram	ভাটগ্রাম	bhatgramup.bogra.gov.bd
1164	\N	Sonatala	সোনাতলা	sonatalaup.bogra.gov.bd
1165	\N	Balua	বালুয়া	baluaup.bogra.gov.bd
1166	\N	Zorgacha	জোড়গাছা	zorgachaup.bogra.gov.bd
1167	\N	Digdair	দিগদাইড়	digdairup.bogra.gov.bd
1168	\N	Madhupur	মধুপুর	madhupurup.bogra.gov.bd
1169	\N	Pakulla	পাকুল্ল্যা	pakullaup.bogra.gov.bd
1170	\N	Tekani Chukinagar	তেকানী চুকাইনগর	tekanichukinagarup.bogra.gov.bd
1171	\N	Nimgachi	নিমগাছি	nimgachiup.bogra.gov.bd
1172	\N	Kalerpara	কালেরপাড়া	kalerparaup.bogra.gov.bd
1173	\N	Chikashi	চিকাশী	chikashiup.bogra.gov.bd
1174	\N	Gossainbari	গোসাইবাড়ী	gossainbariup.bogra.gov.bd
1175	\N	Bhandarbari	ভান্ডারবাড়ী	bhandarbariup.bogra.gov.bd
1176	\N	Gopalnagar	১গোপালনগর	gopalnagarup.bogra.gov.bd
1177	\N	Mothurapur	মথুরাপুর	mothurapurup.bogra.gov.bd
1178	\N	Chowkibari	চৌকিবাড়ী	chowkibariup.bogra.gov.bd
1179	\N	Elangi	এলাঙ্গী	elangiup.bogra.gov.bd
1180	\N	Dhunat Sadar	ধুনট সদর	dhunatsadarup.bogra.gov.bd
1181	\N	Baliadighi	বালিয়া দিঘী	baliadighiup.bogra.gov.bd
1182	\N	Dakshinpara	দক্ষিণপাড়া	dakshinparaup.bogra.gov.bd
1183	\N	Durgahata	দুর্গাহাটা	durgahataup.bogra.gov.bd
1184	\N	Kagail	কাগইল	kagailup.bogra.gov.bd
1185	\N	Sonarai	সোনারায়	sonaraiup.bogra.gov.bd
1186	\N	Rameshwarpur	রামেশ্বরপুর	rameshwarpurup.bogra.gov.bd
1187	\N	Naruamala	নাড়ুয়ামালা	naruamalaup.bogra.gov.bd
1188	\N	Nepaltali	নেপালতলী	nepaltaliup.bogra.gov.bd
1189	\N	Gabtali	গাবতলি	gabtaliup.bogra.gov.bd
1190	\N	Mahishaban	মহিষাবান	mahishabanup.bogra.gov.bd
1191	\N	Nasipur	নশিপুর	nasipurup.bogra.gov.bd
1192	\N	Mirzapur	মির্জাপুর	mirzapurup.bogra.gov.bd
1193	\N	Khamarkandi	খামারকান্দি	khamarkandiup.bogra.gov.bd
1194	\N	Garidaha	গাড়িদহ	garidahaup.bogra.gov.bd
1195	\N	Kusumbi	কুসুম্বী	kusumbiup.bogra.gov.bd
1196	\N	Bishalpur	বিশালপুর	bishalpurup.bogra.gov.bd
1197	\N	Shimabari	সীমাবাড়ি	shimabariup.bogra.gov.bd
1198	\N	Shahbondegi	শাহবন্দেগী	shahbondegiup.bogra.gov.bd
1199	\N	Sughat	সুঘাট	sughatup.bogra.gov.bd
1200	\N	Khanpur	খানপুর	khanpurup.bogra.gov.bd
1201	\N	Bhabanipur	ভবানীপুর	bhabanipurup.bogra.gov.bd
1202	\N	Moidanhatta	ময়দানহাট্টা	moidanhattaup.bogra.gov.bd
1203	\N	Kichok	কিচক	kichokup.bogra.gov.bd
1204	\N	Atmul	আটমূল	atmulup.bogra.gov.bd
1205	\N	Pirob	পিরব	pirobup.bogra.gov.bd
1206	\N	Majhihatta	মাঝিহট্ট	majhihattaup.bogra.gov.bd
1207	\N	Buriganj	বুড়িগঞ্জ	buriganjup.bogra.gov.bd
1208	\N	Bihar	বিহার	biharup.bogra.gov.bd
1209	\N	Shibganj	শিবগঞ্জ	shibganjup.bogra.gov.bd
1210	\N	Deuly	দেউলি	deulyup.bogra.gov.bd
1211	\N	Sayedpur	সৈয়দপুর	sayedpurup.bogra.gov.bd
1212	\N	Mokamtala	মোকামতলা	mokamtalaup.bogra.gov.bd
1213	\N	Raynagar	রায়নগর	raynagarup.bogra.gov.bd
1214	\N	Darsanpara	দর্শনপাড়া	darsanparaup.rajshahi.gov.bd
1215	\N	Hujuripara	হুজুরী পাড়া	hujuriparaup.rajshahi.gov.bd
1216	\N	Damkura	দামকুড়া	damkuraup.rajshahi.gov.bd
1217	\N	Horipur	হরিপুর	horipurup.rajshahi.gov.bd
1218	\N	Horogram	হড়গ্রাম	horogramup.rajshahi.gov.bd
1219	\N	Harian	হরিয়ান	harianup.rajshahi.gov.bd
1220	\N	Borgachi	বড়্গাছি	borgachiup.rajshahi.gov.bd
1221	\N	Parila	পারিলা	parilaup.rajshahi.gov.bd
1222	\N	Naopara	নওপাড়া	naoparaup.rajshahi.gov.bd
1223	\N	Kismatgankoir	কিসমতগণকৈড়	kismatgankoirup.rajshahi.gov.bd
1224	\N	Pananagar	পানানগর	pananagarup.rajshahi.gov.bd
1225	\N	Deluabari	দেলুয়াবাড়ী	deluabariup.rajshahi.gov.bd
1226	\N	Jhaluka	ঝালুকা	jhalukaup.rajshahi.gov.bd
1227	\N	Maria	মাড়িয়া	mariaup.rajshahi.gov.bd
1228	\N	Joynogor	জয়নগর	joynogorup.rajshahi.gov.bd
1229	\N	Dhuroil	ধুরইল	dhuroilup.rajshahi.gov.bd
1230	\N	Ghasigram	ঘষিগ্রাম	ghasigramup.rajshahi.gov.bd
1231	\N	Raighati	রায়ঘাটি	raighatiup.rajshahi.gov.bd
1232	\N	Mougachi	মৌগাছি	mougachiup.rajshahi.gov.bd
1233	\N	Baksimoil	বাকশিমইল	baksimoilup.rajshahi.gov.bd
1234	\N	Jahanabad	জাহানাবাদ	jahanabadup.rajshahi.gov.bd
1235	\N	Yousufpur	ইউসুফপুর	yousufpurup.rajshahi.gov.bd
1236	\N	Solua	শলুয়া	soluaup.rajshahi.gov.bd
1237	\N	Sardah	সরদহ	sardahup.rajshahi.gov.bd
1238	\N	Nimpara	নিমপাড়া	nimparaup.rajshahi.gov.bd
1239	\N	Charghat	চারঘাট	charghatup.rajshahi.gov.bd
1240	\N	Vialuxmipur	ভায়ালক্ষ্মীপুর	vialuxmipurup.rajshahi.gov.bd
1241	\N	Puthia	পুঠিয়া	puthiaup.rajshahi.gov.bd
1242	\N	Belpukuria	বেলপুকুরিয়া	belpukuriaup.rajshahi.gov.bd
1243	\N	Baneswar	বানেশ্বর	baneswarup.rajshahi.gov.bd
1244	\N	Valukgachi	ভালুক গাছি	valukgachiup.rajshahi.gov.bd
1245	\N	Shilmaria	শিলমাড়িয়া	shilmariaup.rajshahi.gov.bd
1246	\N	Jewpara	জিউপাড়া	jewparaup.rajshahi.gov.bd
1247	\N	Bajubagha	বাজুবাঘা	bajubaghaup.rajshahi.gov.bd
1248	\N	Gorgori	গড়গড়ি	gorgoriup.rajshahi.gov.bd
1249	\N	Pakuria	পাকুড়িয়া	pakuriaup.rajshahi.gov.bd
1250	\N	Monigram	মনিগ্রাম	monigramup.rajshahi.gov.bd
1251	\N	Bausa	বাউসা	bausaup.rajshahi.gov.bd
1252	\N	Arani	আড়ানী	araniup.rajshahi.gov.bd
1253	\N	Godagari	গোদাগাড়ী	godagariup.rajshahi.gov.bd
1254	\N	Mohonpur	মোহনপুর	mohonpurup.rajshahi.gov.bd
1255	\N	Pakri	পাকড়ী	pakriup.rajshahi.gov.bd
1256	\N	Risikul	রিশিকুল	risikulup.rajshahi.gov.bd
1257	\N	Gogram	গোগ্রাম	gogramup.rajshahi.gov.bd
1258	\N	Matikata	মাটিকাটা	matikataup.rajshahi.gov.bd
1259	\N	Dewpara	দেওপাড়া	dewparaup.rajshahi.gov.bd
1260	\N	Basudebpur	বাসুদেবপুর	basudebpurup.rajshahi.gov.bd
1261	\N	Asariadaha	আষাড়িয়াদহ	asariadahaup.rajshahi.gov.bd
1262	\N	Kalma	কলমা	kalmaup.rajshahi.gov.bd
1263	\N	Badhair	বাধাইড়	badhairup.rajshahi.gov.bd
1264	\N	Panchandar	পাঁচন্দর	panchandarup.rajshahi.gov.bd
1265	\N	Saranjai	সরঞ্জাই	saranjaiup.rajshahi.gov.bd
1266	\N	Talondo	তালন্দ	talondoup.rajshahi.gov.bd
1267	\N	Kamargaon	কামারগাঁ	kamargaonup.rajshahi.gov.bd
1268	\N	Chanduria	চান্দুড়িয়া	chanduriaup.rajshahi.gov.bd
1269	\N	Gobindopara	গোবিন্দপাড়া	gobindoparaup.rajshahi.gov.bd
1270	\N	Nordas	নরদাস	nordasup.rajshahi.gov.bd
1271	\N	Dippur	দ্বীপপুর	dippurup.rajshahi.gov.bd
1272	\N	Borobihanoli	বড়বিহানলী	borobihanoliup.rajshahi.gov.bd
1273	\N	Auchpara	আউচপাড়া	auchparaup.rajshahi.gov.bd
1274	\N	Sreepur	শ্রীপুর	sreepurup.rajshahi.gov.bd
1275	\N	Basupara	বাসুপাড়া	basuparaup.rajshahi.gov.bd
1276	\N	Kacharikoalipara	কাচাড়ী কোয়লিপাড়া	kacharikoaliparaup.rajshahi.gov.bd
1277	\N	Suvodanga	শুভডাঙ্গা	suvodangaup.rajshahi.gov.bd
1278	\N	Mariaup	মাড়িয়া	mariaup10.rajshahi.gov.bd
1279	\N	Ganipur	গণিপুর	ganipurup.rajshahi.gov.bd
1280	\N	Zhikara	ঝিকড়া	zhikaraup.rajshahi.gov.bd
1281	\N	Gualkandi	গোয়ালকান্দি	gualkandiup.rajshahi.gov.bd
1282	\N	Hamirkutsa	হামিরকুৎসা	hamirkutsaup.rajshahi.gov.bd
1283	\N	Jogipara	যোগিপাড়া	jogiparaup.rajshahi.gov.bd
1284	\N	Sonadanga	সোনাডাঙ্গা	sonadangaup.rajshahi.gov.bd
1285	\N	Brahmapur	ব্রহ্মপুর	brahmapurup.natore.gov.bd
1286	\N	Madhnagar	মাধনগর	madhnagar.natore.gov.bd
1287	\N	Khajura	খাজুরা	khajura.bdgovportal.com
1288	\N	Piprul	পিপরুল	piprulup.natore.gov.bd
1289	\N	Biprobelghoria	বিপ্রবেলঘড়িয়া	biprobelghoria.bdgovportal.com
1290	\N	Chhatni	ছাতনী	chhatni.bdgovportal.com
1291	\N	Tebaria	তেবাড়িয়া	tebariaup.natore.gov.bd
1292	\N	Dighapatia	দিঘাপতিয়া	dighapatiaup.natore.gov.bd
1293	\N	Luxmipurkholabaria	লক্ষীপুর খোলাবাড়িয়া	luxmipurkholabariaup.natore.gov.bd
1294	\N	Barahorispur	বড়হরিশপুর	barahorispur.bdgovportal.com
1295	\N	Kaphuria	কাফুরিয়া	kaphuria.bdgovportal.com
1296	\N	Halsa	হালসা	halsa.natore.gov.bd
1297	\N	Sukash	শুকাশ	sukashup.natore.gov.bd
1298	\N	Dahia	ডাহিয়া	dahiaup.natore.gov.bd
1299	\N	Italy	ইটালী	italyup.natore.gov.bd
1300	\N	Kalam	কলম	kalamup.natore.gov.bd
1301	\N	Chamari	চামারী	chamariup.natore.gov.bd
1302	\N	Hatiandaha	হাতিয়ানদহ	hatiandahaup.natore.gov.bd
1303	\N	Lalore	লালোর	laloreup.natore.gov.bd
1304	\N	Sherkole	শেরকোল	sherkoleup.natore.gov.bd
1305	\N	Tajpur	তাজপুর	tajpurup.natore.gov.bd
1306	\N	Chaugram	চৌগ্রাম	chaugramup.natore.gov.bd
1307	\N	Chhatardighi	ছাতারদিঘী	chhatardighiup.natore.gov.bd
1308	\N	Ramanandakhajura	রামান্দখাজুরা	ramanandakhajuraup.natore.gov.bd
1309	\N	Joari	জোয়াড়ী	joariup.natore.gov.bd
1310	\N	Baraigram	বড়াইগ্রাম	baraigramup.natore.gov.bd
1311	\N	Zonail	জোনাইল	zonailup.natore.gov.bd
1312	\N	Nagor	নগর	nagorup.natore.gov.bd
1313	\N	Majgoan	মাঝগাও	majgoanup.natore.gov.bd
1314	\N	Gopalpur	গোপালপুর	gopalpurup.natore.gov.bd
1315	\N	Chandai	চান্দাই	chandai.bdgovportal.com
1316	\N	Panka	পাঁকা	pankaup.natore.gov.bd
1317	\N	Jamnagor	জামনগর	jamnagorup.natore.gov.bd
1318	\N	Bagatipara	বাগাতিপাড়া	bagatiparaup.natore.gov.bd
1319	\N	Dayarampur	দয়ারামপুর	dayarampurup.natore.gov.bd
1320	\N	Faguardiar	ফাগুয়ারদিয়াড়	faguardiarup.natore.gov.bd
1321	\N	Lalpur	লালপুর	lalpurup.natore.gov.bd
1322	\N	Iswardi	ঈশ্বরদী	iswardiup.natore.gov.bd
1323	\N	Chongdhupoil	চংধুপইল	chongdhupoilup.natore.gov.bd
1324	\N	Arbab	আড়বাব	arbabup.natore.gov.bd
1325	\N	Bilmaria	বিলমাড়িয়া	bilmariaup.natore.gov.bd
1326	\N	Duaria	দুয়ারিয়া	duariaup.natore.gov.bd
1327	\N	Oalia	ওয়ালিয়া	oaliaup.natore.gov.bd
1328	\N	Durduria	দুড়দুরিয়া	durduriaup.natore.gov.bd
1329	\N	Arjunpur	অর্জুনপুর বরমহাটী	arjunpurup.natore.gov.bd
1330	\N	Kadimchilan	কদিমচিলান	kadimchilanup.natore.gov.bd
1331	\N	Nazirpur	নাজিরপুর	nazirpurup.natore.gov.bd
1332	\N	Biaghat	বিয়াঘাট	biaghatup.natore.gov.bd
1333	\N	Khubjipur	খুবজীপুর	khubjipurup.natore.gov.bd
1334	\N	Dharabarisha	ধারাবারিষা	dharabarishaup.natore.gov.bd
1335	\N	Moshindha	মসিন্দা	moshindhaup.natore.gov.bd
1336	\N	Chapila	চাপিলা	chapilaup.natore.gov.bd
1337	\N	Rukindipur	রুকিন্দীপুর	rukindipurup.joypurhat.gov.bd
1338	\N	Sonamukhi	সোনামূখী	sonamukhiup.joypurhat.gov.bd
1339	\N	Tilakpur	তিলকপুর	tilakpurup.joypurhat.gov.bd
1340	\N	Raikali	রায়কালী	raikaliup.joypurhat.gov.bd
1341	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.joypurhat.gov.bd
1342	\N	Matrai	মাত্রাই	matraiup.joypurhat.gov.bd
1343	\N	Ahammedabad	আহম্মেদাবাদ	ahammedabadup.joypurhat.gov.bd
1344	\N	Punot	পুনট	punotup.joypurhat.gov.bd
1345	\N	Zindarpur	জিন্দারপুর	zindarpurup.joypurhat.gov.bd
1346	\N	Udaipur	উদয়পুর	udaipurup.joypurhat.gov.bd
1347	\N	Alampur	আলমপুর	alampurup.joypurhat.gov.bd
1348	\N	Borail	বড়াইল	borailup.joypurhat.gov.bd
1349	\N	Tulshiganga	তুলশীগংগা	tulshigangaup.joypurhat.gov.bd
1350	\N	Mamudpur	মামুদপুর	mamudpurup.joypurhat.gov.bd
1351	\N	Boratara	বড়তারা	borataraup.joypurhat.gov.bd
1352	\N	Bagjana	বাগজানা	bagjanaup.joypurhat.gov.bd
1353	\N	Dharanji	ধরঞ্জি	dharanjiup.joypurhat.gov.bd
1354	\N	Aymarasulpur	আয়মারসুলপুর	aymarasulpurup.joypurhat.gov.bd
1355	\N	Balighata	বালিঘাটা	balighataup.joypurhat.gov.bd
1356	\N	Atapur	আটাপুর	atapurup.joypurhat.gov.bd
1357	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.joypurhat.gov.bd
1358	\N	Aolai	আওলাই	aolaiup.joypurhat.gov.bd
1359	\N	Kusumba	কুসুম্বা	kusumbaup.joypurhat.gov.bd
1360	\N	Amdai	আমদই	amdaiup.joypurhat.gov.bd
1361	\N	Bamb	বম্বু	bambuup.joypurhat.gov.bd
1362	\N	Dogachi	দোগাছি	dogachiup.joypurhat.gov.bd
1363	\N	Puranapail	পুরানাপৈল	puranapailup.joypurhat.gov.bd
1364	\N	Jamalpur	জামালপুর	jamalpurup.joypurhat.gov.bd
1365	\N	Chakborkat	চকবরকত	chakborkatup.joypurhat.gov.bd
1366	\N	Mohammadabad	মোহাম্মদাবাদ	mohammadabadup.joypurhat.gov.bd
1367	\N	Dhalahar	ধলাহার	dhalaharup.joypurhat.gov.bd
1368	\N	Bhadsha	ভাদসা	bhadshaup.joypurhat.gov.bd
1369	\N	Alatuli	আলাতুলী	alatuliup.chapainawabganj.gov.bd
1370	\N	Baroghoria	বারঘরিয়া	baroghoriaup.chapainawabganj.gov.bd
1371	\N	Moharajpur	মহারাজপুর	moharajpurup.chapainawabganj.gov.bd
1372	\N	Ranihati	রানীহাটি	ranihatiup.chapainawabganj.gov.bd
1373	\N	Baliadanga	বালিয়াডাঙ্গা	baliadangaup.chapainawabganj.gov.bd
1374	\N	Gobratola	গোবরাতলা	gobratolaup.chapainawabganj.gov.bd
1375	\N	Jhilim	ঝিলিম	jhilimup.chapainawabganj.gov.bd
1376	\N	Char Anupnagar	চর অনুপনগর	charaunupnagarup.chapainawabganj.gov.bd
1377	\N	Debinagar	দেবীনগর	debinagarup.chapainawabganj.gov.bd
1378	\N	Shahjahanpur	শাহজাহানপুর	shahjahanpurup.chapainawabganj.gov.bd
1379	\N	Islampur	ইসলামপুর	islampurup.chapainawabganj.gov.bd
1380	\N	Charbagdanga	চরবাগডাঙ্গা	charbagdangaup.chapainawabganj.gov.bd
1381	\N	Narayanpur	নারায়নপুর	narayanpurup.chapainawabganj.gov.bd
1382	\N	Sundarpur	সুন্দরপুর	sundarpurup.chapainawabganj.gov.bd
1383	\N	Radhanagar	রাধানগর	radhanagarup.chapainawabganj.gov.bd
1384	\N	Rahanpur	রহনপুর	rahanpurup.chapainawabganj.gov.bd
1385	\N	Boalia	বোয়ালিয়া	boaliaup.chapainawabganj.gov.bd
1386	\N	Bangabari	বাঙ্গাবাড়ী	bangabariup.chapainawabganj.gov.bd
1387	\N	Parbotipur	পার্বতীপুর	parbotipurup.chapainawabganj.gov.bd
1388	\N	Chowdala	চৌডালা	chowdalaup.chapainawabganj.gov.bd
1389	\N	Gomostapur	গোমস্তাপুর	gomostapurup.chapainawabganj.gov.bd
1390	\N	Alinagar	আলীনগর	alinagarup.chapainawabganj.gov.bd
1391	\N	Fhotepur	ফতেপুর	fhotepurup.chapainawabganj.gov.bd
1392	\N	Kosba	কসবা	kosbaup.chapainawabganj.gov.bd
1393	\N	Nezampur	নেজামপুর	nezampurup.chapainawabganj.gov.bd
1394	\N	Nachol	নাচোল	nacholup.chapainawabganj.gov.bd
1395	\N	Bholahat	ভোলাহাট	bholahatup.chapainawabganj.gov.bd
1396	\N	Jambaria	জামবাড়িয়া	jambariaup.chapainawabganj.gov.bd
1397	\N	Gohalbari	গোহালবাড়ী	gohalbariup.chapainawabganj.gov.bd
1398	\N	Daldoli	দলদলী	daldoliup.chapainawabganj.gov.bd
1399	\N	Binodpur	বিনোদপুর	binodpurup.chapainawabganj.gov.bd
1400	\N	Chakkirti	চককির্তী	chakkirtiup.chapainawabganj.gov.bd
1401	\N	Daipukuria	দাইপুকুরিয়া	daipukuriaup.chapainawabganj.gov.bd
1402	\N	Dhainagar	ধাইনগর	dhainagarup.chapainawabganj.gov.bd
1403	\N	Durlovpur	দুর্লভপুর	durlovpurup.chapainawabganj.gov.bd
1404	\N	Ghorapakhia	ঘোড়াপাখিয়া	ghorapakhiaup.chapainawabganj.gov.bd
1405	\N	Mobarakpur	মোবারকপুর	mobarakpurup.chapainawabganj.gov.bd
1406	\N	Monakasha	মনাকষা	monakashaup.chapainawabganj.gov.bd
1407	\N	Noyalavanga	নয়ালাভাঙ্গা	noyalavangaup.chapainawabganj.gov.bd
1408	\N	Panka	পাঁকা	pankaup.chapainawabganj.gov.bd
1409	\N	Chatrajitpur	ছত্রাজিতপুর	chhatrajitpurup.chapainawabganj.gov.bd
1410	\N	Shahabajpur	শাহাবাজপুর	shahabajpurup.chapainawabganj.gov.bd
1411	\N	Shyampur	শ্যামপুর	shyampurup.chapainawabganj.gov.bd
1412	\N	Kansat	কানসাট	kansatup.bdgovportal.com
1413	\N	Ujirpur	উজিরপুর	ujirpurup.chapainawabganj.gov.bd
1414	\N	1nomohadevpur	মহাদেবপুর	1nomohadevpurup.naogaon.gov.bd
1415	\N	Hatur	হাতুড়	2nohaturup.naogaon.gov.bd
1416	\N	Khajur	খাজুর	3nokhajurup.naogaon.gov.bd
1417	\N	Chandas	চাঁন্দাশ	4nochandasup.naogaon.gov.bd
1418	\N	Enayetpur	এনায়েতপুর	6noenayetpurup.naogaon.gov.bd
1419	\N	Sofapur	সফাপুর	7nosofapurup.naogaon.gov.bd
1420	\N	Uttargram	উত্তরগ্রাম	8nouttargramup.naogaon.gov.bd
1421	\N	Cheragpur	চেরাগপুর	9nocheragpurup.naogaon.gov.bd
1422	\N	Vimpur	ভীমপুর	10novimpurup.naogaon.gov.bd
1423	\N	Roygon	রাইগাঁ	roygonup.naogaon.gov.bd
1424	\N	Badalgachi	বদলগাছী	1nobadalgachiup.naogaon.gov.bd
1425	\N	Mothurapur	মথুরাপুর	2nomothurapurup.naogaon.gov.bd
1426	\N	Paharpur	পাহারপুর	3nopaharpurup.naogaon.gov.bd
1427	\N	Mithapur	মিঠাপুর	4nomithapurup.naogaon.gov.bd
1428	\N	Kola	কোলা	5nokolaup.naogaon.gov.bd
1429	\N	Bilashbari	বিলাশবাড়ী	6nobilashbariup.naogaon.gov.bd
1430	\N	Adhaipur	আধাইপুর	7noadhaipurup.naogaon.gov.bd
1431	\N	Balubhara	বালুভরা	8nobalubharaup.naogaon.gov.bd
1432	\N	Patnitala	পত্নীতলা	1nopatnitalaup.naogaon.gov.bd
1433	\N	Nirmail	নিমইল	2nonirmailup.naogaon.gov.bd
1434	\N	Dibar	দিবর	3nodibarup.naogaon.gov.bd
1435	\N	Akbarpur	আকবরপুর	4noakbarpurup.naogaon.gov.bd
1436	\N	Matindar	মাটিন্দর	5nomatindarup.naogaon.gov.bd
1437	\N	Krishnapur	কৃষ্ণপুর	6nokrishnapurup.naogaon.gov.bd
1438	\N	Patichrara	পাটিচড়া	7nopatichraraup.naogaon.gov.bd
1439	\N	Nazipur	নজিপুর	8nonazipurup.naogaon.gov.bd
1440	\N	Ghasnagar	ঘষনগর	9noghasnagarup.naogaon.gov.bd
1441	\N	Amair	আমাইড়	10noamairup.naogaon.gov.bd
1442	\N	Shihara	শিহারা	11noahiharaup.naogaon.gov.bd
1443	\N	Dhamoirhat	ধামইরহাট	1nodhamoirhatup.naogaon.gov.bd
1444	\N	Alampur	আলমপুর	3noalampurup.naogaon.gov.bd
1445	\N	Umar	উমার	4noumarup.naogaon.gov.bd
1446	\N	Aranagar	আড়ানগর	5noaranagarup.naogaon.gov.bd
1447	\N	Jahanpur	জাহানপুর	6nojahanpurup.naogaon.gov.bd
1448	\N	Isabpur	ইসবপুর	7noisabpurup.naogaon.gov.bd
1449	\N	Khelna	খেলনা	8nokhelnaup.naogaon.gov.bd
1450	\N	Agradigun	আগ্রাদ্বিগুন	2noagradigunup.naogaon.gov.bd
1451	\N	Hajinagar	হাজীনগর	1nohajinagarup.naogaon.gov.bd
1452	\N	Chandannagar	চন্দননগর	2nochandannagarup.naogaon.gov.bd
1453	\N	Bhabicha	ভাবিচা	3nobhabichaup.naogaon.gov.bd
1454	\N	Niamatpur	নিয়ামতপুর	4noniamatpurup.naogaon.gov.bd
1455	\N	Rasulpur	রসুলপুর	5norasulpurup.naogaon.gov.bd
1456	\N	Paroil	পাড়ইল	6noparoilup.naogaon.gov.bd
1457	\N	Sremantapur	শ্রীমন্তপুর	7nosremantapurup.naogaon.gov.bd
1458	\N	Bahadurpur	বাহাদুরপুর	8nobahadurpurup.naogaon.gov.bd
1459	\N	Varsho	ভারশো	1novarshoup.naogaon.gov.bd
1460	\N	Valain	ভালাইন	2novalainup.naogaon.gov.bd
1461	\N	Paranpur	পরানপুর	3noparanpurup.naogaon.gov.bd
1462	\N	Manda	মান্দা	4nomandaup.naogaon.gov.bd
1463	\N	Goneshpur	গনেশপুর	5nogoneshpurup.naogaon.gov.bd
1464	\N	Moinom	মৈনম	6nomoinomup.naogaon.gov.bd
1465	\N	Proshadpur	প্রসাদপুর	7noproshadpurup.naogaon.gov.bd
1466	\N	Kosomba	কুসুম্বা	8nokosombaup.naogaon.gov.bd
1467	\N	Tetulia	তেঁতুলিয়া	9notetuliaup.naogaon.gov.bd
1468	\N	Nurullabad	নূরুল্যাবাদ	10nonurullabadup.naogaon.gov.bd
1469	\N	Kalikapur	কালিকাপুর	11nokalikapurup.naogaon.gov.bd
1470	\N	Kashopara	কাঁশোকাপুর	12nokashoparaup.naogaon.gov.bd
1471	\N	Koshob	কশব	13nokoshobup.naogaon.gov.bd
1472	\N	Bisnopur	বিষ্ণপুর	14nobisnopurup.naogaon.gov.bd
1473	\N	Shahagola	শাহাগোলা	1noshahagolaup.naogaon.gov.bd
1474	\N	Bhonpara	ভোঁপড়া	2nobhonparaup.naogaon.gov.bd
1475	\N	Ahsanganj	আহসানগঞ্জ	3noahsanganjup.naogaon.gov.bd
1476	\N	Panchupur	পাঁচুপুর	4nopanchupurup.naogaon.gov.bd
1477	\N	Bisha	বিশা	5nobishaup.naogaon.gov.bd
1478	\N	Maniary	মনিয়ারী	6nomaniaryup.naogaon.gov.bd
1479	\N	Kalikapur	কালিকাপুর	7nokalikapurup.naogaon.gov.bd
1480	\N	Hatkalupara	হাটকালুপাড়া	8nohatkaluparaup.naogaon.gov.bd
1481	\N	Khatteshawr	খট্টেশ্বর রাণীনগর	1nokhatteshawrup.naogaon.gov.bd
1482	\N	Kashimpur	কাশিমপুর	2nokashimpurup.naogaon.gov.bd
1483	\N	Gona	গোনা	3nogonaup.naogaon.gov.bd
1484	\N	Paroil	পারইল	4noparoilup.naogaon.gov.bd
1485	\N	Borgoca	বরগাছা	5noborgocaup.naogaon.gov.bd
1486	\N	Kaligram	কালিগ্রাম	6nokaligramup.naogaon.gov.bd
1487	\N	Ekdala	একডালা	7noekdalaup.naogaon.gov.bd
1488	\N	Mirat	মিরাট	8nomiratup.naogaon.gov.bd
1489	\N	Barshail	বর্ষাইল	1nobarshailup.naogaon.gov.bd
1490	\N	Kritipur	কির্ত্তিপুর	2nokritipurup.naogaon.gov.bd
1491	\N	Baktiarpur	বক্তারপুর	3nobaktiarpurup.naogaon.gov.bd
1492	\N	Tilakpur	তিলোকপুর	4notilakpurup.naogaon.gov.bd
1493	\N	Hapaniya	হাপানিয়া	5nohapaniyaup.naogaon.gov.bd
1494	\N	Dubalhati	দুবলহাটী	6nodubalhatiup.naogaon.gov.bd
1495	\N	Boalia	বোয়ালিয়া	7noboaliaup.naogaon.gov.bd
1496	\N	Hashaigari	হাঁসাইগাড়ী	8nohashaigariup.naogaon.gov.bd
1497	\N	Chandipur	চন্ডিপুর	9nochandipurup.naogaon.gov.bd
1498	\N	Bolihar	বলিহার	10noboliharup.naogaon.gov.bd
1499	\N	Shekerpur	শিকারপুর	11noshekerpurup.naogaon.gov.bd
1500	\N	Shailgachhi	শৈলগাছী	12noshailgachhiup.naogaon.gov.bd
1501	\N	Nitpur	নিতপুর	nitpurup.naogaon.gov.bd
1502	\N	Tetulia	তেঁতুলিয়া	2notetuliaup.naogaon.gov.bd
1503	\N	Chhaor	ছাওড়	3nochhaorup.naogaon.gov.bd
1504	\N	Ganguria	গাঙ্গুরিয়া	4noganguriaup.naogaon.gov.bd
1505	\N	Ghatnagar	ঘাটনগর	5noghatnagarup.naogaon.gov.bd
1506	\N	Moshidpur	মশিদপুর	6nomoshidpurup.naogaon.gov.bd
1507	\N	Sapahar	সাপাহার	1nosapaharup.naogaon.gov.bd
1508	\N	Tilna	তিলনা	3notilnaup.naogaon.gov.bd
1509	\N	Aihai	আইহাই	4noaihaiup.naogaon.gov.bd
1510	\N	Shironti	শিরন্টী	6noshirontiup.naogaon.gov.bd
1511	\N	Goala	গোয়ালা	goalaup.naogaon.gov.bd
1512	\N	Patari	পাতাড়ী	patariup.naogaon.gov.bd
1513	\N	Nehalpur	নেহালপুর	nehalpurup.jessore.gov.bd
1514	\N	Hariharnagar	হরিহরনগর	hariharnagarup.jessore.gov.bd
1515	\N	Haridaskati	হরিদাসকাটি	haridaskatiup.jessore.gov.bd
1516	\N	Shyamkur	শ্যামকুড়	shyamkurup.jessore.gov.bd
1517	\N	Rohita	রোহিতা	rohitaup.jessore.gov.bd
1518	\N	Maswimnagar	মশ্মিমনগর	maswimnagarup.jessore.gov.bd
1519	\N	Manoharpur	মনোহরপুর	manoharpurup.jessore.gov.bd
1520	\N	Manirampur	মনিরামপুর	manirampurup.jessore.gov.bd
1521	\N	Bhojgati	ভোজগাতি	bhojgatiup.jessore.gov.bd
1522	\N	Durbadanga	দুর্বাডাংগা	durbadangaup.jessore.gov.bd
1523	\N	Dhakuria	ঢাকুরিয়া	dhakuriaup.jessore.gov.bd
1524	\N	Jhanpa	ঝাঁপা	jhanpaup.jessore.gov.bd
1525	\N	Chaluahati	চালুয়াহাটি	chaluahatiup.jessore.gov.bd
1526	\N	Khedapara	খেদাপাড়া	khedaparaup.jessore.gov.bd
1527	\N	Khanpur	খানপুর	khanpurup.jessore.gov.bd
1528	\N	Kultia	কুলটিয়া	kultiaup.jessore.gov.bd
1529	\N	Kashimnagar	কাশিমনগর	kashimnagarup.jessore.gov.bd
1530	\N	Baghutia	বাঘুটিয়া	baghutia.jessore.gov.bd
1531	\N	Chalishia	চলিশিয়া	chalishiaup.jessore.gov.bd
1532	\N	Sundoli	সুন্দলী	sundoliup.jessore.gov.bd
1533	\N	Siddhipasha	সিদ্দিপাশা	siddhipashaup.jessore.gov.bd
1534	\N	Sreedharpur	শ্রীধরপুর	sreedharpurup.jessore.gov.bd
1535	\N	Subharara	শুভরাড়া	subhararaup.jessore.gov.bd
1536	\N	Prambag	প্রেমবাগ	prambagup.jessore.gov.bd
1537	\N	Payra	পায়রা	payraup.jessore.gov.bd
1538	\N	Jaharpur	জহুরপুর	jaharpurup.jessore.gov.bd
1539	\N	Jamdia	জামদিয়া	jamdiaup.jessore.gov.bd
1540	\N	Darajhat	দরাজহাট	darajhatup.jessore.gov.bd
1541	\N	Dhalgram	ধলগ্রাম	dhalgramup.jessore.gov.bd
1542	\N	Narikelbaria	নারিকেলবাড়ীয়া	narikelbariaup.jessore.gov.bd
1543	\N	Bandabilla	বন্দবিলা	bandabillaup.jessore.gov.bd
1544	\N	Basuari	বাসুয়াড়ী	basuariup.jessore.gov.bd
1545	\N	Roypur	রায়পুর	roypurup.jessore.gov.bd
1546	\N	Dohakula	দোহাকুলা	dohakulaup.jessore.gov.bd
1547	\N	Chougachha	চৌগাছা	chougachhaup5.jessore.gov.bd
1548	\N	Jagadishpur	জগদীশপুর	jagadishpurup6.jessore.gov.bd
1549	\N	Dhuliani	ধুলিয়ানী	dhulianiup4.jessore.gov.bd
1550	\N	Narayanpur	নারায়নপুর	narayanpurup10.jessore.gov.bd
1551	\N	Patibila	পাতিবিলা	patibilaup7.jessore.gov.bd
1552	\N	Pashapole	পাশাপোল	pashapoleup2.jessore.gov.bd
1553	\N	Fulsara	ফুলসারা	fulsaraup1.jessore.gov.bd
1554	\N	Singhajhuli	সিংহঝুলি	singhajhuliup3.jessore.gov.bd
1555	\N	Sukpukhuria	সুখপুকুরিয়া	sukpukhuriaup11.jessore.gov.bd
1556	\N	Swarupdaha	সরুপদাহ	swarupdahaup9.jessore.gov.bd
1557	\N	Hakimpur	হাকিমপুর	hakimpurup8.jessore.gov.bd
1558	\N	Gangananda	গংগানন্দপুর	ganganandapurup.jessore.gov.bd
1559	\N	Gadkhali	গদখালী	gadkhaliup.jessore.gov.bd
1560	\N	Jhikargachha	ঝিকরগাছা	jhikargachhaup.jessore.gov.bd
1561	\N	Nabharan	নাভারন	nabharanup.jessore.gov.bd
1562	\N	Nibaskhola	নির্বাসখোলা	nibaskholaup.jessore.gov.bd
1563	\N	Panisara	পানিসারা	panisaraup.jessore.gov.bd
1564	\N	Bankra	বাঁকড়া	bankraup.jessore.gov.bd
1565	\N	Shankarpur	শংকরপুর	shankarpurup10.jessore.gov.bd
1566	\N	Shimulia	শিমুলিয়া	shimuliaup3.jessore.gov.bd
1567	\N	Hajirbagh	হাজিরবাগ	hajirbaghup9.jessore.gov.bd
1568	\N	Magura	মাগুরা	maguraup.jessore.gov.bd
1569	\N	Sufalakati	সুফলাকাটি	sufalakatiup8.jessore.gov.bd
1570	\N	Sagardari	সাগরদাড়ী	sagardariup2.jessore.gov.bd
1571	\N	Majidpur	মজিদপুর	majidpurup3.jessore.gov.bd
1572	\N	Mongolkot	মঙ্গলকোর্ট	mongolkotup5.jessore.gov.bd
1573	\N	Bidyanandakati	বিদ্যানন্দকাটি	bidyanandakatiup4.jessore.gov.bd
1574	\N	Panjia	পাজিয়া	panjiaup7.jessore.gov.bd
1575	\N	Trimohini	ত্রিমোহিনী	trimohiniup1.jessore.gov.bd
1576	\N	Gaurighona	গৌরিঘোনা	gaurighonaup9.jessore.gov.bd
1577	\N	Keshabpur	কেশবপুর	keshabpurup6.jessore.gov.bd
1578	\N	Lebutala	লেবুতলা	lebutalaup.jessore.gov.bd
1579	\N	Ichhali	ইছালী	ichhaliup.jessore.gov.bd
1580	\N	Arabpur	আরবপুর	arabpurup9.jessore.gov.bd
1581	\N	Upasahar	উপশহর	upasaharup.jessore.gov.bd
1582	\N	Kachua	কচুয়া	kachuaup13.jessore.gov.bd
1583	\N	Kashimpur	কাশিমপুর	kashimpurup6.jessore.gov.bd
1584	\N	Chanchra	চাঁচড়া	chanchraup.jessore.gov.bd
1585	\N	Churamankati	চূড়ামনকাটি	churamankatiup.jessore.gov.bd
1586	\N	Narendrapur	নরেন্দ্রপুর	narendrapurup.jessore.gov.bd
1587	\N	Noapara	নওয়াপাড়া	noaparaup4.jessore.gov.bd
1588	\N	Fathehpur	ফতেপুর	fathehpurup.jessore.gov.bd
1589	\N	Basundia	বসুন্দিয়া	basundiaup.jessore.gov.bd
1590	\N	Ramnagar	রামনগর	ramnagarup.jessore.gov.bd
1591	\N	Haibatpur	হৈবতপুর	haibatpurup.jessore.gov.bd
1592	\N	Dearamodel	দেয়ারা মডেল	dearamodelup.jessore.gov.bd
1593	\N	Ulshi	উলশী	ulshiup9.jessore.gov.bd
1594	\N	Sharsha	শার্শা	sharshaup10.jessore.gov.bd
1595	\N	Lakshmanpur	লক্ষণপুর	lakshmanpurup2.jessore.gov.bd
1596	\N	Benapole	বেনাপোল	benapoleup4.jessore.gov.bd
1597	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup3.jessore.gov.bd
1598	\N	Bagachra	বাগআচড়া	bagachraup8.jessore.gov.bd
1599	\N	Putkhali	পুটখালী	putkhaliup5.jessore.gov.bd
1600	\N	Nizampur	নিজামপুর	nizampurup11.jessore.gov.bd
1601	\N	Dihi	ডিহি	dihiup1.jessore.gov.bd
1602	\N	Goga	গোগা	gogaup6.jessore.gov.bd
1603	\N	Kayba	কায়বা	kaybaup7.jessore.gov.bd
1604	\N	Anulia	আনুলিয়া	anuliaup.satkhira.gov.bd
1605	\N	Assasuni	আশাশুনি	assasuniup.satkhira.gov.bd
1606	\N	Kadakati	কাদাকাটি	kadakatiup.satkhira.gov.bd
1607	\N	Kulla	কুল্যা	kullaup.satkhira.gov.bd
1608	\N	Khajra	খাজরা	khajraup.satkhira.gov.bd
1609	\N	Durgapur	দরগাহপুর	durgapurup.satkhira.gov.bd
1610	\N	Pratapnagar	প্রতাপনগর	pratapnagarup.satkhira.gov.bd
1611	\N	Budhhata	বুধহাটা	budhhataup.satkhira.gov.bd
1612	\N	Baradal	বড়দল	baradalup.satkhira.gov.bd
1613	\N	Sreeula	শ্রীউলা	sreeulaup.satkhira.gov.bd
1614	\N	Sobhnali	শোভনালী	sobhnaliup.satkhira.gov.bd
1615	\N	Kulia	কুলিয়া	kuliaup.satkhira.gov.bd
1616	\N	Debhata	দেবহাটা	debhataup.satkhira.gov.bd
1617	\N	Noapara	নওয়াপাড়া	noaparaup.satkhira.gov.bd
1618	\N	Parulia	পারুলিয়া	paruliaup.satkhira.gov.bd
1619	\N	Sakhipur	সখিপুর	sakhipurup.satkhira.gov.bd
1620	\N	Kushadanga	কুশোডাংগা	kushadangaup.satkhira.gov.bd
1621	\N	Keralkata	কেরালকাতা	keralkataup.satkhira.gov.bd
1622	\N	Keragachhi	কেঁড়াগাছি	keragachhiup.satkhira.gov.bd
1623	\N	Kaila	কয়লা	kailaup.satkhira.gov.bd
1624	\N	Jallabad	জালালাবাদ	jallabadup.satkhira.gov.bd
1625	\N	Jogikhali	যুগিখালী	jogikhaliup.satkhira.gov.bd
1626	\N	Langaljhara	লাঙ্গলঝাড়া	langaljharaup.satkhira.gov.bd
1627	\N	Sonabaria	সোনাবাড়িয়া	sonabariaup.satkhira.gov.bd
1628	\N	Helatala	হেলাতলা	helatalaup.satkhira.gov.bd
1629	\N	Chandanpur	চন্দনপুর	chandanpurup.satkhira.gov.bd
1630	\N	Deara	দেয়ারা	dearaup.satkhira.gov.bd
1631	\N	Joynagar	জয়নগর	joynagarup.satkhira.gov.bd
1632	\N	Shibpur	শিবপুর	shibpurup.satkhira.gov.bd
1633	\N	Labsa	লাবসা	labsaup.satkhira.gov.bd
1634	\N	Bhomra	ভোমরা	bhomraup.satkhira.gov.bd
1635	\N	Brahmarajpur	ব্রক্ষ্মরাজপুর	brahmarajpurup.satkhira.gov.bd
1636	\N	Balli	বল্লী	balliup.satkhira.gov.bd
1637	\N	Banshdaha	বাঁশদহ	banshdahaup.satkhira.gov.bd
1638	\N	Baikari	বৈকারী	baikariup.satkhira.gov.bd
1639	\N	Fingri	ফিংড়ি	fingriup.satkhira.gov.bd
1640	\N	Dhulihar	ধুলিহর	dhuliharup.satkhira.gov.bd
1641	\N	Jhaudanga	ঝাউডাঙ্গা	jhaudangaup.satkhira.gov.bd
1642	\N	Ghona	ঘোনা	ghonaup.satkhira.gov.bd
1643	\N	Kuskhali	কুশখালী	kuskhaliup.satkhira.gov.bd
1644	\N	Alipur	আলিপুর	alipurup.satkhira.gov.bd
1645	\N	Agardari	আগরদাড়ী	agardariup.satkhira.gov.bd
1646	\N	Atulia	আটুলিয়া	atuliaup.satkhira.gov.bd
1647	\N	Ishwaripur	ঈশ্বরীপুর	ishwaripurup.satkhira.gov.bd
1648	\N	Kaikhali	কৈখালী	kaikhaliup.satkhira.gov.bd
1649	\N	Kashimari	কাশিমাড়ী	kashimariup.satkhira.gov.bd
1650	\N	Nurnagar	নুরনগর	nurnagarup.satkhira.gov.bd
1651	\N	Padmapukur	পদ্মপুকুর	padmapukurup.satkhira.gov.bd
1652	\N	Burigoalini	বুড়িগোয়ালিনী	burigoaliniup.satkhira.gov.bd
1653	\N	Bhurulia	ভুরুলিয়া	bhuruliaup.satkhira.gov.bd
1654	\N	Munshiganj	মুন্সীগজ্ঞ	munshiganjup.satkhira.gov.bd
1655	\N	Ramjannagar	রমজাননগর	ramjannagarup.satkhira.gov.bd
1656	\N	Shyamnagar	শ্যামনগর	shyamnagarup.satkhira.gov.bd
1657	\N	Gabura	গাবুরা	gaburaup.satkhira.gov.bd
1658	\N	Sarulia	সরুলিয়া	saruliaup3.satkhira.gov.bd
1659	\N	Magura	মাগুরা	maguraup8.satkhira.gov.bd
1660	\N	Nagarghata	নগরঘাটা	nagarghataup1.satkhira.gov.bd
1661	\N	Dhandia	ধানদিয়া	dhandiaup1.satkhira.gov.bd
1662	\N	Tentulia	তেতুলিয়া	tentuliaup5.satkhira.gov.bd
1663	\N	Tala	তালা	talaup6.satkhira.gov.bd
1664	\N	Jalalpur	জালালপুর	jalalpurup11.satkhira.gov.bd
1665	\N	Khesra	খেশরা	khesraup10.satkhira.gov.bd
1666	\N	Khalishkhali	খলিশখালী	khalishkhaliup9.satkhira.gov.bd
1667	\N	Khalilnagar	খলিলনগর	khalilnagarup12.satkhira.gov.bd
1668	\N	Kumira	কুমিরা	kumiraup4.satkhira.gov.bd
1669	\N	Islamkati	ইসলামকাটি	islamkatiup7.satkhira.gov.bd
1670	\N	Kushlia	কুশুলিয়া	kushliaup.satkhira.gov.bd
1671	\N	Champaphul	চাম্পাফুল	champaphulup.satkhira.gov.bd
1672	\N	Tarali	তারালী	taraliup.satkhira.gov.bd
1673	\N	Dakshin Sreepur	দক্ষিণ শ্রীপুর	dakshinsreepurup.satkhira.gov.bd
1674	\N	Dhalbaria	ধলবাড়িয়া	dhalbariaup.satkhira.gov.bd
1675	\N	Nalta	নলতা	naltaup.satkhira.gov.bd
1676	\N	Bishnupur	বিষ্ণুপুর	bishnupurup.satkhira.gov.bd
1677	\N	Bharasimla	ভাড়াশিমলা	bharasimlaup.satkhira.gov.bd
1678	\N	Mathureshpur	মথুরেশপুর	mathureshpurup.satkhira.gov.bd
1679	\N	Ratanpur	রতনপুর	ratanpurup.satkhira.gov.bd
1680	\N	Mautala	মৌতলা	mautalaup.satkhira.gov.bd
1681	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.satkhira.gov.bd
1682	\N	Dariapur	দারিয়াপুর	dariapurup.meherpur.gov.bd
1683	\N	Monakhali	মোনাখালী	monakhali.meherpur.gov.bd
1684	\N	Bagowan	বাগোয়ান	bagowanup.meherpur.gov.bd
1685	\N	Mohajanpur	মহাজনপুর	mohajanpurup.meherpur.gov.bd
1686	\N	Amjhupi	আমঝুপি	amjhupi.meherpur.gov.bd
1687	\N	Pirojpur	পিরোজপুর	pirojpurup.meherpur.gov.bd
1688	\N	Kutubpur	কতুবপুর	kutubpurup.meherpur.gov.bd
1689	\N	Amdah	আমদহ	amdahup.meherpur.gov.bd
1690	\N	Buripota	বুড়িপোতা	buripotaup.meherpur.gov.bd
1691	\N	Tentulbaria	তেঁতুলবাড়ীয়া	tentulbaria.meherpur.gov.bd
1692	\N	Kazipur	কাজিপুর	kazipurup.meherpur.gov.bd
1693	\N	Bamondi	বামন্দী	bamondiup.meherpur.gov.bd
1694	\N	Motmura	মটমুড়া	motmuraup.meherpur.gov.bd
1695	\N	Sholotaka	ষোলটাকা	sholotakaup.meherpur.gov.bd
1696	\N	Shaharbati	সাহারবাটী	shaharbatiup.meherpur.gov.bd
1697	\N	Dhankolla	ধানখোলা	dhankollaup.meherpur.gov.bd
1698	\N	Raipur	রায়পুর	raipurup.meherpur.gov.bd
1699	\N	Kathuli	কাথুলী	kathuli.meherpur.gov.bd
1700	\N	Sheikhati	সেখহাটী	sheikhatiup.narail.gov.bd
1701	\N	Tularampur	তুলারামপুর	tularampurup.narail.gov.bd
1702	\N	Kalora	কলোড়া	kaloraup.narail.gov.bd
1703	\N	Shahabad	শাহাবাদ	shahabadup.narail.gov.bd
1704	\N	Bashgram	বাশগ্রাম	bashgramup.narail.gov.bd
1705	\N	Habokhali	হবখালী	habokhaliup.narail.gov.bd
1706	\N	Maijpara	মাইজপাড়া	maijparaup.narail.gov.bd
1707	\N	Bisali	বিছালী	bisaliup.narail.gov.bd
1708	\N	Chandiborpur	চন্ডিবরপুর	chandiborpurup.narail.gov.bd
1709	\N	Bhadrabila	ভদ্রবিলা	bhadrabilaup.narail.gov.bd
1710	\N	Auria	আউড়িয়া	auriaup.narail.gov.bd
1711	\N	Singasholpur	সিঙ্গাশোলপুর	singasholpurup.narail.gov.bd
1712	\N	Mulia	মুলিয়া	muliaup.narail.gov.bd
1713	\N	Lohagora	লোহাগড়া	lohagoraup.narail.gov.bd
1714	\N	Kashipur	কাশিপুর	kashipurup.narail.gov.bd
1715	\N	Naldi	নলদী	naldiup.narail.gov.bd
1716	\N	Noagram	নোয়াগ্রাম	noagramup.narail.gov.bd
1717	\N	Lahuria	লাহুড়িয়া	lahuriaup.narail.gov.bd
1718	\N	Mallikpur	মল্লিকপুর	mallikpurup.narail.gov.bd
1719	\N	Salnagar	শালনগর	salnagarup.narail.gov.bd
1720	\N	Lakshmipasha	লক্ষীপাশা	lakshmipashaup.narail.gov.bd
1721	\N	Joypur	জয়পুর	joypurup.narail.gov.bd
1722	\N	Kotakol	কোটাকোল	kotakolup.narail.gov.bd
1723	\N	Digholia	দিঘলিয়া	digholiaup1.narail.gov.bd
1724	\N	Itna	ইতনা	itnaup.narail.gov.bd
1725	\N	Jaynagor	জয়নগর	jaynagorup.narail.gov.bd
1726	\N	Pahordanga	পহরডাঙ্গা	pahordangaup.narail.gov.bd
1727	\N	Babrahasla	বাবরা-হাচলা	babrahaslaup.narail.gov.bd
1728	\N	Salamabad	সালামাবাদ	salamabadup.narail.gov.bd
1729	\N	Baioshona	বাঐসোনা	baioshonaup.narail.gov.bd
1730	\N	Chacuri	চাচুড়ী	chacuriup.narail.gov.bd
1731	\N	Hamidpur	হামিদপুর	hamidpurup.narail.gov.bd
1732	\N	Peroli	পেড়লী	peroliup.narail.gov.bd
1733	\N	Khashial	খাসিয়াল	khashialup.narail.gov.bd
1734	\N	Purulia	পুরুলিয়া	puruliaup.narail.gov.bd
1735	\N	Kalabaria	কলাবাড়ীয়া	kalabariaup.narail.gov.bd
1736	\N	Mauli	মাউলী	mauliup.narail.gov.bd
1737	\N	Boronaleliasabad	বড়নাল-ইলিয়াছাবাদ	boronaleliasabadup.narail.gov.bd
1738	\N	Panchgram	পাঁচগ্রাম	panchgramup.narail.gov.bd
1739	\N	Alukdia	আলুকদিয়া	alukdia.chuadanga.gov.bd
1740	\N	Mominpur	মোমিনপুর	mominpur.chuadanga.gov.bd
1741	\N	Titudah	তিতুদাহ	titudah.chuadanga.gov.bd
1742	\N	Shankarchandra	শংকরচন্দ্র	shankarchandra.chuadanga.gov.bd
1743	\N	Begumpur	বেগমপুর	begumpur.chuadanga.gov.bd
1744	\N	Kutubpur	কুতুবপুর	kutubpur.chuadanga.gov.bd
1745	\N	Padmabila	পদ্মবিলা	padmabila.chuadanga.gov.bd
1746	\N	Bhangbaria	ভাংবাড়ীয়া	bhangbaria.chuadanga.gov.bd
1747	\N	Baradi	বাড়াদী	baradiup.chuadanga.gov.bd
1748	\N	Gangni	গাংনী	gangniup.chuadanga.gov.bd
1749	\N	Khadimpur	খাদিমপুর	khadimpurup.chuadanga.gov.bd
1750	\N	Jehala	জেহালা	jehalaup.chuadanga.gov.bd
1751	\N	Belgachi	বেলগাছি	belgachiup.chuadanga.gov.bd
1752	\N	Dauki	ডাউকী	daukiup.chuadanga.gov.bd
1753	\N	Jamjami	জামজামি	jamjamiup.chuadanga.gov.bd
1754	\N	Nagdah	নাগদাহ	nagdahup.chuadanga.gov.bd
1755	\N	Kashkorara	খাসকররা	kashkoraraup.chuadanga.gov.bd
1756	\N	Chitla	চিৎলা	chitlaup.chuadanga.gov.bd
1757	\N	Kalidashpur	কালিদাসপুর	kalidashpurup.chuadanga.gov.bd
1758	\N	Kumari	কুমারী	kumariup.chuadanga.gov.bd
1759	\N	Hardi	হারদী	hardiup.chuadanga.gov.bd
1760	\N	Ailhash	আইলহাঁস	ailhashup.chuadanga.gov.bd
1761	\N	Damurhuda	দামুড়হুদা	damurhudaup.chuadanga.gov.bd
1762	\N	Karpashdanga	কার্পাসডাঙ্গা	karpashdanga.chuadanga.gov.bd
1763	\N	Natipota	নতিপোতা	natipota.chuadanga.gov.bd
1764	\N	Hawli	হাওলী	hawli.chuadanga.gov.bd
1765	\N	Kurulgachhi	কুড়ালগাছী	kurulgachhi.chuadanga.gov.bd
1766	\N	Perkrishnopur Madna	পারকৃষ্ণপুর মদনা	perkrishnopurmadna.chuadanga.gov.bd
1767	\N	Juranpur	জুড়ানপুর	juranpurup.chuadanga.gov.bd
1768	\N	Uthali	উথলী	uthaliup.chuadanga.gov.bd
1769	\N	Andulbaria	আন্দুলবাড়ীয়া	andulbaria.chuadanga.gov.bd
1770	\N	Banka	বাঁকা	bankaup.chuadanga.gov.bd
1771	\N	Shimanto	সীমান্ত	shimanto.chuadanga.gov.bd
1772	\N	Raypur	রায়পুর	raypurup.chuadanga.gov.bd
1773	\N	Hasadah	হাসাদাহ	hasadahup.chuadanga.gov.bd
1774	\N	Hatash Haripur	হাটশ হরিপুর	1nohatashharipurup.kushtia.gov.bd
1775	\N	Barkhada	বারখাদা	2nobarkhadaup.kushtia.gov.bd
1776	\N	Mazampur	মজমপুর	3nomazampurup.kushtia.gov.bd
1777	\N	Bottail	বটতৈল	4nobottailup.kushtia.gov.bd
1778	\N	Alampur	আলামপুর	5noalampurup.kushtia.gov.bd
1779	\N	Ziaraakhi	জিয়ারাখী	6noziaraakhiup.kushtia.gov.bd
1780	\N	Ailchara	আইলচারা	7noailcharaup.kushtia.gov.bd
1781	\N	Patikabari	পাটিকাবাড়ী	8nopatikabariup.kushtia.gov.bd
1782	\N	Jhaudia	ঝাউদিয়া	9nojhaudiaup.kushtia.gov.bd
1783	\N	Ujangram	উজানগ্রাম	10noujangramup.kushtia.gov.bd
1784	\N	Abdulpur	আব্দালপুর	11noabdulpurup.kushtia.gov.bd
1785	\N	Harinarayanpur	হরিনারায়নপুর	12noharinarayanpurup.kushtia.gov.bd
1786	\N	Monohardia	মনোহরদিয়া	13nomonohardiaup.kushtia.gov.bd
1787	\N	Goswami Durgapur	গোস্বামী দুর্গাপুর	14nogoswamidurgapurup.kushtia.gov.bd
1788	\N	Kaya	কয়া	1nokayaup.kushtia.gov.bd
1789	\N	Jagonnathpur	জগন্নাথপুর	3nojagonnathpurup.kushtia.gov.bd
1790	\N	Sadki	সদকী	4nosadkiup.kushtia.gov.bd
1791	\N	Shelaidah	শিলাইদহ	2noshelaidahup.kushtia.gov.bd
1792	\N	Nandolalpur	নন্দলালপুর	5nonandolalpurup.kushtia.gov.bd
1793	\N	Chapra	চাপড়া	6nochapraup.kushtia.gov.bd
1794	\N	Bagulat	বাগুলাট	7nobagulatup.kushtia.gov.bd
1795	\N	Jaduboyra	যদুবয়রা	8nojaduboyraup.kushtia.gov.bd
1796	\N	Chadpur	চাঁদপুর	9nochadpurup.kushtia.gov.bd
1797	\N	Panti	পান্টি	10nopantiup.kushtia.gov.bd
1798	\N	Charsadipur	চরসাদীপুর	11nocharsadipurup.kushtia.gov.bd
1799	\N	Khoksa	খোকসা	1nokhoksaup.kushtia.gov.bd
1800	\N	Osmanpur	ওসমানপুর	2noosmanpurup.kushtia.gov.bd
1801	\N	Janipur	জানিপুর	4nojanipurup.kushtia.gov.bd
1802	\N	Shimulia	শিমুলিয়া	5noshimuliaup.kushtia.gov.bd
1803	\N	Joyntihazra	জয়ন্তীহাজরা	8nojoyntihazraup.kushtia.gov.bd
1804	\N	Ambaria	আমবাড়ীয়া	9noambariaup.kushtia.gov.bd
1805	\N	Bethbaria	বেতবাড়ীয়া	3nobethbariaup.kushtia.gov.bd
1806	\N	Shomospur	শোমসপুর	6noshomospurup.kushtia.gov.bd
1807	\N	Gopgram	গোপগ্রাম	gopgram7up.kushtia.gov.bd
1808	\N	Chithalia	চিথলিয়া	chithaliaup.kushtia.gov.bd
1809	\N	Bahalbaria	বহলবাড়ীয়া	bahalbariaup.kushtia.gov.bd
1810	\N	Talbaria	তালবাড়ীয়া	talbariaup.kushtia.gov.bd
1811	\N	Baruipara	বারুইপাড়া	baruiparaup.kushtia.gov.bd
1812	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.kushtia.gov.bd
1813	\N	Amla	আমলা	amlaup.kushtia.gov.bd
1814	\N	Sadarpur	সদরপুর	sadarpurup.kushtia.gov.bd
1815	\N	Chhatian	ছাতিয়ান	chhatianup.kushtia.gov.bd
1816	\N	Poradaha	পোড়াদহ	poradahaup.kushtia.gov.bd
1817	\N	Kursha	কুর্শা	kurshaup.kushtia.gov.bd
1818	\N	Ambaria	আমবাড়ীয়া	ambariaup.kushtia.gov.bd
1819	\N	Dhubail	ধূবইল	dhubailup.kushtia.gov.bd
1820	\N	Malihad	মালিহাদ	11nomalihadup.kushtia.gov.bd
1821	\N	Daulatpur	দৌলতপুর	daulatpurup.kushtia.gov.bd
1822	\N	Adabaria	ড়ীয়া	adabariaup.kushtia.gov.bd
1823	\N	Hogolbaria	হোগলবাড়ীয়া	hogolbariaup.kushtia.gov.bd
1824	\N	Boalia	বোয়ালি	boaliaup.kushtia.gov.bd
1825	\N	Philipnagor	ফিলিপনগর	philipnagorup.kushtia.gov.bd
1826	\N	Aria	আড়িয়া	ariaup.kushtia.gov.bd
1827	\N	Khalishakundi	খলিশাকুন্ডি	khalishakundiup.kushtia.gov.bd
1828	\N	Chilmary	চিলমারী	chilmaryup.kushtia.gov.bd
1829	\N	Mothurapur	মথুরাপুর	mothurapurup.kushtia.gov.bd
1830	\N	Pragpur	প্রাগপুর	pragpurup.kushtia.gov.bd
1831	\N	Piarpur	পিয়ারপুর	piarpurup.kushtia.gov.bd
1832	\N	Moricha	মরিচা	morichaup.kushtia.gov.bd
1833	\N	Refaitpur	রিফাইতপুর	9norefaitpurup.kushtia.gov.bd
1834	\N	Ramkrishnopur	রামকৃষ্ণপুর	5noramkrishnopurup.kushtia.gov.bd
1835	\N	Dharampur	ধরমপুর	5nodharampurup.kushtia.gov.bd
1836	\N	Bahirchar	বাহিরচর	3nobahircharup.kushtia.gov.bd
1837	\N	Mukarimpur	মোকারিমপুর	2nomukarimpurup.kushtia.gov.bd
1838	\N	Juniadah	জুনিয়াদহ	6nojuniadahup.kushtia.gov.bd
1839	\N	Chandgram	চাঁদগ্রাম	4nochandgramup.kushtia.gov.bd
1840	\N	Bahadurpur	বাহাদুরপুর	1nobahadurpurup.kushtia.gov.bd
1841	\N	Dhaneshwargati	ধনেশ্বরগাতী	dhaneshwargatiup.magura.gov.bd
1842	\N	Talkhari	তালখড়ি	talkhariup.magura.gov.bd
1843	\N	Arpara	আড়পাড়া	arparaup.magura.gov.bd
1844	\N	Shatakhali	শতখালী	shatakhaliup.magura.gov.bd
1845	\N	Shalikha	শালিখা	shalikhaup.magura.gov.bd
1846	\N	Bunagati	বুনাগাতী	bunagatiup.magura.gov.bd
1847	\N	Gongarampur	গঙ্গারামপুর	gongarampurup.magura.gov.bd
1848	\N	Goyespur	গয়েশপুর	goyespurup.magura.gov.bd
1849	\N	Sreekol	শ্রীকোল	sreekolup.magura.gov.bd
1850	\N	Dariapur	দ্বারিয়াপুর	dariapurup.magura.gov.bd
1851	\N	Kadirpara	কাদিরপাড়া	kadirparaup.magura.gov.bd
1852	\N	Shobdalpur	সব্দালপুর	shobdalpurup.magura.gov.bd
1853	\N	Sreepur	শ্রীপুর	sreepurup.magura.gov.bd
1854	\N	Nakol	নাকোল	nakolup.magura.gov.bd
1855	\N	Amalshar	আমলসার	amalsharup.magura.gov.bd
1856	\N	Hazipur	হাজীপুর	hazipurup.magura.gov.bd
1857	\N	Atharokhada	আঠারখাদা	atharokhadaup.magura.gov.bd
1858	\N	Kosundi	কছুন্দী	kosundiup.magura.gov.bd
1859	\N	Bogia	বগিয়া	bogiaup.magura.gov.bd
1860	\N	Hazrapur	হাজরাপুর	hazrapurup.magura.gov.bd
1861	\N	Raghobdair	রাঘবদাইড়	raghobdairup.magura.gov.bd
1862	\N	Jagdal	জগদল	jagdalup.magura.gov.bd
1863	\N	Chawlia	চাউলিয়া	chawliaup.magura.gov.bd
1864	\N	Satrijitpur	শত্রুজিৎপুর	satrijitpurup.magura.gov.bd
1865	\N	Baroilpolita	বেরইল পলিতা	baroilpolitaup.magura.gov.bd
1866	\N	Kuchiamora	কুচিয়ামো	kuchiamoraup.magura.gov.bd
1867	\N	Gopalgram	গোপালগ্রাম	gopalgramup.magura.gov.bd
1868	\N	Moghi	মঘী	moghiup.magura.gov.bd
1869	\N	Digha	দীঘা	dighaup.magura.gov.bd
1870	\N	Nohata	নহাটা	nohataup.magura.gov.bd
1871	\N	Palashbaria	পলাশবাড়ীয়া	palashbariaup.magura.gov.bd
1872	\N	Babukhali	বাবুখালী	babukhaliup.magura.gov.bd
1873	\N	Balidia	বালিদিয়া	balidiaup.magura.gov.bd
1874	\N	Binodpur	বিনোদপুর	binodpurup.magura.gov.bd
1875	\N	Mohammadpur	মহম্মদপুর	mohammadpurup.magura.gov.bd
1876	\N	Rajapur	রাজাপুর	rajapurup.magura.gov.bd
1877	\N	Horidhali	হরিঢালী	horidhaliup.khulna.gov.bd
1878	\N	Goroikhali	গড়ইখালী	goroikhaliup.khulna.gov.bd
1879	\N	Kopilmuni	কপিলমুনি	kopilmuniup.khulna.gov.bd
1880	\N	Lota	লতা	lotaup.khulna.gov.bd
1881	\N	Deluti	দেলুটি	delutiup.khulna.gov.bd
1882	\N	Loskor	লস্কর	loskorup.khulna.gov.bd
1883	\N	Godaipur	গদাইপুর	godaipurup.khulna.gov.bd
1884	\N	Raruli	রাড়ুলী	www.raruliup.khulna.gov.bd
1885	\N	Chandkhali	চাঁদখালী	chandkhaliup.khulna.gov.bd
1886	\N	Soladana	সোলাদানা	soladanaup.khulna.gov.bd
1887	\N	Fultola	ফুলতলা	www.fultolaup.khulna.gov.bd
1888	\N	Damodar	দামোদর	www.damodarup.khulna.gov.bd
1889	\N	Atra Gilatola	আটরা গিলাতলা	www.atragilatolaup.khulna.gov.bd
1890	\N	Jamira	জামিরা	www.jamiraup.khulna.gov.bd
1891	\N	Senhati	সেনহাটি	www.senhatiup.khulna.gov.bd
1892	\N	Gajirhat	গাজীরহাট	www.gajirhatup.khulna.gov.bd
1893	\N	Barakpur	বারাকপুর	www.barakpurup.khulna.gov.bd
1894	\N	Aronghata	আড়ংঘাটা	www.aronghataup.khulna.gov.bd
1895	\N	Jogipol	যোগীপোল	www.jogipolup.khulna.gov.bd
1896	\N	Digholia	দিঘলিয়া	www.digholiaup.khulna.gov.bd
1897	\N	Aichgati	আইচগাতী	aichgatiup.khulna.gov.bd
1898	\N	Srifoltola	শ্রীফলতলা	srifoltolaup.khulna.gov.bd
1899	\N	Noihati	নৈহাটি	noihatiup.khulna.gov.bd
1900	\N	Tsb	টিএসবি	tsbup.khulna.gov.bd
1901	\N	Ghatvog	ঘাটভোগ	ghatvogup.khulna.gov.bd
1902	\N	Terokhada	তেরখাদা	terokhadaup.khulna.gov.bd
1903	\N	Chagladoho	ছাগলাদহ	chagladohoup.khulna.gov.bd
1904	\N	Barasat	বারাসাত	www.barasatup.khulna.gov.bd
1905	\N	Sochiadaho	সাচিয়াদাহ	www.sochiadahoup.khulna.gov.bd
1906	\N	Modhupur	মধুপুর	www.modhupurup.khulna.gov.bd
1907	\N	Ajgora	আজগড়া	www.ajgoraup.khulna.gov.bd
1908	\N	Dumuria	ডুমুরিয়া	dumuriaup.khulna.gov.bd
1909	\N	Magurghona	মাগুরাঘোনা	magurghonaup.khulna.gov.bd
1910	\N	Vandarpara	ভান্ডারপাড়া	vandarparaup.khulna.gov.bd
1911	\N	Sahos	সাহস	sahosup.khulna.gov.bd
1912	\N	Rudaghora	রুদাঘরা	rudaghoraup.khulna.gov.bd
1913	\N	Ghutudia	গুটুদিয়া	ghutudiaup.khulna.gov.bd
1914	\N	Shovna	শোভনা	shovnaup.khulna.gov.bd
1915	\N	Khornia	খর্ণিয়া	khorniaup.khulna.gov.bd
1916	\N	Atlia	আটলিয়া	atliaup.khulna.gov.bd
1917	\N	Dhamalia	ধামালিয়া	dhamaliaup.khulna.gov.bd
1918	\N	Raghunathpur	রঘুনাথপুর	raghunathpurup.khulna.gov.bd
1919	\N	Rongpur	রংপুর	rongpurup.khulna.gov.bd
1920	\N	Shorafpur	শরাফপুর	shorafpurup.khulna.gov.bd
1921	\N	Magurkhali	মাগুরখালি	magurkhaliup.khulna.gov.bd
1922	\N	Botiaghata	বটিয়াঘাটা	www.botiaghataup.khulna.gov.bd
1923	\N	Amirpur	আমিরপুর	www.amirpurup.khulna.gov.bd
1924	\N	Gongarampur	গঙ্গারামপুর	www.gongarampurup.khulna.gov.bd
1925	\N	Surkhali	সুরখালী	www.surkhaliup.khulna.gov.bd
1926	\N	Vandarkot	ভান্ডারকোট	www.vandarkotup.khulna.gov.bd
1927	\N	Baliadanga	বালিয়াডাঙ্গা	www.baliadangaup.khulna.gov.bd
1928	\N	Jolma	জলমা	www.jolmaup.khulna.gov.bd
1929	\N	Dakop	দাকোপ	www.dakopup.khulna.gov.bd
1930	\N	Bajua	বাজুয়া	bajuaup.khulna.gov.bd
1931	\N	Kamarkhola	কামারখোলা	www.kamarkholaup.khulna.gov.bd
1932	\N	Tildanga	তিলডাঙ্গা	www.tildangaup.khulna.gov.bd
1933	\N	Sutarkhali	সুতারখালী	www.sutarkhaliup.khulna.gov.bd
1934	\N	Laudoba	লাউডোব	laudobaup.khulna.gov.bd
1935	\N	Pankhali	পানখালী	pankhaliup.khulna.gov.bd
1936	\N	Banishanta	বানিশান্তা	banishantaup.khulna.gov.bd
1937	\N	Koilashgonj	কৈলাশগঞ্জ	koilashgonjup.khulna.gov.bd
1938	\N	Koyra	কয়রা	koyraup.khulna.gov.bd
1939	\N	Moharajpur	মহারাজপুর	moharajpurup.khulna.gov.bd
1940	\N	Moheswaripur	মহেশ্বরীপুর	moheswaripurup.khulna.gov.bd
1941	\N	North Bedkashi	উত্তর বেদকাশী	northbedkashiup.khulna.gov.bd
1942	\N	South Bedkashi	দক্ষিণ বেদকাশী	southbedkashiup.khulna.gov.bd
1943	\N	Amadi	আমাদি	amadiup.khulna.gov.bd
1944	\N	Bagali	বাগালী	bagaliup.khulna.gov.bd
1945	\N	Betaga	বেতাগা	betagaup.bagerhat.gov.bd
1946	\N	Lakhpur	লখপুর	lakhpurup.bagerhat.gov.bd
1947	\N	Fakirhat	ফকিরহাট	fakirhatup.bagerhat.gov.bd
1948	\N	Bahirdia-Mansa	বাহিরদিয়া-মানসা	bahirdiamansaup.bagerhat.gov.bd
1949	\N	Piljanga	পিলজংগ	piljangaup.bagerhat.gov.bd
1950	\N	Naldha-Mouvhog	নলধা-মৌভোগ	naldhamauvhogup.bagerhat.gov.bd
1951	\N	Mulghar	মূলঘর	mulgharup.bagerhat.gov.bd
1952	\N	Suvhadia	শুভদিয়া	suvhadiaup.bagerhat.gov.bd
1953	\N	Karapara	কাড়াপাড়া	karaparaup.bagerhat.gov.bd
1954	\N	Bamorta	বেমরতা	bamortaup.bagerhat.gov.bd
1955	\N	Gotapara	গোটাপাড়া	gotaparaup.bagerhat.gov.bd
1956	\N	Bishnapur	বিষ্ণুপুর	bishnapurup.bagerhat.gov.bd
1957	\N	Baruipara	বারুইপাড়া	baruiparaup.bagerhat.gov.bd
1958	\N	Jatharapur	যাত্রাপুর	jatharapurup.bagerhat.gov.bd
1959	\N	Shaitgomboj	ষাটগুম্বজ	shaitgombojup.bagerhat.gov.bd
1960	\N	Khanpur	খানপুর	khanpurup.bagerhat.gov.bd
1961	\N	Rakhalgachi	রাখালগাছি	rakhalgachiup.bagerhat.gov.bd
1962	\N	Dema	ডেমা	demaup.bagerhat.gov.bd
1963	\N	Udoypur	উদয়পুর	udoypurup.bagerhat.gov.bd
1964	\N	Chunkhola	চুনখোলা	chunkholaup.bagerhat.gov.bd
1965	\N	Gangni	গাংনী	gangniup.bagerhat.gov.bd
1966	\N	Kulia	কুলিয়া	kuliaup.bagerhat.gov.bd
1967	\N	Gaola	গাওলা	gaolaup.bagerhat.gov.bd
1968	\N	Kodalia	কোদালিয়া	kodaliaup.bagerhat.gov.bd
1969	\N	Atjuri	আটজুড়ী	atjuriup.bagerhat.gov.bd
1970	\N	Dhanshagor	ধানসাগর	dhanshagorup.bagerhat.gov.bd
1971	\N	Khontakata	খোন্তাকাটা	khontakataup.bagerhat.gov.bd
1972	\N	Rayenda	রায়েন্দা	rayendaup.bagerhat.gov.bd
1973	\N	Southkhali	সাউথখালী	southkhaliup.bagerhat.gov.bd
1974	\N	Gouramva	গৌরম্ভা	gouramvaup.bagerhat.gov.bd
1975	\N	Uzzalkur	উজলকুড়	uzzalkurup.bagerhat.gov.bd
1976	\N	Baintala	বাইনতলা	baintalaup.bagerhat.gov.bd
1977	\N	Rampal	রামপাল	rampalup.bagerhat.gov.bd
1978	\N	Rajnagar	রাজনগর	rajnagarup.bagerhat.gov.bd
1979	\N	Hurka	হুড়কা	hurkaup.bagerhat.gov.bd
1980	\N	Perikhali	পেড়িখালী	perikhaliup.bagerhat.gov.bd
1981	\N	Vospatia	ভোজপাতিয়া	vospatiaup.bagerhat.gov.bd
1982	\N	Mollikerbar	মল্লিকেরবেড়	mollikerbarup.bagerhat.gov.bd
1983	\N	Bastoli	বাঁশতলী	bastoliup.bagerhat.gov.bd
1984	\N	Teligati	তেলিগাতী	teligatiup.bagerhat.gov.bd
1985	\N	Panchakaran	পঞ্চকরণ	panchakaranup.bagerhat.gov.bd
1986	\N	Putikhali	পুটিখালী	putikhaliup.bagerhat.gov.bd
1987	\N	Daibagnyahati	দৈবজ্ঞহাটি	daibagnyahatiup.bagerhat.gov.bd
1988	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.bagerhat.gov.bd
1989	\N	Chingrakhali	চিংড়াখালী	chingrakhaliup.bagerhat.gov.bd
1990	\N	Jiudhara	জিউধরা	jiudharaup.bagerhat.gov.bd
1991	\N	Hoglapasha	হোগলাপাশা	hoglapashaup.bagerhat.gov.bd
1992	\N	Banagram	বনগ্রাম	banagramup.bagerhat.gov.bd
1993	\N	Balaibunia	বলইবুনিয়া	balaibuniaup.bagerhat.gov.bd
1994	\N	Hoglabunia	হোগলাবুনিয়া	hoglabuniaup.bagerhat.gov.bd
1995	\N	Baharbunia	বহরবুনিয়া	baharbuniaup.bagerhat.gov.bd
1996	\N	Morrelganj	মোড়েলগঞ্জ	morrelganjup.bagerhat.gov.bd
1997	\N	Khaulia	খাউলিয়া	khauliaup.bagerhat.gov.bd
1998	\N	Nishanbaria	নিশানবাড়িয়া	nishanbariaup.bagerhat.gov.bd
1999	\N	Baraikhali	বারইখালী	baraikhaliup.bagerhat.gov.bd
2000	\N	Gojalia	গজালিয়া	gojaliaup.bagerhat.gov.bd
2001	\N	Dhopakhali	ধোপাখালী	dhopakhaliup.bagerhat.gov.bd
2002	\N	Moghia	মঘিয়া	moghiaup.bagerhat.gov.bd
2003	\N	Kachua	কচুয়া	kachuaup.bagerhat.gov.bd
2004	\N	Gopalpur	গোপালপুর	gopalpurup.bagerhat.gov.bd
2005	\N	Raripara	রাড়ীপাড়া	rariparaup.bagerhat.gov.bd
2006	\N	Badhal	বাধাল	badhalup.bagerhat.gov.bd
2007	\N	Burrirdangga	বুড়িরডাঙ্গা	burrirdanggaup.bagerhat.gov.bd
2008	\N	Mithakhali	মিঠাখালী	mithakhaliup.bagerhat.gov.bd
2009	\N	Sonailtala	সোনাইলতলা	sonailtalaup.bagerhat.gov.bd
2010	\N	Chadpai	চাঁদপাই	chadpaiup.bagerhat.gov.bd
2011	\N	Chila	চিলা	chilaup.bagerhat.gov.bd
2012	\N	Sundarban	সুন্দরবন	sundarbanup.bagerhat.gov.bd
2013	\N	Barobaria	বড়বাড়িয়া	barobariaup.bagerhat.gov.bd
2014	\N	Kalatala	কলাতলা	kalatalaup.bagerhat.gov.bd
2015	\N	Hizla	হিজলা	hizlaup.bagerhat.gov.bd
2016	\N	Shibpur	শিবপুর	shibpurup.bagerhat.gov.bd
2017	\N	Chitalmari	চিতলমারী	chitalmariup.bagerhat.gov.bd
2018	\N	Charbaniri	চরবানিয়ারী	charbaniriup.bagerhat.gov.bd
2019	\N	Shantoshpur	সন্তোষপুর	shantoshpurup.bagerhat.gov.bd
2020	\N	Sadhuhati	সাধুহাটী	sadhuhatiup.jhenaidah.gov.bd
2021	\N	Modhuhati	মধুহাটী	modhuhatiup.jhenaidah.gov.bd
2022	\N	Saganna	সাগান্না	sagannaup.jhenaidah.gov.bd
2023	\N	Halidhani	হলিধানী	halidhaniup.jhenaidah.gov.bd
2024	\N	Kumrabaria	কুমড়াবাড়ীয়া	kumrabariaup.jhenaidah.gov.bd
2025	\N	Ganna	গান্না	gannaup.jhenaidah.gov.bd
2026	\N	Maharazpur	মহারাজপুর	maharazpurup.jhenaidah.gov.bd
2027	\N	Paglakanai	পাগলাকানাই	paglakanaiup.jhenaidah.gov.bd
2028	\N	Porahati	পোড়াহাটী	porahatiup.jhenaidah.gov.bd
2029	\N	Harishongkorpur	হরিশংকরপুর	harishongkorpurup.jhenaidah.gov.bd
2030	\N	Padmakar	পদ্মাকর	padmakarup.jhenaidah.gov.bd
2031	\N	Dogachhi	দোগাছি	dogachhiup.jhenaidah.gov.bd
2032	\N	Furshondi	ফুরসন্দি	furshondiup.jhenaidah.gov.bd
2033	\N	Ghorshal	ঘোড়শাল	ghorshalup.jhenaidah.gov.bd
2034	\N	Kalicharanpur	কালীচরণপুর	kalicharanpurup.jhenaidah.gov.bd
2035	\N	Surat	সুরাট	suratup.jhenaidah.gov.bd
2036	\N	Naldanga	নলডাঙ্গা	naldangaup.jhenaidah.gov.bd
2037	\N	Tribeni	ত্রিবেনী	tribeniup.jhenaidah.gov.bd
2038	\N	Mirzapur	মির্জাপুর	mirzapurup.jhenaidah.gov.bd
2039	\N	Dignagore	দিগনগর	dignagoreup.jhenaidah.gov.bd
2040	\N	Kancherkol	কাঁচেরকোল	kancherkolup.jhenaidah.gov.bd
2041	\N	Sarutia	সারুটিয়া	sarutiaup.jhenaidah.gov.bd
2042	\N	Hakimpur	হাকিমপুর	hakimpurup.jhenaidah.gov.bd
2043	\N	Dhaloharachandra	ধলহরাচন্দ্র	dhaloharachandraup.jhenaidah.gov.bd
2044	\N	Manoharpur	মনোহরপুর	manoharpurup.jhenaidah.gov.bd
2045	\N	Bogura	বগুড়া	boguraup.jhenaidah.gov.bd
2046	\N	Abaipur	আবাইপুর	abaipurup.jhenaidah.gov.bd
2047	\N	Nityanandapur	নিত্যানন্দপুর	nityanandapurup.jhenaidah.gov.bd
2048	\N	Umedpur	উমেদপুর	umedpurup.jhenaidah.gov.bd
2049	\N	Dudshar	দুধসর	dudsharup.jhenaidah.gov.bd
2050	\N	Fulhari	ফুলহরি	fulhariup.jhenaidah.gov.bd
2051	\N	Bhayna	ভায়না	bhaynaup.jhenaidah.gov.bd
2052	\N	Joradah	জোড়াদহ	joradahup.jhenaidah.gov.bd
2053	\N	Taherhuda	তাহেরহুদা	taherhudaup.jhenaidah.gov.bd
2054	\N	Daulatpur	দৌলতপুর	daulatpurup.jhenaidah.gov.bd
2055	\N	Kapashatia	কাপাশহাটিয়া	kapashatiaup.jhenaidah.gov.bd
2056	\N	Falsi	ফলসী	falsiup.jhenaidah.gov.bd
2057	\N	Raghunathpur	রঘুনাথপুর	raghunathpurup.jhenaidah.gov.bd
2058	\N	Chandpur	চাঁদপুর	chandpurup.jhenaidah.gov.bd
2059	\N	Sundarpurdurgapur	সুন্দরপুর-দূর্গাপুর	sundarpurdurgapurup.jhenaidah.gov.bd
2060	\N	Jamal	জামাল	jamalup.jhenaidah.gov.bd
2061	\N	Kola	কোলা	kolaup.jhenaidah.gov.bd
2062	\N	Niamatpur	নিয়ামতপুর	niamatpurup.jhenaidah.gov.bd
2063	\N	Simla-Rokonpur	শিমলা-রোকনপুর	simlarokonpurup.jhenaidah.gov.bd
2064	\N	Trilochanpur	ত্রিলোচনপুর	trilochanpurup.jhenaidah.gov.bd
2065	\N	Raygram	রায়গ্রাম	raygramup.jhenaidah.gov.bd
2066	\N	Maliat	মালিয়াট	maliatup.jhenaidah.gov.bd
2067	\N	Barabazar	বারবাজার	barabazarup.jhenaidah.gov.bd
2068	\N	Kashtabhanga	কাষ্টভাঙ্গা	kashtabhangaup.jhenaidah.gov.bd
2069	\N	Rakhalgachhi	রাখালগাছি	rakhalgachhiup.jhenaidah.gov.bd
2070	\N	Sabdalpur	সাবদালপুর	sabdalpurup.jhenaidah.gov.bd
2071	\N	Dora	দোড়া	doraup.jhenaidah.gov.bd
2072	\N	Kushna	কুশনা	kushnaup.jhenaidah.gov.bd
2073	\N	Baluhar	বলুহর	baluharup.jhenaidah.gov.bd
2074	\N	Elangi	এলাঙ্গী	elangiup.jhenaidah.gov.bd
2075	\N	Sbk	এস, বি, কে	sbkup.jhenaidah.gov.bd
2076	\N	Fatepur	ফতেপুর	fatepurup.jhenaidah.gov.bd
2077	\N	Panthapara	পান্থপাড়া	panthaparaup.jhenaidah.gov.bd
2078	\N	Swaruppur	স্বরুপপুর	swaruppurup.jhenaidah.gov.bd
2079	\N	Shyamkur	শ্যামকুড়	shyamkurup.jhenaidah.gov.bd
2080	\N	Nepa	নেপা	nepaup.jhenaidah.gov.bd
2081	\N	Kazirber	কাজীরবেড়	kazirberup.jhenaidah.gov.bd
2082	\N	Banshbaria	বাঁশবাড়ীয়া	banshbariaup.jhenaidah.gov.bd
2083	\N	Jadabpur	যাদবপুর	jadabpurup.jhenaidah.gov.bd
2084	\N	Natima	নাটিমা	natimaup.jhenaidah.gov.bd
2085	\N	Manderbaria	মান্দারবাড়ীয়া	manderbariaup.jhenaidah.gov.bd
2086	\N	Azampur	আজমপুর	azampurup.jhenaidah.gov.bd
2087	\N	Basanda	বাসন্ডা	basandaup.jhalakathi.gov.bd
2088	\N	Binoykati	বিনয়কাঠী	binoykatiup.jhalakathi.gov.bd
2089	\N	Gabharamchandrapur	গাভারামচন্দ্রপুর	gabharamchandrapurup.jhalakathi.gov.bd
2090	\N	Keora	কেওড়া	keoraup.jhalakathi.gov.bd
2091	\N	Kirtipasha	কীর্তিপাশা	kirtipashaup.jhalakathi.gov.bd
2092	\N	Nabagram	নবগ্রাম	nabagramup.jhalakathi.gov.bd
2093	\N	Nathullabad	নথুলল্লাবাদ	nathullabadup.jhalakathi.gov.bd
2094	\N	Ponabalia	পোনাবালিয়া	ponabaliaup.jhalakathi.gov.bd
2095	\N	Sekherhat	শেখেরহাট	sekherhatup.jhalakathi.gov.bd
2096	\N	Gabkhandhansiri	গাবখান ধানসিঁড়ি	gabkhandhansiriup.jhalakathi.gov.bd
2097	\N	Amua	আমুয়া	amuaup.jhalakathi.gov.bd
2098	\N	Awrabunia	আওরাবুনিয়া	awrabuniaup.jhalakathi.gov.bd
2099	\N	Chenchrirampur	চেঁচরীরামপুর	chenchrirampurup.jhalakathi.gov.bd
2100	\N	Kanthalia	কাঠালিয়া	kanthaliaup.jhalakathi.gov.bd
2101	\N	Patikhalghata	পাটিখালঘাটা	patikhalghataup.jhalakathi.gov.bd
2102	\N	Shaulajalia	শৌলজালিয়া	shaulajaliaup.jhalakathi.gov.bd
2103	\N	Subidpur	সুবিদপুর	subidpurup.jhalakathi.gov.bd
2104	\N	Siddhakati	সিদ্ধকাঠী	siddhakatiup.jhalakathi.gov.bd
2105	\N	Ranapasha	রানাপাশা	ranapashaup.jhalakathi.gov.bd
2106	\N	Nachanmohal	নাচনমহল	nachanmohalup.jhalakathi.gov.bd
2107	\N	Mollahat	মোল্লারহাট	mollahatup.jhalakathi.gov.bd
2108	\N	Magar	মগর	magarup.jhalakathi.gov.bd
2109	\N	Kusanghal	কুশঙ্গল	kusanghalup.jhalakathi.gov.bd
2110	\N	Kulkathi	কুলকাঠী	kulkathiup.jhalakathi.gov.bd
2111	\N	Dapdapia	দপদপিয়া	dapdapiaup.jhalakathi.gov.bd
2112	\N	Bharabpasha	ভৈরবপাশা	bharabpashaup.jhalakathi.gov.bd
2113	\N	Suktagarh	শুক্তাগড়	suktagarhup.jhalakathi.gov.bd
2114	\N	Saturia	সাতুরিয়া	saturiaup.jhalakathi.gov.bd
2115	\N	Mathbari	মঠবাড়ী	mathbariup.jhalakathi.gov.bd
2116	\N	Galua	গালুয়া	galuaup.jhalakathi.gov.bd
2117	\N	Baraia	বড়ইয়া	baraiaup.jhalakathi.gov.bd
2118	\N	Rajapur	রাজাপুর	rajapurup.jhalakathi.gov.bd
2119	\N	Adabaria	আদাবারিয়া	adabariaup.gazipur.gov.bd
2120	\N	Bauphal	বাউফল	bauphalup.patuakhali.gov.bd
2121	\N	Daspara	দাস পাড়া	dasparaup.gazipur.gov.bd
2122	\N	Kalaiya	কালাইয়া	kalaiyaup.gazipur.gov.bd
2123	\N	Nawmala	নওমালা	nawmalaup.patuakhali.gov.bd
2124	\N	Najirpur	নাজিরপুর	najirpurup.patuakhali.gov.bd
2125	\N	Madanpura	মদনপুরা	madanpuraup.patuakhali.gov.bd
2126	\N	Boga	বগা	bogaup.patuakhali.gov.bd
2127	\N	Kanakdia	কনকদিয়া	kanakdiaup.patuakhali.gov.bd
2128	\N	Shurjamoni	সূর্য্যমনি	shurjamoniup.patuakhali.gov.bd
2129	\N	Keshabpur	কেশবপুর	keshabpurup.patuakhali.gov.bd
2130	\N	Dhulia	ধুলিয়া	dhuliaup.patuakhali.gov.bd
2131	\N	Kalisuri	কালিশুরী	kalisuriup.patuakhali.gov.bd
2132	\N	Kachipara	কাছিপাড়া	kachiparaup.patuakhali.gov.bd
2133	\N	Laukathi	লাউকাঠী	laukathiup.patuakhali.gov.bd
2134	\N	Lohalia	লোহালিয়া	lohaliaup.patuakhali.gov.bd
2135	\N	Kamalapur	কমলাপুর	kamalapurup.patuakhali.gov.bd
2136	\N	Jainkathi	জৈনকাঠী	jainkathiup.patuakhali.gov.bd
2137	\N	Kalikapur	কালিকাপুর	kalikapurup.patuakhali.gov.bd
2138	\N	Badarpur	বদরপুর	badarpurup.patuakhali.gov.bd
2139	\N	Itbaria	ইটবাড়ীয়া	itbariaup.patuakhali.gov.bd
2140	\N	Marichbunia	মরিচবুনিয়া	marichbuniaup.patuakhali.gov.bd
2141	\N	Auliapur	আউলিয়াপুর	auliapurup.patuakhali.gov.bd
2142	\N	Chotobighai	ছোট বিঘাই	chotobighaiup.patuakhali.gov.bd
2143	\N	Borobighai	বড় বিঘাই	borobighaiup.patuakhali.gov.bd
2144	\N	Madarbunia	মাদারবুনিয়া	madarbuniaup.patuakhali.gov.bd
2145	\N	Pangasia	পাংগাশিয়া	pangasiaup.patuakhali.gov.bd
2146	\N	Muradia	মুরাদিয়া	muradiaup.patuakhali.gov.bd
2147	\N	Labukhali	লেবুখালী	labukhaliup.patuakhali.gov.bd
2148	\N	Angaria	আংগারিয়া	angariaup.patuakhali.gov.bd
2149	\N	Sreerampur	শ্রীরামপুর	sreerampurup.patuakhali.gov.bd
2150	\N	Bashbaria	বাঁশবাড়ীয়া	bashbariaup.patuakhali.gov.bd
2151	\N	Rangopaldi	রণগোপালদী	rangopaldiup.patuakhali.gov.bd
2152	\N	Alipur	আলীপুর	alipurup.patuakhali.gov.bd
2153	\N	Betagi Shankipur	বেতাগী সানকিপুর	betagishankipurup.patuakhali.gov.bd
2154	\N	Dashmina	দশমিনা	dashminaup.patuakhali.gov.bd
2155	\N	Baharampur	বহরমপুর	baharampurup.patuakhali.gov.bd
2156	\N	Chakamaia	চাকামইয়া	chakamaiaup.patuakhali.gov.bd
2157	\N	Tiakhali	টিয়াখালী	tiakhaliup.patuakhali.gov.bd
2158	\N	Lalua	লালুয়া	laluaup.patuakhali.gov.bd
2159	\N	Dhankhali	ধানখালী	dhankhaliup.patuakhali.gov.bd
2160	\N	Mithagonj	মিঠাগঞ্জ	mithagonjup.patuakhali.gov.bd
2161	\N	Nilgonj	নীলগঞ্জ	nilgonjup.patuakhali.gov.bd
2162	\N	Dulaser	ধুলাসার	dulaserup.patuakhali.gov.bd
2163	\N	Latachapli	লতাচাপলী	latachapliup.patuakhali.gov.bd
2164	\N	Mahipur	মহিপুর	mahipurup.patuakhali.gov.bd
2165	\N	Dalbugonj	ডালবুগঞ্জ	dalbugonjup.patuakhali.gov.bd
2166	\N	Baliatali	বালিয়াতলী	baliataliup.patuakhali.gov.bd
2167	\N	Champapur	চম্পাপুর	champapurup.patuakhali.gov.bd
2168	\N	Madhabkhali	মাধবখালী	madhabkhaliup.patuakhali.gov.bd
2169	\N	Mirzaganj	মির্জাগঞ্জ	mirzaganjup.patuakhali.gov.bd
2170	\N	Amragachia	আমড়াগাছিয়া	amragachiaup.patuakhali.gov.bd
2171	\N	Deuli Subidkhali	দেউলী সুবিদখালী	deulisubidkhaliup.patuakhali.gov.bd
2172	\N	Kakrabunia	কাকড়াবুনিয়া	kakrabuniaup.patuakhali.gov.bd
2173	\N	Majidbaria	মজিদবাড়িয়া	majidbariaup.patuakhali.gov.bd
2174	\N	Amkhola	আমখোলা	amkholaup.patuakhali.gov.bd
2175	\N	Golkhali	গোলখালী	golkhaliup.patuakhali.gov.bd
2176	\N	Galachipa	গলাচিপা	galachipaup.patuakhali.gov.bd
2177	\N	Panpatty	পানপট্টি	panpattyup.patuakhali.gov.bd
2178	\N	Ratandi Taltali	রতনদী তালতলী	ratanditaltaliup.patuakhali.gov.bd
2179	\N	Dakua	ডাকুয়া	dakuaup.patuakhali.gov.bd
2180	\N	Chiknikandi	চিকনিকান্দী	chiknikandiup.patuakhali.gov.bd
2181	\N	Gazalia	গজালিয়া	gazaliaup.patuakhali.gov.bd
2182	\N	Charkajol	চরকাজল	charkajolup.patuakhali.gov.bd
2183	\N	Charbiswas	চরবিশ্বাস	charbiswasup.patuakhali.gov.bd
2184	\N	Bakulbaria	বকুলবাড়ীয়া	bakulbariaup.patuakhali.gov.bd
2185	\N	Kalagachhia	কলাগাছিয়া	kalagachhiaup.patuakhali.gov.bd
2186	\N	Rangabali	রাঙ্গাবালী	rangabaliup.patuakhali.gov.bd
2187	\N	Barobaisdia	বড়বাইশদিয়া	barobaisdiaup.patuakhali.gov.bd
2188	\N	Chattobaisdia	ছোটবাইশদিয়া	chattobaisdiaup.patuakhali.gov.bd
2189	\N	Charmontaz	চরমোন্তাজ	charmontaz.patuakhali.gov.bd
2190	\N	Chalitabunia	চালিতাবুনিয়া	chalitabuniaup.patuakhali.gov.bd
2191	\N	Shikder Mallik	শিকদার মল্লিক	shikdermallikup.pirojpur.gov.bd
2192	\N	Kodomtala	কদমতলা	kodomtalaup.pirojpur.gov.bd
2193	\N	Durgapur	দূর্গাপুর	durgapurup.pirojpur.gov.bd
2194	\N	Kolakhali	কলাখালী	kolakhaliup.pirojpur.gov.bd
2195	\N	Tona	টোনা	tonaup.pirojpur.gov.bd
2196	\N	Shariktola	শরিকতলা	shariktolaup.pirojpur.gov.bd
2197	\N	Shankorpasa	শংকরপাশা	shankorpasaup.pirojpur.gov.bd
2198	\N	Mativangga	মাটিভাংগা	mativanggaup.pirojpur.gov.bd
2199	\N	Malikhali	মালিখালী	malikhaliup.pirojpur.gov.bd
2200	\N	Daulbari Dobra	দেউলবাড়ী দোবড়া	daulbaridobraup.pirojpur.gov.bd
2201	\N	Dirgha	দীর্ঘা	dirghaup.pirojpur.gov.bd
2202	\N	Kolardoania	কলারদোয়ানিয়া	kolardoaniaup.pirojpur.gov.bd
2203	\N	Sriramkathi	শ্রীরামকাঠী	sriramkathiup.pirojpur.gov.bd
2204	\N	Shakhmatia	সেখমাটিয়া	shakhmatiaup.pirojpur.gov.bd
2205	\N	Nazirpur Sadar	নাজিরপুর সদর	nazirpursadarup.pirojpur.gov.bd
2206	\N	Shakharikathi	শাখারীকাঠী	shakharikathiup.pirojpur.gov.bd
2207	\N	Sayna Rogunathpur	সয়না রঘুনাথপুর	saynarogunathpurup.pirojpur.gov.bd
2208	\N	Amrazuri	আমড়াজুড়ি	amrazuriup.pirojpur.gov.bd
2209	\N	Kawkhali Sadar	কাউখালি সদর	kawkhalisadarup.pirojpur.gov.bd
2210	\N	Chirapara	চিরাপাড়া	chiraparaup.pirojpur.gov.bd
2211	\N	Shialkhathi	শিয়ালকাঠী	shialkhathiup.pirojpur.gov.bd
2212	\N	Balipara	বালিপাড়া	baliparaup.pirojpur.gov.bd
2213	\N	Pattashi	পত্তাশি	pattashiup.pirojpur.gov.bd
2214	\N	Parerhat	পাড়েরহাট	parerhatup.pirojpur.gov.bd
2215	\N	Vitabaria	ভিটাবাড়িয়া	vitabariaup.pirojpur.gov.bd
2216	\N	Nodmulla	নদমূলা শিয়ালকাঠী	nodmullaup.pirojpur.gov.bd
2217	\N	Telikhali	তেলিখালী	telikhaliup.pirojpur.gov.bd
2218	\N	Ekree	ইকড়ী	ekreeup.pirojpur.gov.bd
2219	\N	Dhaoa	ধাওয়া	dhaoaup.pirojpur.gov.bd
2220	\N	Vandaria Sadar	ভান্ডারিয়া সদর	vandariasadarup.pirojpur.gov.bd
2221	\N	Gouripur	গৌরীপুর	gouripurup.pirojpur.gov.bd
2222	\N	Tuskhali	তুষখালী	tuskhaliup.pirojpur.gov.bd
2223	\N	Dhanisafa	ধানীসাফা	dhanisafaup.pirojpur.gov.bd
2224	\N	Mirukhali	মিরুখালী	mirukhaliup.pirojpur.gov.bd
2225	\N	Tikikata	টিকিকাটা	tikikataup.pirojpur.gov.bd
2226	\N	Betmor Rajpara	বেতমোর রাজপাড়া	betmorrajparaup.pirojpur.gov.bd
2227	\N	Amragachia	আমড়াগাছিয়া	amragachiaup.pirojpur.gov.bd
2228	\N	Shapleza	শাপলেজা	shaplezaup.pirojpur.gov.bd
2229	\N	Daudkhali	দাউদখালী	daudkhaliup.pirojpur.gov.bd
2230	\N	Mathbaria	মঠবাড়িয়া	mathbariaup.pirojpur.gov.bd
2231	\N	Baramasua	বড়মাছুয়া	baramasuaup.pirojpur.gov.bd
2232	\N	Haltagulishakhali	হলতাগুলিশাখালী	haltagulishakhaliup.pirojpur.gov.bd
2233	\N	Boldia	বলদিয়া	boldiaup.pirojpur.gov.bd
2234	\N	Sohagdal	সোহাগদল	sohagdalup.pirojpur.gov.bd
2235	\N	Atghorkuriana	আটঘর কুড়িয়ানা	atghorkurianaup.pirojpur.gov.bd
2236	\N	Jolabari	জলাবাড়ী	jolabariup.pirojpur.gov.bd
2237	\N	Doyhary	দৈহারী	doyharyup.pirojpur.gov.bd
2238	\N	Guarekha	গুয়ারেখা	guarekhaup.pirojpur.gov.bd
2239	\N	Somudoykathi	সমুদয়কাঠী	somudoykathiup.pirojpur.gov.bd
2240	\N	Sutiakathi	সুটিয়াকাঠী	sutiakathiup.pirojpur.gov.bd
2241	\N	Sarengkathi	সারেংকাঠী	sarengkathiup.pirojpur.gov.bd
2242	\N	Shorupkathi	স্বরুপকাঠী	shorupkathiup.pirojpur.gov.bd
2243	\N	Raipasha Karapur	রায়পাশা কড়াপুর	raipashakarapurup.barisal.gov.bd
2244	\N	Kashipur	কাশীপুর	kashipurup.barisal.gov.bd
2245	\N	Charbaria	চরবাড়িয়া	charbariaup.barisal.gov.bd
2246	\N	Shyastabad	সায়েস্তাবাদ	shyastabadup.barisal.gov.bd
2247	\N	Charmonai	চরমোনাই	charmonaiup.barisal.gov.bd
2248	\N	Zagua	জাগুয়া	zaguaup.barisal.gov.bd
2249	\N	Charcowa	চরকাউয়া	charcowaup.barisal.gov.bd
2250	\N	Chandpura	চাঁদপুরা	chandpuraup.barisal.gov.bd
2251	\N	Tungibaria	টুঙ্গীবাড়িয়া	tungibariaup.barisal.gov.bd
2252	\N	Chandramohan	চন্দ্রমোহন	chandramohanup.barisal.gov.bd
2253	\N	Charamaddi	চরামদ্দি	charamaddiup.barisal.gov.bd
2254	\N	Charade	চরাদি	charadeup.barisal.gov.bd
2255	\N	Darial	দাড়িয়াল	darialup.barisal.gov.bd
2256	\N	Dudhal	দুধল	dudhalup.barisal.gov.bd
2257	\N	Durgapasha	দুর্গাপাশা	durgapashaup.barisal.gov.bd
2258	\N	Faridpur	ফরিদপুর	faridpurup.barisal.gov.bd
2259	\N	Kabai	কবাই	kabaiup.barisal.gov.bd
2260	\N	Nalua	নলুয়া	naluaup.barisal.gov.bd
2261	\N	Kalashkathi	কলসকাঠী	kalashkathiup.barisal.gov.bd
2262	\N	Garuria	গারুরিয়া	garuriaup.barisal.gov.bd
2263	\N	Bharpasha	ভরপাশা	bharpashaup.barisal.gov.bd
2264	\N	Rangasree	রঙ্গশ্রী	rangasreeup.barisal.gov.bd
2265	\N	Padreeshibpur	পাদ্রিশিবপুর	padreeshibpurup.barisal.gov.bd
2266	\N	Niamoti	নিয়ামতি	niamotiup.barisal.gov.bd
2267	\N	Jahangir Nagar	জাহাঙ্গীর নগর	jahangirnagorup.barisal.gov.bd
2268	\N	Kaderpur	কেদারপুর	kaderpurup.barisal.gov.bd
2269	\N	Deherhoti	দেহেরগতি	deherhotiup.barisal.gov.bd
2270	\N	Chandpasha	চাঁদপাশা	chandpashaup.barisal.gov.bd
2271	\N	Rahamtpur	রহমতপুর	rahamtpurup.barisal.gov.bd
2272	\N	Madhbpasha	মাধবপাশা	madhbpashaup.barisal.gov.bd
2273	\N	Shatla	সাতলা	shatlaup.barisal.gov.bd
2274	\N	Harta	হারতা	hartaup.barisal.gov.bd
2275	\N	Jalla	জল্লা	jallaup.barisal.gov.bd
2276	\N	Otra	ওটরা	otraup.barisal.gov.bd
2277	\N	Sholok	শোলক	sholokup.barisal.gov.bd
2278	\N	Barakhota	বরাকোঠা	barakhotaup.barisal.gov.bd
2279	\N	Bamrail	বামরাইল	bamrailup.barisal.gov.bd
2280	\N	Shikerpur Wazirpur	শিকারপুর উজিরপুর	shikerpurwazirpurup.barisal.gov.bd
2281	\N	Gouthia	গুঠিয়া	gouthiaup.barisal.gov.bd
2282	\N	Bisharkandi	বিশারকান্দি	bisharkandiup.barisal.gov.bd
2283	\N	Illuhar	ইলুহার	illuharup.barisal.gov.bd
2284	\N	Sayedkathi	সৈয়দকাঠী	sayedkathiup.barisal.gov.bd
2285	\N	Chakhar	চাখার	chakharup.barisal.gov.bd
2286	\N	Saliabakpur	সলিয়াবাকপুর	saliabakpurup.barisal.gov.bd
2287	\N	Baishari	বাইশারী	baishariup.barisal.gov.bd
2288	\N	Banaripara	বানারিপাড়া	banariparaup.barisal.gov.bd
2289	\N	Udykhati	উদয়কাঠী	udykhatiup.barisal.gov.bd
2290	\N	Khanjapur	খাঞ্জাপুর	khanjapurup.barisal.gov.bd
2291	\N	Barthi	বার্থী	barthiup.barisal.gov.bd
2292	\N	Chandshi	চাঁদশী	chandshiup.barisal.gov.bd
2293	\N	Mahilara	মাহিলারা	mahilaraup.barisal.gov.bd
2294	\N	Nalchira	নলচিড়া	nalchiraup.barisal.gov.bd
2295	\N	Batajore	বাটাজোর	batajoreup.barisal.gov.bd
2296	\N	Sarikal	সরিকল	sarikalup.barisal.gov.bd
2297	\N	Rajihar	রাজিহার	rajiharup.barisal.gov.bd
2298	\N	Bakal	বাকাল	bakalup.barisal.gov.bd
2299	\N	Bagdha	বাগধা	bagdhaup.barisal.gov.bd
2300	\N	Goila	গৈলা	goilaup.barisal.gov.bd
2301	\N	Ratnapur	রত্নপুর	ratnapurup.barisal.gov.bd
2302	\N	Andarmanik	আন্দারমানিক	andarmanikup.barisal.gov.bd
2303	\N	Lata	লতা	lataup.barisal.gov.bd
2304	\N	Charakkorea	চরএককরিয়া	charakkoreaup.barisal.gov.bd
2305	\N	Ulania	উলানিয়া	ulaniaup.barisal.gov.bd
2306	\N	Mehendigong	মেহেন্দিগঞ্জ	mehendigongup.barisal.gov.bd
2307	\N	Biddanandapur	বিদ্যানন্দনপুর	biddanandapurup.barisal.gov.bd
2308	\N	Bhashanchar	ভাষানচর	bhashancharup.barisal.gov.bd
2309	\N	Jangalia	জাঙ্গালিয়া	jangaliaup.barisal.gov.bd
2310	\N	Alimabad	আলিমাবাদ	alimabadup.barisal.gov.bd
2311	\N	Chandpur	চানপুর	chandpurup.barisal.gov.bd
2312	\N	Darirchar Khajuria	দড়িরচর খাজুরিয়া	darircharkhajuriaup.barisal.gov.bd
2313	\N	Gobindapur	গোবিন্দপুর	gobindapurup.barisal.gov.bd
2314	\N	Chargopalpur	চরগোপালপুর	chargopalpurup.barisal.gov.bd
2315	\N	Batamara	বাটামারা	batamaraup.barisal.gov.bd
2316	\N	Nazirpur	নাজিরপুর	nazirpurup.barisal.gov.bd
2317	\N	Safipur	সফিপুর	safipurup.barisal.gov.bd
2318	\N	Gaschua	গাছুয়া	gaschuaup.barisal.gov.bd
2319	\N	Charkalekha	চরকালেখা	charkalekhaup.barisal.gov.bd
2320	\N	Muladi	মুলাদী	muladiup.barisal.gov.bd
2321	\N	Kazirchar	কাজিরচর	kazircharup.barisal.gov.bd
2322	\N	Harinathpur	হরিনাথপুর	harinathpurup.barisal.gov.bd
2323	\N	Memania	মেমানিয়া	memaniaup.barisal.gov.bd
2324	\N	Guabaria	গুয়াবাড়িয়া	guabariaup.barisal.gov.bd
2325	\N	Barjalia	বড়জালিয়া	barjaliaup.barisal.gov.bd
2326	\N	Hizla Gourabdi	হিজলা গৌরাব্দি	hizlagourabdiup.barisal.gov.bd
2327	\N	Dhulkhola	ধুলখোলা	dhulkholaup.barisal.gov.bd
2328	\N	Razapur	রাজাপুর	razapurup.bhola.gov.bd
2329	\N	Ilisha	ইলিশা	ilishaup.bhola.gov.bd
2330	\N	Westilisa	পশ্চিম ইলিশা	westilisaup.bhola.gov.bd
2331	\N	Kachia	কাচিয়া	kachiaup.bhola.gov.bd
2332	\N	Bapta	বাপ্তা	baptaup.bhola.gov.bd
2333	\N	Dhania	ধনিয়া	dhaniaup.bhola.gov.bd
2334	\N	Shibpur	শিবপুর	shibpurup.bhola.gov.bd
2335	\N	Alinagor	আলীনগর	alinagorup.bhola.gov.bd
2336	\N	Charshamya	চরসামাইয়া	charshamyaup.bhola.gov.bd
2337	\N	Vhelumia	ভেলুমিয়া	vhelumiaup.bhola.gov.bd
2338	\N	Vheduria	ভেদুরিয়া	vheduriaup.bhola.gov.bd
2339	\N	North Digholdi	উত্তর দিঘলদী	northdigholdiup.bhola.gov.bd
2340	\N	South Digholdi	দক্ষিণ দিঘলদী	southdigholdiup.bhola.gov.bd
2341	\N	Boromanika	বড় মানিকা	boromanikaup.bhola.gov.bd
2342	\N	Deula	দেউলা	deulaup.bhola.gov.bd
2343	\N	Kutuba	কুতুবা	kutubaup.bhola.gov.bd
2344	\N	Pakshia	পক্ষিয়া	pakshiaup.bhola.gov.bd
2345	\N	Kachia	কাচিয়া	kachiaup4.bhola.gov.bd
2346	\N	Osmangonj	ওসমানগঞ্জ	osmangonjup.bhola.gov.bd
2347	\N	Aslampur	আছলামপুর	aslampurup.bhola.gov.bd
2348	\N	Zinnagor	জিন্নাগড়	zinnagorup.bhola.gov.bd
2349	\N	Aminabad	আমিনাবাদ	aminabadup.bhola.gov.bd
2350	\N	Nilkomol	নীলকমল	nilkomolup.bhola.gov.bd
2351	\N	Charmadraj	চরমাদ্রাজ	charmadrajup.bhola.gov.bd
2352	\N	Awajpur	আওয়াজপুর	awajpurup.bhola.gov.bd
2353	\N	Awajpur	আওয়াজপুর	awajpurup.bhola.gov.bd
2354	\N	Charkolmi	চরকলমী	charkolmiup.bhola.gov.bd
2355	\N	Charmanika	চরমানিকা	charmanikaup.bhola.gov.bd
2356	\N	Hazarigonj	হাজারীগঞ্জ	hazarigonjup.bhola.gov.bd
2357	\N	Jahanpur	জাহানপুর	jahanpurup.bhola.gov.bd
2358	\N	Nurabad	নুরাবাদ	nurabadup.bhola.gov.bd
2359	\N	Rasulpur	রসুলপুর	rasulpurup.bhola.gov.bd
2360	\N	Kukrimukri	কুকরীমূকরী	kukrimukriup.bhola.gov.bd
2361	\N	Abubakarpur	আবুবকরপুর	abubakarpurup.bhola.gov.bd
2362	\N	Abdullahpur	আবদুল্লাহ	abdullahpurup.bhola.gov.bd
2363	\N	Nazrulnagar	নজরুল নগর	nazrulnagarup.bhola.gov.bd
2364	\N	Mujibnagar	মুজিব নগর	mujibnagarup.bhola.gov.bd
2365	\N	Dalchar	ঢালচর	dalcharup.bhola.gov.bd
2366	\N	Madanpur	মদনপুর	madanpurup.bhola.gov.bd
2367	\N	Madua	মেদুয়া	maduaup.bhola.gov.bd
2368	\N	Charpata	চরপাতা	charpataup.bhola.gov.bd
2369	\N	North Joy Nagar	উত্তর জয়নগর	northjoynagarup.bhola.gov.bd
2370	\N	South Joy Nagar	দক্ষিন জয়নগর	southjoynagarup.bhola.gov.bd
2371	\N	Char Khalipa	চর খলিফা	charkhalipaup.bhola.gov.bd
2372	\N	Sayedpur	সৈয়দপুর	sayedpurup.bhola.gov.bd
2373	\N	Hazipur	হাজীপুর	hazipurup.bhola.gov.bd
2374	\N	Vhovanipur	ভবানীপুর	vhovanipurup.bhola.gov.bd
2375	\N	Hazirhat	হাজীর হাট	hazirhatup.bhola.gov.bd
2376	\N	Monpura	মনপুরা	monpuraup.bhola.gov.bd
2377	\N	North Sakuchia	উত্তর সাকুচিয়া	sakuchianorthup.bhola.gov.bd
2378	\N	South Sakuchia	দক্ষিন সাকুচিয়া	sakuchiasouthup.bhola.gov.bd
2379	\N	Chanchra	চাচঁড়া	chanchraup.bhola.gov.bd
2380	\N	Shambupur	শম্ভুপুর	shambupurup.bhola.gov.bd
2381	\N	Sonapur	সোনাপুর	sonapurup.bhola.gov.bd
2382	\N	Chadpur	চাঁদপুর	chadpurup.bhola.gov.bd
2383	\N	Baro Molongchora	বড় মলংচড়া	baromolongchoraup.bhola.gov.bd
2384	\N	Badarpur	বদরপুর	badarpurup.bhola.gov.bd
2385	\N	Charbhuta	চরভূতা	charbhutaup.bhola.gov.bd
2386	\N	Kalma	কালমা	kalmaup.bhola.gov.bd
2387	\N	Dholigour Nagar	ধলীগৌর নগর	dholigournagarup.bhola.gov.bd
2388	\N	Lalmohan	লালমোহন	lalmohanup.bhola.gov.bd
2389	\N	Lord Hardinge	লর্ড হার্ডিঞ্জ	lordhardingeup.bhola.gov.bd
2390	\N	Ramagonj	রমাগঞ্জ	ramagonjup.bhola.gov.bd
2391	\N	Paschim Char Umed	পশ্চিম চর উমেদ	paschimcharumedup.bhola.gov.bd
2392	\N	Farajgonj	ফরাজগঞ্জ	farajgonjup.bhola.gov.bd
2393	\N	Amtali	আমতলী	amtaliup.barguna.gov.bd
2394	\N	Gulishakhali	গুলিশাখালী	gulishakhaliup.barguna.gov.bd
2395	\N	Athrogasia	আঠারগাছিয়া	athrogasiaup.barguna.gov.bd
2396	\N	Kukua	কুকুয়া	kukuaup.barguna.gov.bd
2397	\N	Haldia	হলদিয়া	haldiaup.barguna.gov.bd
2398	\N	Chotobogi	ছোটবগী	chotobogiup.barguna.gov.bd
2399	\N	Arpangasia	আড়পাঙ্গাশিয়া	arpangasiaup.barguna.gov.bd
2400	\N	Chowra	চাওড়া	chowraup.barguna.gov.bd
2401	\N	M. Baliatali	এম. বালিয়াতলী	m.baliataliup.barguna.gov.bd
2402	\N	Noltona	নলটোনা	noltonaup.barguna.gov.bd
2403	\N	Bodorkhali	বদরখালী	bodorkhaliup.barguna.gov.bd
2404	\N	Gowrichanna	গৌরিচন্না	gowrichannaup.barguna.gov.bd
2405	\N	Fuljhuri	ফুলঝুড়ি	fuljhuriup.barguna.gov.bd
2406	\N	Keorabunia	কেওড়াবুনিয়া	keorabuniaup.barguna.gov.bd
2407	\N	Ayla Patakata	আয়লা পাতাকাটা	aylaPatakataup.barguna.gov.bd
2408	\N	Burirchor	বুড়িরচর	burirchorup.barguna.gov.bd
2409	\N	Dhalua	ঢলুয়া	dhaluaup.barguna.gov.bd
2410	\N	Barguna	বরগুনা	bargunaup.barguna.gov.bd
2411	\N	Bibichini	বিবিচিন	bibichiniup.barguna.gov.bd
2412	\N	Betagi	বেতাগী	betagiup.barguna.gov.bd
2413	\N	Hosnabad	হোসনাবাদ	hosnabadup.barguna.gov.bd
2414	\N	Mokamia	মোকামিয়া	mokamiaup.barguna.gov.bd
2415	\N	Buramajumder	বুড়ামজুমদার	buramajumderup.barguna.gov.bd
2416	\N	Kazirabad	কাজীরাবাদ	kazirabadup.barguna.gov.bd
2417	\N	Sarisamuri	সরিষামুড়ী	sarisamuriup.barguna.gov.bd
2418	\N	Bukabunia	বুকাবুনিয়া	bukabuniaup.barguna.gov.bd
2419	\N	Bamna	বামনা	bamnaup.barguna.gov.bd
2420	\N	Ramna	রামনা	ramnaup.barguna.gov.bd
2421	\N	Doutola	ডৌয়াতলা	doutolaup.barguna.gov.bd
2422	\N	Raihanpur	রায়হানপুর	raihanpurup.barguna.gov.bd
2423	\N	Nachnapara	নাচনাপাড়া	nachnaparaup.barguna.gov.bd
2424	\N	Charduany	চরদুয়ানী	charduanyup.barguna.gov.bd
2425	\N	Patharghata	পাথরঘাটা	patharghataup.barguna.gov.bd
2426	\N	Kalmegha	কালমেঘা	kalmeghaup.barguna.gov.bd
2427	\N	Kakchira	কাকচিঢ়া	kakchiraup.barguna.gov.bd
2428	\N	Kathaltali	কাঠালতলী	kathaltaliup.barguna.gov.bd
2429	\N	Karibaria	কড়ইবাড়ীয়া	karibariaup.barguna.gov.bd
2430	\N	Panchakoralia	পচাকোড়ালিয়া	panchakoraliaup.barguna.gov.bd
2431	\N	Barabagi	বড়বগি	barabagiup.barguna.gov.bd
2432	\N	Chhotabagi	ছোটবগি	chhotabagiup.barguna.gov.bd
2433	\N	Nishanbaria	নিশানবাড়ীয়া	nishanbariaup.barguna.gov.bd
2434	\N	Sarikkhali	শারিকখালি	sarikkhaliup.barguna.gov.bd
2435	\N	Sonakata	সোনাকাটা	sonakataup.barguna.gov.bd
2436	\N	Tazpur	তাজপুর	tazpurup.sylhet.gov.bd
2437	\N	Umorpur	উমরপুর	umorpurup.sylhet.gov.bd
2438	\N	West Poilanpur	পশ্চিম পৈলনপুর	westpoilanpurup.sylhet.gov.bd
2439	\N	East Poilanpur	পূর্ব পৈলনপুর	eastpoilanpurup.sylhet.gov.bd
2440	\N	Boaljur	বোয়ালজুর	boaljurup.sylhet.gov.bd
2441	\N	Burungabazar	বুরুঙ্গাবাজার	burungabazarup.sylhet.gov.bd
2442	\N	Goalabazar	গোয়ালাবাজার	goalabazarup.sylhet.gov.bd
2443	\N	Doyamir	দয়ামীর	doyamirup.sylhet.gov.bd
2444	\N	Usmanpur	উসমানপুর	usmanpurup.sylhet.gov.bd
2445	\N	Dewanbazar	দেওয়ান বাজার	dewanbazarup.sylhet.gov.bd
2446	\N	West Gouripur	পশ্চিম গৌরীপুর	westgouripurup.sylhet.gov.bd
2447	\N	East Gouripur	পূর্ব গৌরীপুর	eastgouripurup.sylhet.gov.bd
2448	\N	Balaganj	বালাগঞ্জ	balaganjup.sylhet.gov.bd
2449	\N	Sadipur	সাদিরপুর	sadipurup.sylhet.gov.bd
2450	\N	Tilpara	তিলপাড়া	tilparaup.sylhet.gov.bd
2451	\N	Alinagar	আলীনগর	alinagarup.sylhet.gov.bd
2452	\N	Charkhai	চরখাই	charkhaiup.sylhet.gov.bd
2453	\N	Dubag	দুবাগ	dubagup.sylhet.gov.bd
2454	\N	Sheola	শেওলা	sheolaup.sylhet.gov.bd
2455	\N	Kurarbazar	কুড়ারবাজার	kurarbazarup.sylhet.gov.bd
2456	\N	Mathiura	মাথিউরা	mathiuraup.sylhet.gov.bd
2457	\N	Mullapur	মোল্লাপুর	mullapurup.sylhet.gov.bd
2458	\N	Muria	মুড়িয়া	muriaup.sylhet.gov.bd
2459	\N	Lauta	লাউতা	lautaup.sylhet.gov.bd
2460	\N	Rampasha	রামপাশা	rampashaup.sylhet.gov.bd
2461	\N	Lamakazi	লামাকাজী	lamakaziup.sylhet.gov.bd
2462	\N	Khajanchi	খাজাঞ্চী	khajanchiup.sylhet.gov.bd
2463	\N	Alankari	অলংকারী	alankariup.sylhet.gov.bd
2464	\N	Dewkalash	দেওকলস	dewkalashup.sylhet.gov.bd
2465	\N	Bishwanath	বিশ্বনাথ	bishwanathup.sylhet.gov.bd
2466	\N	Doshghar	দশঘর	doshgharup.sylhet.gov.bd
2467	\N	Daulatpur	দৌলতপুর	daulatpurup.sylhet.gov.bd
2468	\N	Telikhal	তেলিখাল	telikhalup.sylhet.gov.bd
2469	\N	Islampur Paschim	ইসলামপুর পশ্চিম	islampurpaschimup.sylhet.gov.bd
2470	\N	Islampur Purba	ইসলামপুর পূর্ব	islampurpurbaup.sylhet.gov.bd
2471	\N	Isakalas	ইসাকলস	isakalasup.sylhet.gov.bd
2472	\N	Uttor Ronikhai	উত্তর রনিখাই	uttorronikhaiup.sylhet.gov.bd
2473	\N	Dakkin Ronikhai	দক্ষিন রনিখাই	dakkinronikhaiup.sylhet.gov.bd
2474	\N	Ghilachora	ঘিলাছড়া	ghilachoraup.sylhet.gov.bd
2475	\N	Fenchuganj	ফেঞ্চুগঞ্জ	1nofenchuganjup.sylhet.gov.bd
2476	\N	Uttar Kushiara	উত্তর কুশিয়ারা	uttarkushiaraup.sylhet.gov.bd
2477	\N	Uttar Fenchuganj	উত্তর ফেঞ্চুগঞ্জ	uttarfenchuganjup.sylhet.gov.bd
2478	\N	Maijgaon	মাইজগাঁও	maijgaonup.sylhet.gov.bd
2479	\N	Golapganj	গোলাপগঞ্জ	golapganjup.sylhet.gov.bd
2480	\N	Fulbari	ফুলবাড়ী	fulbariup.sylhet.gov.bd
2481	\N	Lakshmipasha	লক্ষ্মীপাশা	lakshmipashaup.sylhet.gov.bd
2482	\N	Budhbaribazar	বুধবারীবাজার	budhbaribazarup.sylhet.gov.bd
2483	\N	Dhakadakshin	ঢাকাদক্ষিন	dhakadakshinup.sylhet.gov.bd
2484	\N	Sharifganj	শরিফগঞ্জ	sharifganjup.sylhet.gov.bd
2485	\N	Uttar Badepasha	উত্তর বাদেপাশা	uttarbadepashaup.sylhet.gov.bd
2486	\N	Lakshanaband	লক্ষনাবন্দ	lakshanabandup.sylhet.gov.bd
2487	\N	Bhadeshwar	ভাদেশ্বর	bhadeshwarup.sylhet.gov.bd
2488	\N	West Amura	পশ্চিম আমুরা	westamuraup.sylhet.gov.bd
2489	\N	Fothepur	ফতেপুর	fothepurup.sylhet.gov.bd
2490	\N	Rustampur	রুস্তমপুর	rustampurup.sylhet.gov.bd
2491	\N	Paschim Jaflong	পশ্চিম জাফলং	paschimjaflongup.sylhet.gov.bd
2492	\N	Purba Jaflong	পূর্ব জাফলং	purbajaflongup.sylhet.gov.bd
2493	\N	Lengura	লেঙ্গুড়া	lenguraup.sylhet.gov.bd
2494	\N	Alirgaon	আলীরগাঁও	alirgaonup.sylhet.gov.bd
2495	\N	Nandirgaon	নন্দিরগাঁও	nandirgaonup.sylhet.gov.bd
2496	\N	Towakul	তোয়াকুল	towakulup.sylhet.gov.bd
2497	\N	Daubari	ডৌবাড়ী	daubariup.sylhet.gov.bd
2498	\N	Nijpat	নিজপাট	nijpatup.sylhet.gov.bd
2499	\N	Jaintapur	জৈন্তাপুর	jaintapurup.sylhet.gov.bd
2500	\N	Charikatha	চারিকাটা	charikathaup.sylhet.gov.bd
2501	\N	Darbast	দরবস্ত	darbastup.sylhet.gov.bd
2502	\N	Fatehpur	ফতেপুর	fatehpurup.sylhet.gov.bd
2503	\N	Chiknagul	চিকনাগুল	chiknagulup.sylhet.gov.bd
2504	\N	Rajagonj	রাজাগঞ্জ	rajagonjup.sylhet.gov.bd
2505	\N	Lakshiprashad Purbo	লক্ষীপ্রাসাদ পূর্ব	lakshiprashadpurboup.sylhet.gov.bd
2506	\N	Lakshiprashad Pashim	লক্ষীপ্রাসাদ পশ্চিম	lakshiprashadpashimup.sylhet.gov.bd
2507	\N	Digirpar Purbo	দিঘিরপার পূর্ব	digirparpurboup.sylhet.gov.bd
2508	\N	Satbakh	সাতবাক	satbakhup.sylhet.gov.bd
2509	\N	Barachotul	বড়চতুল	barachotulup.sylhet.gov.bd
2510	\N	Kanaighat	কানাইঘাট	kanaighatup.sylhet.gov.bd
2511	\N	Dakhin Banigram	দক্ষিন বানিগ্রাম	dakhinbanigramup.sylhet.gov.bd
2512	\N	Jinghabari	ঝিঙ্গাবাড়ী	jinghabariup.sylhet.gov.bd
2513	\N	Jalalabad	জালালাবাদ	jalalabadup.sylhet.gov.bd
2514	\N	Hatkhula	হাটখোলা	hatkhulaup.sylhet.gov.bd
2515	\N	Khadimnagar	খাদিমনগর	khadimnagarup.sylhet.gov.bd
2516	\N	Khadimpara	খাদিমপাড়া	khadimparaup.sylhet.gov.bd
2517	\N	Tultikor	টুলটিকর	tultikorup.sylhet.gov.bd
2518	\N	Tukerbazar	টুকেরবাজার	tukerbazarup.sylhet.gov.bd
2519	\N	Mugolgaon	মোগলগাও	mugolgaonup.sylhet.gov.bd
2520	\N	Kandigaon	কান্দিগাও	kandigaonup.sylhet.gov.bd
2521	\N	Manikpur	মানিকপুর	manikpurup.sylhet.gov.bd
2522	\N	Sultanpur	সুলতানপুর	sultanpurup.sylhet.gov.bd
2523	\N	Barohal	বারহাল	barohalup.sylhet.gov.bd
2524	\N	Birorsri	বিরশ্রী	birorsriup.sylhet.gov.bd
2525	\N	Kajalshah	কাজলশার	kajalshahup.sylhet.gov.bd
2526	\N	Kolachora	কলাছড়া	kolachora.sylhet.gov.bd
2527	\N	Zakiganj	জকিগঞ্জ	zakiganjup.sylhet.gov.bd
2528	\N	Barothakuri	বারঠাকুরী	barothakuriup.sylhet.gov.bd
2529	\N	Kaskanakpur	কসকনকপুর	kaskanakpurup.sylhet.gov.bd
2530	\N	Lalabazar	লালাবাজার	lalabazarup.sylhet.gov.bd
2531	\N	Moglabazar	মোগলাবাজার	moglabazarup.sylhet.gov.bd
2532	\N	Boroikandi	বড়ইকান্দি	boroikandiup.sylhet.gov.bd
2533	\N	Silam	সিলাম	silamup.sylhet.gov.bd
2534	\N	Daudpur	দাউদপুর	daudpurup.sylhet.gov.bd
2535	\N	Mollargaon	মোল্লারগাঁও	mollargaonup.sylhet.gov.bd
2536	\N	Kuchai	কুচাই	kuchaiup.sylhet.gov.bd
2537	\N	Kamalbazar	কামালবাজার	kamalbazarup.sylhet.gov.bd
2538	\N	Jalalpur	জালালপুর	jalalpurup.sylhet.gov.bd
2539	\N	Tetli	তেতলী	tetliup.sylhet.gov.bd
2540	\N	Talimpur	তালিমপুর	talimpurup.moulvibazar.gov.bd
2541	\N	Borni	বর্ণি	borniup.moulvibazar.gov.bd
2542	\N	Dasherbazar	দাসেরবাজার	dasherbazarup.moulvibazar.gov.bd
2543	\N	Nizbahadurpur	নিজবাহাদুরপুর	nizbahadurpurup.moulvibazar.gov.bd
2544	\N	Uttar Shahbajpur	উত্তর শাহবাজপুর	shahbajpuruttarup.moulvibazar.gov.bd
2545	\N	Dakkhin Shahbajpur	দক্ষিণ শাহবাজপুর	shahbajpurdakshinup.moulvibazar.gov.bd
2546	\N	Talimpur	তালিমপুর	talimpurup.moulvibazar.gov.bd
2547	\N	Baralekha	বড়লেখা	baralekhaup.moulvibazar.gov.bd
2548	\N	Dakshinbhag Uttar	দক্ষিণভাগ (উত্তর)	dakshinbhaguttarup.moulvibazar.gov.bd
2549	\N	Dakshinbhag Dakkhin	দক্ষিণভাগ (দক্ষিণ)	dakshinbhagdakshinup.moulvibazar.gov.bd
2550	\N	Sujanagar	সুজানগর	sujanagarup.moulvibazar.gov.bd
2551	\N	Adampur	আদমপুর	adampurup.moulvibazar.gov.bd
2552	\N	Patanushar	পতনঊষার	patanusharup.moulvibazar.gov.bd
2553	\N	Madhabpur	মাধবপুর	madhabpurup.moulvibazar.gov.bd
2554	\N	Rahimpur	রহিমপুর	rahimpurup.moulvibazar.gov.bd
2555	\N	Shamshernagar	শমশেরনগর	shamshernagarup.moulvibazar.gov.bd
2556	\N	Kamalgonj	কমলগঞ্জ	kamalgonjup.moulvibazar.gov.bd
2557	\N	Islampur	ইসলামপুর	islampurup.moulvibazar.gov.bd
2558	\N	Munshibazar	মুন্সিবাজার	munshibazarup3.moulvibazar.gov.bd
2559	\N	Alinagar	আলী নগর	alinagarup.moulvibazar.gov.bd
2560	\N	Baramchal	বরমচাল	baramchalup.moulvibazar.gov.bd
2561	\N	Bhukshimail	ভূকশিমইল	bhukshimailup.moulvibazar.gov.bd
2562	\N	Joychandi	জয়চন্ডি	joychandiup.moulvibazar.gov.bd
2563	\N	Brammanbazar	ব্রাহ্মণবাজার	brammanbazarup.moulvibazar.gov.bd
2564	\N	Kadipur	কাদিপুর	kadipurup.moulvibazar.gov.bd
2565	\N	Kulaura	কুলাউড়া	kulauraup.moulvibazar.gov.bd
2566	\N	Rauthgaon	রাউৎগাঁও	rauthgaonup.moulvibazar.gov.bd
2567	\N	Tilagaon	টিলাগাঁও	tilagaonup.moulvibazar.gov.bd
2568	\N	Sharifpur	শরীফপুর	sharifpurup.moulvibazar.gov.bd
2569	\N	Prithimpassa	পৃথিমপাশা	prithimpassaup.moulvibazar.gov.bd
2570	\N	Kormodha	কর্মধা	kormodhaup.moulvibazar.gov.bd
2571	\N	Bhatera	ভাটেরা	bhateraup.moulvibazar.gov.bd
2572	\N	Hazipur	হাজীপুর	hazipurup.moulvibazar.gov.bd
2573	\N	Amtail	আমতৈল	amtailup.moulvibazar.gov.bd
2574	\N	Khalilpur	খলিলপুর	khalilpurup.moulvibazar.gov.bd
2575	\N	Monumukh	মনুমুখ	monumukhup.moulvibazar.gov.bd
2576	\N	Kamalpur	কামালপুর	kamalpurup.moulvibazar.gov.bd
2577	\N	Apar Kagabala	আপার কাগাবলা	uparkagabalaup.moulvibazar.gov.bd
2578	\N	Akhailkura	আখাইলকুড়া	akhailkuraup.moulvibazar.gov.bd
2579	\N	Ekatuna	একাটুনা	ekatunaup.moulvibazar.gov.bd
2580	\N	Chadnighat	চাঁদনীঘাট	chadnighatup.moulvibazar.gov.bd
2581	\N	Konokpur	কনকপুর	konokpurup.moulvibazar.gov.bd
2582	\N	Nazirabad	নাজিরাবাদ	nazirabadup.moulvibazar.gov.bd
2583	\N	Mostafapur	মোস্তফাপুর	mostafapurup.moulvibazar.gov.bd
2584	\N	Giasnagar	গিয়াসনগর	giasnagarup.moulvibazar.gov.bd
2585	\N	Fotepur	ফতেপুর	fotepurup.moulvibazar.gov.bd
2586	\N	Uttorbhag	উত্তরভাগ	uttorbhagup.moulvibazar.gov.bd
2587	\N	Munsibazar	মুন্সিবাজার	munsibazarup.moulvibazar.gov.bd
2588	\N	Panchgaon	পাঁচগাঁও	panchgaonup.moulvibazar.gov.bd
2589	\N	Rajnagar	রাজনগর	rajnagarup.moulvibazar.gov.bd
2590	\N	Tengra	টেংরা	tengraup.moulvibazar.gov.bd
2591	\N	Kamarchak	কামারচাক	kamarchakup.moulvibazar.gov.bd
2592	\N	Munsurnagar	মনসুরনগর	munsurnagarup.moulvibazar.gov.bd
2593	\N	Mirzapur	মির্জাপুর	mirzapurup.moulvibazar.gov.bd
2594	\N	Bhunabir	ভূনবীর	bhunabirup.moulvibazar.gov.bd
2595	\N	Sreemangal	শ্রীমঙ্গল	sreemangalup.moulvibazar.gov.bd
2596	\N	Sindurkhan	সিন্দুরখান	sindurkhanup.moulvibazar.gov.bd
2597	\N	Kalapur	কালাপুর	kalapurup.moulvibazar.gov.bd
2598	\N	Ashidron	আশিদ্রোন	ashidronup.moulvibazar.gov.bd
2599	\N	Rajghat	রাজঘাট	rajghatup.moulvibazar.gov.bd
2600	\N	Kalighat	কালীঘাট	kalighatup.moulvibazar.gov.bd
2601	\N	Satgaon	সাতগাঁও	satgaonup.moulvibazar.gov.bd
2602	\N	Jafornagar	জায়ফরনগর	jafornagarup.moulvibazar.gov.bd
2603	\N	West Juri	পশ্চিম জুড়ী	westjuriup.moulvibazar.gov.bd
2604	\N	Gualbari	গোয়ালবাড়ী	gualbariup.moulvibazar.gov.bd
2605	\N	Sagornal	সাগরনাল	sagornalup.moulvibazar.gov.bd
2606	\N	Fultola	ফুলতলা	fultolaup.moulvibazar.gov.bd
2607	\N	Eastjuri	পুর্ব জুড়ী	eastjuriup.moulvibazar.gov.bd
2608	\N	Barabhakoir Paschim	বড় ভাকৈর (পশ্চিম)	barabhakoirpaschimup.habiganj.gov.bd
2609	\N	Barabhakoir Purba	বড় ভাকৈর (পূর্ব)	barabhakoirpurbaup.habiganj.gov.bd
2610	\N	Inatganj	ইনাতগঞ্জ	inatganjup.habiganj.gov.bd
2611	\N	Digholbak	দীঘলবাক	digholbakup.habiganj.gov.bd
2612	\N	Aushkandi	আউশকান্দি	aushkandiup.habiganj.gov.bd
2613	\N	Kurshi	কুর্শি	kurshiup.habiganj.gov.bd
2614	\N	Kargoan	করগাঁও	kargoanup.habiganj.gov.bd
2615	\N	Nabiganj Sadar	নবীগঞ্জ সদর	nabiganjsadarup.habiganj.gov.bd
2616	\N	Bausha	বাউসা	baushaup.habiganj.gov.bd
2617	\N	Debparra	দেবপাড়া	debparraup.habiganj.gov.bd
2618	\N	Gaznaipur	গজনাইপুর	gaznaipurup.habiganj.gov.bd
2619	\N	Kaliarbhanga	কালিয়ারভাংগা	kaliarbhangaup.habiganj.gov.bd
2620	\N	Paniumda	পানিউমদা	paniumdaup.habiganj.gov.bd
2621	\N	Snanghat	স্নানঘাট	snanghatup.habiganj.gov.bd
2622	\N	Putijuri	পুটিজুরী	putijuriup.habiganj.gov.bd
2623	\N	Satkapon	সাতকাপন	satkaponup.habiganj.gov.bd
2624	\N	Bahubal Sadar	বাহুবল সদর	bahubalsadarup.habiganj.gov.bd
2625	\N	Lamatashi	লামাতাশী	lamatashiup.habiganj.gov.bd
2626	\N	Mirpur	মিরপুর	mirpurup.habiganj.gov.bd
2627	\N	Bhadeshwar	ভাদেশ্বর	bhadeshwarup.habiganj.gov.bd
2628	\N	Shibpasha	শিবপাশা	shibpashaup.habiganj.gov.bd
2629	\N	Kakailsao	কাকাইলছেও	kakailsaoup.habiganj.gov.bd
2630	\N	Ajmiriganj Sadar	আজমিরীগঞ্জ সদর	ajmiriganjsadarup.habiganj.gov.bd
2631	\N	Badolpur	বদলপুর	badolpurup.habiganj.gov.bd
2632	\N	Jolsuka	জলসুখা	jolsukaup.habiganj.gov.bd
2633	\N	Baniachong North East	বানিয়াচং উত্তর পূর্ব	baniachongnortheastup.habiganj.gov.bd
2634	\N	Baniachong North West	বানিয়াচং উত্তর পশ্চিম	baniachongnorthwestup.habiganj.gov.bd
2635	\N	Baniachong South East	বানিয়াচং দক্ষিণ পূর্ব	baniachongsoutheastup.habiganj.gov.bd
2636	\N	Baniachong South West	বানিয়াচং দক্ষিণ পশ্চিম	baniachongsouthwestup.habiganj.gov.bd
2637	\N	Daulatpur	দৌলতপুর	daulatpur.habiganj.gov.bd
2638	\N	Khagaura	খাগাউড়া	khagauraup.habiganj.gov.bd
2639	\N	Baraiuri	বড়ইউড়ি	baraiuriup.habiganj.gov.bd
2640	\N	Kagapasha	কাগাপাশা	kagapashaup.habiganj.gov.bd
2641	\N	Pukra	পুকড়া	pukraup.habiganj.gov.bd
2642	\N	Subidpur	সুবিদপুর	subidpurup.habiganj.gov.bd
2643	\N	Makrampur	মক্রমপুর	makrampurup.habiganj.gov.bd
2644	\N	Sujatpur	সুজাতপুর	sujatpurup.habiganj.gov.bd
2645	\N	Mandari	মন্দরী	mandariup.habiganj.gov.bd
2646	\N	Muradpur	মুরাদপুর	muradpurup.habiganj.gov.bd
2647	\N	Pailarkandi	পৈলারকান্দি	pailarkandiup.habiganj.gov.bd
2648	\N	Lakhai	লাখাই	lakhaiup.habiganj.gov.bd
2649	\N	Murakari	মোড়াকরি	murakariup.habiganj.gov.bd
2650	\N	Muriauk	মুড়িয়াউক	muriaukup.habiganj.gov.bd
2651	\N	Bamoi	বামৈ	bamoiup.habiganj.gov.bd
2652	\N	Karab	করাব	karabup.habiganj.gov.bd
2653	\N	Bulla	বুল্লা	bullaup6.habiganj.gov.bd
2654	\N	Gazipur	গাজীপুর	gazipurup.habiganj.gov.bd
2655	\N	Ahammadabad	আহম্মদাবাদ	ahammadabadup.habiganj.gov.bd
2656	\N	Deorgach	দেওরগাছ	deorgachup.habiganj.gov.bd
2657	\N	Paikpara	পাইকপাড়া	paikparaup.habiganj.gov.bd
2658	\N	Shankhala	শানখলা	shankhalaup.habiganj.gov.bd
2659	\N	Chunarughat	চুনারুঘাট	chunarughatup.habiganj.gov.bd
2660	\N	Ubahata	উবাহাটা	ubahataup.habiganj.gov.bd
2661	\N	Shatiajuri	সাটিয়াজুরী	shatiajuriup.habiganj.gov.bd
2662	\N	Ranigaon	রাণীগাঁও	ranigaonup.habiganj.gov.bd
2663	\N	Mirashi	মিরাশী	mirashiup.habiganj.gov.bd
2664	\N	Lukra	লুকড়া	lukraup.habiganj.gov.bd
2665	\N	Richi	রিচি	richiup.habiganj.gov.bd
2666	\N	Teghoria	তেঘরিয়া	teghoriaup.habiganj.gov.bd
2667	\N	Poil	পইল	poilup.habiganj.gov.bd
2668	\N	Gopaya	গোপায়া	gopayaup.habiganj.gov.bd
2669	\N	Rajiura	রাজিউড়া	rajiuraup.habiganj.gov.bd
2670	\N	Nurpur	নুরপুর	nurpurup.habiganj.gov.bd
2671	\N	Shayestaganj	শায়েস্তাগঞ্জ	shayestaganjup.habiganj.gov.bd
2672	\N	Nijampur	নিজামপুর	nijampurup.habiganj.gov.bd
2673	\N	Laskerpur	লস্করপুর	laskerpurup.habiganj.gov.bd
2674	\N	Dharmaghar	ধর্মঘর	dharmagharup.habiganj.gov.bd
2675	\N	Choumohani	চৌমুহনী	choumohaniup.habiganj.gov.bd
2676	\N	Bahara	বহরা	baharaup.habiganj.gov.bd
2677	\N	Adaoir	আদাঐর	adaoirup.habiganj.gov.bd
2678	\N	Andiura	আন্দিউড়া	andiuraup.habiganj.gov.bd
2679	\N	Shahjahanpur	শাহজাহানপুর	shahjahanpurup.habiganj.gov.bd
2680	\N	Jagadishpur	জগদীশপুর	jagadishpurup.habiganj.gov.bd
2681	\N	Bulla	বুল্লা	bullaup.habiganj.gov.bd
2682	\N	Noapara	নোয়াপাড়া	noaparaup.habiganj.gov.bd
2683	\N	Chhatiain	ছাতিয়াইন	chhatiainup.habiganj.gov.bd
2684	\N	Bagashura	বাঘাসুরা	bagashuraup.habiganj.gov.bd
2685	\N	Jahangirnagar	জাহাঙ্গীরনগর	jahangirnagarup.sunamganj.gov.bd
2686	\N	Rangarchar	রংগারচর	rangarcharup.sunamganj.gov.bd
2687	\N	Aptabnagar	আপ্তাবনগর	aptabnagarup.sunamganj.gov.bd
2688	\N	Gourarang	গৌরারং	gourarang.sunamganj.gov.bd
2689	\N	Mollapara	মোল্লাপাড়া	mollaparaup.sunamganj.gov.bd
2690	\N	Laxmansree	লক্ষণশ্রী	laxmansreeup.sunamganj.gov.bd
2691	\N	Kathair	কাঠইর	kathairup.sunamganj.gov.bd
2692	\N	Surma	সুরমা	surmaup.sunamganj.gov.bd
2693	\N	Mohonpur	মোহনপুর	mohonpurup.sunamganj.gov.bd
2694	\N	Shimulbak	শিমুলবাক	shimulbak.sunamganj.gov.bd
2695	\N	Paschim Pagla	পশ্চিম পাগলা	paschimpagla.sunamganj.gov.bd
2696	\N	Joykalash	জয়কলস	joykalashup.sunamganj.gov.bd
2697	\N	Purba Pagla	পূর্ব পাগলা	purbapaglaup.sunamganj.gov.bd
2698	\N	Patharia	পাথারিয়া	pathariaup.sunamganj.gov.bd
2699	\N	Purba Birgaon	পূর্ব বীরগাঁও	purbabirgaonup.sunamganj.gov.bd
2700	\N	Dargapasha	দরগাপাশা	dargapashaup.sunamganj.gov.bd
2701	\N	Paschim Birgaon	পশ্চিম বীরগাঁও	paschimbirgaonup.sunamganj.gov.bd
2702	\N	Palash	পলাশ	palashup.sunamganj.gov.bd
2703	\N	Solukabad	সলুকাবাদ	solukabadup.sunamganj.gov.bd
2704	\N	Dhanpur	ধনপুর	dhanpurup.sunamganj.gov.bd
2705	\N	Badaghat South	বাদাঘাট দক্ষিণ	badaghatsouthup.sunamganj.gov.bd
2706	\N	Fatepur	ফতেপুর	fatepurup.sunamganj.gov.bd
2707	\N	Islampur	ইসলামপুর	islampurup.sunamganj.gov.bd
2708	\N	Noarai	নোয়ারাই	noaraiup.sunamganj.gov.bd
2709	\N	Chhatak Sadar	ছাতক সদর	chhataksadarup.sunamganj.gov.bd
2710	\N	Kalaruka	কালারুকা	kalarukaup.sunamganj.gov.bd
2711	\N	Gobindganj-Syedergaon	গোবিন্দগঞ্জ-সৈদেরগাঁও	gobindganjsyedergaonup.sunamganj.gov.bd
2712	\N	Chhaila Afjalabad	ছৈলা আফজলাবাদ	chhailaafjalabadup.sunamganj.gov.bd
2713	\N	Khurma North	খুরমা উত্তর	khurmanorthup.sunamganj.gov.bd
2714	\N	Khurma South	খুরমা দক্ষিণ	khurmasouthup.sunamganj.gov.bd
2715	\N	Chormohalla	চরমহল্লা	chormohallaup.sunamganj.gov.bd
2716	\N	Jauwabazar	জাউয়া বাজার	jauwabazarup.sunamganj.gov.bd
2717	\N	Singchapair	সিংচাপইড়	singchapairup.sunamganj.gov.bd
2718	\N	Dolarbazar	দোলারবাজার	dolarbazarup.sunamganj.gov.bd
2719	\N	Bhatgaon	ভাতগাঁও	bhatgaonup.sunamganj.gov.bd
2720	\N	Kolkolia	কলকলিয়া	kolkoliaup.sunamganj.gov.bd
2721	\N	Patli	পাটলী	patliup.sunamganj.gov.bd
2722	\N	Mirpur	মীরপুর	mirpurup.sunamganj.gov.bd
2723	\N	Chilaura Holdipur	চিলাউড়া হলদিপুর	chilauraholdipurup.sunamganj.gov.bd
2724	\N	Raniganj	রানীগঞ্জ	raniganjup.sunamganj.gov.bd
2725	\N	Syedpur Shaharpara	সৈয়দপুর শাহাড়পাড়া	syedpurshaharparaup.sunamganj.gov.bd
2726	\N	Asharkandi	আশারকান্দি	asharkandiup.sunamganj.gov.bd
2727	\N	Pailgaon	পাইলগাঁও	pailgaonup.sunamganj.gov.bd
2728	\N	Banglabazar	বাংলাবাজার	banglabazarup.sunamganj.gov.bd
2729	\N	Norsingpur	নরসিংহপুর	norsingpurup.sunamganj.gov.bd
2730	\N	Dowarabazar	দোয়ারাবাজার	dowarabazarup.sunamganj.gov.bd
2731	\N	Mannargaon	মান্নারগাঁও	mannargaonup.sunamganj.gov.bd
2732	\N	Pandargaon	পান্ডারগাঁও	pandargaonup.sunamganj.gov.bd
2733	\N	Dohalia	দোহালিয়া	dohaliaup.sunamganj.gov.bd
2734	\N	Laxmipur	লক্ষীপুর	laxmipurup.sunamganj.gov.bd
2735	\N	Boglabazar	বোগলাবাজার	boglabazarup.sunamganj.gov.bd
2736	\N	Surma	সুরমা	surma2up.sunamganj.gov.bd
2737	\N	Sreepur North	শ্রীপুর উত্তর	sreepurnorthup.sunamganj.gov.bd
2738	\N	Sreepur South	শ্রীপুর দক্ষিণ	sreepursouthup.sunamganj.gov.bd
2739	\N	Bordal South	বড়দল দক্ষিণ	bordalsouthup.sunamganj.gov.bd
2740	\N	Bordal North	বড়দল উত্তর	bordalnorthup.sunamganj.gov.bd
2741	\N	Badaghat	বাদাঘাট	badaghatup.sunamganj.gov.bd
2742	\N	Tahirpur Sadar	তাহিরপুর সদর	tahirpursadarup.sunamganj.gov.bd
2743	\N	Balijuri	বালিজুরী	balijuriup.sunamganj.gov.bd
2744	\N	Bongshikunda North	বংশীকুন্ডা উত্তর	bongshikundanorthup.sunamganj.gov.bd
2745	\N	Bongshikunda South	বংশীকুন্ডা দক্ষিণ	bongshikundasouthup.sunamganj.gov.bd
2746	\N	Chamordani	চামরদানী	chamordaniup.sunamganj.gov.bd
2747	\N	Madhyanagar	মধ্যনগর	madhyanagarup.sunamganj.gov.bd
2748	\N	Paikurati	পাইকুরাটী	paikuratiup.sunamganj.gov.bd
2749	\N	Selbarash	সেলবরষ	selbarashup.sunamganj.gov.bd
2750	\N	Dharmapasha Sadar	ধর্মপাশা সদর	dharmapashasadarup.sunamganj.gov.bd
2751	\N	Joyasree	জয়শ্রী	joyasreeup.sunamganj.gov.bd
2752	\N	Sukhair Rajapur North	সুখাইড় রাজাপুর উত্তর	sukhairrajapurnorthup.sunamganj.gov.bd
2753	\N	Sukhair Rajapur South	সুখাইড় রাজাপুর দক্ষিণ	sukhairrajapursouthup.sunamganj.gov.bd
2754	\N	Beheli	বেহেলী	beheliup.sunamganj.gov.bd
2755	\N	Sachnabazar	সাচনাবাজার	sachnabazarup.sunamganj.gov.bd
2756	\N	Bhimkhali	ভীমখালী	bhimkhaliup.sunamganj.gov.bd
2757	\N	Fenerbak	ফেনারবাক	fenerbakup.sunamganj.gov.bd
2758	\N	Jamalganj Sadar	জামালগঞ্জ সদর	jamalganjsadarup.sunamganj.gov.bd
2759	\N	Atgaon	আটগাঁও	atgaonup.sunamganj.gov.bd
2760	\N	Habibpur	হবিবপুর	habibpurup.sunamganj.gov.bd
2761	\N	Bahara	বাহারা	baharaup.sunamganj.gov.bd
2762	\N	Shalla Sadar	শাল্লা সদর	shallasadarup.sunamganj.gov.bd
2763	\N	Rafinagar	রফিনগর	rafinagarup.sunamganj.gov.bd
2764	\N	Bhatipara	ভাটিপাড়া	bhatiparaup.sunamganj.gov.bd
2765	\N	Rajanagar	রাজানগর	rajanagarup.sunamganj.gov.bd
2766	\N	Charnarchar	চরনারচর	charnarcharup.sunamganj.gov.bd
2767	\N	Derai Sarmangal	দিরাই সরমঙ্গল	deraisarmangalup.sunamganj.gov.bd
2768	\N	Karimpur	করিমপুর	karimpurup.sunamganj.gov.bd
2769	\N	Jagddol	জগদল	jagddolup.sunamganj.gov.bd
2770	\N	Taral	তাড়ল	taralup.sunamganj.gov.bd
2771	\N	Kulanj	কুলঞ্জ	kulanjup.sunamganj.gov.bd
2772	\N	Amlaba	আমলাব	amlabaup.narsingdi.gov.bd
2773	\N	Bajnaba	বাজনাব	bajnabaup.narsingdi.gov.bd
2774	\N	Belabo	বেলাব	belaboup.narsingdi.gov.bd
2775	\N	Binnabayd	বিন্নাবাইদ	binnabaydup.narsingdi.gov.bd
2776	\N	Charuzilab	চরউজিলাব	charuzilabup.narsingdi.gov.bd
2777	\N	Naraynpur	নারায়নপুর	naraynpurup.narsingdi.gov.bd
2778	\N	Sallabad	সল্লাবাদ	sallabadup.narsingdi.gov.bd
2779	\N	Patuli	পাটুলী	patuliup.narsingdi.gov.bd
2780	\N	Diara	দেয়ারা মডেল	diaraup.narsingdi.gov.bd
2781	\N	Barachapa	বড়চাপা	barachapaup.narsingdi.gov.bd
2782	\N	Chalakchar	চালাকচর	chalakcharup.narsingdi.gov.bd
2783	\N	Charmandalia	চরমান্দালিয়া	charmandaliaup.narsingdi.gov.bd
2784	\N	Ekduaria	একদুয়ারিয়া	ekduariaup.narsingdi.gov.bd
2785	\N	Gotashia	গোতাশিয়া	gotashiaup.narsingdi.gov.bd
2786	\N	Kanchikata	কাচিকাটা	kanchikataup.narsingdi.gov.bd
2787	\N	Khidirpur	খিদিরপুর	khidirpurup.narsingdi.gov.bd
2788	\N	Shukundi	শুকুন্দি	shukundiup.narsingdi.gov.bd
2789	\N	Dawlatpur	দৌলতপুর	dawlatpurup.narsingdi.gov.bd
2790	\N	Krisnopur	কৃষ্ণপুর	krisnopurup.narsingdi.gov.bd
2791	\N	Labutala	লেবুতলা	labutalaup.narsingdi.gov.bd
2792	\N	Chandanbari	চন্দনবাড়ী	chandanbariup.narsingdi.gov.bd
2793	\N	Alokbali	আলোকবালী	alokbaliup.narsingdi.gov.bd
2794	\N	Chardighaldi	চরদিঘলদী	chardighaldiup.narsingdi.gov.bd
2795	\N	Chinishpur	চিনিশপুর	chinishpurup.narsingdi.gov.bd
2796	\N	Hajipur	হাজীপুর	hajipurup.narsingdi.gov.bd
2797	\N	Karimpur	করিমপুর	karimpurup.narsingdi.gov.bd
2798	\N	Khathalia	কাঠালিয়া	khathaliaup.narsingdi.gov.bd
2799	\N	Nuralapur	নূরালাপুর	nuralapurup.narsingdi.gov.bd
2800	\N	Mahishasura	মহিষাশুড়া	mahishasuraup.narsingdi.gov.bd
2801	\N	Meherpara	মেহেড়পাড়া	meherparaup.narsingdi.gov.bd
2802	\N	Nazarpur	নজরপুর	nazarpurup.narsingdi.gov.bd
2803	\N	Paikarchar	পাইকারচর	paikarcharup.narsingdi.gov.bd
2804	\N	Panchdona	পাঁচদোনা	panchdonaup.narsingdi.gov.bd
2805	\N	Silmandi	শিলমান্দী	silmandiup.narsingdi.gov.bd
2806	\N	Amdia	আমদিয়া ২	amdiaup.narsingdi.gov.bd
2807	\N	Danga	ডাংঙ্গা	dangaup.narsingdi.gov.bd
2808	\N	Charsindur	চরসিন্দুর	charsindurup.narsingdi.gov.bd
2809	\N	Jinardi	জিনারদী	jinardiup.narsingdi.gov.bd
2810	\N	Gazaria	গজারিয়া	gazariaup.narsingdi.gov.bd
2811	\N	Chanpur	চানপুর	chanpurup.narsingdi.gov.bd
2812	\N	Alipura	অলিপুরা	alipuraup.narsingdi.gov.bd
2813	\N	Amirganj	আমিরগঞ্জ	amirganjup.narsingdi.gov.bd
2814	\N	Adiabad	আদিয়াবাদ	adiabadup.narsingdi.gov.bd
2815	\N	Banshgari	বাঁশগাড়ী	banshgariup.narsingdi.gov.bd
2816	\N	Chanderkandi	চান্দেরকান্দি	chanderkandiup.narsingdi.gov.bd
2817	\N	Chararalia	চরআড়ালিয়া	chararaliaup.narsingdi.gov.bd
2818	\N	Charmadhua	চরমধুয়া	charmadhuaup.narsingdi.gov.bd
2819	\N	Charsubuddi	চরসুবুদ্দি	charsubuddiup.narsingdi.gov.bd
2820	\N	Daukarchar	ডৌকারচর	daukarcharup.narsingdi.gov.bd
2821	\N	Hairmara	হাইরমারা	hairmaraup.narsingdi.gov.bd
2822	\N	Maheshpur	মহেষপুর	maheshpurup.narsingdi.gov.bd
2823	\N	Mirzanagar	মির্জানগর	mirzanagarup.narsingdi.gov.bd
2824	\N	Mirzarchar	মির্জারচর	mirzarcharup.narsingdi.gov.bd
2825	\N	Nilakhya	নিলক্ষ্যা	nilakhyaup.narsingdi.gov.bd
2826	\N	Palashtali	পলাশতলী	palashtaliup.narsingdi.gov.bd
2827	\N	Paratali	পাড়াতলী	parataliup.narsingdi.gov.bd
2828	\N	Sreenagar	শ্রীনগর	sreenagarup.narsingdi.gov.bd
2829	\N	Roypura	রায়পুরা	roypuraup.narsingdi.gov.bd
2830	\N	Musapur	মুছাপুর	musapurup.narsingdi.gov.bd
2831	\N	Uttar Bakharnagar	উত্তর বাখরনগর	uttarbakharnagarup.narsingdi.gov.bd
2832	\N	Marjal	মরজাল	marjal2up.narsingdi.gov.bd
2833	\N	Dulalpur	দুলালপুর	dulalpurup.narsingdi.gov.bd
2834	\N	Joynagar	জয়নগর	joynagarup.narsingdi.gov.bd
2835	\N	Sadharchar	সাধারচর	sadharcharup.narsingdi.gov.bd
2836	\N	Masimpur	মাছিমপুর	masimpurup.narsingdi.gov.bd
2837	\N	Chakradha	চক্রধা	chakradhaup.narsingdi.gov.bd
2838	\N	Joshar	যোশর	josharup.narsingdi.gov.bd
2839	\N	Baghabo	বাঘাব	baghaboup.narsingdi.gov.bd
2840	\N	Ayubpur	আয়ুবপুর	ayubpurup.narsingdi.gov.bd
2841	\N	Putia	পুটিয়া	putiaup.narsingdi.gov.bd
2842	\N	Bahadursadi	বাহাদুরশাদী	bahadursadi.gazipur.gov.bd
2843	\N	Baktarpur	বক্তারপুর	baktarpur.gazipur.gov.bd
2844	\N	Jamalpurnew	জামালপুর	jamalpurnew.gazipur.gov.bd
2845	\N	Jangalia	জাঙ্গালিয়া	jangalia.gazipur.gov.bd
2846	\N	Moktarpur	মোক্তারপুর	moktarpur.gazipur.gov.bd
2847	\N	Nagari	নাগরী	nagari.gazipur.gov.bd
2848	\N	Tumulia	তুমুলিয়া	tumulia.gazipur.gov.bd
2849	\N	Atabaha	আটাবহ	atabahaup.gazipur.gov.bd
2850	\N	Boali	বোয়ালী	boaliup.gazipur.gov.bd
2851	\N	Chapair	চাপাইর	chapairup.gazipur.gov.bd
2852	\N	Dhaliora	ঢালজোড়া	dhalioraup.gazipur.gov.bd
2853	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.gazipur.gov.bd
2854	\N	Madhyapara	মধ্যপাড়া	madhyapara.gazipur.gov.bd
2855	\N	Mouchak	মৌচাক	mouchakup.gazipur.gov.bd
2856	\N	Sutrapur	সূত্রাপুর	sutrapurup.gazipur.gov.bd
2857	\N	Srifaltali	শ্রীফলতলী	srifaltaliup.gazipur.gov.bd
2858	\N	Barishaba	বারিষাব	barishabaup.gazipur.gov.bd
2859	\N	Ghagotia	ঘাগটিয়া	ghagotiaup.gazipur.gov.bd
2860	\N	Kapasia	কাপাসিয়া	kapasiaup.gazipur.gov.bd
2861	\N	Chandpur	চাঁদপুর	chandpur.gazipur.gov.bd
2862	\N	Targoan	তরগাঁও	targoan.gazipur.gov.bd
2863	\N	Karihata	কড়িহাতা	karihata.gazipur.gov.bd
2864	\N	Tokh	টোক	tokh.gazipur.gov.bd
2865	\N	Sinhasree	সিংহশ্রী	sinhasree.gazipur.gov.bd
2866	\N	Durgapur	দূর্গাপুর	durgapurup.gazipur.gov.bd
2867	\N	Sonmania	সনমানিয়া	sonmaniaup.gazipur.gov.bd
2868	\N	Rayed	রায়েদ	rayedup.gazipur.gov.bd
2869	\N	Baria	বাড়ীয়া	bariaup.gazipur.gov.bd
2870	\N	Basan	বাসন	basanup.gazipur.gov.bd
2871	\N	Gachha	গাছা	gachhaup.gazipur.gov.bd
2872	\N	Kashimpur	কাশিমপুর	kashimpurup.gazipur.gov.bd
2873	\N	Kayaltia	কাউলতিয়া	kayaltiaup.gazipur.gov.bd
2874	\N	Konabari	কোনাবাড়ী	konabariup.gazipur.gov.bd
2875	\N	Mirzapur	মির্জাপুর	mirzapurup.gazipur.gov.bd
2876	\N	Pubail	পূবাইল	pubailup.gazipur.gov.bd
2877	\N	Barmi	বরমী	barmiup.gazipur.gov.bd
2878	\N	Gazipur	গাজীপুর	gazipurup.gazipur.gov.bd
2879	\N	Gosinga	গোসিংগা	gosingaup.gazipur.gov.bd
2880	\N	Maona	মাওনা	maonaup.gazipur.gov.bd
2881	\N	Kaoraid	কাওরাইদ	kaoraidup.gazipur.gov.bd
2882	\N	Prahladpur	প্রহলাদপুর	prahladpurup.gazipur.gov.bd
2883	\N	Rajabari	রাজাবাড়ী	rajabariup.gazipur.gov.bd
2884	\N	Telihati	তেলিহাটী	telihatiup.gazipur.gov.bd
2885	\N	Binodpur	বিনোদপুর	binodpurup.shariatpur.gov.bd
2886	\N	Tulasar	তুলাসার	tulasarup.shariatpur.gov.bd
2887	\N	Palong	পালং	palongup.shariatpur.gov.bd
2888	\N	Domshar	ডোমসার	domsharup.shariatpur.gov.bd
2889	\N	Rudrakar	রুদ্রকর	rudrakarup.shariatpur.gov.bd
2890	\N	Angaria	আংগারিয়া	angariaup.shariatpur.gov.bd
2891	\N	Chitolia	চিতলয়া	chitoliaup.shariatpur.gov.bd
2892	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.shariatpur.gov.bd
2893	\N	Chikondi	চিকন্দি	chikondiup.shariatpur.gov.bd
2894	\N	Chandrapur	চন্দ্রপুর	chandrapurup.shariatpur.gov.bd
2895	\N	Shulpara	শৌলপাড়া	shulparaup.shariatpur.gov.bd
2896	\N	Kedarpur	কেদারপুর	kedarpurup.shariatpur.gov.bd
2897	\N	Dingamanik	ডিংগামানিক	dingamanikup.shariatpur.gov.bd
2898	\N	Garishar	ঘড়িষার	garisharup.shariatpur.gov.bd
2899	\N	Nowpara	নওপাড়া	nowparaup.shariatpur.gov.bd
2900	\N	Moktererchar	মোত্তারেরচর	mokterercharup.shariatpur.gov.bd
2901	\N	Charatra	চরআত্রা	charatraup.shariatpur.gov.bd
2902	\N	Rajnagar	রাজনগর	rajnagarup.shariatpur.gov.bd
2903	\N	Japsa	জপসা	japsaup.shariatpur.gov.bd
2904	\N	Vojeshwar	ভোজেশ্বর	vojeshwarup.shariatpur.gov.bd
2905	\N	Fategongpur	ফতেজংপুর	fategongpurup.shariatpur.gov.bd
2906	\N	Bijari	বিঝারি	bijariup.shariatpur.gov.bd
2907	\N	Vumkhara	ভূমখাড়া	vumkharaup.shariatpur.gov.bd
2908	\N	Nashason	নশাসন	nashasonup.shariatpur.gov.bd
2909	\N	Zajira Sadar	জাজিরা সদর	zajirasadarup.shariatpur.gov.bd
2910	\N	Mulna	মূলনা	mulnaup.shariatpur.gov.bd
2911	\N	Barokandi	বড়কান্দি	barokandiup.shariatpur.gov.bd
2912	\N	Bilaspur	বিলাসপুর	bilaspurup.shariatpur.gov.bd
2913	\N	Kundarchar	কুন্ডেরচর	kundarcharup.shariatpur.gov.bd
2914	\N	Palerchar	পালেরচর	palercharup.shariatpur.gov.bd
2915	\N	Purba Nawdoba	পুর্ব নাওডোবা	purbanawdobaup.shariatpur.gov.bd
2916	\N	Nawdoba	নাওডোবা	nawdobaup.shariatpur.gov.bd
2917	\N	Shenerchar	সেনেরচর	shenercharup.shariatpur.gov.bd
2918	\N	Bknagar	বি. কে. নগর	bknagarup.shariatpur.gov.bd
2919	\N	Barogopalpur	বড়গোপালপুর	barogopalpurup.shariatpur.gov.bd
2920	\N	Jaynagor	জয়নগর	jaynagorup.shariatpur.gov.bd
2921	\N	Nager Para	নাগের পাড়া	nagerparaup.shariatpur.gov.bd
2922	\N	Alaolpur	আলাওলপুর	alaolpurup.shariatpur.gov.bd
2923	\N	Kodalpur	কোদালপুর	kodalpurup.shariatpur.gov.bd
2924	\N	Goshairhat	গোসাইরহাট	goshairhatup.shariatpur.gov.bd
2925	\N	Edilpur	ইদিলপুর	edilpurup.shariatpur.gov.bd
2926	\N	Nalmuri	নলমুড়ি	nalmuriup.shariatpur.gov.bd
2927	\N	Samontasar	সামন্তসার	samontasarup.shariatpur.gov.bd
2928	\N	Kuchipatti	কুচাইপট্টি	kuchipattiup.shariatpur.gov.bd
2929	\N	Ramvadrapur	রামভদ্রপুর	ramvadrapurup.shariatpur.gov.bd
2930	\N	Mahisar	মহিষার	mahisarup.shariatpur.gov.bd
2931	\N	Saygaon	ছয়গাঁও	saygaonup.shariatpur.gov.bd
2932	\N	Narayanpur	নারায়নপুর	narayanpurup.shariatpur.gov.bd
2933	\N	D.M Khali	ডি.এম খালি	dmkhaliup.shariatpur.gov.bd
2934	\N	Charkumaria	চরকুমারিয়া	charkumariaup.shariatpur.gov.bd
2935	\N	Sakhipur	সখিপুর	sakhipurup.shariatpur.gov.bd
2936	\N	Kachikata	কাচিকাঁটা	kachikataup.shariatpur.gov.bd
2937	\N	North Tarabunia	উত্তর তারাবুনিয়া	northtarabuniaup.shariatpur.gov.bd
2938	\N	Charvaga	চরভাগা	charvagaup.shariatpur.gov.bd
2939	\N	Arsinagar	আরশিনগর	arsinagarup.shariatpur.gov.bd
2940	\N	South Tarabunia	দক্ষিন তারাবুনিয়া	southtarabuniaup.shariatpur.gov.bd
2941	\N	Charsensas	চরসেনসাস	charsensasup.shariatpur.gov.bd
2942	\N	Shidulkura	শিধলকুড়া	shidulkuraup.shariatpur.gov.bd
2943	\N	Kaneshar	কনেস্বর	kanesharup.shariatpur.gov.bd
2944	\N	Purba Damudya	পুর্ব ডামুড্যা	purbadamudyaup.shariatpur.gov.bd
2945	\N	Islampur	ইসলামপুর	islampurup.shariatpur.gov.bd
2946	\N	Dankati	ধানকাটি	dankatiup.shariatpur.gov.bd
2947	\N	Sidya	সিড্যা	sidyaup.shariatpur.gov.bd
2948	\N	Darulaman	দারুল আমান	darulamanup.shariatpur.gov.bd
2949	\N	Satgram	সাতগ্রাম	satgramup.narayanganj.gov.bd
2950	\N	Duptara	দুপ্তারা	duptaraup.narayanganj.gov.bd
2951	\N	Brahammandi	ব্রা‏হ্মন্দী	brahammandiup.narayanganj.gov.bd
2952	\N	Fatepur	ফতেপুর	fatepurup.narayanganj.gov.bd
2953	\N	Bishnandi	বিশনন্দী	bishnandiup.narayanganj.gov.bd
2954	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.narayanganj.gov.bd
2955	\N	Highjadi	হাইজাদী	highjadiup.narayanganj.gov.bd
2956	\N	Uchitpura	উচিৎপুরা	uchitpuraup.narayanganj.gov.bd
2957	\N	Kalapaharia	কালাপাহাড়িয়া	kalapahariaup.narayanganj.gov.bd
2958	\N	Kagkanda	খাগকান্দা	kagkandaUP.narayanganj.gov.bd
2959	\N	Musapur	মুছাপুর	musapurup.narayanganj.gov.bd
2960	\N	Modonpur	মদনপুর	modonpurup.narayanganj.gov.bd
2961	\N	Bandar	বন্দর	bandarup.narayanganj.gov.bd
2962	\N	Dhamgar	ধামগর	dhamgar.narayanganj.gov.bd
2963	\N	Kolagathia	কলাগাছিয়া	kolagathiaup.narayanganj.gov.bd
2964	\N	Alirtek	আলিরটেক	alirtekup.narayanganj.gov.bd
2965	\N	Kashipur	কাশীপুর	kashipurup.narayanganj.gov.bd
2966	\N	Kutubpur	কুতুবপুর	kutubpurup.narayanganj.gov.bd
2967	\N	Gognagar	গোগনগর	gognagarup.narayanganj.gov.bd
2968	\N	Baktaboli	বক্তাবলী	baktaboliup.narayanganj.gov.bd
2969	\N	Enayetnagor	এনায়েত নগর	enayetnagorup.narayanganj.gov.bd
2970	\N	Murapara	মুড়াপাড়া	muraparaup.narayanganj.gov.bd
2971	\N	Bhulta	ভূলতা	bhultaup.narayanganj.gov.bd
2972	\N	Golakandail	গোলাকান্দাইল	golakandailup.narayanganj.gov.bd
2973	\N	Daudpur	দাউদপুর	daudpurup.narayanganj.gov.bd
2974	\N	Rupganj	রূপগঞ্জ	rupganjup.narayanganj.gov.bd
2975	\N	Kayetpara	কায়েতপাড়া	kayetparaup.narayanganj.gov.bd
2976	\N	Bholobo	ভোলাব	bholoboup.narayanganj.gov.bd
2977	\N	Pirojpur	পিরোজপুর	pirojpurup.narayanganj.gov.bd
2978	\N	Shambhupura	শম্ভুপুরা	shambhupura.narayanganj.gov.bd
2979	\N	Mograpara	মোগরাপাড়া	mograpara.narayanganj.gov.bd
2980	\N	Baidyerbazar	বৈদ্যেরবাজার	baidyerbazar.narayanganj.gov.bd
2981	\N	Baradi	বারদী	baradiup.narayanganj.gov.bd
2982	\N	Noagaon	নোয়াগাঁও	noagaonup.narayanganj.gov.bd
2983	\N	Jampur	জামপুর	jampurup.narayanganj.gov.bd
2984	\N	Sadipur	সাদীপুর	sadipurup.narayanganj.gov.bd
2985	\N	Sonmandi	সনমান্দি	sonmandiup.narayanganj.gov.bd
2986	\N	Kanchpur	কাচপুর	kanchpurup.narayanganj.gov.bd
2987	\N	Basail	বাসাইল	basailup.tangail.gov.bd
2988	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.tangail.gov.bd
2989	\N	Habla	হাবলা	hablaup.tangail.gov.bd
2990	\N	Kashil	কাশিল	kashilup.tangail.gov.bd
2991	\N	Fulki	ফুলকি	fulkiup.tangail.gov.bd
2992	\N	Kauljani	কাউলজানী	kauljaniup.tangail.gov.bd
2993	\N	Arjuna	অর্জুনা	arjunaup.tangail.gov.bd
2994	\N	Gabshara	গাবসারা	gabsharaup.tangail.gov.bd
2995	\N	Falda	ফলদা	faldaup.tangail.gov.bd
2996	\N	Gobindashi	গোবিন্দাসী	gobindashiup.tangail.gov.bd
2997	\N	Aloa	আলোয়া	aloaup.tangail.gov.bd
2998	\N	Nikrail	নিকরাইল	nikrailup.tangail.gov.bd
2999	\N	Deuli	দেউলী	deuliup.tangail.gov.bd
3000	\N	Lauhati	লাউহাটি	lauhatiup.tangail.gov.bd
3001	\N	Patharail	পাথরাইল	patharailup.tangail.gov.bd
3002	\N	Delduar	দেলদুয়ার	delduarup.tangail.gov.bd
3003	\N	Fazilhati	ফাজিলহাটি	fazilhatiup.tangail.gov.bd
3004	\N	Elasin	এলাসিন	elasinup.tangail.gov.bd
3005	\N	Atia	আটিয়া	atiaup.tangail.gov.bd
3006	\N	Dubail	ডুবাইল	dubailup.tangail.gov.bd
3007	\N	Deulabari	দেউলাবাড়ী	deulabariup.tangail.gov.bd
3008	\N	Ghatail	ঘাটাইল	ghatailup.tangail.gov.bd
3009	\N	Jamuria	জামুরিয়া	jamuriaup.tangail.gov.bd
3010	\N	Lokerpara	লোকেরপাড়া	lokerparaup.tangail.gov.bd
3011	\N	Anehola	আনেহলা	aneholaup.tangail.gov.bd
3012	\N	Dighalkandia	দিঘলকান্দি	dighalkandiaup.tangail.gov.bd
3013	\N	Digar	দিগড়	digarup.tangail.gov.bd
3014	\N	Deopara	দেওপাড়া	deoparaup.tangail.gov.bd
3015	\N	Sandhanpur	সন্ধানপুর	sandhanpurup.tangail.gov.bd
3016	\N	Rasulpur	রসুলপুর	rasulpurup.tangail.gov.bd
3017	\N	Dhalapara	ধলাপাড়া	dhalaparaup.tangail.gov.bd
3018	\N	Hadera	হাদিরা	haderaup.tangail.gov.bd
3019	\N	Jhawail	ঝাওয়াইল	jhawailup.tangail.gov.bd
3020	\N	Nagdashimla	নগদাশিমলা	nagdashimlaup.tangail.gov.bd
3021	\N	Dhopakandi	ধোপাকান্দি	dhopakandiup.tangail.gov.bd
3022	\N	Alamnagor	আলমনগর	alamnagorup.tangail.gov.bd
3023	\N	Hemnagor	হেমনগর	hemnagorup.tangail.gov.bd
3024	\N	Mirzapur	মির্জাপুর	mirzapurup.tangail.gov.bd
3025	\N	Alokdia	আলোকদিয়া	alokdiaup.tangail.gov.bd
3026	\N	Aushnara	আউশনারা	aushnaraup.tangail.gov.bd
3027	\N	Aronkhola	অরণখোলা	aronkholaup.tangail.gov.bd
3028	\N	Sholakuri	শোলাকুড়ি	sholakuriup.tangail.gov.bd
3029	\N	Golabari	গোলাবাড়ী	golabariup.tangail.gov.bd
3030	\N	Mirjabari	মির্জাবাড়ী	mirjabariup.tangail.gov.bd
3031	\N	Mahera	মহেড়া	maheraup.tangail.gov.bd
3032	\N	Jamurki	জামুর্কী	jamurkiup.tangail.gov.bd
3033	\N	Fatepur	ফতেপুর	fatepurup.tangail.gov.bd
3034	\N	Banail	বানাইল	banailup.tangail.gov.bd
3035	\N	Anaitara	আনাইতারা	anaitaraup.tangail.gov.bd
3036	\N	Warshi	ওয়ার্শী	warshiup.tangail.gov.bd
3037	\N	Bhatram	ভাতগ্রাম	bhatramup.tangail.gov.bd
3038	\N	Bahuria	বহুরিয়া	bahuriaup.tangail.gov.bd
3039	\N	Gorai	গোড়াই	goraiup.tangail.gov.bd
3040	\N	Ajgana	আজগানা	ajganaup.tangail.gov.bd
3041	\N	Tarafpur	তরফপুর	tarafpurup.tangail.gov.bd
3042	\N	Bastail	বাঁশতৈল	bastailup.tangail.gov.bd
3043	\N	Baora	ভাওড়া	baoraup.tangail.gov.bd
3044	\N	Latifpur	লতিফপুর	latifpurup.tangail.gov.bd
3045	\N	Bharra	ভারড়া	bharraup.tangail.gov.bd
3046	\N	Sahabathpur	সহবতপুর	sahabathpurup.tangail.gov.bd
3047	\N	Goyhata	গয়হাটা	goyhataup.tangail.gov.bd
3048	\N	Solimabad	সলিমাবাদ	solimabadup.tangail.gov.bd
3049	\N	Nagorpur	নাগরপুর	nagorpurup.tangail.gov.bd
3050	\N	Mamudnagor	মামুদনগর	mamudnagorup.tangail.gov.bd
3051	\N	Mokna	মোকনা	moknaup.tangail.gov.bd
3052	\N	Pakutia	পাকুটিয়া	pakutiaup.tangail.gov.bd
3053	\N	Bekrah Atgram	বেকরা আটগ্রাম	bekrahatgramup.tangail.gov.bd
3054	\N	Dhuburia	ধুবড়িয়া	dhuburiaup.tangail.gov.bd
3055	\N	Bhadra	ভাদ্রা	bhadraup.tangail.gov.bd
3056	\N	Doptior	দপ্তিয়র	doptiorup.tangail.gov.bd
3057	\N	Kakrajan	কাকড়াজান	kakrajanup.tangail.gov.bd
3058	\N	Gajaria	গজারিয়া	gajariaup.tangail.gov.bd
3059	\N	Jaduppur	যাদবপুর	jaduppurup.tangail.gov.bd
3060	\N	Hatibandha	হাতীবান্ধা	hatibandhaup.tangail.gov.bd
3061	\N	Kalia	কালিয়া	kaliaup.tangail.gov.bd
3062	\N	Dariapur	দরিয়াপুর	dariapurup.tangail.gov.bd
3063	\N	Kalmegha	কালমেঘা	kalmeghaup.tangail.gov.bd
3064	\N	Baharatoil	বহেড়াতৈল	baharatoilup.tangail.gov.bd
3065	\N	Mogra	মগড়া	mograup.tangail.gov.bd
3066	\N	Gala	গালা	galaup.tangail.gov.bd
3067	\N	Gharinda	ঘারিন্দা	gharindaup.tangail.gov.bd
3068	\N	Karatia	করটিয়া	karatiaup.tangail.gov.bd
3069	\N	Silimpur	ছিলিমপুর	silimpurup.tangail.gov.bd
3070	\N	Porabari	পোড়াবাড়ী	porabariup.tangail.gov.bd
3071	\N	Dyenna	দাইন্যা	dyennaup.tangail.gov.bd
3072	\N	Baghil	বাঘিল	baghilup.tangail.gov.bd
3073	\N	Kakua	কাকুয়া	kakuaup.tangail.gov.bd
3074	\N	Hugra	হুগড়া	hugraup.tangail.gov.bd
3075	\N	Katuli	কাতুলী	katuliup.tangail.gov.bd
3076	\N	Mahamudnagar	মাহমুদনগর	mahamudnagarup.tangail.gov.bd
3077	\N	Durgapur	দুর্গাপুর	durgapurup.tangail.gov.bd
3078	\N	Birbashinda	বীরবাসিন্দা	birbashindaup.tangail.gov.bd
3079	\N	Narandia	নারান্দিয়া	narandiaup.tangail.gov.bd
3080	\N	Shahadebpur	সহদেবপুর	shahadebpurup.tangail.gov.bd
3081	\N	Kokdahara	কোকডহরা	kokdaharaup.tangail.gov.bd
3082	\N	Balla	বল্লা	ballaup.tangail.gov.bd
3083	\N	Salla	সল্লা	sallaup.tangail.gov.bd
3084	\N	Nagbari	নাগবাড়ী	nagbariup.tangail.gov.bd
3085	\N	Bangra	বাংড়া	bangraup.tangail.gov.bd
3086	\N	Paikora	পাইকড়া	paikoraup.tangail.gov.bd
3087	\N	Dashokia	দশকিয়া	dashokiaup.tangail.gov.bd
3088	\N	Parkhi	পারখী	parkhiup.tangail.gov.bd
3089	\N	Gohaliabari	গোহালিয়াবাড়ী	gohaliabariup.tangail.gov.bd
3090	\N	Dhopakhali	ধোপাখালী	dhopakhaliup.tangail.gov.bd
3091	\N	Paiska	পাইস্কা	paiskaup.tangail.gov.bd
3092	\N	Mushuddi	মুশুদ্দি	mushuddiup.tangail.gov.bd
3093	\N	Bolibodrow	বলিভদ্র	bolibodrowup.tangail.gov.bd
3094	\N	Birtara	বীরতারা	birtaraup.tangail.gov.bd
3095	\N	Baniajan	বানিয়াজান	baniajanup.tangail.gov.bd
3096	\N	Jadunathpur	যদুনাথপুর	jadunathpurup.tangail.gov.bd
3097	\N	Chawganga	চৌগাংগা	chawgangaup.kishoreganj.gov.bd
3098	\N	Joysiddi	জয়সিদ্ধি	joysiddiup.kishoreganj.gov.bd
3099	\N	Alonjori	এলংজুরী	alonjoriup.kishoreganj.gov.bd
3100	\N	Badla	বাদলা	badlaup.kishoreganj.gov.bd
3101	\N	Boribari	বড়িবাড়ি	boribariup.kishoreganj.gov.bd
3102	\N	Itna	ইটনা	itnaup.kishoreganj.gov.bd
3103	\N	Mriga	মৃগা	mrigaup.kishoreganj.gov.bd
3104	\N	Dhonpur	ধনপুর	dhonpurup.kishoreganj.gov.bd
3105	\N	Raytoti	রায়টুটি	raytotiup.kishoreganj.gov.bd
3106	\N	Banagram	বনগ্রাম	banagramup.kishoreganj.gov.bd
3107	\N	Shahasram Dhuldia	সহশ্রাম ধুলদিয়া	shahasramdhuldiaup.kishoreganj.gov.bd
3108	\N	Kargaon	কারগাঁও	kargaonup.kishoreganj.gov.bd
3109	\N	Chandpur	চান্দপুর	chandpurup.kishoreganj.gov.bd
3110	\N	Mumurdia	মুমুরদিয়া	mumurdiaup.kishoreganj.gov.bd
3111	\N	Acmita	আচমিতা	acmitaup.kishoreganj.gov.bd
3112	\N	Mosua	মসূয়া	mosuaup.kishoreganj.gov.bd
3113	\N	Lohajuree	লোহাজুরী	lohajureeup.kishoreganj.gov.bd
3114	\N	Jalalpur	জালালপুর	jalalpurup.kishoreganj.gov.bd
3115	\N	Sadekpur	সাদেকপুর	sadekpurup.kishoreganj.gov.bd
3116	\N	Aganagar	আগানগর	aganagarup.kishoreganj.gov.bd
3117	\N	Shimulkandi	শিমুলকান্দি	shimulkandiup.kishoreganj.gov.bd
3118	\N	Gajaria	গজারিয়া	gajariaup.kishoreganj.gov.bd
3119	\N	Kalika Prashad	কালিকা প্রসাদ	kalikaprashadup.kishoreganj.gov.bd
3120	\N	Sreenagar	শ্রীনগর	sreenagarup.kishoreganj.gov.bd
3121	\N	Shibpur	শিবপুর	shibpurup.kishoreganj.gov.bd
3122	\N	Taljanga	তালজাঙ্গা	taljangaup.kishoreganj.gov.bd
3123	\N	Rauti	রাউতি	rautiup.kishoreganj.gov.bd
3124	\N	Dhola	ধলা	dholaup.kishoreganj.gov.bd
3125	\N	Jawar	জাওয়ার	jawarup.kishoreganj.gov.bd
3126	\N	Damiha	দামিহা	damihaup.kishoreganj.gov.bd
3127	\N	Digdair	দিগদাইর	digdairup.kishoreganj.gov.bd
3128	\N	Tarail-Sachail	তাড়াইল-সাচাইল	tarailsachailup.kishoreganj.gov.bd
3129	\N	Jinari	জিনারী	jinariup.kishoreganj.gov.bd
3130	\N	Gobindapur	গোবিন্দপুর	gobindapurup.kishoreganj.gov.bd
3131	\N	Sidhla	সিদলা	sidhlaup.kishoreganj.gov.bd
3132	\N	Araibaria	আড়াইবাড়িয়া	araibariaup.kishoreganj.gov.bd
3133	\N	Sahedal	সাহেদল	sahedalup.kishoreganj.gov.bd
3134	\N	Pumdi	পুমদি	pumdiup.kishoreganj.gov.bd
3135	\N	Jangalia	জাঙ্গালিয়া	jangaliaup.kishoreganj.gov.bd
3136	\N	Hosendi	হোসেনদি	hosendiup.kishoreganj.gov.bd
3137	\N	Narandi	নারান্দি	narandiup.kishoreganj.gov.bd
3138	\N	Shukhia	সুখিয়া	shukhiaup.kishoreganj.gov.bd
3139	\N	Patuavabga	পটুয়াভাঙ্গা	patuavabgaup.kishoreganj.gov.bd
3140	\N	Chandipasha	চান্দিপাশা	chandipashaup.kishoreganj.gov.bd
3141	\N	Charfaradi	চারফারাদি	charfaradiup.kishoreganj.gov.bd
3142	\N	Burudia	বুড়ুদিয়া	burudiaup.kishoreganj.gov.bd
3143	\N	Egarasindur	ইজারাসিন্দুর	egarasindurup.kishoreganj.gov.bd
3144	\N	Pakundia	পাকন্দিয়া	pakundiaup.kishoreganj.gov.bd
3145	\N	Ramdi	রামদী	ramdiup.kishoreganj.gov.bd
3146	\N	Osmanpur	উছমানপুর	osmanpurup.kishoreganj.gov.bd
3147	\N	Chhaysuti	ছয়সূতী	chhaysutiup.kishoreganj.gov.bd
3148	\N	Salua	সালুয়া	saluaup.kishoreganj.gov.bd
3149	\N	Gobaria Abdullahpur	গোবরিয়া আব্দুল্লাহপুর	gobariaabdullahpurup.kishoreganj.gov.bd
3150	\N	Faridpur	ফরিদপুর	faridpurup.kishoreganj.gov.bd
3151	\N	Rashidabad	রশিদাবাদ	rashidabadup.kishoreganj.gov.bd
3152	\N	Latibabad	লতিবাবাদ	latibabadup.kishoreganj.gov.bd
3153	\N	Maizkhapan	মাইজখাপন	maizkhapanup.kishoreganj.gov.bd
3154	\N	Mohinanda	মহিনন্দ	mohinandaup.kishoreganj.gov.bd
3155	\N	Joshodal	যশোদল	joshodalup.kishoreganj.gov.bd
3156	\N	Bowlai	বৌলাই	bowlaiup.kishoreganj.gov.bd
3157	\N	Binnati	বিন্নাটি	binnatiup.kishoreganj.gov.bd
3158	\N	Maria	মারিয়া	mariaup.kishoreganj.gov.bd
3159	\N	Chowddoshata	চৌদ্দশত	chowddoshataup.kishoreganj.gov.bd
3160	\N	Karshakarial	কর্শাকড়িয়াইল	karshakarialup.kishoreganj.gov.bd
3161	\N	Danapatuli	দানাপাটুলী	danapatuliup.kishoreganj.gov.bd
3162	\N	Kadirjangal	কাদিরজঙ্গল	kadirjangalup.kishoreganj.gov.bd
3163	\N	Gujadia	গুজাদিয়া	gujadiaup.kishoreganj.gov.bd
3164	\N	Kiraton	কিরাটন	kiratonup.kishoreganj.gov.bd
3165	\N	Barogharia	বারঘড়িয়া	baroghariaup.kishoreganj.gov.bd
3166	\N	Niamatpur	নিয়ামতপুর	niamatpurup.kishoreganj.gov.bd
3167	\N	Dehunda	দেহুন্দা	dehundaup.kishoreganj.gov.bd
3168	\N	Sutarpara	সুতারপাড়া	sutarparaup.kishoreganj.gov.bd
3169	\N	Gunodhar	গুনধর	gunodharup.kishoreganj.gov.bd
3170	\N	Joyka	জয়কা	joykaup.kishoreganj.gov.bd
3171	\N	Zafrabad	জাফরাবাদ	zafrabadup.kishoreganj.gov.bd
3172	\N	Noabad	নোয়াবাদ	noabadup.kishoreganj.gov.bd
3173	\N	Kailag	কৈলাগ	kailagup.kishoreganj.gov.bd
3174	\N	Pirijpur	পিরিজপুর	pirijpurup.kishoreganj.gov.bd
3175	\N	Gazirchar	গাজীরচর	gazircharup.kishoreganj.gov.bd
3176	\N	Hilochia	হিলচিয়া	hilochiaup.kishoreganj.gov.bd
3177	\N	Maijchar9	মাইজচর	maijchar9up.kishoreganj.gov.bd
3178	\N	Homypur	হুমাইপর	homypurup.kishoreganj.gov.bd
3179	\N	Halimpur	হালিমপুর	halimpurup.kishoreganj.gov.bd
3180	\N	Sararchar	সরারচর	sararcharup.kishoreganj.gov.bd
3181	\N	Dilalpur	দিলালপুর	dilalpurup.kishoreganj.gov.bd
3182	\N	Dighirpar	দিঘীরপাড়	dighirparup.kishoreganj.gov.bd
3183	\N	Boliardi	বলিয়ার্দী	boliardiup.kishoreganj.gov.bd
3184	\N	Dewghar	দেওঘর	dewgharup.kishoreganj.gov.bd
3185	\N	Kastul	কাস্তুল	kastulup.kishoreganj.gov.bd
3186	\N	Austagram Sadar	অষ্টগ্রাম সদর	austagramsadarup.kishoreganj.gov.bd
3187	\N	Bangalpara	বাঙ্গালপাড়া	bangalparaup.kishoreganj.gov.bd
3188	\N	Kalma	কলমা	kalmaup.kishoreganj.gov.bd
3189	\N	Adampur	আদমপুর	adampurup.kishoreganj.gov.bd
3190	\N	Khyerpur-Abdullahpur	খয়েরপুর-আব্দুল্লাপুর	khyerpurabdullahpurup.kishoreganj.gov.bd
3191	\N	Purba Austagram	পূর্ব অষ্টগ্রাম	purbaaustagramup.kishoreganj.gov.bd
3192	\N	Gopdighi	গোপদিঘী	gopdighiup.kishoreganj.gov.bd
3193	\N	Mithamoin	মিঠামইন	mithamoinup.kishoreganj.gov.bd
3194	\N	Dhaki	ঢাকী	dhakiup.kishoreganj.gov.bd
3195	\N	Ghagra	ঘাগড়া	ghagraup.kishoreganj.gov.bd
3196	\N	Keoarjore	কেওয়ারজোর	keoarjoreup.kishoreganj.gov.bd
3197	\N	Katkhal	কাটখাল	katkhalup.kishoreganj.gov.bd
3198	\N	Bairati	বৈরাটি	bairatiup.kishoreganj.gov.bd
3199	\N	Chatirchar	ছাতিরচর	chatircharup.kishoreganj.gov.bd
3200	\N	Guroi	গুরই	guroiup.kishoreganj.gov.bd
3201	\N	Jaraitala	জারইতলা	jaraitalaup.kishoreganj.gov.bd
3202	\N	Nikli Sadar	নিকলী সদর	niklisadarup.kishoreganj.gov.bd
3203	\N	Karpasa	কারপাশা	karpasaup.kishoreganj.gov.bd
3204	\N	Dampara	দামপাড়া	damparaup.kishoreganj.gov.bd
3205	\N	Singpur	সিংপুর	singpurup.kishoreganj.gov.bd
3206	\N	Balla	বাল্লা	ballaup.manikganj.gov.bd
3207	\N	Gala	গালা	galaup.manikganj.gov.bd
3208	\N	Chala	চালা	chalaup.manikganj.gov.bd
3209	\N	Blara	বলড়া	blaraup.manikganj.gov.bd
3210	\N	Harukandi	হারুকান্দি	harukandiup.manikganj.gov.bd
3211	\N	Baira	বয়রা	bairaup.manikganj.gov.bd
3212	\N	Ramkrishnapur	রামকৃঞ্চপুর	ramkrishnapurup.manikganj.gov.bd
3213	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.manikganj.gov.bd
3214	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.manikganj.gov.bd
3215	\N	Lacharagonj	লেছড়াগঞ্জ	lacharagonjup.manikganj.gov.bd
3216	\N	Sutalorie	সুতালড়ী	sutalorieup.manikganj.gov.bd
3217	\N	Dhulsura	ধূলশুড়া	dhulsuraup.manikganj.gov.bd
3218	\N	Azimnagar	আজিমনগর	azimnagarup.manikganj.gov.bd
3219	\N	Baried	বরাইদ	bariedup.manikganj.gov.bd
3220	\N	Dighulia	দিঘুলিয়া	dighuliaup.manikganj.gov.bd
3221	\N	Baliyati	বালিয়াটি	baliyatiup.manikganj.gov.bd
3222	\N	Dargram	দড়গ্রাম	dargramup.manikganj.gov.bd
3223	\N	Tilli	তিল্লী	tilliup.manikganj.gov.bd
3224	\N	Hargaj	হরগজ	hargajup.manikganj.gov.bd
3225	\N	Saturia	সাটুরিয়া	saturiaup.manikganj.gov.bd
3226	\N	Dhankora	ধানকোড়া	dhankoraup.manikganj.gov.bd
3227	\N	Fukurhati	ফুকুরহাটি	fukurhatiup.manikganj.gov.bd
3228	\N	Betila-Mitara	বেতিলা-মিতরা	betilamitaraup.manikganj.gov.bd
3229	\N	Jagir	জাগীর	jagirup.manikganj.gov.bd
3230	\N	Atigram	আটিগ্রাম	atigramup.manikganj.gov.bd
3231	\N	Dighi	দিঘী	dighiup.manikganj.gov.bd
3232	\N	Putile	পুটাইল	putileup.manikganj.gov.bd
3233	\N	Hatipara	হাটিপাড়া	hatiparaup.manikganj.gov.bd
3234	\N	Vararia	ভাড়ারিয়া	varariaup.manikganj.gov.bd
3235	\N	Nbogram	নবগ্রাম	nbogramup.manikganj.gov.bd
3236	\N	Garpara	গড়পাড়া	garparaup.manikganj.gov.bd
3237	\N	Krishnapur	কৃঞ্চপুর	krishnapurup.manikganj.gov.bd
3238	\N	Paila	পয়লা	pailaup.manikganj.gov.bd
3239	\N	Shingzuri	সিংজুড়ী	shingzuriup.manikganj.gov.bd
3240	\N	Baliyakhora	বালিয়াখোড়া	baliyakhoraup.manikganj.gov.bd
3241	\N	Gior	ঘিওর	giorup.manikganj.gov.bd
3242	\N	Bartia	বড়টিয়া	bartiaup.manikganj.gov.bd
3243	\N	Baniazuri	বানিয়াজুড়ী	baniazuriup.manikganj.gov.bd
3244	\N	Nalee	নালী	naleeup.manikganj.gov.bd
3245	\N	Teota	তেওতা	teotaup.manikganj.gov.bd
3246	\N	Utholi	উথলী	utholiup.manikganj.gov.bd
3247	\N	Shibaloy	শিবালয়	shibaloyup.manikganj.gov.bd
3248	\N	Ulayel	উলাইল	ulayelup.manikganj.gov.bd
3249	\N	Aruoa	আরুয়া	aruoaup.manikganj.gov.bd
3250	\N	Mohadebpur	মহাদেবপুর	mohadebpurup.manikganj.gov.bd
3251	\N	Shimulia	শিমুলিয়া	shimuliaup.manikganj.gov.bd
3252	\N	Charkataree	চরকাটারী	charkatareeup.manikganj.gov.bd
3253	\N	Bachamara	বাচামারা	bachamaraup.manikganj.gov.bd
3254	\N	Baghutia	বাঘুটিয়া	baghutiaup.manikganj.gov.bd
3255	\N	Zionpur	জিয়নপুর	zionpurup.manikganj.gov.bd
3256	\N	Khalshi	খলশী	khalshiup.manikganj.gov.bd
3257	\N	Chakmirpur	চকমিরপুর	chakmirpurup.manikganj.gov.bd
3258	\N	Klia	কলিয়া	kliaup.manikganj.gov.bd
3259	\N	Dhamswar	ধামশ্বর	dhamswarup.manikganj.gov.bd
3260	\N	Buyra	বায়রা	buyraup.manikganj.gov.bd
3261	\N	Talebpur	তালেবপুর	talebpurup.manikganj.gov.bd
3262	\N	Singiar	সিংগাইর	singiarup.manikganj.gov.bd
3263	\N	Baldhara	বলধারা	baldharaup.manikganj.gov.bd
3264	\N	Zamsha	জামশা	zamshaup.manikganj.gov.bd
3265	\N	Charigram	চারিগ্রাম	charigramup.manikganj.gov.bd
3266	\N	Shayesta	শায়েস্তা	shayestaup.manikganj.gov.bd
3267	\N	Joymonto	জয়মন্টপ	joymontopup.manikganj.gov.bd
3268	\N	Dhalla	ধল্লা	dhallaup.manikganj.gov.bd
3269	\N	Jamirta	জার্মিতা	jamirtaup.manikganj.gov.bd
3270	\N	Chandhar	চান্দহর	chandharup.manikganj.gov.bd
3271	\N	Savar	সাভার	savarup.dhaka.gov.bd
3272	\N	Birulia	বিরুলিয়া	birulia.dhaka.gov.bd
3273	\N	Dhamsona	ধামসোনা	dhamsonaup.dhaka.gov.bd
3274	\N	Shimulia	শিমুলিয়া	shimuliaup.dhaka.gov.bd
3275	\N	Ashulia	আশুলিয়া	ashuliaup.dhaka.gov.bd
3276	\N	Yearpur	ইয়ারপুর	yearpurup.dhaka.gov.bd
3277	\N	Vakurta	ভাকুর্তা	vakurtaup.dhaka.gov.bd
3278	\N	Pathalia	পাথালিয়া	pathaliaup.dhaka.gov.bd
3279	\N	Bongaon	বনগাঁও	bongaonup.dhaka.gov.bd
3280	\N	Kaundia	কাউন্দিয়া	kaundiaup.dhaka.gov.bd
3281	\N	Tetuljhora	তেঁতুলঝোড়া	tetuljhora.dhaka.gov.bd
3282	\N	Aminbazar	আমিনবাজার	aminbazar.dhaka.gov.bd
3283	\N	Chauhat	চৌহাট	chauhatup.dhaka.gov.bd
3284	\N	Amta	আমতা	amtaup.dhaka.gov.bd
3285	\N	Balia	বালিয়া	baliaup.dhaka.gov.bd
3286	\N	Jadabpur	যাদবপুর	jadabpurup.dhaka.gov.bd
3287	\N	Baisakanda	বাইশাকান্দা	baisakandaup.dhaka.gov.bd
3288	\N	Kushura	কুশুরা	kushuraup.dhaka.gov.bd
3289	\N	Gangutia	গাংগুটিয়া	gangutiaup.dhaka.gov.bd
3290	\N	Sanora	সানোড়া	sanoraup.dhaka.gov.bd
3291	\N	Sutipara	সূতিপাড়া	sutiparaup.dhaka.gov.bd
3292	\N	Sombhag	সোমভাগ	sombhagup.dhaka.gov.bd
3293	\N	Vararia	ভাড়ারিয়া	varariaup.dhaka.gov.bd
3294	\N	Dhamrai	ধামরাই	dhamraiup.dhaka.gov.bd
3295	\N	Kulla	কুল্লা	kullaup.dhaka.gov.bd
3296	\N	Rowail	রোয়াইল	rowailup.dhaka.gov.bd
3297	\N	Suapur	সুয়াপুর	suapurup.dhaka.gov.bd
3298	\N	Nannar	নান্নার	nannarup.dhaka.gov.bd
3299	\N	Hazratpur	হযরতপুর	hazratpurup.dhaka.gov.bd
3300	\N	Kalatia	কলাতিয়া	kalatiaup.dhaka.gov.bd
3301	\N	Taranagar	তারানগর	taranagarup.dhaka.gov.bd
3302	\N	Sakta	শাক্তা	saktaup.dhaka.gov.bd
3303	\N	Ruhitpur	রোহিতপুর	ruhitpurup.dhaka.gov.bd
3304	\N	Basta	বাস্তা	bastaup.dhaka.gov.bd
3305	\N	Kalindi	কালিন্দি	kalindiup.dhaka.gov.bd
3306	\N	Zinzira	জিনজিরা	zinziraup.dhaka.gov.bd
3307	\N	Suvadda	শুভাঢ্যা	suvaddaup.dhaka.gov.bd
3308	\N	Taghoria	তেঘরিয়া	taghoriaup.dhaka.gov.bd
3309	\N	Konda	কোন্ডা	kondaup.dhaka.gov.bd
3310	\N	Aganagar	আগানগর	aganagarup.dhaka.gov.bd
3311	\N	Shikaripara	শিকারীপাড়া	shikariparaup.dhaka.gov.bd
3312	\N	Joykrishnapur	জয়কৃষ্ণপুর	joykrishnapurup.dhaka.gov.bd
3313	\N	Baruakhali	বারুয়াখালী	baruakhaliup.dhaka.gov.bd
3314	\N	Nayansree	নয়নশ্রী	nayansreeup.dhaka.gov.bd
3315	\N	Sholla	শোল্লা	shollaup.dhaka.gov.bd
3316	\N	Jantrail	যন্ত্রাইল	jantrailup.dhaka.gov.bd
3317	\N	Bandura	বান্দুরা	banduraup.dhaka.gov.bd
3318	\N	Kalakopa	কলাকোপা	kalakopaup.dhaka.gov.bd
3319	\N	Bakshanagar	বক্সনগর	bakshanagarup.dhaka.gov.bd
3320	\N	Barrah	বাহ্রা	barrahup.dhaka.gov.bd
3321	\N	Kailail	কৈলাইল	kailailup.dhaka.gov.bd
3322	\N	Agla	আগলা	aglaup.dhaka.gov.bd
3323	\N	Galimpur	গালিমপুর	galimpurup.dhaka.gov.bd
3324	\N	Churain	চুড়াইন	churainup.dhaka.gov.bd
3325	\N	Nayabari	নয়াবাড়ী	nayabariup.dhaka.gov.bd
3326	\N	Kusumhathi	কুসুমহাটি	kusumhathiup.dhaka.gov.bd
3327	\N	Raipara	রাইপাড়া	raiparaup.dhaka.gov.bd
3328	\N	Sutarpara	সুতারপাড়া	sutarparaup.dhaka.gov.bd
3329	\N	Narisha	নারিশা	narishaup.dhaka.gov.bd
3330	\N	Muksudpur	মুকসুদপুর	muksudpurup.dhaka.gov.bd
3331	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.dhaka.gov.bd
3332	\N	Bilaspur	বিলাসপুর	bilaspurup.dhaka.gov.bd
3333	\N	Rampal	রামপাল	rampalup.munshiganj.gov.bd
3334	\N	Panchashar	পঞ্চসার	panchasharup.munshiganj.gov.bd
3335	\N	Bajrajogini	বজ্রযোগিনী	bajrajoginiup.munshiganj.gov.bd
3336	\N	Mohakali	মহাকালী	mohakaliup.munshiganj.gov.bd
3337	\N	Charkewar	চরকেওয়ার	charkewarup.munshiganj.gov.bd
3338	\N	Mollakandi	মোল্লাকান্দি	mollakandiup.munshiganj.gov.bd
3339	\N	Adhara	আধারা	adharaup.munshiganj.gov.bd
3340	\N	Shiloy	শিলই	shiloyup.munshiganj.gov.bd
3341	\N	Banglabazar	বাংলাবাজার	banglabazarup.munshiganj.gov.bd
3342	\N	Baraikhali	বাড়েখাল	baraikhaliup.munshiganj.gov.bd
3343	\N	Hashara	হাসাড়া	hasharaup.munshiganj.gov.bd
3344	\N	Birtara	বাড়তারা	birtaraup.munshiganj.gov.bd
3345	\N	Shologhor	ষোলঘর	shologhorup.munshiganj.gov.bd
3346	\N	Sreenagar	শ্রীনগর	sreenagarup.munshiganj.gov.bd
3347	\N	Patabhog	পাঢাভোগ	patabhogup.munshiganj.gov.bd
3348	\N	Shamshiddi	শ্যামসিদ্দি	shamshiddiup.munshiganj.gov.bd
3349	\N	Kolapara	কুলাপাড়া	kolaparaup.munshiganj.gov.bd
3350	\N	Vaggakol	ভাগ্যকুল	vaggakolup.munshiganj.gov.bd
3351	\N	Bagra	বাঘড়া	bagraup.munshiganj.gov.bd
3352	\N	Rarikhal	রাঢ়ীখাল	rarikhalup.munshiganj.gov.bd
3353	\N	Kukutia	কুকুটিয়া	kukutiaup.munshiganj.gov.bd
3354	\N	Atpara	আটপাড়া	atparaup.munshiganj.gov.bd
3355	\N	Tantor	তন্তর	tantorup.munshiganj.gov.bd
3356	\N	Chitracoat	চিত্রকোট	chitracoatup.munshiganj.gov.bd
3357	\N	Sekhornagar	শেখরনগার	sekhornagarup.munshiganj.gov.bd
3358	\N	Rajanagar	রাজানগর	rajanagarup.munshiganj.gov.bd
3359	\N	Keyain	কেয়াইন	keyainup.munshiganj.gov.bd
3360	\N	Basail	বাসাইল	basailup.munshiganj.gov.bd
3361	\N	Baluchar	বালুচর	balucharup.munshiganj.gov.bd
3362	\N	Latabdi	লতাব্দী	latabdiup.munshiganj.gov.bd
3363	\N	Rasunia	রশুনিয়া	rasuniaup.munshiganj.gov.bd
3364	\N	Ichhapura	ইছাপুরা	ichhapuraup.munshiganj.gov.bd
3365	\N	Bairagadi	বয়রাগাদি	bairagadiup.munshiganj.gov.bd
3366	\N	Malkhanagar	মালখানগর	malkhanagarup.munshiganj.gov.bd
3367	\N	Madhypara	মধ্যপাড়া	madhyparaup.munshiganj.gov.bd
3368	\N	Kola	কোলা	kolaup.munshiganj.gov.bd
3369	\N	Joyinshar	জৈনসার	joyinsharup.munshiganj.gov.bd
3370	\N	Medinimandal	মেদিনীমন্ডল	medinimandalup.munshiganj.gov.bd
3371	\N	Kumarbhog	কুমারভোগ	kumarbhogup.munshiganj.gov.bd
3372	\N	Haldia	হলদিয়া	haldiaup.munshiganj.gov.bd
3373	\N	Kanaksar	কনকসার	kanaksarup.munshiganj.gov.bd
3374	\N	Lohajang-Teotia	লৌহজং-তেওটিয়া	lohajangteotiaup.munshiganj.gov.bd
3375	\N	Bejgaon	বেজগাঁও	bejgaonup.munshiganj.gov.bd
3376	\N	Baultoli	বৌলতলী	baultoliup.munshiganj.gov.bd
3377	\N	Khidirpara	খিদিরপাড়া	khidirparaup.munshiganj.gov.bd
3378	\N	Gaodia	গাওদিয়া	gaodiaup.munshiganj.gov.bd
3379	\N	Kalma	কলমা	kalmaup.munshiganj.gov.bd
3380	\N	Gajaria	গজারিয়া	gajariaup.munshiganj.gov.bd
3381	\N	Baushia	বাউশিয়া	baushiaup.munshiganj.gov.bd
3382	\N	Vaberchar	ভবেরচর	vabercharup.munshiganj.gov.bd
3383	\N	Baluakandi	বালুয়াকান্দী	baluakandiup.munshiganj.gov.bd
3384	\N	Tengarchar	টেংগারচর	tengarcharup.munshiganj.gov.bd
3385	\N	Hosendee	হোসেন্দী	hosendeeup.munshiganj.gov.bd
3386	\N	Guagachia	গুয়াগাছিয়া	guagachiaup.munshiganj.gov.bd
3387	\N	Imampur	ইমামপুর	imampurup.munshiganj.gov.bd
3388	\N	Betka	বেতকা	betkaup.munshiganj.gov.bd
3389	\N	Abdullapur	আব্দুল্লাপুর	abdullapurup.munshiganj.gov.bd
3390	\N	Sonarong Tongibari	সোনারং টংগীবাড়ী	sonarongtongibariup.munshiganj.gov.bd
3391	\N	Autshahi	আউটশাহী	autshahiup.munshiganj.gov.bd
3392	\N	Arial Baligaon	আড়িয়ল বালিগাঁও	arialbaligaonup.munshiganj.gov.bd
3393	\N	Dhipur	ধীপুর	dhipurup.munshiganj.gov.bd
3394	\N	Kathadia Shimolia	কাঠাদিয়া শিমুলিয়া	kathadiashimoliaup.munshiganj.gov.bd
3395	\N	Joslong	যশলং	joslongup.munshiganj.gov.bd
3396	\N	Panchgaon	পাঁচগাও	panchgaonup.munshiganj.gov.bd
3397	\N	Kamarkhara	কামারখাড়া	kamarkharaup.munshiganj.gov.bd
3398	\N	Hasailbanari	হাসাইল বানারী	hasailbanariup.munshiganj.gov.bd
3399	\N	Dighirpar	দিঘীরপাড়	dighirparup.munshiganj.gov.bd
3400	\N	Mijanpur	মিজানপুর	mijanpurup.rajbari.gov.bd
3401	\N	Borat	বরাট	boratup.rajbari.gov.bd
3402	\N	Chandoni	চন্দনী	chandoniup.rajbari.gov.bd
3403	\N	Khangonj	খানগঞ্জ	khangonjup.rajbari.gov.bd
3404	\N	Banibaha	বানীবহ	banibahaup.rajbari.gov.bd
3405	\N	Dadshee	দাদশী	dadsheeup.rajbari.gov.bd
3406	\N	Mulghar	মুলঘর	mulgharup.rajbari.gov.bd
3407	\N	Basantapur	বসন্তপুর	basantapurup.rajbari.gov.bd
3408	\N	Khankhanapur	খানখানাপুর	khankhanapurup.rajbari.gov.bd
3409	\N	Alipur	আলীপুর	alipurup.rajbari.gov.bd
3410	\N	Ramkantapur	রামকান্তপুর	ramkantapurup.rajbari.gov.bd
3411	\N	Shahidwahabpur	শহীদওহাবপুর	shahidwahabpurup.rajbari.gov.bd
3412	\N	Panchuria	পাঁচুরিয়া	panchuriaup.rajbari.gov.bd
3413	\N	Sultanpur	সুলতানপুর	sultanpurup.rajbari.gov.bd
3414	\N	Doulatdia	দৌলতদিয়া	doulatdiaup.rajbari.gov.bd
3415	\N	Debugram	দেবগ্রাম	debugramup.rajbari.gov.bd
3416	\N	Uzancar	উজানচর	uzancarup.rajbari.gov.bd
3417	\N	Chotovakla	ছোটভাকলা	chotovaklaup.rajbari.gov.bd
3418	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup.rajbari.gov.bd
3419	\N	Habashpur	হাবাসপুর	habashpurup.rajbari.gov.bd
3420	\N	Jashai	যশাই	jashaiup.rajbari.gov.bd
3421	\N	Babupara	বাবুপাড়া	babuparaup.rajbari.gov.bd
3422	\N	Mourat	মৌরাট	mouratup.rajbari.gov.bd
3423	\N	Patta	পাট্টা	pattaup.rajbari.gov.bd
3424	\N	Sarisha	সরিষা	sarishaup.rajbari.gov.bd
3425	\N	Kalimahar	কলিমহর	kalimaharup.rajbari.gov.bd
3426	\N	Kasbamajhail	কসবামাজাইল	kasbamajhailup.rajbari.gov.bd
3427	\N	Machhpara	মাছপাড়া	machhparaup.rajbari.gov.bd
3428	\N	Islampur	ইসলামপুর	islampurup.rajbari.gov.bd
3429	\N	Baharpur	বহরপুর	baharpurup.rajbari.gov.bd
3430	\N	Nawabpur	নবাবপুর	nawabpurup.rajbari.gov.bd
3431	\N	Narua	নারুয়া	naruaup.rajbari.gov.bd
3432	\N	Baliakandi	বালিয়াকান্দি	baliakandiup.rajbari.gov.bd
3433	\N	Janjal	জঙ্গল	janjalup.rajbari.gov.bd
3434	\N	Jamalpur	জামালপুর	jamalpurup.rajbari.gov.bd
3435	\N	Kalukhali	কালুখালী	kalukhaliup.rajbari.gov.bd
3436	\N	Ratandia	রতনদিয়া	ratandiaup.rajbari.gov.bd
3437	\N	Kalikapur	কালিকাপুর	kalikapurup.rajbari.gov.bd
3438	\N	Boalia	বোয়ালিয়া	boaliaup.rajbari.gov.bd
3439	\N	Majbari	মাজবাড়ী	majbariup.rajbari.gov.bd
3440	\N	Madapur	মদাপুর	madapurup.rajbari.gov.bd
3441	\N	Shawrail	সাওরাইল	shawrailup.rajbari.gov.bd
3442	\N	Mrigi	মৃগী	mrigiup.rajbari.gov.bd
3443	\N	Sirkhara	শিড়খাড়া	sirkharaup.madaripur.gov.bd
3444	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup.madaripur.gov.bd
3445	\N	Kunia	কুনিয়া	kuniaup.madaripur.gov.bd
3446	\N	Peyarpur	পেয়ারপুর	peyarpurup.madaripur.gov.bd
3447	\N	Kandua	কেন্দুয়া	kanduaup.madaripur.gov.bd
3448	\N	Mastofapur	মস্তফাপুর	mastofapurup.madaripur.gov.bd
3449	\N	Dudkhali	দুধখালী	dudkhaliup.madaripur.gov.bd
3450	\N	Kalikapur	কালিকাপুর	kalikapurup.madaripur.gov.bd
3451	\N	Chilarchar	ছিলারচর	chilarcharup.madaripur.gov.bd
3452	\N	Panchkhola	পাঁচখোলা	panchkholaup.madaripur.gov.bd
3453	\N	Ghatmajhi	ঘটমাঝি	ghatmajhiup.madaripur.gov.bd
3454	\N	Jhaoudi	ঝাউদী	jhaoudiup.madaripur.gov.bd
3455	\N	Khoajpur	খোয়াজপুর	khoajpurup.madaripur.gov.bd
3456	\N	Rasti	রাস্তি	rastiup.madaripur.gov.bd
3457	\N	Dhurail	ধুরাইল	dhurailup.madaripur.gov.bd
3458	\N	Shibchar	শিবচর	shibcharup.madaripur.gov.bd
3459	\N	Ditiyakhando	দ্বিতীয়খন্ড	ditiyakhandoup.madaripur.gov.bd
3460	\N	Nilokhe	নিলখি	nilokheup.madaripur.gov.bd
3461	\N	Bandarkhola	বন্দরখোলা	bandarkholaup.madaripur.gov.bd
3462	\N	Charjanazat	চরজানাজাত	charjanazatup.madaripur.gov.bd
3463	\N	Madbarerchar	মাদবরেরচর	madbarercharup.madaripur.gov.bd
3464	\N	Panchar	পাঁচচর	pancharup.madaripur.gov.bd
3465	\N	Sannasirchar	সন্যাসিরচর	sannasircharup.madaripur.gov.bd
3466	\N	Kathalbari	কাঁঠালবাড়ী	kathalbariup.madaripur.gov.bd
3467	\N	Kutubpur	কুতুবপুর	kutubpurup.madaripur.gov.bd
3468	\N	Kadirpur	কাদিরপুর	kadirpurup.madaripur.gov.bd
3552	\N	Kandi	কান্দি	kandiup.gopalganj.gov.bd
3469	\N	Vhandarikandi	ভান্ডারীকান্দি	vhandarikandiup.madaripur.gov.bd
3470	\N	Bahertala South	বহেরাতলা দক্ষিণ	bahertalasouthup.madaripur.gov.bd
3471	\N	Baheratala North	বহেরাতলা উত্তর	baheratalanorthup.madaripur.gov.bd
3472	\N	Baskandi	বাঁশকান্দি	baskandiup.madaripur.gov.bd
3473	\N	Umedpur	উমেদপুর	umedpurup.madaripur.gov.bd
3474	\N	Vhadrasion	ভদ্রাসন	vhadrasionup.madaripur.gov.bd
3475	\N	Shiruail	শিরুয়াইল	shiruailup.madaripur.gov.bd
3476	\N	Dattapara	দত্তপাড়া	dattaparaup.madaripur.gov.bd
3477	\N	Alinagar	আলীনগর	alinagarup.madaripur.gov.bd
3478	\N	Baligram	বালীগ্রাম	baligramup.madaripur.gov.bd
3479	\N	Basgari	বাঁশগাড়ী	basgariup.madaripur.gov.bd
3480	\N	Chardoulatkhan	চরদৌলতখান	chardoulatkhanup.madaripur.gov.bd
3481	\N	Dashar	ডাসার	dasharup.madaripur.gov.bd
3482	\N	Enayetnagor	এনায়েতনগর	enayetnagorup.madaripur.gov.bd
3483	\N	Gopalpur	গোপালপুর	gopalpurup.madaripur.gov.bd
3484	\N	Koyaria	কয়ারিয়া	koyariaup.madaripur.gov.bd
3485	\N	Kazibakai	কাজীবাকাই	kazibakaiup.madaripur.gov.bd
3486	\N	Laxmipur	লক্ষীপুর	laxmipurup.madaripur.gov.bd
3487	\N	Nabogram	নবগ্রাম	nabogramup.madaripur.gov.bd
3488	\N	Ramjanpur	রমজানপুর	ramjanpurup.madaripur.gov.bd
3489	\N	Shahebrampur	সাহেবরামপুর	shahebrampurup.madaripur.gov.bd
3490	\N	Shikarmongol	শিকারমঙ্গল	shikarmongolup.madaripur.gov.bd
3491	\N	Haridasdi-Mahendrodi	হরিদাসদী-মহেন্দ্রদী	haridasdi-mahendrodiup.madaripur.gov.bd
3492	\N	Kadambari	কদমবাড়ী	kadambariup.madaripur.gov.bd
3493	\N	Bajitpur	বাজিতপুর	bajitpurup.madaripur.gov.bd
3494	\N	Amgram	আমগ্রাম	amgramup.madaripur.gov.bd
3495	\N	Rajoir	রাজৈর	rajoirup.madaripur.gov.bd
3496	\N	Khaliya	খালিয়া	khaliyaup.madaripur.gov.bd
3497	\N	Ishibpur	ইশিবপুর	ishibpurup.madaripur.gov.bd
3498	\N	Badarpasa	বদরপাশা	badarpasaup.madaripur.gov.bd
3499	\N	Kabirajpur	কবিরাজপুর	kabirajpurup.madaripur.gov.bd
3500	\N	Hosenpur	হোসেনপুর	hosenpurup.madaripur.gov.bd
3501	\N	Paikpara	পাইকপাড়া	paikparaup.madaripur.gov.bd
3502	\N	Jalalabad	জালালাবাদ	jalalabadup.gopalganj.gov.bd
3503	\N	Shuktail	শুকতাইল	shuktailup.gopalganj.gov.bd
3504	\N	Chandradighalia	চন্দ্রদিঘলিয়া	chandradighaliaup.gopalganj.gov.bd
3505	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.gopalganj.gov.bd
3506	\N	Paikkandi	পাইককান্দি	paikkandiup.gopalganj.gov.bd
3507	\N	Urfi	উরফি	urfiup.gopalganj.gov.bd
3508	\N	Lotifpur	লতিফপুর	lotifpurup.gopalganj.gov.bd
3509	\N	Satpar	সাতপাড়	satparup.gopalganj.gov.bd
3510	\N	Sahapur	সাহাপুর	sahapurup.gopalganj.gov.bd
3511	\N	Horidaspur	হরিদাসপুর	horidaspurup.gopalganj.gov.bd
3512	\N	Ulpur	উলপুর	ulpurup.gopalganj.gov.bd
3513	\N	Nizra	নিজড়া	nizraup.gopalganj.gov.bd
3514	\N	Karpara	করপাড়া	karparaup.gopalganj.gov.bd
3515	\N	Durgapur	দুর্গাপুর	durgapurup.gopalganj.gov.bd
3516	\N	Kajulia	কাজুলিয়া	kajuliaup.gopalganj.gov.bd
3517	\N	Majhigati	মাঝিগাতী	majhigatiup.gopalganj.gov.bd
3518	\N	Roghunathpur	রঘুনাথপুর	roghunathpurup.gopalganj.gov.bd
3519	\N	Gobra	গোবরা	gobraup.gopalganj.gov.bd
3520	\N	Borashi	বোড়াশী	borashiup.gopalganj.gov.bd
3521	\N	Kati	কাঠি	katiup.gopalganj.gov.bd
3522	\N	Boultali	বৌলতলী	boultaliup.gopalganj.gov.bd
3523	\N	Kashiani	কাশিয়ানী	kashianiup.gopalganj.gov.bd
3524	\N	Hatiara	হাতিয়াড়া	hatiaraup.gopalganj.gov.bd
3525	\N	Fukura	ফুকরা	fukuraup.gopalganj.gov.bd
3526	\N	Rajpat	রাজপাট	rajpatup.gopalganj.gov.bd
3527	\N	Bethuri	বেথুড়ী	bethuriup.gopalganj.gov.bd
3528	\N	Nijamkandi	নিজামকান্দি	nijamkandiup.gopalganj.gov.bd
3529	\N	Sajail	সাজাইল	sajailup.gopalganj.gov.bd
3530	\N	Mamudpur	মাহমুদপুর	mamudpurup.gopalganj.gov.bd
3531	\N	Maheshpur	মহেশপুর	maheshpurup.gopalganj.gov.bd
3532	\N	Orakandia	ওড়াকান্দি	orakandiaup.gopalganj.gov.bd
3533	\N	Parulia	পারুলিয়া	paruliaup.gopalganj.gov.bd
3534	\N	Ratail	রাতইল	ratailup.gopalganj.gov.bd
3535	\N	Puisur	পুইশুর	puisurup.gopalganj.gov.bd
3536	\N	Singa	সিংগা	singaup.gopalganj.gov.bd
3537	\N	Kushli	কুশলী	kushliup.gopalganj.gov.bd
3538	\N	Gopalpur	গোপালপুর	gopalpurup.gopalganj.gov.bd
3539	\N	Patgati	পাটগাতী	patgatiup.gopalganj.gov.bd
3540	\N	Borni	বর্ণি	borniup.gopalganj.gov.bd
3541	\N	Dumaria	ডুমরিয়া	dumariaup.gopalganj.gov.bd
3542	\N	Sadullapur	সাদুল্লাপুর	sadullapurup.gopalganj.gov.bd
3543	\N	Ramshil	রামশীল	ramshilup.gopalganj.gov.bd
3544	\N	Bandhabari	বান্ধাবাড়ী	bandhabariup.gopalganj.gov.bd
3545	\N	Kolabari	কলাবাড়ী	kolabariup.gopalganj.gov.bd
3546	\N	Kushla	কুশলা	kushlaup.gopalganj.gov.bd
3547	\N	Amtoli	আমতলী	amtoliup.gopalganj.gov.bd
3548	\N	Pinjuri	পিঞ্জুরী	pinjuriup.gopalganj.gov.bd
3549	\N	Ghaghor	ঘাঘর	ghaghorup.gopalganj.gov.bd
3550	\N	Radhaganj	রাধাগঞ্জ	radhaganjup.gopalganj.gov.bd
3551	\N	Hiron	হিরণ	hironup.gopalganj.gov.bd
3553	\N	Ujani	উজানী	ujaniup.gopalganj.gov.bd
3554	\N	Nanikhir	ননীক্ষীর	nanikhirup.gopalganj.gov.bd
3555	\N	Dignagar	দিগনগর	dignagarup.gopalganj.gov.bd
3556	\N	Poshargati	পশারগাতি	poshargatiup.gopalganj.gov.bd
3557	\N	Gobindopur	গোবিন্দপুর	gobindopurup.gopalganj.gov.bd
3558	\N	Khandarpara	খান্দারপাড়া	khandarparaup.gopalganj.gov.bd
3559	\N	Bohugram	বহুগ্রাম	bohugramup.gopalganj.gov.bd
3560	\N	Banshbaria	বাশঁবাড়িয়া	banshbariaup.gopalganj.gov.bd
3561	\N	Vabrashur	ভাবড়াশুর	vabrashurup.gopalganj.gov.bd
3562	\N	Moharajpur	মহারাজপুর	moharajpurup.gopalganj.gov.bd
3563	\N	Batikamari	বাটিকামারী	batikamariup.gopalganj.gov.bd
3564	\N	Jalirpar	জলিরপাড়	jalirparup.gopalganj.gov.bd
3565	\N	Raghdi	রাঘদী	raghdiup.gopalganj.gov.bd
3566	\N	Gohala	গোহালা	gohalaup.gopalganj.gov.bd
3567	\N	Mochna	মোচনা	mochnaup.gopalganj.gov.bd
3568	\N	Kashalia	কাশালিয়া	kashaliaup.gopalganj.gov.bd
3569	\N	Ishangopalpur	ঈশানগোপালপুর	ishangopalpurup.faridpur.gov.bd
3570	\N	Charmadbdia	চরমাধবদিয়া	charmadbdiaup.faridpur.gov.bd
3571	\N	Aliabad	আলিয়াবাদ	aliabadup.faridpur.gov.bd
3572	\N	Uttarchannel	নর্থচ্যানেল	uttarchannelup.faridpur.gov.bd
3573	\N	Decreerchar	ডিক্রিরচর	decreercharup.faridpur.gov.bd
3574	\N	Majchar	মাচ্চর	majcharup.faridpur.gov.bd
3575	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.faridpur.gov.bd
3576	\N	Ambikapur	অম্বিকাপুর	ambikapurup.faridpur.gov.bd
3577	\N	Kanaipur	কানাইপুর	kanaipurup.faridpur.gov.bd
3578	\N	Kaijuri	কৈজুরী	kaijuriup.faridpur.gov.bd
3579	\N	Greda	গেরদা	gredaup.faridpur.gov.bd
3580	\N	Buraich	বুড়াইচ	buraichup.faridpur.gov.bd
3581	\N	Alfadanga	আলফাডাঙ্গা	alfadangaup.faridpur.gov.bd
3582	\N	Tagarbanda	টগরবন্দ	tagarbandaup.faridpur.gov.bd
3583	\N	Bana	বানা	banaup.faridpur.gov.bd
3584	\N	Panchuria	পাঁচুড়িয়া	panchuriaup.faridpur.gov.bd
3585	\N	Gopalpur	গোপালপুর	gopalpurup.faridpur.gov.bd
3586	\N	Boalmari	বোয়ালমারী	boalmariup.faridpur.gov.bd
3587	\N	Dadpur	দাদপুর	dadpurup.faridpur.gov.bd
3588	\N	Chatul	চতুল	chatulup.faridpur.gov.bd
3589	\N	Ghoshpur	ঘোষপুর	ghoshpurup.faridpur.gov.bd
3590	\N	Gunbaha	গুনবহা	gunbahaup.faridpur.gov.bd
3591	\N	Chandpur	চাঁদপুর	chandpurup.faridpur.gov.bd
3592	\N	Parameshwardi	পরমেশ্বরদী	parameshwardiup.faridpur.gov.bd
3593	\N	Satair	সাতৈর	satairup.faridpur.gov.bd
3594	\N	Rupapat	রূপাপাত	rupapatup.faridpur.gov.bd
3595	\N	Shekhar	শেখর	shekharup.faridpur.gov.bd
3596	\N	Moyna	ময়না	moynaup.faridpur.gov.bd
3597	\N	Char Bisnopur	চর বিষ্ণুপুর	charbisnopurup.faridpur.gov.bd
3598	\N	Akoter Char	আকোটের চর	akotercharup.faridpur.gov.bd
3599	\N	Char Nasirpur	চর নাসিরপুর	charnasirpurup.faridpur.gov.bd
3600	\N	Narikel Bariya	নারিকেল বাড়িয়া	narikelbariyaup.faridpur.gov.bd
3601	\N	Bhashanchar	ভাষানচর	bhashancharup.faridpur.gov.bd
3602	\N	Krishnapur	কৃষ্ণপুর	krishnapurup.faridpur.gov.bd
3603	\N	Sadarpur	সদরপুর	sadarpurup.faridpur.gov.bd
3604	\N	Char Manair	চর মানাইর	charmanairup.faridpur.gov.bd
3605	\N	Dhaukhali	ঢেউখালী	dhaukhaliup.faridpur.gov.bd
3606	\N	Charjashordi	চরযশোরদী	charjashordiup.faridpur.gov.bd
3607	\N	Purapara	পুরাপাড়া	puraparaup.faridpur.gov.bd
3608	\N	Laskardia	লস্করদিয়া	laskardiaup.faridpur.gov.bd
3609	\N	Ramnagar	রামনগর	ramnagarup.faridpur.gov.bd
3610	\N	Kaichail	কাইচাইল	kaichailup.faridpur.gov.bd
3611	\N	Talma	তালমা	talmaup.faridpur.gov.bd
3612	\N	Fulsuti	ফুলসুতি	fulsutiup.faridpur.gov.bd
3613	\N	Dangi	ডাঙ্গী	dangiup.faridpur.gov.bd
3614	\N	Kodalia Shohidnagar	কোদালিয়া শহিদনগর	kodaliashohidnagarup.faridpur.gov.bd
3615	\N	Gharua	ঘারুয়া	gharuaup.faridpur.gov.bd
3616	\N	Nurullagonj	নুরুল্যাগঞ্জ	nurullagonjup.faridpur.gov.bd
3617	\N	Manikdha	মানিকদহ	manikdhaup.faridpur.gov.bd
3618	\N	Kawlibera	কাউলিবেড়া	kawliberaup.faridpur.gov.bd
3619	\N	Nasirabad	নাছিরাবাদ	nasirabadup.faridpur.gov.bd
3620	\N	Tujerpur	তুজারপুর	tujerpurup.faridpur.gov.bd
3621	\N	Algi	আলগী	algiup.faridpur.gov.bd
3622	\N	Chumurdi	চুমুরদী	chumurdiup.faridpur.gov.bd
3623	\N	Kalamridha	কালামৃধা	kalamridhaup.faridpur.gov.bd
3624	\N	Azimnagor	আজিমনগর	azimnagorup.faridpur.gov.bd
3625	\N	Chandra	চান্দ্রা	chandraup.faridpur.gov.bd
3626	\N	Hamirdi	হামিরদী	hamirdiup.faridpur.gov.bd
3627	\N	Gazirtek	গাজীরটেক	gazirtekup.faridpur.gov.bd
3628	\N	Char Bhadrasan	চর ভদ্রাসন	charbhadrasanup.faridpur.gov.bd
3629	\N	Char Harirampur	চর হরিরামপুর	charharirampurup.faridpur.gov.bd
3630	\N	Char Jahukanda	চর ঝাউকান্দা	charjahukandaup.faridpur.gov.bd
3631	\N	Madhukhali	মধুখালী	madhukhaliup.faridpur.gov.bd
3632	\N	Jahapur	জাহাপুর	jahapurup.faridpur.gov.bd
3633	\N	Gazna	গাজনা	gaznaup.faridpur.gov.bd
3634	\N	Megchami	মেগচামী	megchamiup.faridpur.gov.bd
3635	\N	Raipur	রায়পুর	raipurup.faridpur.gov.bd
3636	\N	Bagat	বাগাট	bagatup.faridpur.gov.bd
3637	\N	Dumain	ডুমাইন	dumainup.faridpur.gov.bd
3638	\N	Nowpara	নওপাড়া	nowparaup.faridpur.gov.bd
3639	\N	Kamarkhali	কামারখালী	kamarkhaliup.faridpur.gov.bd
3640	\N	Bhawal	ভাওয়াল	bhawalup.faridpur.gov.bd
3641	\N	Atghar	আটঘর	atgharup.faridpur.gov.bd
3642	\N	Mazadia	মাঝারদিয়া	mazadiaup.faridpur.gov.bd
3643	\N	Ballabhdi	বল্লভদী	ballabhdiup.faridpur.gov.bd
3644	\N	Gatti	গট্টি	gattiup.faridpur.gov.bd
3645	\N	Jadunandi	যদুনন্দী	jadunandiup.faridpur.gov.bd
3646	\N	Ramkantapur	রামকান্তপুর	ramkantapurup.faridpur.gov.bd
3647	\N	Sonapur	সোনাপুর	sonapurup.faridpur.gov.bd
3648	\N	Panchagarh Sadar	পঞ্চগড় সদর	panchagarhsadarup.panchagarh.gov.bd
3649	\N	Satmara	সাতমেরা	satmaraup.panchagarh.gov.bd
3650	\N	Amarkhana	অমরখানা	amarkhanaup.panchagarh.gov.bd
3651	\N	Haribhasa	হাড়িভাসা	haribhasaup.panchagarh.gov.bd
3652	\N	Chaklahat	চাকলাহাট	chaklahatup.panchagarh.gov.bd
3653	\N	Hafizabad	হাফিজাবাদ	hafizabadup.panchagarh.gov.bd
3654	\N	Kamat Kajol Dighi	কামাত কাজল দীঘি	kamatkajoldighiup.panchagarh.gov.bd
3655	\N	Dhakkamara	ধাক্কামারা	dhakkamaraup.panchagarh.gov.bd
3656	\N	Magura	মাগুরা	maguraup.panchagarh.gov.bd
3657	\N	Garinabari	গরিনাবাড়ী	garinabariup.panchagarh.gov.bd
3658	\N	Chilahati	চিলাহাটি	chilahatiup.panchagarh.gov.bd
3659	\N	Shaldanga	শালডাঙ্গা	shaldangaup.panchagarh.gov.bd
3660	\N	Debiganj Sadar	দেবীগঞ্জ সদর	debiganjsadarup.panchagarh.gov.bd
3661	\N	Pamuli	পামুলী	pamuliup.panchagarh.gov.bd
3662	\N	Sundardighi	সুন্দরদিঘী	sundardighiup.panchagarh.gov.bd
3663	\N	Sonahar Mollikadaha	সোনাহার মল্লিকাদহ	sonaharmollikadahaup.panchagarh.gov.bd
3664	\N	Tepriganj	টেপ্রীগঞ্জ	tepriganjup.panchagarh.gov.bd
3665	\N	Dandopal	দন্ডপাল	dandopalup.panchagarh.gov.bd
3666	\N	Debiduba	দেবীডুবা	debidubaup.panchagarh.gov.bd
3667	\N	Chengthi Hazra Danga	চেংঠী হাজরা ডাঙ্গা	chengthihazradangaup.panchagarh.gov.bd
3668	\N	Jholaishal Shiri	ঝলইশাল শিরি	jholaishalshiriup.panchagarh.gov.bd
3669	\N	Moidandighi	ময়দান দীঘি	moidandighiup.panchagarh.gov.bd
3670	\N	Banghari	বেংহারী	banghariup.panchagarh.gov.bd
3671	\N	Kajoldighi Kaligonj	কাজলদীঘি কালিগঞ্জ	kajoldighikaligonjup.panchagarh.gov.bd
3672	\N	Boroshoshi	বড়শশী	boroshoshiup.panchagarh.gov.bd
3673	\N	Chandanbari	চন্দনবাড়ী	chandanbariup.panchagarh.gov.bd
3674	\N	Marea Bamonhat	মাড়েয়া বামনহাট	mareabamonhatup.panchagarh.gov.bd
3675	\N	Boda	বোদা	bodaup.panchagarh.gov.bd
3676	\N	Sakoa	সাকোয়া	sakoaup.panchagarh.gov.bd
3677	\N	Pachpir	পাচপীর	pachpirup.panchagarh.gov.bd
3678	\N	Mirgapur	মির্জাপুর	mirgapurup.panchagarh.gov.bd
3679	\N	Radhanagar	রাধানগর	radhanagarup.panchagarh.gov.bd
3680	\N	Toria	তোড়িয়া	toriaup.panchagarh.gov.bd
3681	\N	Balarampur	বলরামপুর	balarampurup.panchagarh.gov.bd
3682	\N	Alowakhowa	আলোয়াখোয়া	alowakhowaup.panchagarh.gov.bd
3683	\N	Dhamor	ধামোর	dhamorup.panchagarh.gov.bd
3684	\N	Banglabandha	বাংলাবান্ধা	banglabandhaup.panchagarh.gov.bd
3685	\N	Bhojoanpur	ভজনপুর	bhojoanpurup.panchagarh.gov.bd
3686	\N	Bhojoanpur	ভজনপুর	bhojoanpur.gazipur.gov.bd
3687	\N	Buraburi	বুড়াবুড়ী	buraburi.panchagarh.gov.bd
3688	\N	Debnagar	দেবনগর	debnagarup.panchagarh.gov.bd
3689	\N	Salbahan	শালবাহান	salbahanup.panchagarh.gov.bd
3690	\N	Tentulia	তেতুলিয়া	tentuliaup.panchagarh.gov.bd
3691	\N	Timaihat	তিমাইহাট	timaihat.panchagarh.gov.bd
3692	\N	Joypur	জয়পুর	joypurup.dinajpur.gov.bd
3693	\N	Binodnagar	বিনোদনগর	binodnagarup.dinajpur.gov.bd
3694	\N	Golapgonj	গোলাপগঞ্জ	golapgonjup.dinajpur.gov.bd
3695	\N	Shalkhuria	শালখুরিয়া	shalkhuriaup.dinajpur.gov.bd
3696	\N	Putimara	পুটিমারা	putimaraup.dinajpur.gov.bd
3697	\N	Bhaduria	ভাদুরিয়া	bhaduriaup.dinajpur.gov.bd
3698	\N	Daudpur	দাউদপুর	daudpurup.dinajpur.gov.bd
3699	\N	Mahmudpur	মাহামুদপুর	mahmudpurup.dinajpur.gov.bd
3700	\N	Kushdaha	কুশদহ	kushdahaup.dinajpur.gov.bd
3701	\N	Shibrampur	শিবরামপুর	shibrampurup.dinajpur.gov.bd
3702	\N	Polashbari	পলাশবাড়ী	polashbariup2.dinajpur.gov.bd
3703	\N	Shatagram	শতগ্রাম	shatagramup.dinajpur.gov.bd
3704	\N	Paltapur	পাল্টাপুর	paltapurup.dinajpur.gov.bd
3705	\N	Sujalpur	সুজালপুর	sujalpurup.dinajpur.gov.bd
3706	\N	Nijpara	নিজপাড়া	nijparaup.dinajpur.gov.bd
3707	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.dinajpur.gov.bd
3708	\N	Bhognagar	ভোগনগর	bhognagarup.dinajpur.gov.bd
3709	\N	Sator	সাতোর	satorup.dinajpur.gov.bd
3710	\N	Mohonpur	মোহনপুর	mohonpurup.dinajpur.gov.bd
3711	\N	Moricha	মরিচা	morichaup.dinajpur.gov.bd
3712	\N	Bulakipur	বুলাকীপুর	bulakipurup.dinajpur.gov.bd
3713	\N	Palsha	পালশা	palshaup.dinajpur.gov.bd
3714	\N	Singra	সিংড়া	singraup.dinajpur.gov.bd
3715	\N	Ghoraghat	ঘোড়াঘাট	ghoraghatup.dinajpur.gov.bd
3716	\N	Mukundopur	মুকুন্দপুর	mukundopurup.dinajpur.gov.bd
3717	\N	Katla	কাটলা	katlaup.dinajpur.gov.bd
3718	\N	Khanpur	খানপুর	khanpurup.dinajpur.gov.bd
3719	\N	Dior	দিওড়	diorup.dinajpur.gov.bd
3720	\N	Binail	বিনাইল	binailup.dinajpur.gov.bd
3721	\N	Jatbani	জোতবানী	jatbaniup.dinajpur.gov.bd
3722	\N	Poliproyagpur	পলিপ্রয়াগপুর	poliproyagpurup.dinajpur.gov.bd
3723	\N	Belaichandi	বেলাইচন্ডি	belaichandiup.dinajpur.gov.bd
3724	\N	Monmothopur	মন্মথপুর	monmothopurup.dinajpur.gov.bd
3725	\N	Rampur	রামপুর	rampurup.dinajpur.gov.bd
3726	\N	Polashbari	পলাশবাড়ী	polashbariup4.dinajpur.gov.bd
3727	\N	Chandipur	চন্ডীপুর	chandipurup.dinajpur.gov.bd
3728	\N	Mominpur	মোমিনপুর	mominpurup.dinajpur.gov.bd
3729	\N	Mostofapur	মোস্তফাপুর	mostofapurup.dinajpur.gov.bd
3730	\N	Habra	হাবড়া	habraup.dinajpur.gov.bd
3731	\N	Hamidpur	হামিদপুর	hamidpurup.dinajpur.gov.bd
3732	\N	Harirampur	হরিরামপুর	harirampurup.dinajpur.gov.bd
3733	\N	Nafanagar	নাফানগর	nafanagarup.dinajpur.gov.bd
3734	\N	Eshania	ঈশানিয়া	eshaniaup.dinajpur.gov.bd
3735	\N	Atgaon	আটগাঁও	atgaonup.dinajpur.gov.bd
3736	\N	Shatail	ছাতইল	shatailup.dinajpur.gov.bd
3737	\N	Rongaon	রনগাঁও	rongaonup.dinajpur.gov.bd
3738	\N	Murshidhat	মুর্শিদহাট	murshidhatup.dinajpur.gov.bd
3739	\N	Dabor	ডাবোর	daborup.dinajpur.gov.bd
3740	\N	Rasulpur	রসুলপুর	rasulpurup.dinajpur.gov.bd
3741	\N	Mukundapur	মুকুন্দপুর	mukundapurup.dinajpur.gov.bd
3742	\N	Targao	তারগাঁও	targaoup.dinajpur.gov.bd
3743	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.dinajpur.gov.bd
3744	\N	Sundarpur	সুন্দরপুর	sundarpurup.dinajpur.gov.bd
3745	\N	Aloary	এলুয়াড়ী	aloaryup.dinajpur.gov.bd
3746	\N	Aladipur	আলাদিপুর	aladipurup.dinajpur.gov.bd
3747	\N	Kagihal	কাজীহাল	kagihalup.dinajpur.gov.bd
3748	\N	Bethdighi	বেতদিঘী	bethdighiup.dinajpur.gov.bd
3749	\N	Khairbari	খয়েরবাড়ী	khairbariup.dinajpur.gov.bd
3750	\N	Daulatpur	দৌলতপুর	daulatpurup.dinajpur.gov.bd
3751	\N	Shibnagor	শিবনগর	shibnagorup.dinajpur.gov.bd
3752	\N	Chealgazi	চেহেলগাজী	chealgaziup.dinajpur.gov.bd
3753	\N	Sundorbon	সুন্দরবন	sundorbonup.dinajpur.gov.bd
3754	\N	Fazilpur	ফাজিলপুর	fazilpurup.dinajpur.gov.bd
3755	\N	Shekpura	শেখপুরা	shekpuraup.dinajpur.gov.bd
3756	\N	Shashora	শশরা	shashoraup.dinajpur.gov.bd
3757	\N	Auliapur	আউলিয়াপুর	auliapurup.dinajpur.gov.bd
3758	\N	Uthrail	উথরাইল	uthrailup.dinajpur.gov.bd
3759	\N	Sankarpur	শংকরপুর	sankarpurup.dinajpur.gov.bd
3760	\N	Askorpur	আস্করপুর	askorpurup.dinajpur.gov.bd
3761	\N	Kamalpur	কমলপুর	kamalpurup.dinajpur.gov.bd
3762	\N	Alihat	আলীহাট	alihatup.dinajpur.gov.bd
3763	\N	Khattamadobpara	খট্টামাধবপাড়া	khattamadobparaup.dinajpur.gov.bd
3764	\N	Boalder	বোয়ালদার	boalderup.dinajpur.gov.bd
3765	\N	Alokjhari	আলোকঝাড়ী	alokjhariup.dinajpur.gov.bd
3766	\N	Bherbheri	ভেড়ভেড়ী	bherbheriup.dinajpur.gov.bd
3767	\N	Angarpara	আঙ্গারপাড়া	angarparaup.dinajpur.gov.bd
3768	\N	Goaldihi	গোয়ালডিহি	goaldihiup.dinajpur.gov.bd
3769	\N	Bhabki	ভাবকী	bhabkiup.dinajpur.gov.bd
3770	\N	Khamarpara	খামারপাড়া	khamarparaup.dinajpur.gov.bd
3771	\N	Azimpur	আজিমপুর	azimpurup.dinajpur.gov.bd
3772	\N	Farakkabad	ফরাক্কাবাদ	farakkabadup.dinajpur.gov.bd
3773	\N	Dhamoir	ধামইর	dhamoirup.dinajpur.gov.bd
3774	\N	Shohorgram	শহরগ্রাম	shohorgramup.dinajpur.gov.bd
3775	\N	Birol	বিরল	birolup.dinajpur.gov.bd
3776	\N	Bhandra	ভান্ডারা	bhandraup.dinajpur.gov.bd
3777	\N	Bijora	বিজোড়া	bijoraup.dinajpur.gov.bd
3778	\N	Dharmapur	ধর্মপুর	dharmapurup.dinajpur.gov.bd
3779	\N	Mongalpur	মঙ্গলপুর	mongalpurup.dinajpur.gov.bd
3780	\N	Ranipukur	রাণীপুকুর	ranipukurup.dinajpur.gov.bd
3781	\N	Rajarampur	রাজারামপুর	rajarampurup.dinajpur.gov.bd
3782	\N	Nashratpur	নশরতপুর	nashratpurup.dinajpur.gov.bd
3783	\N	Satnala	সাতনালা	satnalaup.dinajpur.gov.bd
3784	\N	Fatejangpur	ফতেজংপুর	fatejangpurup.dinajpur.gov.bd
3785	\N	Isobpur	ইসবপুর	isobpurup.dinajpur.gov.bd
3786	\N	Abdulpur	আব্দুলপুর	abdulpurup.dinajpur.gov.bd
3787	\N	Amarpur	অমরপুর	amarpurup.dinajpur.gov.bd
3788	\N	Auliapukur	আউলিয়াপুকুর	auliapukurup.dinajpur.gov.bd
3789	\N	Saitara	সাইতারা	saitaraup.dinajpur.gov.bd
3790	\N	Viail	ভিয়াইল	viailup.dinajpur.gov.bd
3791	\N	Punotti	পুনট্টি	punottiup.dinajpur.gov.bd
3792	\N	Tetulia	তেতুলিয়া	tetuliaup.dinajpur.gov.bd
3793	\N	Alokdihi	আলোকডিহি	alokdihiup.dinajpur.gov.bd
3794	\N	Rajpur	রাজপুর	rajpurup.lalmonirhat.gov.bd
3795	\N	Harati	হারাটি	haratiup.lalmonirhat.gov.bd
3796	\N	Mogolhat	মোগলহাট	mogolhatup.lalmonirhat.gov.bd
3797	\N	Gokunda	গোকুন্ডা	gokundaup.lalmonirhat.gov.bd
3798	\N	Barobari	বড়বাড়ী	barobariup.lalmonirhat.gov.bd
3799	\N	Kulaghat	কুলাঘাট	kulaghatup.lalmonirhat.gov.bd
3800	\N	Mohendranagar	মহেন্দ্রনগর	mohendranagarup.lalmonirhat.gov.bd
3801	\N	Khuniagachh	খুনিয়াগাছ	khuniagachhup.lalmonirhat.gov.bd
3802	\N	Panchagram	পঞ্চগ্রাম	panchagramup.lalmonirhat.gov.bd
3803	\N	Bhotmari	ভোটমারী	bhotmariup.lalmonirhat.gov.bd
3804	\N	Modati	মদাতী	modatiup.lalmonirhat.gov.bd
3805	\N	Dologram	দলগ্রাম	dologramup.lalmonirhat.gov.bd
3806	\N	Tushbhandar	তুষভান্ডার	tushbhandarup.lalmonirhat.gov.bd
3807	\N	Goral	গোড়ল	goralup.lalmonirhat.gov.bd
3808	\N	Chondropur	চন্দ্রপুর	chondropurup.lalmonirhat.gov.bd
3809	\N	Cholbola	চলবলা	cholbolaup.lalmonirhat.gov.bd
3810	\N	Kakina	কাকিনা	kakinaup.lalmonirhat.gov.bd
3811	\N	Barokhata	বড়খাতা	barokhataup.lalmonirhat.gov.bd
3812	\N	Goddimari	গড্ডিমারী	goddimariup.lalmonirhat.gov.bd
3813	\N	Singimari	সিংগীমারী	singimariup.lalmonirhat.gov.bd
3814	\N	Tongvhanga	টংভাঙ্গা	tongvhangaup.lalmonirhat.gov.bd
3815	\N	Sindurna	সিন্দুর্ণা	sindurnaup.lalmonirhat.gov.bd
3816	\N	Paticapara	পাটিকাপাড়া	paticaparaup.lalmonirhat.gov.bd
3817	\N	Nowdabas	নওদাবাস	nowdabasup.lalmonirhat.gov.bd
3818	\N	Gotamari	গোতামারী	gotamariup.lalmonirhat.gov.bd
3819	\N	Vhelaguri	ভেলাগুড়ি	vhelaguriup.lalmonirhat.gov.bd
3820	\N	Shaniajan	সানিয়াজান	shaniajanup.lalmonirhat.gov.bd
3821	\N	Fakirpara	ফকিরপাড়া	fakirparaup.lalmonirhat.gov.bd
3822	\N	Dawabari	ডাউয়াবাড়ী	dawabariup.lalmonirhat.gov.bd
3823	\N	Sreerampur	শ্রীরামপুর	sreerampurup.lalmonirhat.gov.bd
3824	\N	Patgram	পাটগ্রাম	patgramup.lalmonirhat.gov.bd
3825	\N	Jagatber	জগতবেড়	jagatberup.lalmonirhat.gov.bd
3826	\N	Kuchlibari	কুচলিবাড়ী	kuchlibariup.lalmonirhat.gov.bd
3827	\N	Jongra	জোংড়া	jongraup.lalmonirhat.gov.bd
3828	\N	Baura	বাউড়া	bauraup.lalmonirhat.gov.bd
3829	\N	Dahagram	দহগ্রাম	dahagramup.lalmonirhat.gov.bd
3830	\N	Burimari	বুড়িমারী	burimariup.lalmonirhat.gov.bd
3831	\N	Bhelabari	ভেলাবাড়ী	bhelabariup.lalmonirhat.gov.bd
3832	\N	Bhadai	ভাদাই	bhadaiup.lalmonirhat.gov.bd
3833	\N	Kamlabari	কমলাবাড়ী	kamlabariup.lalmonirhat.gov.bd
3834	\N	Durgapur	দূর্গাপুর	durgapurup.lalmonirhat.gov.bd
3835	\N	Sarpukur	সারপুকুর	sarpukurup.lalmonirhat.gov.bd
3836	\N	Saptibari	সাপ্টিবাড়ী	saptibariup.lalmonirhat.gov.bd
3837	\N	Palashi	পলাশী	palashiup.lalmonirhat.gov.bd
3838	\N	Mohishkhocha	মহিষখোচা	mohishkhochaup.lalmonirhat.gov.bd
3839	\N	Kamarpukur	কামারপুকুর	kamarpukurup.nilphamari.gov.bd
3840	\N	Kasiram Belpukur	কাশিরাম বেলপুকুর	kasirambelpukurup.nilphamari.gov.bd
3841	\N	Bangalipur	বাঙ্গালীপুর	bangalipur.nilphamari.gov.bd
3842	\N	Botlagari	বোতলাগাড়ী	botlagariup.nilphamari.gov.bd
3843	\N	Khata Madhupur	খাতা মধুপুর	khatamadhupurup.nilphamari.gov.bd
3844	\N	Gomnati	গোমনাতি	gomnati.nilphamari.gov.bd
3845	\N	Bhogdaburi	ভোগডাবুড়ী	bhogdaburiup.nilphamari.gov.bd
3846	\N	Ketkibari	কেতকীবাড়ী	ketkibariup.nilphamari.gov.bd
3847	\N	Jorabari	জোড়াবাড়ী	jorabariup.nilphamari.gov.bd
3848	\N	Bamunia	বামুনীয়া	bamuniaup.nilphamari.gov.bd
3849	\N	Panga Motukpur	পাংগা মটকপুর	pangamotukpurup.nilphamari.gov.bd
3850	\N	Boragari	বোড়াগাড়ী	boragariup.nilphamari.gov.bd
3851	\N	Domar	ডোমার	domarup.nilphamari.gov.bd
3852	\N	Sonaray	সোনারায়	sonarayup2.nilphamari.gov.bd
3853	\N	Harinchara	হরিণচরা	harincharaup.nilphamari.gov.bd
3854	\N	Paschim Chhatnay	পশ্চিম ছাতনাই	paschimchhatnayup.nilphamari.gov.bd
3855	\N	Balapara	বালাপাড়া	balaparaup.nilphamari.gov.bd
3856	\N	Dimla Sadar	ডিমলা সদর	dimlasadarup.nilphamari.gov.bd
3857	\N	Khogakharibari	খগা খড়িবাড়ী	khogakharibariup.nilphamari.gov.bd
3858	\N	Gayabari	গয়াবাড়ী	gayabariup.nilphamari.gov.bd
3859	\N	Noutara	নাউতারা	noutaraup.nilphamari.gov.bd
3860	\N	Khalisha Chapani	খালিশা চাপানী	khalishachapaniup.nilphamari.gov.bd
3861	\N	Jhunagach Chapani	ঝুনাগাছ চাপানী	jhunagachhchapaniup.nilphamari.gov.bd
3862	\N	Tepa Khribari	টেপা খরীবাড়ী	tepakhribariup.nilphamari.gov.bd
3863	\N	Purba Chhatnay	পুর্ব ছাতনাই	purbachhatnayup.nilphamari.gov.bd
3864	\N	Douabari	ডাউয়াবাড়ী	douabariup.nilphamari.gov.bd
3865	\N	Golmunda	গোলমুন্ডা	golmunda.nilphamari.gov.bd
3866	\N	Balagram	বালাগ্রাম	balagram.nilphamari.gov.bd
3867	\N	Golna	গোলনা	golna.nilphamari.gov.bd
3868	\N	Dharmapal	ধর্মপাল	dharmapal.nilphamari.gov.bd
3869	\N	Simulbari	শিমুলবাড়ী	simulbari.nilphamari.gov.bd
3870	\N	Mirganj	মীরগঞ্জ	mirganj.nilphamari.gov.bd
3871	\N	Kathali	কাঠালী	kathaliup.nilphamari.gov.bd
3872	\N	Khutamara	খুটামারা	khutamaraup.nilphamari.gov.bd
3873	\N	Shaulmari	শৌলমারী	shaulmariup.nilphamari.gov.bd
3874	\N	Kaimari	কৈমারী	kaimariup.nilphamari.gov.bd
3875	\N	Barabhita	বড়ভিটা	barabhitaup.nilphamari.gov.bd
3876	\N	Putimari	পুটিমারী	putimariup.nilphamari.gov.bd
3877	\N	Nitai	নিতাই	nitaiup.nilphamari.gov.bd
3878	\N	Bahagili	বাহাগিলি	bahagiliup.nilphamari.gov.bd
3879	\N	Chandkhana	চাঁদখানা	chandkhanaup.nilphamari.gov.bd
3880	\N	Kishoreganj	কিশোরগঞ্জ	kishoreganjup.nilphamari.gov.bd
3881	\N	Ranachandi	রনচন্ডি	ranachandiup.nilphamari.gov.bd
3882	\N	Garagram	গাড়াগ্রাম	garagramup.nilphamari.gov.bd
3883	\N	Magura	মাগুরা	maguraup.nilphamari.gov.bd
3884	\N	Chaora Bargacha	চওড়া বড়গাছা	chaorabargachaup.nilphamari.gov.bd
3885	\N	Gorgram	গোড়গ্রাম	gorgramup.nilphamari.gov.bd
3886	\N	Khoksabari	খোকসাবাড়ী	khoksabariup.nilphamari.gov.bd
3887	\N	Palasbari	পলাশবাড়ী	palasbariup.nilphamari.gov.bd
3888	\N	Ramnagar	রামনগর	ramnagarup.nilphamari.gov.bd
3889	\N	Kachukata	কচুকাটা	kachukataup.nilphamari.gov.bd
3890	\N	Panchapukur	পঞ্চপুকুর	panchapukurup.nilphamari.gov.bd
3891	\N	Itakhola	ইটাখোলা	itakholaup.nilphamari.gov.bd
3892	\N	Kundapukur	কুন্দপুকুর	kundapukur.nilphamari.gov.bd
3893	\N	Sonaray	সোনারায়	sonaray.nilphamari.gov.bd
3894	\N	Songalsi	সংগলশী	songalsiup.nilphamari.gov.bd
3895	\N	Charaikhola	চড়াইখোলা	charaikhola.nilphamari.gov.bd
3896	\N	Chapra Sarnjami	চাপড়া সরঞ্জানী	chaprasarnjami.nilphamari.gov.bd
3897	\N	Lakshmicha	লক্ষ্মীচাপ	lakshmichapup.nilphamari.gov.bd
3898	\N	Tupamari	টুপামারী	tupamariup.nilphamari.gov.bd
3899	\N	Rasulpur	রসুলপুর	rasulpurup.gaibandha.gov.bd
3900	\N	Noldanga	নলডাঙ্গা	noldangaup.gaibandha.gov.bd
3901	\N	Damodorpur	দামোদরপুর	damodorpurup.gaibandha.gov.bd
3902	\N	Jamalpur	জামালপুর	jamalpurup.gaibandha.gov.bd
3903	\N	Faridpur	ফরিদপুর	faridpurup.gaibandha.gov.bd
3904	\N	Dhaperhat	ধাপেরহাট	dhaperhatup.gaibandha.gov.bd
3905	\N	Idilpur	ইদিলপুর	idilpurup.gaibandha.gov.bd
3906	\N	Vatgram	ভাতগ্রাম	vatgramup.gaibandha.gov.bd
3907	\N	Bongram	বনগ্রাম	bongramup.gaibandha.gov.bd
3908	\N	Kamarpara	কামারপাড়া	kamarparaup.gaibandha.gov.bd
3909	\N	Khodkomor	খোদকোমরপুর	khodkomorup.gaibandha.gov.bd
3910	\N	Laxmipur	লক্ষ্মীপুর	laxmipurup.gaibandha.gov.bd
3911	\N	Malibari	মালীবাড়ী	malibariup.gaibandha.gov.bd
3912	\N	Kuptola	কুপতলা	kuptolaup.gaibandha.gov.bd
3913	\N	Shahapara	সাহাপাড়া	shahaparaup.gaibandha.gov.bd
3914	\N	Ballamjhar	বল্লমঝাড়	ballamjharup.gaibandha.gov.bd
3915	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.gaibandha.gov.bd
3916	\N	Badiakhali	বাদিয়াখালী	badiakhaliup.gaibandha.gov.bd
3917	\N	Boali	বোয়ালী	boaliup.gaibandha.gov.bd
3918	\N	Ghagoa	ঘাগোয়া	ghagoaup.gaibandha.gov.bd
3919	\N	Gidari	গিদারী	gidariup.gaibandha.gov.bd
3920	\N	Kholahati	খোলাহাটী	kholahatiup.gaibandha.gov.bd
3921	\N	Mollarchar	মোল্লারচর	mollarcharup.gaibandha.gov.bd
3922	\N	Kamarjani	কামারজানি	kamarjaniup.gaibandha.gov.bd
3923	\N	Kishoregari	কিশোরগাড়ী	kishoregariup.gaibandha.gov.bd
3924	\N	Hosenpur	হোসেনপুর	hosenpurup.gaibandha.gov.bd
3925	\N	Palashbari	পলাশবাড়ী	palashbariup.gaibandha.gov.bd
3926	\N	Barisal	বরিশাল	barisalup.gaibandha.gov.bd
3927	\N	Mohdipur	মহদীপুর	mohdipurup.gaibandha.gov.bd
3928	\N	Betkapa	বেতকাপা	betkapaup.gaibandha.gov.bd
3929	\N	Pobnapur	পবনাপুর	pobnapurup.gaibandha.gov.bd
3930	\N	Monohorpur	মনোহরপুর	monohorpurup.gaibandha.gov.bd
3931	\N	Harinathpur	হরিণাথপুর	harinathpurup.gaibandha.gov.bd
3932	\N	Padumsahar	পদুমশহর	padumsaharup.gaibandha.gov.bd
3933	\N	Varotkhali	ভরতখালী	varotkhaliup.gaibandha.gov.bd
3934	\N	Saghata	সাঘাটা	saghataup.gaibandha.gov.bd
3935	\N	Muktinagar	মুক্তিনগর	muktinagarup.gaibandha.gov.bd
3936	\N	Kachua	কচুয়া	kachuaup.gaibandha.gov.bd
3937	\N	Ghuridah	ঘুরিদহ	ghuridahup.gaibandha.gov.bd
3938	\N	Holdia	হলদিয়া	holdiaup.gaibandha.gov.bd
3939	\N	Jumarbari	জুমারবাড়ী	jumarbariup.gaibandha.gov.bd
3940	\N	Kamalerpara	কামালেরপাড়া	kamalerparaup.gaibandha.gov.bd
3941	\N	Bonarpara	বোনারপাড়া	bonarparaup.gaibandha.gov.bd
3942	\N	Kamdia	কামদিয়া	kamdiaup.gaibandha.gov.bd
3943	\N	Katabari	কাটাবাড়ী	katabariup.gaibandha.gov.bd
3944	\N	Shakhahar	শাখাহার	shakhaharup.gaibandha.gov.bd
3945	\N	Rajahar	রাজাহার	rajaharup.gaibandha.gov.bd
3946	\N	Sapmara	সাপমারা	sapmaraup.gaibandha.gov.bd
3947	\N	Dorbosto	দরবস্ত ইয়নিয়ন	dorbostoup.gaibandha.gov.bd
3948	\N	Talukkanupur	তালুককানুপুর	talukkanupurup.gaibandha.gov.bd
3949	\N	Nakai	নাকাই	nakaiup.gaibandha.gov.bd
3950	\N	Harirampur	হরিরামপুর	harirampurup.gaibandha.gov.bd
3951	\N	Rakhalburuj	রাখালবুরুজ	rakhalburujup.gaibandha.gov.bd
3952	\N	Phulbari	ফুলবাড়ী	phulbariup.gaibandha.gov.bd
3953	\N	Gumaniganj	গুমানীগঞ্জ	gumaniganjup.gaibandha.gov.bd
3954	\N	Kamardoho	কামারদহ	kamardohoup.gaibandha.gov.bd
3955	\N	Kochasahar	কোচাশহর	kochasaharup.gaibandha.gov.bd
3956	\N	Shibpur	শিবপুর	shibpurup.gaibandha.gov.bd
3957	\N	Mahimaganj	মহিমাগঞ্জ	mahimaganjup.gaibandha.gov.bd
3958	\N	Shalmara	শালমারা	shalmaraup.gaibandha.gov.bd
3959	\N	Bamondanga	বামনডাঙ্গা	bamondangaup.gaibandha.gov.bd
3960	\N	Sonaroy	সোনারায়	sonaroyup.gaibandha.gov.bd
3961	\N	Tarapur	তারাপুর	tarapurup.gaibandha.gov.bd
3962	\N	Belka	বেলকা	belkaup.gaibandha.gov.bd
3963	\N	Dohbond	দহবন্দ	dohbondup.gaibandha.gov.bd
3964	\N	Sorbanondo	সর্বানন্দ	sorbanondoup.gaibandha.gov.bd
3965	\N	Ramjibon	রামজীবন	ramjibonup.gaibandha.gov.bd
3966	\N	Dhopadanga	ধোপাডাঙ্গা	dhopadangaup.gaibandha.gov.bd
3967	\N	Chaporhati	ছাপরহাটী	chaporhatiup.gaibandha.gov.bd
3968	\N	Shantiram	শান্তিরাম	shantiramup.gaibandha.gov.bd
3969	\N	Konchibari	কঞ্চিবাড়ী	konchibariup.gaibandha.gov.bd
3970	\N	Sreepur	শ্রীপুর	sreepurup.gaibandha.gov.bd
3971	\N	Chandipur	চন্ডিপুর	chandipurup.gaibandha.gov.bd
3972	\N	Kapasia	কাপাসিয়া	kapasiaup.gaibandha.gov.bd
3973	\N	Haripur	হরিপুর	haripurup.gaibandha.gov.bd
3974	\N	Kanchipara	কঞ্চিপাড়া	kanchiparaup.gaibandha.gov.bd
3975	\N	Uria	উড়িয়া	uriaup.gaibandha.gov.bd
3976	\N	Udakhali	উদাখালী	udakhaliup.gaibandha.gov.bd
3977	\N	Gazaria	গজারিয়া	gazariaup.gaibandha.gov.bd
3978	\N	Phulchari	ফুলছড়ি	phulchariup.gaibandha.gov.bd
3979	\N	Erendabari	এরেন্ডাবাড়ী	erendabariup.gaibandha.gov.bd
3980	\N	Fazlupur	ফজলুপুর	fazlupurup.gaibandha.gov.bd
3981	\N	Ruhea	রুহিয়া	ruheaup.thakurgaon.gov.bd
3982	\N	Akhanagar	আখানগর	akhanagarup.thakurgaon.gov.bd
3983	\N	Ahcha	আকচা	ahchaup.thakurgaon.gov.bd
3984	\N	Baragaon	বড়গাঁও	baragaonup.thakurgaon.gov.bd
3985	\N	Balia	বালিয়া	baliaup.thakurgaon.gov.bd
3986	\N	Auliapur	আউলিয়াপুর	auliapurup.thakurgaon.gov.bd
3987	\N	Chilarang	চিলারং	chilarangup.thakurgaon.gov.bd
3988	\N	Rahimanpur	রহিমানপুর	rahimanpurup.thakurgaon.gov.bd
3989	\N	Roypur	রায়পুর	roypurup.thakurgaon.gov.bd
3990	\N	Jamalpur	জামালপুর	jamalpurup.thakurgaon.gov.bd
3991	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.thakurgaon.gov.bd
3992	\N	Salandar	সালন্দর	salandarup.thakurgaon.gov.bd
3993	\N	Gareya	গড়েয়া	gareyaup.thakurgaon.gov.bd
3994	\N	Rajagaon	রাজাগাঁও	rajagaonup.thakurgaon.gov.bd
3995	\N	Debipur	দেবীপুর	debipurup.thakurgaon.gov.bd
3996	\N	Nargun	নারগুন	nargunup.thakurgaon.gov.bd
3997	\N	Jagannathpur	জগন্নাথপুর	jagannathpurup.thakurgaon.gov.bd
3998	\N	Sukhanpukhari	শুখানপুকুরী	sukhanpukhariup.thakurgaon.gov.bd
3999	\N	Begunbari	বেগুনবাড়ী	begunbariup.thakurgaon.gov.bd
4000	\N	Ruhia Pashchim	রুহিয়া পশ্চিম	ruhiapashchimup.thakurgaon.gov.bd
4001	\N	Dholarhat	ঢোলারহাট	dholarhatup.thakurgaon.gov.bd
4002	\N	Bhomradaha	ভোমরাদহ	bhomradahaup.thakurgaon.gov.bd
4003	\N	Kosharaniganj	কোষারাণীগঞ্জ	kosharaniganjup.thakurgaon.gov.bd
4004	\N	Khangaon	খনগাঁও	khangaonup.thakurgaon.gov.bd
4005	\N	Saidpur	সৈয়দপুর	saidpurup.thakurgaon.gov.bd
4006	\N	Pirganj	পীরগঞ্জ	pirganjup.thakurgaon.gov.bd
4007	\N	Hajipur	হাজীপুর	hajipurup.thakurgaon.gov.bd
4008	\N	Daulatpur	দৌলতপুর	daulatpurup.thakurgaon.gov.bd
4009	\N	Sengaon	সেনগাঁও	sengaonup.thakurgaon.gov.bd
4010	\N	Jabarhat	জাবরহাট	jabarhatup.thakurgaon.gov.bd
4011	\N	Bairchuna	বৈরচুনা	bairchunaup.thakurgaon.gov.bd
4012	\N	Dhormogarh	ধর্মগড়	dhormogarhup.thakurgaon.gov.bd
4013	\N	Nekmorod	নেকমরদ	nekmorodup.thakurgaon.gov.bd
4014	\N	Hosengaon	হোসেনগাঁও	hosengaonup.thakurgaon.gov.bd
4015	\N	Lehemba	লেহেম্বা	lehembaup.thakurgaon.gov.bd
4016	\N	Bachor	বাচোর	bachorup.thakurgaon.gov.bd
4017	\N	Kashipur	কাশিপুর	kashipurup.thakurgaon.gov.bd
4018	\N	Ratore	রাতোর	ratoreup.thakurgaon.gov.bd
4019	\N	Nonduar	নন্দুয়ার	nonduarup.thakurgaon.gov.bd
4020	\N	Gedura	গেদুড়া	geduraup.thakurgaon.gov.bd
4021	\N	Amgaon	আমগাঁও	amgaonup.thakurgaon.gov.bd
4022	\N	Bakua	বকুয়া	bakuaup.thakurgaon.gov.bd
4023	\N	Dangipara	ডাঙ্গীপাড়া	dangiparaup.thakurgaon.gov.bd
4024	\N	Haripur	হরিপুর	haripurup.thakurgaon.gov.bd
4025	\N	Bhaturia	ভাতুরিয়া	bhaturiaup.thakurgaon.gov.bd
4026	\N	Paria	পাড়িয়া	pariaup.thakurgaon.gov.bd
4027	\N	Charol	চারোল	charolup.thakurgaon.gov.bd
4028	\N	Dhontola	ধনতলা	dhontolaup.thakurgaon.gov.bd
4029	\N	Boropalashbari	বড়পলাশবাড়ী	boropalashbariup.thakurgaon.gov.bd
4030	\N	Duosuo	দুওসুও	duosuoup.thakurgaon.gov.bd
4031	\N	Vanor	ভানোর	vanorup.thakurgaon.gov.bd
4032	\N	Amjankhore	আমজানখোর	amjankhoreup.thakurgaon.gov.bd
4033	\N	Borobari	বড়বাড়ী	borobariup.thakurgaon.gov.bd
4034	\N	Mominpur	মমিনপুর	mominpurup.rangpur.gov.bd
4035	\N	Horidebpur	হরিদেবপুর	horidebpurup.rangpur.gov.bd
4036	\N	Uttam	উত্তম	uttamup.rangpur.gov.bd
4037	\N	Porshuram	পরশুরাম	porshuramup.rangpur.gov.bd
4038	\N	Topodhan	তপোধন	topodhanup.rangpur.gov.bd
4039	\N	Satgara	সাতগারা	satgaraup.rangpur.gov.bd
4040	\N	Rajendrapur	রাজেন্দ্রপুর	rajendrapurup.rangpur.gov.bd
4041	\N	Sadwapuskoroni	সদ্যপুস্করনী	sadwapuskoroniup.rangpur.gov.bd
4042	\N	Chandanpat	চন্দনপাট	chandanpatup.rangpur.gov.bd
4043	\N	Dorshona	দর্শানা	dorshonaup.rangpur.gov.bd
4044	\N	Tampat	তামপাট	tampatup.rangpur.gov.bd
4045	\N	Betgari	বেতগাড়ী	betgariup.rangpur.gov.bd
4046	\N	Kholeya	খলেয়া	kholeyaup.rangpur.gov.bd
4047	\N	Borobil	বড়বিল	borobilup.rangpur.gov.bd
4048	\N	Kolcondo	কোলকোন্দ	kolcondoup.rangpur.gov.bd
4049	\N	Gongachora	গংগাচড়া	gongachoraup.rangpur.gov.bd
4050	\N	Gojoghonta	গজঘন্টা	gojoghontaup.rangpur.gov.bd
4051	\N	Morneya	মর্ণেয়া	morneyaup.rangpur.gov.bd
4052	\N	Alambiditor	আলমবিদিতর	alambiditorup.rangpur.gov.bd
4053	\N	Lakkhitari	লক্ষীটারী	lakkhitariup.rangpur.gov.bd
4054	\N	Nohali	নোহালী	nohaliup.rangpur.gov.bd
4055	\N	Kurshatara	কুর্শা	kurshataraup.rangpur.gov.bd
4056	\N	Alampur	আলমপুর	alampurup.rangpur.gov.bd
4057	\N	Soyar	সয়ার	soyarup.rangpur.gov.bd
4058	\N	Ikorchali	ইকরচালী	ikorchaliup.rangpur.gov.bd
4059	\N	Hariarkuthi	হাড়িয়ারকুঠি	hariarkuthiup.rangpur.gov.bd
4060	\N	Radhanagar	রাধানগর	radhanagarup.rangpur.gov.bd
4061	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.rangpur.gov.bd
4062	\N	Modhupur	মধুপুর	modhupurup.rangpur.gov.bd
4063	\N	Kutubpur	কুতুবপুর	kutubpurup.ranpur.gov.bd
4064	\N	Bishnapur	বিষ্ণপুর	bishnapurup.rangpur.gov.bd
4065	\N	Kalupara	কালুপাড়া	kaluparaup.rangpur.gov.bd
4066	\N	Lohanipara	লোহানীপাড়া	lohaniparaup.rangpur.gov.bd
4067	\N	Gopalpur	গোপালপুর	gopalpurup.rangpur.gov.bd
4068	\N	Damodorpur	দামোদরপুর	damodorpurup.rangpur.gov.bd
4069	\N	Ramnathpurupb	রামনাথপুর	ramnathpurupb.rangpur.gov.bd
4070	\N	Khoragach	খোরাগাছ	khoragachup.rangpur.gov.bd
4071	\N	Ranipukur	রাণীপুকুর	ranipukurup.rangpur.gov.bd
4072	\N	Payrabond	পায়রাবন্দ	payrabondup.rangpur.gov.bd
4073	\N	Vangni	ভাংনী	vangniup.rangpur.gov.bd
4074	\N	Balarhat	বালারহাট	balarhatup.rangpur.gov.bd
4075	\N	Kafrikhal	কাফ্রিখাল	kafrikhalup.rangpur.gov.bd
4076	\N	Latibpur	লতিবপুর	latibpurup.rangpur.gov.bd
4077	\N	Chengmari	চেংমারী	chengmariup.rangpur.gov.bd
4078	\N	Moyenpur	ময়েনপুর	moyenpurup.rangpur.gov.bd
4079	\N	Baluya Masimpur	বালুয়া মাসিমপুর	baluyamasimpurup.rangpur.gov.bd
4080	\N	Borobala	বড়বালা	borobalaup.rangpur.gov.bd
4081	\N	Mirzapur	মির্জাপুর	mirzapurup.rangpur.gov.bd
4082	\N	Imadpur	ইমাদপুর	imadpurup.rangpur.gov.bd
4083	\N	Milonpur	মিলনপুর	milonpurup.rangpur.gov.bd
4084	\N	Mgopalpur	গোপালপুর	mgopalpurup.rangpur.gov.bd
4085	\N	Durgapur	দূর্গাপুর	durgapurup.rangpur.gov.bd
4086	\N	Boro Hazratpur	বড় হযরতপুর	borohazratpurup.rangpur.gov.bd
4087	\N	Chattracol	চৈত্রকোল	chattracolup.rangpur.gov.bd
4088	\N	Vendabari	ভেন্ডাবাড়ী	vendabariup.rangpur.gov.bd
4089	\N	Borodargah	বড়দরগাহ	borodargahup.rangpur.gov.bd
4090	\N	Kumedpur	কুমেদপুর	kumedpurup.rangpur.gov.bd
4091	\N	Modankhali	মদনখালী	modankhaliup.rangpur.gov.bd
4092	\N	Tukuria	টুকুরিয়া	tukuriaup.rangpur.gov.bd
4093	\N	Boro Alampur	বড় আলমপুর	boroalampurup.rangpur.gov.bd
4094	\N	Raypur	রায়পুর	raypurup.rangpur.gov.bd
4095	\N	Pirgonj	পীরগঞ্জ	pirgonjup.rangpur.gov.bd
4096	\N	Shanerhat	শানেরহাট	shanerhatup.rangpur.gov.bd
4097	\N	Mithipur	মিঠিপুর	mithipurup.rangpur.gov.bd
4098	\N	Ramnathpur	রামনাথপুর	ramnathpurup1.rangpur.gov.bd
4099	\N	Chattra	চতরা	chattraup.rangpur.gov.bd
4100	\N	Kabilpur	কাবিলপুর	kabilpurup.rangpur.gov.bd
4101	\N	Pachgachi	পাঁচগাছী	pachgachiup.rangpur.gov.bd
4102	\N	Sarai	সারাই	saraiup.rangpur.gov.bd
4103	\N	Balapara	বালাপাড়া	balaparaup.rangpur.gov.bd
4104	\N	Shahidbag	শহীদবাগ	shahidbagup.rangpur.gov.bd
4105	\N	Haragach	হারাগাছ	haragachup.rangpur.gov.bd
4106	\N	Tepamodhupur	টেপামধুপুর	tepamodhupurup.rangpur.gov.bd
4107	\N	Kurshaupk	কুর্শা	kurshaupk.rangpur.gov.bd
4108	\N	Kollyani	কল্যাণী	kollyaniup.rangpur.gov.bd
4109	\N	Parul	পারুল	parulup.rangpur.gov.bd
4110	\N	Itakumari	ইটাকুমারী	itakumariup.rangpur.gov.bd
4111	\N	Saula	ছাওলা	saulaup.rangpur.gov.bd
4112	\N	Kandi	কান্দি	kandiup.rangpur.gov.bd
4113	\N	Pirgacha	পীরগাছা	pirgachaup.rangpur.gov.bd
4114	\N	Annodanagar	অন্নদানগর	annodanagarup.rangpur.gov.bd
4115	\N	Tambulpur	তাম্বুলপুর	tambulpurup.rangpur.gov.bd
4116	\N	Koikuri	কৈকুড়ী	koikuriup.rangpur.gov.bd
4117	\N	Holokhana	হলোখানা	holokhanaup.kurigram.gov.bd
4118	\N	Ghogadhoh	ঘোগাদহ	ghogadhohup.kurigram.gov.bd
4119	\N	Belgacha	বেলগাছা	belgachaup.kurigram.gov.bd
4120	\N	Mogolbasa	মোগলবাসা	mogolbasaup.kurigram.gov.bd
4121	\N	Panchgachi	পাঁচগাছি	panchgachiup.kurigram.gov.bd
4122	\N	Jatrapur	যাত্রাপুর	jatrapurup.kurigram.gov.bd
4123	\N	Kanthalbari	কাঁঠালবাড়ী	kanthalbariup.kurigram.gov.bd
4124	\N	Bhogdanga	ভোগডাঙ্গা	bhogdangaup.kurigram.gov.bd
4125	\N	Ramkhana	রামখানা	ramkhanaup.kurigram.gov.bd
4126	\N	Raigonj	রায়গঞ্জ	raigonjup.kurigram.gov.bd
4127	\N	Bamondanga	বামনডাঙ্গা	bamondangaup.kurigram.gov.bd
4128	\N	Berubari	বেরুবাড়ী	berubariup.kurigram.gov.bd
4129	\N	Sontaspur	সন্তোষপুর	sontaspurup.kurigram.gov.bd
4130	\N	Hasnabad	হাসনাবাদ	hasnabadup.kurigram.gov.bd
4131	\N	Newyashi	নেওয়াশী	newyashiup.kurigram.gov.bd
4132	\N	Bhitorbond	ভিতরবন্দ	bhitorbondup.kurigram.gov.bd
4133	\N	Kaligonj	কালীগঞ্জ	kaligonjup.kurigram.gov.bd
4134	\N	Noonkhawa	নুনখাওয়া	noonkhawaup.kurigram.gov.bd
4135	\N	Narayanpur	নারায়নপুর	narayanpurup.kurigram.gov.bd
4136	\N	Kedar	কেদার	kedarup.kurigram.gov.bd
4137	\N	Kachakata	কঁচাকাঁটা	kachakataup.kurigram.gov.bd
4138	\N	Bollobherkhas	বল্লভেরখাস	bollobherkhasup.kurigram.gov.bd
4139	\N	Pathordubi	পাথরডুবি	pathordubiup.kurigram.gov.bd
4140	\N	Shilkhuri	শিলখুড়ি	shilkhuriup.kurigram.gov.bd
4141	\N	Tilai	তিলাই	tilaiup.kurigram.gov.bd
4142	\N	Paikarchara	পাইকেরছড়া	paikarcharaup.kurigram.gov.bd
4143	\N	Bhurungamari	ভূরুঙ্গামারী	bhurungamariup.kurigram.gov.bd
4144	\N	Joymonirhat	জয়মনিরহাট	joymonirhatup.kurigram.gov.bd
4145	\N	Andharirjhar	আন্ধারীরঝাড়	andharirjharup.kurigram.gov.bd
4146	\N	Char-Bhurungamari	চর-ভূরুঙ্গামারী	charbhurungamariup.kurigram.gov.bd
4147	\N	Bangasonahat	বঙ্গসোনাহাট	bangasonahatup.kurigram.gov.bd
4148	\N	Boldia	বলদিয়া	boldiaup.kurigram.gov.bd
4149	\N	Nawdanga	নাওডাঙ্গা	nawdangaup.kurigram.gov.bd
4150	\N	Shimulbari	শিমুলবাড়ী	shimulbariup.kurigram.gov.bd
4151	\N	Phulbari	ফুলবাড়ী	phulbariup.kurigram.gov.bd
4152	\N	Baravita	বড়ভিটা	baravitaup.kurigram.gov.bd
4153	\N	Bhangamor	ভাঙ্গামোড়	bhangamorup.kurigram.gov.bd
4154	\N	Kashipur	কাশিপুর	kashipurup.kurigram.gov.bd
4155	\N	Chinai	ছিনাই	chinaiup.kurigram.gov.bd
4156	\N	Rajarhat	রাজারহাট	rajarhatup.kurigram.gov.bd
4157	\N	Nazimkhan	নাজিমখাঁন	nazimkhanup.kurigram.gov.bd
4158	\N	Gharialdanga	ঘড়িয়ালডাঙ্গা	gharialdangaup.kurigram.gov.bd
4159	\N	Chakirpashar	চাকিরপশার	chakirpasharup.kurigram.gov.bd
4160	\N	Biddanondo	বিদ্যানন্দ	biddanondoup.kurigram.gov.bd
4161	\N	Umarmajid	উমর মজিদ	umarmajidup.kurigram.gov.bd
4162	\N	Daldalia	দলদলিয়া	daldaliaup.kurigram.gov.bd
4163	\N	Durgapur	দুর্গাপুর	durgapurup.kurigram.gov.bd
4164	\N	Pandul	পান্ডুল	pandulup.kurigram.gov.bd
4165	\N	Buraburi	বুড়াবুড়ী	buraburiup.kurigram.gov.bd
4166	\N	Dharanibari	ধরণীবাড়ী	dharanibariup.kurigram.gov.bd
4167	\N	Dhamsreni	ধামশ্রেণী	dhamsreniup.kurigram.gov.bd
4168	\N	Gunaigas	গুনাইগাছ	gunaigasup.kurigram.gov.bd
4169	\N	Bazra	বজরা	bazraup.kurigram.gov.bd
4170	\N	Tobockpur	তবকপুর	tobockpurup.kurigram.gov.bd
4171	\N	Hatia	হাতিয়া	hatiaup.kurigram.gov.bd
4172	\N	Begumgonj	বেগমগঞ্জ	begumgonjup.kurigram.gov.bd
4173	\N	Shahabiar Alga	সাহেবের আলগা	shahabiaralgaup.kurigram.gov.bd
4174	\N	Thetrai	থেতরাই	thetraiup.kurigram.gov.bd
4175	\N	Ranigonj	রাণীগঞ্জ	ranigonjup.kurigram.gov.bd
4176	\N	Nayarhat	নয়ারহাট	nayarhatup.kurigram.gov.bd
4177	\N	Thanahat	থানাহাট	thanahatup.kurigram.gov.bd
4178	\N	Ramna	রমনা	ramnaup.kurigram.gov.bd
4179	\N	Chilmari	চিলমারী	chilmariup.kurigram.gov.bd
4180	\N	Austomirchar	অষ্টমীর চর	austomircharup.kurigram.gov.bd
4181	\N	Dadevanga	দাঁতভাঙ্গা	dadevangaup.kurigram.gov.bd
4182	\N	Shoulemari	শৌলমারী	shoulemariup.kurigram.gov.bd
4183	\N	Bondober	বন্দবেড়	bondoberup.kurigram.gov.bd
4184	\N	Rowmari	রৌমারী	rowmariup.kurigram.gov.bd
4185	\N	Jadurchar	যাদুরচর	jadurcharup.kurigram.gov.bd
4186	\N	Rajibpur	রাজিবপুর	rajibpurup.kurigram.gov.bd
4187	\N	Kodalkati	কোদালকাটি	kodalkatiup.kurigram.gov.bd
4188	\N	Mohongonj	মোহনগঞ্জ	mohongonjup.kurigram.gov.bd
4189	\N	Kamararchor	কামারের চর	kamararchorup.sherpur.gov.bd
4190	\N	Chorsherpur	চরশেরপুর	chorsherpurup.sherpur.gov.bd
4191	\N	Bajitkhila	বাজিতখিলা	bajitkhilaup.sherpur.gov.bd
4192	\N	Gajir Khamar	গাজির খামার	gajirkhamarup.sherpur.gov.bd
4193	\N	Dhola	ধলা	dholaup.sherpur.gov.bd
4194	\N	Pakuriya	পাকুরিয়া	pakuriyaup.sherpur.gov.bd
4195	\N	Vatshala	ভাতশালা	vatshalaup.sherpur.gov.bd
4196	\N	Losmonpur	লছমনপুর	losmonpurup.sherpur.gov.bd
4197	\N	Rouha	রৌহা	rouhaup.sherpur.gov.bd
4198	\N	Kamariya	কামারিয়া	kamariyaup.sherpur.gov.bd
4199	\N	Chor Mochoriya	চর মোচারিয়া	chormochoriyaup.sherpur.gov.bd
4200	\N	Chorpokhimari	চর পক্ষীমারি	chorpokhimariup.sherpur.gov.bd
4201	\N	Betmari Ghughurakandi	বেতমারি ঘুঘুরাকান্দি	betmarighughurakandiup.sherpur.gov.bd
4202	\N	Balairchar	বলাইরচর	balaircharup.sherpur.gov.bd
4203	\N	Puraga	পোড়াগাও	puragauup.sherpur.gov.bd
4204	\N	Nonni	নন্নী	nonniup.sherpur.gov.bd
4205	\N	Morichpuran	মরিচপুরাণ	morichpuranup.sherpur.gov.bd
4206	\N	Rajnogor	রাজনগর	rajnogorup.sherpur.gov.bd
4207	\N	Nayabil	নয়াবীল	nayabilup.sherpur.gov.bd
4208	\N	Ramchondrokura	রামচন্দ্রকুড়া	ramchondrokuraup.sherpur.gov.bd
4209	\N	Kakorkandhi	কাকরকান্দি	kakorkandhiup.sherpur.gov.bd
4210	\N	Nalitabari	নালিতাবাড়ী	nalitabariup.sherpur.gov.bd
4211	\N	Juganiya	যোগনীয়া	juganiyaup.sherpur.gov.bd
4212	\N	Bagber	বাঘবেড়	bagberup.sherpur.gov.bd
4213	\N	Koloshpar	কলসপাড়	koloshparup.sherpur.gov.bd
4214	\N	Rupnarayankura	রূপনারায়নকুড়া	rupnarayankuraup.sherpur.gov.bd
4215	\N	Ranishimul	রানীশিমুল	ranishimulup.sherpur.gov.bd
4216	\N	Singabaruna	সিংগাবরুনা	singabarunaup.sherpur.gov.bd
4217	\N	Kakilakura	কাকিলাকুড়া	kakilakuraup.sherpur.gov.bd
4218	\N	Tatihati	তাতীহাটি	tatihatiup.sherpur.gov.bd
4219	\N	Gosaipur	গোশাইপুর	gosaipurup.sherpur.gov.bd
4220	\N	Sreebordi	শ্রীবরদী	sreebordiup.sherpur.gov.bd
4221	\N	Bhelua	ভেলুয়া	bheluaup.sherpur.gov.bd
4222	\N	Kharia Kazirchar	খড়িয়া কাজিরচর	khariakazircharup.sherpur.gov.bd
4223	\N	Kurikahonia	কুড়িকাহনিয়া	kurikahoniaup.sherpur.gov.bd
4224	\N	Garjaripa	গড়জরিপা	garjaripaup.sherpur.gov.bd
4225	\N	Gonopoddi	গণপদ্দী	gonopoddiup.sherpur.gov.bd
4226	\N	Nokla	নকলা	noklaup.sherpur.gov.bd
4227	\N	Urpha	উরফা	urphaup.sherpur.gov.bd
4228	\N	Gourdwar	গৌড়দ্বার	gourdwarup.sherpur.gov.bd
4229	\N	Baneshwardi	বানেশ্বর্দী	baneshwardiup.sherpur.gov.bd
4230	\N	Pathakata	পাঠাকাটা	pathakataup.sherpur.gov.bd
4231	\N	Talki	টালকী	talkiup.sherpur.gov.bd
4232	\N	Choraustadhar	চরঅষ্টধর	choraustadharup.sherpur.gov.bd
4233	\N	Chandrakona	চন্দ্রকোনা	chandrakonaup.sherpur.gov.bd
4234	\N	Kansa	কাংশা	kansaup.sherpur.gov.bd
4235	\N	Dansail	ধানশাইল	dansailup.sherpur.gov.bd
4236	\N	Nolkura	নলকুড়া	nolkuraup.sherpur.gov.bd
4237	\N	Gouripur	গৌরিপুর	gouripurup.sherpur.gov.bd
4238	\N	Jhenaigati	ঝিনাইগাতী	jhenaigatiup.sherpur.gov.bd
4239	\N	Hatibandha	হাতিবান্দা	hatibandhaup.sherpur.gov.bd
4240	\N	Malijhikanda	মালিঝিকান্দা	malijhikandaup.sherpur.gov.bd
4241	\N	Deukhola	দেওখোলা	deukholaup.mymensingh.gov.bd
4242	\N	Naogaon	নাওগাঁও	naogaonup.mymensingh.gov.bd
4243	\N	Putijana	পুটিজানা	putijanaup.mymensingh.gov.bd
4244	\N	Kushmail	কুশমাইল	kushmailup.mymensingh.gov.bd
4245	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.mymensingh.gov.bd
4246	\N	Bakta	বাক্তা	baktaup.mymensingh.gov.bd
4247	\N	Rangamatia	রাঙ্গামাটিয়া	rangamatiaup.mymensingh.gov.bd
4248	\N	Enayetpur	এনায়েতপুর	enayetpurup.mymensingh.gov.bd
4249	\N	Kaladaha	কালাদহ	kaladahaup.mymensingh.gov.bd
4250	\N	Radhakanai	রাধাকানাই	radhakanaiup.mymensingh.gov.bd
4251	\N	Asimpatuli	আছিমপাটুলী	asimpatuliup.mymensingh.gov.bd
4252	\N	Vobanipur	ভবানীপুর	vobanipurup.mymensingh.gov.bd
4253	\N	Balian	বালিয়ান	balianup.mymensingh.gov.bd
4254	\N	Dhanikhola	ধানীখোলা	dhanikholaup.mymensingh.gov.bd
4255	\N	Bailor	বৈলর	bailorup.mymensingh.gov.bd
4256	\N	Kanthal	কাঁঠাল	kanthalup.mymensingh.gov.bd
4257	\N	Kanihari	কানিহারী	kanihariup.mymensingh.gov.bd
4258	\N	Trishal	ত্রিশাল	trishalup.mymensingh.gov.bd
4259	\N	Harirampur	হরিরামপুর	harirampurup.mymensingh.gov.bd
4260	\N	Sakhua	সাখুয়া	www.sakhuaup.mymensingh.gov.bd
4261	\N	Balipara	বালিপাড়া	baliparaup.mymensingh.gov.bd
4262	\N	Mokshapur	মোক্ষপুর	mokshapurup.mymensingh.gov.bd
4263	\N	Mathbari	মঠবাড়ী	mathbariup.mymensingh.gov.bd
4264	\N	Amirabari	আমিরাবাড়ী	amirabariup.mymensingh.gov.bd
4265	\N	Rampur	রামপুর	rampurup.mymensingh.gov.bd
4266	\N	Uthura	উথুরা	uthuraup.mymensingh.gov.bd
4267	\N	Meduari	মেদুয়ারী	meduariup.mymensingh.gov.bd
4268	\N	Varadoba	ভরাডোবা	varadobaup.mymensingh.gov.bd
4269	\N	Dhitpur	ধীতপুর	dhitpurup.mymensingh.gov.bd
4270	\N	Dakatia	ডাকাতিয়া	dakatiaup.mymensingh.gov.bd
4271	\N	Birunia	বিরুনিয়া	biruniaup.mymensingh.gov.bd
4272	\N	Bhaluka	ভালুকা	bhalukaup.mymensingh.gov.bd
4273	\N	Mallikbari	মল্লিকবাড়ী	mallikbariup.mymensingh.gov.bd
4274	\N	Kachina	কাচিনা	kachinaup.mymensingh.gov.bd
4275	\N	Habirbari	হবিরবাড়ী	habirbariup.mymensingh.gov.bd
4276	\N	Rajoi	রাজৈ	rajoiup.mymensingh.gov.bd
4277	\N	Dulla	দুল্লা	dullaup.mymensingh.gov.bd
4278	\N	Borogram	বড়গ্রাম	borogramup.mymensingh.gov.bd
4279	\N	Tarati	তারাটি	taratiup.mymensingh.gov.bd
4280	\N	Kumargata	কুমারগাতা	kumargataup.mymensingh.gov.bd
4281	\N	Basati	বাশাটি	basatiup.mymensingh.gov.bd
4282	\N	Mankon	মানকোন	mankonup.mymensingh.gov.bd
4283	\N	Ghoga	ঘোগা	ghogaup.mymensingh.gov.bd
4284	\N	Daogaon	দাওগাঁও	daogaonup.mymensingh.gov.bd
4285	\N	Kashimpur	কাশিমপুর	kashimpurup.mymensingh.gov.bd
4286	\N	Kheruajani	খেরুয়াজানী	kheruajaniup.mymensingh.gov.bd
4287	\N	Austadhar	অষ্টধার	austadharup.mymensingh.gov.bd
4288	\N	Bororchar	বোররচর	bororcharup.mymensingh.gov.bd
4289	\N	Dapunia	দাপুনিয়া	dapuniaup.mymensingh.gov.bd
4290	\N	Aqua	আকুয়া	aquaup.mymensingh.gov.bd
4291	\N	Khagdohor	খাগডহর	khagdohorup.mymensingh.gov.bd
4292	\N	Charnilaxmia	চরনিলক্ষিয়া	charnilaxmiaup.mymensingh.gov.bd
4293	\N	Kushtia	কুষ্টিয়া	kushtiaup.mymensingh.gov.bd
4294	\N	Paranganj	পরানগঞ্জ	paranganjup.mymensingh.gov.bd
4295	\N	Sirta	সিরতা	sirtaup.mymensingh.gov.bd
4296	\N	Char Ishwardia	চর ঈশ্বরদিয়া	charishwardiaup.mymensingh.gov.bd
4297	\N	Ghagra	ঘাগড়া	ghagraup.mymensingh.gov.bd
4298	\N	Vabokhali	ভাবখালী	vabokhaliup.mymensingh.gov.bd
4299	\N	Boyra	বয়ড়া	boyraup.mymensingh.gov.bd
4300	\N	Dakshin Maijpara	দক্ষিণ মাইজপাড়া	dakshinmaijparaup.mymensingh.gov.bd
4301	\N	Gamaritola	গামারীতলা	gamaritolaup.mymensingh.gov.bd
4302	\N	Dhobaura	ধোবাউড়া	dhobauraup.mymensingh.gov.bd
4303	\N	Porakandulia	পোড়াকান্দুলিয়া	porakanduliaup.mymensingh.gov.bd
4304	\N	Goatala	গোয়াতলা	goatalaup.mymensingh.gov.bd
4305	\N	Ghoshgaon	ঘোষগাঁও	ghoshgaonup.mymensingh.gov.bd
4306	\N	Baghber	বাঘবেড়	baghberup.mymensingh.gov.bd
4307	\N	Rambhadrapur	রামভদ্রপুর	rambhadrapurup.mymensingh.gov.bd
4308	\N	Sondhara	ছনধরা	sondharaup.mymensingh.gov.bd
4309	\N	Vaitkandi	ভাইটকান্দি	vaitkandiup.mymensingh.gov.bd
4310	\N	Singheshwar	সিংহেশ্বর	singheshwarup.mymensingh.gov.bd
4311	\N	Phulpur	ফুলপুর	phulpurup.mymensingh.gov.bd
4312	\N	Banihala	বানিহালা	banihalaup.mymensingh.gov.bd
4313	\N	Biska	বিস্কা	biskaup.mymensingh.gov.bd
4314	\N	Baola	বওলা	baolaup.mymensingh.gov.bd
4315	\N	Payari	পয়ারী	payariup.mymensingh.gov.bd
4316	\N	Balia	বালিয়া	baliaup.mymensingh.gov.bd
4317	\N	Rahimganj	রহিমগঞ্জ	rahimganjup.mymensingh.gov.bd
4318	\N	Balikha	বালিখা	balikhaup.mymensingh.gov.bd
4319	\N	Kakni	কাকনী	kakniup.mymensingh.gov.bd
4320	\N	Dhakua	ঢাকুয়া	dhakuaup.mymensingh.gov.bd
4321	\N	Rupasi	রূপসী	rupasiup.mymensingh.gov.bd
4322	\N	Tarakanda	তারাকান্দা	tarakandaup.mymensingh.gov.bd
4323	\N	Galagaon	গালাগাঁও	galagaonup.mymensingh.gov.bd
4324	\N	Kamargaon	কামারগাঁও	kamargaonup.mymensingh.gov.bd
4325	\N	Kamaria	কামারিয়া	kamariaup.mymensingh.gov.bd
4326	\N	Rampur	রামপুর	rampurup2.mymensingh.gov.bd
4327	\N	Bhubankura	ভূবনকুড়া	bhubankuraup.mymensingh.gov.bd
4328	\N	Jugli	জুগলী	jugliup.mymensingh.gov.bd
4329	\N	Kaichapur	কৈচাপুর	kaichapurup.mymensingh.gov.bd
4330	\N	Haluaghat	হালুয়াঘাট	haluaghatup.mymensingh.gov.bd
4331	\N	Gazirbhita	গাজিরভিটা	gazirbhitaup.mymensingh.gov.bd
4332	\N	Bildora	বিলডোরা	bildoraup.mymensingh.gov.bd
4333	\N	Sakuai	শাকুয়াই	sakuaiup.mymensingh.gov.bd
4334	\N	Narail	নড়াইল	narailup.mymensingh.gov.bd
4335	\N	Dhara	ধারা	dharaup.mymensingh.gov.bd
4336	\N	Dhurail	ধুরাইল	dhurailup.mymensingh.gov.bd
4337	\N	Amtoil	আমতৈল	amtoilup.mymensingh.gov.bd
4338	\N	Swadeshi	স্বদেশী	swadeshiup.mymensingh.gov.bd
4339	\N	Sahanati	সহনাটি	sahanatiup.mymensingh.gov.bd
4340	\N	Achintapur	অচিন্তপুর	achintapurup.mymensingh.gov.bd
4341	\N	Mailakanda	মইলাকান্দা	mailakandaup.mymensingh.gov.bd
4342	\N	Bokainagar	বোকাইনগর	bokainagarup.mymensingh.gov.bd
4343	\N	Gouripur	গৌরীপুর	gouripurup.mymensingh.gov.bd
4344	\N	Maoha	মাওহা	maohaup.mymensingh.gov.bd
4345	\N	Ramgopalpur	রামগোপালপুর	ramgopalpurup.mymensingh.gov.bd
4346	\N	Douhakhola	ডৌহাখলা	douhakholaup.mymensingh.gov.bd
4347	\N	Bhangnamari	ভাংনামারী	bhangnamariup.mymensingh.gov.bd
4348	\N	Sidhla	সিধলা	sidhlaup.mymensingh.gov.bd
4349	\N	Rasulpur	রসুলপুর	rasulpurup.mymensingh.gov.bd
4350	\N	Barobaria	বারবারিয়া	barobariaup.mymensingh.gov.bd
4351	\N	Charalgi	চরআলগী	charalgiup.mymensingh.gov.bd
4352	\N	Saltia	সালটিয়া	saltiaup.mymensingh.gov.bd
4353	\N	Raona	রাওনা	raonaup.mymensingh.gov.bd
4354	\N	Longair	লংগাইর	longairup.mymensingh.gov.bd
4355	\N	Paithol	পাইথল	paitholup.mymensingh.gov.bd
4356	\N	Gafargaon	গফরগাঁও	gafargaonup.mymensingh.gov.bd
4357	\N	Josora	যশরা	josoraup.mymensingh.gov.bd
4358	\N	Moshakhali	মশাখালী	moshakhaliup.mymensingh.gov.bd
4359	\N	Panchbagh	পাঁচবাগ	panchbaghup.mymensingh.gov.bd
4360	\N	Usthi	উস্থি	usthiup.mymensingh.gov.bd
4361	\N	Dotterbazar	দত্তেরবাজার	dotterbazarup.mymensingh.gov.bd
4362	\N	Niguari	নিগুয়ারী	niguariup.mymensingh.gov.bd
4363	\N	Tangabo	টাংগাব	tangaboup.mymensingh.gov.bd
4364	\N	Iswarganj	ঈশ্বরগঞ্জ	iswarganjup.mymensingh.gov.bd
4365	\N	Sarisha	সরিষা	sarishaup.mymensingh.gov.bd
4366	\N	Sohagi	সোহাগী	sohagiup.mymensingh.gov.bd
4367	\N	Atharabari	আঠারবাড়ী	atharabariup.mymensingh.gov.bd
4368	\N	Rajibpur	রাজিবপুর	rajibpurup.mymensingh.gov.bd
4369	\N	Maijbagh	মাইজবাগ	maijbaghup.mymensingh.gov.bd
4370	\N	Magtula	মগটুলা	magtulaup.mymensingh.gov.bd
4371	\N	Jatia	জাটিয়া	jatiaup.mymensingh.gov.bd
4372	\N	Uchakhila	উচাখিলা	uchakhilaup.mymensingh.gov.bd
4373	\N	Tarundia	তারুন্দিয়া	tarundiaup.mymensingh.gov.bd
4374	\N	Barahit	বড়হিত	barahitup.mymensingh.gov.bd
4375	\N	Batagoir	বেতাগৈর	batagoirup.mymensingh.gov.bd
4376	\N	Nandail	নান্দাইল	nandailup.mymensingh.gov.bd
4377	\N	Chandipasha	চন্ডীপাশা	chandipashaup.mymensingh.gov.bd
4378	\N	Gangail	গাংগাইল	gangailup.mymensingh.gov.bd
4379	\N	Rajgati	রাজগাতী	rajgatiup.mymensingh.gov.bd
4380	\N	Muajjempur	মোয়াজ্জেমপুর	muajjempurup.mymensingh.gov.bd
4381	\N	Sherpur	শেরপুর	sherpurup.mymensingh.gov.bd
4382	\N	Singroil	সিংরইল	singroilup.mymensingh.gov.bd
4383	\N	Achargaon	আচারগাঁও	achargaonup.mymensingh.gov.bd
4384	\N	Mushulli	মুশুল্লী	mushulliup.mymensingh.gov.bd
4385	\N	Kharua	খারুয়া	kharuaup.mymensingh.gov.bd
4386	\N	Jahangirpur	জাহাঙ্গীরপুর	jahangirpurup.mymensingh.gov.bd
4387	\N	Kendua	কেন্দুয়া	kenduaup.jamalpur.gov.bd
4388	\N	Sharifpur	শরিফপুর	sharifpurup.jamalpur.gov.bd
4389	\N	Laxirchar	লক্ষীরচর	laxircharup.jamalpur.gov.bd
4390	\N	Tolshirchar	তুলশীরচর	tolshircharup.jamalpur.gov.bd
4391	\N	Itail	ইটাইল	itailup.jamalpur.gov.bd
4392	\N	Narundi	নরুন্দী	narundiup.jamalpur.gov.bd
4393	\N	Ghorada	ঘোড়াধাপ	ghoradapup.jamalpur.gov.bd
4394	\N	Bashchara	বাশঁচড়া	bashcharaup.jamalpur.gov.bd
4395	\N	Ranagacha	রানাগাছা	ranagachaup.jamalpur.gov.bd
4396	\N	Sheepur	শ্রীপুর	sheepurup.jamalpur.gov.bd
4397	\N	Shahbajpur	শাহবাজপুর	shahbajpurup.jamalpur.gov.bd
4398	\N	Titpalla	তিতপল্লা	titpallaup.jamalpur.gov.bd
4399	\N	Mesta	মেষ্টা	mestaup.jamalpur.gov.bd
4400	\N	Digpait	দিগপাইত	digpaitup.jamalpur.gov.bd
4401	\N	Rashidpur	রশিদপুর	rashidpurup.jamalpur.gov.bd
4402	\N	Durmot	দুরমুট	durmotup.jamalpur.gov.bd
4403	\N	Kulia	কুলিয়া	kuliaup.jamalpur.gov.bd
4404	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.jamalpur.gov.bd
4405	\N	Nangla	নাংলা	nanglaup.jamalpur.gov.bd
4406	\N	Nayanagar	নয়ানগর	nayanagarup.jamalpur.gov.bd
4407	\N	Adra	আদ্রা	adraup.jamalpur.gov.bd
4408	\N	Charbani Pakuria	চরবানী পাকুরিয়া	charbanipakuriaup.jamalpur.gov.bd
4409	\N	Fulkucha	ফুলকোচা	fulkuchaup.jamalpur.gov.bd
4410	\N	Ghuserpara	ঘোষেরপাড়া	ghuserparaup.jamalpur.gov.bd
4411	\N	Jhaugara	ঝাউগড়া	jhaugaraup.jamalpur.gov.bd
4412	\N	Shuampur	শ্যামপুর	shuampurup.jamalpur.gov.bd
4413	\N	Kulkandi	কুলকান্দি	kulkandiup.jamalpur.gov.bd
4414	\N	Belghacha	বেলগাছা	belghachaup.jamalpur.gov.bd
4415	\N	Chinaduli	চিনাডুলী	chinaduliup.jamalpur.gov.bd
4416	\N	Shapdari	সাপধরী	shapdariup.jamalpur.gov.bd
4417	\N	Noarpara	নোয়ারপাড়া	noarparaup.jamalpur.gov.bd
4418	\N	Islampur	ইসলামপুর	islampurup.jamalpur.gov.bd
4419	\N	Partharshi	পাথশী	partharshiup.jamalpur.gov.bd
4420	\N	Palabandha	পলবান্ধা	palabandhaup.jamalpur.gov.bd
4421	\N	Gualerchar	গোয়ালেরচর	gualercharup.jamalpur.gov.bd
4422	\N	Gaibandha	গাইবান্ধা	gaibandhaup.jamalpur.gov.bd
4423	\N	Charputimari	চরপুটিমারী	charputimariup.jamalpur.gov.bd
4424	\N	Chargualini	চরগোয়ালীনি	chargualiniup.jamalpur.gov.bd
4425	\N	Dungdhara	ডাংধরা	dungdharaup.jamalpur.gov.bd
4426	\N	Char Amkhawa	চর আমখাওয়া	charamkhawaup.jamalpur.gov.bd
4427	\N	Parram Rampur	পাররাম রামপুর	parramrampurup.jamalpur.gov.bd
4428	\N	Hatibanga	হাতীভাঙ্গা	hatibangaup.jamalpur.gov.bd
4429	\N	Bahadurabad	বাহাদুরাবাদ	bahadurabadup.jamalpur.gov.bd
4430	\N	Chikajani	চিকাজানী	chikajaniup.jamalpur.gov.bd
4431	\N	Chukaibari	চুকাইবাড়ী	chukaibariup.jamalpur.gov.bd
4432	\N	Dewangonj	দেওয়ানগঞ্জ	dewangonjup.jamalpur.gov.bd
4433	\N	Satpoa	সাতপোয়া	satpoaup.jamalpur.gov.bd
4434	\N	Pogaldigha	পোগলদিঘা	pogaldighaup.jamalpur.gov.bd
4435	\N	Doail	ডোয়াইল	doailup.jamalpur.gov.bd
4436	\N	Aona	আওনা	aonaup.jamalpur.gov.bd
4437	\N	Pingna	পিংনা	pingnaup.jamalpur.gov.bd
4438	\N	Bhatara	ভাটারা	bhataraup.jamalpur.gov.bd
4439	\N	Kamrabad	কামরাবাদ	kamrabadup.jamalpur.gov.bd
4440	\N	Mahadan	মহাদান	mahadanup.jamalpur.gov.bd
4441	\N	Char Pakerdah	চর পাকেরদহ	charpakerdahup.jamalpur.gov.bd
4442	\N	Karaichara	কড়ইচড়া	karaicharaup.jamalpur.gov.bd
4443	\N	Gunaritala	গুনারীতলা	gunaritalaup.jamalpur.gov.bd
4444	\N	Balijuri	বালিজুড়ী	balijuriup.jamalpur.gov.bd
4445	\N	Jorekhali	জোড়খালী	jorekhaliup.jamalpur.gov.bd
4446	\N	Adarvita	আদারভিটা	adarvitaup.jamalpur.gov.bd
4447	\N	Sidhuli	সিধুলী	sidhuliup.jamalpur.gov.bd
4448	\N	Danua	ধানুয়া	danuaup.jamalpur.gov.bd
4449	\N	Bagarchar	বগারচর	bagarcharup.jamalpur.gov.bd
4450	\N	Battajore	বাট্রাজোড়	battajoreup.jamalpur.gov.bd
4451	\N	Shadurpara	সাধুরপাড়া	shadurparaup.jamalpur.gov.bd
4452	\N	Bakshigonj	বকসীগঞ্জ	bakshigonjup.jamalpur.gov.bd
4453	\N	Nilakhia	নিলক্ষিয়া	nilakhiaup.jamalpur.gov.bd
4454	\N	Merurchar	মেরুরচর	merurcharup.jamalpur.gov.bd
4455	\N	Asma	আসমা	asma.netrokona.gov.bd
4456	\N	Chhiram	চিরাম	chhiram.netrokona.gov.bd
4457	\N	Baushi	বাউশী	baushiup.netrokona.gov.bd
4458	\N	Barhatta	বারহাট্টা	barhattaup.netrokona.gov.bd
4459	\N	Raypur	রায়পুর	raypurup.netrokona.gov.bd
4460	\N	Sahata	সাহতা	sahataup.netrokona.gov.bd
4461	\N	Singdha	সিংধা	singdhaup.netrokona.gov.bd
4462	\N	Durgapur	দূর্গাপুর	durgapurup.netrokona.gov.bd
4463	\N	Kakoirgora	কাকৈরগড়া	kakoirgoraup.netrokona.gov.bd
4464	\N	Kullagora	কুল্লাগড়া	kullagoraup.netrokona.gov.bd
4465	\N	Chandigarh	চণ্ডিগড়	chandigarhup.netrokona.gov.bd
4466	\N	Birisiri	বিরিশিরি	birisiriup.netrokona.gov.bd
4467	\N	Bakaljora	বাকলজোড়া	bakaljoraup.netrokona.gov.bd
4468	\N	Gawkandia	গাঁওকান্দিয়া	gawkandiaup.netrokona.gov.bd
4469	\N	Asujia	আশুজিয়া	asujiaup.netrokona.gov.bd
4470	\N	Dalpa	দলপা	dalpaup.netrokona.gov.bd
4471	\N	Goraduba	গড়াডোবা	goradubaup.netrokona.gov.bd
4472	\N	Gonda	গণ্ডা	gondaup.netrokona.gov.bd
4473	\N	Sandikona	সান্দিকোনা	sandikonaup.netrokona.gov.bd
4474	\N	Maska	মাসকা	maskaup.netrokona.gov.bd
4475	\N	Bolaishimul	বলাইশিমুল	bolaishimulup.netrokona.gov.bd
4476	\N	Noapara	নওপাড়া	noaparaup.netrokona.gov.bd
4477	\N	Kandiura	কান্দিউড়া	kandiuraup.netrokona.gov.bd
4478	\N	Chirang	চিরাং	chirangup.netrokona.gov.bd
4479	\N	Roailbari Amtala	রোয়াইলবাড়ী আমতলা	roailbariamtalaup.netrokona.gov.bd
4480	\N	Paikura	পাইকুড়া	paikuraup.netrokona.gov.bd
4481	\N	Muzafarpur	মোজাফরপুর	muzafarpurup.netrokona.gov.bd
4482	\N	Shormushia	স্বরমুশিয়া	shormushiaup.netrokona.gov.bd
4483	\N	Shunoi	শুনই	shunoiup.netrokona.gov.bd
4484	\N	Lunesshor	লুনেশ্বর	lunesshorup.netrokona.gov.bd
4485	\N	Baniyajan	বানিয়াজান	baniyajanup.netrokona.gov.bd
4486	\N	Teligati	তেলিগাতী	teligatiup.netrokona.gov.bd
4487	\N	Duoj	দুওজ	duojup.netrokona.gov.bd
4488	\N	Sukhari	সুখারী	sukhariup.netrokona.gov.bd
4489	\N	Fathepur	ফতেপুর	fathepurup.netrokona.gov.bd
4490	\N	Nayekpur	নায়েকপুর	nayekpurup.netrokona.gov.bd
4491	\N	Teosree	তিয়শ্রী	teosreeup.netrokona.gov.bd
4492	\N	Magan	মাঘান	maganup.netrokona.gov.bd
4493	\N	Gobindasree	গেবিন্দশ্রী	gobindasreeup.netrokona.gov.bd
4494	\N	Madan	মদন	madanup.netrokona.gov.bd
4495	\N	Chandgaw	চানগাঁও	chandgawup.netrokona.gov.bd
4496	\N	Kytail	কাইটাল	kytailup.netrokona.gov.bd
4497	\N	Krishnapur	কৃষ্ণপুর	krishnapurup.netrokona.gov.bd
4498	\N	Nogor	নগর	nogorup.netrokona.gov.bd
4499	\N	Chakua	চাকুয়া	chakuaup.netrokona.gov.bd
4500	\N	Khaliajuri	খালিয়াজুরী	khaliajuriup.netrokona.gov.bd
4501	\N	Mendipur	মেন্দিপুর	mendipurup.netrokona.gov.bd
4502	\N	Gazipur	গাজীপুর	gazipurup.netrokona.gov.bd
4503	\N	Koilati	কৈলাটী	koilatiup.netrokona.gov.bd
4504	\N	Najirpur	নাজিরপুর	najirpurup.netrokona.gov.bd
4505	\N	Pogla	পোগলা	poglaup.netrokona.gov.bd
4506	\N	Kolmakanda	কলমাকান্দা	kolmakandaup.netrokona.gov.bd
4507	\N	Rongchati	রংছাতি	rongchatiup.netrokona.gov.bd
4508	\N	Lengura	লেংগুরা	lenguraup.netrokona.gov.bd
4509	\N	Borokhapon	বড়খাপন	borokhaponup.netrokona.gov.bd
4510	\N	Kharnoi	খারনৈ	kharnoiup.netrokona.gov.bd
4511	\N	Borokashia Birampur	বড়কাশিয়া বিরামপুর	borokashiabirampurup.netrokona.gov.bd
4512	\N	Borotoli Banihari	বড়তলী বানিহারী	borotolibanihariup.netrokona.gov.bd
4513	\N	Tetulia	তেতুলিয়া	tetuliaup.netrokona.gov.bd
4514	\N	Maghan Siadar	মাঘান সিয়াদার	maghansiadarup.netrokona.gov.bd
4515	\N	Somaj Sohildeo	সমাজ সহিলদেও	somajsohildeoup.netrokona.gov.bd
4516	\N	Suair	সুয়াইর	suairup.netrokona.gov.bd
4517	\N	Gaglajur	গাগলাজুর	gaglajurup.netrokona.gov.bd
4518	\N	Khalishaur	খলিশাউড়	khalishaurup.netrokona.gov.bd
4519	\N	Ghagra	ঘাগড়া	ghagraup.netrokona.gov.bd
4520	\N	Jaria	জারিয়া	jariaup.netrokona.gov.bd
4521	\N	Narandia	নারান্দিয়া	narandiaup.netrokona.gov.bd
4522	\N	Bishkakuni	বিশকাকুনী	bishkakuniup.netrokona.gov.bd
4523	\N	Bairaty	বৈরাটী	bairaty.netrokona.gov.bd
4524	\N	Hogla	হোগলা	hoglaup.netrokona.gov.bd
4525	\N	Gohalakanda	গোহালাকান্দা	gohalakandaup.netrokona.gov.bd
4526	\N	Dhalamulgaon	ধলামুলগাঁও	dhalamulgaonup.netrokona.gov.bd
4527	\N	Agia	আগিয়া	agia.netrokona.gov.bd
4528	\N	Purbadhala	পূর্বধলা	purbadhalaup.netrokona.gov.bd
4529	\N	Chollisha	চল্লিশা	chollishaup.netrokona.gov.bd
4530	\N	Kailati	কাইলাটি	kailatiup.netrokona.gov.bd
4531	\N	Dokkhin Bishiura	দক্ষিণ বিশিউড়া	dokkhinbishiuraup.netrokona.gov.bd
4532	\N	Modonpur	মদনপুর	modonpurup.netrokona.gov.bd
4533	\N	Amtola	আমতলা	amtolaup.netrokona.gov.bd
4534	\N	Lokkhiganj	লক্ষীগঞ্জ	lokkhiganj.netrokona.gov.bd
4535	\N	Singher Bangla	সিংহের বাংলা	singherbanglaup.netrokona.gov.bd
4536	\N	Thakurakona	ঠাকুরাকোণা	thakurakonaup.netrokona.gov.bd
4537	\N	Mougati	মৌগাতি	mougatiup.netrokona.gov.bd
4538	\N	Rouha	রৌহা	rouhaup.netrokona.gov.bd
4539	\N	Medni	মেদনী	medniup.netrokona.gov.bd
4540	\N	Kaliara Babragati	কালিয়ারা গাবরাগাতি	kaliaragabragatiup.netrokona.gov.bd
4541	\N	Subil	সুবিল	subilup.comilla.gov.bd
4542	\N	North Gunaighor	উত্তর গুনাইঘর	gunaighornorthup.comilla.gov.bd
4543	\N	South Gunaighor	দক্ষিণ গুনাইঘর	gunaighorsouth.comilla.gov.bd
4544	\N	Boroshalghor	বড়শালঘর	boroshalghorup.comilla.gov.bd
4545	\N	Rajameher	রাজামেহার	rajameherup.comila.gov.bd
4546	\N	Yousufpur	ইউসুফপুর	yousufpurup.comilla.gov.bd
4547	\N	Rasulpur	রসুলপুর	rasulpurup.comilla.gov.bd
4548	\N	Fatehabad	ফতেহাবাদ	fatehabadup.comilla.gov.bd
4549	\N	Elahabad	এলাহাবাদ	elahabadup.comilla.gov.bd
4550	\N	Jafargonj	জাফরগঞ্জ	jafargonjup.comilla.gov.bd
4551	\N	Dhampti	ধামতী	dhamptiup.comilla.gov.bd
4552	\N	Mohanpur	মোহনপুর	mohanpurup.comilla.gov.bd
4553	\N	Vani	ভানী	vaniup.comilla.gov.bd
4554	\N	Barkamta	বরকামতা	barkamtaup.comilla.gov.bd
4555	\N	Sultanpur	সুলতানপুর	sultanpurup.comilla.gov.bd
4556	\N	Aganagar	আগানগর	aganagarup.comilla.gov.bd
4557	\N	Bhabanipur	ভবানীপুর	bhabanipurup.comilla.gov.bd
4558	\N	North Khoshbas	উত্তর খোশবাস	khoshbasnorthup.comilla.gov.bd
4559	\N	South Khoshbas	দক্ষিন খোশবাস	khoshbassouthup.comilla.gov.bd
4560	\N	Jhalam	ঝলম	jhalamup.comilla.gov.bd
4561	\N	Chitodda	চিতড্ডা	chitoddaup.comilla.gov.bd
4562	\N	North Shilmuri	উত্তর শিলমুড়ি	shilmurinorthup.comilla.gov.bd
4563	\N	South Shilmuri	দক্ষিন শিলমুড়ি	shilmurisouthup.comilla.gov.bd
4564	\N	Galimpur	গালিমপুর	galimpurup.comilla.gov.bd
4565	\N	Shakpur	শাকপুর	shakpurup.comilla.gov.bd
4566	\N	Bhaukshar	ভাউকসার	bhauksharup.comilla.gov.bd
4567	\N	Adda	আড্ডা	addaup.comilla.gov.bd
4568	\N	Adra	আদ্রা	adraup.comilla.gov.bd
4569	\N	Payalgacha	পয়ালগাছা	payalgachaup.comilla.gov.bd
4570	\N	Laxmipur	লক্ষীপুর	laxmipurup.comilla.gov.bd
4571	\N	Shidli	শিদলাই	shidliup.comilla.gov.bd
4572	\N	Chandla	চান্দলা	chandlaup.comilla.gov.bd
4573	\N	Shashidal	শশীদল	shashidalup.comilla.gov.bd
4574	\N	Dulalpur	দুলালপুর	dulalpurup2.comilla.gov.bd
4575	\N	Brahmanpara Sadar	ব্রাহ্মনপাড়া সদর	brahmanparasadarup.comilla.gov.bd
4576	\N	Shahebabad	সাহেবাবাদ	shahebabadup.comilla.gov.bd
4577	\N	Malapara	মালাপাড়া	malaparaup.comilla.gov.bd
4578	\N	Madhabpur	মাধবপুর	madhabpurup.comilla.gov.bd
4579	\N	Shuhilpur	সুহিলপুর	shuhilpurup.comilla.gov.bd
4580	\N	Bataghashi	বাতাঘাসি	bataghashiup.comilla.gov.bd
4581	\N	Joag	জোয়াগ	joagup.comilla.gov.bd
4582	\N	Borcarai	বরকরই	borcaraiup.comilla.gov.bd
4583	\N	Madhaiya	মাধাইয়া	madhaiyaup.comilla.gov.bd
4584	\N	Dollai Nowabpur	দোল্লাই নবাবপুর	dollainowabpurup.comilla.gov.bd
4585	\N	Mohichial	মহিচাইল	mohichialup.comilla.gov.bd
4586	\N	Gollai	গল্লাই	gollaiup.comilla.gov.bd
4587	\N	Keronkhal	কেরণখাল	keronkhalup.comilla.gov.bd
4588	\N	Maijkhar	মাইজখার	maijkharup.comilla.gov.bd
4589	\N	Etberpur	এতবারপুর	etberpurup.comilla.gov.bd
4590	\N	Barera	বাড়েরা	bareraup.comilla.gov.bd
4591	\N	Borcoit	বরকইট	borcoitup.comilla.gov.bd
4592	\N	Sreepur	শ্রীপুর	sreepurup.comilla.gov.bd
4593	\N	Kashinagar	কাশিনগর	kashinagarup.comilla.gov.bd
4594	\N	Kalikapur	কালিকাপুর	kalikapurup.comilla.gov.bd
4595	\N	Shuvapur	শুভপুর	shuvapurup.comilla.gov.bd
4596	\N	Ghulpasha	ঘোলপাশা	ghulpashaup.comilla.gov.bd
4597	\N	Moonshirhat	মুন্সীরহাট	moonshirhatup.comilla.gov.bd
4598	\N	Batisha	বাতিসা	batishaup.comilla.gov.bd
4599	\N	Kankapait	কনকাপৈত	kankapaitup.comilla.gov.bd
4600	\N	Cheora	চিওড়া	cheoraup.comilla.gov.bd
4601	\N	Jagannatdighi	জগন্নাথদিঘী	jagannatdighiup.comilla.gov.bd
4602	\N	Goonabati	গুনবতী	goonabatiup.comilla.gov.bd
4603	\N	Alkara	আলকরা	alkaraup.comilla.gov.bd
4604	\N	Doulotpur	দৌলতপুর	doulotpurup.comilla.gov.bd
4605	\N	Daudkandi	দাউদকান্দি	daudkandinorthup.comilla.gov.bd
4606	\N	North Eliotgonj	উত্তর ইলিয়টগঞ্জ	eliotgonjnorthup.comilla.gov.bd
4607	\N	South Eliotgonj	দক্ষিন ইলিয়টগঞ্জ	eliotgonjsouthup.comilla.gov.bd
4608	\N	Zinglatoli	জিংলাতলী	zinglatoliup.comilla.gov.bd
4609	\N	Sundolpur	সুন্দলপুর	sundolpurup.comilla.gov.bd
4610	\N	Gouripur	গৌরীপুর	gouripurup.comilla.gov.bd
4611	\N	East Mohammadpur	পুর্ব মোহাম্মদপুর	mohammadpureastup.comilla.gov.bd
4612	\N	West Mohammadpur	পশ্চিম মোহাম্মদপুর	mohammadpurwestup.comilla.gov.bd
4613	\N	Goalmari	গোয়ালমারী	goalmariup.comilla.gov.bd
4614	\N	Maruka	মারুকা	marukaup.comilla.gov.bd
4615	\N	Betessor	বিটেশ্বর	betessorup.comilla.gov.bd
4616	\N	Podua	পদুয়া	poduaup.comilla.gov.bd
4617	\N	West Passgacia	পশ্চিম পাচঁগাছিয়া	passgaciawestup.comilla.gov.bd
4618	\N	Baropara	বারপাড়া	baroparaup2.comilla.gov.bd
4619	\N	Mathabanga	মাথাভাঙ্গা	mathabangaup.comilla.gov.bd
4620	\N	Gagutiea	ঘাগুটিয়া	gagutieaup.comilla.gov.bd
4621	\N	Asadpur	আছাদপুর	asadpurup.comilla.gov.bd
4622	\N	Chanderchor	চান্দেরচর	chanderchorup.comilla.gov.bd
4623	\N	Vashania	ভাষানিয়া	vashaniaup.comilla.gov.bd
4624	\N	Nilokhi	নিলখী	nilokhiup.comilla.gov.bd
4625	\N	Garmora	ঘারমোড়া	garmoraup.comilla.gov.bd
4626	\N	Joypur	জয়পুর	joypurup.comilla.gov.bd
4627	\N	Dulalpur	দুলালপুর	dulalpurup1.comilla.gov.bd
4628	\N	Bakoi	বাকই	bakoiup.comilla.gov.bd
4629	\N	Mudafargonj	মুদাফফর গঞ্জ	mudafargonjup.comilla.gov.bd
4630	\N	Kandirpar	কান্দিরপাড়	kandirparup.comilla.gov.bd
4631	\N	Gobindapur	গোবিন্দপুর	gobindapurup.comilla.gov.bd
4632	\N	Uttarda	উত্তরদা	uttardaup.comilla.gov.bd
4633	\N	Laksam Purba	লাকসাম পুর্ব	laksampurbaup.comilla.gov.bd
4634	\N	Azgora	আজগরা	azgoraup.comilla.gov.bd
4635	\N	Sreekil	শ্রীকাইল	sreekilup.comilla.gov.bd
4636	\N	Akubpur	আকুবপুর	akubpurup.comilla.gov.bd
4637	\N	Andicot	আন্দিকোট	andicotup.comilla.gov.bd
4638	\N	Purbadair (East)	পুর্বধৈইর (পুর্ব)	purbadaireastup.comilla.gov.bd
4639	\N	Purbadair (West)	পুর্বধৈইর (পশ্চিম)	purbadairwestup.comilla.gov.bd
4640	\N	Bangara (East)	বাঙ্গরা (পূর্ব)	bangaraeastup.comilla.gov.bd
4641	\N	Bangara (West)	বাঙ্গরা (পশ্চিম)	bangarawestup.comilla.gov.bd
4642	\N	Chapitala	চাপিতলা	chapitalaup.comilla.gov.bd
4643	\N	Camalla	কামাল্লা	camallaup.comilla.gov.bd
4644	\N	Jatrapur	যাত্রাপুর	jatrapurup.comilla.gov.bd
4645	\N	Ramachandrapur (North)	রামচন্দ্রপুর (উত্তর)	ramachandrapurnorthup.comilla.gov.bd
4646	\N	Ramachandrapur (South)	রামচন্দ্রপুর (দক্ষিন)	ramachandrapursouthup.comilla.gov.bd
4647	\N	Muradnagar Sadar	মুরাদনগর সদর	muradnagarsadarup.comilla.gov.bd
4648	\N	Nobipur (East)	নবীপুর (পুর্ব)	nobipureastup.comilla.gov.bd
4649	\N	Nobipur (West)	নবীপুর (পশ্চিম)	nobipurwestup.comilla.gov.bd
4650	\N	Damgar	ধামঘর	damgarup.comilla.gov.bd
4651	\N	Jahapur	জাহাপুর	jahapurup.comilla.gov.bd
4652	\N	Salikandi	ছালিয়াকান্দি	salikandiup.comilla.gov.bd
4653	\N	Darura	দারোরা	daruraup.comilla.gov.bd
4654	\N	Paharpur	পাহাড়পুর	paharpurup.comilla.gov.bd
4655	\N	Babutipara	বাবুটিপাড়া	babutiparaup.comilla.gov.bd
4656	\N	Tanki	টনকী	tankiup.comilla.gov.bd
4657	\N	Bangadda	বাঙ্গড্ডা	bangadda.comilla.gov.bd
4658	\N	Paria	পেরিয়া	pariaup.comilla.gov.bd
4659	\N	Raykot	রায়কোট	raykotup.comilla.gov.bd
4660	\N	Mokara	মোকরা	mokaraup.comilla.gov.bd
4661	\N	Makrabpur	মক্রবপুর	makrabpurup.comilla.gov.bd
4662	\N	Heshakhal	হেসাখাল	heshakhalup.comilla.gov.bd
4663	\N	Adra	আদ্রা	adraup.comilla.gov.bd
4664	\N	Judda	জোড্ডা	juddaup.comilla.gov.bd
4665	\N	Dhalua	ঢালুয়া	dhaluaup.comilla.gov.bd
4666	\N	Doulkha	দৌলখাঁড়	doulkhaup.comilla.gov.bd
4667	\N	Boxgonj	বক্সগঞ্জ	boxgonjup.comilla.gov.bd
4668	\N	Satbaria	সাতবাড়ীয়া	satbariaup.comilla.gov.bd
4669	\N	Kalirbazer	কালীর বাজার	kalirbazerup.comilla.gov.bd
4670	\N	North Durgapur	উত্তর দুর্গাপুর	durgapurnorthup.comilla.gov.bd
4671	\N	South Durgapur	দক্ষিন দুর্গাপুর	durgapursouthup.comilla.gov.bd
4672	\N	Amratoli	আমড়াতলী	amratoliup.comilla.gov.bd
4673	\N	Panchthubi	পাঁচথুবী	panchthubiup.comilla.gov.bd
4674	\N	Jagannatpur	জগন্নাথপুর	jagannatpurup.comilla.gov.bd
4675	\N	Chandanpur	চন্দনপুর	chandanpurup.comilla.gov.bd
4676	\N	Chalibanga	চালিভাঙ্গা	chalibangaup.comilla.gov.bd
4677	\N	Radanagar	রাধানগর	radanagarup.comilla.gov.bd
4678	\N	Manikarchar	মানিকারচর	manikarcharup.comilla.gov.bd
4679	\N	Barakanda	বড়কান্দা	barakandaup.comilla.gov.bd
4680	\N	Govindapur	গোবিন্দপুর	govindapurup1.comilla.gov.bd
4681	\N	Luterchar	লুটেরচর	lutercharup.comilla.gov.bd
4682	\N	Vaorkhola	ভাওরখোলা	vaorkholaup.comilla.gov.bd
4683	\N	Baishgaon	বাইশগাঁও	baishgaonup.comilla.gov.bd
4684	\N	Shoroshpur	সরসপুর	shoroshpurup.comilla.gov.bd
4685	\N	Hasnabad	হাসনাবাদ	hasnabadup.comilla.gov.bd
4686	\N	Jholam (North)	ঝলম (উত্তর)	jholamnorthup.comilla.gov.bd
4687	\N	Jholam (South)	ঝলম (দক্ষিন)	jholamsouthup.comilla.gov.bd
4688	\N	Moishatua	মৈশাতুয়া	moishatuaup.comilla.gov.bd
4689	\N	Lokkhanpur	লক্ষনপুর	lokkhanpurup.comilla.gov.bd
4690	\N	Khela	খিলা	khelaup.comilla.gov.bd
4691	\N	Uttarhowla	উত্তর হাওলা	uttarhowlaup.comilla.gov.bd
4692	\N	Natherpetua	নাথেরপেটুয়া	natherpetuaup.comilla.gov.bd
4693	\N	Bipulashar	বিপুলাসার	bipulasharup.comilla.gov.bd
4694	\N	Chuwara	চৌয়ারা	chuwaraup.comilla.gov.bd
4695	\N	Baropara	বারপাড়া	baroparaup1.comilla.gov.bd
4696	\N	Jorkanoneast	জোড়কানন (পুর্ব)	jorkanoneastup.comilla.gov.bd
4697	\N	Goliara	গলিয়ারা	goliaraup.comilla.gov.bd
4698	\N	Jorkanonwest	জোড়কানন (পশ্চিম)	jorkanonwestup.comilla.gov.bd
4699	\N	Bagmara (North)	বাগমারা (উত্তর)	bagmaranorthup.comilla.gov.bd
4700	\N	Bagmara (South)	বাগমারা (দক্ষিন)	bagmarasouthup.comilla.gov.bd
4701	\N	Bhuloin (North)	ভূলইন (উত্তর)	bhuloinnorthup.comilla.gov.bd
4702	\N	Bhuloin (South)	ভূলইন (দক্ষিন)	bhuloinsouthup.comilla.gov.bd
4703	\N	Belgor (North)	বেলঘর (উত্তর)	belgornorthup.comilla.gov.bd
4704	\N	Belgor (South)	বেলঘর (দক্ষিন)	belgorsouthup.comilla.gov.bd
4705	\N	Perul (North)	পেরুল (উত্তর)	perulnorthup.comilla.gov.bd
4706	\N	Perul (South)	পেরুল (দক্ষিন)	perulsouthup.comilla.gov.bd
4707	\N	Bijoypur	বিজয়পুর	bijoypurup.comilla.gov.bd
4708	\N	Satani	সাতানী	sataniup.comilla.gov.bd
4709	\N	Jagatpur	জগতপুর	jagatpurup.comilla.gov.bd
4710	\N	Balorampur	বলরামপুর	balorampurup.comilla.gov.bd
4711	\N	Karikandi	কড়িকান্দি	karikandiup.comilla.gov.bd
4712	\N	Kalakandi	কলাকান্দি	kalakandiup.comilla.gov.bd
4713	\N	Vitikandi	ভিটিকান্দি	vitikandiup.comilla.gov.bd
4714	\N	Narayandia	নারান্দিয়া	narayandiaup.comilla.gov.bd
4715	\N	Zearkandi	জিয়ারকান্দি	zearkandiup.comilla.gov.bd
4716	\N	Majidpur	মজিদপুর	majidpurup.comilla.gov.bd
4717	\N	Moynamoti	ময়নামতি	moynamotiup.comilla.gov.bd
4718	\N	Varella	ভারেল্লা	varellaup.comilla.gov.bd
4719	\N	Mokam	মোকাম	mokamup.comilla.gov.bd
4720	\N	Burichang Sadar	বুড়িচং সদর	burichangsadarup.comilla.gov.bd
4721	\N	Bakshimul	বাকশীমূল	bakshimulup.comilla.gov.bd
4722	\N	Pirjatrapur	পীরযাত্রাপুর	pirjatrapurup.comilla.gov.bd
4723	\N	Sholonal	ষোলনল	sholonalup.comilla.gov.bd
4724	\N	Rajapur	রাজাপুর	rajapurup.comilla.gov.bd
4725	\N	Bagmara (North)	বাগমারা (উত্তর)	bagmaranorthup.comilla.gov.bd
4726	\N	Bagmara (South)	বাগমারা (দক্ষিন)	bagmarasouthup.comilla.gov.bd
4727	\N	Bhuloin (North)	ভূলইন (উত্তর)	bhuloinnorthup.comilla.gov.bd
4728	\N	Bhuloin (South)	ভূলইন (দক্ষিন)	bhuloinsouthup.comilla.gov.bd
4729	\N	Belgor (North)	বেলঘর (উত্তর)	belgornorthup.comilla.gov.bd
4730	\N	Belgor (South)	বেলঘর (দক্ষিন)	belgorsouthup.comilla.gov.bd
4731	\N	Perul (North)	পেরুল (উত্তর)	perulnorthup.comilla.gov.bd
4732	\N	Perul (South)	পেরুল (দক্ষিন)	perulsouthup.comilla.gov.bd
4733	\N	Mohamaya	মহামায়া	mohamayaup.feni.gov.bd
4734	\N	Pathannagar	পাঠাননগর	pathannagarup.feni.gov.bd
4735	\N	Subhapur	শুভপুর	subhapurup.feni.gov.bd
4736	\N	Radhanagar	রাধানগর	radhanagarup.feni.gov.bd
4737	\N	Gopal	ঘোপাল	gopalup.feni.gov.bd
4738	\N	Sarishadi	শর্শদি	sarishadiup.feni.gov.bd
4739	\N	Panchgachia	পাঁচগাছিয়া	panchgachiaup.feni.gov.bd
4740	\N	Dhormapur	ধর্মপুর	dhormapurup.feni.gov.bd
4741	\N	Kazirbag	কাজিরবাগ	kazirbagup.feni.gov.bd
4742	\N	Kalidah	কালিদহ	kalidahup.feni.gov.bd
4743	\N	Baligaon	বালিগাঁও	baligaonup.feni.gov.bd
4744	\N	Dholia	ধলিয়া	dholiaup.feni.gov.bd
4745	\N	Lemua	লেমুয়া	lemuaup.feni.gov.bd
4746	\N	Chonua	ছনুয়া	chonuaup.feni.gov.bd
4747	\N	Motobi	মোটবী	motobiup.feni.gov.bd
4748	\N	Fazilpur	ফাজিলপুর	fazilpurup.feni.gov.bd
4749	\N	Forhadnogor	ফরহাদনগর	forhadnogorup.feni.gov.bd
4750	\N	Charmozlishpur	চরমজলিশপুর	charmozlishpurup.feni.gov.bd
4751	\N	Bogadana	বগাদানা	bogadanaup.feni.gov.bd
4752	\N	Motigonj	মতিগঞ্জ	motigonjup.feni.gov.bd
4753	\N	Mongolkandi	মঙ্গলকান্দি	mongolkandiup.feni.gov.bd
4754	\N	Chardorbesh	চরদরবেশ	chardorbeshup.feni.gov.bd
4755	\N	Chorchandia	চরচান্দিয়া	chorchandiaup.feni.gov.bd
4756	\N	Sonagazi	সোনাগাজী	sonagaziup.feni.gov.bd
4757	\N	Amirabad	আমিরাবাদ	amirabadup.feni.gov.bd
4758	\N	Nababpur	নবাবপুর	nababpurup.feni.gov.bd
4759	\N	Fulgazi	ফুলগাজী	fulgaziup.feni.gov.bd
4760	\N	Munshirhat	মুন্সিরহাট	munshirhatup.feni.gov.bd
4761	\N	Dorbarpur	দরবারপুর	dorbarpurup.feni.gov.bd
4762	\N	Anandopur	আনন্দপুর	anandopurup.feni.gov.bd
4763	\N	Amzadhat	আমজাদহাট	amzadhatup.feni.gov.bd
4764	\N	Gmhat	জি,এম, হাট	gmhatup.feni.gov.bd
4765	\N	Mizanagar	মির্জানগর	mizanagarup.feni.gov.bd
4766	\N	Ctholia	চিথলিয়া	ctholiaup.feni.gov.bd
4767	\N	Boxmahmmud	বক্সমাহমুদ	boxmahmmudup.feni.gov.bd
4768	\N	Sindurpur	সিন্দুরপুর	sindurpurup.feni.gov.bd
4769	\N	Rajapur	রাজাপুর	rajapurup.feni.gov.bd
4770	\N	Purbachandrapur	পূর্বচন্দ্রপুর	purbachandrapurup.feni.gov.bd
4771	\N	Ramnagar	রামনগর	ramnagarup.feni.gov.bd
4772	\N	Yeakubpur	ইয়াকুবপুর	yeakubpur.feni.gov.bd
4773	\N	Daganbhuiyan	দাগনভূঞা	daganbhuiyanup.feni.gov.bd
4774	\N	Matubhuiyan	মাতুভূঞা	matubhuiyanup.feni.gov.bd
4775	\N	Jayloskor	জায়লস্কর	jayloskorup.feni.gov.bd
4776	\N	Basudeb	বাসুদেব	basudeb.brahmanbaria.gov.bd
4777	\N	Machihata	মাছিহাতা	machihata.brahmanbaria.gov.bd
4778	\N	Sultanpur	সুলতানপুর	sultanpur.brahmanbaria.gov.bd
4779	\N	Ramrail	রামরাইল	ramrail.brahmanbaria.gov.bd
4780	\N	Sadekpur	সাদেকপুর	sadekpur.brahmanbaria.gov.bd
4781	\N	Talsahar	তালশহর	talsahar.brahmanbaria.gov.bd
4782	\N	Natai	নাটাই (দক্ষিন)	natais.brahmanbaria.gov.bd
4783	\N	Natai	নাটাই (উত্তর)	natain.brahmanbaria.gov.bd
4784	\N	Shuhilpur	সুহিলপুর	shuhilpur.brahmanbaria.gov.bd
4785	\N	Bodhal	বুধল	bodhal.brahmanbaria.gov.bd
4786	\N	Majlishpur	মজলিশপুর	majlishpur.brahmanbaria.gov.bd
4787	\N	Mulagram	মূলগ্রাম	mulagramup.brahmanbaria.gov.bd
4788	\N	Mehari	মেহারী	mehariup.brahmanbaria.gov.bd
4789	\N	Badair	বাদৈর	badairup.brahmanbaria.gov.bd
4790	\N	Kharera	খাড়েরা	khareraup.brahmanbaria.gov.bd
4791	\N	Benauty	বিনাউটি	benautyup.brahmanbaria.gov.bd
4792	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.brahmanbaria.gov.bd
4793	\N	Kasbaw	কসবা	kasbawup.brahmanbaria.gov.bd
4794	\N	Kuti	কুটি	kutiup.brahmanbaria.gov.bd
4795	\N	Kayempur	কাইমপুর	kayempurup.brahmanbaria.gov.bd
4796	\N	Bayek	বায়েক	bayekup.brahmanbaria.gov.bd
4797	\N	Chatalpar	চাতলপাড়	chatalparup.brahmanbaria.gov.bd
4798	\N	Bhalakut	ভলাকুট	bhalakutup.brahmanbaria.gov.bd
4799	\N	Kunda	কুন্ডা	kundaup.brahmanbaria.gov.bd
4800	\N	Goalnagar	গোয়ালনগর	goalnagarup.brahmanbaria.gov.bd
4801	\N	Nasirnagar	নাসিরনগর	nasirnagarup.brahmanbaria.gov.bd
4802	\N	Burishwar	বুড়িশ্বর	burishwarup.brahmanbaria.gov.bd
4803	\N	Fandauk	ফান্দাউক	fandaukup.brahmanbaria.gov.bd
4804	\N	Goniauk	গুনিয়াউক	goniaukup.brahmanbaria.gov.bd
4805	\N	Chapartala	চাপৈরতলা	chapartalaup.brahmanbaria.gov.bd
4806	\N	Dharnondol	ধরমন্ডল	dharnondolup.brahmanbaria.gov.bd
4807	\N	Haripur	হরিপুর	haripurup.brahmanbaria.gov.bd
4808	\N	Purbabhag	পূর্বভাগ	purbabhagup.brahmanbaria.gov.bd
4809	\N	Gokarna	গোকর্ণ	gokarnaup.brahmanbaria.gov.bd
4810	\N	Auraol	অরুয়াইল	auraolup.brahmanbaria.gov.bd
4811	\N	Pakshimuul	পাকশিমুল	pakshimuulup.brahmanbaria.gov.bd
4812	\N	Chunta	চুন্টা	chuntaup.brahmanbaria.gov.bd
4813	\N	Kalikaccha	কালীকচ্ছ	kalikacchaup.brahmanbaria.gov.bd
4814	\N	Panishor	পানিশ্বর	panishorup.brahmanbaria.gov.bd
4815	\N	Sarail	সরাইল সদর	sarailup.brahmanbaria.gov.bd
4816	\N	Noagoun	নোয়াগাঁও	noagounup.brahmanbaria.gov.bd
4817	\N	Shahajadapur	শাহজাদাপুর	shahajadapurup.brahmanbaria.gov.bd
4818	\N	Shahbazpur	শাহবাজপুর	shahbazpurup.brahmanbaria.gov.bd
4819	\N	Ashuganj	আশুগঞ্জ সদর	ashuganjup.brahmanbaria.gov.bd
4820	\N	Charchartala	চরচারতলা	charchartalaup.brahmanbaria.gov.bd
4821	\N	Durgapur	দুর্গাপুর	durgapurup.brahmanbaria.gov.bd
4822	\N	Araishidha	আড়াইসিধা	araishidhaup.brahmanbaria.gov.bd
4823	\N	Talshaharw	তালশহর(পঃ)	talshaharwup.brahmanbaria.gov.bd
4824	\N	Sarifpur	শরীফপুর	sarifpurup.brahmanbaria.gov.bd
4825	\N	Lalpur	লালপুর	lalpurup.brahmanbaria.gov.bd
4826	\N	Tarua	তারুয়া	taruaup.brahmanbaria.gov.bd
4827	\N	Monionda	মনিয়ন্দ	moniondaup.brahmanbaria.gov.bd
4828	\N	Dharkhar	ধরখার	dharkharup.brahmanbaria.gov.bd
4829	\N	Mogra	মোগড়া	mograup.brahmanbaria.gov.bd
4830	\N	Akhauran	আখাউড়া (উঃ)	akhauranup.brahmanbaria.gov.bd
4831	\N	Akhauras	আখাউড়া (দঃ)	akhaurasup.brahmanbaria.gov.bd
4832	\N	Barail	বড়াইল	barailup.brahmanbaria.gov.bd
4833	\N	Birgaon	বীরগাঁও	birgaonup.brahmanbaria.gov.bd
4834	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.brahmanbaria.gov.bd
4835	\N	Nathghar	নাটঘর	nathgharup.brahmanbaria.gov.bd
4836	\N	Biddayakut	বিদ্যাকুট	biddayakutup.brahmanbaria.gov.bd
4837	\N	Nabinagare	নবীনগর (পূর্ব)	nabinagareup.brahmanbaria.gov.bd
4838	\N	Nabinagarw	নবীনগর(পশ্চিম)	nabinagarwup.brahmanbaria.gov.bd
4839	\N	Bitghar	বিটঘর	bitgharup.brahmanbaria.gov.bd
4840	\N	Shibpur	শিবপুর	shibpurup.brahmanbaria.gov.bd
4841	\N	Sreerampur	শ্রীরামপুর	sreerampurup.brahmanbaria.gov.bd
4842	\N	Jinudpur	জিনোদপুর	jinudpurup.brahmanbaria.gov.bd
4843	\N	Laurfatehpur	লাউরফতেপুর	laurfatehpurup.brahmanbaria.gov.bd
4844	\N	Ibrahimpur	ইব্রাহিমপুর	ibrahimpurup.brahmanbaria.gov.bd
4845	\N	Satmura	সাতমোড়া	satmuraup.brahmanbaria.gov.bd
4846	\N	Shamogram	শ্যামগ্রাম	shamogramup.brahmanbaria.gov.bd
4847	\N	Rasullabad	রসুল্লাবাদ	rasullabadup.brahmanbaria.gov.bd
4848	\N	Barikandi	বড়িকান্দি	barikandiup.brahmanbaria.gov.bd
4849	\N	Salimganj	ছলিমগঞ্জ	salimganjup.brahmanbaria.gov.bd
4850	\N	Ratanpur	রতনপুর	ratanpurup.brahmanbaria.gov.bd
4851	\N	Kaitala (North)	কাইতলা (উত্তর)	kaitalanup.brahmanbaria.gov.bd
4852	\N	Kaitala (South)	কাইতলা (দক্ষিন)	kaitalasup.brahmanbaria.gov.bd
4853	\N	Tazkhali	তেজখালী	tazkhaliup.brahmanbaria.gov.bd
4854	\N	Pahariya Kandi	পাহাড়িয়া কান্দি	pahariyakandiup.brahmanbaria.gov.bd
4855	\N	Dariadulat	দরিয়াদৌলত	dariadulatup.brahmanbaria.gov.bd
4856	\N	Sonarampur	সোনারামপুর	sonarampurup.brahmanbaria.gov.bd
4857	\N	Darikandi	দড়িকান্দি	darikandiup.brahmanbaria.gov.bd
4858	\N	Saifullyakandi	ছয়ফুল্লাকান্দি	saifullyakandiup.brahmanbaria.gov.bd
4859	\N	Bancharampur	বাঞ্ছারামপুর	bancharampurup.brahmanbaria.gov.bd
4860	\N	Ayabpur	আইয়ুবপুর	ayabpurup.brahmanbaria.gov.bd
4861	\N	Fardabad	ফরদাবাদ	fardabadup.brahmanbaria.gov.bd
4862	\N	Rupushdi	রুপসদী পশ্চিম	rupushdiup.brahmanbaria.gov.bd
4863	\N	Salimabad	ছলিমাবাদ	salimabadup.brahmanbaria.gov.bd
4864	\N	Ujanchar	উজানচর পূর্ব	ujancharup.brahmanbaria.gov.bd
4865	\N	Manikpur	মানিকপুর	manikpurup.brahmanbaria.gov.bd
4866	\N	Bhudanty	বুধন্তি	bhudantyup.brahmanbaria.gov.bd
4867	\N	Chandura	চান্দুরা	chanduraup.brahmanbaria.gov.bd
4868	\N	Ichapura	ইছাপুরা	ichapuraup.brahmanbaria.gov.bd
4869	\N	Champaknagar	চম্পকনগর	champaknagarup.brahmanbaria.gov.bd
4870	\N	Harashpur	হরষপুর	harashpurup.brahmanbaria.gov.bd
4871	\N	Pattan	পত্তন	pattanup.brahmanbaria.gov.bd
4872	\N	Singerbil	সিংগারবিল	singerbilup.brahmanbaria.gov.bd
4873	\N	Bishupor	বিষ্ণুপুর	bishuporup.brahmanbaria.gov.bd
4874	\N	Charislampur	চর-ইসলামপুর	charislampurup.brahmanbaria.gov.bd
4875	\N	Paharpur	পাহাড়পুর	paharpurup.brahmanbaria.gov.bd
4876	\N	Jibtali	জীবতলি	jibtaliup.rangamati.gov.bd
4877	\N	Sapchari	সাপছড়ি	sapchariup.rangamati.gov.bd
4878	\N	Kutukchari	কুতুকছড়ি	kutukchariup.rangamati.gov.bd
4879	\N	Bandukbhanga	বন্দুকভাঙ্গা	bandukbhangaup.rangamati.gov.bd
4880	\N	Balukhali	বালুখালী	balukhaliup.rangamati.gov.bd
4881	\N	Mogban	মগবান	mogbanup.rangamati.gov.bd
4882	\N	Raikhali	রাইখালী	raikhaliup.rangamati.gov.bd
4883	\N	Kaptai	কাপ্তাই	kaptaiup.rangamati.gov.bd
4884	\N	Wagga	ওয়াজ্ঞা	waggaup.rangamati.gov.bd
4885	\N	Chandraghona	চন্দ্রঘোনা	chandraghonaup.rangamati.gov.bd
4886	\N	Chitmorom	চিৎমরম	chitmoromup.rangamati.gov.bd
4887	\N	Ghagra	ঘাগড়া	ghagraup.rangamati.gov.bd
4888	\N	Fatikchari	ফটিকছড়ি	fatikchariup.rangamati.gov.bd
4889	\N	Betbunia	বেতবুনিয়া	betbuniaup.rangamati.gov.bd
4890	\N	Kalampati	কলমপতি	kalampatiup.rangamati.gov.bd
4891	\N	Sajek	সাজেক	sajekup.rangamati.gov.bd
4892	\N	Amtali	আমতলী	amtaliup.rangamati.gov.bd
4893	\N	Bongoltali	বঙ্গলতলী	bongoltaliup.rangamati.gov.bd
4894	\N	Rupokari	রুপকারী	rupokariup.rangamati.gov.bd
4895	\N	Marisha	মারিশ্যা	marishaup.rangamati.gov.bd
4896	\N	Khedarmara	খেদারমারা	khedarmaraup.rangamati.gov.bd
4897	\N	Sharoyatali	সারোয়াতলী	sharoyataliup.rangamati.gov.bd
4898	\N	Baghaichari	বাঘাইছড়ি	baghaichariup.rangamati.gov.bd
4899	\N	Subalong	সুবলং	subalongup.rangamati.gov.bd
4900	\N	Barkal	বরকল	barkalup.rangamati.gov.bd
4901	\N	Bushanchara	ভূষনছড়া	bushancharaup.rangamati.gov.bd
4902	\N	Aimachara	আইমাছড়া	aimacharaup.rangamati.gov.bd
4903	\N	Borohorina	বড় হরিণা	borohorinaup.rangamati.gov.bd
4904	\N	Langad	লংগদু	langaduup.rangamati.gov.bd
4905	\N	Maeinimukh	মাইনীমুখ	maeinimukhup.rangamati.gov.bd
4906	\N	Vasannadam	ভাসান্যাদম	vasannadamup.rangamati.gov.bd
4907	\N	Bogachattar	বগাচতর	bogachattarup.rangamati.gov.bd
4908	\N	Gulshakhali	গুলশাখালী	gulshakhaliup.rangamati.gov.bd
4909	\N	Kalapakujja	কালাপাকুজ্যা	kalapakujjaup.rangamati.gov.bd
4910	\N	Atarakchara	আটারকছড়া	atarakcharaup.rangamati.gov.bd
4911	\N	Ghilachari	ঘিলাছড়ি	ghilachariup.rangamati.gov.bd
4912	\N	Gaindya	গাইন্দ্যা	gaindyaup.rangamati.gov.bd
4913	\N	Bangalhalia	বাঙ্গালহালিয়া	bangalhaliaup.rangamati.gov.bd
4914	\N	Kengrachari	কেংড়াছড়ি	kengrachariup.rangamati.gov.bd
4915	\N	Belaichari	বিলাইছড়ি	belaichariup.rangamati.gov.bd
4916	\N	Farua	ফারুয়া	faruaup.rangamati.gov.bd
4917	\N	Juraichari	জুরাছড়ি	juraichariup.rangamati.gov.bd
4918	\N	Banajogichara	বনযোগীছড়া	banajogicharaup.rangamati.gov.bd
4919	\N	Moidong	মৈদং	moidongup.rangamati.gov.bd
4920	\N	Dumdumya	দুমদুম্যা	dumdumyaup.rangamati.gov.bd
4921	\N	Sabekkhong	সাবেক্ষ্যং	sabekkhongup.rangamati.gov.bd
4922	\N	Naniarchar	নানিয়ারচর	naniarcharup.rangamati.gov.bd
4923	\N	Burighat	বুড়িঘাট	burighatup.rangamati.gov.bd
4924	\N	Ghilachhari	ঘিলাছড়ি	ghilachhariup.rangamati.gov.bd
4925	\N	Charmatua	চরমটুয়া	charmatuaup.noakhali.gov.bd
4926	\N	Dadpur	দাদপুর	dadpurup.noakhali.gov.bd
4927	\N	Noannoi	নোয়ান্নই	noannoiup.noakhali.gov.bd
4928	\N	Kadirhanif	কাদির হানিফ	kadirhanifup.noakhali.gov.bd
4929	\N	Binodpur	বিনোদপুর	binodpurup.noakhali.gov.bd
4930	\N	Dharmapur	ধর্মপুর	dharmapurup.noakhali.gov.bd
4931	\N	Aujbalia	এওজবালিয়া	aujbaliaup.noakhali.gov.bd
4932	\N	Kaladara	কালাদরপ	kaladarapup.noakhali.gov.bd
4933	\N	Ashwadia	অশ্বদিয়া	ashwadiaup.noakhali.gov.bd
4934	\N	Newajpur	নিয়াজপুর	newajpurup.noakhali.gov.bd
4935	\N	East Charmatua	পূর্ব চরমটুয়া	eastcharmatuap.noakhali.gov.bd
4936	\N	Andarchar	আন্ডারচর	andarcharup.noakhali.gov.bd
4937	\N	Noakhali	নোয়াখালী	noakhaliup.noakhali.gov.bd
4938	\N	Sirajpur	সিরাজপুর	sirajpurup.noakhali.gov.bd
4939	\N	Charparboti	চরপার্বতী	charparbotiup.noakhali.gov.bd
4940	\N	Charhazari	চরহাজারী	charhazariup.noakhali.gov.bd
4941	\N	Charkakra	চরকাঁকড়া	charkakraup.noakhali.gov.bd
4942	\N	Charfakira	চরফকিরা	charfakiraup.noakhali.gov.bd
4943	\N	Musapur	মুসাপুর	musapurup.noakhali.gov.bd
4944	\N	Charelahi	চরএলাহী	charelahiup.noakhali.gov.bd
4945	\N	Rampur	রামপুর	rampurup.noakhali.gov.bd
4946	\N	Amanullapur	আমানউল্ল্যাপুর	amanullapurup.noakhali.gov.bd
4947	\N	Gopalpur	গোপালপুর	gopalpurup.noakhali.gov.bd
4948	\N	Jirtali	জিরতলী	jirtaliup.noakhali.gov.bd
4949	\N	Kutubpur	কুতবপুর	kutubpurup.noakhali.gov.bd
4950	\N	Alyearpur	আলাইয়ারপুর	alyearpurup.noakhali.gov.bd
4951	\N	Chayani	ছয়ানী	chayaniup.noakhali.gov.bd
4952	\N	Rajganj	রাজগঞ্জ	rajganjup.noakhali.gov.bd
4953	\N	Eklashpur	একলাশপুর	eklashpurup.noakhali.gov.bd
4954	\N	Begumganj	বেগমগঞ্জ	begumganjup.noakhali.gov.bd
4955	\N	Mirwarishpur	মিরওয়ারিশপুর	mirwarishpurup.noakhali.gov.bd
4956	\N	Narottampur	নরোত্তমপুর	narottampurup.noakhali.gov.bd
4957	\N	Durgapur	দূর্গাপুর	durgapurup.noakhali.gov.bd
4958	\N	Rasulpur	রসুলপুর	rasulpurup.noakhali.gov.bd
4959	\N	Hajipur	হাজীপুর	hajipurup.noakhali.gov.bd
4960	\N	Sharifpur	শরীফপুর	sharifpurup.noakhali.gov.bd
4961	\N	Kadirpur	কাদিরপুর	kadirpurup.noakhali.gov.bd
4962	\N	Sukhchar	সুখচর	sukhcharup.noakhali.gov.bd
4963	\N	Nolchira	নলচিরা	nolchiraup.noakhali.gov.bd
4964	\N	Charishwar	চরঈশ্বর	charishwarup.noakhali.gov.bd
4965	\N	Charking	চরকিং	charkingup.noakhali.gov.bd
4966	\N	Tomoroddi	তমরদ্দি	tomoroddiup.noakhali.gov.bd
4967	\N	Sonadiya	সোনাদিয়া	sonadiyaup.noakhali.gov.bd
4968	\N	Burirchar	বুড়িরচর	burircharup.noakhali.gov.bd
4969	\N	Jahajmara	জাহাজমারা	jahajmaraup.noakhali.gov.bd
4970	\N	Nijhumdwi	নিঝুমদ্বীপ	nijhumdwipup.noakhali.gov.bd
4971	\N	Charjabbar	চরজাব্বার	charjabbarup.noakhali.gov.bd
4972	\N	Charbata	চরবাটা	charbataup.noakhali.gov.bd
4973	\N	Charclerk	চরক্লার্ক	charclerkup.noakhali.gov.bd
4974	\N	Charwapda	চরওয়াপদা	charwapdaup.noakhali.gov.bd
4975	\N	Charjubilee	চরজুবলী	charjubileeup.noakhali.gov.bd
4976	\N	Charaman Ullah	চরআমান উল্যা	charamanullahup.noakhali.gov.bd
4977	\N	East Charbata	পূর্ব চরবাটা	eastcharbataup.noakhali.gov.bd
4978	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.noakhali.gov.bd
4979	\N	Narottampur	নরোত্তমপুর	narottampurup1.noakhali.gov.bd
4980	\N	Dhanshiri	ধানসিঁড়ি	dhanshiriup.noakhali.gov.bd
4981	\N	Sundalpur	সুন্দলপুর	sundalpurup.noakhali.gov.bd
4982	\N	Ghoshbag	ঘোষবাগ	ghoshbagup.noakhali.gov.bd
4983	\N	Chaprashirhat	চাপরাশিরহাট	chaprashirhatup.noakhali.gov.bd
4984	\N	Dhanshalik	ধানশালিক	dhanshalikup.noakhali.gov.bd
4985	\N	Batoiya	বাটইয়া	batoiyaup.noakhali.gov.bd
4986	\N	Chhatarpaia	ছাতারপাইয়া	chhatarpaiaup.noakhali.gov.bd
4987	\N	Kesharpar	কেশরপাড়া	kesharparup.noakhali.gov.bd
4988	\N	Dumurua	ডুমুরুয়া	dumuruaup.noakhali.gov.bd
4989	\N	Kadra	কাদরা	kadraup.noakhali.gov.bd
4990	\N	Arjuntala	অর্জুনতলা	arjuntalaup.noakhali.gov.bd
4991	\N	Kabilpur	কাবিলপুর	kabilpurup.noakhali.gov.bd
4992	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup7.noakhali.gov.bd
4993	\N	Nabipur	নবীপুর	nabipurup.noakhali.gov.bd
4994	\N	Bejbagh	বিজবাগ	bejbaghup.noakhali.gov.bd
4995	\N	Sahapur	সাহাপুর	sahapurup.noakhali.gov.bd
4996	\N	Ramnarayanpur	রামনারায়নপুর	ramnarayanpurup.noakhali.gov.bd
4997	\N	Porokote	পরকোট	porokoteup.noakhali.gov.bd
4998	\N	Badalkot	বাদলকোট	badalkotup.noakhali.gov.bd
4999	\N	Panchgaon	পাঁচগাঁও	panchgaonup.noakhali.gov.bd
5000	\N	Hat-Pukuria Ghatlabag	হাট-পুকুরিয়া ঘাটলাবাগ	hatpukuriaghatlabagup.noakhali.gov.bd
5001	\N	Noakhala	নোয়াখলা	noakhalaup.noakhali.gov.bd
5002	\N	Khilpara	খিলপাড়া	khilparaup.noakhali.gov.bd
5003	\N	Mohammadpur	মোহাম্মদপুর	mohammadpuru5p.noakhali.gov.bd
5004	\N	Joyag	জয়াগ	joyagup.noakhali.gov.bd
5005	\N	Nodona	নদনা	nodonaup.noakhali.gov.bd
5006	\N	Chashirhat	চাষীরহাট	chashirhatup.noakhali.gov.bd
5007	\N	Barogaon	বারগাঁও	barogaonup.noakhali.gov.bd
5008	\N	Ambarnagor	অম্বরনগর	ambarnagorup.noakhali.gov.bd
5009	\N	Nateshwar	নাটেশ্বর	nateshwarup.noakhali.gov.bd
5010	\N	Bajra	বজরা	bajraup.noakhali.gov.bd
5011	\N	Sonapur	সোনাপুর	sonapurup.noakhali.gov.bd
5012	\N	Deoti	দেওটি	deotiup.noakhali.gov.bd
5013	\N	Amishapara	আমিশাপাড়া	amishaparaup.noakhali.gov.bd
5014	\N	Gazipur	গাজীপুর	gazipurup.chandpur.gov.bd
5015	\N	Algidurgapur (North)	আলগী দুর্গাপুর (উত্তর)	algidurgapurnorthup.chandpur.gov.bd
5016	\N	Algidurgapur (South)	আলগী দুর্গাপুর (দক্ষিণ)	algidurgapursouth.chandpur.gov.bd
5017	\N	Nilkamal	নীলকমল	nilkamalup.chandpur.gov.bd
5018	\N	Haimchar	হাইমচর	haimcharup.chandpur.gov.bd
5019	\N	Charbhairabi	চরভৈরবী	charbhairabiup.chandpur.gov.bd
5020	\N	Pathair	পাথৈর	pathairup.chandpur.gov.bd
5021	\N	Bitara	বিতারা	bitaraup.chandpur.gov.bd
5022	\N	Shohodebpur (East)	সহদেবপুর (পূর্ব)	shohodebpureastup.chandpur.gov.bd
5023	\N	Shohodebpur (West)	সহদেবপুর (পশ্চিম)	shohodebpurwestup.chandpur.gov.bd
5024	\N	Kachua (North)	কচুয়া (উত্তর)	kachuanorthup.chandpur.gov.bd
5025	\N	Kachua (South)	কচুয়া (দক্ষিণ)	kachuasouthup.chandpur.gov.bd
5026	\N	Gohat (North)	গোহাট (উত্তর)	gohatnorthup.chandpur.gov.bd
5027	\N	Kadla	কাদলা	kadlaup.chandpur.gov.bd
5028	\N	Ashrafpur	আসরাফপুর	ashrafpurup.chandpur.gov.bd
5029	\N	Gohat (South)	গোহাট (দক্ষিণ)	gohatsouthup.chandpur.gov.bd
5030	\N	Sachar	সাচার	sacharup.chandpur.gov.bd
5031	\N	Koroia	কড়ইয়া	koroiaup.chandpur.gov.bd
5032	\N	Tamta (South)	টামটা (দক্ষিণ)	tamtasouthup.chandpur.gov.bd
5033	\N	Tamta (North)	টামটা (উত্তর)	tamtanorthup.chandpur.gov.bd
5034	\N	Meher (North)	মেহের (উত্তর)	mehernorthup.chandpur.gov.bd
5035	\N	Meher (South)	মেহের (দক্ষিণ)	mehersouthup.chandpur.gov.bd
5036	\N	Suchipara (North)	সুচিপাড়া (উত্তর)	suchiparanorthup.chandpur.gov.bd
5037	\N	Suchipara (South)	সুচিপাড়া (দক্ষিণ)	suchiparasouthup.chandpur.gov.bd
5038	\N	Chitoshi (East)	চিতষী (পূর্ব)	chitoshieastup.chandpur.gov.bd
5039	\N	Raysree (South)	রায়শ্রী (দক্ষিন)	raysreesouthup.chandpur.gov.bd
5040	\N	Raysree (North)	রায়শ্রী (উত্তর)	raysreenorthup.chandpur.gov.bd
5041	\N	Chitoshiwest	চিতষী (পশ্চিম)	chitoshiwestup.chandpur.gov.bd
5042	\N	Bishnapur	বিষ্ণপুর	bishnapurup.chandpur.gov.bd
5043	\N	Ashikati	আশিকাটি	ashikatiup.chandpur.gov.bd
5044	\N	Shahmahmudpur	শাহ্‌ মাহমুদপুর	shahmahmudpurup.chandpur.gov.bd
5045	\N	Kalyanpur	কল্যাণপুর	kalyanpurup.chandpur.gov.bd
5046	\N	Rampur	রামপুর	rampurup.chandpur.gov.bd
5047	\N	Maishadi	মৈশাদী	maishadiup.chandpur.gov.bd
5048	\N	Tarpurchandi	তরপুচন্ডী	tarpurchandiup.chandpur.gov.bd
5049	\N	Baghadi	বাগাদী	baghadiup.chandpur.gov.bd
5050	\N	Laxmipur Model	লক্ষীপুর মডেল	laxmipurmodelup.chandpur.gov.bd
5051	\N	Hanarchar	হানারচর	hanarcharup.chandpur.gov.bd
5052	\N	Chandra	চান্দ্রা	chandraup.chandpur.gov.bd
5053	\N	Rajrajeshwar	রাজরাজেশ্বর	rajrajeshwarup.chandpur.gov.bd
5054	\N	Ibrahimpur	ইব্রাহীমপুর	ibrahimpurup.chandpur.gov.bd
5055	\N	Balia	বালিয়া	baliaup.chandpur.gov.bd
5056	\N	Nayergaon (North)	নায়েরগাঁও (উত্তর)	nayergaonnorthup.chandpur.gov.bd
5057	\N	Nayergaon (South)	নায়েরগাঁও (দক্ষিন)	nayergaonsouthup.chandpur.gov.bd
5058	\N	Khadergaon	খাদেরগাঁও	khadergaonup.chandpur.gov.bd
5059	\N	Narayanpur	নারায়নপুর	narayanpurup.chandpur.gov.bd
5060	\N	Upadi (South)	উপাদী (দক্ষিণ)	upadisouthup.chandpur.gov.bd
5061	\N	Upadi (North)	উপাদী (উত্তর)	upadinorthup.chandpur.gov.bd
5062	\N	Rajargaon (North)	রাজারগাঁও (উত্তর)	rajargaonnorthup.chandpur.gov.bd
5063	\N	Bakila	বাকিলা	bakilaup.chandpur.gov.bd
5064	\N	Kalocho (North)	কালচোঁ (উত্তর)	kalochonorthup.chandpur.gov.bd
5065	\N	Hajiganj Sadar	হাজীগঞ্জ সদর	hajiganjsadarup.chandpur.gov.bd
5066	\N	Kalocho (South)	কালচোঁ (দক্ষিণ)	kalochosouthup.chandpur.gov.bd
5067	\N	Barkul (East)	বড়কুল (পূর্ব)	barkuleastup.chandpur.gov.bd
5068	\N	Barkul (West)	বড়কুল (পশ্চিম)	barkulwestup.chandpur.gov.bd
5069	\N	Hatila (East)	হাটিলা (পূর্ব)	hatilaeastup.chandpur.gov.bd
5070	\N	Hatila (West)	হাটিলা (পশ্চিম)	hatilawestup.chandpur.gov.bd
5071	\N	Gandharbapur (North)	গন্ধর্ব্যপুর (উত্তর)	gandharbapurnorthup.chandpur.gov.bd
5072	\N	Gandharbapur (South)	গন্ধর্ব্যপুর (দক্ষিণ)	gandharbapursouthup.chandpur.gov.bd
5073	\N	Satnal	ষাটনল	satnalup.chandpur.gov.bd
5074	\N	Banganbari	বাগানবাড়ী	banganbariup.chandpur.gov.bd
5075	\N	Sadullapur	সাদুল্ল্যাপুর	sadullapurup.chandpur.gov.bd
5076	\N	Durgapur	দূর্গাপুর	durgapurup.chandpur.gov.bd
5077	\N	Kalakanda	কালাকান্দা	kalakandaup.chandpur.gov.bd
5078	\N	Mohanpur	মোহনপুর	mohanpurup.chandpur.gov.bd
5079	\N	Eklaspur	এখলাছপুর	eklaspurup.chandpur.gov.bd
5080	\N	Jahirabad	জহিরাবাদ	jahirabadup.chandpur.gov.bd
5081	\N	Fatehpur (East)	ফতেহপুর (পূর্ব)	eastfatehpur.chandpur.gov.bd
5082	\N	Fatehpur (West)	ফতেহপুর (পশ্চিম)	westfatehpurup.chandpur.gov.bd
5083	\N	Farajikandi	ফরাজীকান্দি	farajikandiup.chandpur.gov.bd
5084	\N	Islamabad	ইসলামাবাদ	islamabadup.chandpur.gov.bd
5085	\N	Sultanabad	সুলতানাবাদ	sultanabadup.chandpur.gov.bd
5086	\N	Gazra	গজরা	gazraup.chandpur.gov.bd
5087	\N	Balithuba (West)	বালিথুবা (পশ্চিম)	balithubawestup.chandpur.gov.bd
5088	\N	Balithuba (East)	বালিথুবা (পূর্ব)	balithubaeastup.chandpur.gov.bd
5089	\N	Subidpur (East)	সুবিদপুর (পূর্ব)	subidpureastup.chandpur.gov.bd
5090	\N	Subidpur (West)	সুবিদপুর (পশ্চিম)	subidpurwestup.chandpur.gov.bd
5091	\N	Gupti (West)	গুপ্তি (পশ্চিম)	guptiwestup.chandpur.gov.bd
5092	\N	Gupti (East)	গুপ্তি (পূর্ব)	guptieastup.chandpur.gov.bd
5093	\N	Paikpara (North)	পাইকপাড়া (উত্তর)	paikparanorthup.chandpur.gov.bd
5094	\N	Paikpara (South)	পাইকপাড়া (দক্ষিণ)	paikparasouthup.chandpur.gov.bd
5095	\N	Gobindapur (North)	গবিন্দপুর (উত্তর)	gobindapurnorthup.chandpur.gov.bd
5096	\N	Gobindapur (South)	গবিন্দপুর (দক্ষিণ)	gobindapursouthup.chandpur.gov.bd
5097	\N	Chardukhia (East)	চরদুখিয়া (পূর্ব)	chardukhiaeastup.chandpur.gov.bd
5098	\N	Chardukhia (West)	চরদুঃখিয়া (পশ্চিম)	chardukhiawestup.chandpur.gov.bd
5099	\N	Faridgonj (South)	ফরিদ্গঞ্জ (দক্ষিণ)	faridgonjsouthup.chandpur.gov.bd
5100	\N	Rupsha (South)	রুপসা (দক্ষিণ)	rupshasouthup.chandpur.gov.bd
5101	\N	Rupsha (North)	রুপসা (উত্তর)	rupshanorthup.chandpur.gov.bd
5102	\N	Hamsadi (North)	হামছাদী (উত্তর)	northhamsadiup.lakshmipur.gov.bd
5103	\N	Hamsadi (South)	হামছাদী (দক্ষিন)	southhamsadiup.lakshmipur.gov.bd
5104	\N	Dalalbazar	দালাল বাজার	dalalbazarup.lakshmipur.gov.bd
5105	\N	Charruhita	চররুহিতা	charruhitaup.lakshmipur.gov.bd
5106	\N	Parbotinagar	পার্বতীনগর	parbotinagarup.lakshmipur.gov.bd
5107	\N	Bangakha	বাঙ্গাখাঁ	bangakhaup.lakshmipur.gov.bd
5108	\N	Dattapara	দত্তপাড়া	dattaparaup.lakshmipur.gov.bd
5109	\N	Basikpur	বশিকপুর	basikpurup.lakshmipur.gov.bd
5110	\N	Chandrogonj	চন্দ্রগঞ্জ	chandrogonjup.lakshmipur.gov.bd
5111	\N	Nourthjoypur	উত্তর জয়পুর	nourthjoypurup.lakshmipur.gov.bd
5112	\N	Hazirpara	হাজিরপাড়া	hazirparaup.lakshmipur.gov.bd
5113	\N	Charshahi	চরশাহী	charshahiup.lakshmipur.gov.bd
5114	\N	Digli	দিঘলী	digliup.lakshmipur.gov.bd
5115	\N	Laharkandi	লাহারকান্দি	laharkandiup.lakshmipur.gov.bd
5116	\N	Vobanigonj	ভবানীগঞ্জ	vobanigonjup.lakshmipur.gov.bd
5117	\N	Kusakhali	কুশাখালী	kusakhaliup.lakshmipur.gov.bd
5118	\N	Sakchor	শাকচর	sakchorup.lakshmipur.gov.bd
5119	\N	Tearigonj	তেয়ারীগঞ্জ	tearigonjup.lakshmipur.gov.bd
5120	\N	Tumchor	টুমচর	tumchorup.lakshmipur.gov.bd
5121	\N	Charramoni Mohon	চররমনী মোহন	charramonimohonup.lakshmipur.gov.bd
5122	\N	Charkalkini	চর কালকিনি	charkalkiniup.lakshmipur.gov.bd
5123	\N	Shaheberhat	সাহেবেরহাট	shaheberhatup.lakshmipur.gov.bd
5124	\N	Char Martin	চর মার্টিন	charmartinup.lakshmipur.gov.bd
5125	\N	Char Folcon	চর ফলকন	charfolconup.lakshmipur.gov.bd
5126	\N	Patarirhat	পাটারীরহাট	patarirhatup.lakshmipur.gov.bd
5127	\N	Hajirhat	হাজিরহাট	hajirhatup.lakshmipur.gov.bd
5128	\N	Char Kadira	চর কাদিরা	charkadiraup.lakshmipur.gov.bd
5129	\N	Torabgonj	তোরাবগঞ্জ	torabgonjup.lakshmipur.gov.bd
5130	\N	Charlorench	চর লরেঞ্চ	charlorenchup.lakshmipur.gov.bd
5131	\N	North Char Ababil	উত্তর চর আবাবিল	northcharababilup.lakshmipur.gov.bd
5132	\N	North Char Bangshi	উত্তর চর বংশী	northcharbangshiup.lakshmipur.gov.bd
5133	\N	Char Mohana	চর মোহনা	charmohanaup.lakshmipur.gov.bd
5134	\N	Sonapur	সোনাপুর	sonapurup.lakshmipur.gov.bd
5135	\N	Charpata	চর পাতা	charpataup.lakshmipur.gov.bd
5136	\N	Bamni	বামনী	bamniup.lakshmipur.gov.bd
5137	\N	South Char Bangshi	দক্ষিন চর বংশী	southcharbangshiup.lakshmipur.gov.bd
5138	\N	South Char Ababil	দক্ষিন চর আবাবিল	southcharababilup.lakshmipur.gov.bd
5139	\N	Raipur	রায়পুর	raipurup.lakshmipur.gov.bd
5140	\N	Keora	কেরোয়া	keoraup.lakshmipur.gov.bd
5141	\N	Char Poragacha	চর পোড়াগাছা	charporagachaup.lakshmipur.gov.bd
5142	\N	Charbadam	চর বাদাম	charbadamup.lakshmipur.gov.bd
5143	\N	Char Abdullah	চর আবদুল্যাহ	charabdullahup.lakshmipur.gov.bd
5144	\N	Alxendar	আলেকজান্ডার	alxendarup.lakshmipur.gov.bd
5145	\N	Char Algi	চর আলগী	charalgiup.lakshmipur.gov.bd
5146	\N	Char Ramiz	চর রমিজ	charramizup.lakshmipur.gov.bd
5147	\N	Borokheri	বড়খেড়ী	borokheriup.lakshmipur.gov.bd
5148	\N	Chargazi	চরগাজী	chargaziup.lakshmipur.gov.bd
5149	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.lakshmipur.gov.bd
5150	\N	Noagaon	নোয়াগাঁও	noagaonup.lakshmipur.gov.bd
5151	\N	Bhadur	ভাদুর	bhadurup.lakshmipur.gov.bd
5152	\N	Ichhapur	ইছাপুর	ichhapurup.lakshmipur.gov.bd
5153	\N	Chandipur	চন্ডিপুর	chandipurup.lakshmipur.gov.bd
5154	\N	Lamchar	লামচর	lamcharup.lakshmipur.gov.bd
5155	\N	Darbeshpur	দরবেশপুর	darbeshpurup.lakshmipur.gov.bd
5156	\N	Karpara	করপাড়া	karparaup.lakshmipur.gov.bd
5157	\N	Bholakot	ভোলাকোট	bholakotup.lakshmipur.gov.bd
5158	\N	Bhatra	ভাটরা	bhatraup.lakshmipur.gov.bd
5159	\N	Rajanagar	রাজানগর	rajanagarup.chittagong.gov.bd
5160	\N	Hosnabad	হোছনাবাদ	hosnabadup.chittagong.gov.bd
5161	\N	Swanirbor Rangunia	স্বনির্ভর রাঙ্গুনিয়া	swanirborranguniaup.chittagong.gov.bd
5162	\N	Mariumnagar	মরিয়মনগর	mariumnagarup.chittagong.gov.bd
5163	\N	Parua	পারুয়া	paruaup.chittagong.gov.bd
5164	\N	Pomra	পোমরা	pomraup.chittagong.gov.bd
5165	\N	Betagi	বেতাগী	betagiup.chittagong.gov.bd
5166	\N	Sharafbhata	সরফভাটা	sharafbhataup.chittagong.gov.bd
5167	\N	Shilok	শিলক	shilokup.chittagong.gov.bd
5168	\N	Chandraghona	চন্দ্রঘোনা	chandraghonaup.chittagong.gov.bd
5169	\N	Kodala	কোদালা	kodalaup.chittagong.gov.bd
5170	\N	Islampur	ইসলামপুর	islampurup.chittagong.gov.bd
5171	\N	South Rajanagar	দক্ষিণ রাজানগর	southrajanagarup.chittagong.gov.bd
5172	\N	Lalanagar	লালানগর	lalanagarup.chittagong.gov.bd
5173	\N	Kumira	কুমিরা	kumiraup.chittagong.gov.bd
5174	\N	Banshbaria	বাঁশবারীয়া	banshbariaup.chittagong.gov.bd
5175	\N	Barabkunda	বারবকুন্ড	barabkundaup.chittagong.gov.bd
5176	\N	Bariadyala	বাড়িয়াডিয়ালা	bariadyalaup.chittagong.gov.bd
5177	\N	Muradpur	মুরাদপুর	muradpurup.chittagong.gov.bd
5178	\N	Saidpur	সাঈদপুর	saidpurup.chittagong.gov.bd
5179	\N	Salimpur	সালিমপুর	salimpurup.chittagong.gov.bd
5180	\N	Sonaichhari	সোনাইছড়ি	sonaichhariup.chittagong.gov.bd
5181	\N	Bhatiari	ভাটিয়ারী	bhatiariup.chittagong.gov.bd
5182	\N	Korerhat	করেরহাট	korerhatup.chittagong.gov.bd
5183	\N	Hinguli	হিংগুলি	hinguliup.chittagong.gov.bd
5184	\N	Jorarganj	জোরারগঞ্জ	jorarganjup.chittagong.gov.bd
5185	\N	Dhoom	ধুম	dhoomup.chittagong.gov.bd
5186	\N	Osmanpur	ওসমানপুর	osmanpurup.chittagong.gov.bd
5187	\N	Ichakhali	ইছাখালী	ichakhaliup.chittagong.gov.bd
5188	\N	Katachhara	কাটাছরা	katachharaup.chittagong.gov.bd
5189	\N	Durgapur	দূর্গাপুর	durgapurup.chittagong.gov.bd
5190	\N	Mirsharai	মীরসরাই	mirsharaiup.chittagong.gov.bd
5191	\N	Mithanala	মিঠানালা	mithanalaup.chittagong.gov.bd
5192	\N	Maghadia	মঘাদিয়া	maghadiaup.chittagong.gov.bd
5193	\N	Khaiyachhara	খৈয়াছরা	khaiyachharaup.chittagong.gov.bd
5194	\N	Mayani	মায়ানী	mayaniup.chittagong.gov.bd
5195	\N	Haitkandi	হাইতকান্দি	haitkandiup.chittagong.gov.bd
5196	\N	Wahedpur	ওয়াহেদপুর	wahedpurup.chittagong.gov.bd
5197	\N	Saherkhali	সাহেরখালী	saherkhaliup.chittagong.gov.bd
5198	\N	Asia	আশিয়া	asiaup.chittagong.gov.bd
5199	\N	Kachuai	কাচুয়াই	kachuaiup.chittagong.gov.bd
5200	\N	Kasiais	কাশিয়াইশ	kasiaisup.chittagong.gov.bd
5201	\N	Kusumpura	কুসুমপুরা	kusumpuraup.chittagong.gov.bd
5202	\N	Kelishahar	কেলিশহর	kelishaharup.chittagong.gov.bd
5203	\N	Kolagaon	কোলাগাঁও	kolagaonup.chittagong.gov.bd
5204	\N	Kharana	খরনা	kharanaup.chittagong.gov.bd
5205	\N	Char Patharghata	চর পাথরঘাটা	charpatharghataup.chittagong.gov.bd
5206	\N	Char Lakshya	চর লক্ষ্যা	charlakshyaup.chittagong.gov.bd
5207	\N	Chanhara	ছনহরা	chanharaup.chittagong.gov.bd
5208	\N	Janglukhain	জঙ্গলখাইন	janglukhainup.chittagong.gov.bd
5209	\N	Jiri	জিরি	jiriup.chittagong.gov.bd
5210	\N	Juldha	জুলধা	juldhaup.chittagong.gov.bd
5211	\N	Dakkhin Bhurshi	দক্ষিণ ভূর্ষি	dakhinbhurshiup.chittagong.gov.bd
5212	\N	Dhalghat	ধলঘাট	dhalghatup.chittagong.gov.bd
5213	\N	Bara Uthan	বড় উঠান	barauthanup.chittagong.gov.bd
5214	\N	Baralia	বরলিয়া	baraliaup.chittagong.gov.bd
5215	\N	Bhatikhain	ভাটিখাইন	bhatikhainup.chittagong.gov.bd
5216	\N	Sikalbaha	শিকলবাহা	sikalbahaup.chittagong.gov.bd
5217	\N	Sobhandandi	শোভনদন্ডী	sobhandandiup.chittagong.gov.bd
5218	\N	Habilasdwi	হাবিলাসদ্বীপ	habilasdwipup.chittagong.gov.bd
5219	\N	Haidgaon	হাইদগাঁও	haidgaonup.chittagong.gov.bd
5220	\N	Rahmatpur	রহমতপুর	rahmatpurup.chittagong.gov.bd
5221	\N	Harispur	হরিশপুর	harispurup.chittagong.gov.bd
5222	\N	Kalapania	কালাপানিয়া	kalapaniaup.chittagong.gov.bd
5223	\N	Amanullah	আমানউল্যা	amanullahup.chittagong.gov.bd
5224	\N	Santoshpur	সন্তোষপুর	santoshpurup.chittagong.gov.bd
5225	\N	Gachhua	গাছুয়া	gachhuaup.chittagong.gov.bd
5226	\N	Bauria	বাউরিয়া	bauriaup.chittagong.gov.bd
5227	\N	Haramia	হারামিয়া	haramiaup.chittagong.gov.bd
5228	\N	Magdhara	মগধরা	magdharaup.chittagong.gov.bd
5229	\N	Maitbhanga	মাইটভাঙ্গা	maitbhangaup.chittagong.gov.bd
5230	\N	Sarikait	সারিকাইত	sarikaitup.chittagong.gov.bd
5231	\N	Musapur	মুছাপুর	musapurup.chittagong.gov.bd
5232	\N	Azimpur	আজিমপুর	azimpurup.chittagong.gov.bd
5233	\N	Urirchar	উড়িরচর	urircharup.chittagong.gov.bd
5234	\N	Pukuria	পুকুরিয়া	pukuriaup.chittagong.gov.bd
5235	\N	Sadhanpur	সাধনপুর	sadhanpurup.chittagong.gov.bd
5236	\N	Khankhanabad	খানখানাবাদ	khankhanabadup.chittagong.gov.bd
5237	\N	Baharchhara	বাহারছড়া	baharchharaup.chittagong.gov.bd
5238	\N	Kalipur	কালীপুর	kalipurup.chittagong.gov.bd
5239	\N	Bailchhari	বৈলছড়ি	bailchhariup.chittagong.gov.bd
5240	\N	Katharia	কাথরিয়া	kathariaup.chittagong.gov.bd
5241	\N	Saral	সরল	saralup.chittagong.gov.bd
5242	\N	Silk	শীলকুপ	silkupup.chittagong.gov.bd
5243	\N	Chambal	চাম্বল	chambalup.chittagong.gov.bd
5244	\N	Gandamara	গন্ডামারা	gandamaraup.chittagong.gov.bd
5245	\N	Sekherkhil	শেখেরখীল	sekherkhilup.chittagong.gov.bd
5246	\N	Puichhari	পুঁইছড়ি	puichhariup.chittagong.gov.bd
5247	\N	Chhanua	ছনুয়া	chhanuaup.chittagong.gov.bd
5248	\N	Kandhurkhil	কধুরখীল	kandhurkhilup.chittagong.gov.bd
5249	\N	Pashchim Gamdandi	পশ্চিম গোমদন্ডী	pashchimgamdandiup.chittagong.gov.bd
5250	\N	Purba Gomdandi	পুর্ব গোমদন্ডী	purbagomdandiup.chittagong.gov.bd
5251	\N	Sakpura	শাকপুরা	sakpuraup.chittagong.gov.bd
5252	\N	Saroatali	সারোয়াতলী	saroataliup.chittagong.gov.bd
5253	\N	Popadia	পোপাদিয়া	popadiaup.chittagong.gov.bd
5254	\N	Charandwi	চরনদ্বীপ	charandwipup.chittagong.gov.bd
5255	\N	Sreepur-Kharandwi	শ্রীপুর-খরন্দীপ	sreepurkharandwipup.chittagong.gov.bd
5256	\N	Amuchia	আমুচিয়া	amuchiaup.chittagong.gov.bd
5257	\N	Ahla Karaldenga	আহল্লা করলডেঙ্গা	ahlakaraldengaup.chittagong.gov.bd
5258	\N	Boirag	বৈরাগ	boiragup.chittagong.gov.bd
5259	\N	Barasat	বারশত	barasatup.chittagong.gov.bd
5260	\N	Raipur	রায়পুর	raipurup.chittagong.gov.bd
5261	\N	Battali	বটতলী	battaliup.chittagong.gov.bd
5262	\N	Barumchara	বরম্নমচড়া	barumcharaup.chittagong.gov.bd
5263	\N	Baroakhan	বারখাইন	baroakhanup.chittagong.gov.bd
5264	\N	Anwara	আনোয়ারা	anwaraup.chittagong.gov.bd
5265	\N	Chatari	চাতরী	chatariup.chittagong.gov.bd
5266	\N	Paraikora	পরৈকোড়া	paraikoraup.chittagong.gov.bd
5267	\N	Haildhar	হাইলধর	haildharup.chittagong.gov.bd
5268	\N	Juidandi	জুঁইদন্ডী	juidandiup.chittagong.gov.bd
5269	\N	Kanchanabad	কাঞ্চনাবাদ	kanchanabadup.chittagong.gov.bd
5270	\N	Joara	জোয়ারা	joaraup.chittagong.gov.bd
5271	\N	Barkal	বরকল	barkalup.chittagong.gov.bd
5272	\N	Barama	বরমা	baramaup.chittagong.gov.bd
5273	\N	Bailtali	বৈলতলী	bailtaliup.chittagong.gov.bd
5274	\N	Satbaria	সাতবাড়িয়া	satbariaup.chittagong.gov.bd
5275	\N	Hashimpur	হাশিমপুর	hashimpurup.chittagong.gov.bd
5276	\N	Dohazari	দোহাজারী	dohazariup.chittagong.gov.bd
5277	\N	Dhopachhari	ধোপাছড়ী	dhopachhariup.chittagong.gov.bd
5278	\N	Charati	চরতী	charatiup.chittagong.gov.bd
5279	\N	Khagaria	খাগরিয়া	khagariaup.chittagong.gov.bd
5280	\N	Nalua	নলুয়া	naluaup.chittagong.gov.bd
5281	\N	Kanchana	কাঞ্চনা	kanchanaup.chittagong.gov.bd
5282	\N	Amilaisi	আমিলাইশ	amilaisiup.chittagong.gov.bd
5283	\N	Eochiai	এওচিয়া	eochiaiup.chittagong.gov.bd
5284	\N	Madarsa	মাদার্শা	madarsaup.chittagong.gov.bd
5285	\N	Dhemsa	ঢেমশা	dhemsaup.chittagong.gov.bd
5286	\N	Paschim Dhemsa	পশ্চিম ঢেমশা	paschimdhemsaup.chittagong.gov.bd
5287	\N	Keochia	কেঁওচিয়া	keochiaup.chittagong.gov.bd
5288	\N	Kaliais	কালিয়াইশ	kaliaisup.chittagong.gov.bd
5289	\N	Bazalia	বাজালিয়া	bazaliaup.chittagong.gov.bd
5290	\N	Puranagar	পুরানগড়	puranagarup.chittagong.gov.bd
5291	\N	Sadaha	ছদাহা	sadahaup.chittagong.gov.bd
5292	\N	Satkania	সাতকানিয়া	satkaniaup.chittagong.gov.bd
5293	\N	Sonakania	সোনাকানিয়া	sonakaniaup.chittagong.gov.bd
5294	\N	Padua	পদুয়া	paduaup.chittagong.gov.bd
5295	\N	Barahatia	বড়হাতিয়া	barahatiaup.chittagong.gov.bd
5296	\N	Amirabad	আমিরাবাদ	amirabadup.chittagong.gov.bd
5297	\N	Charamba	চরম্বা	charambaup.chittagong.gov.bd
5298	\N	Kalauzan	কলাউজান	kalauzanup.chittagong.gov.bd
5299	\N	Lohagara	লোহাগাড়া	lohagaraup.chittagong.gov.bd
5300	\N	Putibila	পুটিবিলা	putibilaup.chittagong.gov.bd
5301	\N	Chunati	চুনতি	chunatiup.chittagong.gov.bd
5302	\N	Adhunagar	আধুনগর	adhunagarup.chittagong.gov.bd
5303	\N	Farhadabad	ফরহাদাবাদ	farhadabadup.chittagong.gov.bd
5304	\N	Dhalai	ধলই	dhalaiup.chittagong.gov.bd
5305	\N	Mirjapur	মির্জাপুর	mirjapurup.chittagong.gov.bd
5306	\N	Nangolmora	নাঙ্গলমোরা	nangolmoraup.chittagong.gov.bd
5307	\N	Gomanmordan	গুমানমর্দ্দন	gomanmordanup.chittagong.gov.bd
5308	\N	Chipatali	ছিপাতলী	chipataliup.chittagong.gov.bd
5309	\N	Mekhal	মেখল	mekhalup.chittagong.gov.bd
5310	\N	Garduara	গড়দুয়ারা	garduaraup.chittagong.gov.bd
5311	\N	Fathepur	ফতেপুর	fathepurup.chittagong.gov.bd
5312	\N	Chikondandi	চিকনদন্ডী	chikondandiup.chittagong.gov.bd
5313	\N	Uttar Madrasha	উত্তর মাদার্শা	uttarmadrashaup.chittagong.gov.bd
5314	\N	Dakkin Madrasha	দক্ষিন মাদার্শা	dakkinmadrashaup.chittagong.gov.bd
5315	\N	Sikarpur	শিকারপুর	sikarpurup.chittagong.gov.bd
5316	\N	Budirchar	বুডিরশ্চর	budircharup.chittagong.gov.bd
5317	\N	Hathazari	হাটহাজারী	hathazariup.chittagong.gov.bd
5318	\N	Dharmapur	ধর্মপুর	dharmapurup.chittagong.gov.bd
5319	\N	Baganbazar	বাগান বাজার	baganbazarup.chittagong.gov.bd
5320	\N	Dantmara	দাঁতমারা	dantmaraup.chittagong.gov.bd
5321	\N	Narayanhat	নারায়নহাট	narayanhatup.chittagong.gov.bd
5322	\N	Bhujpur	ভূজপুর	bhujpurup.chittagong.gov.bd
5323	\N	Harualchari	হারুয়ালছড়ি	harualchariup.chittagong.gov.bd
5324	\N	Paindong	পাইনদং	paindongup.chittagong.gov.bd
5325	\N	Kanchannagor	কাঞ্চনগর	kanchannagorup.chittagong.gov.bd
5326	\N	Sunderpur	সুনদরপুর	sunderpurup.chittagong.gov.bd
5327	\N	Suabil	সুয়াবিল	Suabilup.chittagong.gov.bd
5328	\N	Abdullapur	আবদুল্লাপুর	abdullapurup.chittagong.gov.bd
5329	\N	Samitirhat	সমিতির হাট	samitirhatup.chittagong.gov.bd
5330	\N	Jafathagar	জাফতনগর	jafathagarup.chittagong.gov.bd
5331	\N	Bokhtapur	বক্তপুর	bokhtapurup.chittagong.gov.bd
5332	\N	Roshangiri	রোসাংগিরী	roshangiriup.chittagong.gov.bd
5333	\N	Nanupur	নানুপুর	nanupurup.chittagong.gov.bd
5334	\N	Lelang	লেলাং	lelangup.chittagong.gov.bd
5335	\N	Daulatpur	দৌলতপুর	daulatpurup.chittagong.gov.bd
5336	\N	Raozan	রাউজান	raozanup.chittagong.gov.bd
5337	\N	Bagoan	বাগোয়ান	bagoanup.chittagong.gov.bd
5338	\N	Binajuri	বিনাজুরী	binajuriup.chittagong.gov.bd
5339	\N	Chikdair	চিকদাইর	chikdairup.chittagong.gov.bd
5340	\N	Dabua	ডাবুয়া	dabuaup.chittagong.gov.bd
5341	\N	Purbagujra	পূর্ব গুজরা	purbagujraup.chittagong.gov.bd
5342	\N	Paschim Gujra	পশ্চিম গুজরা	paschimgujraup.chittagong.gov.bd
5343	\N	Gohira	গহিরা	gohiraup.chittagong.gov.bd
5344	\N	Holdia	হলদিয়া	holdiaup.chittagong.gov.bd
5345	\N	Kodolpur	কদলপূর	kodolpurup.chittagong.gov.bd
5346	\N	Noapara	নোয়াপাড়া	noaparaup.chittagong.gov.bd
5347	\N	Pahartali	পাহাড়তলী	pahartaliup.chittagong.gov.bd
5348	\N	Urkirchar	উড়কিরচর	urkircharup.chittagong.gov.bd
5349	\N	Nowajushpur	নওয়াজিশপুর	nowajushpurup.chittagong.gov.bd
5350	\N	Char Patharghata	চর পাথরঘাটা	charpatharghataup.chittagong.gov.bd
5430	\N	Kabakhali	কবাখালী	kabakhaliup.khagrachhari.gov.bd
5351	\N	Char Lakshya	চর লক্ষ্যা	charlakshyaup.chittagong.gov.bd
5352	\N	Juldha	জুলধা	juldhaup.chittagong.gov.bd
5353	\N	Barauthan	বড় উঠান	barauthanup.chittagong.gov.bd
5354	\N	Sikalbaha	শিকলবাহা	sikalbahaup.chittagong.gov.bd
5355	\N	Islamabad	ইসলামাবাদ	islamabadup.coxsbazar.gov.bd
5356	\N	Islampur	ইসলামপুর	islampurup.coxsbazar.gov.bd
5357	\N	Pokkhali	পোকখালী	pokkhaliup.coxsbazar.gov.bd
5358	\N	Eidgaon	ঈদগাঁও	eidgaonup.coxsbazar.gov.bd
5359	\N	Jalalabad	জালালাবাদ	jalalabadup.coxsbazar.gov.bd
5360	\N	Chowfaldandi	চৌফলদন্ডী	chowfaldandi.coxsbazar.gov.bd
5361	\N	Varuakhali	ভারুয়াখালী	varuakhaliup.coxsbazar.gov.bd
5362	\N	Pmkhali	পিএমখালী	pmkhaliup.coxsbazar.gov.bd
5363	\N	Khurushkhul	খুরুশকুল	khurushkhulup.coxsbazar.gov.bd
5364	\N	Jhilongjha	ঝিলংঝা	jhilongjhaup.coxsbazar.gov.bd
5365	\N	Kakhara	কাকারা	Kakharaup.coxsbazar.gov.bd
5366	\N	Kaiar Bil	কাইয়ার বিল	kaiarbilup.coxsbazar.gov.bd
5367	\N	Konakhali	কোনাখালী	konakhaliup.coxsbazar.gov.bd
5368	\N	Khuntakhali	খুটাখালী	khuntakhaliup.coxsbazar.gov.bd
5369	\N	Chiringa	চিরিঙ্গা	chiringaup.coxsbazar.gov.bd
5370	\N	Demusia	ঢেমুশিয়া	demusiaup.coxsbazar.gov.bd
5371	\N	Dulahazara	ডুলাহাজারা	dulahazaraup.coxsbazar.gov.bd
5372	\N	Paschim Bara Bheola	পশ্চিম বড় ভেওলা	paschimbarabheolaup.coxsbazar.gov.bd
5373	\N	Badarkhali	বদরখালী	badarkhaliup.coxsbazar.gov.bd
5374	\N	Bamobil Chari	বামু বিলছড়ি	bamobilchariup.coxsbazar.gov.bd
5375	\N	Baraitali	বড়ইতলী	baraitaliup.coxsbazar.gov.bd
5376	\N	Bheola Manik Char	ভেওলা মানিক চর	bheolamanikcharup.coxsbazar.gov.bd
5377	\N	Saharbil	শাহারবিল	saharbilup.coxsbazar.gov.bd
5378	\N	Surajpur Manikpur	সুরজপুর মানিকপুর	surajpurmanikpurup.coxsbazar.gov.bd
5379	\N	Harbang	হারবাঙ্গ	harbangup.coxsbazar.gov.bd
5380	\N	Fashiakhali	ফাঁসিয়াখালী	fashiakhaliup.coxsbazar.gov.bd
5381	\N	Ali Akbar Deil	আলি আকবর ডেইল	aliakbardeilup.coxsbazar.gov.bd
5382	\N	Uttar Dhurung	উত্তর ধুরুং	uttardhurungup.coxsbazar.gov.bd
5383	\N	Kaiyarbil	কৈয়ারবিল	kaiyarbilup.coxsbazar.gov.bd
5384	\N	Dakshi Dhurung	দক্ষিণ ধুরুং	dakshidhurungup.coxsbazar.gov.bd
5385	\N	Baragho	বড়ঘোপ	baraghopup.coxsbazar.gov.bd
5386	\N	Lemsikhali	লেমসিখালী	lemsikhaliup.coxsbazar.gov.bd
5387	\N	Rajapalong	রাজাপালং	rajapalongup.coxsbazar.gov.bd
5388	\N	Jaliapalong	জালিয়াপালং	jaliapalongup.coxsbazar.gov.bd
5389	\N	Holdiapalong	হলদিয়াপালং	holdiapalongup.coxsbazar.gov.bd
5390	\N	Ratnapalong	রত্নাপালং	ratnapalongup.coxsbazar.gov.bd
5391	\N	Palongkhali	পালংখালী	palongkhali.coxsbazar.gov.bd
5392	\N	Boro Moheshkhali	বড় মহেশখালী	boramoheshkhaliup.coxsbazar.gov.bd
5393	\N	Choto Moheshkhali	ছোট মহেশখালী	chotamoheshkhaliup.coxsbazar.gov.bd
5394	\N	Shaplapur	শাপলাপুর	shaplapurup.coxsbazar.gov.bd
5395	\N	Kutubjum	কুতুবজোম	kutubjumup.coxsbazar.gov.bd
5396	\N	Hoanak	হোয়ানক	hoanakup.coxsbazar.gov.bd
5397	\N	Kalarmarchhara	কালারমারছড়া	kalarmarchharaup.coxsbazar.gov.bd
5398	\N	Matarbari	মাতারবাড়ী	matarbariup.coxsbazar.gov.bd
5399	\N	Dhalghata	ধলঘাটা	dhalghataup.coxsbazar.gov.bd
5400	\N	Ujantia	উজানটিয়া	ujantiaup.coxsbazar.gov.bd
5401	\N	Taitong	টাইটং	taitongup.coxsbazar.gov.bd
5402	\N	Pekua	পেকুয়া	pekuaup.coxsbazar.gov.bd
5403	\N	Barabakia	বড় বাকিয়া	barabakiaup.coxsbazar.gov.bd
5404	\N	Magnama	মগনামা	magnamaup.coxsbazar.gov.bd
5405	\N	Rajakhali	রাজাখালী	rajakhaliup.coxsbazar.gov.bd
5406	\N	Shilkhali	শীলখালী	shilkhaliup.coxsbazar.gov.bd
5407	\N	Fotekharkul	ফতেখাঁরকুল	fotekharkulup.coxsbazar.gov.bd
5408	\N	Rajarkul	রাজারকুল	rajarkulup.coxsbazar.gov.bd
5409	\N	Rashidnagar	রশীদনগর	rashidnagarup.coxsbazar.gov.bd
5410	\N	Khuniapalong	খুনিয়াপালং	khuniapalongup.coxsbazar.gov.bd
5411	\N	Eidghar	ঈদগড়	eidgharup.coxsbazar.gov.bd
5412	\N	Chakmarkul	চাকমারকুল	chakmarkulup.coxsbazar.gov.bd
5413	\N	Kacchapia	কচ্ছপিয়া	kacchapiaup.coxsbazar.gov.bd
5414	\N	Kauwarkho	কাউয়ারখোপ	kauwarkhopup.coxsbazar.gov.bd
5415	\N	Dakkhin Mithachhari	দক্ষিণ মিঠাছড়ি	dakkhinmithachhariup.coxsbazar.gov.bd
5416	\N	Jouarianala	জোয়ারিয়া নালা	jouarianalaup.coxsbazar.gov.bd
5417	\N	Garjoniya	গর্জনিয়া	garjoniyaup.coxsbazar.gov.bd
5418	\N	Subrang	সাবরাং	subrangup.coxsbazar.gov.bd
5419	\N	Baharchara	বাহারছড়া	baharcharaup.coxsbazar.gov.bd
5420	\N	Hnila	হ্নীলা	hnilaup.coxsbazar.gov.bd
5421	\N	Whykong	হোয়াইক্যং	whykongup.coxsbazar.gov.bd
5422	\N	Saintmartin	সেন্ট মার্টিন	saintmartinup.coxsbazar.gov.bd
5423	\N	Teknaf Sadar	টেকনাফ সদর	teknafsadarup.coxsbazar.gov.bd
5424	\N	Khagrachhari Sadar	খাগরাছড়ি সদর	sadarup.khagrachhari.gov.bd
5425	\N	Golabari	গোলাবাড়ী	golabariup.khagrachhari.gov.bd
5426	\N	Parachara	পেরাছড়া	paracharaup.khagrachhari.gov.bd
5427	\N	Kamalchari	কমলছড়ি	kamalchariup.khagrachhari.gov.bd
5428	\N	Merung	মেরুং	merungup.khagrachhari.gov.bd
5429	\N	Boalkhali	বোয়ালখালী	boalkhaliup.khagrachhari.gov.bd
5431	\N	Dighinala	দিঘীনালা	dighinalaup.khagrachhari.gov.bd
5432	\N	Babuchara	বাবুছড়া	babucharaup.khagrachhari.gov.bd
5433	\N	Logang	লোগাং	logangup.khagrachhari.gov.bd
5434	\N	Changi	চেংগী	changiup.khagrachhari.gov.bd
5435	\N	Panchari	পানছড়ি	panchariup.khagrachhari.gov.bd
5436	\N	Latiban	লতিবান	latibanup.khagrachhari.gov.bd
5437	\N	Dullyatali	দুল্যাতলী	dullyataliup.khagrachhari.gov.bd
5438	\N	Barmachari	বর্মাছড়ি	barmachariup.khagrachhari.gov.bd
5439	\N	Laxmichhari	লক্ষীছড়ি	laxmichhariup.khagrachhari.gov.bd
5440	\N	Bhaibonchara	ভাইবোনছড়া	bhaiboncharaup.khagrachhari.gov.bd
5441	\N	Mahalchari	মহালছড়ি	mahalchariup.khagrachhari.gov.bd
5442	\N	Mobachari	মুবাছড়ি	mobachariup.khagrachhari.gov.bd
5443	\N	Kayanghat	ক্যায়াংঘাট	kayanghatup.khagrachhari.gov.bd
5444	\N	Maischari	মাইসছড়ি	maischariup.khagrachhari.gov.bd
5445	\N	Manikchari	মানিকছড়ি	manikchariup.khagrachhari.gov.bd
5446	\N	Batnatali	বাটনাতলী	batnataliup.khagrachhari.gov.bd
5447	\N	Jogyachola	যোগ্যছোলা	jogyacholaup.khagrachhari.gov.bd
5448	\N	Tintahari	তিনটহরী	tintahariup.khagrachhari.gov.bd
5449	\N	Ramgarh	রামগড়	ramgarhup.khagrachhari.gov.bd
5450	\N	Patachara	পাতাছড়া	patacharaup.khagrachhari.gov.bd
5451	\N	Hafchari	হাফছড়ি	hafchariup.khagrachhari.gov.bd
5452	\N	Taindong	তাইন্দং	taindongup.khagrachhari.gov.bd
5453	\N	Tabalchari	তবলছড়ি	tabalchariup.khagrachhari.gov.bd
5454	\N	Barnal	বর্ণাল	barnalup.khagrachhari.gov.bd
5455	\N	Gomti	গোমতি	gomtiup.khagrachhari.gov.bd
5456	\N	Balchari	বেলছড়ি	balchariup.khagrachhari.gov.bd
5457	\N	Matiranga	মাটিরাঙ্গা	matirangaup.khagrachhari.gov.bd
5458	\N	Guimara	গুইমারা	guimaraup.khagrachhari.gov.bd
5459	\N	Amtali	আমতলি	amtaliup.khagrachhari.gov.bd
5460	\N	Rajbila	রাজবিলা	rajbilaup.bandarban.gov.bd
5461	\N	Tongkaboty	টংকাবতী	tongkabotyup.bandarban.gov.bd
5462	\N	Suwalok	সুয়ালক	suwalokup.bandarban.gov.bd
5463	\N	Bandarban Sadar	বান্দরবান সদর	bandarbansadarup.bandarban.gov.bd
5464	\N	Kuhalong	কুহালং	kuhalongup.bandarban.gov.bd
5465	\N	Alikadam Sadar	আলীকদম সদর	alikadamsadarup.bandarban.gov.bd
5466	\N	Chwekhyong	চৈক্ষ্যং	chwekhyongup.bandarban.gov.bd
5467	\N	Naikhyongchari Sadar	নাইক্ষ্যংছড়ি সদর	naikhyongcharisadarup.bandarban.gov.bd
5468	\N	Gumdhum	ঘুমধুম	gumdhumup.bandarban.gov.bd
5469	\N	Baishari	বাইশারী	baishariup.bandarban.gov.bd
5470	\N	Sonaychari	সোনাইছড়ি	sonaychariup.bandarban.gov.bd
5471	\N	Duwchari	দোছড়ি	duwchariup.bandarban.gov.bd
5472	\N	Rowangchari Sadar	রোয়াংছড়ি সদর	rowangcharisadarup.bandarban.gov.bd
5473	\N	Taracha	তারাছা	tarachaup.bandarban.gov.bd
5474	\N	Alekyong	আলেক্ষ্যং	alekyongup.bandarban.gov.bd
5475	\N	Nawapotong	নোয়াপতং	nawapotongup.bandarban.gov.bd
5476	\N	Gajalia	গজালিয়া	gajaliaup.bandarban.gov.bd
5477	\N	Lama Sadar	লামা সদর	lamasadarup.bandarban.gov.bd
5478	\N	Fasiakhali	ফাসিয়াখালী	fasiakhaliup.bandarban.gov.bd
5479	\N	Fythong	ফাইতং	fythongup.bandarban.gov.bd
5480	\N	Rupushipara	রূপসীপাড়া	rupushiparaup.bandarban.gov.bd
5481	\N	Sarai	সরই	saraiup.bandarban.gov.bd
5482	\N	Aziznagar	আজিজনগর	aziznagarup.bandarban.gov.bd
5483	\N	Paind	পাইন্দু	painduup.bandarban.gov.bd
5484	\N	Ruma Sadar	রুমা সদর	rumasadarup.bandarban.gov.bd
5485	\N	Ramakreprangsa	রেমাক্রীপ্রাংসা	ramakreprangsaup.bandarban.gov.bd
5486	\N	Galanggya	গ্যালেংগ্যা	galanggyaup.bandarban.gov.bd
5487	\N	Remakre	রেমাক্রী	remakreup.bandarban.gov.bd
5488	\N	Tind	তিন্দু	tinduup.bandarban.gov.bd
5489	\N	Thanchi Sadar	থানচি সদর	thanchisadarup.bandarban.gov.bd
5490	\N	Balipara	বলিপাড়া	baliparaup.bandarban.gov.bd
5491	\N	Rajapur	রাজাপুর	rajapurup.sirajganj.gov.bd
5492	\N	Baradhul	বড়ধুল	baradhulup.sirajganj.gov.bd
5493	\N	Belkuchi Sadar	বেলকুচি সদর	belkuchisadarup.sirajganj.gov.bd
5494	\N	Dhukuriabera	ধুকুরিয়া বেড়া	dhukuriaberaup.sirajganj.gov.bd
5495	\N	Doulatpur	দৌলতপুর	doulatpurup.sirajganj.gov.bd
5496	\N	Bhangabari	ভাঙ্গাবাড়ী	bhangabariup.sirajganj.gov.bd
5497	\N	Baghutia	বাঘুটিয়া	baghutiaup.sirajganj.gov.bd
5498	\N	Gharjan	ঘোরজান	gharjanup.sirajganj.gov.bd
5499	\N	Khaskaulia	খাসকাউলিয়া	khaskauliaup.sirajganj.gov.bd
5500	\N	Khaspukuria	খাসপুকুরিয়া	khaspukuriaup.sirajganj.gov.bd
5501	\N	Omarpur	উমারপুর	omarpurup.sirajganj.gov.bd
5502	\N	Sadia Chandpur	সদিয়া চাঁদপুর	sadiachandpurup.sirajganj.gov.bd
5503	\N	Sthal	স্থল	sthalup.sirajganj.gov.bd
5504	\N	Bhadraghat	ভদ্রঘাট	bhadraghatup.sirajganj.gov.bd
5505	\N	Jamtail	জামতৈল	jamtailup.sirajganj.gov.bd
5506	\N	Jhawail	ঝাঐল	jhawailup.sirajganj.gov.bd
5507	\N	Roydaulatpur	রায়দৌলতপুর	roydaulatpurup.sirajganj.gov.bd
5508	\N	Chalitadangha	চালিতাডাঙ্গা	chalitadanghaup.sirajganj.gov.bd
5509	\N	Chargirish	চরগিরিশ	chargirishup.sirajganj.gov.bd
5510	\N	Gandail	গান্ধাইল	gandailup.sirajganj.gov.bd
5511	\N	Kazipur Sadar	কাজিপুর সদর	kazipursadarup.sirajganj.gov.bd
5512	\N	Khasrajbari	খাসরাজবাড়ী	khasrajbariup.sirajganj.gov.bd
5513	\N	Maijbari	মাইজবাড়ী	maijbariup.sirajganj.gov.bd
5514	\N	Monsur Nagar	মনসুর নগর	monsurnagarup.sirajganj.gov.bd
5515	\N	Natuarpara	নাটুয়ারপাড়া	natuarparaup.sirajganj.gov.bd
5516	\N	Nishchintapur	নিশ্চিন্তপুর	nishchintapurup.sirajganj.gov.bd
5517	\N	Sonamukhi	সোনামুখী	sonamukhiup.sirajganj.gov.bd
5518	\N	Subhagacha	শুভগাছা	subhagachaup.sirajganj.gov.bd
5519	\N	Tekani	তেকানী	tekaniup.sirajganj.gov.bd
5520	\N	Brommogacha	ব্রহ্মগাছা	brommogachaup.sirajganj.gov.bd
5521	\N	Chandaikona	চান্দাইকোনা	chandaikonaup.sirajganj.gov.bd
5522	\N	Dhamainagar	ধামাইনগর	dhamainagarup.sirajganj.gov.bd
5523	\N	Dhangora	ধানগড়া	dhangoraup.sirajganj.gov.bd
5524	\N	Dhubil	ধুবিল	dhubilup.sirajganj.gov.bd
5525	\N	Ghurka	ঘুড়কা	ghurkaup.sirajganj.gov.bd
5526	\N	Nalka	নলকা	nalkaup.sirajganj.gov.bd
5527	\N	Pangashi	পাঙ্গাসী	pangashiup.sirajganj.gov.bd
5528	\N	Sonakhara	সোনাখাড়া	sonakharaup.sirajganj.gov.bd
5529	\N	Beltail	বেলতৈল	beltailup.sirajganj.gov.bd
5530	\N	Jalalpur	জালালপুর	jalalpurup.sirajganj.gov.bd
5531	\N	Kayempure	কায়েমপুর	kayempureup.sirajganj.gov.bd
5532	\N	Garadah	গাড়াদহ	garadahup.sirajganj.gov.bd
5533	\N	Potazia	পোতাজিয়া	potaziaup.sirajganj.gov.bd
5534	\N	Rupbati	রূপবাটি	rupbatiup.sirajganj.gov.bd
5535	\N	Gala	গালা	galaup.sirajganj.gov.bd
5536	\N	Porzona	পোরজনা	porzonaup.sirajganj.gov.bd
5537	\N	Habibullah Nagar	হাবিবুল্লাহ নগর	habibullahnagarup.sirajganj.gov.bd
5538	\N	Khukni	খুকনী	khukniup.sirajganj.gov.bd
5539	\N	Koizuri	কৈজুরী	koizuriup.sirajganj.gov.bd
5540	\N	Sonatoni	সোনাতনী	sonatoniup.sirajganj.gov.bd
5541	\N	Narina	নরিনা	narinaup.sirajganj.gov.bd
5542	\N	Bagbati	বাগবাটি	bagbatiup.sirajganj.gov.bd
5543	\N	Ratankandi	রতনকান্দি	ratankandiup.sirajganj.gov.bd
5544	\N	Bohuli	বহুলী	bohuliup.sirajganj.gov.bd
5545	\N	Sheyalkol	শিয়ালকোল	sheyalkolup.sirajganj.gov.bd
5546	\N	Khokshabari	খোকশাবাড়ী	khokshabariup.nilphamari.gov.bd
5547	\N	Songacha	ছোনগাছা	songachaup.sirajganj.gov.bd
5548	\N	Mesra	মেছড়া	mesraup.sirajganj.gov.bd
5549	\N	Kowakhola	কাওয়াখোলা	kowakholaup.sirajganj.gov.bd
5550	\N	Kaliahoripur	কালিয়াহরিপুর	kaliahoripurup.sirajganj.gov.bd
5551	\N	Soydabad	সয়দাবাদ	soydabadup.sirajganj.gov.bd
5552	\N	Baruhas	বারুহাস	baruhasup.sirajganj.gov.bd
5553	\N	Talam	তালম	talamup.sirajganj.gov.bd
5554	\N	Soguna	সগুনা	sogunaup.sirajganj.gov.bd
5555	\N	Magura Binod	মাগুড়া বিনোদ	magurabinodup.sirajganj.gov.bd
5556	\N	Naogaon	নওগাঁ	naogaonup.sirajganj.gov.bd
5557	\N	Tarash Sadar	তাড়াশ সদর	tarashsadarup.sirajganj.gov.bd
5558	\N	Madhainagar	মাধাইনগর	madhainagarup.sirajganj.gov.bd
5559	\N	Deshigram	দেশীগ্রাম	deshigramup.sirajganj.gov.bd
5560	\N	Ullapara Sadar	উল্লাপাড়া সদর	ullaparasadarup.sirajganj.gov.bd
5561	\N	Ramkrisnopur	রামকৃষ্ণপুর	ramkrisnopurup.sirajganj.gov.bd
5562	\N	Bangala	বাঙ্গালা	bangalaup.sirajganj.gov.bd
5563	\N	Udhunia	উধুনিয়া	udhuniaup.sirajganj.gov.bd
5564	\N	Boropangashi	বড়পাঙ্গাসী	boropangashiup.sirajganj.gov.bd
5565	\N	Durga Nagar	দুর্গা নগর	durganagarup.sirajganj.gov.bd
5566	\N	Purnimagati	পূর্ণিমাগাতী	purnimagatiup.sirajganj.gov.bd
5567	\N	Salanga	সলঙ্গা	salangaup.sirajganj.gov.bd
5568	\N	Hatikumrul	হটিকুমরুল	hatikumrulup.sirajganj.gov.bd
5569	\N	Borohor	বড়হর	borohorup.sirajganj.gov.bd
5570	\N	Ponchocroshi	পঞ্চক্রোশী	ponchocroshiup.sirajganj.gov.bd
5571	\N	Salo	সলপ	salopup.sirajganj.gov.bd
5572	\N	Mohonpur	মোহনপুর	mohonpurup.sirajganj.gov.bd
5573	\N	Vaina	ভায়না	vainaup.pabna.gov.bd
5574	\N	Tantibonda	তাঁতিবন্দ	tantibondaup.pabna.gov.bd
5575	\N	Manikhat	মানিকহাট	manikhatup.pabna.gov.bd
5576	\N	Dulai	দুলাই	dulaiup.pabna.gov.bd
5577	\N	Ahammadpur	আহম্মদপুর	ahammadpurup.pabna.gov.bd
5578	\N	Raninagar	রাণীনগর	raninagarup.pabna.gov.bd
5579	\N	Satbaria	সাতবাড়ীয়া	satbariaup.pabna.gov.bd
5580	\N	Hatkhali	হাটখালী	hatkhaliup.pabna.gov.bd
5581	\N	Nazirganj	নাজিরগঞ্জ	nazirganjup.pabna.gov.bd
5582	\N	Sagorkandi	সাগরকান্দি	sagorkandiup.pabna.gov.bd
5583	\N	Sara	সাঁড়া	saraup.pabna.gov.bd
5584	\N	Pakshi	পাকশী	pakshiup.pabna.gov.bd
5585	\N	Muladuli	মুলাডুলি	muladuliup.pabna.gov.bd
5586	\N	Dashuria	দাশুরিয়া	dashuriaup.pabna.gov.bd
5587	\N	Silimpur	ছলিমপুর	silimpurup.pabna.gov.bd
5588	\N	Sahapur	সাহাপুর	sahapurup.pabna.gov.bd
5589	\N	Luxmikunda	লক্ষীকুন্ডা	luxmikundaup.pabna.gov.bd
5590	\N	Bhangura	ভাঙ্গুড়া	bhanguraup.pabna.gov.bd
5591	\N	Khanmarich	খানমরিচ	khanmarichup.pabna.gov.bd
5592	\N	Ashtamanisha	অষ্টমণিষা	ashtamanishaup.pabna.gov.bd
5593	\N	Dilpasar	দিলপাশার	dilpasarup.pabna.gov.bd
5594	\N	Parbhangura	পারভাঙ্গুড়া	parbhanguraup.pabna.gov.bd
5595	\N	Maligachha	মালিগাছা	maligachhaup.pabna.gov.bd
5596	\N	Malanchi	মালঞ্চি	malanchiup.pabna.gov.bd
5597	\N	Gayeshpur	গয়েশপুর	gayeshpurup.pabna.gov.bd
5598	\N	Ataikula	আতাইকুলা	ataikulaup.pabna.gov.bd
5599	\N	Chartarapur	চরতারাপুর	chartarapurup.pabna.gov.bd
5600	\N	Sadullahpur	সাদুল্লাপুর	sadullahpurup.pabna.gov.bd
5601	\N	Bharara	ভাঁড়ারা	bhararaup.pabna.gov.bd
5602	\N	Dogachi	দোগাছী	dogachiup.pabna.gov.bd
5603	\N	Hemayetpur	হেমায়েতপুর	hemayetpurup.pabna.gov.bd
5604	\N	Dapunia	দাপুনিয়া	dapuniaup.pabna.gov.bd
5605	\N	Haturia Nakalia	হাটুরিয়া নাকালিয়া	haturianakaliaup.pabna.gov.bd
5606	\N	Notun Varenga	নতুন ভারেঙ্গা	notunvarengaup.pabna.gov.bd
5607	\N	Koitola	কৈটোলা	koitolaup.pabna.gov.bd
5608	\N	Chakla	চাকলা	chaklaup.pabna.gov.bd
5609	\N	Jatsakhini	জাতসাখিনি	jatsakhiniup.pabna.gov.bd
5610	\N	Puran Varenga	পুরান ভারেঙ্গা	puranvarengaup.pabna.gov.bd
5611	\N	Ruppur	রূপপুর	ruppurup.pabna.gov.bd
5612	\N	Masumdia	মাসুমদিয়া	masumdiaup.pabna.gov.bd
5613	\N	Dhalar Char	ঢালার চর	dhalarcharup.pabna.gov.bd
5614	\N	Majhpara	মাজপাড়া	majhparaup.pabna.gov.bd
5615	\N	Chandba	চাঁদভা	chandbaup.pabna.gov.bd
5616	\N	Debottar	দেবোত্তর	debottarup.pabna.gov.bd
5617	\N	Ekdanta	একদন্ত	ekdantaup.pabna.gov.bd
5618	\N	Laxshmipur	লক্ষীপুর	laxshmipurup.pabna.gov.bd
5619	\N	Handial	হান্ডিয়াল	handialup.pabna.gov.bd
5620	\N	Chhaikola	ছাইকোলা	chhaikolaup.pabna.gov.bd
5621	\N	Nimaichara	নিমাইচড়া	nimaicharaup.pabna.gov.bd
5622	\N	Gunaigachha	গুনাইগাছা	gunaigachhaup.pabna.gov.bd
5623	\N	Parshadanga	পার্শ্বডাঙ্গা	parshadangaup.pabna.gov.bd
5624	\N	Failjana	ফৈলজানা	failjanaup.pabna.gov.bd
5625	\N	Mulgram	মুলগ্রাম	mulgramup.pabna.gov.bd
5626	\N	Haripur	হরিপুর	haripurup.pabna.gov.bd
5627	\N	Mothurapur	মথুরাপুর	mothurapurup.pabna.gov.bd
5628	\N	Bilchalan	বিলচলন	bilchalanup.pabna.gov.bd
5629	\N	Danthia Bamangram	দাতিয়া বামনগ্রাম	danthiabamangramup.pabna.gov.bd
5630	\N	Nagdemra	নাগডেমড়া	nagdemraup.pabna.gov.bd
5631	\N	Dhulauri	ধুলাউড়ি	dhulauriup.pabna.gov.bd
5632	\N	Bhulbaria	ভুলবাড়ীয়া	bhulbariaup.pabna.gov.bd
5633	\N	Dhopadaha	ধোপাদহ	dhopadahaup.pabna.gov.bd
5634	\N	Karamja	করমজা	karamjaup.pabna.gov.bd
5635	\N	Kashinathpur	কাশিনাথপুর	kashinathpurup.pabna.gov.bd
5636	\N	Gaurigram	গৌরীগ্রাম	gaurigramup.pabna.gov.bd
5637	\N	Nandanpur	নন্দনপুর	nandanpurup.pabna.gov.bd
5638	\N	Khetupara	ক্ষেতুপাড়া	khetuparaup.pabna.gov.bd
5639	\N	Ar-Ataikula	আর-আতাইকুলা	rataiqulaup.pabna.gov.bd
5640	\N	Brilahiribari	বৃলাহিড়ীবাড়ী	brilahiribariup.pabna.gov.bd
5641	\N	Pungali	পুঙ্গুলি	pungaliup.pabna.gov.bd
5642	\N	Faridpur	ফরিদপুর	faridpurup.pabna.gov.bd
5643	\N	Hadal	হাদল	hadalup.pabna.gov.bd
5644	\N	Banwarinagar	বনওয়ারীনগর	banwarinagarup.pabna.gov.bd
5645	\N	Demra	ডেমড়া	demraup.pabna.gov.bd
5646	\N	Birkedar	বীরকেদার	birkedarup.bogra.gov.bd
5647	\N	Kalai	কালাই	kalaiup.bogra.gov.bd
5648	\N	Paikar	পাইকড়	paikarup.bogra.gov.bd
5649	\N	Narhatta	নারহট্ট	narhattaup.bogra.gov.bd
5650	\N	Murail	মুরইল	murailup.bogra.gov.bd
5651	\N	Kahaloo	কাহালু	kahalooup.bogra.gov.bd
5652	\N	Durgapur	দূর্গাপুর	durgapurup.bogra.gov.bd
5653	\N	Jamgaon	জামগ্রাম	jamgaonup.bogra.gov.bd
5654	\N	Malancha	মালঞ্চা	malanchaup.bogra.gov.bd
5655	\N	Fapore	ফাঁপোর	faporeup.bogra.gov.bd
5656	\N	Shabgram	সাবগ্রাম	shabgramup.bogra.gov.bd
5657	\N	Nishindara	নিশিন্দারা	nishindaraup.bogra.gov.bd
5658	\N	Erulia	এরুলিয়া	eruliaup.bogra.gov.bd
5659	\N	Rajapur	রাজাপুর	rajapurup.bogra.gov.bd
5660	\N	Shakharia	শাখারিয়া	shakhariaup.bogra.gov.bd
5661	\N	Sekherkola	শেখেরকোলা	sekherkolaup.bogra.gov.bd
5662	\N	Gokul	গোকুল	gokulup.bogra.gov.bd
5663	\N	Noongola	নুনগোলা	noongolaup.bogra.gov.bd
5664	\N	Lahiripara	লাহিড়ীপাড়া	lahiriparaup.bogra.gov.bd
5665	\N	Namuja	নামুজা	namujaup.bogra.gov.bd
5666	\N	Sariakandi Sadar	সারিয়াকান্দি সদর	sariakandisadarup.bogra.gov.bd
5667	\N	Narchi	নারচী	narchiup.bogra.gov.bd
5668	\N	Bohail	বোহাইল	bohailup.bogra.gov.bd
5669	\N	Chaluabari	চালুয়াবাড়ী	chaluabariup.bogra.gov.bd
5670	\N	Chandanbaisha	চন্দনবাইশা	chandanbaishaup.bogra.gov.bd
5671	\N	Hatfulbari	হাটফুলবাড়ী	hatfulbariup.bogra.gov.bd
5672	\N	Hatsherpur	হাটশেরপুর	hatsherpurup.bogra.gov.bd
5673	\N	Karnibari	কর্ণিবাড়ী	karnibariup.bogra.gov.bd
5674	\N	Kazla	কাজলা	kazlaup.bogra.gov.bd
5675	\N	Kutubpur	কুতুবপুর	kutubpurup.bogra.gov.bd
5676	\N	Kamalpur	কামালপুর	kamalpur.bogra.gov.bd
5677	\N	Bhelabari	ভেলাবাড়ী	bhelabari.bogra.gov.bd
5678	\N	Asekpur	আশেকপুর	asekpurup.bogra.gov.bd
5679	\N	Madla	মাদলা	madlaup.bogra.gov.bd
5680	\N	Majhira	মাঝিড়া	majhiraup.bogra.gov.bd
5681	\N	Aria	আড়িয়া	ariaup.bogra.gov.bd
5682	\N	Kharna	খরনা	kharnaup.bogra.gov.bd
5683	\N	Khottapara	খোট্টাপাড়া	Khottaparaup.bogra.gov.bd
5684	\N	Chopinagar	চোপিনগর	chopinagarup.bogra.gov.bd
5685	\N	Amrul	আমরুল	amrulup.bogra.gov.bd
5686	\N	Gohail	গোহাইল	gohailup.bogra.gov.bd
5687	\N	Zianagar	জিয়ানগর	zianagarup.bogra.gov.bd
5688	\N	Chamrul	চামরুল	chamrulup.bogra.gov.bd
5689	\N	Dupchanchia	দুপচাঁচিয়া	dupchanchiaup.bogra.gov.bd
5690	\N	Gunahar	গুনাহার	gunaharup.bogra.gov.bd
5691	\N	Gobindapur	গোবিন্দপুর	gobindapurup.bogra.gov.bd
5692	\N	Talora	তালোড়া	taloraup.bogra.gov.bd
5693	\N	Chhatiangram	ছাতিয়ানগ্রাম	chhatiangramup.bogra.gov.bd
5694	\N	Nasaratpur	নশরতপুর	nasaratpurup.bogra.gov.bd
5695	\N	Adamdighi	আদমদিঘি	adamdighiup.bogra.gov.bd
5696	\N	Kundagram	কুন্দগ্রাম	kundagramup.bogra.gov.bd
5697	\N	Chapapur	চাঁপাপুর	chapapurup.bogra.gov.bd
5698	\N	Shantahar	সান্তাহার	shantaharup.bogra.gov.bd
5699	\N	Burail	বুড়ইল	burailup.bogra.gov.bd
5700	\N	Nandigram	নন্দিগ্রাম	nandigramup.bogra.gov.bd
5701	\N	Bhatra	ভাটরা	bhatraup.bogra.gov.bd
5702	\N	Thalta Majhgram	থালতা মাঝগ্রাম	thaltamajhgramup.bogra.gov.bd
5703	\N	Bhatgram	ভাটগ্রাম	bhatgramup.bogra.gov.bd
5704	\N	Sonatala	সোনাতলা	sonatalaup.bogra.gov.bd
5705	\N	Balua	বালুয়া	baluaup.bogra.gov.bd
5706	\N	Zorgacha	জোড়গাছা	zorgachaup.bogra.gov.bd
5707	\N	Digdair	দিগদাইড়	digdairup.bogra.gov.bd
5708	\N	Madhupur	মধুপুর	madhupurup.bogra.gov.bd
5709	\N	Pakulla	পাকুল্ল্যা	pakullaup.bogra.gov.bd
5710	\N	Tekani Chukinagar	তেকানী চুকাইনগর	tekanichukinagarup.bogra.gov.bd
5711	\N	Nimgachi	নিমগাছি	nimgachiup.bogra.gov.bd
5712	\N	Kalerpara	কালেরপাড়া	kalerparaup.bogra.gov.bd
5713	\N	Chikashi	চিকাশী	chikashiup.bogra.gov.bd
5714	\N	Gossainbari	গোসাইবাড়ী	gossainbariup.bogra.gov.bd
5715	\N	Bhandarbari	ভান্ডারবাড়ী	bhandarbariup.bogra.gov.bd
5716	\N	Gopalnagar	১গোপালনগর	gopalnagarup.bogra.gov.bd
5717	\N	Mothurapur	মথুরাপুর	mothurapurup.bogra.gov.bd
5718	\N	Chowkibari	চৌকিবাড়ী	chowkibariup.bogra.gov.bd
5719	\N	Elangi	এলাঙ্গী	elangiup.bogra.gov.bd
5720	\N	Dhunat Sadar	ধুনট সদর	dhunatsadarup.bogra.gov.bd
5721	\N	Baliadighi	বালিয়া দিঘী	baliadighiup.bogra.gov.bd
5722	\N	Dakshinpara	দক্ষিণপাড়া	dakshinparaup.bogra.gov.bd
5723	\N	Durgahata	দুর্গাহাটা	durgahataup.bogra.gov.bd
5724	\N	Kagail	কাগইল	kagailup.bogra.gov.bd
5725	\N	Sonarai	সোনারায়	sonaraiup.bogra.gov.bd
5726	\N	Rameshwarpur	রামেশ্বরপুর	rameshwarpurup.bogra.gov.bd
5727	\N	Naruamala	নাড়ুয়ামালা	naruamalaup.bogra.gov.bd
5728	\N	Nepaltali	নেপালতলী	nepaltaliup.bogra.gov.bd
5729	\N	Gabtali	গাবতলি	gabtaliup.bogra.gov.bd
5730	\N	Mahishaban	মহিষাবান	mahishabanup.bogra.gov.bd
5731	\N	Nasipur	নশিপুর	nasipurup.bogra.gov.bd
5732	\N	Mirzapur	মির্জাপুর	mirzapurup.bogra.gov.bd
5733	\N	Khamarkandi	খামারকান্দি	khamarkandiup.bogra.gov.bd
5734	\N	Garidaha	গাড়িদহ	garidahaup.bogra.gov.bd
5735	\N	Kusumbi	কুসুম্বী	kusumbiup.bogra.gov.bd
5736	\N	Bishalpur	বিশালপুর	bishalpurup.bogra.gov.bd
5737	\N	Shimabari	সীমাবাড়ি	shimabariup.bogra.gov.bd
5738	\N	Shahbondegi	শাহবন্দেগী	shahbondegiup.bogra.gov.bd
5739	\N	Sughat	সুঘাট	sughatup.bogra.gov.bd
5740	\N	Khanpur	খানপুর	khanpurup.bogra.gov.bd
5741	\N	Bhabanipur	ভবানীপুর	bhabanipurup.bogra.gov.bd
5742	\N	Moidanhatta	ময়দানহাট্টা	moidanhattaup.bogra.gov.bd
5743	\N	Kichok	কিচক	kichokup.bogra.gov.bd
5744	\N	Atmul	আটমূল	atmulup.bogra.gov.bd
5745	\N	Pirob	পিরব	pirobup.bogra.gov.bd
5746	\N	Majhihatta	মাঝিহট্ট	majhihattaup.bogra.gov.bd
5747	\N	Buriganj	বুড়িগঞ্জ	buriganjup.bogra.gov.bd
5748	\N	Bihar	বিহার	biharup.bogra.gov.bd
5749	\N	Shibganj	শিবগঞ্জ	shibganjup.bogra.gov.bd
5750	\N	Deuly	দেউলি	deulyup.bogra.gov.bd
5751	\N	Sayedpur	সৈয়দপুর	sayedpurup.bogra.gov.bd
5752	\N	Mokamtala	মোকামতলা	mokamtalaup.bogra.gov.bd
5753	\N	Raynagar	রায়নগর	raynagarup.bogra.gov.bd
5754	\N	Darsanpara	দর্শনপাড়া	darsanparaup.rajshahi.gov.bd
5755	\N	Hujuripara	হুজুরী পাড়া	hujuriparaup.rajshahi.gov.bd
5756	\N	Damkura	দামকুড়া	damkuraup.rajshahi.gov.bd
5757	\N	Horipur	হরিপুর	horipurup.rajshahi.gov.bd
5758	\N	Horogram	হড়গ্রাম	horogramup.rajshahi.gov.bd
5759	\N	Harian	হরিয়ান	harianup.rajshahi.gov.bd
5760	\N	Borgachi	বড়্গাছি	borgachiup.rajshahi.gov.bd
5761	\N	Parila	পারিলা	parilaup.rajshahi.gov.bd
5762	\N	Naopara	নওপাড়া	naoparaup.rajshahi.gov.bd
5763	\N	Kismatgankoir	কিসমতগণকৈড়	kismatgankoirup.rajshahi.gov.bd
5764	\N	Pananagar	পানানগর	pananagarup.rajshahi.gov.bd
5765	\N	Deluabari	দেলুয়াবাড়ী	deluabariup.rajshahi.gov.bd
5766	\N	Jhaluka	ঝালুকা	jhalukaup.rajshahi.gov.bd
5767	\N	Maria	মাড়িয়া	mariaup.rajshahi.gov.bd
5768	\N	Joynogor	জয়নগর	joynogorup.rajshahi.gov.bd
5769	\N	Dhuroil	ধুরইল	dhuroilup.rajshahi.gov.bd
5770	\N	Ghasigram	ঘষিগ্রাম	ghasigramup.rajshahi.gov.bd
5771	\N	Raighati	রায়ঘাটি	raighatiup.rajshahi.gov.bd
5772	\N	Mougachi	মৌগাছি	mougachiup.rajshahi.gov.bd
5773	\N	Baksimoil	বাকশিমইল	baksimoilup.rajshahi.gov.bd
5774	\N	Jahanabad	জাহানাবাদ	jahanabadup.rajshahi.gov.bd
5775	\N	Yousufpur	ইউসুফপুর	yousufpurup.rajshahi.gov.bd
5776	\N	Solua	শলুয়া	soluaup.rajshahi.gov.bd
5777	\N	Sardah	সরদহ	sardahup.rajshahi.gov.bd
5778	\N	Nimpara	নিমপাড়া	nimparaup.rajshahi.gov.bd
5779	\N	Charghat	চারঘাট	charghatup.rajshahi.gov.bd
5780	\N	Vialuxmipur	ভায়ালক্ষ্মীপুর	vialuxmipurup.rajshahi.gov.bd
5781	\N	Puthia	পুঠিয়া	puthiaup.rajshahi.gov.bd
5782	\N	Belpukuria	বেলপুকুরিয়া	belpukuriaup.rajshahi.gov.bd
5783	\N	Baneswar	বানেশ্বর	baneswarup.rajshahi.gov.bd
5784	\N	Valukgachi	ভালুক গাছি	valukgachiup.rajshahi.gov.bd
5785	\N	Shilmaria	শিলমাড়িয়া	shilmariaup.rajshahi.gov.bd
5786	\N	Jewpara	জিউপাড়া	jewparaup.rajshahi.gov.bd
5787	\N	Bajubagha	বাজুবাঘা	bajubaghaup.rajshahi.gov.bd
5788	\N	Gorgori	গড়গড়ি	gorgoriup.rajshahi.gov.bd
5789	\N	Pakuria	পাকুড়িয়া	pakuriaup.rajshahi.gov.bd
5790	\N	Monigram	মনিগ্রাম	monigramup.rajshahi.gov.bd
5791	\N	Bausa	বাউসা	bausaup.rajshahi.gov.bd
5792	\N	Arani	আড়ানী	araniup.rajshahi.gov.bd
5793	\N	Godagari	গোদাগাড়ী	godagariup.rajshahi.gov.bd
5794	\N	Mohonpur	মোহনপুর	mohonpurup.rajshahi.gov.bd
5795	\N	Pakri	পাকড়ী	pakriup.rajshahi.gov.bd
5796	\N	Risikul	রিশিকুল	risikulup.rajshahi.gov.bd
5797	\N	Gogram	গোগ্রাম	gogramup.rajshahi.gov.bd
5798	\N	Matikata	মাটিকাটা	matikataup.rajshahi.gov.bd
5799	\N	Dewpara	দেওপাড়া	dewparaup.rajshahi.gov.bd
5800	\N	Basudebpur	বাসুদেবপুর	basudebpurup.rajshahi.gov.bd
5801	\N	Asariadaha	আষাড়িয়াদহ	asariadahaup.rajshahi.gov.bd
5802	\N	Kalma	কলমা	kalmaup.rajshahi.gov.bd
5803	\N	Badhair	বাধাইড়	badhairup.rajshahi.gov.bd
5804	\N	Panchandar	পাঁচন্দর	panchandarup.rajshahi.gov.bd
5805	\N	Saranjai	সরঞ্জাই	saranjaiup.rajshahi.gov.bd
5806	\N	Talondo	তালন্দ	talondoup.rajshahi.gov.bd
5807	\N	Kamargaon	কামারগাঁ	kamargaonup.rajshahi.gov.bd
5808	\N	Chanduria	চান্দুড়িয়া	chanduriaup.rajshahi.gov.bd
5809	\N	Gobindopara	গোবিন্দপাড়া	gobindoparaup.rajshahi.gov.bd
5810	\N	Nordas	নরদাস	nordasup.rajshahi.gov.bd
5811	\N	Dippur	দ্বীপপুর	dippurup.rajshahi.gov.bd
5812	\N	Borobihanoli	বড়বিহানলী	borobihanoliup.rajshahi.gov.bd
5813	\N	Auchpara	আউচপাড়া	auchparaup.rajshahi.gov.bd
5814	\N	Sreepur	শ্রীপুর	sreepurup.rajshahi.gov.bd
5815	\N	Basupara	বাসুপাড়া	basuparaup.rajshahi.gov.bd
5816	\N	Kacharikoalipara	কাচাড়ী কোয়লিপাড়া	kacharikoaliparaup.rajshahi.gov.bd
5817	\N	Suvodanga	শুভডাঙ্গা	suvodangaup.rajshahi.gov.bd
5818	\N	Mariaup	মাড়িয়া	mariaup10.rajshahi.gov.bd
5819	\N	Ganipur	গণিপুর	ganipurup.rajshahi.gov.bd
5820	\N	Zhikara	ঝিকড়া	zhikaraup.rajshahi.gov.bd
5821	\N	Gualkandi	গোয়ালকান্দি	gualkandiup.rajshahi.gov.bd
5822	\N	Hamirkutsa	হামিরকুৎসা	hamirkutsaup.rajshahi.gov.bd
5823	\N	Jogipara	যোগিপাড়া	jogiparaup.rajshahi.gov.bd
5824	\N	Sonadanga	সোনাডাঙ্গা	sonadangaup.rajshahi.gov.bd
5825	\N	Brahmapur	ব্রহ্মপুর	brahmapurup.natore.gov.bd
5826	\N	Madhnagar	মাধনগর	madhnagar.natore.gov.bd
5827	\N	Khajura	খাজুরা	khajura.bdgovportal.com
5828	\N	Piprul	পিপরুল	piprulup.natore.gov.bd
5829	\N	Biprobelghoria	বিপ্রবেলঘড়িয়া	biprobelghoria.bdgovportal.com
5830	\N	Chhatni	ছাতনী	chhatni.bdgovportal.com
5831	\N	Tebaria	তেবাড়িয়া	tebariaup.natore.gov.bd
5832	\N	Dighapatia	দিঘাপতিয়া	dighapatiaup.natore.gov.bd
5833	\N	Luxmipurkholabaria	লক্ষীপুর খোলাবাড়িয়া	luxmipurkholabariaup.natore.gov.bd
5834	\N	Barahorispur	বড়হরিশপুর	barahorispur.bdgovportal.com
5835	\N	Kaphuria	কাফুরিয়া	kaphuria.bdgovportal.com
5836	\N	Halsa	হালসা	halsa.natore.gov.bd
5837	\N	Sukash	শুকাশ	sukashup.natore.gov.bd
5838	\N	Dahia	ডাহিয়া	dahiaup.natore.gov.bd
5839	\N	Italy	ইটালী	italyup.natore.gov.bd
5840	\N	Kalam	কলম	kalamup.natore.gov.bd
5841	\N	Chamari	চামারী	chamariup.natore.gov.bd
5842	\N	Hatiandaha	হাতিয়ানদহ	hatiandahaup.natore.gov.bd
5843	\N	Lalore	লালোর	laloreup.natore.gov.bd
5844	\N	Sherkole	শেরকোল	sherkoleup.natore.gov.bd
5845	\N	Tajpur	তাজপুর	tajpurup.natore.gov.bd
5846	\N	Chaugram	চৌগ্রাম	chaugramup.natore.gov.bd
5847	\N	Chhatardighi	ছাতারদিঘী	chhatardighiup.natore.gov.bd
5848	\N	Ramanandakhajura	রামান্দখাজুরা	ramanandakhajuraup.natore.gov.bd
5849	\N	Joari	জোয়াড়ী	joariup.natore.gov.bd
5850	\N	Baraigram	বড়াইগ্রাম	baraigramup.natore.gov.bd
5851	\N	Zonail	জোনাইল	zonailup.natore.gov.bd
5852	\N	Nagor	নগর	nagorup.natore.gov.bd
5853	\N	Majgoan	মাঝগাও	majgoanup.natore.gov.bd
5854	\N	Gopalpur	গোপালপুর	gopalpurup.natore.gov.bd
5855	\N	Chandai	চান্দাই	chandai.bdgovportal.com
5856	\N	Panka	পাঁকা	pankaup.natore.gov.bd
5857	\N	Jamnagor	জামনগর	jamnagorup.natore.gov.bd
5858	\N	Bagatipara	বাগাতিপাড়া	bagatiparaup.natore.gov.bd
5859	\N	Dayarampur	দয়ারামপুর	dayarampurup.natore.gov.bd
5860	\N	Faguardiar	ফাগুয়ারদিয়াড়	faguardiarup.natore.gov.bd
5861	\N	Lalpur	লালপুর	lalpurup.natore.gov.bd
5862	\N	Iswardi	ঈশ্বরদী	iswardiup.natore.gov.bd
5863	\N	Chongdhupoil	চংধুপইল	chongdhupoilup.natore.gov.bd
5864	\N	Arbab	আড়বাব	arbabup.natore.gov.bd
5865	\N	Bilmaria	বিলমাড়িয়া	bilmariaup.natore.gov.bd
5866	\N	Duaria	দুয়ারিয়া	duariaup.natore.gov.bd
5867	\N	Oalia	ওয়ালিয়া	oaliaup.natore.gov.bd
5868	\N	Durduria	দুড়দুরিয়া	durduriaup.natore.gov.bd
5869	\N	Arjunpur	অর্জুনপুর বরমহাটী	arjunpurup.natore.gov.bd
5870	\N	Kadimchilan	কদিমচিলান	kadimchilanup.natore.gov.bd
5871	\N	Nazirpur	নাজিরপুর	nazirpurup.natore.gov.bd
5872	\N	Biaghat	বিয়াঘাট	biaghatup.natore.gov.bd
5873	\N	Khubjipur	খুবজীপুর	khubjipurup.natore.gov.bd
5874	\N	Dharabarisha	ধারাবারিষা	dharabarishaup.natore.gov.bd
5875	\N	Moshindha	মসিন্দা	moshindhaup.natore.gov.bd
5876	\N	Chapila	চাপিলা	chapilaup.natore.gov.bd
5877	\N	Rukindipur	রুকিন্দীপুর	rukindipurup.joypurhat.gov.bd
5878	\N	Sonamukhi	সোনামূখী	sonamukhiup.joypurhat.gov.bd
5879	\N	Tilakpur	তিলকপুর	tilakpurup.joypurhat.gov.bd
5880	\N	Raikali	রায়কালী	raikaliup.joypurhat.gov.bd
5881	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.joypurhat.gov.bd
5882	\N	Matrai	মাত্রাই	matraiup.joypurhat.gov.bd
5883	\N	Ahammedabad	আহম্মেদাবাদ	ahammedabadup.joypurhat.gov.bd
5884	\N	Punot	পুনট	punotup.joypurhat.gov.bd
5885	\N	Zindarpur	জিন্দারপুর	zindarpurup.joypurhat.gov.bd
5886	\N	Udaipur	উদয়পুর	udaipurup.joypurhat.gov.bd
5887	\N	Alampur	আলমপুর	alampurup.joypurhat.gov.bd
5888	\N	Borail	বড়াইল	borailup.joypurhat.gov.bd
5889	\N	Tulshiganga	তুলশীগংগা	tulshigangaup.joypurhat.gov.bd
5890	\N	Mamudpur	মামুদপুর	mamudpurup.joypurhat.gov.bd
5891	\N	Boratara	বড়তারা	borataraup.joypurhat.gov.bd
5892	\N	Bagjana	বাগজানা	bagjanaup.joypurhat.gov.bd
5893	\N	Dharanji	ধরঞ্জি	dharanjiup.joypurhat.gov.bd
5894	\N	Aymarasulpur	আয়মারসুলপুর	aymarasulpurup.joypurhat.gov.bd
5895	\N	Balighata	বালিঘাটা	balighataup.joypurhat.gov.bd
5896	\N	Atapur	আটাপুর	atapurup.joypurhat.gov.bd
5897	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.joypurhat.gov.bd
5898	\N	Aolai	আওলাই	aolaiup.joypurhat.gov.bd
5899	\N	Kusumba	কুসুম্বা	kusumbaup.joypurhat.gov.bd
5900	\N	Amdai	আমদই	amdaiup.joypurhat.gov.bd
5901	\N	Bamb	বম্বু	bambuup.joypurhat.gov.bd
5902	\N	Dogachi	দোগাছি	dogachiup.joypurhat.gov.bd
5903	\N	Puranapail	পুরানাপৈল	puranapailup.joypurhat.gov.bd
5904	\N	Jamalpur	জামালপুর	jamalpurup.joypurhat.gov.bd
5905	\N	Chakborkat	চকবরকত	chakborkatup.joypurhat.gov.bd
5906	\N	Mohammadabad	মোহাম্মদাবাদ	mohammadabadup.joypurhat.gov.bd
5907	\N	Dhalahar	ধলাহার	dhalaharup.joypurhat.gov.bd
5908	\N	Bhadsha	ভাদসা	bhadshaup.joypurhat.gov.bd
5909	\N	Alatuli	আলাতুলী	alatuliup.chapainawabganj.gov.bd
5910	\N	Baroghoria	বারঘরিয়া	baroghoriaup.chapainawabganj.gov.bd
5911	\N	Moharajpur	মহারাজপুর	moharajpurup.chapainawabganj.gov.bd
5912	\N	Ranihati	রানীহাটি	ranihatiup.chapainawabganj.gov.bd
5913	\N	Baliadanga	বালিয়াডাঙ্গা	baliadangaup.chapainawabganj.gov.bd
5914	\N	Gobratola	গোবরাতলা	gobratolaup.chapainawabganj.gov.bd
5915	\N	Jhilim	ঝিলিম	jhilimup.chapainawabganj.gov.bd
5916	\N	Char Anupnagar	চর অনুপনগর	charaunupnagarup.chapainawabganj.gov.bd
5917	\N	Debinagar	দেবীনগর	debinagarup.chapainawabganj.gov.bd
5918	\N	Shahjahanpur	শাহজাহানপুর	shahjahanpurup.chapainawabganj.gov.bd
5919	\N	Islampur	ইসলামপুর	islampurup.chapainawabganj.gov.bd
5920	\N	Charbagdanga	চরবাগডাঙ্গা	charbagdangaup.chapainawabganj.gov.bd
5921	\N	Narayanpur	নারায়নপুর	narayanpurup.chapainawabganj.gov.bd
5922	\N	Sundarpur	সুন্দরপুর	sundarpurup.chapainawabganj.gov.bd
5923	\N	Radhanagar	রাধানগর	radhanagarup.chapainawabganj.gov.bd
5924	\N	Rahanpur	রহনপুর	rahanpurup.chapainawabganj.gov.bd
5925	\N	Boalia	বোয়ালিয়া	boaliaup.chapainawabganj.gov.bd
5926	\N	Bangabari	বাঙ্গাবাড়ী	bangabariup.chapainawabganj.gov.bd
5927	\N	Parbotipur	পার্বতীপুর	parbotipurup.chapainawabganj.gov.bd
5928	\N	Chowdala	চৌডালা	chowdalaup.chapainawabganj.gov.bd
5929	\N	Gomostapur	গোমস্তাপুর	gomostapurup.chapainawabganj.gov.bd
5930	\N	Alinagar	আলীনগর	alinagarup.chapainawabganj.gov.bd
5931	\N	Fhotepur	ফতেপুর	fhotepurup.chapainawabganj.gov.bd
5932	\N	Kosba	কসবা	kosbaup.chapainawabganj.gov.bd
5933	\N	Nezampur	নেজামপুর	nezampurup.chapainawabganj.gov.bd
5934	\N	Nachol	নাচোল	nacholup.chapainawabganj.gov.bd
5935	\N	Bholahat	ভোলাহাট	bholahatup.chapainawabganj.gov.bd
5936	\N	Jambaria	জামবাড়িয়া	jambariaup.chapainawabganj.gov.bd
5937	\N	Gohalbari	গোহালবাড়ী	gohalbariup.chapainawabganj.gov.bd
5938	\N	Daldoli	দলদলী	daldoliup.chapainawabganj.gov.bd
5939	\N	Binodpur	বিনোদপুর	binodpurup.chapainawabganj.gov.bd
5940	\N	Chakkirti	চককির্তী	chakkirtiup.chapainawabganj.gov.bd
5941	\N	Daipukuria	দাইপুকুরিয়া	daipukuriaup.chapainawabganj.gov.bd
5942	\N	Dhainagar	ধাইনগর	dhainagarup.chapainawabganj.gov.bd
5943	\N	Durlovpur	দুর্লভপুর	durlovpurup.chapainawabganj.gov.bd
5944	\N	Ghorapakhia	ঘোড়াপাখিয়া	ghorapakhiaup.chapainawabganj.gov.bd
5945	\N	Mobarakpur	মোবারকপুর	mobarakpurup.chapainawabganj.gov.bd
5946	\N	Monakasha	মনাকষা	monakashaup.chapainawabganj.gov.bd
5947	\N	Noyalavanga	নয়ালাভাঙ্গা	noyalavangaup.chapainawabganj.gov.bd
5948	\N	Panka	পাঁকা	pankaup.chapainawabganj.gov.bd
5949	\N	Chatrajitpur	ছত্রাজিতপুর	chhatrajitpurup.chapainawabganj.gov.bd
5950	\N	Shahabajpur	শাহাবাজপুর	shahabajpurup.chapainawabganj.gov.bd
5951	\N	Shyampur	শ্যামপুর	shyampurup.chapainawabganj.gov.bd
5952	\N	Kansat	কানসাট	kansatup.bdgovportal.com
5953	\N	Ujirpur	উজিরপুর	ujirpurup.chapainawabganj.gov.bd
5954	\N	1nomohadevpur	মহাদেবপুর	1nomohadevpurup.naogaon.gov.bd
5955	\N	Hatur	হাতুড়	2nohaturup.naogaon.gov.bd
5956	\N	Khajur	খাজুর	3nokhajurup.naogaon.gov.bd
5957	\N	Chandas	চাঁন্দাশ	4nochandasup.naogaon.gov.bd
5958	\N	Enayetpur	এনায়েতপুর	6noenayetpurup.naogaon.gov.bd
5959	\N	Sofapur	সফাপুর	7nosofapurup.naogaon.gov.bd
5960	\N	Uttargram	উত্তরগ্রাম	8nouttargramup.naogaon.gov.bd
5961	\N	Cheragpur	চেরাগপুর	9nocheragpurup.naogaon.gov.bd
5962	\N	Vimpur	ভীমপুর	10novimpurup.naogaon.gov.bd
5963	\N	Roygon	রাইগাঁ	roygonup.naogaon.gov.bd
5964	\N	Badalgachi	বদলগাছী	1nobadalgachiup.naogaon.gov.bd
5965	\N	Mothurapur	মথুরাপুর	2nomothurapurup.naogaon.gov.bd
5966	\N	Paharpur	পাহারপুর	3nopaharpurup.naogaon.gov.bd
5967	\N	Mithapur	মিঠাপুর	4nomithapurup.naogaon.gov.bd
5968	\N	Kola	কোলা	5nokolaup.naogaon.gov.bd
5969	\N	Bilashbari	বিলাশবাড়ী	6nobilashbariup.naogaon.gov.bd
5970	\N	Adhaipur	আধাইপুর	7noadhaipurup.naogaon.gov.bd
5971	\N	Balubhara	বালুভরা	8nobalubharaup.naogaon.gov.bd
5972	\N	Patnitala	পত্নীতলা	1nopatnitalaup.naogaon.gov.bd
5973	\N	Nirmail	নিমইল	2nonirmailup.naogaon.gov.bd
5974	\N	Dibar	দিবর	3nodibarup.naogaon.gov.bd
5975	\N	Akbarpur	আকবরপুর	4noakbarpurup.naogaon.gov.bd
5976	\N	Matindar	মাটিন্দর	5nomatindarup.naogaon.gov.bd
5977	\N	Krishnapur	কৃষ্ণপুর	6nokrishnapurup.naogaon.gov.bd
5978	\N	Patichrara	পাটিচড়া	7nopatichraraup.naogaon.gov.bd
5979	\N	Nazipur	নজিপুর	8nonazipurup.naogaon.gov.bd
5980	\N	Ghasnagar	ঘষনগর	9noghasnagarup.naogaon.gov.bd
5981	\N	Amair	আমাইড়	10noamairup.naogaon.gov.bd
5982	\N	Shihara	শিহারা	11noahiharaup.naogaon.gov.bd
5983	\N	Dhamoirhat	ধামইরহাট	1nodhamoirhatup.naogaon.gov.bd
5984	\N	Alampur	আলমপুর	3noalampurup.naogaon.gov.bd
5985	\N	Umar	উমার	4noumarup.naogaon.gov.bd
5986	\N	Aranagar	আড়ানগর	5noaranagarup.naogaon.gov.bd
5987	\N	Jahanpur	জাহানপুর	6nojahanpurup.naogaon.gov.bd
5988	\N	Isabpur	ইসবপুর	7noisabpurup.naogaon.gov.bd
5989	\N	Khelna	খেলনা	8nokhelnaup.naogaon.gov.bd
5990	\N	Agradigun	আগ্রাদ্বিগুন	2noagradigunup.naogaon.gov.bd
5991	\N	Hajinagar	হাজীনগর	1nohajinagarup.naogaon.gov.bd
5992	\N	Chandannagar	চন্দননগর	2nochandannagarup.naogaon.gov.bd
5993	\N	Bhabicha	ভাবিচা	3nobhabichaup.naogaon.gov.bd
5994	\N	Niamatpur	নিয়ামতপুর	4noniamatpurup.naogaon.gov.bd
5995	\N	Rasulpur	রসুলপুর	5norasulpurup.naogaon.gov.bd
5996	\N	Paroil	পাড়ইল	6noparoilup.naogaon.gov.bd
5997	\N	Sremantapur	শ্রীমন্তপুর	7nosremantapurup.naogaon.gov.bd
5998	\N	Bahadurpur	বাহাদুরপুর	8nobahadurpurup.naogaon.gov.bd
5999	\N	Varsho	ভারশো	1novarshoup.naogaon.gov.bd
6000	\N	Valain	ভালাইন	2novalainup.naogaon.gov.bd
6001	\N	Paranpur	পরানপুর	3noparanpurup.naogaon.gov.bd
6002	\N	Manda	মান্দা	4nomandaup.naogaon.gov.bd
6003	\N	Goneshpur	গনেশপুর	5nogoneshpurup.naogaon.gov.bd
6004	\N	Moinom	মৈনম	6nomoinomup.naogaon.gov.bd
6005	\N	Proshadpur	প্রসাদপুর	7noproshadpurup.naogaon.gov.bd
6006	\N	Kosomba	কুসুম্বা	8nokosombaup.naogaon.gov.bd
6007	\N	Tetulia	তেঁতুলিয়া	9notetuliaup.naogaon.gov.bd
6008	\N	Nurullabad	নূরুল্যাবাদ	10nonurullabadup.naogaon.gov.bd
6009	\N	Kalikapur	কালিকাপুর	11nokalikapurup.naogaon.gov.bd
6010	\N	Kashopara	কাঁশোকাপুর	12nokashoparaup.naogaon.gov.bd
6011	\N	Koshob	কশব	13nokoshobup.naogaon.gov.bd
6012	\N	Bisnopur	বিষ্ণপুর	14nobisnopurup.naogaon.gov.bd
6013	\N	Shahagola	শাহাগোলা	1noshahagolaup.naogaon.gov.bd
6014	\N	Bhonpara	ভোঁপড়া	2nobhonparaup.naogaon.gov.bd
6015	\N	Ahsanganj	আহসানগঞ্জ	3noahsanganjup.naogaon.gov.bd
6016	\N	Panchupur	পাঁচুপুর	4nopanchupurup.naogaon.gov.bd
6017	\N	Bisha	বিশা	5nobishaup.naogaon.gov.bd
6018	\N	Maniary	মনিয়ারী	6nomaniaryup.naogaon.gov.bd
6019	\N	Kalikapur	কালিকাপুর	7nokalikapurup.naogaon.gov.bd
6020	\N	Hatkalupara	হাটকালুপাড়া	8nohatkaluparaup.naogaon.gov.bd
6021	\N	Khatteshawr	খট্টেশ্বর রাণীনগর	1nokhatteshawrup.naogaon.gov.bd
6022	\N	Kashimpur	কাশিমপুর	2nokashimpurup.naogaon.gov.bd
6023	\N	Gona	গোনা	3nogonaup.naogaon.gov.bd
6024	\N	Paroil	পারইল	4noparoilup.naogaon.gov.bd
6025	\N	Borgoca	বরগাছা	5noborgocaup.naogaon.gov.bd
6026	\N	Kaligram	কালিগ্রাম	6nokaligramup.naogaon.gov.bd
6027	\N	Ekdala	একডালা	7noekdalaup.naogaon.gov.bd
6028	\N	Mirat	মিরাট	8nomiratup.naogaon.gov.bd
6029	\N	Barshail	বর্ষাইল	1nobarshailup.naogaon.gov.bd
6030	\N	Kritipur	কির্ত্তিপুর	2nokritipurup.naogaon.gov.bd
6031	\N	Baktiarpur	বক্তারপুর	3nobaktiarpurup.naogaon.gov.bd
6032	\N	Tilakpur	তিলোকপুর	4notilakpurup.naogaon.gov.bd
6033	\N	Hapaniya	হাপানিয়া	5nohapaniyaup.naogaon.gov.bd
6034	\N	Dubalhati	দুবলহাটী	6nodubalhatiup.naogaon.gov.bd
6035	\N	Boalia	বোয়ালিয়া	7noboaliaup.naogaon.gov.bd
6036	\N	Hashaigari	হাঁসাইগাড়ী	8nohashaigariup.naogaon.gov.bd
6037	\N	Chandipur	চন্ডিপুর	9nochandipurup.naogaon.gov.bd
6038	\N	Bolihar	বলিহার	10noboliharup.naogaon.gov.bd
6039	\N	Shekerpur	শিকারপুর	11noshekerpurup.naogaon.gov.bd
6040	\N	Shailgachhi	শৈলগাছী	12noshailgachhiup.naogaon.gov.bd
6041	\N	Nitpur	নিতপুর	nitpurup.naogaon.gov.bd
6042	\N	Tetulia	তেঁতুলিয়া	2notetuliaup.naogaon.gov.bd
6043	\N	Chhaor	ছাওড়	3nochhaorup.naogaon.gov.bd
6044	\N	Ganguria	গাঙ্গুরিয়া	4noganguriaup.naogaon.gov.bd
6045	\N	Ghatnagar	ঘাটনগর	5noghatnagarup.naogaon.gov.bd
6046	\N	Moshidpur	মশিদপুর	6nomoshidpurup.naogaon.gov.bd
6047	\N	Sapahar	সাপাহার	1nosapaharup.naogaon.gov.bd
6048	\N	Tilna	তিলনা	3notilnaup.naogaon.gov.bd
6049	\N	Aihai	আইহাই	4noaihaiup.naogaon.gov.bd
6050	\N	Shironti	শিরন্টী	6noshirontiup.naogaon.gov.bd
6051	\N	Goala	গোয়ালা	goalaup.naogaon.gov.bd
6052	\N	Patari	পাতাড়ী	patariup.naogaon.gov.bd
6053	\N	Nehalpur	নেহালপুর	nehalpurup.jessore.gov.bd
6054	\N	Hariharnagar	হরিহরনগর	hariharnagarup.jessore.gov.bd
6055	\N	Haridaskati	হরিদাসকাটি	haridaskatiup.jessore.gov.bd
6056	\N	Shyamkur	শ্যামকুড়	shyamkurup.jessore.gov.bd
6057	\N	Rohita	রোহিতা	rohitaup.jessore.gov.bd
6058	\N	Maswimnagar	মশ্মিমনগর	maswimnagarup.jessore.gov.bd
6059	\N	Manoharpur	মনোহরপুর	manoharpurup.jessore.gov.bd
6060	\N	Manirampur	মনিরামপুর	manirampurup.jessore.gov.bd
6061	\N	Bhojgati	ভোজগাতি	bhojgatiup.jessore.gov.bd
6062	\N	Durbadanga	দুর্বাডাংগা	durbadangaup.jessore.gov.bd
6063	\N	Dhakuria	ঢাকুরিয়া	dhakuriaup.jessore.gov.bd
6064	\N	Jhanpa	ঝাঁপা	jhanpaup.jessore.gov.bd
6065	\N	Chaluahati	চালুয়াহাটি	chaluahatiup.jessore.gov.bd
6066	\N	Khedapara	খেদাপাড়া	khedaparaup.jessore.gov.bd
6067	\N	Khanpur	খানপুর	khanpurup.jessore.gov.bd
6068	\N	Kultia	কুলটিয়া	kultiaup.jessore.gov.bd
6069	\N	Kashimnagar	কাশিমনগর	kashimnagarup.jessore.gov.bd
6070	\N	Baghutia	বাঘুটিয়া	baghutia.jessore.gov.bd
6071	\N	Chalishia	চলিশিয়া	chalishiaup.jessore.gov.bd
6072	\N	Sundoli	সুন্দলী	sundoliup.jessore.gov.bd
6073	\N	Siddhipasha	সিদ্দিপাশা	siddhipashaup.jessore.gov.bd
6074	\N	Sreedharpur	শ্রীধরপুর	sreedharpurup.jessore.gov.bd
6075	\N	Subharara	শুভরাড়া	subhararaup.jessore.gov.bd
6076	\N	Prambag	প্রেমবাগ	prambagup.jessore.gov.bd
6077	\N	Payra	পায়রা	payraup.jessore.gov.bd
6078	\N	Jaharpur	জহুরপুর	jaharpurup.jessore.gov.bd
6079	\N	Jamdia	জামদিয়া	jamdiaup.jessore.gov.bd
6080	\N	Darajhat	দরাজহাট	darajhatup.jessore.gov.bd
6081	\N	Dhalgram	ধলগ্রাম	dhalgramup.jessore.gov.bd
6082	\N	Narikelbaria	নারিকেলবাড়ীয়া	narikelbariaup.jessore.gov.bd
6083	\N	Bandabilla	বন্দবিলা	bandabillaup.jessore.gov.bd
6084	\N	Basuari	বাসুয়াড়ী	basuariup.jessore.gov.bd
6085	\N	Roypur	রায়পুর	roypurup.jessore.gov.bd
6086	\N	Dohakula	দোহাকুলা	dohakulaup.jessore.gov.bd
6087	\N	Chougachha	চৌগাছা	chougachhaup5.jessore.gov.bd
6088	\N	Jagadishpur	জগদীশপুর	jagadishpurup6.jessore.gov.bd
6089	\N	Dhuliani	ধুলিয়ানী	dhulianiup4.jessore.gov.bd
6090	\N	Narayanpur	নারায়নপুর	narayanpurup10.jessore.gov.bd
6091	\N	Patibila	পাতিবিলা	patibilaup7.jessore.gov.bd
6092	\N	Pashapole	পাশাপোল	pashapoleup2.jessore.gov.bd
6093	\N	Fulsara	ফুলসারা	fulsaraup1.jessore.gov.bd
6094	\N	Singhajhuli	সিংহঝুলি	singhajhuliup3.jessore.gov.bd
6095	\N	Sukpukhuria	সুখপুকুরিয়া	sukpukhuriaup11.jessore.gov.bd
6096	\N	Swarupdaha	সরুপদাহ	swarupdahaup9.jessore.gov.bd
6097	\N	Hakimpur	হাকিমপুর	hakimpurup8.jessore.gov.bd
6098	\N	Gangananda	গংগানন্দপুর	ganganandapurup.jessore.gov.bd
6099	\N	Gadkhali	গদখালী	gadkhaliup.jessore.gov.bd
6100	\N	Jhikargachha	ঝিকরগাছা	jhikargachhaup.jessore.gov.bd
6101	\N	Nabharan	নাভারন	nabharanup.jessore.gov.bd
6102	\N	Nibaskhola	নির্বাসখোলা	nibaskholaup.jessore.gov.bd
6103	\N	Panisara	পানিসারা	panisaraup.jessore.gov.bd
6104	\N	Bankra	বাঁকড়া	bankraup.jessore.gov.bd
6105	\N	Shankarpur	শংকরপুর	shankarpurup10.jessore.gov.bd
6106	\N	Shimulia	শিমুলিয়া	shimuliaup3.jessore.gov.bd
6107	\N	Hajirbagh	হাজিরবাগ	hajirbaghup9.jessore.gov.bd
6108	\N	Magura	মাগুরা	maguraup.jessore.gov.bd
6109	\N	Sufalakati	সুফলাকাটি	sufalakatiup8.jessore.gov.bd
6110	\N	Sagardari	সাগরদাড়ী	sagardariup2.jessore.gov.bd
6111	\N	Majidpur	মজিদপুর	majidpurup3.jessore.gov.bd
6112	\N	Mongolkot	মঙ্গলকোর্ট	mongolkotup5.jessore.gov.bd
6113	\N	Bidyanandakati	বিদ্যানন্দকাটি	bidyanandakatiup4.jessore.gov.bd
6114	\N	Panjia	পাজিয়া	panjiaup7.jessore.gov.bd
6115	\N	Trimohini	ত্রিমোহিনী	trimohiniup1.jessore.gov.bd
6116	\N	Gaurighona	গৌরিঘোনা	gaurighonaup9.jessore.gov.bd
6117	\N	Keshabpur	কেশবপুর	keshabpurup6.jessore.gov.bd
6118	\N	Lebutala	লেবুতলা	lebutalaup.jessore.gov.bd
6119	\N	Ichhali	ইছালী	ichhaliup.jessore.gov.bd
6120	\N	Arabpur	আরবপুর	arabpurup9.jessore.gov.bd
6121	\N	Upasahar	উপশহর	upasaharup.jessore.gov.bd
6122	\N	Kachua	কচুয়া	kachuaup13.jessore.gov.bd
6123	\N	Kashimpur	কাশিমপুর	kashimpurup6.jessore.gov.bd
6124	\N	Chanchra	চাঁচড়া	chanchraup.jessore.gov.bd
6125	\N	Churamankati	চূড়ামনকাটি	churamankatiup.jessore.gov.bd
6126	\N	Narendrapur	নরেন্দ্রপুর	narendrapurup.jessore.gov.bd
6127	\N	Noapara	নওয়াপাড়া	noaparaup4.jessore.gov.bd
6128	\N	Fathehpur	ফতেপুর	fathehpurup.jessore.gov.bd
6129	\N	Basundia	বসুন্দিয়া	basundiaup.jessore.gov.bd
6130	\N	Ramnagar	রামনগর	ramnagarup.jessore.gov.bd
6131	\N	Haibatpur	হৈবতপুর	haibatpurup.jessore.gov.bd
6132	\N	Dearamodel	দেয়ারা মডেল	dearamodelup.jessore.gov.bd
6133	\N	Ulshi	উলশী	ulshiup9.jessore.gov.bd
6134	\N	Sharsha	শার্শা	sharshaup10.jessore.gov.bd
6135	\N	Lakshmanpur	লক্ষণপুর	lakshmanpurup2.jessore.gov.bd
6136	\N	Benapole	বেনাপোল	benapoleup4.jessore.gov.bd
6137	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup3.jessore.gov.bd
6138	\N	Bagachra	বাগআচড়া	bagachraup8.jessore.gov.bd
6139	\N	Putkhali	পুটখালী	putkhaliup5.jessore.gov.bd
6140	\N	Nizampur	নিজামপুর	nizampurup11.jessore.gov.bd
6141	\N	Dihi	ডিহি	dihiup1.jessore.gov.bd
6142	\N	Goga	গোগা	gogaup6.jessore.gov.bd
6143	\N	Kayba	কায়বা	kaybaup7.jessore.gov.bd
6144	\N	Anulia	আনুলিয়া	anuliaup.satkhira.gov.bd
6145	\N	Assasuni	আশাশুনি	assasuniup.satkhira.gov.bd
6146	\N	Kadakati	কাদাকাটি	kadakatiup.satkhira.gov.bd
6147	\N	Kulla	কুল্যা	kullaup.satkhira.gov.bd
6148	\N	Khajra	খাজরা	khajraup.satkhira.gov.bd
6149	\N	Durgapur	দরগাহপুর	durgapurup.satkhira.gov.bd
6150	\N	Pratapnagar	প্রতাপনগর	pratapnagarup.satkhira.gov.bd
6151	\N	Budhhata	বুধহাটা	budhhataup.satkhira.gov.bd
6152	\N	Baradal	বড়দল	baradalup.satkhira.gov.bd
6153	\N	Sreeula	শ্রীউলা	sreeulaup.satkhira.gov.bd
6154	\N	Sobhnali	শোভনালী	sobhnaliup.satkhira.gov.bd
6155	\N	Kulia	কুলিয়া	kuliaup.satkhira.gov.bd
6156	\N	Debhata	দেবহাটা	debhataup.satkhira.gov.bd
6157	\N	Noapara	নওয়াপাড়া	noaparaup.satkhira.gov.bd
6158	\N	Parulia	পারুলিয়া	paruliaup.satkhira.gov.bd
6159	\N	Sakhipur	সখিপুর	sakhipurup.satkhira.gov.bd
6160	\N	Kushadanga	কুশোডাংগা	kushadangaup.satkhira.gov.bd
6161	\N	Keralkata	কেরালকাতা	keralkataup.satkhira.gov.bd
6162	\N	Keragachhi	কেঁড়াগাছি	keragachhiup.satkhira.gov.bd
6163	\N	Kaila	কয়লা	kailaup.satkhira.gov.bd
6164	\N	Jallabad	জালালাবাদ	jallabadup.satkhira.gov.bd
6165	\N	Jogikhali	যুগিখালী	jogikhaliup.satkhira.gov.bd
6166	\N	Langaljhara	লাঙ্গলঝাড়া	langaljharaup.satkhira.gov.bd
6167	\N	Sonabaria	সোনাবাড়িয়া	sonabariaup.satkhira.gov.bd
6168	\N	Helatala	হেলাতলা	helatalaup.satkhira.gov.bd
6169	\N	Chandanpur	চন্দনপুর	chandanpurup.satkhira.gov.bd
6170	\N	Deara	দেয়ারা	dearaup.satkhira.gov.bd
6171	\N	Joynagar	জয়নগর	joynagarup.satkhira.gov.bd
6172	\N	Shibpur	শিবপুর	shibpurup.satkhira.gov.bd
6173	\N	Labsa	লাবসা	labsaup.satkhira.gov.bd
6174	\N	Bhomra	ভোমরা	bhomraup.satkhira.gov.bd
6175	\N	Brahmarajpur	ব্রক্ষ্মরাজপুর	brahmarajpurup.satkhira.gov.bd
6176	\N	Balli	বল্লী	balliup.satkhira.gov.bd
6177	\N	Banshdaha	বাঁশদহ	banshdahaup.satkhira.gov.bd
6178	\N	Baikari	বৈকারী	baikariup.satkhira.gov.bd
6179	\N	Fingri	ফিংড়ি	fingriup.satkhira.gov.bd
6180	\N	Dhulihar	ধুলিহর	dhuliharup.satkhira.gov.bd
6181	\N	Jhaudanga	ঝাউডাঙ্গা	jhaudangaup.satkhira.gov.bd
6182	\N	Ghona	ঘোনা	ghonaup.satkhira.gov.bd
6183	\N	Kuskhali	কুশখালী	kuskhaliup.satkhira.gov.bd
6184	\N	Alipur	আলিপুর	alipurup.satkhira.gov.bd
6185	\N	Agardari	আগরদাড়ী	agardariup.satkhira.gov.bd
6186	\N	Atulia	আটুলিয়া	atuliaup.satkhira.gov.bd
6187	\N	Ishwaripur	ঈশ্বরীপুর	ishwaripurup.satkhira.gov.bd
6188	\N	Kaikhali	কৈখালী	kaikhaliup.satkhira.gov.bd
6189	\N	Kashimari	কাশিমাড়ী	kashimariup.satkhira.gov.bd
6190	\N	Nurnagar	নুরনগর	nurnagarup.satkhira.gov.bd
6191	\N	Padmapukur	পদ্মপুকুর	padmapukurup.satkhira.gov.bd
6192	\N	Burigoalini	বুড়িগোয়ালিনী	burigoaliniup.satkhira.gov.bd
6193	\N	Bhurulia	ভুরুলিয়া	bhuruliaup.satkhira.gov.bd
6194	\N	Munshiganj	মুন্সীগজ্ঞ	munshiganjup.satkhira.gov.bd
6195	\N	Ramjannagar	রমজাননগর	ramjannagarup.satkhira.gov.bd
6196	\N	Shyamnagar	শ্যামনগর	shyamnagarup.satkhira.gov.bd
6197	\N	Gabura	গাবুরা	gaburaup.satkhira.gov.bd
6198	\N	Sarulia	সরুলিয়া	saruliaup3.satkhira.gov.bd
6199	\N	Magura	মাগুরা	maguraup8.satkhira.gov.bd
6200	\N	Nagarghata	নগরঘাটা	nagarghataup1.satkhira.gov.bd
6201	\N	Dhandia	ধানদিয়া	dhandiaup1.satkhira.gov.bd
6202	\N	Tentulia	তেতুলিয়া	tentuliaup5.satkhira.gov.bd
6203	\N	Tala	তালা	talaup6.satkhira.gov.bd
6204	\N	Jalalpur	জালালপুর	jalalpurup11.satkhira.gov.bd
6205	\N	Khesra	খেশরা	khesraup10.satkhira.gov.bd
6206	\N	Khalishkhali	খলিশখালী	khalishkhaliup9.satkhira.gov.bd
6207	\N	Khalilnagar	খলিলনগর	khalilnagarup12.satkhira.gov.bd
6208	\N	Kumira	কুমিরা	kumiraup4.satkhira.gov.bd
6209	\N	Islamkati	ইসলামকাটি	islamkatiup7.satkhira.gov.bd
6210	\N	Kushlia	কুশুলিয়া	kushliaup.satkhira.gov.bd
6211	\N	Champaphul	চাম্পাফুল	champaphulup.satkhira.gov.bd
6212	\N	Tarali	তারালী	taraliup.satkhira.gov.bd
6213	\N	Dakshin Sreepur	দক্ষিণ শ্রীপুর	dakshinsreepurup.satkhira.gov.bd
6214	\N	Dhalbaria	ধলবাড়িয়া	dhalbariaup.satkhira.gov.bd
6215	\N	Nalta	নলতা	naltaup.satkhira.gov.bd
6216	\N	Bishnupur	বিষ্ণুপুর	bishnupurup.satkhira.gov.bd
6217	\N	Bharasimla	ভাড়াশিমলা	bharasimlaup.satkhira.gov.bd
6218	\N	Mathureshpur	মথুরেশপুর	mathureshpurup.satkhira.gov.bd
6219	\N	Ratanpur	রতনপুর	ratanpurup.satkhira.gov.bd
6220	\N	Mautala	মৌতলা	mautalaup.satkhira.gov.bd
6221	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.satkhira.gov.bd
6222	\N	Dariapur	দারিয়াপুর	dariapurup.meherpur.gov.bd
6223	\N	Monakhali	মোনাখালী	monakhali.meherpur.gov.bd
6224	\N	Bagowan	বাগোয়ান	bagowanup.meherpur.gov.bd
6225	\N	Mohajanpur	মহাজনপুর	mohajanpurup.meherpur.gov.bd
6226	\N	Amjhupi	আমঝুপি	amjhupi.meherpur.gov.bd
6227	\N	Pirojpur	পিরোজপুর	pirojpurup.meherpur.gov.bd
6228	\N	Kutubpur	কতুবপুর	kutubpurup.meherpur.gov.bd
6229	\N	Amdah	আমদহ	amdahup.meherpur.gov.bd
6230	\N	Buripota	বুড়িপোতা	buripotaup.meherpur.gov.bd
6231	\N	Tentulbaria	তেঁতুলবাড়ীয়া	tentulbaria.meherpur.gov.bd
6232	\N	Kazipur	কাজিপুর	kazipurup.meherpur.gov.bd
6233	\N	Bamondi	বামন্দী	bamondiup.meherpur.gov.bd
6234	\N	Motmura	মটমুড়া	motmuraup.meherpur.gov.bd
6235	\N	Sholotaka	ষোলটাকা	sholotakaup.meherpur.gov.bd
6236	\N	Shaharbati	সাহারবাটী	shaharbatiup.meherpur.gov.bd
6237	\N	Dhankolla	ধানখোলা	dhankollaup.meherpur.gov.bd
6238	\N	Raipur	রায়পুর	raipurup.meherpur.gov.bd
6239	\N	Kathuli	কাথুলী	kathuli.meherpur.gov.bd
6240	\N	Sheikhati	সেখহাটী	sheikhatiup.narail.gov.bd
6241	\N	Tularampur	তুলারামপুর	tularampurup.narail.gov.bd
6242	\N	Kalora	কলোড়া	kaloraup.narail.gov.bd
6243	\N	Shahabad	শাহাবাদ	shahabadup.narail.gov.bd
6244	\N	Bashgram	বাশগ্রাম	bashgramup.narail.gov.bd
6245	\N	Habokhali	হবখালী	habokhaliup.narail.gov.bd
6246	\N	Maijpara	মাইজপাড়া	maijparaup.narail.gov.bd
6247	\N	Bisali	বিছালী	bisaliup.narail.gov.bd
6248	\N	Chandiborpur	চন্ডিবরপুর	chandiborpurup.narail.gov.bd
6249	\N	Bhadrabila	ভদ্রবিলা	bhadrabilaup.narail.gov.bd
6250	\N	Auria	আউড়িয়া	auriaup.narail.gov.bd
6251	\N	Singasholpur	সিঙ্গাশোলপুর	singasholpurup.narail.gov.bd
6252	\N	Mulia	মুলিয়া	muliaup.narail.gov.bd
6253	\N	Lohagora	লোহাগড়া	lohagoraup.narail.gov.bd
6254	\N	Kashipur	কাশিপুর	kashipurup.narail.gov.bd
6255	\N	Naldi	নলদী	naldiup.narail.gov.bd
6256	\N	Noagram	নোয়াগ্রাম	noagramup.narail.gov.bd
6257	\N	Lahuria	লাহুড়িয়া	lahuriaup.narail.gov.bd
6258	\N	Mallikpur	মল্লিকপুর	mallikpurup.narail.gov.bd
6259	\N	Salnagar	শালনগর	salnagarup.narail.gov.bd
6260	\N	Lakshmipasha	লক্ষীপাশা	lakshmipashaup.narail.gov.bd
6261	\N	Joypur	জয়পুর	joypurup.narail.gov.bd
6262	\N	Kotakol	কোটাকোল	kotakolup.narail.gov.bd
6263	\N	Digholia	দিঘলিয়া	digholiaup1.narail.gov.bd
6264	\N	Itna	ইতনা	itnaup.narail.gov.bd
6265	\N	Jaynagor	জয়নগর	jaynagorup.narail.gov.bd
6266	\N	Pahordanga	পহরডাঙ্গা	pahordangaup.narail.gov.bd
6267	\N	Babrahasla	বাবরা-হাচলা	babrahaslaup.narail.gov.bd
6268	\N	Salamabad	সালামাবাদ	salamabadup.narail.gov.bd
6269	\N	Baioshona	বাঐসোনা	baioshonaup.narail.gov.bd
6270	\N	Chacuri	চাচুড়ী	chacuriup.narail.gov.bd
6271	\N	Hamidpur	হামিদপুর	hamidpurup.narail.gov.bd
6272	\N	Peroli	পেড়লী	peroliup.narail.gov.bd
6273	\N	Khashial	খাসিয়াল	khashialup.narail.gov.bd
6274	\N	Purulia	পুরুলিয়া	puruliaup.narail.gov.bd
6275	\N	Kalabaria	কলাবাড়ীয়া	kalabariaup.narail.gov.bd
6276	\N	Mauli	মাউলী	mauliup.narail.gov.bd
6277	\N	Boronaleliasabad	বড়নাল-ইলিয়াছাবাদ	boronaleliasabadup.narail.gov.bd
6278	\N	Panchgram	পাঁচগ্রাম	panchgramup.narail.gov.bd
6279	\N	Alukdia	আলুকদিয়া	alukdia.chuadanga.gov.bd
6280	\N	Mominpur	মোমিনপুর	mominpur.chuadanga.gov.bd
6281	\N	Titudah	তিতুদাহ	titudah.chuadanga.gov.bd
6282	\N	Shankarchandra	শংকরচন্দ্র	shankarchandra.chuadanga.gov.bd
6283	\N	Begumpur	বেগমপুর	begumpur.chuadanga.gov.bd
6284	\N	Kutubpur	কুতুবপুর	kutubpur.chuadanga.gov.bd
6285	\N	Padmabila	পদ্মবিলা	padmabila.chuadanga.gov.bd
6286	\N	Bhangbaria	ভাংবাড়ীয়া	bhangbaria.chuadanga.gov.bd
6287	\N	Baradi	বাড়াদী	baradiup.chuadanga.gov.bd
6288	\N	Gangni	গাংনী	gangniup.chuadanga.gov.bd
6289	\N	Khadimpur	খাদিমপুর	khadimpurup.chuadanga.gov.bd
6290	\N	Jehala	জেহালা	jehalaup.chuadanga.gov.bd
6291	\N	Belgachi	বেলগাছি	belgachiup.chuadanga.gov.bd
6292	\N	Dauki	ডাউকী	daukiup.chuadanga.gov.bd
6293	\N	Jamjami	জামজামি	jamjamiup.chuadanga.gov.bd
6294	\N	Nagdah	নাগদাহ	nagdahup.chuadanga.gov.bd
6295	\N	Kashkorara	খাসকররা	kashkoraraup.chuadanga.gov.bd
6296	\N	Chitla	চিৎলা	chitlaup.chuadanga.gov.bd
6297	\N	Kalidashpur	কালিদাসপুর	kalidashpurup.chuadanga.gov.bd
6298	\N	Kumari	কুমারী	kumariup.chuadanga.gov.bd
6299	\N	Hardi	হারদী	hardiup.chuadanga.gov.bd
6300	\N	Ailhash	আইলহাঁস	ailhashup.chuadanga.gov.bd
6301	\N	Damurhuda	দামুড়হুদা	damurhudaup.chuadanga.gov.bd
6302	\N	Karpashdanga	কার্পাসডাঙ্গা	karpashdanga.chuadanga.gov.bd
6303	\N	Natipota	নতিপোতা	natipota.chuadanga.gov.bd
6304	\N	Hawli	হাওলী	hawli.chuadanga.gov.bd
6305	\N	Kurulgachhi	কুড়ালগাছী	kurulgachhi.chuadanga.gov.bd
6306	\N	Perkrishnopur Madna	পারকৃষ্ণপুর মদনা	perkrishnopurmadna.chuadanga.gov.bd
6307	\N	Juranpur	জুড়ানপুর	juranpurup.chuadanga.gov.bd
6308	\N	Uthali	উথলী	uthaliup.chuadanga.gov.bd
6309	\N	Andulbaria	আন্দুলবাড়ীয়া	andulbaria.chuadanga.gov.bd
6310	\N	Banka	বাঁকা	bankaup.chuadanga.gov.bd
6311	\N	Shimanto	সীমান্ত	shimanto.chuadanga.gov.bd
6312	\N	Raypur	রায়পুর	raypurup.chuadanga.gov.bd
6313	\N	Hasadah	হাসাদাহ	hasadahup.chuadanga.gov.bd
6314	\N	Hatash Haripur	হাটশ হরিপুর	1nohatashharipurup.kushtia.gov.bd
6315	\N	Barkhada	বারখাদা	2nobarkhadaup.kushtia.gov.bd
6316	\N	Mazampur	মজমপুর	3nomazampurup.kushtia.gov.bd
6317	\N	Bottail	বটতৈল	4nobottailup.kushtia.gov.bd
6318	\N	Alampur	আলামপুর	5noalampurup.kushtia.gov.bd
6319	\N	Ziaraakhi	জিয়ারাখী	6noziaraakhiup.kushtia.gov.bd
6320	\N	Ailchara	আইলচারা	7noailcharaup.kushtia.gov.bd
6321	\N	Patikabari	পাটিকাবাড়ী	8nopatikabariup.kushtia.gov.bd
6322	\N	Jhaudia	ঝাউদিয়া	9nojhaudiaup.kushtia.gov.bd
6323	\N	Ujangram	উজানগ্রাম	10noujangramup.kushtia.gov.bd
6324	\N	Abdulpur	আব্দালপুর	11noabdulpurup.kushtia.gov.bd
6325	\N	Harinarayanpur	হরিনারায়নপুর	12noharinarayanpurup.kushtia.gov.bd
6326	\N	Monohardia	মনোহরদিয়া	13nomonohardiaup.kushtia.gov.bd
6327	\N	Goswami Durgapur	গোস্বামী দুর্গাপুর	14nogoswamidurgapurup.kushtia.gov.bd
6328	\N	Kaya	কয়া	1nokayaup.kushtia.gov.bd
6329	\N	Jagonnathpur	জগন্নাথপুর	3nojagonnathpurup.kushtia.gov.bd
6330	\N	Sadki	সদকী	4nosadkiup.kushtia.gov.bd
6331	\N	Shelaidah	শিলাইদহ	2noshelaidahup.kushtia.gov.bd
6332	\N	Nandolalpur	নন্দলালপুর	5nonandolalpurup.kushtia.gov.bd
6333	\N	Chapra	চাপড়া	6nochapraup.kushtia.gov.bd
6334	\N	Bagulat	বাগুলাট	7nobagulatup.kushtia.gov.bd
6335	\N	Jaduboyra	যদুবয়রা	8nojaduboyraup.kushtia.gov.bd
6336	\N	Chadpur	চাঁদপুর	9nochadpurup.kushtia.gov.bd
6337	\N	Panti	পান্টি	10nopantiup.kushtia.gov.bd
6338	\N	Charsadipur	চরসাদীপুর	11nocharsadipurup.kushtia.gov.bd
6339	\N	Khoksa	খোকসা	1nokhoksaup.kushtia.gov.bd
6340	\N	Osmanpur	ওসমানপুর	2noosmanpurup.kushtia.gov.bd
6341	\N	Janipur	জানিপুর	4nojanipurup.kushtia.gov.bd
6342	\N	Shimulia	শিমুলিয়া	5noshimuliaup.kushtia.gov.bd
6343	\N	Joyntihazra	জয়ন্তীহাজরা	8nojoyntihazraup.kushtia.gov.bd
6344	\N	Ambaria	আমবাড়ীয়া	9noambariaup.kushtia.gov.bd
6345	\N	Bethbaria	বেতবাড়ীয়া	3nobethbariaup.kushtia.gov.bd
6346	\N	Shomospur	শোমসপুর	6noshomospurup.kushtia.gov.bd
6347	\N	Gopgram	গোপগ্রাম	gopgram7up.kushtia.gov.bd
6348	\N	Chithalia	চিথলিয়া	chithaliaup.kushtia.gov.bd
6349	\N	Bahalbaria	বহলবাড়ীয়া	bahalbariaup.kushtia.gov.bd
6350	\N	Talbaria	তালবাড়ীয়া	talbariaup.kushtia.gov.bd
6351	\N	Baruipara	বারুইপাড়া	baruiparaup.kushtia.gov.bd
6352	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.kushtia.gov.bd
6353	\N	Amla	আমলা	amlaup.kushtia.gov.bd
6354	\N	Sadarpur	সদরপুর	sadarpurup.kushtia.gov.bd
6355	\N	Chhatian	ছাতিয়ান	chhatianup.kushtia.gov.bd
6356	\N	Poradaha	পোড়াদহ	poradahaup.kushtia.gov.bd
6357	\N	Kursha	কুর্শা	kurshaup.kushtia.gov.bd
6358	\N	Ambaria	আমবাড়ীয়া	ambariaup.kushtia.gov.bd
6359	\N	Dhubail	ধূবইল	dhubailup.kushtia.gov.bd
6360	\N	Malihad	মালিহাদ	11nomalihadup.kushtia.gov.bd
6361	\N	Daulatpur	দৌলতপুর	daulatpurup.kushtia.gov.bd
6362	\N	Adabaria	ড়ীয়া	adabariaup.kushtia.gov.bd
6363	\N	Hogolbaria	হোগলবাড়ীয়া	hogolbariaup.kushtia.gov.bd
6364	\N	Boalia	বোয়ালি	boaliaup.kushtia.gov.bd
6365	\N	Philipnagor	ফিলিপনগর	philipnagorup.kushtia.gov.bd
6366	\N	Aria	আড়িয়া	ariaup.kushtia.gov.bd
6367	\N	Khalishakundi	খলিশাকুন্ডি	khalishakundiup.kushtia.gov.bd
6368	\N	Chilmary	চিলমারী	chilmaryup.kushtia.gov.bd
6369	\N	Mothurapur	মথুরাপুর	mothurapurup.kushtia.gov.bd
6370	\N	Pragpur	প্রাগপুর	pragpurup.kushtia.gov.bd
6371	\N	Piarpur	পিয়ারপুর	piarpurup.kushtia.gov.bd
6372	\N	Moricha	মরিচা	morichaup.kushtia.gov.bd
6373	\N	Refaitpur	রিফাইতপুর	9norefaitpurup.kushtia.gov.bd
6374	\N	Ramkrishnopur	রামকৃষ্ণপুর	5noramkrishnopurup.kushtia.gov.bd
6375	\N	Dharampur	ধরমপুর	5nodharampurup.kushtia.gov.bd
6376	\N	Bahirchar	বাহিরচর	3nobahircharup.kushtia.gov.bd
6377	\N	Mukarimpur	মোকারিমপুর	2nomukarimpurup.kushtia.gov.bd
6378	\N	Juniadah	জুনিয়াদহ	6nojuniadahup.kushtia.gov.bd
6379	\N	Chandgram	চাঁদগ্রাম	4nochandgramup.kushtia.gov.bd
6380	\N	Bahadurpur	বাহাদুরপুর	1nobahadurpurup.kushtia.gov.bd
6381	\N	Dhaneshwargati	ধনেশ্বরগাতী	dhaneshwargatiup.magura.gov.bd
6382	\N	Talkhari	তালখড়ি	talkhariup.magura.gov.bd
6383	\N	Arpara	আড়পাড়া	arparaup.magura.gov.bd
6384	\N	Shatakhali	শতখালী	shatakhaliup.magura.gov.bd
6385	\N	Shalikha	শালিখা	shalikhaup.magura.gov.bd
6386	\N	Bunagati	বুনাগাতী	bunagatiup.magura.gov.bd
6387	\N	Gongarampur	গঙ্গারামপুর	gongarampurup.magura.gov.bd
6388	\N	Goyespur	গয়েশপুর	goyespurup.magura.gov.bd
6389	\N	Sreekol	শ্রীকোল	sreekolup.magura.gov.bd
6390	\N	Dariapur	দ্বারিয়াপুর	dariapurup.magura.gov.bd
6391	\N	Kadirpara	কাদিরপাড়া	kadirparaup.magura.gov.bd
6392	\N	Shobdalpur	সব্দালপুর	shobdalpurup.magura.gov.bd
6393	\N	Sreepur	শ্রীপুর	sreepurup.magura.gov.bd
6394	\N	Nakol	নাকোল	nakolup.magura.gov.bd
6395	\N	Amalshar	আমলসার	amalsharup.magura.gov.bd
6396	\N	Hazipur	হাজীপুর	hazipurup.magura.gov.bd
6397	\N	Atharokhada	আঠারখাদা	atharokhadaup.magura.gov.bd
6398	\N	Kosundi	কছুন্দী	kosundiup.magura.gov.bd
6399	\N	Bogia	বগিয়া	bogiaup.magura.gov.bd
6400	\N	Hazrapur	হাজরাপুর	hazrapurup.magura.gov.bd
6401	\N	Raghobdair	রাঘবদাইড়	raghobdairup.magura.gov.bd
6402	\N	Jagdal	জগদল	jagdalup.magura.gov.bd
6403	\N	Chawlia	চাউলিয়া	chawliaup.magura.gov.bd
6404	\N	Satrijitpur	শত্রুজিৎপুর	satrijitpurup.magura.gov.bd
6405	\N	Baroilpolita	বেরইল পলিতা	baroilpolitaup.magura.gov.bd
6406	\N	Kuchiamora	কুচিয়ামো	kuchiamoraup.magura.gov.bd
6407	\N	Gopalgram	গোপালগ্রাম	gopalgramup.magura.gov.bd
6408	\N	Moghi	মঘী	moghiup.magura.gov.bd
6409	\N	Digha	দীঘা	dighaup.magura.gov.bd
6410	\N	Nohata	নহাটা	nohataup.magura.gov.bd
6411	\N	Palashbaria	পলাশবাড়ীয়া	palashbariaup.magura.gov.bd
6412	\N	Babukhali	বাবুখালী	babukhaliup.magura.gov.bd
6413	\N	Balidia	বালিদিয়া	balidiaup.magura.gov.bd
6414	\N	Binodpur	বিনোদপুর	binodpurup.magura.gov.bd
6415	\N	Mohammadpur	মহম্মদপুর	mohammadpurup.magura.gov.bd
6416	\N	Rajapur	রাজাপুর	rajapurup.magura.gov.bd
6417	\N	Horidhali	হরিঢালী	horidhaliup.khulna.gov.bd
6418	\N	Goroikhali	গড়ইখালী	goroikhaliup.khulna.gov.bd
6419	\N	Kopilmuni	কপিলমুনি	kopilmuniup.khulna.gov.bd
6420	\N	Lota	লতা	lotaup.khulna.gov.bd
6421	\N	Deluti	দেলুটি	delutiup.khulna.gov.bd
6422	\N	Loskor	লস্কর	loskorup.khulna.gov.bd
6423	\N	Godaipur	গদাইপুর	godaipurup.khulna.gov.bd
6424	\N	Raruli	রাড়ুলী	www.raruliup.khulna.gov.bd
6425	\N	Chandkhali	চাঁদখালী	chandkhaliup.khulna.gov.bd
6426	\N	Soladana	সোলাদানা	soladanaup.khulna.gov.bd
6427	\N	Fultola	ফুলতলা	www.fultolaup.khulna.gov.bd
6428	\N	Damodar	দামোদর	www.damodarup.khulna.gov.bd
6429	\N	Atra Gilatola	আটরা গিলাতলা	www.atragilatolaup.khulna.gov.bd
6430	\N	Jamira	জামিরা	www.jamiraup.khulna.gov.bd
6431	\N	Senhati	সেনহাটি	www.senhatiup.khulna.gov.bd
6432	\N	Gajirhat	গাজীরহাট	www.gajirhatup.khulna.gov.bd
6433	\N	Barakpur	বারাকপুর	www.barakpurup.khulna.gov.bd
6434	\N	Aronghata	আড়ংঘাটা	www.aronghataup.khulna.gov.bd
6435	\N	Jogipol	যোগীপোল	www.jogipolup.khulna.gov.bd
6436	\N	Digholia	দিঘলিয়া	www.digholiaup.khulna.gov.bd
6437	\N	Aichgati	আইচগাতী	aichgatiup.khulna.gov.bd
6438	\N	Srifoltola	শ্রীফলতলা	srifoltolaup.khulna.gov.bd
6439	\N	Noihati	নৈহাটি	noihatiup.khulna.gov.bd
6440	\N	Tsb	টিএসবি	tsbup.khulna.gov.bd
6441	\N	Ghatvog	ঘাটভোগ	ghatvogup.khulna.gov.bd
6442	\N	Terokhada	তেরখাদা	terokhadaup.khulna.gov.bd
6443	\N	Chagladoho	ছাগলাদহ	chagladohoup.khulna.gov.bd
6444	\N	Barasat	বারাসাত	www.barasatup.khulna.gov.bd
6445	\N	Sochiadaho	সাচিয়াদাহ	www.sochiadahoup.khulna.gov.bd
6446	\N	Modhupur	মধুপুর	www.modhupurup.khulna.gov.bd
6447	\N	Ajgora	আজগড়া	www.ajgoraup.khulna.gov.bd
6448	\N	Dumuria	ডুমুরিয়া	dumuriaup.khulna.gov.bd
6449	\N	Magurghona	মাগুরাঘোনা	magurghonaup.khulna.gov.bd
6450	\N	Vandarpara	ভান্ডারপাড়া	vandarparaup.khulna.gov.bd
6451	\N	Sahos	সাহস	sahosup.khulna.gov.bd
6452	\N	Rudaghora	রুদাঘরা	rudaghoraup.khulna.gov.bd
6453	\N	Ghutudia	গুটুদিয়া	ghutudiaup.khulna.gov.bd
6454	\N	Shovna	শোভনা	shovnaup.khulna.gov.bd
6455	\N	Khornia	খর্ণিয়া	khorniaup.khulna.gov.bd
6456	\N	Atlia	আটলিয়া	atliaup.khulna.gov.bd
6457	\N	Dhamalia	ধামালিয়া	dhamaliaup.khulna.gov.bd
6458	\N	Raghunathpur	রঘুনাথপুর	raghunathpurup.khulna.gov.bd
6459	\N	Rongpur	রংপুর	rongpurup.khulna.gov.bd
6460	\N	Shorafpur	শরাফপুর	shorafpurup.khulna.gov.bd
6461	\N	Magurkhali	মাগুরখালি	magurkhaliup.khulna.gov.bd
6462	\N	Botiaghata	বটিয়াঘাটা	www.botiaghataup.khulna.gov.bd
6463	\N	Amirpur	আমিরপুর	www.amirpurup.khulna.gov.bd
6464	\N	Gongarampur	গঙ্গারামপুর	www.gongarampurup.khulna.gov.bd
6465	\N	Surkhali	সুরখালী	www.surkhaliup.khulna.gov.bd
6466	\N	Vandarkot	ভান্ডারকোট	www.vandarkotup.khulna.gov.bd
6467	\N	Baliadanga	বালিয়াডাঙ্গা	www.baliadangaup.khulna.gov.bd
6468	\N	Jolma	জলমা	www.jolmaup.khulna.gov.bd
6469	\N	Dakop	দাকোপ	www.dakopup.khulna.gov.bd
6470	\N	Bajua	বাজুয়া	bajuaup.khulna.gov.bd
6471	\N	Kamarkhola	কামারখোলা	www.kamarkholaup.khulna.gov.bd
6472	\N	Tildanga	তিলডাঙ্গা	www.tildangaup.khulna.gov.bd
6473	\N	Sutarkhali	সুতারখালী	www.sutarkhaliup.khulna.gov.bd
6474	\N	Laudoba	লাউডোব	laudobaup.khulna.gov.bd
6475	\N	Pankhali	পানখালী	pankhaliup.khulna.gov.bd
6476	\N	Banishanta	বানিশান্তা	banishantaup.khulna.gov.bd
6477	\N	Koilashgonj	কৈলাশগঞ্জ	koilashgonjup.khulna.gov.bd
6478	\N	Koyra	কয়রা	koyraup.khulna.gov.bd
6479	\N	Moharajpur	মহারাজপুর	moharajpurup.khulna.gov.bd
6480	\N	Moheswaripur	মহেশ্বরীপুর	moheswaripurup.khulna.gov.bd
6481	\N	North Bedkashi	উত্তর বেদকাশী	northbedkashiup.khulna.gov.bd
6482	\N	South Bedkashi	দক্ষিণ বেদকাশী	southbedkashiup.khulna.gov.bd
6483	\N	Amadi	আমাদি	amadiup.khulna.gov.bd
6484	\N	Bagali	বাগালী	bagaliup.khulna.gov.bd
6485	\N	Betaga	বেতাগা	betagaup.bagerhat.gov.bd
6486	\N	Lakhpur	লখপুর	lakhpurup.bagerhat.gov.bd
6487	\N	Fakirhat	ফকিরহাট	fakirhatup.bagerhat.gov.bd
6488	\N	Bahirdia-Mansa	বাহিরদিয়া-মানসা	bahirdiamansaup.bagerhat.gov.bd
6489	\N	Piljanga	পিলজংগ	piljangaup.bagerhat.gov.bd
6490	\N	Naldha-Mouvhog	নলধা-মৌভোগ	naldhamauvhogup.bagerhat.gov.bd
6491	\N	Mulghar	মূলঘর	mulgharup.bagerhat.gov.bd
6492	\N	Suvhadia	শুভদিয়া	suvhadiaup.bagerhat.gov.bd
6493	\N	Karapara	কাড়াপাড়া	karaparaup.bagerhat.gov.bd
6494	\N	Bamorta	বেমরতা	bamortaup.bagerhat.gov.bd
6495	\N	Gotapara	গোটাপাড়া	gotaparaup.bagerhat.gov.bd
6496	\N	Bishnapur	বিষ্ণুপুর	bishnapurup.bagerhat.gov.bd
6497	\N	Baruipara	বারুইপাড়া	baruiparaup.bagerhat.gov.bd
6498	\N	Jatharapur	যাত্রাপুর	jatharapurup.bagerhat.gov.bd
6499	\N	Shaitgomboj	ষাটগুম্বজ	shaitgombojup.bagerhat.gov.bd
6500	\N	Khanpur	খানপুর	khanpurup.bagerhat.gov.bd
6501	\N	Rakhalgachi	রাখালগাছি	rakhalgachiup.bagerhat.gov.bd
6502	\N	Dema	ডেমা	demaup.bagerhat.gov.bd
6503	\N	Udoypur	উদয়পুর	udoypurup.bagerhat.gov.bd
6504	\N	Chunkhola	চুনখোলা	chunkholaup.bagerhat.gov.bd
6505	\N	Gangni	গাংনী	gangniup.bagerhat.gov.bd
6506	\N	Kulia	কুলিয়া	kuliaup.bagerhat.gov.bd
6507	\N	Gaola	গাওলা	gaolaup.bagerhat.gov.bd
6508	\N	Kodalia	কোদালিয়া	kodaliaup.bagerhat.gov.bd
6509	\N	Atjuri	আটজুড়ী	atjuriup.bagerhat.gov.bd
6510	\N	Dhanshagor	ধানসাগর	dhanshagorup.bagerhat.gov.bd
6511	\N	Khontakata	খোন্তাকাটা	khontakataup.bagerhat.gov.bd
6512	\N	Rayenda	রায়েন্দা	rayendaup.bagerhat.gov.bd
6513	\N	Southkhali	সাউথখালী	southkhaliup.bagerhat.gov.bd
6514	\N	Gouramva	গৌরম্ভা	gouramvaup.bagerhat.gov.bd
6515	\N	Uzzalkur	উজলকুড়	uzzalkurup.bagerhat.gov.bd
6516	\N	Baintala	বাইনতলা	baintalaup.bagerhat.gov.bd
6517	\N	Rampal	রামপাল	rampalup.bagerhat.gov.bd
6518	\N	Rajnagar	রাজনগর	rajnagarup.bagerhat.gov.bd
6519	\N	Hurka	হুড়কা	hurkaup.bagerhat.gov.bd
6520	\N	Perikhali	পেড়িখালী	perikhaliup.bagerhat.gov.bd
6521	\N	Vospatia	ভোজপাতিয়া	vospatiaup.bagerhat.gov.bd
6522	\N	Mollikerbar	মল্লিকেরবেড়	mollikerbarup.bagerhat.gov.bd
6523	\N	Bastoli	বাঁশতলী	bastoliup.bagerhat.gov.bd
6524	\N	Teligati	তেলিগাতী	teligatiup.bagerhat.gov.bd
6525	\N	Panchakaran	পঞ্চকরণ	panchakaranup.bagerhat.gov.bd
6526	\N	Putikhali	পুটিখালী	putikhaliup.bagerhat.gov.bd
6527	\N	Daibagnyahati	দৈবজ্ঞহাটি	daibagnyahatiup.bagerhat.gov.bd
6528	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.bagerhat.gov.bd
6529	\N	Chingrakhali	চিংড়াখালী	chingrakhaliup.bagerhat.gov.bd
6530	\N	Jiudhara	জিউধরা	jiudharaup.bagerhat.gov.bd
6531	\N	Hoglapasha	হোগলাপাশা	hoglapashaup.bagerhat.gov.bd
6532	\N	Banagram	বনগ্রাম	banagramup.bagerhat.gov.bd
6533	\N	Balaibunia	বলইবুনিয়া	balaibuniaup.bagerhat.gov.bd
6534	\N	Hoglabunia	হোগলাবুনিয়া	hoglabuniaup.bagerhat.gov.bd
6535	\N	Baharbunia	বহরবুনিয়া	baharbuniaup.bagerhat.gov.bd
6536	\N	Morrelganj	মোড়েলগঞ্জ	morrelganjup.bagerhat.gov.bd
6537	\N	Khaulia	খাউলিয়া	khauliaup.bagerhat.gov.bd
6538	\N	Nishanbaria	নিশানবাড়িয়া	nishanbariaup.bagerhat.gov.bd
6539	\N	Baraikhali	বারইখালী	baraikhaliup.bagerhat.gov.bd
6540	\N	Gojalia	গজালিয়া	gojaliaup.bagerhat.gov.bd
6541	\N	Dhopakhali	ধোপাখালী	dhopakhaliup.bagerhat.gov.bd
6542	\N	Moghia	মঘিয়া	moghiaup.bagerhat.gov.bd
6543	\N	Kachua	কচুয়া	kachuaup.bagerhat.gov.bd
6544	\N	Gopalpur	গোপালপুর	gopalpurup.bagerhat.gov.bd
6545	\N	Raripara	রাড়ীপাড়া	rariparaup.bagerhat.gov.bd
6546	\N	Badhal	বাধাল	badhalup.bagerhat.gov.bd
6547	\N	Burrirdangga	বুড়িরডাঙ্গা	burrirdanggaup.bagerhat.gov.bd
6548	\N	Mithakhali	মিঠাখালী	mithakhaliup.bagerhat.gov.bd
6549	\N	Sonailtala	সোনাইলতলা	sonailtalaup.bagerhat.gov.bd
6550	\N	Chadpai	চাঁদপাই	chadpaiup.bagerhat.gov.bd
6551	\N	Chila	চিলা	chilaup.bagerhat.gov.bd
6552	\N	Sundarban	সুন্দরবন	sundarbanup.bagerhat.gov.bd
6553	\N	Barobaria	বড়বাড়িয়া	barobariaup.bagerhat.gov.bd
6554	\N	Kalatala	কলাতলা	kalatalaup.bagerhat.gov.bd
6555	\N	Hizla	হিজলা	hizlaup.bagerhat.gov.bd
6556	\N	Shibpur	শিবপুর	shibpurup.bagerhat.gov.bd
6557	\N	Chitalmari	চিতলমারী	chitalmariup.bagerhat.gov.bd
6558	\N	Charbaniri	চরবানিয়ারী	charbaniriup.bagerhat.gov.bd
6559	\N	Shantoshpur	সন্তোষপুর	shantoshpurup.bagerhat.gov.bd
6560	\N	Sadhuhati	সাধুহাটী	sadhuhatiup.jhenaidah.gov.bd
6561	\N	Modhuhati	মধুহাটী	modhuhatiup.jhenaidah.gov.bd
6562	\N	Saganna	সাগান্না	sagannaup.jhenaidah.gov.bd
6563	\N	Halidhani	হলিধানী	halidhaniup.jhenaidah.gov.bd
6564	\N	Kumrabaria	কুমড়াবাড়ীয়া	kumrabariaup.jhenaidah.gov.bd
6565	\N	Ganna	গান্না	gannaup.jhenaidah.gov.bd
6566	\N	Maharazpur	মহারাজপুর	maharazpurup.jhenaidah.gov.bd
6567	\N	Paglakanai	পাগলাকানাই	paglakanaiup.jhenaidah.gov.bd
6568	\N	Porahati	পোড়াহাটী	porahatiup.jhenaidah.gov.bd
6569	\N	Harishongkorpur	হরিশংকরপুর	harishongkorpurup.jhenaidah.gov.bd
6570	\N	Padmakar	পদ্মাকর	padmakarup.jhenaidah.gov.bd
6571	\N	Dogachhi	দোগাছি	dogachhiup.jhenaidah.gov.bd
6572	\N	Furshondi	ফুরসন্দি	furshondiup.jhenaidah.gov.bd
6573	\N	Ghorshal	ঘোড়শাল	ghorshalup.jhenaidah.gov.bd
6574	\N	Kalicharanpur	কালীচরণপুর	kalicharanpurup.jhenaidah.gov.bd
6575	\N	Surat	সুরাট	suratup.jhenaidah.gov.bd
6576	\N	Naldanga	নলডাঙ্গা	naldangaup.jhenaidah.gov.bd
6577	\N	Tribeni	ত্রিবেনী	tribeniup.jhenaidah.gov.bd
6578	\N	Mirzapur	মির্জাপুর	mirzapurup.jhenaidah.gov.bd
6579	\N	Dignagore	দিগনগর	dignagoreup.jhenaidah.gov.bd
6580	\N	Kancherkol	কাঁচেরকোল	kancherkolup.jhenaidah.gov.bd
6581	\N	Sarutia	সারুটিয়া	sarutiaup.jhenaidah.gov.bd
6582	\N	Hakimpur	হাকিমপুর	hakimpurup.jhenaidah.gov.bd
6583	\N	Dhaloharachandra	ধলহরাচন্দ্র	dhaloharachandraup.jhenaidah.gov.bd
6584	\N	Manoharpur	মনোহরপুর	manoharpurup.jhenaidah.gov.bd
6585	\N	Bogura	বগুড়া	boguraup.jhenaidah.gov.bd
6586	\N	Abaipur	আবাইপুর	abaipurup.jhenaidah.gov.bd
6587	\N	Nityanandapur	নিত্যানন্দপুর	nityanandapurup.jhenaidah.gov.bd
6588	\N	Umedpur	উমেদপুর	umedpurup.jhenaidah.gov.bd
6589	\N	Dudshar	দুধসর	dudsharup.jhenaidah.gov.bd
6590	\N	Fulhari	ফুলহরি	fulhariup.jhenaidah.gov.bd
6591	\N	Bhayna	ভায়না	bhaynaup.jhenaidah.gov.bd
6592	\N	Joradah	জোড়াদহ	joradahup.jhenaidah.gov.bd
6593	\N	Taherhuda	তাহেরহুদা	taherhudaup.jhenaidah.gov.bd
6594	\N	Daulatpur	দৌলতপুর	daulatpurup.jhenaidah.gov.bd
6595	\N	Kapashatia	কাপাশহাটিয়া	kapashatiaup.jhenaidah.gov.bd
6596	\N	Falsi	ফলসী	falsiup.jhenaidah.gov.bd
6597	\N	Raghunathpur	রঘুনাথপুর	raghunathpurup.jhenaidah.gov.bd
6598	\N	Chandpur	চাঁদপুর	chandpurup.jhenaidah.gov.bd
6599	\N	Sundarpurdurgapur	সুন্দরপুর-দূর্গাপুর	sundarpurdurgapurup.jhenaidah.gov.bd
6600	\N	Jamal	জামাল	jamalup.jhenaidah.gov.bd
6601	\N	Kola	কোলা	kolaup.jhenaidah.gov.bd
6602	\N	Niamatpur	নিয়ামতপুর	niamatpurup.jhenaidah.gov.bd
6603	\N	Simla-Rokonpur	শিমলা-রোকনপুর	simlarokonpurup.jhenaidah.gov.bd
6604	\N	Trilochanpur	ত্রিলোচনপুর	trilochanpurup.jhenaidah.gov.bd
6605	\N	Raygram	রায়গ্রাম	raygramup.jhenaidah.gov.bd
6606	\N	Maliat	মালিয়াট	maliatup.jhenaidah.gov.bd
6607	\N	Barabazar	বারবাজার	barabazarup.jhenaidah.gov.bd
6608	\N	Kashtabhanga	কাষ্টভাঙ্গা	kashtabhangaup.jhenaidah.gov.bd
6609	\N	Rakhalgachhi	রাখালগাছি	rakhalgachhiup.jhenaidah.gov.bd
6610	\N	Sabdalpur	সাবদালপুর	sabdalpurup.jhenaidah.gov.bd
6611	\N	Dora	দোড়া	doraup.jhenaidah.gov.bd
6612	\N	Kushna	কুশনা	kushnaup.jhenaidah.gov.bd
6613	\N	Baluhar	বলুহর	baluharup.jhenaidah.gov.bd
6614	\N	Elangi	এলাঙ্গী	elangiup.jhenaidah.gov.bd
6615	\N	Sbk	এস, বি, কে	sbkup.jhenaidah.gov.bd
6616	\N	Fatepur	ফতেপুর	fatepurup.jhenaidah.gov.bd
6617	\N	Panthapara	পান্থপাড়া	panthaparaup.jhenaidah.gov.bd
6618	\N	Swaruppur	স্বরুপপুর	swaruppurup.jhenaidah.gov.bd
6619	\N	Shyamkur	শ্যামকুড়	shyamkurup.jhenaidah.gov.bd
6620	\N	Nepa	নেপা	nepaup.jhenaidah.gov.bd
6621	\N	Kazirber	কাজীরবেড়	kazirberup.jhenaidah.gov.bd
6622	\N	Banshbaria	বাঁশবাড়ীয়া	banshbariaup.jhenaidah.gov.bd
6623	\N	Jadabpur	যাদবপুর	jadabpurup.jhenaidah.gov.bd
6624	\N	Natima	নাটিমা	natimaup.jhenaidah.gov.bd
6625	\N	Manderbaria	মান্দারবাড়ীয়া	manderbariaup.jhenaidah.gov.bd
6626	\N	Azampur	আজমপুর	azampurup.jhenaidah.gov.bd
6627	\N	Basanda	বাসন্ডা	basandaup.jhalakathi.gov.bd
6628	\N	Binoykati	বিনয়কাঠী	binoykatiup.jhalakathi.gov.bd
6629	\N	Gabharamchandrapur	গাভারামচন্দ্রপুর	gabharamchandrapurup.jhalakathi.gov.bd
6630	\N	Keora	কেওড়া	keoraup.jhalakathi.gov.bd
6631	\N	Kirtipasha	কীর্তিপাশা	kirtipashaup.jhalakathi.gov.bd
6632	\N	Nabagram	নবগ্রাম	nabagramup.jhalakathi.gov.bd
6633	\N	Nathullabad	নথুলল্লাবাদ	nathullabadup.jhalakathi.gov.bd
6634	\N	Ponabalia	পোনাবালিয়া	ponabaliaup.jhalakathi.gov.bd
6635	\N	Sekherhat	শেখেরহাট	sekherhatup.jhalakathi.gov.bd
6636	\N	Gabkhandhansiri	গাবখান ধানসিঁড়ি	gabkhandhansiriup.jhalakathi.gov.bd
6637	\N	Amua	আমুয়া	amuaup.jhalakathi.gov.bd
6638	\N	Awrabunia	আওরাবুনিয়া	awrabuniaup.jhalakathi.gov.bd
6639	\N	Chenchrirampur	চেঁচরীরামপুর	chenchrirampurup.jhalakathi.gov.bd
6640	\N	Kanthalia	কাঠালিয়া	kanthaliaup.jhalakathi.gov.bd
6641	\N	Patikhalghata	পাটিখালঘাটা	patikhalghataup.jhalakathi.gov.bd
6642	\N	Shaulajalia	শৌলজালিয়া	shaulajaliaup.jhalakathi.gov.bd
6643	\N	Subidpur	সুবিদপুর	subidpurup.jhalakathi.gov.bd
6644	\N	Siddhakati	সিদ্ধকাঠী	siddhakatiup.jhalakathi.gov.bd
6645	\N	Ranapasha	রানাপাশা	ranapashaup.jhalakathi.gov.bd
6646	\N	Nachanmohal	নাচনমহল	nachanmohalup.jhalakathi.gov.bd
6647	\N	Mollahat	মোল্লারহাট	mollahatup.jhalakathi.gov.bd
6648	\N	Magar	মগর	magarup.jhalakathi.gov.bd
6649	\N	Kusanghal	কুশঙ্গল	kusanghalup.jhalakathi.gov.bd
6650	\N	Kulkathi	কুলকাঠী	kulkathiup.jhalakathi.gov.bd
6651	\N	Dapdapia	দপদপিয়া	dapdapiaup.jhalakathi.gov.bd
6652	\N	Bharabpasha	ভৈরবপাশা	bharabpashaup.jhalakathi.gov.bd
6653	\N	Suktagarh	শুক্তাগড়	suktagarhup.jhalakathi.gov.bd
6654	\N	Saturia	সাতুরিয়া	saturiaup.jhalakathi.gov.bd
6655	\N	Mathbari	মঠবাড়ী	mathbariup.jhalakathi.gov.bd
6656	\N	Galua	গালুয়া	galuaup.jhalakathi.gov.bd
6657	\N	Baraia	বড়ইয়া	baraiaup.jhalakathi.gov.bd
6658	\N	Rajapur	রাজাপুর	rajapurup.jhalakathi.gov.bd
6659	\N	Adabaria	আদাবারিয়া	adabariaup.gazipur.gov.bd
6660	\N	Bauphal	বাউফল	bauphalup.patuakhali.gov.bd
6661	\N	Daspara	দাস পাড়া	dasparaup.gazipur.gov.bd
6662	\N	Kalaiya	কালাইয়া	kalaiyaup.gazipur.gov.bd
6663	\N	Nawmala	নওমালা	nawmalaup.patuakhali.gov.bd
6664	\N	Najirpur	নাজিরপুর	najirpurup.patuakhali.gov.bd
6665	\N	Madanpura	মদনপুরা	madanpuraup.patuakhali.gov.bd
6666	\N	Boga	বগা	bogaup.patuakhali.gov.bd
6667	\N	Kanakdia	কনকদিয়া	kanakdiaup.patuakhali.gov.bd
6668	\N	Shurjamoni	সূর্য্যমনি	shurjamoniup.patuakhali.gov.bd
6669	\N	Keshabpur	কেশবপুর	keshabpurup.patuakhali.gov.bd
6670	\N	Dhulia	ধুলিয়া	dhuliaup.patuakhali.gov.bd
6671	\N	Kalisuri	কালিশুরী	kalisuriup.patuakhali.gov.bd
6672	\N	Kachipara	কাছিপাড়া	kachiparaup.patuakhali.gov.bd
6673	\N	Laukathi	লাউকাঠী	laukathiup.patuakhali.gov.bd
6674	\N	Lohalia	লোহালিয়া	lohaliaup.patuakhali.gov.bd
6675	\N	Kamalapur	কমলাপুর	kamalapurup.patuakhali.gov.bd
6676	\N	Jainkathi	জৈনকাঠী	jainkathiup.patuakhali.gov.bd
6677	\N	Kalikapur	কালিকাপুর	kalikapurup.patuakhali.gov.bd
6678	\N	Badarpur	বদরপুর	badarpurup.patuakhali.gov.bd
6679	\N	Itbaria	ইটবাড়ীয়া	itbariaup.patuakhali.gov.bd
6680	\N	Marichbunia	মরিচবুনিয়া	marichbuniaup.patuakhali.gov.bd
6681	\N	Auliapur	আউলিয়াপুর	auliapurup.patuakhali.gov.bd
6682	\N	Chotobighai	ছোট বিঘাই	chotobighaiup.patuakhali.gov.bd
6683	\N	Borobighai	বড় বিঘাই	borobighaiup.patuakhali.gov.bd
6684	\N	Madarbunia	মাদারবুনিয়া	madarbuniaup.patuakhali.gov.bd
6685	\N	Pangasia	পাংগাশিয়া	pangasiaup.patuakhali.gov.bd
6686	\N	Muradia	মুরাদিয়া	muradiaup.patuakhali.gov.bd
6687	\N	Labukhali	লেবুখালী	labukhaliup.patuakhali.gov.bd
6688	\N	Angaria	আংগারিয়া	angariaup.patuakhali.gov.bd
6689	\N	Sreerampur	শ্রীরামপুর	sreerampurup.patuakhali.gov.bd
6690	\N	Bashbaria	বাঁশবাড়ীয়া	bashbariaup.patuakhali.gov.bd
6691	\N	Rangopaldi	রণগোপালদী	rangopaldiup.patuakhali.gov.bd
6692	\N	Alipur	আলীপুর	alipurup.patuakhali.gov.bd
6693	\N	Betagi Shankipur	বেতাগী সানকিপুর	betagishankipurup.patuakhali.gov.bd
6694	\N	Dashmina	দশমিনা	dashminaup.patuakhali.gov.bd
6695	\N	Baharampur	বহরমপুর	baharampurup.patuakhali.gov.bd
6696	\N	Chakamaia	চাকামইয়া	chakamaiaup.patuakhali.gov.bd
6697	\N	Tiakhali	টিয়াখালী	tiakhaliup.patuakhali.gov.bd
6698	\N	Lalua	লালুয়া	laluaup.patuakhali.gov.bd
6699	\N	Dhankhali	ধানখালী	dhankhaliup.patuakhali.gov.bd
6700	\N	Mithagonj	মিঠাগঞ্জ	mithagonjup.patuakhali.gov.bd
6701	\N	Nilgonj	নীলগঞ্জ	nilgonjup.patuakhali.gov.bd
6702	\N	Dulaser	ধুলাসার	dulaserup.patuakhali.gov.bd
6703	\N	Latachapli	লতাচাপলী	latachapliup.patuakhali.gov.bd
6704	\N	Mahipur	মহিপুর	mahipurup.patuakhali.gov.bd
6705	\N	Dalbugonj	ডালবুগঞ্জ	dalbugonjup.patuakhali.gov.bd
6706	\N	Baliatali	বালিয়াতলী	baliataliup.patuakhali.gov.bd
6707	\N	Champapur	চম্পাপুর	champapurup.patuakhali.gov.bd
6708	\N	Madhabkhali	মাধবখালী	madhabkhaliup.patuakhali.gov.bd
6709	\N	Mirzaganj	মির্জাগঞ্জ	mirzaganjup.patuakhali.gov.bd
6710	\N	Amragachia	আমড়াগাছিয়া	amragachiaup.patuakhali.gov.bd
6711	\N	Deuli Subidkhali	দেউলী সুবিদখালী	deulisubidkhaliup.patuakhali.gov.bd
6712	\N	Kakrabunia	কাকড়াবুনিয়া	kakrabuniaup.patuakhali.gov.bd
6713	\N	Majidbaria	মজিদবাড়িয়া	majidbariaup.patuakhali.gov.bd
6714	\N	Amkhola	আমখোলা	amkholaup.patuakhali.gov.bd
6715	\N	Golkhali	গোলখালী	golkhaliup.patuakhali.gov.bd
6716	\N	Galachipa	গলাচিপা	galachipaup.patuakhali.gov.bd
6717	\N	Panpatty	পানপট্টি	panpattyup.patuakhali.gov.bd
6718	\N	Ratandi Taltali	রতনদী তালতলী	ratanditaltaliup.patuakhali.gov.bd
6719	\N	Dakua	ডাকুয়া	dakuaup.patuakhali.gov.bd
6720	\N	Chiknikandi	চিকনিকান্দী	chiknikandiup.patuakhali.gov.bd
6721	\N	Gazalia	গজালিয়া	gazaliaup.patuakhali.gov.bd
6722	\N	Charkajol	চরকাজল	charkajolup.patuakhali.gov.bd
6723	\N	Charbiswas	চরবিশ্বাস	charbiswasup.patuakhali.gov.bd
6724	\N	Bakulbaria	বকুলবাড়ীয়া	bakulbariaup.patuakhali.gov.bd
6725	\N	Kalagachhia	কলাগাছিয়া	kalagachhiaup.patuakhali.gov.bd
6726	\N	Rangabali	রাঙ্গাবালী	rangabaliup.patuakhali.gov.bd
6727	\N	Barobaisdia	বড়বাইশদিয়া	barobaisdiaup.patuakhali.gov.bd
6728	\N	Chattobaisdia	ছোটবাইশদিয়া	chattobaisdiaup.patuakhali.gov.bd
6729	\N	Charmontaz	চরমোন্তাজ	charmontaz.patuakhali.gov.bd
6730	\N	Chalitabunia	চালিতাবুনিয়া	chalitabuniaup.patuakhali.gov.bd
6731	\N	Shikder Mallik	শিকদার মল্লিক	shikdermallikup.pirojpur.gov.bd
6732	\N	Kodomtala	কদমতলা	kodomtalaup.pirojpur.gov.bd
6733	\N	Durgapur	দূর্গাপুর	durgapurup.pirojpur.gov.bd
6734	\N	Kolakhali	কলাখালী	kolakhaliup.pirojpur.gov.bd
6735	\N	Tona	টোনা	tonaup.pirojpur.gov.bd
6736	\N	Shariktola	শরিকতলা	shariktolaup.pirojpur.gov.bd
6737	\N	Shankorpasa	শংকরপাশা	shankorpasaup.pirojpur.gov.bd
6738	\N	Mativangga	মাটিভাংগা	mativanggaup.pirojpur.gov.bd
6739	\N	Malikhali	মালিখালী	malikhaliup.pirojpur.gov.bd
6740	\N	Daulbari Dobra	দেউলবাড়ী দোবড়া	daulbaridobraup.pirojpur.gov.bd
6741	\N	Dirgha	দীর্ঘা	dirghaup.pirojpur.gov.bd
6742	\N	Kolardoania	কলারদোয়ানিয়া	kolardoaniaup.pirojpur.gov.bd
6743	\N	Sriramkathi	শ্রীরামকাঠী	sriramkathiup.pirojpur.gov.bd
6744	\N	Shakhmatia	সেখমাটিয়া	shakhmatiaup.pirojpur.gov.bd
6745	\N	Nazirpur Sadar	নাজিরপুর সদর	nazirpursadarup.pirojpur.gov.bd
6746	\N	Shakharikathi	শাখারীকাঠী	shakharikathiup.pirojpur.gov.bd
6747	\N	Sayna Rogunathpur	সয়না রঘুনাথপুর	saynarogunathpurup.pirojpur.gov.bd
6748	\N	Amrazuri	আমড়াজুড়ি	amrazuriup.pirojpur.gov.bd
6749	\N	Kawkhali Sadar	কাউখালি সদর	kawkhalisadarup.pirojpur.gov.bd
6750	\N	Chirapara	চিরাপাড়া	chiraparaup.pirojpur.gov.bd
6751	\N	Shialkhathi	শিয়ালকাঠী	shialkhathiup.pirojpur.gov.bd
6752	\N	Balipara	বালিপাড়া	baliparaup.pirojpur.gov.bd
6753	\N	Pattashi	পত্তাশি	pattashiup.pirojpur.gov.bd
6754	\N	Parerhat	পাড়েরহাট	parerhatup.pirojpur.gov.bd
6755	\N	Vitabaria	ভিটাবাড়িয়া	vitabariaup.pirojpur.gov.bd
6756	\N	Nodmulla	নদমূলা শিয়ালকাঠী	nodmullaup.pirojpur.gov.bd
6757	\N	Telikhali	তেলিখালী	telikhaliup.pirojpur.gov.bd
6758	\N	Ekree	ইকড়ী	ekreeup.pirojpur.gov.bd
6759	\N	Dhaoa	ধাওয়া	dhaoaup.pirojpur.gov.bd
6760	\N	Vandaria Sadar	ভান্ডারিয়া সদর	vandariasadarup.pirojpur.gov.bd
6761	\N	Gouripur	গৌরীপুর	gouripurup.pirojpur.gov.bd
6762	\N	Tuskhali	তুষখালী	tuskhaliup.pirojpur.gov.bd
6763	\N	Dhanisafa	ধানীসাফা	dhanisafaup.pirojpur.gov.bd
6764	\N	Mirukhali	মিরুখালী	mirukhaliup.pirojpur.gov.bd
6765	\N	Tikikata	টিকিকাটা	tikikataup.pirojpur.gov.bd
6766	\N	Betmor Rajpara	বেতমোর রাজপাড়া	betmorrajparaup.pirojpur.gov.bd
6767	\N	Amragachia	আমড়াগাছিয়া	amragachiaup.pirojpur.gov.bd
6768	\N	Shapleza	শাপলেজা	shaplezaup.pirojpur.gov.bd
6769	\N	Daudkhali	দাউদখালী	daudkhaliup.pirojpur.gov.bd
6770	\N	Mathbaria	মঠবাড়িয়া	mathbariaup.pirojpur.gov.bd
6771	\N	Baramasua	বড়মাছুয়া	baramasuaup.pirojpur.gov.bd
6772	\N	Haltagulishakhali	হলতাগুলিশাখালী	haltagulishakhaliup.pirojpur.gov.bd
6773	\N	Boldia	বলদিয়া	boldiaup.pirojpur.gov.bd
6774	\N	Sohagdal	সোহাগদল	sohagdalup.pirojpur.gov.bd
6775	\N	Atghorkuriana	আটঘর কুড়িয়ানা	atghorkurianaup.pirojpur.gov.bd
6776	\N	Jolabari	জলাবাড়ী	jolabariup.pirojpur.gov.bd
6777	\N	Doyhary	দৈহারী	doyharyup.pirojpur.gov.bd
6778	\N	Guarekha	গুয়ারেখা	guarekhaup.pirojpur.gov.bd
6779	\N	Somudoykathi	সমুদয়কাঠী	somudoykathiup.pirojpur.gov.bd
6780	\N	Sutiakathi	সুটিয়াকাঠী	sutiakathiup.pirojpur.gov.bd
6781	\N	Sarengkathi	সারেংকাঠী	sarengkathiup.pirojpur.gov.bd
6782	\N	Shorupkathi	স্বরুপকাঠী	shorupkathiup.pirojpur.gov.bd
6783	\N	Raipasha Karapur	রায়পাশা কড়াপুর	raipashakarapurup.barisal.gov.bd
6784	\N	Kashipur	কাশীপুর	kashipurup.barisal.gov.bd
6785	\N	Charbaria	চরবাড়িয়া	charbariaup.barisal.gov.bd
6786	\N	Shyastabad	সায়েস্তাবাদ	shyastabadup.barisal.gov.bd
6787	\N	Charmonai	চরমোনাই	charmonaiup.barisal.gov.bd
6788	\N	Zagua	জাগুয়া	zaguaup.barisal.gov.bd
6789	\N	Charcowa	চরকাউয়া	charcowaup.barisal.gov.bd
6790	\N	Chandpura	চাঁদপুরা	chandpuraup.barisal.gov.bd
6791	\N	Tungibaria	টুঙ্গীবাড়িয়া	tungibariaup.barisal.gov.bd
6792	\N	Chandramohan	চন্দ্রমোহন	chandramohanup.barisal.gov.bd
6793	\N	Charamaddi	চরামদ্দি	charamaddiup.barisal.gov.bd
6794	\N	Charade	চরাদি	charadeup.barisal.gov.bd
6795	\N	Darial	দাড়িয়াল	darialup.barisal.gov.bd
6796	\N	Dudhal	দুধল	dudhalup.barisal.gov.bd
6797	\N	Durgapasha	দুর্গাপাশা	durgapashaup.barisal.gov.bd
6798	\N	Faridpur	ফরিদপুর	faridpurup.barisal.gov.bd
6799	\N	Kabai	কবাই	kabaiup.barisal.gov.bd
6800	\N	Nalua	নলুয়া	naluaup.barisal.gov.bd
6801	\N	Kalashkathi	কলসকাঠী	kalashkathiup.barisal.gov.bd
6802	\N	Garuria	গারুরিয়া	garuriaup.barisal.gov.bd
6803	\N	Bharpasha	ভরপাশা	bharpashaup.barisal.gov.bd
6804	\N	Rangasree	রঙ্গশ্রী	rangasreeup.barisal.gov.bd
6805	\N	Padreeshibpur	পাদ্রিশিবপুর	padreeshibpurup.barisal.gov.bd
6806	\N	Niamoti	নিয়ামতি	niamotiup.barisal.gov.bd
6807	\N	Jahangir Nagar	জাহাঙ্গীর নগর	jahangirnagorup.barisal.gov.bd
6808	\N	Kaderpur	কেদারপুর	kaderpurup.barisal.gov.bd
6809	\N	Deherhoti	দেহেরগতি	deherhotiup.barisal.gov.bd
6810	\N	Chandpasha	চাঁদপাশা	chandpashaup.barisal.gov.bd
6811	\N	Rahamtpur	রহমতপুর	rahamtpurup.barisal.gov.bd
6812	\N	Madhbpasha	মাধবপাশা	madhbpashaup.barisal.gov.bd
6813	\N	Shatla	সাতলা	shatlaup.barisal.gov.bd
6814	\N	Harta	হারতা	hartaup.barisal.gov.bd
6815	\N	Jalla	জল্লা	jallaup.barisal.gov.bd
6816	\N	Otra	ওটরা	otraup.barisal.gov.bd
6817	\N	Sholok	শোলক	sholokup.barisal.gov.bd
6818	\N	Barakhota	বরাকোঠা	barakhotaup.barisal.gov.bd
6819	\N	Bamrail	বামরাইল	bamrailup.barisal.gov.bd
6820	\N	Shikerpur Wazirpur	শিকারপুর উজিরপুর	shikerpurwazirpurup.barisal.gov.bd
6821	\N	Gouthia	গুঠিয়া	gouthiaup.barisal.gov.bd
6822	\N	Bisharkandi	বিশারকান্দি	bisharkandiup.barisal.gov.bd
6823	\N	Illuhar	ইলুহার	illuharup.barisal.gov.bd
6824	\N	Sayedkathi	সৈয়দকাঠী	sayedkathiup.barisal.gov.bd
6825	\N	Chakhar	চাখার	chakharup.barisal.gov.bd
6826	\N	Saliabakpur	সলিয়াবাকপুর	saliabakpurup.barisal.gov.bd
6827	\N	Baishari	বাইশারী	baishariup.barisal.gov.bd
6828	\N	Banaripara	বানারিপাড়া	banariparaup.barisal.gov.bd
6829	\N	Udykhati	উদয়কাঠী	udykhatiup.barisal.gov.bd
6830	\N	Khanjapur	খাঞ্জাপুর	khanjapurup.barisal.gov.bd
6831	\N	Barthi	বার্থী	barthiup.barisal.gov.bd
6832	\N	Chandshi	চাঁদশী	chandshiup.barisal.gov.bd
6833	\N	Mahilara	মাহিলারা	mahilaraup.barisal.gov.bd
6834	\N	Nalchira	নলচিড়া	nalchiraup.barisal.gov.bd
6835	\N	Batajore	বাটাজোর	batajoreup.barisal.gov.bd
6836	\N	Sarikal	সরিকল	sarikalup.barisal.gov.bd
6837	\N	Rajihar	রাজিহার	rajiharup.barisal.gov.bd
6838	\N	Bakal	বাকাল	bakalup.barisal.gov.bd
6839	\N	Bagdha	বাগধা	bagdhaup.barisal.gov.bd
6840	\N	Goila	গৈলা	goilaup.barisal.gov.bd
6841	\N	Ratnapur	রত্নপুর	ratnapurup.barisal.gov.bd
6842	\N	Andarmanik	আন্দারমানিক	andarmanikup.barisal.gov.bd
6843	\N	Lata	লতা	lataup.barisal.gov.bd
6844	\N	Charakkorea	চরএককরিয়া	charakkoreaup.barisal.gov.bd
6845	\N	Ulania	উলানিয়া	ulaniaup.barisal.gov.bd
6846	\N	Mehendigong	মেহেন্দিগঞ্জ	mehendigongup.barisal.gov.bd
6847	\N	Biddanandapur	বিদ্যানন্দনপুর	biddanandapurup.barisal.gov.bd
6848	\N	Bhashanchar	ভাষানচর	bhashancharup.barisal.gov.bd
6849	\N	Jangalia	জাঙ্গালিয়া	jangaliaup.barisal.gov.bd
6850	\N	Alimabad	আলিমাবাদ	alimabadup.barisal.gov.bd
6851	\N	Chandpur	চানপুর	chandpurup.barisal.gov.bd
6852	\N	Darirchar Khajuria	দড়িরচর খাজুরিয়া	darircharkhajuriaup.barisal.gov.bd
6853	\N	Gobindapur	গোবিন্দপুর	gobindapurup.barisal.gov.bd
6854	\N	Chargopalpur	চরগোপালপুর	chargopalpurup.barisal.gov.bd
6855	\N	Batamara	বাটামারা	batamaraup.barisal.gov.bd
6856	\N	Nazirpur	নাজিরপুর	nazirpurup.barisal.gov.bd
6857	\N	Safipur	সফিপুর	safipurup.barisal.gov.bd
6858	\N	Gaschua	গাছুয়া	gaschuaup.barisal.gov.bd
6859	\N	Charkalekha	চরকালেখা	charkalekhaup.barisal.gov.bd
6860	\N	Muladi	মুলাদী	muladiup.barisal.gov.bd
6861	\N	Kazirchar	কাজিরচর	kazircharup.barisal.gov.bd
6862	\N	Harinathpur	হরিনাথপুর	harinathpurup.barisal.gov.bd
6863	\N	Memania	মেমানিয়া	memaniaup.barisal.gov.bd
6864	\N	Guabaria	গুয়াবাড়িয়া	guabariaup.barisal.gov.bd
6865	\N	Barjalia	বড়জালিয়া	barjaliaup.barisal.gov.bd
6866	\N	Hizla Gourabdi	হিজলা গৌরাব্দি	hizlagourabdiup.barisal.gov.bd
6867	\N	Dhulkhola	ধুলখোলা	dhulkholaup.barisal.gov.bd
6868	\N	Razapur	রাজাপুর	razapurup.bhola.gov.bd
6869	\N	Ilisha	ইলিশা	ilishaup.bhola.gov.bd
6870	\N	Westilisa	পশ্চিম ইলিশা	westilisaup.bhola.gov.bd
6871	\N	Kachia	কাচিয়া	kachiaup.bhola.gov.bd
6872	\N	Bapta	বাপ্তা	baptaup.bhola.gov.bd
6873	\N	Dhania	ধনিয়া	dhaniaup.bhola.gov.bd
6874	\N	Shibpur	শিবপুর	shibpurup.bhola.gov.bd
6875	\N	Alinagor	আলীনগর	alinagorup.bhola.gov.bd
6876	\N	Charshamya	চরসামাইয়া	charshamyaup.bhola.gov.bd
6877	\N	Vhelumia	ভেলুমিয়া	vhelumiaup.bhola.gov.bd
6878	\N	Vheduria	ভেদুরিয়া	vheduriaup.bhola.gov.bd
6879	\N	North Digholdi	উত্তর দিঘলদী	northdigholdiup.bhola.gov.bd
6880	\N	South Digholdi	দক্ষিণ দিঘলদী	southdigholdiup.bhola.gov.bd
6881	\N	Boromanika	বড় মানিকা	boromanikaup.bhola.gov.bd
6882	\N	Deula	দেউলা	deulaup.bhola.gov.bd
6883	\N	Kutuba	কুতুবা	kutubaup.bhola.gov.bd
6884	\N	Pakshia	পক্ষিয়া	pakshiaup.bhola.gov.bd
6885	\N	Kachia	কাচিয়া	kachiaup4.bhola.gov.bd
6886	\N	Osmangonj	ওসমানগঞ্জ	osmangonjup.bhola.gov.bd
6887	\N	Aslampur	আছলামপুর	aslampurup.bhola.gov.bd
6888	\N	Zinnagor	জিন্নাগড়	zinnagorup.bhola.gov.bd
6889	\N	Aminabad	আমিনাবাদ	aminabadup.bhola.gov.bd
6890	\N	Nilkomol	নীলকমল	nilkomolup.bhola.gov.bd
6891	\N	Charmadraj	চরমাদ্রাজ	charmadrajup.bhola.gov.bd
6892	\N	Awajpur	আওয়াজপুর	awajpurup.bhola.gov.bd
6893	\N	Awajpur	আওয়াজপুর	awajpurup.bhola.gov.bd
6894	\N	Charkolmi	চরকলমী	charkolmiup.bhola.gov.bd
6895	\N	Charmanika	চরমানিকা	charmanikaup.bhola.gov.bd
6896	\N	Hazarigonj	হাজারীগঞ্জ	hazarigonjup.bhola.gov.bd
6897	\N	Jahanpur	জাহানপুর	jahanpurup.bhola.gov.bd
6898	\N	Nurabad	নুরাবাদ	nurabadup.bhola.gov.bd
6899	\N	Rasulpur	রসুলপুর	rasulpurup.bhola.gov.bd
6900	\N	Kukrimukri	কুকরীমূকরী	kukrimukriup.bhola.gov.bd
6901	\N	Abubakarpur	আবুবকরপুর	abubakarpurup.bhola.gov.bd
6902	\N	Abdullahpur	আবদুল্লাহ	abdullahpurup.bhola.gov.bd
6903	\N	Nazrulnagar	নজরুল নগর	nazrulnagarup.bhola.gov.bd
6904	\N	Mujibnagar	মুজিব নগর	mujibnagarup.bhola.gov.bd
6905	\N	Dalchar	ঢালচর	dalcharup.bhola.gov.bd
6906	\N	Madanpur	মদনপুর	madanpurup.bhola.gov.bd
6907	\N	Madua	মেদুয়া	maduaup.bhola.gov.bd
6908	\N	Charpata	চরপাতা	charpataup.bhola.gov.bd
6909	\N	North Joy Nagar	উত্তর জয়নগর	northjoynagarup.bhola.gov.bd
6910	\N	South Joy Nagar	দক্ষিন জয়নগর	southjoynagarup.bhola.gov.bd
6911	\N	Char Khalipa	চর খলিফা	charkhalipaup.bhola.gov.bd
6912	\N	Sayedpur	সৈয়দপুর	sayedpurup.bhola.gov.bd
6913	\N	Hazipur	হাজীপুর	hazipurup.bhola.gov.bd
6914	\N	Vhovanipur	ভবানীপুর	vhovanipurup.bhola.gov.bd
6915	\N	Hazirhat	হাজীর হাট	hazirhatup.bhola.gov.bd
6916	\N	Monpura	মনপুরা	monpuraup.bhola.gov.bd
6917	\N	North Sakuchia	উত্তর সাকুচিয়া	sakuchianorthup.bhola.gov.bd
6918	\N	South Sakuchia	দক্ষিন সাকুচিয়া	sakuchiasouthup.bhola.gov.bd
6919	\N	Chanchra	চাচঁড়া	chanchraup.bhola.gov.bd
6920	\N	Shambupur	শম্ভুপুর	shambupurup.bhola.gov.bd
6921	\N	Sonapur	সোনাপুর	sonapurup.bhola.gov.bd
6922	\N	Chadpur	চাঁদপুর	chadpurup.bhola.gov.bd
6923	\N	Baro Molongchora	বড় মলংচড়া	baromolongchoraup.bhola.gov.bd
6924	\N	Badarpur	বদরপুর	badarpurup.bhola.gov.bd
6925	\N	Charbhuta	চরভূতা	charbhutaup.bhola.gov.bd
6926	\N	Kalma	কালমা	kalmaup.bhola.gov.bd
6927	\N	Dholigour Nagar	ধলীগৌর নগর	dholigournagarup.bhola.gov.bd
6928	\N	Lalmohan	লালমোহন	lalmohanup.bhola.gov.bd
6929	\N	Lord Hardinge	লর্ড হার্ডিঞ্জ	lordhardingeup.bhola.gov.bd
6930	\N	Ramagonj	রমাগঞ্জ	ramagonjup.bhola.gov.bd
6931	\N	Paschim Char Umed	পশ্চিম চর উমেদ	paschimcharumedup.bhola.gov.bd
6932	\N	Farajgonj	ফরাজগঞ্জ	farajgonjup.bhola.gov.bd
6933	\N	Amtali	আমতলী	amtaliup.barguna.gov.bd
6934	\N	Gulishakhali	গুলিশাখালী	gulishakhaliup.barguna.gov.bd
6935	\N	Athrogasia	আঠারগাছিয়া	athrogasiaup.barguna.gov.bd
6936	\N	Kukua	কুকুয়া	kukuaup.barguna.gov.bd
6937	\N	Haldia	হলদিয়া	haldiaup.barguna.gov.bd
6938	\N	Chotobogi	ছোটবগী	chotobogiup.barguna.gov.bd
6939	\N	Arpangasia	আড়পাঙ্গাশিয়া	arpangasiaup.barguna.gov.bd
6940	\N	Chowra	চাওড়া	chowraup.barguna.gov.bd
6941	\N	M. Baliatali	এম. বালিয়াতলী	m.baliataliup.barguna.gov.bd
6942	\N	Noltona	নলটোনা	noltonaup.barguna.gov.bd
6943	\N	Bodorkhali	বদরখালী	bodorkhaliup.barguna.gov.bd
6944	\N	Gowrichanna	গৌরিচন্না	gowrichannaup.barguna.gov.bd
6945	\N	Fuljhuri	ফুলঝুড়ি	fuljhuriup.barguna.gov.bd
6946	\N	Keorabunia	কেওড়াবুনিয়া	keorabuniaup.barguna.gov.bd
6947	\N	Ayla Patakata	আয়লা পাতাকাটা	aylaPatakataup.barguna.gov.bd
6948	\N	Burirchor	বুড়িরচর	burirchorup.barguna.gov.bd
6949	\N	Dhalua	ঢলুয়া	dhaluaup.barguna.gov.bd
6950	\N	Barguna	বরগুনা	bargunaup.barguna.gov.bd
6951	\N	Bibichini	বিবিচিন	bibichiniup.barguna.gov.bd
6952	\N	Betagi	বেতাগী	betagiup.barguna.gov.bd
6953	\N	Hosnabad	হোসনাবাদ	hosnabadup.barguna.gov.bd
6954	\N	Mokamia	মোকামিয়া	mokamiaup.barguna.gov.bd
6955	\N	Buramajumder	বুড়ামজুমদার	buramajumderup.barguna.gov.bd
6956	\N	Kazirabad	কাজীরাবাদ	kazirabadup.barguna.gov.bd
6957	\N	Sarisamuri	সরিষামুড়ী	sarisamuriup.barguna.gov.bd
6958	\N	Bukabunia	বুকাবুনিয়া	bukabuniaup.barguna.gov.bd
6959	\N	Bamna	বামনা	bamnaup.barguna.gov.bd
6960	\N	Ramna	রামনা	ramnaup.barguna.gov.bd
6961	\N	Doutola	ডৌয়াতলা	doutolaup.barguna.gov.bd
6962	\N	Raihanpur	রায়হানপুর	raihanpurup.barguna.gov.bd
6963	\N	Nachnapara	নাচনাপাড়া	nachnaparaup.barguna.gov.bd
6964	\N	Charduany	চরদুয়ানী	charduanyup.barguna.gov.bd
6965	\N	Patharghata	পাথরঘাটা	patharghataup.barguna.gov.bd
6966	\N	Kalmegha	কালমেঘা	kalmeghaup.barguna.gov.bd
6967	\N	Kakchira	কাকচিঢ়া	kakchiraup.barguna.gov.bd
6968	\N	Kathaltali	কাঠালতলী	kathaltaliup.barguna.gov.bd
6969	\N	Karibaria	কড়ইবাড়ীয়া	karibariaup.barguna.gov.bd
6970	\N	Panchakoralia	পচাকোড়ালিয়া	panchakoraliaup.barguna.gov.bd
6971	\N	Barabagi	বড়বগি	barabagiup.barguna.gov.bd
6972	\N	Chhotabagi	ছোটবগি	chhotabagiup.barguna.gov.bd
6973	\N	Nishanbaria	নিশানবাড়ীয়া	nishanbariaup.barguna.gov.bd
6974	\N	Sarikkhali	শারিকখালি	sarikkhaliup.barguna.gov.bd
6975	\N	Sonakata	সোনাকাটা	sonakataup.barguna.gov.bd
6976	\N	Tazpur	তাজপুর	tazpurup.sylhet.gov.bd
6977	\N	Umorpur	উমরপুর	umorpurup.sylhet.gov.bd
6978	\N	West Poilanpur	পশ্চিম পৈলনপুর	westpoilanpurup.sylhet.gov.bd
6979	\N	East Poilanpur	পূর্ব পৈলনপুর	eastpoilanpurup.sylhet.gov.bd
6980	\N	Boaljur	বোয়ালজুর	boaljurup.sylhet.gov.bd
6981	\N	Burungabazar	বুরুঙ্গাবাজার	burungabazarup.sylhet.gov.bd
6982	\N	Goalabazar	গোয়ালাবাজার	goalabazarup.sylhet.gov.bd
6983	\N	Doyamir	দয়ামীর	doyamirup.sylhet.gov.bd
6984	\N	Usmanpur	উসমানপুর	usmanpurup.sylhet.gov.bd
6985	\N	Dewanbazar	দেওয়ান বাজার	dewanbazarup.sylhet.gov.bd
6986	\N	West Gouripur	পশ্চিম গৌরীপুর	westgouripurup.sylhet.gov.bd
6987	\N	East Gouripur	পূর্ব গৌরীপুর	eastgouripurup.sylhet.gov.bd
6988	\N	Balaganj	বালাগঞ্জ	balaganjup.sylhet.gov.bd
6989	\N	Sadipur	সাদিরপুর	sadipurup.sylhet.gov.bd
6990	\N	Tilpara	তিলপাড়া	tilparaup.sylhet.gov.bd
6991	\N	Alinagar	আলীনগর	alinagarup.sylhet.gov.bd
6992	\N	Charkhai	চরখাই	charkhaiup.sylhet.gov.bd
6993	\N	Dubag	দুবাগ	dubagup.sylhet.gov.bd
6994	\N	Sheola	শেওলা	sheolaup.sylhet.gov.bd
6995	\N	Kurarbazar	কুড়ারবাজার	kurarbazarup.sylhet.gov.bd
6996	\N	Mathiura	মাথিউরা	mathiuraup.sylhet.gov.bd
6997	\N	Mullapur	মোল্লাপুর	mullapurup.sylhet.gov.bd
6998	\N	Muria	মুড়িয়া	muriaup.sylhet.gov.bd
6999	\N	Lauta	লাউতা	lautaup.sylhet.gov.bd
7000	\N	Rampasha	রামপাশা	rampashaup.sylhet.gov.bd
7001	\N	Lamakazi	লামাকাজী	lamakaziup.sylhet.gov.bd
7002	\N	Khajanchi	খাজাঞ্চী	khajanchiup.sylhet.gov.bd
7003	\N	Alankari	অলংকারী	alankariup.sylhet.gov.bd
7004	\N	Dewkalash	দেওকলস	dewkalashup.sylhet.gov.bd
7005	\N	Bishwanath	বিশ্বনাথ	bishwanathup.sylhet.gov.bd
7006	\N	Doshghar	দশঘর	doshgharup.sylhet.gov.bd
7007	\N	Daulatpur	দৌলতপুর	daulatpurup.sylhet.gov.bd
7008	\N	Telikhal	তেলিখাল	telikhalup.sylhet.gov.bd
7009	\N	Islampur Paschim	ইসলামপুর পশ্চিম	islampurpaschimup.sylhet.gov.bd
7010	\N	Islampur Purba	ইসলামপুর পূর্ব	islampurpurbaup.sylhet.gov.bd
7011	\N	Isakalas	ইসাকলস	isakalasup.sylhet.gov.bd
7012	\N	Uttor Ronikhai	উত্তর রনিখাই	uttorronikhaiup.sylhet.gov.bd
7013	\N	Dakkin Ronikhai	দক্ষিন রনিখাই	dakkinronikhaiup.sylhet.gov.bd
7014	\N	Ghilachora	ঘিলাছড়া	ghilachoraup.sylhet.gov.bd
7015	\N	Fenchuganj	ফেঞ্চুগঞ্জ	1nofenchuganjup.sylhet.gov.bd
7016	\N	Uttar Kushiara	উত্তর কুশিয়ারা	uttarkushiaraup.sylhet.gov.bd
7017	\N	Uttar Fenchuganj	উত্তর ফেঞ্চুগঞ্জ	uttarfenchuganjup.sylhet.gov.bd
7018	\N	Maijgaon	মাইজগাঁও	maijgaonup.sylhet.gov.bd
7019	\N	Golapganj	গোলাপগঞ্জ	golapganjup.sylhet.gov.bd
7020	\N	Fulbari	ফুলবাড়ী	fulbariup.sylhet.gov.bd
7021	\N	Lakshmipasha	লক্ষ্মীপাশা	lakshmipashaup.sylhet.gov.bd
7022	\N	Budhbaribazar	বুধবারীবাজার	budhbaribazarup.sylhet.gov.bd
7023	\N	Dhakadakshin	ঢাকাদক্ষিন	dhakadakshinup.sylhet.gov.bd
7024	\N	Sharifganj	শরিফগঞ্জ	sharifganjup.sylhet.gov.bd
7025	\N	Uttar Badepasha	উত্তর বাদেপাশা	uttarbadepashaup.sylhet.gov.bd
7026	\N	Lakshanaband	লক্ষনাবন্দ	lakshanabandup.sylhet.gov.bd
7027	\N	Bhadeshwar	ভাদেশ্বর	bhadeshwarup.sylhet.gov.bd
7028	\N	West Amura	পশ্চিম আমুরা	westamuraup.sylhet.gov.bd
7029	\N	Fothepur	ফতেপুর	fothepurup.sylhet.gov.bd
7030	\N	Rustampur	রুস্তমপুর	rustampurup.sylhet.gov.bd
7031	\N	Paschim Jaflong	পশ্চিম জাফলং	paschimjaflongup.sylhet.gov.bd
7032	\N	Purba Jaflong	পূর্ব জাফলং	purbajaflongup.sylhet.gov.bd
7033	\N	Lengura	লেঙ্গুড়া	lenguraup.sylhet.gov.bd
7034	\N	Alirgaon	আলীরগাঁও	alirgaonup.sylhet.gov.bd
7035	\N	Nandirgaon	নন্দিরগাঁও	nandirgaonup.sylhet.gov.bd
7036	\N	Towakul	তোয়াকুল	towakulup.sylhet.gov.bd
7037	\N	Daubari	ডৌবাড়ী	daubariup.sylhet.gov.bd
7038	\N	Nijpat	নিজপাট	nijpatup.sylhet.gov.bd
7039	\N	Jaintapur	জৈন্তাপুর	jaintapurup.sylhet.gov.bd
7040	\N	Charikatha	চারিকাটা	charikathaup.sylhet.gov.bd
7041	\N	Darbast	দরবস্ত	darbastup.sylhet.gov.bd
7042	\N	Fatehpur	ফতেপুর	fatehpurup.sylhet.gov.bd
7043	\N	Chiknagul	চিকনাগুল	chiknagulup.sylhet.gov.bd
7044	\N	Rajagonj	রাজাগঞ্জ	rajagonjup.sylhet.gov.bd
7045	\N	Lakshiprashad Purbo	লক্ষীপ্রাসাদ পূর্ব	lakshiprashadpurboup.sylhet.gov.bd
7046	\N	Lakshiprashad Pashim	লক্ষীপ্রাসাদ পশ্চিম	lakshiprashadpashimup.sylhet.gov.bd
7047	\N	Digirpar Purbo	দিঘিরপার পূর্ব	digirparpurboup.sylhet.gov.bd
7048	\N	Satbakh	সাতবাক	satbakhup.sylhet.gov.bd
7049	\N	Barachotul	বড়চতুল	barachotulup.sylhet.gov.bd
7050	\N	Kanaighat	কানাইঘাট	kanaighatup.sylhet.gov.bd
7051	\N	Dakhin Banigram	দক্ষিন বানিগ্রাম	dakhinbanigramup.sylhet.gov.bd
7052	\N	Jinghabari	ঝিঙ্গাবাড়ী	jinghabariup.sylhet.gov.bd
7053	\N	Jalalabad	জালালাবাদ	jalalabadup.sylhet.gov.bd
7054	\N	Hatkhula	হাটখোলা	hatkhulaup.sylhet.gov.bd
7055	\N	Khadimnagar	খাদিমনগর	khadimnagarup.sylhet.gov.bd
7056	\N	Khadimpara	খাদিমপাড়া	khadimparaup.sylhet.gov.bd
7057	\N	Tultikor	টুলটিকর	tultikorup.sylhet.gov.bd
7058	\N	Tukerbazar	টুকেরবাজার	tukerbazarup.sylhet.gov.bd
7059	\N	Mugolgaon	মোগলগাও	mugolgaonup.sylhet.gov.bd
7060	\N	Kandigaon	কান্দিগাও	kandigaonup.sylhet.gov.bd
7061	\N	Manikpur	মানিকপুর	manikpurup.sylhet.gov.bd
7062	\N	Sultanpur	সুলতানপুর	sultanpurup.sylhet.gov.bd
7063	\N	Barohal	বারহাল	barohalup.sylhet.gov.bd
7064	\N	Birorsri	বিরশ্রী	birorsriup.sylhet.gov.bd
7065	\N	Kajalshah	কাজলশার	kajalshahup.sylhet.gov.bd
7066	\N	Kolachora	কলাছড়া	kolachora.sylhet.gov.bd
7067	\N	Zakiganj	জকিগঞ্জ	zakiganjup.sylhet.gov.bd
7068	\N	Barothakuri	বারঠাকুরী	barothakuriup.sylhet.gov.bd
7069	\N	Kaskanakpur	কসকনকপুর	kaskanakpurup.sylhet.gov.bd
7070	\N	Lalabazar	লালাবাজার	lalabazarup.sylhet.gov.bd
7071	\N	Moglabazar	মোগলাবাজার	moglabazarup.sylhet.gov.bd
7072	\N	Boroikandi	বড়ইকান্দি	boroikandiup.sylhet.gov.bd
7073	\N	Silam	সিলাম	silamup.sylhet.gov.bd
7074	\N	Daudpur	দাউদপুর	daudpurup.sylhet.gov.bd
7075	\N	Mollargaon	মোল্লারগাঁও	mollargaonup.sylhet.gov.bd
7076	\N	Kuchai	কুচাই	kuchaiup.sylhet.gov.bd
7077	\N	Kamalbazar	কামালবাজার	kamalbazarup.sylhet.gov.bd
7078	\N	Jalalpur	জালালপুর	jalalpurup.sylhet.gov.bd
7079	\N	Tetli	তেতলী	tetliup.sylhet.gov.bd
7080	\N	Talimpur	তালিমপুর	talimpurup.moulvibazar.gov.bd
7081	\N	Borni	বর্ণি	borniup.moulvibazar.gov.bd
7082	\N	Dasherbazar	দাসেরবাজার	dasherbazarup.moulvibazar.gov.bd
7083	\N	Nizbahadurpur	নিজবাহাদুরপুর	nizbahadurpurup.moulvibazar.gov.bd
7084	\N	Uttar Shahbajpur	উত্তর শাহবাজপুর	shahbajpuruttarup.moulvibazar.gov.bd
7085	\N	Dakkhin Shahbajpur	দক্ষিণ শাহবাজপুর	shahbajpurdakshinup.moulvibazar.gov.bd
7086	\N	Talimpur	তালিমপুর	talimpurup.moulvibazar.gov.bd
7087	\N	Baralekha	বড়লেখা	baralekhaup.moulvibazar.gov.bd
7088	\N	Dakshinbhag Uttar	দক্ষিণভাগ (উত্তর)	dakshinbhaguttarup.moulvibazar.gov.bd
7089	\N	Dakshinbhag Dakkhin	দক্ষিণভাগ (দক্ষিণ)	dakshinbhagdakshinup.moulvibazar.gov.bd
7090	\N	Sujanagar	সুজানগর	sujanagarup.moulvibazar.gov.bd
7091	\N	Adampur	আদমপুর	adampurup.moulvibazar.gov.bd
7092	\N	Patanushar	পতনঊষার	patanusharup.moulvibazar.gov.bd
7093	\N	Madhabpur	মাধবপুর	madhabpurup.moulvibazar.gov.bd
7094	\N	Rahimpur	রহিমপুর	rahimpurup.moulvibazar.gov.bd
7095	\N	Shamshernagar	শমশেরনগর	shamshernagarup.moulvibazar.gov.bd
7096	\N	Kamalgonj	কমলগঞ্জ	kamalgonjup.moulvibazar.gov.bd
7097	\N	Islampur	ইসলামপুর	islampurup.moulvibazar.gov.bd
7098	\N	Munshibazar	মুন্সিবাজার	munshibazarup3.moulvibazar.gov.bd
7099	\N	Alinagar	আলী নগর	alinagarup.moulvibazar.gov.bd
7100	\N	Baramchal	বরমচাল	baramchalup.moulvibazar.gov.bd
7101	\N	Bhukshimail	ভূকশিমইল	bhukshimailup.moulvibazar.gov.bd
7102	\N	Joychandi	জয়চন্ডি	joychandiup.moulvibazar.gov.bd
7103	\N	Brammanbazar	ব্রাহ্মণবাজার	brammanbazarup.moulvibazar.gov.bd
7104	\N	Kadipur	কাদিপুর	kadipurup.moulvibazar.gov.bd
7105	\N	Kulaura	কুলাউড়া	kulauraup.moulvibazar.gov.bd
7106	\N	Rauthgaon	রাউৎগাঁও	rauthgaonup.moulvibazar.gov.bd
7107	\N	Tilagaon	টিলাগাঁও	tilagaonup.moulvibazar.gov.bd
7108	\N	Sharifpur	শরীফপুর	sharifpurup.moulvibazar.gov.bd
7109	\N	Prithimpassa	পৃথিমপাশা	prithimpassaup.moulvibazar.gov.bd
7110	\N	Kormodha	কর্মধা	kormodhaup.moulvibazar.gov.bd
7111	\N	Bhatera	ভাটেরা	bhateraup.moulvibazar.gov.bd
7112	\N	Hazipur	হাজীপুর	hazipurup.moulvibazar.gov.bd
7113	\N	Amtail	আমতৈল	amtailup.moulvibazar.gov.bd
7114	\N	Khalilpur	খলিলপুর	khalilpurup.moulvibazar.gov.bd
7115	\N	Monumukh	মনুমুখ	monumukhup.moulvibazar.gov.bd
7116	\N	Kamalpur	কামালপুর	kamalpurup.moulvibazar.gov.bd
7117	\N	Apar Kagabala	আপার কাগাবলা	uparkagabalaup.moulvibazar.gov.bd
7118	\N	Akhailkura	আখাইলকুড়া	akhailkuraup.moulvibazar.gov.bd
7119	\N	Ekatuna	একাটুনা	ekatunaup.moulvibazar.gov.bd
7120	\N	Chadnighat	চাঁদনীঘাট	chadnighatup.moulvibazar.gov.bd
7121	\N	Konokpur	কনকপুর	konokpurup.moulvibazar.gov.bd
7122	\N	Nazirabad	নাজিরাবাদ	nazirabadup.moulvibazar.gov.bd
7123	\N	Mostafapur	মোস্তফাপুর	mostafapurup.moulvibazar.gov.bd
7124	\N	Giasnagar	গিয়াসনগর	giasnagarup.moulvibazar.gov.bd
7125	\N	Fotepur	ফতেপুর	fotepurup.moulvibazar.gov.bd
7126	\N	Uttorbhag	উত্তরভাগ	uttorbhagup.moulvibazar.gov.bd
7127	\N	Munsibazar	মুন্সিবাজার	munsibazarup.moulvibazar.gov.bd
7128	\N	Panchgaon	পাঁচগাঁও	panchgaonup.moulvibazar.gov.bd
7129	\N	Rajnagar	রাজনগর	rajnagarup.moulvibazar.gov.bd
7130	\N	Tengra	টেংরা	tengraup.moulvibazar.gov.bd
7131	\N	Kamarchak	কামারচাক	kamarchakup.moulvibazar.gov.bd
7132	\N	Munsurnagar	মনসুরনগর	munsurnagarup.moulvibazar.gov.bd
7133	\N	Mirzapur	মির্জাপুর	mirzapurup.moulvibazar.gov.bd
7134	\N	Bhunabir	ভূনবীর	bhunabirup.moulvibazar.gov.bd
7135	\N	Sreemangal	শ্রীমঙ্গল	sreemangalup.moulvibazar.gov.bd
7136	\N	Sindurkhan	সিন্দুরখান	sindurkhanup.moulvibazar.gov.bd
7137	\N	Kalapur	কালাপুর	kalapurup.moulvibazar.gov.bd
7138	\N	Ashidron	আশিদ্রোন	ashidronup.moulvibazar.gov.bd
7139	\N	Rajghat	রাজঘাট	rajghatup.moulvibazar.gov.bd
7140	\N	Kalighat	কালীঘাট	kalighatup.moulvibazar.gov.bd
7141	\N	Satgaon	সাতগাঁও	satgaonup.moulvibazar.gov.bd
7142	\N	Jafornagar	জায়ফরনগর	jafornagarup.moulvibazar.gov.bd
7143	\N	West Juri	পশ্চিম জুড়ী	westjuriup.moulvibazar.gov.bd
7144	\N	Gualbari	গোয়ালবাড়ী	gualbariup.moulvibazar.gov.bd
7145	\N	Sagornal	সাগরনাল	sagornalup.moulvibazar.gov.bd
7146	\N	Fultola	ফুলতলা	fultolaup.moulvibazar.gov.bd
7147	\N	Eastjuri	পুর্ব জুড়ী	eastjuriup.moulvibazar.gov.bd
7148	\N	Barabhakoir Paschim	বড় ভাকৈর (পশ্চিম)	barabhakoirpaschimup.habiganj.gov.bd
7149	\N	Barabhakoir Purba	বড় ভাকৈর (পূর্ব)	barabhakoirpurbaup.habiganj.gov.bd
7150	\N	Inatganj	ইনাতগঞ্জ	inatganjup.habiganj.gov.bd
7151	\N	Digholbak	দীঘলবাক	digholbakup.habiganj.gov.bd
7152	\N	Aushkandi	আউশকান্দি	aushkandiup.habiganj.gov.bd
7153	\N	Kurshi	কুর্শি	kurshiup.habiganj.gov.bd
7154	\N	Kargoan	করগাঁও	kargoanup.habiganj.gov.bd
7155	\N	Nabiganj Sadar	নবীগঞ্জ সদর	nabiganjsadarup.habiganj.gov.bd
7156	\N	Bausha	বাউসা	baushaup.habiganj.gov.bd
7157	\N	Debparra	দেবপাড়া	debparraup.habiganj.gov.bd
7158	\N	Gaznaipur	গজনাইপুর	gaznaipurup.habiganj.gov.bd
7159	\N	Kaliarbhanga	কালিয়ারভাংগা	kaliarbhangaup.habiganj.gov.bd
7160	\N	Paniumda	পানিউমদা	paniumdaup.habiganj.gov.bd
7161	\N	Snanghat	স্নানঘাট	snanghatup.habiganj.gov.bd
7162	\N	Putijuri	পুটিজুরী	putijuriup.habiganj.gov.bd
7163	\N	Satkapon	সাতকাপন	satkaponup.habiganj.gov.bd
7164	\N	Bahubal Sadar	বাহুবল সদর	bahubalsadarup.habiganj.gov.bd
7165	\N	Lamatashi	লামাতাশী	lamatashiup.habiganj.gov.bd
7166	\N	Mirpur	মিরপুর	mirpurup.habiganj.gov.bd
7167	\N	Bhadeshwar	ভাদেশ্বর	bhadeshwarup.habiganj.gov.bd
7168	\N	Shibpasha	শিবপাশা	shibpashaup.habiganj.gov.bd
7169	\N	Kakailsao	কাকাইলছেও	kakailsaoup.habiganj.gov.bd
7170	\N	Ajmiriganj Sadar	আজমিরীগঞ্জ সদর	ajmiriganjsadarup.habiganj.gov.bd
7171	\N	Badolpur	বদলপুর	badolpurup.habiganj.gov.bd
7172	\N	Jolsuka	জলসুখা	jolsukaup.habiganj.gov.bd
7173	\N	Baniachong North East	বানিয়াচং উত্তর পূর্ব	baniachongnortheastup.habiganj.gov.bd
7174	\N	Baniachong North West	বানিয়াচং উত্তর পশ্চিম	baniachongnorthwestup.habiganj.gov.bd
7175	\N	Baniachong South East	বানিয়াচং দক্ষিণ পূর্ব	baniachongsoutheastup.habiganj.gov.bd
7176	\N	Baniachong South West	বানিয়াচং দক্ষিণ পশ্চিম	baniachongsouthwestup.habiganj.gov.bd
7177	\N	Daulatpur	দৌলতপুর	daulatpur.habiganj.gov.bd
7178	\N	Khagaura	খাগাউড়া	khagauraup.habiganj.gov.bd
7179	\N	Baraiuri	বড়ইউড়ি	baraiuriup.habiganj.gov.bd
7180	\N	Kagapasha	কাগাপাশা	kagapashaup.habiganj.gov.bd
7181	\N	Pukra	পুকড়া	pukraup.habiganj.gov.bd
7182	\N	Subidpur	সুবিদপুর	subidpurup.habiganj.gov.bd
7183	\N	Makrampur	মক্রমপুর	makrampurup.habiganj.gov.bd
7184	\N	Sujatpur	সুজাতপুর	sujatpurup.habiganj.gov.bd
7185	\N	Mandari	মন্দরী	mandariup.habiganj.gov.bd
7186	\N	Muradpur	মুরাদপুর	muradpurup.habiganj.gov.bd
7187	\N	Pailarkandi	পৈলারকান্দি	pailarkandiup.habiganj.gov.bd
7188	\N	Lakhai	লাখাই	lakhaiup.habiganj.gov.bd
7189	\N	Murakari	মোড়াকরি	murakariup.habiganj.gov.bd
7190	\N	Muriauk	মুড়িয়াউক	muriaukup.habiganj.gov.bd
7191	\N	Bamoi	বামৈ	bamoiup.habiganj.gov.bd
7192	\N	Karab	করাব	karabup.habiganj.gov.bd
7193	\N	Bulla	বুল্লা	bullaup6.habiganj.gov.bd
7194	\N	Gazipur	গাজীপুর	gazipurup.habiganj.gov.bd
7195	\N	Ahammadabad	আহম্মদাবাদ	ahammadabadup.habiganj.gov.bd
7196	\N	Deorgach	দেওরগাছ	deorgachup.habiganj.gov.bd
7197	\N	Paikpara	পাইকপাড়া	paikparaup.habiganj.gov.bd
7198	\N	Shankhala	শানখলা	shankhalaup.habiganj.gov.bd
7199	\N	Chunarughat	চুনারুঘাট	chunarughatup.habiganj.gov.bd
7200	\N	Ubahata	উবাহাটা	ubahataup.habiganj.gov.bd
7201	\N	Shatiajuri	সাটিয়াজুরী	shatiajuriup.habiganj.gov.bd
7202	\N	Ranigaon	রাণীগাঁও	ranigaonup.habiganj.gov.bd
7203	\N	Mirashi	মিরাশী	mirashiup.habiganj.gov.bd
7204	\N	Lukra	লুকড়া	lukraup.habiganj.gov.bd
7205	\N	Richi	রিচি	richiup.habiganj.gov.bd
7206	\N	Teghoria	তেঘরিয়া	teghoriaup.habiganj.gov.bd
7207	\N	Poil	পইল	poilup.habiganj.gov.bd
7208	\N	Gopaya	গোপায়া	gopayaup.habiganj.gov.bd
7209	\N	Rajiura	রাজিউড়া	rajiuraup.habiganj.gov.bd
7210	\N	Nurpur	নুরপুর	nurpurup.habiganj.gov.bd
7211	\N	Shayestaganj	শায়েস্তাগঞ্জ	shayestaganjup.habiganj.gov.bd
7212	\N	Nijampur	নিজামপুর	nijampurup.habiganj.gov.bd
7213	\N	Laskerpur	লস্করপুর	laskerpurup.habiganj.gov.bd
7214	\N	Dharmaghar	ধর্মঘর	dharmagharup.habiganj.gov.bd
7215	\N	Choumohani	চৌমুহনী	choumohaniup.habiganj.gov.bd
7216	\N	Bahara	বহরা	baharaup.habiganj.gov.bd
7217	\N	Adaoir	আদাঐর	adaoirup.habiganj.gov.bd
7218	\N	Andiura	আন্দিউড়া	andiuraup.habiganj.gov.bd
7219	\N	Shahjahanpur	শাহজাহানপুর	shahjahanpurup.habiganj.gov.bd
7220	\N	Jagadishpur	জগদীশপুর	jagadishpurup.habiganj.gov.bd
7221	\N	Bulla	বুল্লা	bullaup.habiganj.gov.bd
7222	\N	Noapara	নোয়াপাড়া	noaparaup.habiganj.gov.bd
7223	\N	Chhatiain	ছাতিয়াইন	chhatiainup.habiganj.gov.bd
7224	\N	Bagashura	বাঘাসুরা	bagashuraup.habiganj.gov.bd
7225	\N	Jahangirnagar	জাহাঙ্গীরনগর	jahangirnagarup.sunamganj.gov.bd
7226	\N	Rangarchar	রংগারচর	rangarcharup.sunamganj.gov.bd
7227	\N	Aptabnagar	আপ্তাবনগর	aptabnagarup.sunamganj.gov.bd
7228	\N	Gourarang	গৌরারং	gourarang.sunamganj.gov.bd
7229	\N	Mollapara	মোল্লাপাড়া	mollaparaup.sunamganj.gov.bd
7230	\N	Laxmansree	লক্ষণশ্রী	laxmansreeup.sunamganj.gov.bd
7231	\N	Kathair	কাঠইর	kathairup.sunamganj.gov.bd
7232	\N	Surma	সুরমা	surmaup.sunamganj.gov.bd
7233	\N	Mohonpur	মোহনপুর	mohonpurup.sunamganj.gov.bd
7234	\N	Shimulbak	শিমুলবাক	shimulbak.sunamganj.gov.bd
7235	\N	Paschim Pagla	পশ্চিম পাগলা	paschimpagla.sunamganj.gov.bd
7236	\N	Joykalash	জয়কলস	joykalashup.sunamganj.gov.bd
7237	\N	Purba Pagla	পূর্ব পাগলা	purbapaglaup.sunamganj.gov.bd
7238	\N	Patharia	পাথারিয়া	pathariaup.sunamganj.gov.bd
7239	\N	Purba Birgaon	পূর্ব বীরগাঁও	purbabirgaonup.sunamganj.gov.bd
7240	\N	Dargapasha	দরগাপাশা	dargapashaup.sunamganj.gov.bd
7241	\N	Paschim Birgaon	পশ্চিম বীরগাঁও	paschimbirgaonup.sunamganj.gov.bd
7242	\N	Palash	পলাশ	palashup.sunamganj.gov.bd
7243	\N	Solukabad	সলুকাবাদ	solukabadup.sunamganj.gov.bd
7244	\N	Dhanpur	ধনপুর	dhanpurup.sunamganj.gov.bd
7245	\N	Badaghat South	বাদাঘাট দক্ষিণ	badaghatsouthup.sunamganj.gov.bd
7246	\N	Fatepur	ফতেপুর	fatepurup.sunamganj.gov.bd
7247	\N	Islampur	ইসলামপুর	islampurup.sunamganj.gov.bd
7248	\N	Noarai	নোয়ারাই	noaraiup.sunamganj.gov.bd
7249	\N	Chhatak Sadar	ছাতক সদর	chhataksadarup.sunamganj.gov.bd
7250	\N	Kalaruka	কালারুকা	kalarukaup.sunamganj.gov.bd
7251	\N	Gobindganj-Syedergaon	গোবিন্দগঞ্জ-সৈদেরগাঁও	gobindganjsyedergaonup.sunamganj.gov.bd
7252	\N	Chhaila Afjalabad	ছৈলা আফজলাবাদ	chhailaafjalabadup.sunamganj.gov.bd
7253	\N	Khurma North	খুরমা উত্তর	khurmanorthup.sunamganj.gov.bd
7254	\N	Khurma South	খুরমা দক্ষিণ	khurmasouthup.sunamganj.gov.bd
7255	\N	Chormohalla	চরমহল্লা	chormohallaup.sunamganj.gov.bd
7256	\N	Jauwabazar	জাউয়া বাজার	jauwabazarup.sunamganj.gov.bd
7257	\N	Singchapair	সিংচাপইড়	singchapairup.sunamganj.gov.bd
7258	\N	Dolarbazar	দোলারবাজার	dolarbazarup.sunamganj.gov.bd
7259	\N	Bhatgaon	ভাতগাঁও	bhatgaonup.sunamganj.gov.bd
7260	\N	Kolkolia	কলকলিয়া	kolkoliaup.sunamganj.gov.bd
7261	\N	Patli	পাটলী	patliup.sunamganj.gov.bd
7262	\N	Mirpur	মীরপুর	mirpurup.sunamganj.gov.bd
7263	\N	Chilaura Holdipur	চিলাউড়া হলদিপুর	chilauraholdipurup.sunamganj.gov.bd
7264	\N	Raniganj	রানীগঞ্জ	raniganjup.sunamganj.gov.bd
7265	\N	Syedpur Shaharpara	সৈয়দপুর শাহাড়পাড়া	syedpurshaharparaup.sunamganj.gov.bd
7266	\N	Asharkandi	আশারকান্দি	asharkandiup.sunamganj.gov.bd
7267	\N	Pailgaon	পাইলগাঁও	pailgaonup.sunamganj.gov.bd
7268	\N	Banglabazar	বাংলাবাজার	banglabazarup.sunamganj.gov.bd
7269	\N	Norsingpur	নরসিংহপুর	norsingpurup.sunamganj.gov.bd
7270	\N	Dowarabazar	দোয়ারাবাজার	dowarabazarup.sunamganj.gov.bd
7271	\N	Mannargaon	মান্নারগাঁও	mannargaonup.sunamganj.gov.bd
7272	\N	Pandargaon	পান্ডারগাঁও	pandargaonup.sunamganj.gov.bd
7273	\N	Dohalia	দোহালিয়া	dohaliaup.sunamganj.gov.bd
7274	\N	Laxmipur	লক্ষীপুর	laxmipurup.sunamganj.gov.bd
7275	\N	Boglabazar	বোগলাবাজার	boglabazarup.sunamganj.gov.bd
7276	\N	Surma	সুরমা	surma2up.sunamganj.gov.bd
7277	\N	Sreepur North	শ্রীপুর উত্তর	sreepurnorthup.sunamganj.gov.bd
7278	\N	Sreepur South	শ্রীপুর দক্ষিণ	sreepursouthup.sunamganj.gov.bd
7279	\N	Bordal South	বড়দল দক্ষিণ	bordalsouthup.sunamganj.gov.bd
7280	\N	Bordal North	বড়দল উত্তর	bordalnorthup.sunamganj.gov.bd
7281	\N	Badaghat	বাদাঘাট	badaghatup.sunamganj.gov.bd
7282	\N	Tahirpur Sadar	তাহিরপুর সদর	tahirpursadarup.sunamganj.gov.bd
7283	\N	Balijuri	বালিজুরী	balijuriup.sunamganj.gov.bd
7284	\N	Bongshikunda North	বংশীকুন্ডা উত্তর	bongshikundanorthup.sunamganj.gov.bd
7285	\N	Bongshikunda South	বংশীকুন্ডা দক্ষিণ	bongshikundasouthup.sunamganj.gov.bd
7286	\N	Chamordani	চামরদানী	chamordaniup.sunamganj.gov.bd
7287	\N	Madhyanagar	মধ্যনগর	madhyanagarup.sunamganj.gov.bd
7288	\N	Paikurati	পাইকুরাটী	paikuratiup.sunamganj.gov.bd
7289	\N	Selbarash	সেলবরষ	selbarashup.sunamganj.gov.bd
7290	\N	Dharmapasha Sadar	ধর্মপাশা সদর	dharmapashasadarup.sunamganj.gov.bd
7291	\N	Joyasree	জয়শ্রী	joyasreeup.sunamganj.gov.bd
7292	\N	Sukhair Rajapur North	সুখাইড় রাজাপুর উত্তর	sukhairrajapurnorthup.sunamganj.gov.bd
7293	\N	Sukhair Rajapur South	সুখাইড় রাজাপুর দক্ষিণ	sukhairrajapursouthup.sunamganj.gov.bd
7294	\N	Beheli	বেহেলী	beheliup.sunamganj.gov.bd
7295	\N	Sachnabazar	সাচনাবাজার	sachnabazarup.sunamganj.gov.bd
7296	\N	Bhimkhali	ভীমখালী	bhimkhaliup.sunamganj.gov.bd
7297	\N	Fenerbak	ফেনারবাক	fenerbakup.sunamganj.gov.bd
7298	\N	Jamalganj Sadar	জামালগঞ্জ সদর	jamalganjsadarup.sunamganj.gov.bd
7299	\N	Atgaon	আটগাঁও	atgaonup.sunamganj.gov.bd
7300	\N	Habibpur	হবিবপুর	habibpurup.sunamganj.gov.bd
7301	\N	Bahara	বাহারা	baharaup.sunamganj.gov.bd
7302	\N	Shalla Sadar	শাল্লা সদর	shallasadarup.sunamganj.gov.bd
7303	\N	Rafinagar	রফিনগর	rafinagarup.sunamganj.gov.bd
7304	\N	Bhatipara	ভাটিপাড়া	bhatiparaup.sunamganj.gov.bd
7305	\N	Rajanagar	রাজানগর	rajanagarup.sunamganj.gov.bd
7306	\N	Charnarchar	চরনারচর	charnarcharup.sunamganj.gov.bd
7307	\N	Derai Sarmangal	দিরাই সরমঙ্গল	deraisarmangalup.sunamganj.gov.bd
7308	\N	Karimpur	করিমপুর	karimpurup.sunamganj.gov.bd
7309	\N	Jagddol	জগদল	jagddolup.sunamganj.gov.bd
7310	\N	Taral	তাড়ল	taralup.sunamganj.gov.bd
7311	\N	Kulanj	কুলঞ্জ	kulanjup.sunamganj.gov.bd
7312	\N	Amlaba	আমলাব	amlabaup.narsingdi.gov.bd
7313	\N	Bajnaba	বাজনাব	bajnabaup.narsingdi.gov.bd
7314	\N	Belabo	বেলাব	belaboup.narsingdi.gov.bd
7315	\N	Binnabayd	বিন্নাবাইদ	binnabaydup.narsingdi.gov.bd
7316	\N	Charuzilab	চরউজিলাব	charuzilabup.narsingdi.gov.bd
7317	\N	Naraynpur	নারায়নপুর	naraynpurup.narsingdi.gov.bd
7318	\N	Sallabad	সল্লাবাদ	sallabadup.narsingdi.gov.bd
7319	\N	Patuli	পাটুলী	patuliup.narsingdi.gov.bd
7320	\N	Diara	দেয়ারা মডেল	diaraup.narsingdi.gov.bd
7321	\N	Barachapa	বড়চাপা	barachapaup.narsingdi.gov.bd
7322	\N	Chalakchar	চালাকচর	chalakcharup.narsingdi.gov.bd
7323	\N	Charmandalia	চরমান্দালিয়া	charmandaliaup.narsingdi.gov.bd
7324	\N	Ekduaria	একদুয়ারিয়া	ekduariaup.narsingdi.gov.bd
7325	\N	Gotashia	গোতাশিয়া	gotashiaup.narsingdi.gov.bd
7326	\N	Kanchikata	কাচিকাটা	kanchikataup.narsingdi.gov.bd
7327	\N	Khidirpur	খিদিরপুর	khidirpurup.narsingdi.gov.bd
7328	\N	Shukundi	শুকুন্দি	shukundiup.narsingdi.gov.bd
7329	\N	Dawlatpur	দৌলতপুর	dawlatpurup.narsingdi.gov.bd
7330	\N	Krisnopur	কৃষ্ণপুর	krisnopurup.narsingdi.gov.bd
7331	\N	Labutala	লেবুতলা	labutalaup.narsingdi.gov.bd
7332	\N	Chandanbari	চন্দনবাড়ী	chandanbariup.narsingdi.gov.bd
7333	\N	Alokbali	আলোকবালী	alokbaliup.narsingdi.gov.bd
7334	\N	Chardighaldi	চরদিঘলদী	chardighaldiup.narsingdi.gov.bd
7335	\N	Chinishpur	চিনিশপুর	chinishpurup.narsingdi.gov.bd
7336	\N	Hajipur	হাজীপুর	hajipurup.narsingdi.gov.bd
7337	\N	Karimpur	করিমপুর	karimpurup.narsingdi.gov.bd
7338	\N	Khathalia	কাঠালিয়া	khathaliaup.narsingdi.gov.bd
7339	\N	Nuralapur	নূরালাপুর	nuralapurup.narsingdi.gov.bd
7340	\N	Mahishasura	মহিষাশুড়া	mahishasuraup.narsingdi.gov.bd
7341	\N	Meherpara	মেহেড়পাড়া	meherparaup.narsingdi.gov.bd
7342	\N	Nazarpur	নজরপুর	nazarpurup.narsingdi.gov.bd
7343	\N	Paikarchar	পাইকারচর	paikarcharup.narsingdi.gov.bd
7344	\N	Panchdona	পাঁচদোনা	panchdonaup.narsingdi.gov.bd
7345	\N	Silmandi	শিলমান্দী	silmandiup.narsingdi.gov.bd
7346	\N	Amdia	আমদিয়া ২	amdiaup.narsingdi.gov.bd
7347	\N	Danga	ডাংঙ্গা	dangaup.narsingdi.gov.bd
7348	\N	Charsindur	চরসিন্দুর	charsindurup.narsingdi.gov.bd
7349	\N	Jinardi	জিনারদী	jinardiup.narsingdi.gov.bd
7350	\N	Gazaria	গজারিয়া	gazariaup.narsingdi.gov.bd
7351	\N	Chanpur	চানপুর	chanpurup.narsingdi.gov.bd
7352	\N	Alipura	অলিপুরা	alipuraup.narsingdi.gov.bd
7353	\N	Amirganj	আমিরগঞ্জ	amirganjup.narsingdi.gov.bd
7354	\N	Adiabad	আদিয়াবাদ	adiabadup.narsingdi.gov.bd
7355	\N	Banshgari	বাঁশগাড়ী	banshgariup.narsingdi.gov.bd
7356	\N	Chanderkandi	চান্দেরকান্দি	chanderkandiup.narsingdi.gov.bd
7357	\N	Chararalia	চরআড়ালিয়া	chararaliaup.narsingdi.gov.bd
7358	\N	Charmadhua	চরমধুয়া	charmadhuaup.narsingdi.gov.bd
7359	\N	Charsubuddi	চরসুবুদ্দি	charsubuddiup.narsingdi.gov.bd
7360	\N	Daukarchar	ডৌকারচর	daukarcharup.narsingdi.gov.bd
7361	\N	Hairmara	হাইরমারা	hairmaraup.narsingdi.gov.bd
7362	\N	Maheshpur	মহেষপুর	maheshpurup.narsingdi.gov.bd
7363	\N	Mirzanagar	মির্জানগর	mirzanagarup.narsingdi.gov.bd
7364	\N	Mirzarchar	মির্জারচর	mirzarcharup.narsingdi.gov.bd
7365	\N	Nilakhya	নিলক্ষ্যা	nilakhyaup.narsingdi.gov.bd
7366	\N	Palashtali	পলাশতলী	palashtaliup.narsingdi.gov.bd
7367	\N	Paratali	পাড়াতলী	parataliup.narsingdi.gov.bd
7368	\N	Sreenagar	শ্রীনগর	sreenagarup.narsingdi.gov.bd
7369	\N	Roypura	রায়পুরা	roypuraup.narsingdi.gov.bd
7370	\N	Musapur	মুছাপুর	musapurup.narsingdi.gov.bd
7371	\N	Uttar Bakharnagar	উত্তর বাখরনগর	uttarbakharnagarup.narsingdi.gov.bd
7372	\N	Marjal	মরজাল	marjal2up.narsingdi.gov.bd
7373	\N	Dulalpur	দুলালপুর	dulalpurup.narsingdi.gov.bd
7374	\N	Joynagar	জয়নগর	joynagarup.narsingdi.gov.bd
7375	\N	Sadharchar	সাধারচর	sadharcharup.narsingdi.gov.bd
7376	\N	Masimpur	মাছিমপুর	masimpurup.narsingdi.gov.bd
7377	\N	Chakradha	চক্রধা	chakradhaup.narsingdi.gov.bd
7378	\N	Joshar	যোশর	josharup.narsingdi.gov.bd
7379	\N	Baghabo	বাঘাব	baghaboup.narsingdi.gov.bd
7380	\N	Ayubpur	আয়ুবপুর	ayubpurup.narsingdi.gov.bd
7381	\N	Putia	পুটিয়া	putiaup.narsingdi.gov.bd
7382	\N	Bahadursadi	বাহাদুরশাদী	bahadursadi.gazipur.gov.bd
7383	\N	Baktarpur	বক্তারপুর	baktarpur.gazipur.gov.bd
7384	\N	Jamalpurnew	জামালপুর	jamalpurnew.gazipur.gov.bd
7385	\N	Jangalia	জাঙ্গালিয়া	jangalia.gazipur.gov.bd
7386	\N	Moktarpur	মোক্তারপুর	moktarpur.gazipur.gov.bd
7387	\N	Nagari	নাগরী	nagari.gazipur.gov.bd
7388	\N	Tumulia	তুমুলিয়া	tumulia.gazipur.gov.bd
7389	\N	Atabaha	আটাবহ	atabahaup.gazipur.gov.bd
7390	\N	Boali	বোয়ালী	boaliup.gazipur.gov.bd
7391	\N	Chapair	চাপাইর	chapairup.gazipur.gov.bd
7392	\N	Dhaliora	ঢালজোড়া	dhalioraup.gazipur.gov.bd
7393	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.gazipur.gov.bd
7394	\N	Madhyapara	মধ্যপাড়া	madhyapara.gazipur.gov.bd
7395	\N	Mouchak	মৌচাক	mouchakup.gazipur.gov.bd
7396	\N	Sutrapur	সূত্রাপুর	sutrapurup.gazipur.gov.bd
7397	\N	Srifaltali	শ্রীফলতলী	srifaltaliup.gazipur.gov.bd
7398	\N	Barishaba	বারিষাব	barishabaup.gazipur.gov.bd
7399	\N	Ghagotia	ঘাগটিয়া	ghagotiaup.gazipur.gov.bd
7400	\N	Kapasia	কাপাসিয়া	kapasiaup.gazipur.gov.bd
7401	\N	Chandpur	চাঁদপুর	chandpur.gazipur.gov.bd
7402	\N	Targoan	তরগাঁও	targoan.gazipur.gov.bd
7403	\N	Karihata	কড়িহাতা	karihata.gazipur.gov.bd
7404	\N	Tokh	টোক	tokh.gazipur.gov.bd
7405	\N	Sinhasree	সিংহশ্রী	sinhasree.gazipur.gov.bd
7406	\N	Durgapur	দূর্গাপুর	durgapurup.gazipur.gov.bd
7407	\N	Sonmania	সনমানিয়া	sonmaniaup.gazipur.gov.bd
7408	\N	Rayed	রায়েদ	rayedup.gazipur.gov.bd
7409	\N	Baria	বাড়ীয়া	bariaup.gazipur.gov.bd
7410	\N	Basan	বাসন	basanup.gazipur.gov.bd
7411	\N	Gachha	গাছা	gachhaup.gazipur.gov.bd
7412	\N	Kashimpur	কাশিমপুর	kashimpurup.gazipur.gov.bd
7413	\N	Kayaltia	কাউলতিয়া	kayaltiaup.gazipur.gov.bd
7414	\N	Konabari	কোনাবাড়ী	konabariup.gazipur.gov.bd
7415	\N	Mirzapur	মির্জাপুর	mirzapurup.gazipur.gov.bd
7416	\N	Pubail	পূবাইল	pubailup.gazipur.gov.bd
7417	\N	Barmi	বরমী	barmiup.gazipur.gov.bd
7418	\N	Gazipur	গাজীপুর	gazipurup.gazipur.gov.bd
7419	\N	Gosinga	গোসিংগা	gosingaup.gazipur.gov.bd
7420	\N	Maona	মাওনা	maonaup.gazipur.gov.bd
7421	\N	Kaoraid	কাওরাইদ	kaoraidup.gazipur.gov.bd
7422	\N	Prahladpur	প্রহলাদপুর	prahladpurup.gazipur.gov.bd
7423	\N	Rajabari	রাজাবাড়ী	rajabariup.gazipur.gov.bd
7424	\N	Telihati	তেলিহাটী	telihatiup.gazipur.gov.bd
7425	\N	Binodpur	বিনোদপুর	binodpurup.shariatpur.gov.bd
7426	\N	Tulasar	তুলাসার	tulasarup.shariatpur.gov.bd
7427	\N	Palong	পালং	palongup.shariatpur.gov.bd
7428	\N	Domshar	ডোমসার	domsharup.shariatpur.gov.bd
7429	\N	Rudrakar	রুদ্রকর	rudrakarup.shariatpur.gov.bd
7430	\N	Angaria	আংগারিয়া	angariaup.shariatpur.gov.bd
7431	\N	Chitolia	চিতলয়া	chitoliaup.shariatpur.gov.bd
7432	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.shariatpur.gov.bd
7433	\N	Chikondi	চিকন্দি	chikondiup.shariatpur.gov.bd
7434	\N	Chandrapur	চন্দ্রপুর	chandrapurup.shariatpur.gov.bd
7435	\N	Shulpara	শৌলপাড়া	shulparaup.shariatpur.gov.bd
7436	\N	Kedarpur	কেদারপুর	kedarpurup.shariatpur.gov.bd
7437	\N	Dingamanik	ডিংগামানিক	dingamanikup.shariatpur.gov.bd
7438	\N	Garishar	ঘড়িষার	garisharup.shariatpur.gov.bd
7439	\N	Nowpara	নওপাড়া	nowparaup.shariatpur.gov.bd
7440	\N	Moktererchar	মোত্তারেরচর	mokterercharup.shariatpur.gov.bd
7441	\N	Charatra	চরআত্রা	charatraup.shariatpur.gov.bd
7442	\N	Rajnagar	রাজনগর	rajnagarup.shariatpur.gov.bd
7443	\N	Japsa	জপসা	japsaup.shariatpur.gov.bd
7444	\N	Vojeshwar	ভোজেশ্বর	vojeshwarup.shariatpur.gov.bd
7445	\N	Fategongpur	ফতেজংপুর	fategongpurup.shariatpur.gov.bd
7446	\N	Bijari	বিঝারি	bijariup.shariatpur.gov.bd
7447	\N	Vumkhara	ভূমখাড়া	vumkharaup.shariatpur.gov.bd
7448	\N	Nashason	নশাসন	nashasonup.shariatpur.gov.bd
7449	\N	Zajira Sadar	জাজিরা সদর	zajirasadarup.shariatpur.gov.bd
7450	\N	Mulna	মূলনা	mulnaup.shariatpur.gov.bd
7451	\N	Barokandi	বড়কান্দি	barokandiup.shariatpur.gov.bd
7452	\N	Bilaspur	বিলাসপুর	bilaspurup.shariatpur.gov.bd
7453	\N	Kundarchar	কুন্ডেরচর	kundarcharup.shariatpur.gov.bd
7454	\N	Palerchar	পালেরচর	palercharup.shariatpur.gov.bd
7455	\N	Purba Nawdoba	পুর্ব নাওডোবা	purbanawdobaup.shariatpur.gov.bd
7456	\N	Nawdoba	নাওডোবা	nawdobaup.shariatpur.gov.bd
7457	\N	Shenerchar	সেনেরচর	shenercharup.shariatpur.gov.bd
7458	\N	Bknagar	বি. কে. নগর	bknagarup.shariatpur.gov.bd
7459	\N	Barogopalpur	বড়গোপালপুর	barogopalpurup.shariatpur.gov.bd
7460	\N	Jaynagor	জয়নগর	jaynagorup.shariatpur.gov.bd
7461	\N	Nager Para	নাগের পাড়া	nagerparaup.shariatpur.gov.bd
7462	\N	Alaolpur	আলাওলপুর	alaolpurup.shariatpur.gov.bd
7463	\N	Kodalpur	কোদালপুর	kodalpurup.shariatpur.gov.bd
7464	\N	Goshairhat	গোসাইরহাট	goshairhatup.shariatpur.gov.bd
7465	\N	Edilpur	ইদিলপুর	edilpurup.shariatpur.gov.bd
7466	\N	Nalmuri	নলমুড়ি	nalmuriup.shariatpur.gov.bd
7467	\N	Samontasar	সামন্তসার	samontasarup.shariatpur.gov.bd
7468	\N	Kuchipatti	কুচাইপট্টি	kuchipattiup.shariatpur.gov.bd
7469	\N	Ramvadrapur	রামভদ্রপুর	ramvadrapurup.shariatpur.gov.bd
7470	\N	Mahisar	মহিষার	mahisarup.shariatpur.gov.bd
7471	\N	Saygaon	ছয়গাঁও	saygaonup.shariatpur.gov.bd
7472	\N	Narayanpur	নারায়নপুর	narayanpurup.shariatpur.gov.bd
7473	\N	D.M Khali	ডি.এম খালি	dmkhaliup.shariatpur.gov.bd
7474	\N	Charkumaria	চরকুমারিয়া	charkumariaup.shariatpur.gov.bd
7475	\N	Sakhipur	সখিপুর	sakhipurup.shariatpur.gov.bd
7476	\N	Kachikata	কাচিকাঁটা	kachikataup.shariatpur.gov.bd
7477	\N	North Tarabunia	উত্তর তারাবুনিয়া	northtarabuniaup.shariatpur.gov.bd
7478	\N	Charvaga	চরভাগা	charvagaup.shariatpur.gov.bd
7479	\N	Arsinagar	আরশিনগর	arsinagarup.shariatpur.gov.bd
7480	\N	South Tarabunia	দক্ষিন তারাবুনিয়া	southtarabuniaup.shariatpur.gov.bd
7481	\N	Charsensas	চরসেনসাস	charsensasup.shariatpur.gov.bd
7482	\N	Shidulkura	শিধলকুড়া	shidulkuraup.shariatpur.gov.bd
7483	\N	Kaneshar	কনেস্বর	kanesharup.shariatpur.gov.bd
7484	\N	Purba Damudya	পুর্ব ডামুড্যা	purbadamudyaup.shariatpur.gov.bd
7485	\N	Islampur	ইসলামপুর	islampurup.shariatpur.gov.bd
7486	\N	Dankati	ধানকাটি	dankatiup.shariatpur.gov.bd
7487	\N	Sidya	সিড্যা	sidyaup.shariatpur.gov.bd
7488	\N	Darulaman	দারুল আমান	darulamanup.shariatpur.gov.bd
7489	\N	Satgram	সাতগ্রাম	satgramup.narayanganj.gov.bd
7490	\N	Duptara	দুপ্তারা	duptaraup.narayanganj.gov.bd
7491	\N	Brahammandi	ব্রা‏হ্মন্দী	brahammandiup.narayanganj.gov.bd
7492	\N	Fatepur	ফতেপুর	fatepurup.narayanganj.gov.bd
7493	\N	Bishnandi	বিশনন্দী	bishnandiup.narayanganj.gov.bd
7494	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.narayanganj.gov.bd
7495	\N	Highjadi	হাইজাদী	highjadiup.narayanganj.gov.bd
7496	\N	Uchitpura	উচিৎপুরা	uchitpuraup.narayanganj.gov.bd
7497	\N	Kalapaharia	কালাপাহাড়িয়া	kalapahariaup.narayanganj.gov.bd
7498	\N	Kagkanda	খাগকান্দা	kagkandaUP.narayanganj.gov.bd
7499	\N	Musapur	মুছাপুর	musapurup.narayanganj.gov.bd
7500	\N	Modonpur	মদনপুর	modonpurup.narayanganj.gov.bd
7501	\N	Bandar	বন্দর	bandarup.narayanganj.gov.bd
7502	\N	Dhamgar	ধামগর	dhamgar.narayanganj.gov.bd
7503	\N	Kolagathia	কলাগাছিয়া	kolagathiaup.narayanganj.gov.bd
7504	\N	Alirtek	আলিরটেক	alirtekup.narayanganj.gov.bd
7505	\N	Kashipur	কাশীপুর	kashipurup.narayanganj.gov.bd
7506	\N	Kutubpur	কুতুবপুর	kutubpurup.narayanganj.gov.bd
7507	\N	Gognagar	গোগনগর	gognagarup.narayanganj.gov.bd
7508	\N	Baktaboli	বক্তাবলী	baktaboliup.narayanganj.gov.bd
7509	\N	Enayetnagor	এনায়েত নগর	enayetnagorup.narayanganj.gov.bd
7510	\N	Murapara	মুড়াপাড়া	muraparaup.narayanganj.gov.bd
7511	\N	Bhulta	ভূলতা	bhultaup.narayanganj.gov.bd
7512	\N	Golakandail	গোলাকান্দাইল	golakandailup.narayanganj.gov.bd
7513	\N	Daudpur	দাউদপুর	daudpurup.narayanganj.gov.bd
7514	\N	Rupganj	রূপগঞ্জ	rupganjup.narayanganj.gov.bd
7515	\N	Kayetpara	কায়েতপাড়া	kayetparaup.narayanganj.gov.bd
7516	\N	Bholobo	ভোলাব	bholoboup.narayanganj.gov.bd
7517	\N	Pirojpur	পিরোজপুর	pirojpurup.narayanganj.gov.bd
7518	\N	Shambhupura	শম্ভুপুরা	shambhupura.narayanganj.gov.bd
7519	\N	Mograpara	মোগরাপাড়া	mograpara.narayanganj.gov.bd
7520	\N	Baidyerbazar	বৈদ্যেরবাজার	baidyerbazar.narayanganj.gov.bd
7521	\N	Baradi	বারদী	baradiup.narayanganj.gov.bd
7522	\N	Noagaon	নোয়াগাঁও	noagaonup.narayanganj.gov.bd
7523	\N	Jampur	জামপুর	jampurup.narayanganj.gov.bd
7524	\N	Sadipur	সাদীপুর	sadipurup.narayanganj.gov.bd
7525	\N	Sonmandi	সনমান্দি	sonmandiup.narayanganj.gov.bd
7526	\N	Kanchpur	কাচপুর	kanchpurup.narayanganj.gov.bd
7527	\N	Basail	বাসাইল	basailup.tangail.gov.bd
7528	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.tangail.gov.bd
7529	\N	Habla	হাবলা	hablaup.tangail.gov.bd
7530	\N	Kashil	কাশিল	kashilup.tangail.gov.bd
7531	\N	Fulki	ফুলকি	fulkiup.tangail.gov.bd
7532	\N	Kauljani	কাউলজানী	kauljaniup.tangail.gov.bd
7533	\N	Arjuna	অর্জুনা	arjunaup.tangail.gov.bd
7534	\N	Gabshara	গাবসারা	gabsharaup.tangail.gov.bd
7535	\N	Falda	ফলদা	faldaup.tangail.gov.bd
7536	\N	Gobindashi	গোবিন্দাসী	gobindashiup.tangail.gov.bd
7537	\N	Aloa	আলোয়া	aloaup.tangail.gov.bd
7538	\N	Nikrail	নিকরাইল	nikrailup.tangail.gov.bd
7539	\N	Deuli	দেউলী	deuliup.tangail.gov.bd
7540	\N	Lauhati	লাউহাটি	lauhatiup.tangail.gov.bd
7541	\N	Patharail	পাথরাইল	patharailup.tangail.gov.bd
7542	\N	Delduar	দেলদুয়ার	delduarup.tangail.gov.bd
7543	\N	Fazilhati	ফাজিলহাটি	fazilhatiup.tangail.gov.bd
7544	\N	Elasin	এলাসিন	elasinup.tangail.gov.bd
7545	\N	Atia	আটিয়া	atiaup.tangail.gov.bd
7546	\N	Dubail	ডুবাইল	dubailup.tangail.gov.bd
7547	\N	Deulabari	দেউলাবাড়ী	deulabariup.tangail.gov.bd
7548	\N	Ghatail	ঘাটাইল	ghatailup.tangail.gov.bd
7549	\N	Jamuria	জামুরিয়া	jamuriaup.tangail.gov.bd
7550	\N	Lokerpara	লোকেরপাড়া	lokerparaup.tangail.gov.bd
7551	\N	Anehola	আনেহলা	aneholaup.tangail.gov.bd
7552	\N	Dighalkandia	দিঘলকান্দি	dighalkandiaup.tangail.gov.bd
7553	\N	Digar	দিগড়	digarup.tangail.gov.bd
7554	\N	Deopara	দেওপাড়া	deoparaup.tangail.gov.bd
7555	\N	Sandhanpur	সন্ধানপুর	sandhanpurup.tangail.gov.bd
7556	\N	Rasulpur	রসুলপুর	rasulpurup.tangail.gov.bd
7557	\N	Dhalapara	ধলাপাড়া	dhalaparaup.tangail.gov.bd
7558	\N	Hadera	হাদিরা	haderaup.tangail.gov.bd
7559	\N	Jhawail	ঝাওয়াইল	jhawailup.tangail.gov.bd
7560	\N	Nagdashimla	নগদাশিমলা	nagdashimlaup.tangail.gov.bd
7561	\N	Dhopakandi	ধোপাকান্দি	dhopakandiup.tangail.gov.bd
7562	\N	Alamnagor	আলমনগর	alamnagorup.tangail.gov.bd
7563	\N	Hemnagor	হেমনগর	hemnagorup.tangail.gov.bd
7564	\N	Mirzapur	মির্জাপুর	mirzapurup.tangail.gov.bd
7565	\N	Alokdia	আলোকদিয়া	alokdiaup.tangail.gov.bd
7566	\N	Aushnara	আউশনারা	aushnaraup.tangail.gov.bd
7567	\N	Aronkhola	অরণখোলা	aronkholaup.tangail.gov.bd
7568	\N	Sholakuri	শোলাকুড়ি	sholakuriup.tangail.gov.bd
7569	\N	Golabari	গোলাবাড়ী	golabariup.tangail.gov.bd
7570	\N	Mirjabari	মির্জাবাড়ী	mirjabariup.tangail.gov.bd
7571	\N	Mahera	মহেড়া	maheraup.tangail.gov.bd
7572	\N	Jamurki	জামুর্কী	jamurkiup.tangail.gov.bd
7573	\N	Fatepur	ফতেপুর	fatepurup.tangail.gov.bd
7574	\N	Banail	বানাইল	banailup.tangail.gov.bd
7575	\N	Anaitara	আনাইতারা	anaitaraup.tangail.gov.bd
7576	\N	Warshi	ওয়ার্শী	warshiup.tangail.gov.bd
7577	\N	Bhatram	ভাতগ্রাম	bhatramup.tangail.gov.bd
7578	\N	Bahuria	বহুরিয়া	bahuriaup.tangail.gov.bd
7579	\N	Gorai	গোড়াই	goraiup.tangail.gov.bd
7580	\N	Ajgana	আজগানা	ajganaup.tangail.gov.bd
7581	\N	Tarafpur	তরফপুর	tarafpurup.tangail.gov.bd
7582	\N	Bastail	বাঁশতৈল	bastailup.tangail.gov.bd
7583	\N	Baora	ভাওড়া	baoraup.tangail.gov.bd
7584	\N	Latifpur	লতিফপুর	latifpurup.tangail.gov.bd
7585	\N	Bharra	ভারড়া	bharraup.tangail.gov.bd
7586	\N	Sahabathpur	সহবতপুর	sahabathpurup.tangail.gov.bd
7587	\N	Goyhata	গয়হাটা	goyhataup.tangail.gov.bd
7588	\N	Solimabad	সলিমাবাদ	solimabadup.tangail.gov.bd
7589	\N	Nagorpur	নাগরপুর	nagorpurup.tangail.gov.bd
7590	\N	Mamudnagor	মামুদনগর	mamudnagorup.tangail.gov.bd
7591	\N	Mokna	মোকনা	moknaup.tangail.gov.bd
7592	\N	Pakutia	পাকুটিয়া	pakutiaup.tangail.gov.bd
7678	\N	Shukhia	সুখিয়া	shukhiaup.kishoreganj.gov.bd
7593	\N	Bekrah Atgram	বেকরা আটগ্রাম	bekrahatgramup.tangail.gov.bd
7594	\N	Dhuburia	ধুবড়িয়া	dhuburiaup.tangail.gov.bd
7595	\N	Bhadra	ভাদ্রা	bhadraup.tangail.gov.bd
7596	\N	Doptior	দপ্তিয়র	doptiorup.tangail.gov.bd
7597	\N	Kakrajan	কাকড়াজান	kakrajanup.tangail.gov.bd
7598	\N	Gajaria	গজারিয়া	gajariaup.tangail.gov.bd
7599	\N	Jaduppur	যাদবপুর	jaduppurup.tangail.gov.bd
7600	\N	Hatibandha	হাতীবান্ধা	hatibandhaup.tangail.gov.bd
7601	\N	Kalia	কালিয়া	kaliaup.tangail.gov.bd
7602	\N	Dariapur	দরিয়াপুর	dariapurup.tangail.gov.bd
7603	\N	Kalmegha	কালমেঘা	kalmeghaup.tangail.gov.bd
7604	\N	Baharatoil	বহেড়াতৈল	baharatoilup.tangail.gov.bd
7605	\N	Mogra	মগড়া	mograup.tangail.gov.bd
7606	\N	Gala	গালা	galaup.tangail.gov.bd
7607	\N	Gharinda	ঘারিন্দা	gharindaup.tangail.gov.bd
7608	\N	Karatia	করটিয়া	karatiaup.tangail.gov.bd
7609	\N	Silimpur	ছিলিমপুর	silimpurup.tangail.gov.bd
7610	\N	Porabari	পোড়াবাড়ী	porabariup.tangail.gov.bd
7611	\N	Dyenna	দাইন্যা	dyennaup.tangail.gov.bd
7612	\N	Baghil	বাঘিল	baghilup.tangail.gov.bd
7613	\N	Kakua	কাকুয়া	kakuaup.tangail.gov.bd
7614	\N	Hugra	হুগড়া	hugraup.tangail.gov.bd
7615	\N	Katuli	কাতুলী	katuliup.tangail.gov.bd
7616	\N	Mahamudnagar	মাহমুদনগর	mahamudnagarup.tangail.gov.bd
7617	\N	Durgapur	দুর্গাপুর	durgapurup.tangail.gov.bd
7618	\N	Birbashinda	বীরবাসিন্দা	birbashindaup.tangail.gov.bd
7619	\N	Narandia	নারান্দিয়া	narandiaup.tangail.gov.bd
7620	\N	Shahadebpur	সহদেবপুর	shahadebpurup.tangail.gov.bd
7621	\N	Kokdahara	কোকডহরা	kokdaharaup.tangail.gov.bd
7622	\N	Balla	বল্লা	ballaup.tangail.gov.bd
7623	\N	Salla	সল্লা	sallaup.tangail.gov.bd
7624	\N	Nagbari	নাগবাড়ী	nagbariup.tangail.gov.bd
7625	\N	Bangra	বাংড়া	bangraup.tangail.gov.bd
7626	\N	Paikora	পাইকড়া	paikoraup.tangail.gov.bd
7627	\N	Dashokia	দশকিয়া	dashokiaup.tangail.gov.bd
7628	\N	Parkhi	পারখী	parkhiup.tangail.gov.bd
7629	\N	Gohaliabari	গোহালিয়াবাড়ী	gohaliabariup.tangail.gov.bd
7630	\N	Dhopakhali	ধোপাখালী	dhopakhaliup.tangail.gov.bd
7631	\N	Paiska	পাইস্কা	paiskaup.tangail.gov.bd
7632	\N	Mushuddi	মুশুদ্দি	mushuddiup.tangail.gov.bd
7633	\N	Bolibodrow	বলিভদ্র	bolibodrowup.tangail.gov.bd
7634	\N	Birtara	বীরতারা	birtaraup.tangail.gov.bd
7635	\N	Baniajan	বানিয়াজান	baniajanup.tangail.gov.bd
7636	\N	Jadunathpur	যদুনাথপুর	jadunathpurup.tangail.gov.bd
7637	\N	Chawganga	চৌগাংগা	chawgangaup.kishoreganj.gov.bd
7638	\N	Joysiddi	জয়সিদ্ধি	joysiddiup.kishoreganj.gov.bd
7639	\N	Alonjori	এলংজুরী	alonjoriup.kishoreganj.gov.bd
7640	\N	Badla	বাদলা	badlaup.kishoreganj.gov.bd
7641	\N	Boribari	বড়িবাড়ি	boribariup.kishoreganj.gov.bd
7642	\N	Itna	ইটনা	itnaup.kishoreganj.gov.bd
7643	\N	Mriga	মৃগা	mrigaup.kishoreganj.gov.bd
7644	\N	Dhonpur	ধনপুর	dhonpurup.kishoreganj.gov.bd
7645	\N	Raytoti	রায়টুটি	raytotiup.kishoreganj.gov.bd
7646	\N	Banagram	বনগ্রাম	banagramup.kishoreganj.gov.bd
7647	\N	Shahasram Dhuldia	সহশ্রাম ধুলদিয়া	shahasramdhuldiaup.kishoreganj.gov.bd
7648	\N	Kargaon	কারগাঁও	kargaonup.kishoreganj.gov.bd
7649	\N	Chandpur	চান্দপুর	chandpurup.kishoreganj.gov.bd
7650	\N	Mumurdia	মুমুরদিয়া	mumurdiaup.kishoreganj.gov.bd
7651	\N	Acmita	আচমিতা	acmitaup.kishoreganj.gov.bd
7652	\N	Mosua	মসূয়া	mosuaup.kishoreganj.gov.bd
7653	\N	Lohajuree	লোহাজুরী	lohajureeup.kishoreganj.gov.bd
7654	\N	Jalalpur	জালালপুর	jalalpurup.kishoreganj.gov.bd
7655	\N	Sadekpur	সাদেকপুর	sadekpurup.kishoreganj.gov.bd
7656	\N	Aganagar	আগানগর	aganagarup.kishoreganj.gov.bd
7657	\N	Shimulkandi	শিমুলকান্দি	shimulkandiup.kishoreganj.gov.bd
7658	\N	Gajaria	গজারিয়া	gajariaup.kishoreganj.gov.bd
7659	\N	Kalika Prashad	কালিকা প্রসাদ	kalikaprashadup.kishoreganj.gov.bd
7660	\N	Sreenagar	শ্রীনগর	sreenagarup.kishoreganj.gov.bd
7661	\N	Shibpur	শিবপুর	shibpurup.kishoreganj.gov.bd
7662	\N	Taljanga	তালজাঙ্গা	taljangaup.kishoreganj.gov.bd
7663	\N	Rauti	রাউতি	rautiup.kishoreganj.gov.bd
7664	\N	Dhola	ধলা	dholaup.kishoreganj.gov.bd
7665	\N	Jawar	জাওয়ার	jawarup.kishoreganj.gov.bd
7666	\N	Damiha	দামিহা	damihaup.kishoreganj.gov.bd
7667	\N	Digdair	দিগদাইর	digdairup.kishoreganj.gov.bd
7668	\N	Tarail-Sachail	তাড়াইল-সাচাইল	tarailsachailup.kishoreganj.gov.bd
7669	\N	Jinari	জিনারী	jinariup.kishoreganj.gov.bd
7670	\N	Gobindapur	গোবিন্দপুর	gobindapurup.kishoreganj.gov.bd
7671	\N	Sidhla	সিদলা	sidhlaup.kishoreganj.gov.bd
7672	\N	Araibaria	আড়াইবাড়িয়া	araibariaup.kishoreganj.gov.bd
7673	\N	Sahedal	সাহেদল	sahedalup.kishoreganj.gov.bd
7674	\N	Pumdi	পুমদি	pumdiup.kishoreganj.gov.bd
7675	\N	Jangalia	জাঙ্গালিয়া	jangaliaup.kishoreganj.gov.bd
7676	\N	Hosendi	হোসেনদি	hosendiup.kishoreganj.gov.bd
7677	\N	Narandi	নারান্দি	narandiup.kishoreganj.gov.bd
7679	\N	Patuavabga	পটুয়াভাঙ্গা	patuavabgaup.kishoreganj.gov.bd
7680	\N	Chandipasha	চান্দিপাশা	chandipashaup.kishoreganj.gov.bd
7681	\N	Charfaradi	চারফারাদি	charfaradiup.kishoreganj.gov.bd
7682	\N	Burudia	বুড়ুদিয়া	burudiaup.kishoreganj.gov.bd
7683	\N	Egarasindur	ইজারাসিন্দুর	egarasindurup.kishoreganj.gov.bd
7684	\N	Pakundia	পাকন্দিয়া	pakundiaup.kishoreganj.gov.bd
7685	\N	Ramdi	রামদী	ramdiup.kishoreganj.gov.bd
7686	\N	Osmanpur	উছমানপুর	osmanpurup.kishoreganj.gov.bd
7687	\N	Chhaysuti	ছয়সূতী	chhaysutiup.kishoreganj.gov.bd
7688	\N	Salua	সালুয়া	saluaup.kishoreganj.gov.bd
7689	\N	Gobaria Abdullahpur	গোবরিয়া আব্দুল্লাহপুর	gobariaabdullahpurup.kishoreganj.gov.bd
7690	\N	Faridpur	ফরিদপুর	faridpurup.kishoreganj.gov.bd
7691	\N	Rashidabad	রশিদাবাদ	rashidabadup.kishoreganj.gov.bd
7692	\N	Latibabad	লতিবাবাদ	latibabadup.kishoreganj.gov.bd
7693	\N	Maizkhapan	মাইজখাপন	maizkhapanup.kishoreganj.gov.bd
7694	\N	Mohinanda	মহিনন্দ	mohinandaup.kishoreganj.gov.bd
7695	\N	Joshodal	যশোদল	joshodalup.kishoreganj.gov.bd
7696	\N	Bowlai	বৌলাই	bowlaiup.kishoreganj.gov.bd
7697	\N	Binnati	বিন্নাটি	binnatiup.kishoreganj.gov.bd
7698	\N	Maria	মারিয়া	mariaup.kishoreganj.gov.bd
7699	\N	Chowddoshata	চৌদ্দশত	chowddoshataup.kishoreganj.gov.bd
7700	\N	Karshakarial	কর্শাকড়িয়াইল	karshakarialup.kishoreganj.gov.bd
7701	\N	Danapatuli	দানাপাটুলী	danapatuliup.kishoreganj.gov.bd
7702	\N	Kadirjangal	কাদিরজঙ্গল	kadirjangalup.kishoreganj.gov.bd
7703	\N	Gujadia	গুজাদিয়া	gujadiaup.kishoreganj.gov.bd
7704	\N	Kiraton	কিরাটন	kiratonup.kishoreganj.gov.bd
7705	\N	Barogharia	বারঘড়িয়া	baroghariaup.kishoreganj.gov.bd
7706	\N	Niamatpur	নিয়ামতপুর	niamatpurup.kishoreganj.gov.bd
7707	\N	Dehunda	দেহুন্দা	dehundaup.kishoreganj.gov.bd
7708	\N	Sutarpara	সুতারপাড়া	sutarparaup.kishoreganj.gov.bd
7709	\N	Gunodhar	গুনধর	gunodharup.kishoreganj.gov.bd
7710	\N	Joyka	জয়কা	joykaup.kishoreganj.gov.bd
7711	\N	Zafrabad	জাফরাবাদ	zafrabadup.kishoreganj.gov.bd
7712	\N	Noabad	নোয়াবাদ	noabadup.kishoreganj.gov.bd
7713	\N	Kailag	কৈলাগ	kailagup.kishoreganj.gov.bd
7714	\N	Pirijpur	পিরিজপুর	pirijpurup.kishoreganj.gov.bd
7715	\N	Gazirchar	গাজীরচর	gazircharup.kishoreganj.gov.bd
7716	\N	Hilochia	হিলচিয়া	hilochiaup.kishoreganj.gov.bd
7717	\N	Maijchar9	মাইজচর	maijchar9up.kishoreganj.gov.bd
7718	\N	Homypur	হুমাইপর	homypurup.kishoreganj.gov.bd
7719	\N	Halimpur	হালিমপুর	halimpurup.kishoreganj.gov.bd
7720	\N	Sararchar	সরারচর	sararcharup.kishoreganj.gov.bd
7721	\N	Dilalpur	দিলালপুর	dilalpurup.kishoreganj.gov.bd
7722	\N	Dighirpar	দিঘীরপাড়	dighirparup.kishoreganj.gov.bd
7723	\N	Boliardi	বলিয়ার্দী	boliardiup.kishoreganj.gov.bd
7724	\N	Dewghar	দেওঘর	dewgharup.kishoreganj.gov.bd
7725	\N	Kastul	কাস্তুল	kastulup.kishoreganj.gov.bd
7726	\N	Austagram Sadar	অষ্টগ্রাম সদর	austagramsadarup.kishoreganj.gov.bd
7727	\N	Bangalpara	বাঙ্গালপাড়া	bangalparaup.kishoreganj.gov.bd
7728	\N	Kalma	কলমা	kalmaup.kishoreganj.gov.bd
7729	\N	Adampur	আদমপুর	adampurup.kishoreganj.gov.bd
7730	\N	Khyerpur-Abdullahpur	খয়েরপুর-আব্দুল্লাপুর	khyerpurabdullahpurup.kishoreganj.gov.bd
7731	\N	Purba Austagram	পূর্ব অষ্টগ্রাম	purbaaustagramup.kishoreganj.gov.bd
7732	\N	Gopdighi	গোপদিঘী	gopdighiup.kishoreganj.gov.bd
7733	\N	Mithamoin	মিঠামইন	mithamoinup.kishoreganj.gov.bd
7734	\N	Dhaki	ঢাকী	dhakiup.kishoreganj.gov.bd
7735	\N	Ghagra	ঘাগড়া	ghagraup.kishoreganj.gov.bd
7736	\N	Keoarjore	কেওয়ারজোর	keoarjoreup.kishoreganj.gov.bd
7737	\N	Katkhal	কাটখাল	katkhalup.kishoreganj.gov.bd
7738	\N	Bairati	বৈরাটি	bairatiup.kishoreganj.gov.bd
7739	\N	Chatirchar	ছাতিরচর	chatircharup.kishoreganj.gov.bd
7740	\N	Guroi	গুরই	guroiup.kishoreganj.gov.bd
7741	\N	Jaraitala	জারইতলা	jaraitalaup.kishoreganj.gov.bd
7742	\N	Nikli Sadar	নিকলী সদর	niklisadarup.kishoreganj.gov.bd
7743	\N	Karpasa	কারপাশা	karpasaup.kishoreganj.gov.bd
7744	\N	Dampara	দামপাড়া	damparaup.kishoreganj.gov.bd
7745	\N	Singpur	সিংপুর	singpurup.kishoreganj.gov.bd
7746	\N	Balla	বাল্লা	ballaup.manikganj.gov.bd
7747	\N	Gala	গালা	galaup.manikganj.gov.bd
7748	\N	Chala	চালা	chalaup.manikganj.gov.bd
7749	\N	Blara	বলড়া	blaraup.manikganj.gov.bd
7750	\N	Harukandi	হারুকান্দি	harukandiup.manikganj.gov.bd
7751	\N	Baira	বয়রা	bairaup.manikganj.gov.bd
7752	\N	Ramkrishnapur	রামকৃঞ্চপুর	ramkrishnapurup.manikganj.gov.bd
7753	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.manikganj.gov.bd
7754	\N	Kanchanpur	কাঞ্চনপুর	kanchanpurup.manikganj.gov.bd
7755	\N	Lacharagonj	লেছড়াগঞ্জ	lacharagonjup.manikganj.gov.bd
7756	\N	Sutalorie	সুতালড়ী	sutalorieup.manikganj.gov.bd
7757	\N	Dhulsura	ধূলশুড়া	dhulsuraup.manikganj.gov.bd
7758	\N	Azimnagar	আজিমনগর	azimnagarup.manikganj.gov.bd
7759	\N	Baried	বরাইদ	bariedup.manikganj.gov.bd
7760	\N	Dighulia	দিঘুলিয়া	dighuliaup.manikganj.gov.bd
7761	\N	Baliyati	বালিয়াটি	baliyatiup.manikganj.gov.bd
7762	\N	Dargram	দড়গ্রাম	dargramup.manikganj.gov.bd
7763	\N	Tilli	তিল্লী	tilliup.manikganj.gov.bd
7764	\N	Hargaj	হরগজ	hargajup.manikganj.gov.bd
7765	\N	Saturia	সাটুরিয়া	saturiaup.manikganj.gov.bd
7766	\N	Dhankora	ধানকোড়া	dhankoraup.manikganj.gov.bd
7767	\N	Fukurhati	ফুকুরহাটি	fukurhatiup.manikganj.gov.bd
7768	\N	Betila-Mitara	বেতিলা-মিতরা	betilamitaraup.manikganj.gov.bd
7769	\N	Jagir	জাগীর	jagirup.manikganj.gov.bd
7770	\N	Atigram	আটিগ্রাম	atigramup.manikganj.gov.bd
7771	\N	Dighi	দিঘী	dighiup.manikganj.gov.bd
7772	\N	Putile	পুটাইল	putileup.manikganj.gov.bd
7773	\N	Hatipara	হাটিপাড়া	hatiparaup.manikganj.gov.bd
7774	\N	Vararia	ভাড়ারিয়া	varariaup.manikganj.gov.bd
7775	\N	Nbogram	নবগ্রাম	nbogramup.manikganj.gov.bd
7776	\N	Garpara	গড়পাড়া	garparaup.manikganj.gov.bd
7777	\N	Krishnapur	কৃঞ্চপুর	krishnapurup.manikganj.gov.bd
7778	\N	Paila	পয়লা	pailaup.manikganj.gov.bd
7779	\N	Shingzuri	সিংজুড়ী	shingzuriup.manikganj.gov.bd
7780	\N	Baliyakhora	বালিয়াখোড়া	baliyakhoraup.manikganj.gov.bd
7781	\N	Gior	ঘিওর	giorup.manikganj.gov.bd
7782	\N	Bartia	বড়টিয়া	bartiaup.manikganj.gov.bd
7783	\N	Baniazuri	বানিয়াজুড়ী	baniazuriup.manikganj.gov.bd
7784	\N	Nalee	নালী	naleeup.manikganj.gov.bd
7785	\N	Teota	তেওতা	teotaup.manikganj.gov.bd
7786	\N	Utholi	উথলী	utholiup.manikganj.gov.bd
7787	\N	Shibaloy	শিবালয়	shibaloyup.manikganj.gov.bd
7788	\N	Ulayel	উলাইল	ulayelup.manikganj.gov.bd
7789	\N	Aruoa	আরুয়া	aruoaup.manikganj.gov.bd
7790	\N	Mohadebpur	মহাদেবপুর	mohadebpurup.manikganj.gov.bd
7791	\N	Shimulia	শিমুলিয়া	shimuliaup.manikganj.gov.bd
7792	\N	Charkataree	চরকাটারী	charkatareeup.manikganj.gov.bd
7793	\N	Bachamara	বাচামারা	bachamaraup.manikganj.gov.bd
7794	\N	Baghutia	বাঘুটিয়া	baghutiaup.manikganj.gov.bd
7795	\N	Zionpur	জিয়নপুর	zionpurup.manikganj.gov.bd
7796	\N	Khalshi	খলশী	khalshiup.manikganj.gov.bd
7797	\N	Chakmirpur	চকমিরপুর	chakmirpurup.manikganj.gov.bd
7798	\N	Klia	কলিয়া	kliaup.manikganj.gov.bd
7799	\N	Dhamswar	ধামশ্বর	dhamswarup.manikganj.gov.bd
7800	\N	Buyra	বায়রা	buyraup.manikganj.gov.bd
7801	\N	Talebpur	তালেবপুর	talebpurup.manikganj.gov.bd
7802	\N	Singiar	সিংগাইর	singiarup.manikganj.gov.bd
7803	\N	Baldhara	বলধারা	baldharaup.manikganj.gov.bd
7804	\N	Zamsha	জামশা	zamshaup.manikganj.gov.bd
7805	\N	Charigram	চারিগ্রাম	charigramup.manikganj.gov.bd
7806	\N	Shayesta	শায়েস্তা	shayestaup.manikganj.gov.bd
7807	\N	Joymonto	জয়মন্টপ	joymontopup.manikganj.gov.bd
7808	\N	Dhalla	ধল্লা	dhallaup.manikganj.gov.bd
7809	\N	Jamirta	জার্মিতা	jamirtaup.manikganj.gov.bd
7810	\N	Chandhar	চান্দহর	chandharup.manikganj.gov.bd
7811	\N	Savar	সাভার	savarup.dhaka.gov.bd
7812	\N	Birulia	বিরুলিয়া	birulia.dhaka.gov.bd
7813	\N	Dhamsona	ধামসোনা	dhamsonaup.dhaka.gov.bd
7814	\N	Shimulia	শিমুলিয়া	shimuliaup.dhaka.gov.bd
7815	\N	Ashulia	আশুলিয়া	ashuliaup.dhaka.gov.bd
7816	\N	Yearpur	ইয়ারপুর	yearpurup.dhaka.gov.bd
7817	\N	Vakurta	ভাকুর্তা	vakurtaup.dhaka.gov.bd
7818	\N	Pathalia	পাথালিয়া	pathaliaup.dhaka.gov.bd
7819	\N	Bongaon	বনগাঁও	bongaonup.dhaka.gov.bd
7820	\N	Kaundia	কাউন্দিয়া	kaundiaup.dhaka.gov.bd
7821	\N	Tetuljhora	তেঁতুলঝোড়া	tetuljhora.dhaka.gov.bd
7822	\N	Aminbazar	আমিনবাজার	aminbazar.dhaka.gov.bd
7823	\N	Chauhat	চৌহাট	chauhatup.dhaka.gov.bd
7824	\N	Amta	আমতা	amtaup.dhaka.gov.bd
7825	\N	Balia	বালিয়া	baliaup.dhaka.gov.bd
7826	\N	Jadabpur	যাদবপুর	jadabpurup.dhaka.gov.bd
7827	\N	Baisakanda	বাইশাকান্দা	baisakandaup.dhaka.gov.bd
7828	\N	Kushura	কুশুরা	kushuraup.dhaka.gov.bd
7829	\N	Gangutia	গাংগুটিয়া	gangutiaup.dhaka.gov.bd
7830	\N	Sanora	সানোড়া	sanoraup.dhaka.gov.bd
7831	\N	Sutipara	সূতিপাড়া	sutiparaup.dhaka.gov.bd
7832	\N	Sombhag	সোমভাগ	sombhagup.dhaka.gov.bd
7833	\N	Vararia	ভাড়ারিয়া	varariaup.dhaka.gov.bd
7834	\N	Dhamrai	ধামরাই	dhamraiup.dhaka.gov.bd
7835	\N	Kulla	কুল্লা	kullaup.dhaka.gov.bd
7836	\N	Rowail	রোয়াইল	rowailup.dhaka.gov.bd
7837	\N	Suapur	সুয়াপুর	suapurup.dhaka.gov.bd
7838	\N	Nannar	নান্নার	nannarup.dhaka.gov.bd
7839	\N	Hazratpur	হযরতপুর	hazratpurup.dhaka.gov.bd
7840	\N	Kalatia	কলাতিয়া	kalatiaup.dhaka.gov.bd
7841	\N	Taranagar	তারানগর	taranagarup.dhaka.gov.bd
7842	\N	Sakta	শাক্তা	saktaup.dhaka.gov.bd
7843	\N	Ruhitpur	রোহিতপুর	ruhitpurup.dhaka.gov.bd
7844	\N	Basta	বাস্তা	bastaup.dhaka.gov.bd
7845	\N	Kalindi	কালিন্দি	kalindiup.dhaka.gov.bd
7846	\N	Zinzira	জিনজিরা	zinziraup.dhaka.gov.bd
7847	\N	Suvadda	শুভাঢ্যা	suvaddaup.dhaka.gov.bd
7848	\N	Taghoria	তেঘরিয়া	taghoriaup.dhaka.gov.bd
7849	\N	Konda	কোন্ডা	kondaup.dhaka.gov.bd
7850	\N	Aganagar	আগানগর	aganagarup.dhaka.gov.bd
7851	\N	Shikaripara	শিকারীপাড়া	shikariparaup.dhaka.gov.bd
7852	\N	Joykrishnapur	জয়কৃষ্ণপুর	joykrishnapurup.dhaka.gov.bd
7853	\N	Baruakhali	বারুয়াখালী	baruakhaliup.dhaka.gov.bd
7854	\N	Nayansree	নয়নশ্রী	nayansreeup.dhaka.gov.bd
7855	\N	Sholla	শোল্লা	shollaup.dhaka.gov.bd
7856	\N	Jantrail	যন্ত্রাইল	jantrailup.dhaka.gov.bd
7857	\N	Bandura	বান্দুরা	banduraup.dhaka.gov.bd
7858	\N	Kalakopa	কলাকোপা	kalakopaup.dhaka.gov.bd
7859	\N	Bakshanagar	বক্সনগর	bakshanagarup.dhaka.gov.bd
7860	\N	Barrah	বাহ্রা	barrahup.dhaka.gov.bd
7861	\N	Kailail	কৈলাইল	kailailup.dhaka.gov.bd
7862	\N	Agla	আগলা	aglaup.dhaka.gov.bd
7863	\N	Galimpur	গালিমপুর	galimpurup.dhaka.gov.bd
7864	\N	Churain	চুড়াইন	churainup.dhaka.gov.bd
7865	\N	Nayabari	নয়াবাড়ী	nayabariup.dhaka.gov.bd
7866	\N	Kusumhathi	কুসুমহাটি	kusumhathiup.dhaka.gov.bd
7867	\N	Raipara	রাইপাড়া	raiparaup.dhaka.gov.bd
7868	\N	Sutarpara	সুতারপাড়া	sutarparaup.dhaka.gov.bd
7869	\N	Narisha	নারিশা	narishaup.dhaka.gov.bd
7870	\N	Muksudpur	মুকসুদপুর	muksudpurup.dhaka.gov.bd
7871	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.dhaka.gov.bd
7872	\N	Bilaspur	বিলাসপুর	bilaspurup.dhaka.gov.bd
7873	\N	Rampal	রামপাল	rampalup.munshiganj.gov.bd
7874	\N	Panchashar	পঞ্চসার	panchasharup.munshiganj.gov.bd
7875	\N	Bajrajogini	বজ্রযোগিনী	bajrajoginiup.munshiganj.gov.bd
7876	\N	Mohakali	মহাকালী	mohakaliup.munshiganj.gov.bd
7877	\N	Charkewar	চরকেওয়ার	charkewarup.munshiganj.gov.bd
7878	\N	Mollakandi	মোল্লাকান্দি	mollakandiup.munshiganj.gov.bd
7879	\N	Adhara	আধারা	adharaup.munshiganj.gov.bd
7880	\N	Shiloy	শিলই	shiloyup.munshiganj.gov.bd
7881	\N	Banglabazar	বাংলাবাজার	banglabazarup.munshiganj.gov.bd
7882	\N	Baraikhali	বাড়েখাল	baraikhaliup.munshiganj.gov.bd
7883	\N	Hashara	হাসাড়া	hasharaup.munshiganj.gov.bd
7884	\N	Birtara	বাড়তারা	birtaraup.munshiganj.gov.bd
7885	\N	Shologhor	ষোলঘর	shologhorup.munshiganj.gov.bd
7886	\N	Sreenagar	শ্রীনগর	sreenagarup.munshiganj.gov.bd
7887	\N	Patabhog	পাঢাভোগ	patabhogup.munshiganj.gov.bd
7888	\N	Shamshiddi	শ্যামসিদ্দি	shamshiddiup.munshiganj.gov.bd
7889	\N	Kolapara	কুলাপাড়া	kolaparaup.munshiganj.gov.bd
7890	\N	Vaggakol	ভাগ্যকুল	vaggakolup.munshiganj.gov.bd
7891	\N	Bagra	বাঘড়া	bagraup.munshiganj.gov.bd
7892	\N	Rarikhal	রাঢ়ীখাল	rarikhalup.munshiganj.gov.bd
7893	\N	Kukutia	কুকুটিয়া	kukutiaup.munshiganj.gov.bd
7894	\N	Atpara	আটপাড়া	atparaup.munshiganj.gov.bd
7895	\N	Tantor	তন্তর	tantorup.munshiganj.gov.bd
7896	\N	Chitracoat	চিত্রকোট	chitracoatup.munshiganj.gov.bd
7897	\N	Sekhornagar	শেখরনগার	sekhornagarup.munshiganj.gov.bd
7898	\N	Rajanagar	রাজানগর	rajanagarup.munshiganj.gov.bd
7899	\N	Keyain	কেয়াইন	keyainup.munshiganj.gov.bd
7900	\N	Basail	বাসাইল	basailup.munshiganj.gov.bd
7901	\N	Baluchar	বালুচর	balucharup.munshiganj.gov.bd
7902	\N	Latabdi	লতাব্দী	latabdiup.munshiganj.gov.bd
7903	\N	Rasunia	রশুনিয়া	rasuniaup.munshiganj.gov.bd
7904	\N	Ichhapura	ইছাপুরা	ichhapuraup.munshiganj.gov.bd
7905	\N	Bairagadi	বয়রাগাদি	bairagadiup.munshiganj.gov.bd
7906	\N	Malkhanagar	মালখানগর	malkhanagarup.munshiganj.gov.bd
7907	\N	Madhypara	মধ্যপাড়া	madhyparaup.munshiganj.gov.bd
7908	\N	Kola	কোলা	kolaup.munshiganj.gov.bd
7909	\N	Joyinshar	জৈনসার	joyinsharup.munshiganj.gov.bd
7910	\N	Medinimandal	মেদিনীমন্ডল	medinimandalup.munshiganj.gov.bd
7911	\N	Kumarbhog	কুমারভোগ	kumarbhogup.munshiganj.gov.bd
7912	\N	Haldia	হলদিয়া	haldiaup.munshiganj.gov.bd
7913	\N	Kanaksar	কনকসার	kanaksarup.munshiganj.gov.bd
7914	\N	Lohajang-Teotia	লৌহজং-তেওটিয়া	lohajangteotiaup.munshiganj.gov.bd
7915	\N	Bejgaon	বেজগাঁও	bejgaonup.munshiganj.gov.bd
7916	\N	Baultoli	বৌলতলী	baultoliup.munshiganj.gov.bd
7917	\N	Khidirpara	খিদিরপাড়া	khidirparaup.munshiganj.gov.bd
7918	\N	Gaodia	গাওদিয়া	gaodiaup.munshiganj.gov.bd
7919	\N	Kalma	কলমা	kalmaup.munshiganj.gov.bd
7920	\N	Gajaria	গজারিয়া	gajariaup.munshiganj.gov.bd
7921	\N	Baushia	বাউশিয়া	baushiaup.munshiganj.gov.bd
7922	\N	Vaberchar	ভবেরচর	vabercharup.munshiganj.gov.bd
7923	\N	Baluakandi	বালুয়াকান্দী	baluakandiup.munshiganj.gov.bd
7924	\N	Tengarchar	টেংগারচর	tengarcharup.munshiganj.gov.bd
7925	\N	Hosendee	হোসেন্দী	hosendeeup.munshiganj.gov.bd
7926	\N	Guagachia	গুয়াগাছিয়া	guagachiaup.munshiganj.gov.bd
7927	\N	Imampur	ইমামপুর	imampurup.munshiganj.gov.bd
7928	\N	Betka	বেতকা	betkaup.munshiganj.gov.bd
7929	\N	Abdullapur	আব্দুল্লাপুর	abdullapurup.munshiganj.gov.bd
7930	\N	Sonarong Tongibari	সোনারং টংগীবাড়ী	sonarongtongibariup.munshiganj.gov.bd
7931	\N	Autshahi	আউটশাহী	autshahiup.munshiganj.gov.bd
7932	\N	Arial Baligaon	আড়িয়ল বালিগাঁও	arialbaligaonup.munshiganj.gov.bd
7933	\N	Dhipur	ধীপুর	dhipurup.munshiganj.gov.bd
7934	\N	Kathadia Shimolia	কাঠাদিয়া শিমুলিয়া	kathadiashimoliaup.munshiganj.gov.bd
7935	\N	Joslong	যশলং	joslongup.munshiganj.gov.bd
7936	\N	Panchgaon	পাঁচগাও	panchgaonup.munshiganj.gov.bd
7937	\N	Kamarkhara	কামারখাড়া	kamarkharaup.munshiganj.gov.bd
7938	\N	Hasailbanari	হাসাইল বানারী	hasailbanariup.munshiganj.gov.bd
7939	\N	Dighirpar	দিঘীরপাড়	dighirparup.munshiganj.gov.bd
7940	\N	Mijanpur	মিজানপুর	mijanpurup.rajbari.gov.bd
7941	\N	Borat	বরাট	boratup.rajbari.gov.bd
7942	\N	Chandoni	চন্দনী	chandoniup.rajbari.gov.bd
7943	\N	Khangonj	খানগঞ্জ	khangonjup.rajbari.gov.bd
7944	\N	Banibaha	বানীবহ	banibahaup.rajbari.gov.bd
7945	\N	Dadshee	দাদশী	dadsheeup.rajbari.gov.bd
7946	\N	Mulghar	মুলঘর	mulgharup.rajbari.gov.bd
7947	\N	Basantapur	বসন্তপুর	basantapurup.rajbari.gov.bd
7948	\N	Khankhanapur	খানখানাপুর	khankhanapurup.rajbari.gov.bd
7949	\N	Alipur	আলীপুর	alipurup.rajbari.gov.bd
7950	\N	Ramkantapur	রামকান্তপুর	ramkantapurup.rajbari.gov.bd
7951	\N	Shahidwahabpur	শহীদওহাবপুর	shahidwahabpurup.rajbari.gov.bd
7952	\N	Panchuria	পাঁচুরিয়া	panchuriaup.rajbari.gov.bd
7953	\N	Sultanpur	সুলতানপুর	sultanpurup.rajbari.gov.bd
7954	\N	Doulatdia	দৌলতদিয়া	doulatdiaup.rajbari.gov.bd
7955	\N	Debugram	দেবগ্রাম	debugramup.rajbari.gov.bd
7956	\N	Uzancar	উজানচর	uzancarup.rajbari.gov.bd
7957	\N	Chotovakla	ছোটভাকলা	chotovaklaup.rajbari.gov.bd
7958	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup.rajbari.gov.bd
7959	\N	Habashpur	হাবাসপুর	habashpurup.rajbari.gov.bd
7960	\N	Jashai	যশাই	jashaiup.rajbari.gov.bd
7961	\N	Babupara	বাবুপাড়া	babuparaup.rajbari.gov.bd
7962	\N	Mourat	মৌরাট	mouratup.rajbari.gov.bd
7963	\N	Patta	পাট্টা	pattaup.rajbari.gov.bd
7964	\N	Sarisha	সরিষা	sarishaup.rajbari.gov.bd
7965	\N	Kalimahar	কলিমহর	kalimaharup.rajbari.gov.bd
7966	\N	Kasbamajhail	কসবামাজাইল	kasbamajhailup.rajbari.gov.bd
7967	\N	Machhpara	মাছপাড়া	machhparaup.rajbari.gov.bd
7968	\N	Islampur	ইসলামপুর	islampurup.rajbari.gov.bd
7969	\N	Baharpur	বহরপুর	baharpurup.rajbari.gov.bd
7970	\N	Nawabpur	নবাবপুর	nawabpurup.rajbari.gov.bd
7971	\N	Narua	নারুয়া	naruaup.rajbari.gov.bd
7972	\N	Baliakandi	বালিয়াকান্দি	baliakandiup.rajbari.gov.bd
7973	\N	Janjal	জঙ্গল	janjalup.rajbari.gov.bd
7974	\N	Jamalpur	জামালপুর	jamalpurup.rajbari.gov.bd
7975	\N	Kalukhali	কালুখালী	kalukhaliup.rajbari.gov.bd
7976	\N	Ratandia	রতনদিয়া	ratandiaup.rajbari.gov.bd
7977	\N	Kalikapur	কালিকাপুর	kalikapurup.rajbari.gov.bd
7978	\N	Boalia	বোয়ালিয়া	boaliaup.rajbari.gov.bd
7979	\N	Majbari	মাজবাড়ী	majbariup.rajbari.gov.bd
7980	\N	Madapur	মদাপুর	madapurup.rajbari.gov.bd
7981	\N	Shawrail	সাওরাইল	shawrailup.rajbari.gov.bd
7982	\N	Mrigi	মৃগী	mrigiup.rajbari.gov.bd
7983	\N	Sirkhara	শিড়খাড়া	sirkharaup.madaripur.gov.bd
7984	\N	Bahadurpur	বাহাদুরপুর	bahadurpurup.madaripur.gov.bd
7985	\N	Kunia	কুনিয়া	kuniaup.madaripur.gov.bd
7986	\N	Peyarpur	পেয়ারপুর	peyarpurup.madaripur.gov.bd
7987	\N	Kandua	কেন্দুয়া	kanduaup.madaripur.gov.bd
7988	\N	Mastofapur	মস্তফাপুর	mastofapurup.madaripur.gov.bd
7989	\N	Dudkhali	দুধখালী	dudkhaliup.madaripur.gov.bd
7990	\N	Kalikapur	কালিকাপুর	kalikapurup.madaripur.gov.bd
7991	\N	Chilarchar	ছিলারচর	chilarcharup.madaripur.gov.bd
7992	\N	Panchkhola	পাঁচখোলা	panchkholaup.madaripur.gov.bd
7993	\N	Ghatmajhi	ঘটমাঝি	ghatmajhiup.madaripur.gov.bd
7994	\N	Jhaoudi	ঝাউদী	jhaoudiup.madaripur.gov.bd
7995	\N	Khoajpur	খোয়াজপুর	khoajpurup.madaripur.gov.bd
7996	\N	Rasti	রাস্তি	rastiup.madaripur.gov.bd
7997	\N	Dhurail	ধুরাইল	dhurailup.madaripur.gov.bd
7998	\N	Shibchar	শিবচর	shibcharup.madaripur.gov.bd
7999	\N	Ditiyakhando	দ্বিতীয়খন্ড	ditiyakhandoup.madaripur.gov.bd
8000	\N	Nilokhe	নিলখি	nilokheup.madaripur.gov.bd
8001	\N	Bandarkhola	বন্দরখোলা	bandarkholaup.madaripur.gov.bd
8002	\N	Charjanazat	চরজানাজাত	charjanazatup.madaripur.gov.bd
8003	\N	Madbarerchar	মাদবরেরচর	madbarercharup.madaripur.gov.bd
8004	\N	Panchar	পাঁচচর	pancharup.madaripur.gov.bd
8005	\N	Sannasirchar	সন্যাসিরচর	sannasircharup.madaripur.gov.bd
8006	\N	Kathalbari	কাঁঠালবাড়ী	kathalbariup.madaripur.gov.bd
8007	\N	Kutubpur	কুতুবপুর	kutubpurup.madaripur.gov.bd
8008	\N	Kadirpur	কাদিরপুর	kadirpurup.madaripur.gov.bd
8009	\N	Vhandarikandi	ভান্ডারীকান্দি	vhandarikandiup.madaripur.gov.bd
8010	\N	Bahertala South	বহেরাতলা দক্ষিণ	bahertalasouthup.madaripur.gov.bd
8011	\N	Baheratala North	বহেরাতলা উত্তর	baheratalanorthup.madaripur.gov.bd
8012	\N	Baskandi	বাঁশকান্দি	baskandiup.madaripur.gov.bd
8013	\N	Umedpur	উমেদপুর	umedpurup.madaripur.gov.bd
8014	\N	Vhadrasion	ভদ্রাসন	vhadrasionup.madaripur.gov.bd
8015	\N	Shiruail	শিরুয়াইল	shiruailup.madaripur.gov.bd
8016	\N	Dattapara	দত্তপাড়া	dattaparaup.madaripur.gov.bd
8017	\N	Alinagar	আলীনগর	alinagarup.madaripur.gov.bd
8018	\N	Baligram	বালীগ্রাম	baligramup.madaripur.gov.bd
8019	\N	Basgari	বাঁশগাড়ী	basgariup.madaripur.gov.bd
8020	\N	Chardoulatkhan	চরদৌলতখান	chardoulatkhanup.madaripur.gov.bd
8021	\N	Dashar	ডাসার	dasharup.madaripur.gov.bd
8022	\N	Enayetnagor	এনায়েতনগর	enayetnagorup.madaripur.gov.bd
8023	\N	Gopalpur	গোপালপুর	gopalpurup.madaripur.gov.bd
8024	\N	Koyaria	কয়ারিয়া	koyariaup.madaripur.gov.bd
8025	\N	Kazibakai	কাজীবাকাই	kazibakaiup.madaripur.gov.bd
8026	\N	Laxmipur	লক্ষীপুর	laxmipurup.madaripur.gov.bd
8027	\N	Nabogram	নবগ্রাম	nabogramup.madaripur.gov.bd
8028	\N	Ramjanpur	রমজানপুর	ramjanpurup.madaripur.gov.bd
8029	\N	Shahebrampur	সাহেবরামপুর	shahebrampurup.madaripur.gov.bd
8030	\N	Shikarmongol	শিকারমঙ্গল	shikarmongolup.madaripur.gov.bd
8031	\N	Haridasdi-Mahendrodi	হরিদাসদী-মহেন্দ্রদী	haridasdi-mahendrodiup.madaripur.gov.bd
8032	\N	Kadambari	কদমবাড়ী	kadambariup.madaripur.gov.bd
8033	\N	Bajitpur	বাজিতপুর	bajitpurup.madaripur.gov.bd
8034	\N	Amgram	আমগ্রাম	amgramup.madaripur.gov.bd
8035	\N	Rajoir	রাজৈর	rajoirup.madaripur.gov.bd
8036	\N	Khaliya	খালিয়া	khaliyaup.madaripur.gov.bd
8037	\N	Ishibpur	ইশিবপুর	ishibpurup.madaripur.gov.bd
8038	\N	Badarpasa	বদরপাশা	badarpasaup.madaripur.gov.bd
8039	\N	Kabirajpur	কবিরাজপুর	kabirajpurup.madaripur.gov.bd
8040	\N	Hosenpur	হোসেনপুর	hosenpurup.madaripur.gov.bd
8041	\N	Paikpara	পাইকপাড়া	paikparaup.madaripur.gov.bd
8042	\N	Jalalabad	জালালাবাদ	jalalabadup.gopalganj.gov.bd
8043	\N	Shuktail	শুকতাইল	shuktailup.gopalganj.gov.bd
8044	\N	Chandradighalia	চন্দ্রদিঘলিয়া	chandradighaliaup.gopalganj.gov.bd
8045	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.gopalganj.gov.bd
8046	\N	Paikkandi	পাইককান্দি	paikkandiup.gopalganj.gov.bd
8047	\N	Urfi	উরফি	urfiup.gopalganj.gov.bd
8048	\N	Lotifpur	লতিফপুর	lotifpurup.gopalganj.gov.bd
8049	\N	Satpar	সাতপাড়	satparup.gopalganj.gov.bd
8050	\N	Sahapur	সাহাপুর	sahapurup.gopalganj.gov.bd
8051	\N	Horidaspur	হরিদাসপুর	horidaspurup.gopalganj.gov.bd
8052	\N	Ulpur	উলপুর	ulpurup.gopalganj.gov.bd
8053	\N	Nizra	নিজড়া	nizraup.gopalganj.gov.bd
8054	\N	Karpara	করপাড়া	karparaup.gopalganj.gov.bd
8055	\N	Durgapur	দুর্গাপুর	durgapurup.gopalganj.gov.bd
8056	\N	Kajulia	কাজুলিয়া	kajuliaup.gopalganj.gov.bd
8057	\N	Majhigati	মাঝিগাতী	majhigatiup.gopalganj.gov.bd
8058	\N	Roghunathpur	রঘুনাথপুর	roghunathpurup.gopalganj.gov.bd
8059	\N	Gobra	গোবরা	gobraup.gopalganj.gov.bd
8060	\N	Borashi	বোড়াশী	borashiup.gopalganj.gov.bd
8061	\N	Kati	কাঠি	katiup.gopalganj.gov.bd
8062	\N	Boultali	বৌলতলী	boultaliup.gopalganj.gov.bd
8063	\N	Kashiani	কাশিয়ানী	kashianiup.gopalganj.gov.bd
8064	\N	Hatiara	হাতিয়াড়া	hatiaraup.gopalganj.gov.bd
8065	\N	Fukura	ফুকরা	fukuraup.gopalganj.gov.bd
8066	\N	Rajpat	রাজপাট	rajpatup.gopalganj.gov.bd
8067	\N	Bethuri	বেথুড়ী	bethuriup.gopalganj.gov.bd
8068	\N	Nijamkandi	নিজামকান্দি	nijamkandiup.gopalganj.gov.bd
8069	\N	Sajail	সাজাইল	sajailup.gopalganj.gov.bd
8070	\N	Mamudpur	মাহমুদপুর	mamudpurup.gopalganj.gov.bd
8071	\N	Maheshpur	মহেশপুর	maheshpurup.gopalganj.gov.bd
8072	\N	Orakandia	ওড়াকান্দি	orakandiaup.gopalganj.gov.bd
8073	\N	Parulia	পারুলিয়া	paruliaup.gopalganj.gov.bd
8074	\N	Ratail	রাতইল	ratailup.gopalganj.gov.bd
8075	\N	Puisur	পুইশুর	puisurup.gopalganj.gov.bd
8076	\N	Singa	সিংগা	singaup.gopalganj.gov.bd
8077	\N	Kushli	কুশলী	kushliup.gopalganj.gov.bd
8078	\N	Gopalpur	গোপালপুর	gopalpurup.gopalganj.gov.bd
8079	\N	Patgati	পাটগাতী	patgatiup.gopalganj.gov.bd
8080	\N	Borni	বর্ণি	borniup.gopalganj.gov.bd
8081	\N	Dumaria	ডুমরিয়া	dumariaup.gopalganj.gov.bd
8082	\N	Sadullapur	সাদুল্লাপুর	sadullapurup.gopalganj.gov.bd
8083	\N	Ramshil	রামশীল	ramshilup.gopalganj.gov.bd
8084	\N	Bandhabari	বান্ধাবাড়ী	bandhabariup.gopalganj.gov.bd
8085	\N	Kolabari	কলাবাড়ী	kolabariup.gopalganj.gov.bd
8086	\N	Kushla	কুশলা	kushlaup.gopalganj.gov.bd
8087	\N	Amtoli	আমতলী	amtoliup.gopalganj.gov.bd
8088	\N	Pinjuri	পিঞ্জুরী	pinjuriup.gopalganj.gov.bd
8089	\N	Ghaghor	ঘাঘর	ghaghorup.gopalganj.gov.bd
8090	\N	Radhaganj	রাধাগঞ্জ	radhaganjup.gopalganj.gov.bd
8091	\N	Hiron	হিরণ	hironup.gopalganj.gov.bd
8092	\N	Kandi	কান্দি	kandiup.gopalganj.gov.bd
8093	\N	Ujani	উজানী	ujaniup.gopalganj.gov.bd
8094	\N	Nanikhir	ননীক্ষীর	nanikhirup.gopalganj.gov.bd
8095	\N	Dignagar	দিগনগর	dignagarup.gopalganj.gov.bd
8096	\N	Poshargati	পশারগাতি	poshargatiup.gopalganj.gov.bd
8097	\N	Gobindopur	গোবিন্দপুর	gobindopurup.gopalganj.gov.bd
8098	\N	Khandarpara	খান্দারপাড়া	khandarparaup.gopalganj.gov.bd
8099	\N	Bohugram	বহুগ্রাম	bohugramup.gopalganj.gov.bd
8100	\N	Banshbaria	বাশঁবাড়িয়া	banshbariaup.gopalganj.gov.bd
8101	\N	Vabrashur	ভাবড়াশুর	vabrashurup.gopalganj.gov.bd
8102	\N	Moharajpur	মহারাজপুর	moharajpurup.gopalganj.gov.bd
8103	\N	Batikamari	বাটিকামারী	batikamariup.gopalganj.gov.bd
8104	\N	Jalirpar	জলিরপাড়	jalirparup.gopalganj.gov.bd
8105	\N	Raghdi	রাঘদী	raghdiup.gopalganj.gov.bd
8106	\N	Gohala	গোহালা	gohalaup.gopalganj.gov.bd
8107	\N	Mochna	মোচনা	mochnaup.gopalganj.gov.bd
8108	\N	Kashalia	কাশালিয়া	kashaliaup.gopalganj.gov.bd
8109	\N	Ishangopalpur	ঈশানগোপালপুর	ishangopalpurup.faridpur.gov.bd
8110	\N	Charmadbdia	চরমাধবদিয়া	charmadbdiaup.faridpur.gov.bd
8111	\N	Aliabad	আলিয়াবাদ	aliabadup.faridpur.gov.bd
8112	\N	Uttarchannel	নর্থচ্যানেল	uttarchannelup.faridpur.gov.bd
8113	\N	Decreerchar	ডিক্রিরচর	decreercharup.faridpur.gov.bd
8114	\N	Majchar	মাচ্চর	majcharup.faridpur.gov.bd
8115	\N	Krishnanagar	কৃষ্ণনগর	krishnanagarup.faridpur.gov.bd
8116	\N	Ambikapur	অম্বিকাপুর	ambikapurup.faridpur.gov.bd
8117	\N	Kanaipur	কানাইপুর	kanaipurup.faridpur.gov.bd
8118	\N	Kaijuri	কৈজুরী	kaijuriup.faridpur.gov.bd
8119	\N	Greda	গেরদা	gredaup.faridpur.gov.bd
8120	\N	Buraich	বুড়াইচ	buraichup.faridpur.gov.bd
8121	\N	Alfadanga	আলফাডাঙ্গা	alfadangaup.faridpur.gov.bd
8122	\N	Tagarbanda	টগরবন্দ	tagarbandaup.faridpur.gov.bd
8123	\N	Bana	বানা	banaup.faridpur.gov.bd
8124	\N	Panchuria	পাঁচুড়িয়া	panchuriaup.faridpur.gov.bd
8125	\N	Gopalpur	গোপালপুর	gopalpurup.faridpur.gov.bd
8126	\N	Boalmari	বোয়ালমারী	boalmariup.faridpur.gov.bd
8127	\N	Dadpur	দাদপুর	dadpurup.faridpur.gov.bd
8128	\N	Chatul	চতুল	chatulup.faridpur.gov.bd
8129	\N	Ghoshpur	ঘোষপুর	ghoshpurup.faridpur.gov.bd
8130	\N	Gunbaha	গুনবহা	gunbahaup.faridpur.gov.bd
8131	\N	Chandpur	চাঁদপুর	chandpurup.faridpur.gov.bd
8132	\N	Parameshwardi	পরমেশ্বরদী	parameshwardiup.faridpur.gov.bd
8133	\N	Satair	সাতৈর	satairup.faridpur.gov.bd
8134	\N	Rupapat	রূপাপাত	rupapatup.faridpur.gov.bd
8135	\N	Shekhar	শেখর	shekharup.faridpur.gov.bd
8136	\N	Moyna	ময়না	moynaup.faridpur.gov.bd
8137	\N	Char Bisnopur	চর বিষ্ণুপুর	charbisnopurup.faridpur.gov.bd
8138	\N	Akoter Char	আকোটের চর	akotercharup.faridpur.gov.bd
8139	\N	Char Nasirpur	চর নাসিরপুর	charnasirpurup.faridpur.gov.bd
8140	\N	Narikel Bariya	নারিকেল বাড়িয়া	narikelbariyaup.faridpur.gov.bd
8141	\N	Bhashanchar	ভাষানচর	bhashancharup.faridpur.gov.bd
8142	\N	Krishnapur	কৃষ্ণপুর	krishnapurup.faridpur.gov.bd
8143	\N	Sadarpur	সদরপুর	sadarpurup.faridpur.gov.bd
8144	\N	Char Manair	চর মানাইর	charmanairup.faridpur.gov.bd
8145	\N	Dhaukhali	ঢেউখালী	dhaukhaliup.faridpur.gov.bd
8146	\N	Charjashordi	চরযশোরদী	charjashordiup.faridpur.gov.bd
8147	\N	Purapara	পুরাপাড়া	puraparaup.faridpur.gov.bd
8148	\N	Laskardia	লস্করদিয়া	laskardiaup.faridpur.gov.bd
8149	\N	Ramnagar	রামনগর	ramnagarup.faridpur.gov.bd
8150	\N	Kaichail	কাইচাইল	kaichailup.faridpur.gov.bd
8151	\N	Talma	তালমা	talmaup.faridpur.gov.bd
8152	\N	Fulsuti	ফুলসুতি	fulsutiup.faridpur.gov.bd
8153	\N	Dangi	ডাঙ্গী	dangiup.faridpur.gov.bd
8154	\N	Kodalia Shohidnagar	কোদালিয়া শহিদনগর	kodaliashohidnagarup.faridpur.gov.bd
8155	\N	Gharua	ঘারুয়া	gharuaup.faridpur.gov.bd
8156	\N	Nurullagonj	নুরুল্যাগঞ্জ	nurullagonjup.faridpur.gov.bd
8157	\N	Manikdha	মানিকদহ	manikdhaup.faridpur.gov.bd
8158	\N	Kawlibera	কাউলিবেড়া	kawliberaup.faridpur.gov.bd
8159	\N	Nasirabad	নাছিরাবাদ	nasirabadup.faridpur.gov.bd
8160	\N	Tujerpur	তুজারপুর	tujerpurup.faridpur.gov.bd
8161	\N	Algi	আলগী	algiup.faridpur.gov.bd
8162	\N	Chumurdi	চুমুরদী	chumurdiup.faridpur.gov.bd
8163	\N	Kalamridha	কালামৃধা	kalamridhaup.faridpur.gov.bd
8164	\N	Azimnagor	আজিমনগর	azimnagorup.faridpur.gov.bd
8165	\N	Chandra	চান্দ্রা	chandraup.faridpur.gov.bd
8166	\N	Hamirdi	হামিরদী	hamirdiup.faridpur.gov.bd
8167	\N	Gazirtek	গাজীরটেক	gazirtekup.faridpur.gov.bd
8168	\N	Char Bhadrasan	চর ভদ্রাসন	charbhadrasanup.faridpur.gov.bd
8169	\N	Char Harirampur	চর হরিরামপুর	charharirampurup.faridpur.gov.bd
8170	\N	Char Jahukanda	চর ঝাউকান্দা	charjahukandaup.faridpur.gov.bd
8171	\N	Madhukhali	মধুখালী	madhukhaliup.faridpur.gov.bd
8172	\N	Jahapur	জাহাপুর	jahapurup.faridpur.gov.bd
8173	\N	Gazna	গাজনা	gaznaup.faridpur.gov.bd
8174	\N	Megchami	মেগচামী	megchamiup.faridpur.gov.bd
8175	\N	Raipur	রায়পুর	raipurup.faridpur.gov.bd
8176	\N	Bagat	বাগাট	bagatup.faridpur.gov.bd
8177	\N	Dumain	ডুমাইন	dumainup.faridpur.gov.bd
8178	\N	Nowpara	নওপাড়া	nowparaup.faridpur.gov.bd
8179	\N	Kamarkhali	কামারখালী	kamarkhaliup.faridpur.gov.bd
8180	\N	Bhawal	ভাওয়াল	bhawalup.faridpur.gov.bd
8181	\N	Atghar	আটঘর	atgharup.faridpur.gov.bd
8182	\N	Mazadia	মাঝারদিয়া	mazadiaup.faridpur.gov.bd
8183	\N	Ballabhdi	বল্লভদী	ballabhdiup.faridpur.gov.bd
8184	\N	Gatti	গট্টি	gattiup.faridpur.gov.bd
8185	\N	Jadunandi	যদুনন্দী	jadunandiup.faridpur.gov.bd
8186	\N	Ramkantapur	রামকান্তপুর	ramkantapurup.faridpur.gov.bd
8187	\N	Sonapur	সোনাপুর	sonapurup.faridpur.gov.bd
8188	\N	Panchagarh Sadar	পঞ্চগড় সদর	panchagarhsadarup.panchagarh.gov.bd
8189	\N	Satmara	সাতমেরা	satmaraup.panchagarh.gov.bd
8190	\N	Amarkhana	অমরখানা	amarkhanaup.panchagarh.gov.bd
8191	\N	Haribhasa	হাড়িভাসা	haribhasaup.panchagarh.gov.bd
8192	\N	Chaklahat	চাকলাহাট	chaklahatup.panchagarh.gov.bd
8193	\N	Hafizabad	হাফিজাবাদ	hafizabadup.panchagarh.gov.bd
8194	\N	Kamat Kajol Dighi	কামাত কাজল দীঘি	kamatkajoldighiup.panchagarh.gov.bd
8195	\N	Dhakkamara	ধাক্কামারা	dhakkamaraup.panchagarh.gov.bd
8196	\N	Magura	মাগুরা	maguraup.panchagarh.gov.bd
8197	\N	Garinabari	গরিনাবাড়ী	garinabariup.panchagarh.gov.bd
8198	\N	Chilahati	চিলাহাটি	chilahatiup.panchagarh.gov.bd
8199	\N	Shaldanga	শালডাঙ্গা	shaldangaup.panchagarh.gov.bd
8200	\N	Debiganj Sadar	দেবীগঞ্জ সদর	debiganjsadarup.panchagarh.gov.bd
8201	\N	Pamuli	পামুলী	pamuliup.panchagarh.gov.bd
8202	\N	Sundardighi	সুন্দরদিঘী	sundardighiup.panchagarh.gov.bd
8203	\N	Sonahar Mollikadaha	সোনাহার মল্লিকাদহ	sonaharmollikadahaup.panchagarh.gov.bd
8204	\N	Tepriganj	টেপ্রীগঞ্জ	tepriganjup.panchagarh.gov.bd
8205	\N	Dandopal	দন্ডপাল	dandopalup.panchagarh.gov.bd
8206	\N	Debiduba	দেবীডুবা	debidubaup.panchagarh.gov.bd
8207	\N	Chengthi Hazra Danga	চেংঠী হাজরা ডাঙ্গা	chengthihazradangaup.panchagarh.gov.bd
8208	\N	Jholaishal Shiri	ঝলইশাল শিরি	jholaishalshiriup.panchagarh.gov.bd
8209	\N	Moidandighi	ময়দান দীঘি	moidandighiup.panchagarh.gov.bd
8210	\N	Banghari	বেংহারী	banghariup.panchagarh.gov.bd
8211	\N	Kajoldighi Kaligonj	কাজলদীঘি কালিগঞ্জ	kajoldighikaligonjup.panchagarh.gov.bd
8212	\N	Boroshoshi	বড়শশী	boroshoshiup.panchagarh.gov.bd
8213	\N	Chandanbari	চন্দনবাড়ী	chandanbariup.panchagarh.gov.bd
8214	\N	Marea Bamonhat	মাড়েয়া বামনহাট	mareabamonhatup.panchagarh.gov.bd
8215	\N	Boda	বোদা	bodaup.panchagarh.gov.bd
8216	\N	Sakoa	সাকোয়া	sakoaup.panchagarh.gov.bd
8217	\N	Pachpir	পাচপীর	pachpirup.panchagarh.gov.bd
8218	\N	Mirgapur	মির্জাপুর	mirgapurup.panchagarh.gov.bd
8219	\N	Radhanagar	রাধানগর	radhanagarup.panchagarh.gov.bd
8220	\N	Toria	তোড়িয়া	toriaup.panchagarh.gov.bd
8221	\N	Balarampur	বলরামপুর	balarampurup.panchagarh.gov.bd
8222	\N	Alowakhowa	আলোয়াখোয়া	alowakhowaup.panchagarh.gov.bd
8223	\N	Dhamor	ধামোর	dhamorup.panchagarh.gov.bd
8224	\N	Banglabandha	বাংলাবান্ধা	banglabandhaup.panchagarh.gov.bd
8225	\N	Bhojoanpur	ভজনপুর	bhojoanpurup.panchagarh.gov.bd
8226	\N	Bhojoanpur	ভজনপুর	bhojoanpur.gazipur.gov.bd
8227	\N	Buraburi	বুড়াবুড়ী	buraburi.panchagarh.gov.bd
8228	\N	Debnagar	দেবনগর	debnagarup.panchagarh.gov.bd
8229	\N	Salbahan	শালবাহান	salbahanup.panchagarh.gov.bd
8230	\N	Tentulia	তেতুলিয়া	tentuliaup.panchagarh.gov.bd
8231	\N	Timaihat	তিমাইহাট	timaihat.panchagarh.gov.bd
8232	\N	Joypur	জয়পুর	joypurup.dinajpur.gov.bd
8233	\N	Binodnagar	বিনোদনগর	binodnagarup.dinajpur.gov.bd
8234	\N	Golapgonj	গোলাপগঞ্জ	golapgonjup.dinajpur.gov.bd
8235	\N	Shalkhuria	শালখুরিয়া	shalkhuriaup.dinajpur.gov.bd
8236	\N	Putimara	পুটিমারা	putimaraup.dinajpur.gov.bd
8237	\N	Bhaduria	ভাদুরিয়া	bhaduriaup.dinajpur.gov.bd
8238	\N	Daudpur	দাউদপুর	daudpurup.dinajpur.gov.bd
8239	\N	Mahmudpur	মাহামুদপুর	mahmudpurup.dinajpur.gov.bd
8240	\N	Kushdaha	কুশদহ	kushdahaup.dinajpur.gov.bd
8241	\N	Shibrampur	শিবরামপুর	shibrampurup.dinajpur.gov.bd
8242	\N	Polashbari	পলাশবাড়ী	polashbariup2.dinajpur.gov.bd
8243	\N	Shatagram	শতগ্রাম	shatagramup.dinajpur.gov.bd
8244	\N	Paltapur	পাল্টাপুর	paltapurup.dinajpur.gov.bd
8245	\N	Sujalpur	সুজালপুর	sujalpurup.dinajpur.gov.bd
8246	\N	Nijpara	নিজপাড়া	nijparaup.dinajpur.gov.bd
8247	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.dinajpur.gov.bd
8248	\N	Bhognagar	ভোগনগর	bhognagarup.dinajpur.gov.bd
8249	\N	Sator	সাতোর	satorup.dinajpur.gov.bd
8250	\N	Mohonpur	মোহনপুর	mohonpurup.dinajpur.gov.bd
8251	\N	Moricha	মরিচা	morichaup.dinajpur.gov.bd
8252	\N	Bulakipur	বুলাকীপুর	bulakipurup.dinajpur.gov.bd
8253	\N	Palsha	পালশা	palshaup.dinajpur.gov.bd
8254	\N	Singra	সিংড়া	singraup.dinajpur.gov.bd
8255	\N	Ghoraghat	ঘোড়াঘাট	ghoraghatup.dinajpur.gov.bd
8256	\N	Mukundopur	মুকুন্দপুর	mukundopurup.dinajpur.gov.bd
8257	\N	Katla	কাটলা	katlaup.dinajpur.gov.bd
8258	\N	Khanpur	খানপুর	khanpurup.dinajpur.gov.bd
8259	\N	Dior	দিওড়	diorup.dinajpur.gov.bd
8260	\N	Binail	বিনাইল	binailup.dinajpur.gov.bd
8261	\N	Jatbani	জোতবানী	jatbaniup.dinajpur.gov.bd
8262	\N	Poliproyagpur	পলিপ্রয়াগপুর	poliproyagpurup.dinajpur.gov.bd
8263	\N	Belaichandi	বেলাইচন্ডি	belaichandiup.dinajpur.gov.bd
8264	\N	Monmothopur	মন্মথপুর	monmothopurup.dinajpur.gov.bd
8265	\N	Rampur	রামপুর	rampurup.dinajpur.gov.bd
8266	\N	Polashbari	পলাশবাড়ী	polashbariup4.dinajpur.gov.bd
8267	\N	Chandipur	চন্ডীপুর	chandipurup.dinajpur.gov.bd
8268	\N	Mominpur	মোমিনপুর	mominpurup.dinajpur.gov.bd
8269	\N	Mostofapur	মোস্তফাপুর	mostofapurup.dinajpur.gov.bd
8270	\N	Habra	হাবড়া	habraup.dinajpur.gov.bd
8271	\N	Hamidpur	হামিদপুর	hamidpurup.dinajpur.gov.bd
8272	\N	Harirampur	হরিরামপুর	harirampurup.dinajpur.gov.bd
8273	\N	Nafanagar	নাফানগর	nafanagarup.dinajpur.gov.bd
8274	\N	Eshania	ঈশানিয়া	eshaniaup.dinajpur.gov.bd
8275	\N	Atgaon	আটগাঁও	atgaonup.dinajpur.gov.bd
8276	\N	Shatail	ছাতইল	shatailup.dinajpur.gov.bd
8277	\N	Rongaon	রনগাঁও	rongaonup.dinajpur.gov.bd
8278	\N	Murshidhat	মুর্শিদহাট	murshidhatup.dinajpur.gov.bd
8279	\N	Dabor	ডাবোর	daborup.dinajpur.gov.bd
8280	\N	Rasulpur	রসুলপুর	rasulpurup.dinajpur.gov.bd
8281	\N	Mukundapur	মুকুন্দপুর	mukundapurup.dinajpur.gov.bd
8282	\N	Targao	তারগাঁও	targaoup.dinajpur.gov.bd
8283	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.dinajpur.gov.bd
8284	\N	Sundarpur	সুন্দরপুর	sundarpurup.dinajpur.gov.bd
8285	\N	Aloary	এলুয়াড়ী	aloaryup.dinajpur.gov.bd
8286	\N	Aladipur	আলাদিপুর	aladipurup.dinajpur.gov.bd
8287	\N	Kagihal	কাজীহাল	kagihalup.dinajpur.gov.bd
8288	\N	Bethdighi	বেতদিঘী	bethdighiup.dinajpur.gov.bd
8289	\N	Khairbari	খয়েরবাড়ী	khairbariup.dinajpur.gov.bd
8290	\N	Daulatpur	দৌলতপুর	daulatpurup.dinajpur.gov.bd
8291	\N	Shibnagor	শিবনগর	shibnagorup.dinajpur.gov.bd
8292	\N	Chealgazi	চেহেলগাজী	chealgaziup.dinajpur.gov.bd
8293	\N	Sundorbon	সুন্দরবন	sundorbonup.dinajpur.gov.bd
8294	\N	Fazilpur	ফাজিলপুর	fazilpurup.dinajpur.gov.bd
8295	\N	Shekpura	শেখপুরা	shekpuraup.dinajpur.gov.bd
8296	\N	Shashora	শশরা	shashoraup.dinajpur.gov.bd
8297	\N	Auliapur	আউলিয়াপুর	auliapurup.dinajpur.gov.bd
8298	\N	Uthrail	উথরাইল	uthrailup.dinajpur.gov.bd
8299	\N	Sankarpur	শংকরপুর	sankarpurup.dinajpur.gov.bd
8300	\N	Askorpur	আস্করপুর	askorpurup.dinajpur.gov.bd
8301	\N	Kamalpur	কমলপুর	kamalpurup.dinajpur.gov.bd
8302	\N	Alihat	আলীহাট	alihatup.dinajpur.gov.bd
8303	\N	Khattamadobpara	খট্টামাধবপাড়া	khattamadobparaup.dinajpur.gov.bd
8304	\N	Boalder	বোয়ালদার	boalderup.dinajpur.gov.bd
8305	\N	Alokjhari	আলোকঝাড়ী	alokjhariup.dinajpur.gov.bd
8306	\N	Bherbheri	ভেড়ভেড়ী	bherbheriup.dinajpur.gov.bd
8307	\N	Angarpara	আঙ্গারপাড়া	angarparaup.dinajpur.gov.bd
8308	\N	Goaldihi	গোয়ালডিহি	goaldihiup.dinajpur.gov.bd
8309	\N	Bhabki	ভাবকী	bhabkiup.dinajpur.gov.bd
8310	\N	Khamarpara	খামারপাড়া	khamarparaup.dinajpur.gov.bd
8311	\N	Azimpur	আজিমপুর	azimpurup.dinajpur.gov.bd
8312	\N	Farakkabad	ফরাক্কাবাদ	farakkabadup.dinajpur.gov.bd
8313	\N	Dhamoir	ধামইর	dhamoirup.dinajpur.gov.bd
8314	\N	Shohorgram	শহরগ্রাম	shohorgramup.dinajpur.gov.bd
8315	\N	Birol	বিরল	birolup.dinajpur.gov.bd
8316	\N	Bhandra	ভান্ডারা	bhandraup.dinajpur.gov.bd
8317	\N	Bijora	বিজোড়া	bijoraup.dinajpur.gov.bd
8318	\N	Dharmapur	ধর্মপুর	dharmapurup.dinajpur.gov.bd
8319	\N	Mongalpur	মঙ্গলপুর	mongalpurup.dinajpur.gov.bd
8320	\N	Ranipukur	রাণীপুকুর	ranipukurup.dinajpur.gov.bd
8321	\N	Rajarampur	রাজারামপুর	rajarampurup.dinajpur.gov.bd
8322	\N	Nashratpur	নশরতপুর	nashratpurup.dinajpur.gov.bd
8323	\N	Satnala	সাতনালা	satnalaup.dinajpur.gov.bd
8324	\N	Fatejangpur	ফতেজংপুর	fatejangpurup.dinajpur.gov.bd
8325	\N	Isobpur	ইসবপুর	isobpurup.dinajpur.gov.bd
8326	\N	Abdulpur	আব্দুলপুর	abdulpurup.dinajpur.gov.bd
8327	\N	Amarpur	অমরপুর	amarpurup.dinajpur.gov.bd
8328	\N	Auliapukur	আউলিয়াপুকুর	auliapukurup.dinajpur.gov.bd
8329	\N	Saitara	সাইতারা	saitaraup.dinajpur.gov.bd
8330	\N	Viail	ভিয়াইল	viailup.dinajpur.gov.bd
8331	\N	Punotti	পুনট্টি	punottiup.dinajpur.gov.bd
8332	\N	Tetulia	তেতুলিয়া	tetuliaup.dinajpur.gov.bd
8333	\N	Alokdihi	আলোকডিহি	alokdihiup.dinajpur.gov.bd
8334	\N	Rajpur	রাজপুর	rajpurup.lalmonirhat.gov.bd
8335	\N	Harati	হারাটি	haratiup.lalmonirhat.gov.bd
8336	\N	Mogolhat	মোগলহাট	mogolhatup.lalmonirhat.gov.bd
8337	\N	Gokunda	গোকুন্ডা	gokundaup.lalmonirhat.gov.bd
8338	\N	Barobari	বড়বাড়ী	barobariup.lalmonirhat.gov.bd
8339	\N	Kulaghat	কুলাঘাট	kulaghatup.lalmonirhat.gov.bd
8340	\N	Mohendranagar	মহেন্দ্রনগর	mohendranagarup.lalmonirhat.gov.bd
8341	\N	Khuniagachh	খুনিয়াগাছ	khuniagachhup.lalmonirhat.gov.bd
8342	\N	Panchagram	পঞ্চগ্রাম	panchagramup.lalmonirhat.gov.bd
8343	\N	Bhotmari	ভোটমারী	bhotmariup.lalmonirhat.gov.bd
8344	\N	Modati	মদাতী	modatiup.lalmonirhat.gov.bd
8345	\N	Dologram	দলগ্রাম	dologramup.lalmonirhat.gov.bd
8346	\N	Tushbhandar	তুষভান্ডার	tushbhandarup.lalmonirhat.gov.bd
8347	\N	Goral	গোড়ল	goralup.lalmonirhat.gov.bd
8348	\N	Chondropur	চন্দ্রপুর	chondropurup.lalmonirhat.gov.bd
8349	\N	Cholbola	চলবলা	cholbolaup.lalmonirhat.gov.bd
8350	\N	Kakina	কাকিনা	kakinaup.lalmonirhat.gov.bd
8351	\N	Barokhata	বড়খাতা	barokhataup.lalmonirhat.gov.bd
8352	\N	Goddimari	গড্ডিমারী	goddimariup.lalmonirhat.gov.bd
8353	\N	Singimari	সিংগীমারী	singimariup.lalmonirhat.gov.bd
8354	\N	Tongvhanga	টংভাঙ্গা	tongvhangaup.lalmonirhat.gov.bd
8355	\N	Sindurna	সিন্দুর্ণা	sindurnaup.lalmonirhat.gov.bd
8356	\N	Paticapara	পাটিকাপাড়া	paticaparaup.lalmonirhat.gov.bd
8357	\N	Nowdabas	নওদাবাস	nowdabasup.lalmonirhat.gov.bd
8358	\N	Gotamari	গোতামারী	gotamariup.lalmonirhat.gov.bd
8359	\N	Vhelaguri	ভেলাগুড়ি	vhelaguriup.lalmonirhat.gov.bd
8360	\N	Shaniajan	সানিয়াজান	shaniajanup.lalmonirhat.gov.bd
8361	\N	Fakirpara	ফকিরপাড়া	fakirparaup.lalmonirhat.gov.bd
8362	\N	Dawabari	ডাউয়াবাড়ী	dawabariup.lalmonirhat.gov.bd
8363	\N	Sreerampur	শ্রীরামপুর	sreerampurup.lalmonirhat.gov.bd
8364	\N	Patgram	পাটগ্রাম	patgramup.lalmonirhat.gov.bd
8365	\N	Jagatber	জগতবেড়	jagatberup.lalmonirhat.gov.bd
8366	\N	Kuchlibari	কুচলিবাড়ী	kuchlibariup.lalmonirhat.gov.bd
8367	\N	Jongra	জোংড়া	jongraup.lalmonirhat.gov.bd
8368	\N	Baura	বাউড়া	bauraup.lalmonirhat.gov.bd
8369	\N	Dahagram	দহগ্রাম	dahagramup.lalmonirhat.gov.bd
8370	\N	Burimari	বুড়িমারী	burimariup.lalmonirhat.gov.bd
8371	\N	Bhelabari	ভেলাবাড়ী	bhelabariup.lalmonirhat.gov.bd
8372	\N	Bhadai	ভাদাই	bhadaiup.lalmonirhat.gov.bd
8373	\N	Kamlabari	কমলাবাড়ী	kamlabariup.lalmonirhat.gov.bd
8374	\N	Durgapur	দূর্গাপুর	durgapurup.lalmonirhat.gov.bd
8375	\N	Sarpukur	সারপুকুর	sarpukurup.lalmonirhat.gov.bd
8376	\N	Saptibari	সাপ্টিবাড়ী	saptibariup.lalmonirhat.gov.bd
8377	\N	Palashi	পলাশী	palashiup.lalmonirhat.gov.bd
8378	\N	Mohishkhocha	মহিষখোচা	mohishkhochaup.lalmonirhat.gov.bd
8379	\N	Kamarpukur	কামারপুকুর	kamarpukurup.nilphamari.gov.bd
8380	\N	Kasiram Belpukur	কাশিরাম বেলপুকুর	kasirambelpukurup.nilphamari.gov.bd
8381	\N	Bangalipur	বাঙ্গালীপুর	bangalipur.nilphamari.gov.bd
8382	\N	Botlagari	বোতলাগাড়ী	botlagariup.nilphamari.gov.bd
8383	\N	Khata Madhupur	খাতা মধুপুর	khatamadhupurup.nilphamari.gov.bd
8384	\N	Gomnati	গোমনাতি	gomnati.nilphamari.gov.bd
8385	\N	Bhogdaburi	ভোগডাবুড়ী	bhogdaburiup.nilphamari.gov.bd
8386	\N	Ketkibari	কেতকীবাড়ী	ketkibariup.nilphamari.gov.bd
8387	\N	Jorabari	জোড়াবাড়ী	jorabariup.nilphamari.gov.bd
8388	\N	Bamunia	বামুনীয়া	bamuniaup.nilphamari.gov.bd
8389	\N	Panga Motukpur	পাংগা মটকপুর	pangamotukpurup.nilphamari.gov.bd
8390	\N	Boragari	বোড়াগাড়ী	boragariup.nilphamari.gov.bd
8391	\N	Domar	ডোমার	domarup.nilphamari.gov.bd
8392	\N	Sonaray	সোনারায়	sonarayup2.nilphamari.gov.bd
8393	\N	Harinchara	হরিণচরা	harincharaup.nilphamari.gov.bd
8394	\N	Paschim Chhatnay	পশ্চিম ছাতনাই	paschimchhatnayup.nilphamari.gov.bd
8395	\N	Balapara	বালাপাড়া	balaparaup.nilphamari.gov.bd
8396	\N	Dimla Sadar	ডিমলা সদর	dimlasadarup.nilphamari.gov.bd
8397	\N	Khogakharibari	খগা খড়িবাড়ী	khogakharibariup.nilphamari.gov.bd
8398	\N	Gayabari	গয়াবাড়ী	gayabariup.nilphamari.gov.bd
8399	\N	Noutara	নাউতারা	noutaraup.nilphamari.gov.bd
8400	\N	Khalisha Chapani	খালিশা চাপানী	khalishachapaniup.nilphamari.gov.bd
8401	\N	Jhunagach Chapani	ঝুনাগাছ চাপানী	jhunagachhchapaniup.nilphamari.gov.bd
8402	\N	Tepa Khribari	টেপা খরীবাড়ী	tepakhribariup.nilphamari.gov.bd
8403	\N	Purba Chhatnay	পুর্ব ছাতনাই	purbachhatnayup.nilphamari.gov.bd
8404	\N	Douabari	ডাউয়াবাড়ী	douabariup.nilphamari.gov.bd
8405	\N	Golmunda	গোলমুন্ডা	golmunda.nilphamari.gov.bd
8406	\N	Balagram	বালাগ্রাম	balagram.nilphamari.gov.bd
8407	\N	Golna	গোলনা	golna.nilphamari.gov.bd
8408	\N	Dharmapal	ধর্মপাল	dharmapal.nilphamari.gov.bd
8409	\N	Simulbari	শিমুলবাড়ী	simulbari.nilphamari.gov.bd
8410	\N	Mirganj	মীরগঞ্জ	mirganj.nilphamari.gov.bd
8411	\N	Kathali	কাঠালী	kathaliup.nilphamari.gov.bd
8412	\N	Khutamara	খুটামারা	khutamaraup.nilphamari.gov.bd
8413	\N	Shaulmari	শৌলমারী	shaulmariup.nilphamari.gov.bd
8414	\N	Kaimari	কৈমারী	kaimariup.nilphamari.gov.bd
8415	\N	Barabhita	বড়ভিটা	barabhitaup.nilphamari.gov.bd
8416	\N	Putimari	পুটিমারী	putimariup.nilphamari.gov.bd
8417	\N	Nitai	নিতাই	nitaiup.nilphamari.gov.bd
8418	\N	Bahagili	বাহাগিলি	bahagiliup.nilphamari.gov.bd
8419	\N	Chandkhana	চাঁদখানা	chandkhanaup.nilphamari.gov.bd
8420	\N	Kishoreganj	কিশোরগঞ্জ	kishoreganjup.nilphamari.gov.bd
8421	\N	Ranachandi	রনচন্ডি	ranachandiup.nilphamari.gov.bd
8422	\N	Garagram	গাড়াগ্রাম	garagramup.nilphamari.gov.bd
8423	\N	Magura	মাগুরা	maguraup.nilphamari.gov.bd
8424	\N	Chaora Bargacha	চওড়া বড়গাছা	chaorabargachaup.nilphamari.gov.bd
8425	\N	Gorgram	গোড়গ্রাম	gorgramup.nilphamari.gov.bd
8426	\N	Khoksabari	খোকসাবাড়ী	khoksabariup.nilphamari.gov.bd
8427	\N	Palasbari	পলাশবাড়ী	palasbariup.nilphamari.gov.bd
8428	\N	Ramnagar	রামনগর	ramnagarup.nilphamari.gov.bd
8429	\N	Kachukata	কচুকাটা	kachukataup.nilphamari.gov.bd
8430	\N	Panchapukur	পঞ্চপুকুর	panchapukurup.nilphamari.gov.bd
8431	\N	Itakhola	ইটাখোলা	itakholaup.nilphamari.gov.bd
8432	\N	Kundapukur	কুন্দপুকুর	kundapukur.nilphamari.gov.bd
8433	\N	Sonaray	সোনারায়	sonaray.nilphamari.gov.bd
8434	\N	Songalsi	সংগলশী	songalsiup.nilphamari.gov.bd
8435	\N	Charaikhola	চড়াইখোলা	charaikhola.nilphamari.gov.bd
8436	\N	Chapra Sarnjami	চাপড়া সরঞ্জানী	chaprasarnjami.nilphamari.gov.bd
8437	\N	Lakshmicha	লক্ষ্মীচাপ	lakshmichapup.nilphamari.gov.bd
8438	\N	Tupamari	টুপামারী	tupamariup.nilphamari.gov.bd
8439	\N	Rasulpur	রসুলপুর	rasulpurup.gaibandha.gov.bd
8440	\N	Noldanga	নলডাঙ্গা	noldangaup.gaibandha.gov.bd
8441	\N	Damodorpur	দামোদরপুর	damodorpurup.gaibandha.gov.bd
8442	\N	Jamalpur	জামালপুর	jamalpurup.gaibandha.gov.bd
8443	\N	Faridpur	ফরিদপুর	faridpurup.gaibandha.gov.bd
8444	\N	Dhaperhat	ধাপেরহাট	dhaperhatup.gaibandha.gov.bd
8445	\N	Idilpur	ইদিলপুর	idilpurup.gaibandha.gov.bd
8446	\N	Vatgram	ভাতগ্রাম	vatgramup.gaibandha.gov.bd
8447	\N	Bongram	বনগ্রাম	bongramup.gaibandha.gov.bd
8448	\N	Kamarpara	কামারপাড়া	kamarparaup.gaibandha.gov.bd
8449	\N	Khodkomor	খোদকোমরপুর	khodkomorup.gaibandha.gov.bd
8450	\N	Laxmipur	লক্ষ্মীপুর	laxmipurup.gaibandha.gov.bd
8451	\N	Malibari	মালীবাড়ী	malibariup.gaibandha.gov.bd
8452	\N	Kuptola	কুপতলা	kuptolaup.gaibandha.gov.bd
8453	\N	Shahapara	সাহাপাড়া	shahaparaup.gaibandha.gov.bd
8454	\N	Ballamjhar	বল্লমঝাড়	ballamjharup.gaibandha.gov.bd
8455	\N	Ramchandrapur	রামচন্দ্রপুর	ramchandrapurup.gaibandha.gov.bd
8456	\N	Badiakhali	বাদিয়াখালী	badiakhaliup.gaibandha.gov.bd
8457	\N	Boali	বোয়ালী	boaliup.gaibandha.gov.bd
8458	\N	Ghagoa	ঘাগোয়া	ghagoaup.gaibandha.gov.bd
8459	\N	Gidari	গিদারী	gidariup.gaibandha.gov.bd
8460	\N	Kholahati	খোলাহাটী	kholahatiup.gaibandha.gov.bd
8461	\N	Mollarchar	মোল্লারচর	mollarcharup.gaibandha.gov.bd
8462	\N	Kamarjani	কামারজানি	kamarjaniup.gaibandha.gov.bd
8463	\N	Kishoregari	কিশোরগাড়ী	kishoregariup.gaibandha.gov.bd
8464	\N	Hosenpur	হোসেনপুর	hosenpurup.gaibandha.gov.bd
8465	\N	Palashbari	পলাশবাড়ী	palashbariup.gaibandha.gov.bd
8466	\N	Barisal	বরিশাল	barisalup.gaibandha.gov.bd
8467	\N	Mohdipur	মহদীপুর	mohdipurup.gaibandha.gov.bd
8468	\N	Betkapa	বেতকাপা	betkapaup.gaibandha.gov.bd
8469	\N	Pobnapur	পবনাপুর	pobnapurup.gaibandha.gov.bd
8470	\N	Monohorpur	মনোহরপুর	monohorpurup.gaibandha.gov.bd
8471	\N	Harinathpur	হরিণাথপুর	harinathpurup.gaibandha.gov.bd
8472	\N	Padumsahar	পদুমশহর	padumsaharup.gaibandha.gov.bd
8473	\N	Varotkhali	ভরতখালী	varotkhaliup.gaibandha.gov.bd
8474	\N	Saghata	সাঘাটা	saghataup.gaibandha.gov.bd
8475	\N	Muktinagar	মুক্তিনগর	muktinagarup.gaibandha.gov.bd
8476	\N	Kachua	কচুয়া	kachuaup.gaibandha.gov.bd
8477	\N	Ghuridah	ঘুরিদহ	ghuridahup.gaibandha.gov.bd
8478	\N	Holdia	হলদিয়া	holdiaup.gaibandha.gov.bd
8479	\N	Jumarbari	জুমারবাড়ী	jumarbariup.gaibandha.gov.bd
8480	\N	Kamalerpara	কামালেরপাড়া	kamalerparaup.gaibandha.gov.bd
8481	\N	Bonarpara	বোনারপাড়া	bonarparaup.gaibandha.gov.bd
8482	\N	Kamdia	কামদিয়া	kamdiaup.gaibandha.gov.bd
8483	\N	Katabari	কাটাবাড়ী	katabariup.gaibandha.gov.bd
8484	\N	Shakhahar	শাখাহার	shakhaharup.gaibandha.gov.bd
8485	\N	Rajahar	রাজাহার	rajaharup.gaibandha.gov.bd
8486	\N	Sapmara	সাপমারা	sapmaraup.gaibandha.gov.bd
8487	\N	Dorbosto	দরবস্ত ইয়নিয়ন	dorbostoup.gaibandha.gov.bd
8488	\N	Talukkanupur	তালুককানুপুর	talukkanupurup.gaibandha.gov.bd
8489	\N	Nakai	নাকাই	nakaiup.gaibandha.gov.bd
8490	\N	Harirampur	হরিরামপুর	harirampurup.gaibandha.gov.bd
8491	\N	Rakhalburuj	রাখালবুরুজ	rakhalburujup.gaibandha.gov.bd
8492	\N	Phulbari	ফুলবাড়ী	phulbariup.gaibandha.gov.bd
8493	\N	Gumaniganj	গুমানীগঞ্জ	gumaniganjup.gaibandha.gov.bd
8494	\N	Kamardoho	কামারদহ	kamardohoup.gaibandha.gov.bd
8495	\N	Kochasahar	কোচাশহর	kochasaharup.gaibandha.gov.bd
8496	\N	Shibpur	শিবপুর	shibpurup.gaibandha.gov.bd
8497	\N	Mahimaganj	মহিমাগঞ্জ	mahimaganjup.gaibandha.gov.bd
8498	\N	Shalmara	শালমারা	shalmaraup.gaibandha.gov.bd
8499	\N	Bamondanga	বামনডাঙ্গা	bamondangaup.gaibandha.gov.bd
8500	\N	Sonaroy	সোনারায়	sonaroyup.gaibandha.gov.bd
8501	\N	Tarapur	তারাপুর	tarapurup.gaibandha.gov.bd
8502	\N	Belka	বেলকা	belkaup.gaibandha.gov.bd
8503	\N	Dohbond	দহবন্দ	dohbondup.gaibandha.gov.bd
8504	\N	Sorbanondo	সর্বানন্দ	sorbanondoup.gaibandha.gov.bd
8505	\N	Ramjibon	রামজীবন	ramjibonup.gaibandha.gov.bd
8506	\N	Dhopadanga	ধোপাডাঙ্গা	dhopadangaup.gaibandha.gov.bd
8507	\N	Chaporhati	ছাপরহাটী	chaporhatiup.gaibandha.gov.bd
8508	\N	Shantiram	শান্তিরাম	shantiramup.gaibandha.gov.bd
8509	\N	Konchibari	কঞ্চিবাড়ী	konchibariup.gaibandha.gov.bd
8510	\N	Sreepur	শ্রীপুর	sreepurup.gaibandha.gov.bd
8511	\N	Chandipur	চন্ডিপুর	chandipurup.gaibandha.gov.bd
8512	\N	Kapasia	কাপাসিয়া	kapasiaup.gaibandha.gov.bd
8513	\N	Haripur	হরিপুর	haripurup.gaibandha.gov.bd
8514	\N	Kanchipara	কঞ্চিপাড়া	kanchiparaup.gaibandha.gov.bd
8515	\N	Uria	উড়িয়া	uriaup.gaibandha.gov.bd
8516	\N	Udakhali	উদাখালী	udakhaliup.gaibandha.gov.bd
8517	\N	Gazaria	গজারিয়া	gazariaup.gaibandha.gov.bd
8518	\N	Phulchari	ফুলছড়ি	phulchariup.gaibandha.gov.bd
8519	\N	Erendabari	এরেন্ডাবাড়ী	erendabariup.gaibandha.gov.bd
8520	\N	Fazlupur	ফজলুপুর	fazlupurup.gaibandha.gov.bd
8521	\N	Ruhea	রুহিয়া	ruheaup.thakurgaon.gov.bd
8522	\N	Akhanagar	আখানগর	akhanagarup.thakurgaon.gov.bd
8523	\N	Ahcha	আকচা	ahchaup.thakurgaon.gov.bd
8524	\N	Baragaon	বড়গাঁও	baragaonup.thakurgaon.gov.bd
8525	\N	Balia	বালিয়া	baliaup.thakurgaon.gov.bd
8526	\N	Auliapur	আউলিয়াপুর	auliapurup.thakurgaon.gov.bd
8527	\N	Chilarang	চিলারং	chilarangup.thakurgaon.gov.bd
8528	\N	Rahimanpur	রহিমানপুর	rahimanpurup.thakurgaon.gov.bd
8529	\N	Roypur	রায়পুর	roypurup.thakurgaon.gov.bd
8530	\N	Jamalpur	জামালপুর	jamalpurup.thakurgaon.gov.bd
8531	\N	Mohammadpur	মোহাম্মদপুর	mohammadpurup.thakurgaon.gov.bd
8532	\N	Salandar	সালন্দর	salandarup.thakurgaon.gov.bd
8533	\N	Gareya	গড়েয়া	gareyaup.thakurgaon.gov.bd
8534	\N	Rajagaon	রাজাগাঁও	rajagaonup.thakurgaon.gov.bd
8535	\N	Debipur	দেবীপুর	debipurup.thakurgaon.gov.bd
8536	\N	Nargun	নারগুন	nargunup.thakurgaon.gov.bd
8537	\N	Jagannathpur	জগন্নাথপুর	jagannathpurup.thakurgaon.gov.bd
8538	\N	Sukhanpukhari	শুখানপুকুরী	sukhanpukhariup.thakurgaon.gov.bd
8539	\N	Begunbari	বেগুনবাড়ী	begunbariup.thakurgaon.gov.bd
8540	\N	Ruhia Pashchim	রুহিয়া পশ্চিম	ruhiapashchimup.thakurgaon.gov.bd
8541	\N	Dholarhat	ঢোলারহাট	dholarhatup.thakurgaon.gov.bd
8542	\N	Bhomradaha	ভোমরাদহ	bhomradahaup.thakurgaon.gov.bd
8543	\N	Kosharaniganj	কোষারাণীগঞ্জ	kosharaniganjup.thakurgaon.gov.bd
8544	\N	Khangaon	খনগাঁও	khangaonup.thakurgaon.gov.bd
8545	\N	Saidpur	সৈয়দপুর	saidpurup.thakurgaon.gov.bd
8546	\N	Pirganj	পীরগঞ্জ	pirganjup.thakurgaon.gov.bd
8547	\N	Hajipur	হাজীপুর	hajipurup.thakurgaon.gov.bd
8548	\N	Daulatpur	দৌলতপুর	daulatpurup.thakurgaon.gov.bd
8549	\N	Sengaon	সেনগাঁও	sengaonup.thakurgaon.gov.bd
8550	\N	Jabarhat	জাবরহাট	jabarhatup.thakurgaon.gov.bd
8551	\N	Bairchuna	বৈরচুনা	bairchunaup.thakurgaon.gov.bd
8552	\N	Dhormogarh	ধর্মগড়	dhormogarhup.thakurgaon.gov.bd
8553	\N	Nekmorod	নেকমরদ	nekmorodup.thakurgaon.gov.bd
8554	\N	Hosengaon	হোসেনগাঁও	hosengaonup.thakurgaon.gov.bd
8555	\N	Lehemba	লেহেম্বা	lehembaup.thakurgaon.gov.bd
8556	\N	Bachor	বাচোর	bachorup.thakurgaon.gov.bd
8557	\N	Kashipur	কাশিপুর	kashipurup.thakurgaon.gov.bd
8558	\N	Ratore	রাতোর	ratoreup.thakurgaon.gov.bd
8559	\N	Nonduar	নন্দুয়ার	nonduarup.thakurgaon.gov.bd
8560	\N	Gedura	গেদুড়া	geduraup.thakurgaon.gov.bd
8561	\N	Amgaon	আমগাঁও	amgaonup.thakurgaon.gov.bd
8562	\N	Bakua	বকুয়া	bakuaup.thakurgaon.gov.bd
8563	\N	Dangipara	ডাঙ্গীপাড়া	dangiparaup.thakurgaon.gov.bd
8564	\N	Haripur	হরিপুর	haripurup.thakurgaon.gov.bd
8565	\N	Bhaturia	ভাতুরিয়া	bhaturiaup.thakurgaon.gov.bd
8566	\N	Paria	পাড়িয়া	pariaup.thakurgaon.gov.bd
8567	\N	Charol	চারোল	charolup.thakurgaon.gov.bd
8568	\N	Dhontola	ধনতলা	dhontolaup.thakurgaon.gov.bd
8569	\N	Boropalashbari	বড়পলাশবাড়ী	boropalashbariup.thakurgaon.gov.bd
8570	\N	Duosuo	দুওসুও	duosuoup.thakurgaon.gov.bd
8571	\N	Vanor	ভানোর	vanorup.thakurgaon.gov.bd
8572	\N	Amjankhore	আমজানখোর	amjankhoreup.thakurgaon.gov.bd
8573	\N	Borobari	বড়বাড়ী	borobariup.thakurgaon.gov.bd
8574	\N	Mominpur	মমিনপুর	mominpurup.rangpur.gov.bd
8575	\N	Horidebpur	হরিদেবপুর	horidebpurup.rangpur.gov.bd
8576	\N	Uttam	উত্তম	uttamup.rangpur.gov.bd
8577	\N	Porshuram	পরশুরাম	porshuramup.rangpur.gov.bd
8578	\N	Topodhan	তপোধন	topodhanup.rangpur.gov.bd
8579	\N	Satgara	সাতগারা	satgaraup.rangpur.gov.bd
8580	\N	Rajendrapur	রাজেন্দ্রপুর	rajendrapurup.rangpur.gov.bd
8581	\N	Sadwapuskoroni	সদ্যপুস্করনী	sadwapuskoroniup.rangpur.gov.bd
8582	\N	Chandanpat	চন্দনপাট	chandanpatup.rangpur.gov.bd
8583	\N	Dorshona	দর্শানা	dorshonaup.rangpur.gov.bd
8584	\N	Tampat	তামপাট	tampatup.rangpur.gov.bd
8585	\N	Betgari	বেতগাড়ী	betgariup.rangpur.gov.bd
8586	\N	Kholeya	খলেয়া	kholeyaup.rangpur.gov.bd
8587	\N	Borobil	বড়বিল	borobilup.rangpur.gov.bd
8588	\N	Kolcondo	কোলকোন্দ	kolcondoup.rangpur.gov.bd
8589	\N	Gongachora	গংগাচড়া	gongachoraup.rangpur.gov.bd
8590	\N	Gojoghonta	গজঘন্টা	gojoghontaup.rangpur.gov.bd
8591	\N	Morneya	মর্ণেয়া	morneyaup.rangpur.gov.bd
8592	\N	Alambiditor	আলমবিদিতর	alambiditorup.rangpur.gov.bd
8593	\N	Lakkhitari	লক্ষীটারী	lakkhitariup.rangpur.gov.bd
8594	\N	Nohali	নোহালী	nohaliup.rangpur.gov.bd
8595	\N	Kurshatara	কুর্শা	kurshataraup.rangpur.gov.bd
8596	\N	Alampur	আলমপুর	alampurup.rangpur.gov.bd
8597	\N	Soyar	সয়ার	soyarup.rangpur.gov.bd
8598	\N	Ikorchali	ইকরচালী	ikorchaliup.rangpur.gov.bd
8599	\N	Hariarkuthi	হাড়িয়ারকুঠি	hariarkuthiup.rangpur.gov.bd
8600	\N	Radhanagar	রাধানগর	radhanagarup.rangpur.gov.bd
8601	\N	Gopinathpur	গোপীনাথপুর	gopinathpurup.rangpur.gov.bd
8602	\N	Modhupur	মধুপুর	modhupurup.rangpur.gov.bd
8603	\N	Kutubpur	কুতুবপুর	kutubpurup.ranpur.gov.bd
8604	\N	Bishnapur	বিষ্ণপুর	bishnapurup.rangpur.gov.bd
8605	\N	Kalupara	কালুপাড়া	kaluparaup.rangpur.gov.bd
8606	\N	Lohanipara	লোহানীপাড়া	lohaniparaup.rangpur.gov.bd
8607	\N	Gopalpur	গোপালপুর	gopalpurup.rangpur.gov.bd
8608	\N	Damodorpur	দামোদরপুর	damodorpurup.rangpur.gov.bd
8609	\N	Ramnathpurupb	রামনাথপুর	ramnathpurupb.rangpur.gov.bd
8610	\N	Khoragach	খোরাগাছ	khoragachup.rangpur.gov.bd
8611	\N	Ranipukur	রাণীপুকুর	ranipukurup.rangpur.gov.bd
8612	\N	Payrabond	পায়রাবন্দ	payrabondup.rangpur.gov.bd
8613	\N	Vangni	ভাংনী	vangniup.rangpur.gov.bd
8614	\N	Balarhat	বালারহাট	balarhatup.rangpur.gov.bd
8615	\N	Kafrikhal	কাফ্রিখাল	kafrikhalup.rangpur.gov.bd
8616	\N	Latibpur	লতিবপুর	latibpurup.rangpur.gov.bd
8617	\N	Chengmari	চেংমারী	chengmariup.rangpur.gov.bd
8618	\N	Moyenpur	ময়েনপুর	moyenpurup.rangpur.gov.bd
8619	\N	Baluya Masimpur	বালুয়া মাসিমপুর	baluyamasimpurup.rangpur.gov.bd
8620	\N	Borobala	বড়বালা	borobalaup.rangpur.gov.bd
8621	\N	Mirzapur	মির্জাপুর	mirzapurup.rangpur.gov.bd
8622	\N	Imadpur	ইমাদপুর	imadpurup.rangpur.gov.bd
8623	\N	Milonpur	মিলনপুর	milonpurup.rangpur.gov.bd
8624	\N	Mgopalpur	গোপালপুর	mgopalpurup.rangpur.gov.bd
8625	\N	Durgapur	দূর্গাপুর	durgapurup.rangpur.gov.bd
8626	\N	Boro Hazratpur	বড় হযরতপুর	borohazratpurup.rangpur.gov.bd
8627	\N	Chattracol	চৈত্রকোল	chattracolup.rangpur.gov.bd
8628	\N	Vendabari	ভেন্ডাবাড়ী	vendabariup.rangpur.gov.bd
8629	\N	Borodargah	বড়দরগাহ	borodargahup.rangpur.gov.bd
8630	\N	Kumedpur	কুমেদপুর	kumedpurup.rangpur.gov.bd
8631	\N	Modankhali	মদনখালী	modankhaliup.rangpur.gov.bd
8632	\N	Tukuria	টুকুরিয়া	tukuriaup.rangpur.gov.bd
8633	\N	Boro Alampur	বড় আলমপুর	boroalampurup.rangpur.gov.bd
8634	\N	Raypur	রায়পুর	raypurup.rangpur.gov.bd
8635	\N	Pirgonj	পীরগঞ্জ	pirgonjup.rangpur.gov.bd
8636	\N	Shanerhat	শানেরহাট	shanerhatup.rangpur.gov.bd
8637	\N	Mithipur	মিঠিপুর	mithipurup.rangpur.gov.bd
8638	\N	Ramnathpur	রামনাথপুর	ramnathpurup1.rangpur.gov.bd
8639	\N	Chattra	চতরা	chattraup.rangpur.gov.bd
8640	\N	Kabilpur	কাবিলপুর	kabilpurup.rangpur.gov.bd
8641	\N	Pachgachi	পাঁচগাছী	pachgachiup.rangpur.gov.bd
8642	\N	Sarai	সারাই	saraiup.rangpur.gov.bd
8643	\N	Balapara	বালাপাড়া	balaparaup.rangpur.gov.bd
8644	\N	Shahidbag	শহীদবাগ	shahidbagup.rangpur.gov.bd
8645	\N	Haragach	হারাগাছ	haragachup.rangpur.gov.bd
8646	\N	Tepamodhupur	টেপামধুপুর	tepamodhupurup.rangpur.gov.bd
8647	\N	Kurshaupk	কুর্শা	kurshaupk.rangpur.gov.bd
8648	\N	Kollyani	কল্যাণী	kollyaniup.rangpur.gov.bd
8649	\N	Parul	পারুল	parulup.rangpur.gov.bd
8650	\N	Itakumari	ইটাকুমারী	itakumariup.rangpur.gov.bd
8651	\N	Saula	ছাওলা	saulaup.rangpur.gov.bd
8652	\N	Kandi	কান্দি	kandiup.rangpur.gov.bd
8653	\N	Pirgacha	পীরগাছা	pirgachaup.rangpur.gov.bd
8654	\N	Annodanagar	অন্নদানগর	annodanagarup.rangpur.gov.bd
8655	\N	Tambulpur	তাম্বুলপুর	tambulpurup.rangpur.gov.bd
8656	\N	Koikuri	কৈকুড়ী	koikuriup.rangpur.gov.bd
8657	\N	Holokhana	হলোখানা	holokhanaup.kurigram.gov.bd
8658	\N	Ghogadhoh	ঘোগাদহ	ghogadhohup.kurigram.gov.bd
8659	\N	Belgacha	বেলগাছা	belgachaup.kurigram.gov.bd
8660	\N	Mogolbasa	মোগলবাসা	mogolbasaup.kurigram.gov.bd
8661	\N	Panchgachi	পাঁচগাছি	panchgachiup.kurigram.gov.bd
8662	\N	Jatrapur	যাত্রাপুর	jatrapurup.kurigram.gov.bd
8663	\N	Kanthalbari	কাঁঠালবাড়ী	kanthalbariup.kurigram.gov.bd
8664	\N	Bhogdanga	ভোগডাঙ্গা	bhogdangaup.kurigram.gov.bd
8665	\N	Ramkhana	রামখানা	ramkhanaup.kurigram.gov.bd
8666	\N	Raigonj	রায়গঞ্জ	raigonjup.kurigram.gov.bd
8667	\N	Bamondanga	বামনডাঙ্গা	bamondangaup.kurigram.gov.bd
8668	\N	Berubari	বেরুবাড়ী	berubariup.kurigram.gov.bd
8669	\N	Sontaspur	সন্তোষপুর	sontaspurup.kurigram.gov.bd
8670	\N	Hasnabad	হাসনাবাদ	hasnabadup.kurigram.gov.bd
8671	\N	Newyashi	নেওয়াশী	newyashiup.kurigram.gov.bd
8672	\N	Bhitorbond	ভিতরবন্দ	bhitorbondup.kurigram.gov.bd
8673	\N	Kaligonj	কালীগঞ্জ	kaligonjup.kurigram.gov.bd
8674	\N	Noonkhawa	নুনখাওয়া	noonkhawaup.kurigram.gov.bd
8675	\N	Narayanpur	নারায়নপুর	narayanpurup.kurigram.gov.bd
8676	\N	Kedar	কেদার	kedarup.kurigram.gov.bd
8677	\N	Kachakata	কঁচাকাঁটা	kachakataup.kurigram.gov.bd
8678	\N	Bollobherkhas	বল্লভেরখাস	bollobherkhasup.kurigram.gov.bd
8679	\N	Pathordubi	পাথরডুবি	pathordubiup.kurigram.gov.bd
8680	\N	Shilkhuri	শিলখুড়ি	shilkhuriup.kurigram.gov.bd
8681	\N	Tilai	তিলাই	tilaiup.kurigram.gov.bd
8682	\N	Paikarchara	পাইকেরছড়া	paikarcharaup.kurigram.gov.bd
8683	\N	Bhurungamari	ভূরুঙ্গামারী	bhurungamariup.kurigram.gov.bd
8684	\N	Joymonirhat	জয়মনিরহাট	joymonirhatup.kurigram.gov.bd
8685	\N	Andharirjhar	আন্ধারীরঝাড়	andharirjharup.kurigram.gov.bd
8686	\N	Char-Bhurungamari	চর-ভূরুঙ্গামারী	charbhurungamariup.kurigram.gov.bd
8687	\N	Bangasonahat	বঙ্গসোনাহাট	bangasonahatup.kurigram.gov.bd
8688	\N	Boldia	বলদিয়া	boldiaup.kurigram.gov.bd
8689	\N	Nawdanga	নাওডাঙ্গা	nawdangaup.kurigram.gov.bd
8690	\N	Shimulbari	শিমুলবাড়ী	shimulbariup.kurigram.gov.bd
8691	\N	Phulbari	ফুলবাড়ী	phulbariup.kurigram.gov.bd
8692	\N	Baravita	বড়ভিটা	baravitaup.kurigram.gov.bd
8693	\N	Bhangamor	ভাঙ্গামোড়	bhangamorup.kurigram.gov.bd
8694	\N	Kashipur	কাশিপুর	kashipurup.kurigram.gov.bd
8695	\N	Chinai	ছিনাই	chinaiup.kurigram.gov.bd
8696	\N	Rajarhat	রাজারহাট	rajarhatup.kurigram.gov.bd
8697	\N	Nazimkhan	নাজিমখাঁন	nazimkhanup.kurigram.gov.bd
8698	\N	Gharialdanga	ঘড়িয়ালডাঙ্গা	gharialdangaup.kurigram.gov.bd
8699	\N	Chakirpashar	চাকিরপশার	chakirpasharup.kurigram.gov.bd
8700	\N	Biddanondo	বিদ্যানন্দ	biddanondoup.kurigram.gov.bd
8701	\N	Umarmajid	উমর মজিদ	umarmajidup.kurigram.gov.bd
8702	\N	Daldalia	দলদলিয়া	daldaliaup.kurigram.gov.bd
8703	\N	Durgapur	দুর্গাপুর	durgapurup.kurigram.gov.bd
8704	\N	Pandul	পান্ডুল	pandulup.kurigram.gov.bd
8705	\N	Buraburi	বুড়াবুড়ী	buraburiup.kurigram.gov.bd
8706	\N	Dharanibari	ধরণীবাড়ী	dharanibariup.kurigram.gov.bd
8707	\N	Dhamsreni	ধামশ্রেণী	dhamsreniup.kurigram.gov.bd
8708	\N	Gunaigas	গুনাইগাছ	gunaigasup.kurigram.gov.bd
8709	\N	Bazra	বজরা	bazraup.kurigram.gov.bd
8710	\N	Tobockpur	তবকপুর	tobockpurup.kurigram.gov.bd
8711	\N	Hatia	হাতিয়া	hatiaup.kurigram.gov.bd
8712	\N	Begumgonj	বেগমগঞ্জ	begumgonjup.kurigram.gov.bd
8713	\N	Shahabiar Alga	সাহেবের আলগা	shahabiaralgaup.kurigram.gov.bd
8714	\N	Thetrai	থেতরাই	thetraiup.kurigram.gov.bd
8715	\N	Ranigonj	রাণীগঞ্জ	ranigonjup.kurigram.gov.bd
8716	\N	Nayarhat	নয়ারহাট	nayarhatup.kurigram.gov.bd
8717	\N	Thanahat	থানাহাট	thanahatup.kurigram.gov.bd
8718	\N	Ramna	রমনা	ramnaup.kurigram.gov.bd
8719	\N	Chilmari	চিলমারী	chilmariup.kurigram.gov.bd
8720	\N	Austomirchar	অষ্টমীর চর	austomircharup.kurigram.gov.bd
8721	\N	Dadevanga	দাঁতভাঙ্গা	dadevangaup.kurigram.gov.bd
8722	\N	Shoulemari	শৌলমারী	shoulemariup.kurigram.gov.bd
8723	\N	Bondober	বন্দবেড়	bondoberup.kurigram.gov.bd
8724	\N	Rowmari	রৌমারী	rowmariup.kurigram.gov.bd
8725	\N	Jadurchar	যাদুরচর	jadurcharup.kurigram.gov.bd
8726	\N	Rajibpur	রাজিবপুর	rajibpurup.kurigram.gov.bd
8727	\N	Kodalkati	কোদালকাটি	kodalkatiup.kurigram.gov.bd
8728	\N	Mohongonj	মোহনগঞ্জ	mohongonjup.kurigram.gov.bd
8729	\N	Kamararchor	কামারের চর	kamararchorup.sherpur.gov.bd
8730	\N	Chorsherpur	চরশেরপুর	chorsherpurup.sherpur.gov.bd
8731	\N	Bajitkhila	বাজিতখিলা	bajitkhilaup.sherpur.gov.bd
8732	\N	Gajir Khamar	গাজির খামার	gajirkhamarup.sherpur.gov.bd
8733	\N	Dhola	ধলা	dholaup.sherpur.gov.bd
8734	\N	Pakuriya	পাকুরিয়া	pakuriyaup.sherpur.gov.bd
8735	\N	Vatshala	ভাতশালা	vatshalaup.sherpur.gov.bd
8736	\N	Losmonpur	লছমনপুর	losmonpurup.sherpur.gov.bd
8737	\N	Rouha	রৌহা	rouhaup.sherpur.gov.bd
8738	\N	Kamariya	কামারিয়া	kamariyaup.sherpur.gov.bd
8739	\N	Chor Mochoriya	চর মোচারিয়া	chormochoriyaup.sherpur.gov.bd
8740	\N	Chorpokhimari	চর পক্ষীমারি	chorpokhimariup.sherpur.gov.bd
8741	\N	Betmari Ghughurakandi	বেতমারি ঘুঘুরাকান্দি	betmarighughurakandiup.sherpur.gov.bd
8742	\N	Balairchar	বলাইরচর	balaircharup.sherpur.gov.bd
8743	\N	Puraga	পোড়াগাও	puragauup.sherpur.gov.bd
8744	\N	Nonni	নন্নী	nonniup.sherpur.gov.bd
8745	\N	Morichpuran	মরিচপুরাণ	morichpuranup.sherpur.gov.bd
8746	\N	Rajnogor	রাজনগর	rajnogorup.sherpur.gov.bd
8747	\N	Nayabil	নয়াবীল	nayabilup.sherpur.gov.bd
8748	\N	Ramchondrokura	রামচন্দ্রকুড়া	ramchondrokuraup.sherpur.gov.bd
8749	\N	Kakorkandhi	কাকরকান্দি	kakorkandhiup.sherpur.gov.bd
8750	\N	Nalitabari	নালিতাবাড়ী	nalitabariup.sherpur.gov.bd
8751	\N	Juganiya	যোগনীয়া	juganiyaup.sherpur.gov.bd
8752	\N	Bagber	বাঘবেড়	bagberup.sherpur.gov.bd
8753	\N	Koloshpar	কলসপাড়	koloshparup.sherpur.gov.bd
8754	\N	Rupnarayankura	রূপনারায়নকুড়া	rupnarayankuraup.sherpur.gov.bd
8755	\N	Ranishimul	রানীশিমুল	ranishimulup.sherpur.gov.bd
8756	\N	Singabaruna	সিংগাবরুনা	singabarunaup.sherpur.gov.bd
8757	\N	Kakilakura	কাকিলাকুড়া	kakilakuraup.sherpur.gov.bd
8758	\N	Tatihati	তাতীহাটি	tatihatiup.sherpur.gov.bd
8759	\N	Gosaipur	গোশাইপুর	gosaipurup.sherpur.gov.bd
8760	\N	Sreebordi	শ্রীবরদী	sreebordiup.sherpur.gov.bd
8761	\N	Bhelua	ভেলুয়া	bheluaup.sherpur.gov.bd
8762	\N	Kharia Kazirchar	খড়িয়া কাজিরচর	khariakazircharup.sherpur.gov.bd
8763	\N	Kurikahonia	কুড়িকাহনিয়া	kurikahoniaup.sherpur.gov.bd
8764	\N	Garjaripa	গড়জরিপা	garjaripaup.sherpur.gov.bd
8765	\N	Gonopoddi	গণপদ্দী	gonopoddiup.sherpur.gov.bd
8766	\N	Nokla	নকলা	noklaup.sherpur.gov.bd
8767	\N	Urpha	উরফা	urphaup.sherpur.gov.bd
8768	\N	Gourdwar	গৌড়দ্বার	gourdwarup.sherpur.gov.bd
8769	\N	Baneshwardi	বানেশ্বর্দী	baneshwardiup.sherpur.gov.bd
8770	\N	Pathakata	পাঠাকাটা	pathakataup.sherpur.gov.bd
8771	\N	Talki	টালকী	talkiup.sherpur.gov.bd
8772	\N	Choraustadhar	চরঅষ্টধর	choraustadharup.sherpur.gov.bd
8773	\N	Chandrakona	চন্দ্রকোনা	chandrakonaup.sherpur.gov.bd
8774	\N	Kansa	কাংশা	kansaup.sherpur.gov.bd
8775	\N	Dansail	ধানশাইল	dansailup.sherpur.gov.bd
8776	\N	Nolkura	নলকুড়া	nolkuraup.sherpur.gov.bd
8777	\N	Gouripur	গৌরিপুর	gouripurup.sherpur.gov.bd
8778	\N	Jhenaigati	ঝিনাইগাতী	jhenaigatiup.sherpur.gov.bd
8779	\N	Hatibandha	হাতিবান্দা	hatibandhaup.sherpur.gov.bd
8780	\N	Malijhikanda	মালিঝিকান্দা	malijhikandaup.sherpur.gov.bd
8781	\N	Deukhola	দেওখোলা	deukholaup.mymensingh.gov.bd
8782	\N	Naogaon	নাওগাঁও	naogaonup.mymensingh.gov.bd
8783	\N	Putijana	পুটিজানা	putijanaup.mymensingh.gov.bd
8784	\N	Kushmail	কুশমাইল	kushmailup.mymensingh.gov.bd
8785	\N	Fulbaria	ফুলবাড়ীয়া	fulbariaup.mymensingh.gov.bd
8786	\N	Bakta	বাক্তা	baktaup.mymensingh.gov.bd
8787	\N	Rangamatia	রাঙ্গামাটিয়া	rangamatiaup.mymensingh.gov.bd
8788	\N	Enayetpur	এনায়েতপুর	enayetpurup.mymensingh.gov.bd
8789	\N	Kaladaha	কালাদহ	kaladahaup.mymensingh.gov.bd
8790	\N	Radhakanai	রাধাকানাই	radhakanaiup.mymensingh.gov.bd
8791	\N	Asimpatuli	আছিমপাটুলী	asimpatuliup.mymensingh.gov.bd
8792	\N	Vobanipur	ভবানীপুর	vobanipurup.mymensingh.gov.bd
8793	\N	Balian	বালিয়ান	balianup.mymensingh.gov.bd
8794	\N	Dhanikhola	ধানীখোলা	dhanikholaup.mymensingh.gov.bd
8795	\N	Bailor	বৈলর	bailorup.mymensingh.gov.bd
8796	\N	Kanthal	কাঁঠাল	kanthalup.mymensingh.gov.bd
8797	\N	Kanihari	কানিহারী	kanihariup.mymensingh.gov.bd
8798	\N	Trishal	ত্রিশাল	trishalup.mymensingh.gov.bd
8799	\N	Harirampur	হরিরামপুর	harirampurup.mymensingh.gov.bd
8800	\N	Sakhua	সাখুয়া	www.sakhuaup.mymensingh.gov.bd
8801	\N	Balipara	বালিপাড়া	baliparaup.mymensingh.gov.bd
8802	\N	Mokshapur	মোক্ষপুর	mokshapurup.mymensingh.gov.bd
8803	\N	Mathbari	মঠবাড়ী	mathbariup.mymensingh.gov.bd
8804	\N	Amirabari	আমিরাবাড়ী	amirabariup.mymensingh.gov.bd
8805	\N	Rampur	রামপুর	rampurup.mymensingh.gov.bd
8806	\N	Uthura	উথুরা	uthuraup.mymensingh.gov.bd
8807	\N	Meduari	মেদুয়ারী	meduariup.mymensingh.gov.bd
8808	\N	Varadoba	ভরাডোবা	varadobaup.mymensingh.gov.bd
8809	\N	Dhitpur	ধীতপুর	dhitpurup.mymensingh.gov.bd
8810	\N	Dakatia	ডাকাতিয়া	dakatiaup.mymensingh.gov.bd
8811	\N	Birunia	বিরুনিয়া	biruniaup.mymensingh.gov.bd
8812	\N	Bhaluka	ভালুকা	bhalukaup.mymensingh.gov.bd
8813	\N	Mallikbari	মল্লিকবাড়ী	mallikbariup.mymensingh.gov.bd
8814	\N	Kachina	কাচিনা	kachinaup.mymensingh.gov.bd
8815	\N	Habirbari	হবিরবাড়ী	habirbariup.mymensingh.gov.bd
8816	\N	Rajoi	রাজৈ	rajoiup.mymensingh.gov.bd
8817	\N	Dulla	দুল্লা	dullaup.mymensingh.gov.bd
8818	\N	Borogram	বড়গ্রাম	borogramup.mymensingh.gov.bd
8819	\N	Tarati	তারাটি	taratiup.mymensingh.gov.bd
8820	\N	Kumargata	কুমারগাতা	kumargataup.mymensingh.gov.bd
8821	\N	Basati	বাশাটি	basatiup.mymensingh.gov.bd
8822	\N	Mankon	মানকোন	mankonup.mymensingh.gov.bd
8823	\N	Ghoga	ঘোগা	ghogaup.mymensingh.gov.bd
8824	\N	Daogaon	দাওগাঁও	daogaonup.mymensingh.gov.bd
8825	\N	Kashimpur	কাশিমপুর	kashimpurup.mymensingh.gov.bd
8826	\N	Kheruajani	খেরুয়াজানী	kheruajaniup.mymensingh.gov.bd
8827	\N	Austadhar	অষ্টধার	austadharup.mymensingh.gov.bd
8828	\N	Bororchar	বোররচর	bororcharup.mymensingh.gov.bd
8829	\N	Dapunia	দাপুনিয়া	dapuniaup.mymensingh.gov.bd
8830	\N	Aqua	আকুয়া	aquaup.mymensingh.gov.bd
8831	\N	Khagdohor	খাগডহর	khagdohorup.mymensingh.gov.bd
8832	\N	Charnilaxmia	চরনিলক্ষিয়া	charnilaxmiaup.mymensingh.gov.bd
8833	\N	Kushtia	কুষ্টিয়া	kushtiaup.mymensingh.gov.bd
8834	\N	Paranganj	পরানগঞ্জ	paranganjup.mymensingh.gov.bd
8835	\N	Sirta	সিরতা	sirtaup.mymensingh.gov.bd
8836	\N	Char Ishwardia	চর ঈশ্বরদিয়া	charishwardiaup.mymensingh.gov.bd
8837	\N	Ghagra	ঘাগড়া	ghagraup.mymensingh.gov.bd
8838	\N	Vabokhali	ভাবখালী	vabokhaliup.mymensingh.gov.bd
8839	\N	Boyra	বয়ড়া	boyraup.mymensingh.gov.bd
8840	\N	Dakshin Maijpara	দক্ষিণ মাইজপাড়া	dakshinmaijparaup.mymensingh.gov.bd
8841	\N	Gamaritola	গামারীতলা	gamaritolaup.mymensingh.gov.bd
8842	\N	Dhobaura	ধোবাউড়া	dhobauraup.mymensingh.gov.bd
8843	\N	Porakandulia	পোড়াকান্দুলিয়া	porakanduliaup.mymensingh.gov.bd
8844	\N	Goatala	গোয়াতলা	goatalaup.mymensingh.gov.bd
8845	\N	Ghoshgaon	ঘোষগাঁও	ghoshgaonup.mymensingh.gov.bd
8846	\N	Baghber	বাঘবেড়	baghberup.mymensingh.gov.bd
8847	\N	Rambhadrapur	রামভদ্রপুর	rambhadrapurup.mymensingh.gov.bd
8848	\N	Sondhara	ছনধরা	sondharaup.mymensingh.gov.bd
8849	\N	Vaitkandi	ভাইটকান্দি	vaitkandiup.mymensingh.gov.bd
8850	\N	Singheshwar	সিংহেশ্বর	singheshwarup.mymensingh.gov.bd
8851	\N	Phulpur	ফুলপুর	phulpurup.mymensingh.gov.bd
8852	\N	Banihala	বানিহালা	banihalaup.mymensingh.gov.bd
8853	\N	Biska	বিস্কা	biskaup.mymensingh.gov.bd
8854	\N	Baola	বওলা	baolaup.mymensingh.gov.bd
8855	\N	Payari	পয়ারী	payariup.mymensingh.gov.bd
8856	\N	Balia	বালিয়া	baliaup.mymensingh.gov.bd
8857	\N	Rahimganj	রহিমগঞ্জ	rahimganjup.mymensingh.gov.bd
8858	\N	Balikha	বালিখা	balikhaup.mymensingh.gov.bd
8859	\N	Kakni	কাকনী	kakniup.mymensingh.gov.bd
8860	\N	Dhakua	ঢাকুয়া	dhakuaup.mymensingh.gov.bd
8861	\N	Rupasi	রূপসী	rupasiup.mymensingh.gov.bd
8862	\N	Tarakanda	তারাকান্দা	tarakandaup.mymensingh.gov.bd
8863	\N	Galagaon	গালাগাঁও	galagaonup.mymensingh.gov.bd
8864	\N	Kamargaon	কামারগাঁও	kamargaonup.mymensingh.gov.bd
8865	\N	Kamaria	কামারিয়া	kamariaup.mymensingh.gov.bd
8866	\N	Rampur	রামপুর	rampurup2.mymensingh.gov.bd
8867	\N	Bhubankura	ভূবনকুড়া	bhubankuraup.mymensingh.gov.bd
8868	\N	Jugli	জুগলী	jugliup.mymensingh.gov.bd
8869	\N	Kaichapur	কৈচাপুর	kaichapurup.mymensingh.gov.bd
8870	\N	Haluaghat	হালুয়াঘাট	haluaghatup.mymensingh.gov.bd
8871	\N	Gazirbhita	গাজিরভিটা	gazirbhitaup.mymensingh.gov.bd
8872	\N	Bildora	বিলডোরা	bildoraup.mymensingh.gov.bd
8873	\N	Sakuai	শাকুয়াই	sakuaiup.mymensingh.gov.bd
8874	\N	Narail	নড়াইল	narailup.mymensingh.gov.bd
8875	\N	Dhara	ধারা	dharaup.mymensingh.gov.bd
8876	\N	Dhurail	ধুরাইল	dhurailup.mymensingh.gov.bd
8877	\N	Amtoil	আমতৈল	amtoilup.mymensingh.gov.bd
8878	\N	Swadeshi	স্বদেশী	swadeshiup.mymensingh.gov.bd
8879	\N	Sahanati	সহনাটি	sahanatiup.mymensingh.gov.bd
8880	\N	Achintapur	অচিন্তপুর	achintapurup.mymensingh.gov.bd
8881	\N	Mailakanda	মইলাকান্দা	mailakandaup.mymensingh.gov.bd
8882	\N	Bokainagar	বোকাইনগর	bokainagarup.mymensingh.gov.bd
8883	\N	Gouripur	গৌরীপুর	gouripurup.mymensingh.gov.bd
8884	\N	Maoha	মাওহা	maohaup.mymensingh.gov.bd
8885	\N	Ramgopalpur	রামগোপালপুর	ramgopalpurup.mymensingh.gov.bd
8886	\N	Douhakhola	ডৌহাখলা	douhakholaup.mymensingh.gov.bd
8887	\N	Bhangnamari	ভাংনামারী	bhangnamariup.mymensingh.gov.bd
8888	\N	Sidhla	সিধলা	sidhlaup.mymensingh.gov.bd
8889	\N	Rasulpur	রসুলপুর	rasulpurup.mymensingh.gov.bd
8890	\N	Barobaria	বারবারিয়া	barobariaup.mymensingh.gov.bd
8891	\N	Charalgi	চরআলগী	charalgiup.mymensingh.gov.bd
8892	\N	Saltia	সালটিয়া	saltiaup.mymensingh.gov.bd
8893	\N	Raona	রাওনা	raonaup.mymensingh.gov.bd
8894	\N	Longair	লংগাইর	longairup.mymensingh.gov.bd
8895	\N	Paithol	পাইথল	paitholup.mymensingh.gov.bd
8896	\N	Gafargaon	গফরগাঁও	gafargaonup.mymensingh.gov.bd
8897	\N	Josora	যশরা	josoraup.mymensingh.gov.bd
8898	\N	Moshakhali	মশাখালী	moshakhaliup.mymensingh.gov.bd
8899	\N	Panchbagh	পাঁচবাগ	panchbaghup.mymensingh.gov.bd
8900	\N	Usthi	উস্থি	usthiup.mymensingh.gov.bd
8901	\N	Dotterbazar	দত্তেরবাজার	dotterbazarup.mymensingh.gov.bd
8902	\N	Niguari	নিগুয়ারী	niguariup.mymensingh.gov.bd
8903	\N	Tangabo	টাংগাব	tangaboup.mymensingh.gov.bd
8904	\N	Iswarganj	ঈশ্বরগঞ্জ	iswarganjup.mymensingh.gov.bd
8905	\N	Sarisha	সরিষা	sarishaup.mymensingh.gov.bd
8906	\N	Sohagi	সোহাগী	sohagiup.mymensingh.gov.bd
8907	\N	Atharabari	আঠারবাড়ী	atharabariup.mymensingh.gov.bd
8908	\N	Rajibpur	রাজিবপুর	rajibpurup.mymensingh.gov.bd
8909	\N	Maijbagh	মাইজবাগ	maijbaghup.mymensingh.gov.bd
8910	\N	Magtula	মগটুলা	magtulaup.mymensingh.gov.bd
8911	\N	Jatia	জাটিয়া	jatiaup.mymensingh.gov.bd
8912	\N	Uchakhila	উচাখিলা	uchakhilaup.mymensingh.gov.bd
8913	\N	Tarundia	তারুন্দিয়া	tarundiaup.mymensingh.gov.bd
8914	\N	Barahit	বড়হিত	barahitup.mymensingh.gov.bd
8915	\N	Batagoir	বেতাগৈর	batagoirup.mymensingh.gov.bd
8916	\N	Nandail	নান্দাইল	nandailup.mymensingh.gov.bd
8917	\N	Chandipasha	চন্ডীপাশা	chandipashaup.mymensingh.gov.bd
8918	\N	Gangail	গাংগাইল	gangailup.mymensingh.gov.bd
8919	\N	Rajgati	রাজগাতী	rajgatiup.mymensingh.gov.bd
8920	\N	Muajjempur	মোয়াজ্জেমপুর	muajjempurup.mymensingh.gov.bd
8921	\N	Sherpur	শেরপুর	sherpurup.mymensingh.gov.bd
8922	\N	Singroil	সিংরইল	singroilup.mymensingh.gov.bd
8923	\N	Achargaon	আচারগাঁও	achargaonup.mymensingh.gov.bd
8924	\N	Mushulli	মুশুল্লী	mushulliup.mymensingh.gov.bd
8925	\N	Kharua	খারুয়া	kharuaup.mymensingh.gov.bd
8926	\N	Jahangirpur	জাহাঙ্গীরপুর	jahangirpurup.mymensingh.gov.bd
8927	\N	Kendua	কেন্দুয়া	kenduaup.jamalpur.gov.bd
8928	\N	Sharifpur	শরিফপুর	sharifpurup.jamalpur.gov.bd
8929	\N	Laxirchar	লক্ষীরচর	laxircharup.jamalpur.gov.bd
8930	\N	Tolshirchar	তুলশীরচর	tolshircharup.jamalpur.gov.bd
8931	\N	Itail	ইটাইল	itailup.jamalpur.gov.bd
8932	\N	Narundi	নরুন্দী	narundiup.jamalpur.gov.bd
8933	\N	Ghorada	ঘোড়াধাপ	ghoradapup.jamalpur.gov.bd
8934	\N	Bashchara	বাশঁচড়া	bashcharaup.jamalpur.gov.bd
8935	\N	Ranagacha	রানাগাছা	ranagachaup.jamalpur.gov.bd
8936	\N	Sheepur	শ্রীপুর	sheepurup.jamalpur.gov.bd
8937	\N	Shahbajpur	শাহবাজপুর	shahbajpurup.jamalpur.gov.bd
8938	\N	Titpalla	তিতপল্লা	titpallaup.jamalpur.gov.bd
8939	\N	Mesta	মেষ্টা	mestaup.jamalpur.gov.bd
8940	\N	Digpait	দিগপাইত	digpaitup.jamalpur.gov.bd
8941	\N	Rashidpur	রশিদপুর	rashidpurup.jamalpur.gov.bd
8942	\N	Durmot	দুরমুট	durmotup.jamalpur.gov.bd
8943	\N	Kulia	কুলিয়া	kuliaup.jamalpur.gov.bd
8944	\N	Mahmudpur	মাহমুদপুর	mahmudpurup.jamalpur.gov.bd
8945	\N	Nangla	নাংলা	nanglaup.jamalpur.gov.bd
8946	\N	Nayanagar	নয়ানগর	nayanagarup.jamalpur.gov.bd
8947	\N	Adra	আদ্রা	adraup.jamalpur.gov.bd
8948	\N	Charbani Pakuria	চরবানী পাকুরিয়া	charbanipakuriaup.jamalpur.gov.bd
8949	\N	Fulkucha	ফুলকোচা	fulkuchaup.jamalpur.gov.bd
8950	\N	Ghuserpara	ঘোষেরপাড়া	ghuserparaup.jamalpur.gov.bd
8951	\N	Jhaugara	ঝাউগড়া	jhaugaraup.jamalpur.gov.bd
8952	\N	Shuampur	শ্যামপুর	shuampurup.jamalpur.gov.bd
8953	\N	Kulkandi	কুলকান্দি	kulkandiup.jamalpur.gov.bd
8954	\N	Belghacha	বেলগাছা	belghachaup.jamalpur.gov.bd
8955	\N	Chinaduli	চিনাডুলী	chinaduliup.jamalpur.gov.bd
8956	\N	Shapdari	সাপধরী	shapdariup.jamalpur.gov.bd
8957	\N	Noarpara	নোয়ারপাড়া	noarparaup.jamalpur.gov.bd
8958	\N	Islampur	ইসলামপুর	islampurup.jamalpur.gov.bd
8959	\N	Partharshi	পাথশী	partharshiup.jamalpur.gov.bd
8960	\N	Palabandha	পলবান্ধা	palabandhaup.jamalpur.gov.bd
8961	\N	Gualerchar	গোয়ালেরচর	gualercharup.jamalpur.gov.bd
8962	\N	Gaibandha	গাইবান্ধা	gaibandhaup.jamalpur.gov.bd
8963	\N	Charputimari	চরপুটিমারী	charputimariup.jamalpur.gov.bd
8964	\N	Chargualini	চরগোয়ালীনি	chargualiniup.jamalpur.gov.bd
8965	\N	Dungdhara	ডাংধরা	dungdharaup.jamalpur.gov.bd
8966	\N	Char Amkhawa	চর আমখাওয়া	charamkhawaup.jamalpur.gov.bd
8967	\N	Parram Rampur	পাররাম রামপুর	parramrampurup.jamalpur.gov.bd
8968	\N	Hatibanga	হাতীভাঙ্গা	hatibangaup.jamalpur.gov.bd
8969	\N	Bahadurabad	বাহাদুরাবাদ	bahadurabadup.jamalpur.gov.bd
8970	\N	Chikajani	চিকাজানী	chikajaniup.jamalpur.gov.bd
8971	\N	Chukaibari	চুকাইবাড়ী	chukaibariup.jamalpur.gov.bd
8972	\N	Dewangonj	দেওয়ানগঞ্জ	dewangonjup.jamalpur.gov.bd
8973	\N	Satpoa	সাতপোয়া	satpoaup.jamalpur.gov.bd
8974	\N	Pogaldigha	পোগলদিঘা	pogaldighaup.jamalpur.gov.bd
8975	\N	Doail	ডোয়াইল	doailup.jamalpur.gov.bd
8976	\N	Aona	আওনা	aonaup.jamalpur.gov.bd
8977	\N	Pingna	পিংনা	pingnaup.jamalpur.gov.bd
8978	\N	Bhatara	ভাটারা	bhataraup.jamalpur.gov.bd
8979	\N	Kamrabad	কামরাবাদ	kamrabadup.jamalpur.gov.bd
8980	\N	Mahadan	মহাদান	mahadanup.jamalpur.gov.bd
8981	\N	Char Pakerdah	চর পাকেরদহ	charpakerdahup.jamalpur.gov.bd
8982	\N	Karaichara	কড়ইচড়া	karaicharaup.jamalpur.gov.bd
8983	\N	Gunaritala	গুনারীতলা	gunaritalaup.jamalpur.gov.bd
8984	\N	Balijuri	বালিজুড়ী	balijuriup.jamalpur.gov.bd
8985	\N	Jorekhali	জোড়খালী	jorekhaliup.jamalpur.gov.bd
8986	\N	Adarvita	আদারভিটা	adarvitaup.jamalpur.gov.bd
8987	\N	Sidhuli	সিধুলী	sidhuliup.jamalpur.gov.bd
8988	\N	Danua	ধানুয়া	danuaup.jamalpur.gov.bd
8989	\N	Bagarchar	বগারচর	bagarcharup.jamalpur.gov.bd
8990	\N	Battajore	বাট্রাজোড়	battajoreup.jamalpur.gov.bd
8991	\N	Shadurpara	সাধুরপাড়া	shadurparaup.jamalpur.gov.bd
8992	\N	Bakshigonj	বকসীগঞ্জ	bakshigonjup.jamalpur.gov.bd
8993	\N	Nilakhia	নিলক্ষিয়া	nilakhiaup.jamalpur.gov.bd
8994	\N	Merurchar	মেরুরচর	merurcharup.jamalpur.gov.bd
8995	\N	Asma	আসমা	asma.netrokona.gov.bd
8996	\N	Chhiram	চিরাম	chhiram.netrokona.gov.bd
8997	\N	Baushi	বাউশী	baushiup.netrokona.gov.bd
8998	\N	Barhatta	বারহাট্টা	barhattaup.netrokona.gov.bd
8999	\N	Raypur	রায়পুর	raypurup.netrokona.gov.bd
9000	\N	Sahata	সাহতা	sahataup.netrokona.gov.bd
9001	\N	Singdha	সিংধা	singdhaup.netrokona.gov.bd
9002	\N	Durgapur	দূর্গাপুর	durgapurup.netrokona.gov.bd
9003	\N	Kakoirgora	কাকৈরগড়া	kakoirgoraup.netrokona.gov.bd
9004	\N	Kullagora	কুল্লাগড়া	kullagoraup.netrokona.gov.bd
9005	\N	Chandigarh	চণ্ডিগড়	chandigarhup.netrokona.gov.bd
9006	\N	Birisiri	বিরিশিরি	birisiriup.netrokona.gov.bd
9007	\N	Bakaljora	বাকলজোড়া	bakaljoraup.netrokona.gov.bd
9008	\N	Gawkandia	গাঁওকান্দিয়া	gawkandiaup.netrokona.gov.bd
9009	\N	Asujia	আশুজিয়া	asujiaup.netrokona.gov.bd
9010	\N	Dalpa	দলপা	dalpaup.netrokona.gov.bd
9011	\N	Goraduba	গড়াডোবা	goradubaup.netrokona.gov.bd
9012	\N	Gonda	গণ্ডা	gondaup.netrokona.gov.bd
9013	\N	Sandikona	সান্দিকোনা	sandikonaup.netrokona.gov.bd
9014	\N	Maska	মাসকা	maskaup.netrokona.gov.bd
9015	\N	Bolaishimul	বলাইশিমুল	bolaishimulup.netrokona.gov.bd
9016	\N	Noapara	নওপাড়া	noaparaup.netrokona.gov.bd
9017	\N	Kandiura	কান্দিউড়া	kandiuraup.netrokona.gov.bd
9018	\N	Chirang	চিরাং	chirangup.netrokona.gov.bd
9019	\N	Roailbari Amtala	রোয়াইলবাড়ী আমতলা	roailbariamtalaup.netrokona.gov.bd
9020	\N	Paikura	পাইকুড়া	paikuraup.netrokona.gov.bd
9021	\N	Muzafarpur	মোজাফরপুর	muzafarpurup.netrokona.gov.bd
9022	\N	Shormushia	স্বরমুশিয়া	shormushiaup.netrokona.gov.bd
9023	\N	Shunoi	শুনই	shunoiup.netrokona.gov.bd
9024	\N	Lunesshor	লুনেশ্বর	lunesshorup.netrokona.gov.bd
9025	\N	Baniyajan	বানিয়াজান	baniyajanup.netrokona.gov.bd
9026	\N	Teligati	তেলিগাতী	teligatiup.netrokona.gov.bd
9027	\N	Duoj	দুওজ	duojup.netrokona.gov.bd
9028	\N	Sukhari	সুখারী	sukhariup.netrokona.gov.bd
9029	\N	Fathepur	ফতেপুর	fathepurup.netrokona.gov.bd
9030	\N	Nayekpur	নায়েকপুর	nayekpurup.netrokona.gov.bd
9031	\N	Teosree	তিয়শ্রী	teosreeup.netrokona.gov.bd
9032	\N	Magan	মাঘান	maganup.netrokona.gov.bd
9033	\N	Gobindasree	গেবিন্দশ্রী	gobindasreeup.netrokona.gov.bd
9034	\N	Madan	মদন	madanup.netrokona.gov.bd
9035	\N	Chandgaw	চানগাঁও	chandgawup.netrokona.gov.bd
9036	\N	Kytail	কাইটাল	kytailup.netrokona.gov.bd
9037	\N	Krishnapur	কৃষ্ণপুর	krishnapurup.netrokona.gov.bd
9038	\N	Nogor	নগর	nogorup.netrokona.gov.bd
9039	\N	Chakua	চাকুয়া	chakuaup.netrokona.gov.bd
9040	\N	Khaliajuri	খালিয়াজুরী	khaliajuriup.netrokona.gov.bd
9041	\N	Mendipur	মেন্দিপুর	mendipurup.netrokona.gov.bd
9042	\N	Gazipur	গাজীপুর	gazipurup.netrokona.gov.bd
9043	\N	Koilati	কৈলাটী	koilatiup.netrokona.gov.bd
9044	\N	Najirpur	নাজিরপুর	najirpurup.netrokona.gov.bd
9045	\N	Pogla	পোগলা	poglaup.netrokona.gov.bd
9046	\N	Kolmakanda	কলমাকান্দা	kolmakandaup.netrokona.gov.bd
9047	\N	Rongchati	রংছাতি	rongchatiup.netrokona.gov.bd
9048	\N	Lengura	লেংগুরা	lenguraup.netrokona.gov.bd
9049	\N	Borokhapon	বড়খাপন	borokhaponup.netrokona.gov.bd
9050	\N	Kharnoi	খারনৈ	kharnoiup.netrokona.gov.bd
9051	\N	Borokashia Birampur	বড়কাশিয়া বিরামপুর	borokashiabirampurup.netrokona.gov.bd
9052	\N	Borotoli Banihari	বড়তলী বানিহারী	borotolibanihariup.netrokona.gov.bd
9053	\N	Tetulia	তেতুলিয়া	tetuliaup.netrokona.gov.bd
9054	\N	Maghan Siadar	মাঘান সিয়াদার	maghansiadarup.netrokona.gov.bd
9055	\N	Somaj Sohildeo	সমাজ সহিলদেও	somajsohildeoup.netrokona.gov.bd
9056	\N	Suair	সুয়াইর	suairup.netrokona.gov.bd
9057	\N	Gaglajur	গাগলাজুর	gaglajurup.netrokona.gov.bd
9058	\N	Khalishaur	খলিশাউড়	khalishaurup.netrokona.gov.bd
9059	\N	Ghagra	ঘাগড়া	ghagraup.netrokona.gov.bd
9060	\N	Jaria	জারিয়া	jariaup.netrokona.gov.bd
9061	\N	Narandia	নারান্দিয়া	narandiaup.netrokona.gov.bd
9062	\N	Bishkakuni	বিশকাকুনী	bishkakuniup.netrokona.gov.bd
9063	\N	Bairaty	বৈরাটী	bairaty.netrokona.gov.bd
9064	\N	Hogla	হোগলা	hoglaup.netrokona.gov.bd
9065	\N	Gohalakanda	গোহালাকান্দা	gohalakandaup.netrokona.gov.bd
9066	\N	Dhalamulgaon	ধলামুলগাঁও	dhalamulgaonup.netrokona.gov.bd
9067	\N	Agia	আগিয়া	agia.netrokona.gov.bd
9068	\N	Purbadhala	পূর্বধলা	purbadhalaup.netrokona.gov.bd
9069	\N	Chollisha	চল্লিশা	chollishaup.netrokona.gov.bd
9070	\N	Kailati	কাইলাটি	kailatiup.netrokona.gov.bd
9071	\N	Dokkhin Bishiura	দক্ষিণ বিশিউড়া	dokkhinbishiuraup.netrokona.gov.bd
9072	\N	Modonpur	মদনপুর	modonpurup.netrokona.gov.bd
9073	\N	Amtola	আমতলা	amtolaup.netrokona.gov.bd
9074	\N	Lokkhiganj	লক্ষীগঞ্জ	lokkhiganj.netrokona.gov.bd
9075	\N	Singher Bangla	সিংহের বাংলা	singherbanglaup.netrokona.gov.bd
9076	\N	Thakurakona	ঠাকুরাকোণা	thakurakonaup.netrokona.gov.bd
9077	\N	Mougati	মৌগাতি	mougatiup.netrokona.gov.bd
9078	\N	Rouha	রৌহা	rouhaup.netrokona.gov.bd
9079	\N	Medni	মেদনী	medniup.netrokona.gov.bd
9080	\N	Kaliara Babragati	কালিয়ারা গাবরাগাতি	kaliaragabragatiup.netrokona.gov.bd
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
1	1	Debidwar	দেবিদ্বার	debidwar.comilla.gov.bd
2	1	Barura	বরুড়া	barura.comilla.gov.bd
3	1	Brahmanpara	ব্রাহ্মণপাড়া	brahmanpara.comilla.gov.bd
4	1	Chandina	চান্দিনা	chandina.comilla.gov.bd
5	1	Chauddagram	চৌদ্দগ্রাম	chauddagram.comilla.gov.bd
6	1	Daudkandi	দাউদকান্দি	daudkandi.comilla.gov.bd
7	1	Homna	হোমনা	homna.comilla.gov.bd
8	1	Laksam	লাকসাম	laksam.comilla.gov.bd
9	1	Muradnagar	মুরাদনগর	muradnagar.comilla.gov.bd
10	1	Nangalkot	নাঙ্গলকোট	nangalkot.comilla.gov.bd
11	1	Comilla Sadar	কুমিল্লা সদর	comillasadar.comilla.gov.bd
12	1	Meghna	মেঘনা	meghna.comilla.gov.bd
13	1	Monohargonj	মনোহরগঞ্জ	monohargonj.comilla.gov.bd
14	1	Sadarsouth	সদর দক্ষিণ	sadarsouth.comilla.gov.bd
15	1	Titas	তিতাস	titas.comilla.gov.bd
16	1	Burichang	বুড়িচং	burichang.comilla.gov.bd
17	1	Lalmai	লালমাই	lalmai.comilla.gov.bd
18	2	Chhagalnaiya	ছাগলনাইয়া	chhagalnaiya.feni.gov.bd
19	2	Feni Sadar	ফেনী সদর	sadar.feni.gov.bd
20	2	Sonagazi	সোনাগাজী	sonagazi.feni.gov.bd
21	2	Fulgazi	ফুলগাজী	fulgazi.feni.gov.bd
22	2	Parshuram	পরশুরাম	parshuram.feni.gov.bd
23	2	Daganbhuiyan	দাগনভূঞা	daganbhuiyan.feni.gov.bd
24	3	Brahmanbaria Sadar	ব্রাহ্মণবাড়িয়া সদর	sadar.brahmanbaria.gov.bd
25	3	Kasba	কসবা	kasba.brahmanbaria.gov.bd
26	3	Nasirnagar	নাসিরনগর	nasirnagar.brahmanbaria.gov.bd
27	3	Sarail	সরাইল	sarail.brahmanbaria.gov.bd
28	3	Ashuganj	আশুগঞ্জ	ashuganj.brahmanbaria.gov.bd
29	3	Akhaura	আখাউড়া	akhaura.brahmanbaria.gov.bd
30	3	Nabinagar	নবীনগর	nabinagar.brahmanbaria.gov.bd
31	3	Bancharampur	বাঞ্ছারামপুর	bancharampur.brahmanbaria.gov.bd
32	3	Bijoynagar	বিজয়নগর	bijoynagar.brahmanbaria.gov.bd
33	4	Rangamati Sadar	রাঙ্গামাটি সদর	sadar.rangamati.gov.bd
34	4	Kaptai	কাপ্তাই	kaptai.rangamati.gov.bd
35	4	Kawkhali	কাউখালী	kawkhali.rangamati.gov.bd
36	4	Baghaichari	বাঘাইছড়ি	baghaichari.rangamati.gov.bd
37	4	Barkal	বরকল	barkal.rangamati.gov.bd
38	4	Langadu	লংগদু	langadu.rangamati.gov.bd
39	4	Rajasthali	রাজস্থলী	rajasthali.rangamati.gov.bd
40	4	Belaichari	বিলাইছড়ি	belaichari.rangamati.gov.bd
41	4	Juraichari	জুরাছড়ি	juraichari.rangamati.gov.bd
42	4	Naniarchar	নানিয়ারচর	naniarchar.rangamati.gov.bd
43	5	Noakhali Sadar	নোয়াখালী সদর	sadar.noakhali.gov.bd
44	5	Companiganj	কোম্পানীগঞ্জ	companiganj.noakhali.gov.bd
45	5	Begumganj	বেগমগঞ্জ	begumganj.noakhali.gov.bd
46	5	Hatia	হাতিয়া	hatia.noakhali.gov.bd
47	5	Subarnachar	সুবর্ণচর	subarnachar.noakhali.gov.bd
48	5	Kabirhat	কবিরহাট	kabirhat.noakhali.gov.bd
49	5	Senbug	সেনবাগ	senbug.noakhali.gov.bd
50	5	Chatkhil	চাটখিল	chatkhil.noakhali.gov.bd
51	5	Sonaimori	সোনাইমুড়ী	sonaimori.noakhali.gov.bd
52	6	Haimchar	হাইমচর	haimchar.chandpur.gov.bd
53	6	Kachua	কচুয়া	kachua.chandpur.gov.bd
54	6	Shahrasti	শাহরাস্তি	shahrasti.chandpur.gov.bd
55	6	Chandpur Sadar	চাঁদপুর সদর	sadar.chandpur.gov.bd
56	6	Matlab South	মতলব দক্ষিণ	matlabsouth.chandpur.gov.bd
57	6	Hajiganj	হাজীগঞ্জ	hajiganj.chandpur.gov.bd
58	6	Matlab North	মতলব উত্তর	matlabnorth.chandpur.gov.bd
59	6	Faridgonj	ফরিদগঞ্জ	faridgonj.chandpur.gov.bd
60	7	Lakshmipur Sadar	লক্ষ্মীপুর সদর	sadar.lakshmipur.gov.bd
61	7	Kamalnagar	কমলনগর	kamalnagar.lakshmipur.gov.bd
62	7	Raipur	রায়পুর	raipur.lakshmipur.gov.bd
63	7	Ramgati	রামগতি	ramgati.lakshmipur.gov.bd
64	7	Ramganj	রামগঞ্জ	ramganj.lakshmipur.gov.bd
65	8	Rangunia	রাঙ্গুনিয়া	rangunia.chittagong.gov.bd
66	8	Sitakunda	সীতাকুন্ড	sitakunda.chittagong.gov.bd
67	8	Mirsharai	মীরসরাই	mirsharai.chittagong.gov.bd
68	8	Patiya	পটিয়া	patiya.chittagong.gov.bd
69	8	Sandwip	সন্দ্বীপ	sandwip.chittagong.gov.bd
70	8	Banshkhali	বাঁশখালী	banshkhali.chittagong.gov.bd
71	8	Boalkhali	বোয়ালখালী	boalkhali.chittagong.gov.bd
72	8	Anwara	আনোয়ারা	anwara.chittagong.gov.bd
73	8	Chandanaish	চন্দনাইশ	chandanaish.chittagong.gov.bd
74	8	Satkania	সাতকানিয়া	satkania.chittagong.gov.bd
75	8	Lohagara	লোহাগাড়া	lohagara.chittagong.gov.bd
76	8	Hathazari	হাটহাজারী	hathazari.chittagong.gov.bd
77	8	Fatikchhari	ফটিকছড়ি	fatikchhari.chittagong.gov.bd
78	8	Raozan	রাউজান	raozan.chittagong.gov.bd
79	8	Karnafuli	কর্ণফুলী	karnafuli.chittagong.gov.bd
80	9	Coxsbazar Sadar	কক্সবাজার সদর	sadar.coxsbazar.gov.bd
81	9	Chakaria	চকরিয়া	chakaria.coxsbazar.gov.bd
82	9	Kutubdia	কুতুবদিয়া	kutubdia.coxsbazar.gov.bd
83	9	Ukhiya	উখিয়া	ukhiya.coxsbazar.gov.bd
84	9	Moheshkhali	মহেশখালী	moheshkhali.coxsbazar.gov.bd
85	9	Pekua	পেকুয়া	pekua.coxsbazar.gov.bd
86	9	Ramu	রামু	ramu.coxsbazar.gov.bd
87	9	Teknaf	টেকনাফ	teknaf.coxsbazar.gov.bd
88	10	Khagrachhari Sadar	খাগড়াছড়ি সদর	sadar.khagrachhari.gov.bd
89	10	Dighinala	দিঘীনালা	dighinala.khagrachhari.gov.bd
90	10	Panchari	পানছড়ি	panchari.khagrachhari.gov.bd
91	10	Laxmichhari	লক্ষীছড়ি	laxmichhari.khagrachhari.gov.bd
92	10	Mohalchari	মহালছড়ি	mohalchari.khagrachhari.gov.bd
93	10	Manikchari	মানিকছড়ি	manikchari.khagrachhari.gov.bd
94	10	Ramgarh	রামগড়	ramgarh.khagrachhari.gov.bd
95	10	Matiranga	মাটিরাঙ্গা	matiranga.khagrachhari.gov.bd
96	10	Guimara	গুইমারা	guimara.khagrachhari.gov.bd
97	11	Bandarban Sadar	বান্দরবান সদর	sadar.bandarban.gov.bd
98	11	Alikadam	আলীকদম	alikadam.bandarban.gov.bd
99	11	Naikhongchhari	নাইক্ষ্যংছড়ি	naikhongchhari.bandarban.gov.bd
100	11	Rowangchhari	রোয়াংছড়ি	rowangchhari.bandarban.gov.bd
101	11	Lama	লামা	lama.bandarban.gov.bd
102	11	Ruma	রুমা	ruma.bandarban.gov.bd
103	11	Thanchi	থানচি	thanchi.bandarban.gov.bd
104	12	Belkuchi	বেলকুচি	belkuchi.sirajganj.gov.bd
105	12	Chauhali	চৌহালি	chauhali.sirajganj.gov.bd
106	12	Kamarkhand	কামারখন্দ	kamarkhand.sirajganj.gov.bd
107	12	Kazipur	কাজীপুর	kazipur.sirajganj.gov.bd
108	12	Raigonj	রায়গঞ্জ	raigonj.sirajganj.gov.bd
109	12	Shahjadpur	শাহজাদপুর	shahjadpur.sirajganj.gov.bd
110	12	Sirajganj Sadar	সিরাজগঞ্জ সদর	sirajganjsadar.sirajganj.gov.bd
111	12	Tarash	তাড়াশ	tarash.sirajganj.gov.bd
112	12	Ullapara	উল্লাপাড়া	ullapara.sirajganj.gov.bd
113	13	Sujanagar	সুজানগর	sujanagar.pabna.gov.bd
114	13	Ishurdi	ঈশ্বরদী	ishurdi.pabna.gov.bd
115	13	Bhangura	ভাঙ্গুড়া	bhangura.pabna.gov.bd
116	13	Pabna Sadar	পাবনা সদর	pabnasadar.pabna.gov.bd
117	13	Bera	বেড়া	bera.pabna.gov.bd
118	13	Atghoria	আটঘরিয়া	atghoria.pabna.gov.bd
119	13	Chatmohar	চাটমোহর	chatmohar.pabna.gov.bd
120	13	Santhia	সাঁথিয়া	santhia.pabna.gov.bd
121	13	Faridpur	ফরিদপুর	faridpur.pabna.gov.bd
122	14	Kahaloo	কাহালু	kahaloo.bogra.gov.bd
123	14	Bogra Sadar	বগুড়া সদর	sadar.bogra.gov.bd
124	14	Shariakandi	সারিয়াকান্দি	shariakandi.bogra.gov.bd
125	14	Shajahanpur	শাজাহানপুর	shajahanpur.bogra.gov.bd
126	14	Dupchanchia	দুপচাচিঁয়া	dupchanchia.bogra.gov.bd
127	14	Adamdighi	আদমদিঘি	adamdighi.bogra.gov.bd
128	14	Nondigram	নন্দিগ্রাম	nondigram.bogra.gov.bd
129	14	Sonatala	সোনাতলা	sonatala.bogra.gov.bd
130	14	Dhunot	ধুনট	dhunot.bogra.gov.bd
131	14	Gabtali	গাবতলী	gabtali.bogra.gov.bd
132	14	Sherpur	শেরপুর	sherpur.bogra.gov.bd
133	14	Shibganj	শিবগঞ্জ	shibganj.bogra.gov.bd
134	15	Paba	পবা	paba.rajshahi.gov.bd
135	15	Durgapur	দুর্গাপুর	durgapur.rajshahi.gov.bd
136	15	Mohonpur	মোহনপুর	mohonpur.rajshahi.gov.bd
137	15	Charghat	চারঘাট	charghat.rajshahi.gov.bd
138	15	Puthia	পুঠিয়া	puthia.rajshahi.gov.bd
139	15	Bagha	বাঘা	bagha.rajshahi.gov.bd
140	15	Godagari	গোদাগাড়ী	godagari.rajshahi.gov.bd
141	15	Tanore	তানোর	tanore.rajshahi.gov.bd
142	15	Bagmara	বাগমারা	bagmara.rajshahi.gov.bd
143	16	Natore Sadar	নাটোর সদর	natoresadar.natore.gov.bd
144	16	Singra	সিংড়া	singra.natore.gov.bd
145	16	Baraigram	বড়াইগ্রাম	baraigram.natore.gov.bd
146	16	Bagatipara	বাগাতিপাড়া	bagatipara.natore.gov.bd
147	16	Lalpur	লালপুর	lalpur.natore.gov.bd
148	16	Gurudaspur	গুরুদাসপুর	gurudaspur.natore.gov.bd
149	16	Naldanga	নলডাঙ্গা	naldanga.natore.gov.bd
150	17	Akkelpur	আক্কেলপুর	akkelpur.joypurhat.gov.bd
151	17	Kalai	কালাই	kalai.joypurhat.gov.bd
152	17	Khetlal	ক্ষেতলাল	khetlal.joypurhat.gov.bd
153	17	Panchbibi	পাঁচবিবি	panchbibi.joypurhat.gov.bd
154	17	Joypurhat Sadar	জয়পুরহাট সদর	joypurhatsadar.joypurhat.gov.bd
155	18	Chapainawabganj Sadar	চাঁপাইনবাবগঞ্জ সদর	chapainawabganjsadar.chapainawabganj.gov.bd
156	18	Gomostapur	গোমস্তাপুর	gomostapur.chapainawabganj.gov.bd
157	18	Nachol	নাচোল	nachol.chapainawabganj.gov.bd
158	18	Bholahat	ভোলাহাট	bholahat.chapainawabganj.gov.bd
159	18	Shibganj	শিবগঞ্জ	shibganj.chapainawabganj.gov.bd
160	19	Mohadevpur	মহাদেবপুর	mohadevpur.naogaon.gov.bd
161	19	Badalgachi	বদলগাছী	badalgachi.naogaon.gov.bd
162	19	Patnitala	পত্নিতলা	patnitala.naogaon.gov.bd
163	19	Dhamoirhat	ধামইরহাট	dhamoirhat.naogaon.gov.bd
164	19	Niamatpur	নিয়ামতপুর	niamatpur.naogaon.gov.bd
165	19	Manda	মান্দা	manda.naogaon.gov.bd
166	19	Atrai	আত্রাই	atrai.naogaon.gov.bd
167	19	Raninagar	রাণীনগর	raninagar.naogaon.gov.bd
168	19	Naogaon Sadar	নওগাঁ সদর	naogaonsadar.naogaon.gov.bd
169	19	Porsha	পোরশা	porsha.naogaon.gov.bd
170	19	Sapahar	সাপাহার	sapahar.naogaon.gov.bd
171	20	Manirampur	মণিরামপুর	manirampur.jessore.gov.bd
172	20	Abhaynagar	অভয়নগর	abhaynagar.jessore.gov.bd
173	20	Bagherpara	বাঘারপাড়া	bagherpara.jessore.gov.bd
174	20	Chougachha	চৌগাছা	chougachha.jessore.gov.bd
175	20	Jhikargacha	ঝিকরগাছা	jhikargacha.jessore.gov.bd
176	20	Keshabpur	কেশবপুর	keshabpur.jessore.gov.bd
177	20	Jessore Sadar	যশোর সদর	sadar.jessore.gov.bd
178	20	Sharsha	শার্শা	sharsha.jessore.gov.bd
179	21	Assasuni	আশাশুনি	assasuni.satkhira.gov.bd
180	21	Debhata	দেবহাটা	debhata.satkhira.gov.bd
181	21	Kalaroa	কলারোয়া	kalaroa.satkhira.gov.bd
182	21	Satkhira Sadar	সাতক্ষীরা সদর	satkhirasadar.satkhira.gov.bd
183	21	Shyamnagar	শ্যামনগর	shyamnagar.satkhira.gov.bd
184	21	Tala	তালা	tala.satkhira.gov.bd
185	21	Kaliganj	কালিগঞ্জ	kaliganj.satkhira.gov.bd
186	22	Mujibnagar	মুজিবনগর	mujibnagar.meherpur.gov.bd
187	22	Meherpur Sadar	মেহেরপুর সদর	meherpursadar.meherpur.gov.bd
188	22	Gangni	গাংনী	gangni.meherpur.gov.bd
189	23	Narail Sadar	নড়াইল সদর	narailsadar.narail.gov.bd
190	23	Lohagara	লোহাগড়া	lohagara.narail.gov.bd
191	23	Kalia	কালিয়া	kalia.narail.gov.bd
192	24	Chuadanga Sadar	চুয়াডাঙ্গা সদর	chuadangasadar.chuadanga.gov.bd
193	24	Alamdanga	আলমডাঙ্গা	alamdanga.chuadanga.gov.bd
194	24	Damurhuda	দামুড়হুদা	damurhuda.chuadanga.gov.bd
195	24	Jibannagar	জীবননগর	jibannagar.chuadanga.gov.bd
196	25	Kushtia Sadar	কুষ্টিয়া সদর	kushtiasadar.kushtia.gov.bd
197	25	Kumarkhali	কুমারখালী	kumarkhali.kushtia.gov.bd
198	25	Khoksa	খোকসা	khoksa.kushtia.gov.bd
199	25	Mirpur	মিরপুর	mirpurkushtia.kushtia.gov.bd
200	25	Daulatpur	দৌলতপুর	daulatpur.kushtia.gov.bd
201	25	Bheramara	ভেড়ামারা	bheramara.kushtia.gov.bd
202	26	Shalikha	শালিখা	shalikha.magura.gov.bd
203	26	Sreepur	শ্রীপুর	sreepur.magura.gov.bd
204	26	Magura Sadar	মাগুরা সদর	magurasadar.magura.gov.bd
205	26	Mohammadpur	মহম্মদপুর	mohammadpur.magura.gov.bd
206	27	Paikgasa	পাইকগাছা	paikgasa.khulna.gov.bd
207	27	Fultola	ফুলতলা	fultola.khulna.gov.bd
208	27	Digholia	দিঘলিয়া	digholia.khulna.gov.bd
209	27	Rupsha	রূপসা	rupsha.khulna.gov.bd
210	27	Terokhada	তেরখাদা	terokhada.khulna.gov.bd
211	27	Dumuria	ডুমুরিয়া	dumuria.khulna.gov.bd
212	27	Botiaghata	বটিয়াঘাটা	botiaghata.khulna.gov.bd
213	27	Dakop	দাকোপ	dakop.khulna.gov.bd
214	27	Koyra	কয়রা	koyra.khulna.gov.bd
215	28	Fakirhat	ফকিরহাট	fakirhat.bagerhat.gov.bd
216	28	Bagerhat Sadar	বাগেরহাট সদর	sadar.bagerhat.gov.bd
217	28	Mollahat	মোল্লাহাট	mollahat.bagerhat.gov.bd
218	28	Sarankhola	শরণখোলা	sarankhola.bagerhat.gov.bd
219	28	Rampal	রামপাল	rampal.bagerhat.gov.bd
220	28	Morrelganj	মোড়েলগঞ্জ	morrelganj.bagerhat.gov.bd
221	28	Kachua	কচুয়া	kachua.bagerhat.gov.bd
222	28	Mongla	মোংলা	mongla.bagerhat.gov.bd
223	28	Chitalmari	চিতলমারী	chitalmari.bagerhat.gov.bd
224	29	Jhenaidah Sadar	ঝিনাইদহ সদর	sadar.jhenaidah.gov.bd
225	29	Shailkupa	শৈলকুপা	shailkupa.jhenaidah.gov.bd
226	29	Harinakundu	হরিণাকুন্ডু	harinakundu.jhenaidah.gov.bd
227	29	Kaliganj	কালীগঞ্জ	kaliganj.jhenaidah.gov.bd
228	29	Kotchandpur	কোটচাঁদপুর	kotchandpur.jhenaidah.gov.bd
229	29	Moheshpur	মহেশপুর	moheshpur.jhenaidah.gov.bd
230	30	Jhalakathi Sadar	ঝালকাঠি সদর	sadar.jhalakathi.gov.bd
231	30	Kathalia	কাঠালিয়া	kathalia.jhalakathi.gov.bd
232	30	Nalchity	নলছিটি	nalchity.jhalakathi.gov.bd
233	30	Rajapur	রাজাপুর	rajapur.jhalakathi.gov.bd
234	31	Bauphal	বাউফল	bauphal.patuakhali.gov.bd
235	31	Patuakhali Sadar	পটুয়াখালী সদর	sadar.patuakhali.gov.bd
236	31	Dumki	দুমকি	dumki.patuakhali.gov.bd
237	31	Dashmina	দশমিনা	dashmina.patuakhali.gov.bd
238	31	Kalapara	কলাপাড়া	kalapara.patuakhali.gov.bd
239	31	Mirzaganj	মির্জাগঞ্জ	mirzaganj.patuakhali.gov.bd
240	31	Galachipa	গলাচিপা	galachipa.patuakhali.gov.bd
241	31	Rangabali	রাঙ্গাবালী	rangabali.patuakhali.gov.bd
242	32	Pirojpur Sadar	পিরোজপুর সদর	sadar.pirojpur.gov.bd
243	32	Nazirpur	নাজিরপুর	nazirpur.pirojpur.gov.bd
244	32	Kawkhali	কাউখালী	kawkhali.pirojpur.gov.bd
245	32	Zianagar	জিয়ানগর	zianagar.pirojpur.gov.bd
246	32	Bhandaria	ভান্ডারিয়া	bhandaria.pirojpur.gov.bd
247	32	Mathbaria	মঠবাড়ীয়া	mathbaria.pirojpur.gov.bd
248	32	Nesarabad	নেছারাবাদ	nesarabad.pirojpur.gov.bd
249	33	Barisal Sadar	বরিশাল সদর	barisalsadar.barisal.gov.bd
250	33	Bakerganj	বাকেরগঞ্জ	bakerganj.barisal.gov.bd
251	33	Babuganj	বাবুগঞ্জ	babuganj.barisal.gov.bd
252	33	Wazirpur	উজিরপুর	wazirpur.barisal.gov.bd
253	33	Banaripara	বানারীপাড়া	banaripara.barisal.gov.bd
254	33	Gournadi	গৌরনদী	gournadi.barisal.gov.bd
255	33	Agailjhara	আগৈলঝাড়া	agailjhara.barisal.gov.bd
256	33	Mehendiganj	মেহেন্দিগঞ্জ	mehendiganj.barisal.gov.bd
257	33	Muladi	মুলাদী	muladi.barisal.gov.bd
258	33	Hizla	হিজলা	hizla.barisal.gov.bd
259	34	Bhola Sadar	ভোলা সদর	sadar.bhola.gov.bd
260	34	Borhan Sddin	বোরহান উদ্দিন	borhanuddin.bhola.gov.bd
261	34	Charfesson	চরফ্যাশন	charfesson.bhola.gov.bd
262	34	Doulatkhan	দৌলতখান	doulatkhan.bhola.gov.bd
263	34	Monpura	মনপুরা	monpura.bhola.gov.bd
264	34	Tazumuddin	তজুমদ্দিন	tazumuddin.bhola.gov.bd
265	34	Lalmohan	লালমোহন	lalmohan.bhola.gov.bd
266	35	Amtali	আমতলী	amtali.barguna.gov.bd
267	35	Barguna Sadar	বরগুনা সদর	sadar.barguna.gov.bd
268	35	Betagi	বেতাগী	betagi.barguna.gov.bd
269	35	Bamna	বামনা	bamna.barguna.gov.bd
270	35	Pathorghata	পাথরঘাটা	pathorghata.barguna.gov.bd
271	35	Taltali	তালতলি	taltali.barguna.gov.bd
272	36	Balaganj	বালাগঞ্জ	balaganj.sylhet.gov.bd
273	36	Beanibazar	বিয়ানীবাজার	beanibazar.sylhet.gov.bd
274	36	Bishwanath	বিশ্বনাথ	bishwanath.sylhet.gov.bd
275	36	Companiganj	কোম্পানীগঞ্জ	companiganj.sylhet.gov.bd
276	36	Fenchuganj	ফেঞ্চুগঞ্জ	fenchuganj.sylhet.gov.bd
277	36	Golapganj	গোলাপগঞ্জ	golapganj.sylhet.gov.bd
278	36	Gowainghat	গোয়াইনঘাট	gowainghat.sylhet.gov.bd
279	36	Jaintiapur	জৈন্তাপুর	jaintiapur.sylhet.gov.bd
280	36	Kanaighat	কানাইঘাট	kanaighat.sylhet.gov.bd
281	36	Sylhet Sadar	সিলেট সদর	sylhetsadar.sylhet.gov.bd
282	36	Zakiganj	জকিগঞ্জ	zakiganj.sylhet.gov.bd
283	36	Dakshinsurma	দক্ষিণ সুরমা	dakshinsurma.sylhet.gov.bd
284	36	Osmaninagar	ওসমানী নগর	osmaninagar.sylhet.gov.bd
285	37	Barlekha	বড়লেখা	barlekha.moulvibazar.gov.bd
286	37	Kamolganj	কমলগঞ্জ	kamolganj.moulvibazar.gov.bd
287	37	Kulaura	কুলাউড়া	kulaura.moulvibazar.gov.bd
288	37	Moulvibazar Sadar	মৌলভীবাজার সদর	moulvibazarsadar.moulvibazar.gov.bd
289	37	Rajnagar	রাজনগর	rajnagar.moulvibazar.gov.bd
290	37	Sreemangal	শ্রীমঙ্গল	sreemangal.moulvibazar.gov.bd
291	37	Juri	জুড়ী	juri.moulvibazar.gov.bd
292	38	Nabiganj	নবীগঞ্জ	nabiganj.habiganj.gov.bd
293	38	Bahubal	বাহুবল	bahubal.habiganj.gov.bd
294	38	Ajmiriganj	আজমিরীগঞ্জ	ajmiriganj.habiganj.gov.bd
295	38	Baniachong	বানিয়াচং	baniachong.habiganj.gov.bd
296	38	Lakhai	লাখাই	lakhai.habiganj.gov.bd
297	38	Chunarughat	চুনারুঘাট	chunarughat.habiganj.gov.bd
298	38	Habiganj Sadar	হবিগঞ্জ সদর	habiganjsadar.habiganj.gov.bd
299	38	Madhabpur	মাধবপুর	madhabpur.habiganj.gov.bd
300	39	Sunamganj Sadar	সুনামগঞ্জ সদর	sadar.sunamganj.gov.bd
301	39	South Sunamganj	দক্ষিণ সুনামগঞ্জ	southsunamganj.sunamganj.gov.bd
302	39	Bishwambarpur	বিশ্বম্ভরপুর	bishwambarpur.sunamganj.gov.bd
303	39	Chhatak	ছাতক	chhatak.sunamganj.gov.bd
304	39	Jagannathpur	জগন্নাথপুর	jagannathpur.sunamganj.gov.bd
305	39	Dowarabazar	দোয়ারাবাজার	dowarabazar.sunamganj.gov.bd
306	39	Tahirpur	তাহিরপুর	tahirpur.sunamganj.gov.bd
307	39	Dharmapasha	ধর্মপাশা	dharmapasha.sunamganj.gov.bd
308	39	Jamalganj	জামালগঞ্জ	jamalganj.sunamganj.gov.bd
309	39	Shalla	শাল্লা	shalla.sunamganj.gov.bd
310	39	Derai	দিরাই	derai.sunamganj.gov.bd
311	40	Belabo	বেলাবো	belabo.narsingdi.gov.bd
312	40	Monohardi	মনোহরদী	monohardi.narsingdi.gov.bd
313	40	Narsingdi Sadar	নরসিংদী সদর	narsingdisadar.narsingdi.gov.bd
314	40	Palash	পলাশ	palash.narsingdi.gov.bd
315	40	Raipura	রায়পুরা	raipura.narsingdi.gov.bd
316	40	Shibpur	শিবপুর	shibpur.narsingdi.gov.bd
317	41	Kaliganj	কালীগঞ্জ	kaliganj.gazipur.gov.bd
318	41	Kaliakair	কালিয়াকৈর	kaliakair.gazipur.gov.bd
319	41	Kapasia	কাপাসিয়া	kapasia.gazipur.gov.bd
320	41	Gazipur Sadar	গাজীপুর সদর	sadar.gazipur.gov.bd
321	41	Sreepur	শ্রীপুর	sreepur.gazipur.gov.bd
322	42	Shariatpur Sadar	শরিয়তপুর সদর	sadar.shariatpur.gov.bd
323	42	Naria	নড়িয়া	naria.shariatpur.gov.bd
324	42	Zajira	জাজিরা	zajira.shariatpur.gov.bd
325	42	Gosairhat	গোসাইরহাট	gosairhat.shariatpur.gov.bd
326	42	Bhedarganj	ভেদরগঞ্জ	bhedarganj.shariatpur.gov.bd
327	42	Damudya	ডামুড্যা	damudya.shariatpur.gov.bd
328	43	Araihazar	আড়াইহাজার	araihazar.narayanganj.gov.bd
329	43	Bandar	বন্দর	bandar.narayanganj.gov.bd
330	43	Narayanganj Sadar	নারায়নগঞ্জ সদর	narayanganjsadar.narayanganj.gov.bd
331	43	Rupganj	রূপগঞ্জ	rupganj.narayanganj.gov.bd
332	43	Sonargaon	সোনারগাঁ	sonargaon.narayanganj.gov.bd
333	44	Basail	বাসাইল	basail.tangail.gov.bd
334	44	Bhuapur	ভুয়াপুর	bhuapur.tangail.gov.bd
335	44	Delduar	দেলদুয়ার	delduar.tangail.gov.bd
336	44	Ghatail	ঘাটাইল	ghatail.tangail.gov.bd
337	44	Gopalpur	গোপালপুর	gopalpur.tangail.gov.bd
338	44	Madhupur	মধুপুর	madhupur.tangail.gov.bd
339	44	Mirzapur	মির্জাপুর	mirzapur.tangail.gov.bd
340	44	Nagarpur	নাগরপুর	nagarpur.tangail.gov.bd
341	44	Sakhipur	সখিপুর	sakhipur.tangail.gov.bd
342	44	Tangail Sadar	টাঙ্গাইল সদর	tangailsadar.tangail.gov.bd
343	44	Kalihati	কালিহাতী	kalihati.tangail.gov.bd
344	44	Dhanbari	ধনবাড়ী	dhanbari.tangail.gov.bd
345	45	Itna	ইটনা	itna.kishoreganj.gov.bd
346	45	Katiadi	কটিয়াদী	katiadi.kishoreganj.gov.bd
347	45	Bhairab	ভৈরব	bhairab.kishoreganj.gov.bd
348	45	Tarail	তাড়াইল	tarail.kishoreganj.gov.bd
349	45	Hossainpur	হোসেনপুর	hossainpur.kishoreganj.gov.bd
350	45	Pakundia	পাকুন্দিয়া	pakundia.kishoreganj.gov.bd
351	45	Kuliarchar	কুলিয়ারচর	kuliarchar.kishoreganj.gov.bd
352	45	Kishoreganj Sadar	কিশোরগঞ্জ সদর	kishoreganjsadar.kishoreganj.gov.bd
353	45	Karimgonj	করিমগঞ্জ	karimgonj.kishoreganj.gov.bd
354	45	Bajitpur	বাজিতপুর	bajitpur.kishoreganj.gov.bd
355	45	Austagram	অষ্টগ্রাম	austagram.kishoreganj.gov.bd
356	45	Mithamoin	মিঠামইন	mithamoin.kishoreganj.gov.bd
357	45	Nikli	নিকলী	nikli.kishoreganj.gov.bd
358	46	Harirampur	হরিরামপুর	harirampur.manikganj.gov.bd
359	46	Saturia	সাটুরিয়া	saturia.manikganj.gov.bd
360	46	Manikganj Sadar	মানিকগঞ্জ সদর	sadar.manikganj.gov.bd
361	46	Gior	ঘিওর	gior.manikganj.gov.bd
362	46	Shibaloy	শিবালয়	shibaloy.manikganj.gov.bd
363	46	Doulatpur	দৌলতপুর	doulatpur.manikganj.gov.bd
364	46	Singiar	সিংগাইর	singiar.manikganj.gov.bd
365	47	Savar	সাভার	savar.dhaka.gov.bd
366	47	Dhamrai	ধামরাই	dhamrai.dhaka.gov.bd
367	47	Keraniganj	কেরাণীগঞ্জ	keraniganj.dhaka.gov.bd
368	47	Nawabganj	নবাবগঞ্জ	nawabganj.dhaka.gov.bd
369	47	Dohar	দোহার	dohar.dhaka.gov.bd
370	48	Munshiganj Sadar	মুন্সিগঞ্জ সদর	sadar.munshiganj.gov.bd
371	48	Sreenagar	শ্রীনগর	sreenagar.munshiganj.gov.bd
372	48	Sirajdikhan	সিরাজদিখান	sirajdikhan.munshiganj.gov.bd
373	48	Louhajanj	লৌহজং	louhajanj.munshiganj.gov.bd
374	48	Gajaria	গজারিয়া	gajaria.munshiganj.gov.bd
375	48	Tongibari	টংগীবাড়ি	tongibari.munshiganj.gov.bd
376	49	Rajbari Sadar	রাজবাড়ী সদর	sadar.rajbari.gov.bd
377	49	Goalanda	গোয়ালন্দ	goalanda.rajbari.gov.bd
378	49	Pangsa	পাংশা	pangsa.rajbari.gov.bd
379	49	Baliakandi	বালিয়াকান্দি	baliakandi.rajbari.gov.bd
380	49	Kalukhali	কালুখালী	kalukhali.rajbari.gov.bd
381	50	Madaripur Sadar	মাদারীপুর সদর	sadar.madaripur.gov.bd
382	50	Shibchar	শিবচর	shibchar.madaripur.gov.bd
383	50	Kalkini	কালকিনি	kalkini.madaripur.gov.bd
384	50	Rajoir	রাজৈর	rajoir.madaripur.gov.bd
385	51	Gopalganj Sadar	গোপালগঞ্জ সদর	sadar.gopalganj.gov.bd
386	51	Kashiani	কাশিয়ানী	kashiani.gopalganj.gov.bd
387	51	Tungipara	টুংগীপাড়া	tungipara.gopalganj.gov.bd
388	51	Kotalipara	কোটালীপাড়া	kotalipara.gopalganj.gov.bd
389	51	Muksudpur	মুকসুদপুর	muksudpur.gopalganj.gov.bd
390	52	Faridpur Sadar	ফরিদপুর সদর	sadar.faridpur.gov.bd
391	52	Alfadanga	আলফাডাঙ্গা	alfadanga.faridpur.gov.bd
392	52	Boalmari	বোয়ালমারী	boalmari.faridpur.gov.bd
393	52	Sadarpur	সদরপুর	sadarpur.faridpur.gov.bd
394	52	Nagarkanda	নগরকান্দা	nagarkanda.faridpur.gov.bd
395	52	Bhanga	ভাঙ্গা	bhanga.faridpur.gov.bd
396	52	Charbhadrasan	চরভদ্রাসন	charbhadrasan.faridpur.gov.bd
397	52	Madhukhali	মধুখালী	madhukhali.faridpur.gov.bd
398	52	Saltha	সালথা	saltha.faridpur.gov.bd
399	53	Panchagarh Sadar	পঞ্চগড় সদর	panchagarhsadar.panchagarh.gov.bd
400	53	Debiganj	দেবীগঞ্জ	debiganj.panchagarh.gov.bd
401	53	Boda	বোদা	boda.panchagarh.gov.bd
402	53	Atwari	আটোয়ারী	atwari.panchagarh.gov.bd
403	53	Tetulia	তেতুলিয়া	tetulia.panchagarh.gov.bd
404	54	Nawabganj	নবাবগঞ্জ	nawabganj.dinajpur.gov.bd
405	54	Birganj	বীরগঞ্জ	birganj.dinajpur.gov.bd
406	54	Ghoraghat	ঘোড়াঘাট	ghoraghat.dinajpur.gov.bd
407	54	Birampur	বিরামপুর	birampur.dinajpur.gov.bd
408	54	Parbatipur	পার্বতীপুর	parbatipur.dinajpur.gov.bd
409	54	Bochaganj	বোচাগঞ্জ	bochaganj.dinajpur.gov.bd
410	54	Kaharol	কাহারোল	kaharol.dinajpur.gov.bd
411	54	Fulbari	ফুলবাড়ী	fulbari.dinajpur.gov.bd
412	54	Dinajpur Sadar	দিনাজপুর সদর	dinajpursadar.dinajpur.gov.bd
413	54	Hakimpur	হাকিমপুর	hakimpur.dinajpur.gov.bd
414	54	Khansama	খানসামা	khansama.dinajpur.gov.bd
415	54	Birol	বিরল	birol.dinajpur.gov.bd
416	54	Chirirbandar	চিরিরবন্দর	chirirbandar.dinajpur.gov.bd
417	55	Lalmonirhat Sadar	লালমনিরহাট সদর	sadar.lalmonirhat.gov.bd
418	55	Kaliganj	কালীগঞ্জ	kaliganj.lalmonirhat.gov.bd
419	55	Hatibandha	হাতীবান্ধা	hatibandha.lalmonirhat.gov.bd
420	55	Patgram	পাটগ্রাম	patgram.lalmonirhat.gov.bd
421	55	Aditmari	আদিতমারী	aditmari.lalmonirhat.gov.bd
422	56	Syedpur	সৈয়দপুর	syedpur.nilphamari.gov.bd
423	56	Domar	ডোমার	domar.nilphamari.gov.bd
424	56	Dimla	ডিমলা	dimla.nilphamari.gov.bd
425	56	Jaldhaka	জলঢাকা	jaldhaka.nilphamari.gov.bd
426	56	Kishorganj	কিশোরগঞ্জ	kishorganj.nilphamari.gov.bd
427	56	Nilphamari Sadar	নীলফামারী সদর	nilphamarisadar.nilphamari.gov.bd
428	57	Sadullapur	সাদুল্লাপুর	sadullapur.gaibandha.gov.bd
429	57	Gaibandha Sadar	গাইবান্ধা সদর	gaibandhasadar.gaibandha.gov.bd
430	57	Palashbari	পলাশবাড়ী	palashbari.gaibandha.gov.bd
431	57	Saghata	সাঘাটা	saghata.gaibandha.gov.bd
432	57	Gobindaganj	গোবিন্দগঞ্জ	gobindaganj.gaibandha.gov.bd
433	57	Sundarganj	সুন্দরগঞ্জ	sundarganj.gaibandha.gov.bd
434	57	Phulchari	ফুলছড়ি	phulchari.gaibandha.gov.bd
435	58	Thakurgaon Sadar	ঠাকুরগাঁও সদর	thakurgaonsadar.thakurgaon.gov.bd
436	58	Pirganj	পীরগঞ্জ	pirganj.thakurgaon.gov.bd
437	58	Ranisankail	রাণীশংকৈল	ranisankail.thakurgaon.gov.bd
438	58	Haripur	হরিপুর	haripur.thakurgaon.gov.bd
439	58	Baliadangi	বালিয়াডাঙ্গী	baliadangi.thakurgaon.gov.bd
440	59	Rangpur Sadar	রংপুর সদর	rangpursadar.rangpur.gov.bd
441	59	Gangachara	গংগাচড়া	gangachara.rangpur.gov.bd
442	59	Taragonj	তারাগঞ্জ	taragonj.rangpur.gov.bd
443	59	Badargonj	বদরগঞ্জ	badargonj.rangpur.gov.bd
444	59	Mithapukur	মিঠাপুকুর	mithapukur.rangpur.gov.bd
445	59	Pirgonj	পীরগঞ্জ	pirgonj.rangpur.gov.bd
446	59	Kaunia	কাউনিয়া	kaunia.rangpur.gov.bd
447	59	Pirgacha	পীরগাছা	pirgacha.rangpur.gov.bd
448	60	Kurigram Sadar	কুড়িগ্রাম সদর	kurigramsadar.kurigram.gov.bd
449	60	Nageshwari	নাগেশ্বরী	nageshwari.kurigram.gov.bd
450	60	Bhurungamari	ভুরুঙ্গামারী	bhurungamari.kurigram.gov.bd
451	60	Phulbari	ফুলবাড়ী	phulbari.kurigram.gov.bd
452	60	Rajarhat	রাজারহাট	rajarhat.kurigram.gov.bd
453	60	Ulipur	উলিপুর	ulipur.kurigram.gov.bd
454	60	Chilmari	চিলমারী	chilmari.kurigram.gov.bd
455	60	Rowmari	রৌমারী	rowmari.kurigram.gov.bd
456	60	Charrajibpur	চর রাজিবপুর	charrajibpur.kurigram.gov.bd
457	61	Sherpur Sadar	শেরপুর সদর	sherpursadar.sherpur.gov.bd
458	61	Nalitabari	নালিতাবাড়ী	nalitabari.sherpur.gov.bd
459	61	Sreebordi	শ্রীবরদী	sreebordi.sherpur.gov.bd
460	61	Nokla	নকলা	nokla.sherpur.gov.bd
461	61	Jhenaigati	ঝিনাইগাতী	jhenaigati.sherpur.gov.bd
462	62	Fulbaria	ফুলবাড়ীয়া	fulbaria.mymensingh.gov.bd
463	62	Trishal	ত্রিশাল	trishal.mymensingh.gov.bd
464	62	Bhaluka	ভালুকা	bhaluka.mymensingh.gov.bd
465	62	Muktagacha	মুক্তাগাছা	muktagacha.mymensingh.gov.bd
466	62	Mymensingh Sadar	ময়মনসিংহ সদর	mymensinghsadar.mymensingh.gov.bd
467	62	Dhobaura	ধোবাউড়া	dhobaura.mymensingh.gov.bd
468	62	Phulpur	ফুলপুর	phulpur.mymensingh.gov.bd
469	62	Haluaghat	হালুয়াঘাট	haluaghat.mymensingh.gov.bd
470	62	Gouripur	গৌরীপুর	gouripur.mymensingh.gov.bd
471	62	Gafargaon	গফরগাঁও	gafargaon.mymensingh.gov.bd
472	62	Iswarganj	ঈশ্বরগঞ্জ	iswarganj.mymensingh.gov.bd
473	62	Nandail	নান্দাইল	nandail.mymensingh.gov.bd
474	62	Tarakanda	তারাকান্দা	tarakanda.mymensingh.gov.bd
475	63	Jamalpur Sadar	জামালপুর সদর	jamalpursadar.jamalpur.gov.bd
476	63	Melandah	মেলান্দহ	melandah.jamalpur.gov.bd
477	63	Islampur	ইসলামপুর	islampur.jamalpur.gov.bd
478	63	Dewangonj	দেওয়ানগঞ্জ	dewangonj.jamalpur.gov.bd
479	63	Sarishabari	সরিষাবাড়ী	sarishabari.jamalpur.gov.bd
480	63	Madarganj	মাদারগঞ্জ	madarganj.jamalpur.gov.bd
481	63	Bokshiganj	বকশীগঞ্জ	bokshiganj.jamalpur.gov.bd
482	64	Barhatta	বারহাট্টা	barhatta.netrokona.gov.bd
483	64	Durgapur	দুর্গাপুর	durgapur.netrokona.gov.bd
484	64	Kendua	কেন্দুয়া	kendua.netrokona.gov.bd
485	64	Atpara	আটপাড়া	atpara.netrokona.gov.bd
486	64	Madan	মদন	madan.netrokona.gov.bd
487	64	Khaliajuri	খালিয়াজুরী	khaliajuri.netrokona.gov.bd
576	47	Dayaganj	দয়াগঞ্জ	null
488	64	Kalmakanda	কলমাকান্দা	kalmakanda.netrokona.gov.bd
489	64	Mohongonj	মোহনগঞ্জ	mohongonj.netrokona.gov.bd
490	64	Purbadhala	পূর্বধলা	purbadhala.netrokona.gov.bd
491	64	Netrokona Sadar	নেত্রকোণা সদর	netrokonasadar.netrokona.gov.bd
492	9	Eidgaon	ঈদগাঁও	null
493	39	Madhyanagar	মধ্যনগর	null
494	50	Dasar	ডাসার	null
495	47	Uttara- Sector 4	উওরা- সেক্টর -৪	null
496	47	Uttara- Sector 6	উওরা- সেক্টর -৬	null
497	47	Uttara- Sector 8	উওরা- সেক্টর -৮	null
498	47	Dhanmondi-27	ধানমন্ডি-২৭	null
499	47	Dhanmondi-32	ধানমন্ডি-৩২	null
500	47	Mirpur Estern Housing	মিরপুর ইস্টার্ণ হাউজিং	null
501	47	Mirpur-Alubdi	মিরপুর- আলুব্দি	null
502	47	Mirpur-7	মিরপুর-৭	null
503	47	Shyamoli - Road No 01- 04	শ্যামলী - রোড ১থেকে ৪	null
504	47	Agargaon	আগারগাঁও	null
505	47	Azimpur	আজিমপুর	null
506	47	Adabar	আদাবর	null
507	47	Aftabnagar	আফতাবনগর	null
508	47	Ibrahimpur	ইব্রাহিমপুর	null
509	47	Islampur	ইসলামপুর	null
510	47	Eskaton	ইস্কাটন	null
511	47	Uttara- Sector 2	উওরা- সেক্টর -২	null
512	47	Uttara- Sector 17	উওরা- সেক্টর ১৭	null
513	47	Uttara- Sector 18	উওরা- সেক্টর ১৮	null
514	47	UttarKhan	উত্তর খান	null
515	47	Uttara	উত্তরা	null
516	47	Uttara - Ranavola	উত্তরা - রানাভোলা	null
517	47	Uttara-Abdullahpur	উত্তরা-আব্দুল্লাহপর	null
518	47	Uttara-Kaola	উত্তরা-কাওলা	null
519	47	Uttara-Kamarpara	উত্তরা-কামারপাড়া	null
520	47	Uttara-Diabari	উত্তরা-দিয়াবাড়ি	null
521	47	Uttara-Baunia	উত্তরা-বাউনিয়া	null
522	47	Elephant Road	এ্যালিফেন্ট রোড	null
523	47	Wari	ওয়ারী	null
524	47	Kadamtoli	কদমতলী	null
525	47	Kamalapur	কমলাপুর	null
526	47	Kalabagan	কলাবাগান	null
527	47	Kalyanpur	কল্যাণপুর	null
528	47	Kawranbazar	কাওরানবাজার	null
529	47	Kakrail	কাকরাইল	null
530	47	Kazipara	কাজীপাড়া	null
531	47	KathalBagan	কাঠালবাগান	null
532	47	Kafrul	কাফরুল	null
533	47	Kamrangirchar	কামরঙ্গীরচর	null
534	47	Kuril Bisshoroad	কুড়িল বিশ্বরোড	null
535	47	Kotwali	কোতয়ালী	null
536	47	Cantonment	ক্যান্টনমেন্ট	null
537	47	Cantonment-ECB	ক্যান্টনমেন্ট- ইসিবি	null
538	47	Cantonment-Balughat	ক্যান্টনমেন্ট-বালুঘাট	null
539	47	Cantonment-Matikata	ক্যান্টনমেন্ট-মাটিকাটা	null
540	47	Cantonment-Manikdi	ক্যান্টনমেন্ট-মানিকদি	null
541	47	Khilkhet	খিলখেত	null
542	47	Khilkhet-Dumni	খিলখেত-ডুমনী	null
543	47	Khilkhet-Namapara	খিলখেত-নামাপাড়া	null
544	47	Khilkhet-Patira	খিলখেত-পাতিরা	null
545	47	Khilkhet-Pink City	খিলখেত-পিংসিটি	null
546	47	Khilkhet-Barua	খিলখেত-বরুয়া	null
547	47	Khilgaon	খিলগাঁও	null
548	47	Khilgaon - Goran	খিলগাঁও - গোড়ান	null
549	47	Khilgaon - Thrimohni	খিলগাঁও - ত্রিমোহনী	null
550	47	Khilgaon - Dakkhingaon	খিলগাঁও - দক্ষিনগাঁও	null
551	47	Khilgaon - Nandipara	খিলগাঁও - নন্দিপাড়া	null
552	47	Khilgaon - Nasirabad	খিলগাঁও - নাসিরাবাদ	null
553	47	Khilgaon - Begunbari	খিলগাঁও - বেগুনবাড়ি	null
554	47	Khilgaon - Meradia	খিলগাঁও - মেরাদিয়া	null
555	47	Khilgaon - Shekher Jayga	খিলগাঁও - শেখের জায়গা	null
556	47	Gabtali	গাবতলী	null
557	47	Gulshan-1	গুলশান-১	null
558	47	Gulshan-2	গুলশান-২	null
559	47	Gulistan	গুলিস্থান	null
560	47	Gandaria	গেন্ডারিয়া	null
561	47	Green Road	গ্রীন রোড	null
562	47	Choukbazar	চকবাজার	null
563	47	Jigatala	জিগাতলা	null
564	47	Jurain	জুরাইন	null
565	47	Tikatuli	টিকাটুলি	null
566	47	DU campus	ডিইউ ক্যাম্পাস	null
567	47	Demra	ডেমরা	null
568	47	Demra - Amulia	ডেমরা - আমুলিয়া	null
569	47	Demra - Kayetpara	ডেমরা - কায়েতপাড়া	null
570	47	Demra - Vabani	ডেমরা - ভাবানি	null
571	47	Demra Bazer	ডেমরা বাজার	null
572	47	Turag	তুরাগ	null
573	47	Tejkunipara	তেজকুনিপাড়া	null
574	47	Tejgaon	তেজগাঁও	null
575	47	DakhinKhan	দক্ষিণখান	null
577	47	Daraz Office	দারাজ অফিস	null
578	47	Dhanmondi	ধানমন্ডি	null
579	47	NayaPaltan	নয়া পল্টন	null
580	47	Nardda	নর্দ্দা	null
581	47	Nakhalpara	নাখালপাড়া	null
582	47	Narinda	নারিন্দা	null
583	47	New Eskaton	নিউ ইস্কাটন	null
584	47	New Market	নিউ মার্কেট	null
585	47	Nikunjo	নিকুঞ্জ	null
586	47	Niketon	নিকেতন	null
587	47	Nilkhet	নীলক্ষেত	null
588	47	Polashi	পলাশী	null
589	47	Pallabi	পল্লবী	null
590	47	Panthapath	পান্থপথ	null
591	47	Purana Paltan	পুরানা পল্টন	null
592	47	Purbachal	পূর্বাচল	null
593	47	Postagola	পোস্তগোলা	null
594	47	Farmgate	ফার্মগেট	null
595	47	Bakshibazar	বকশীবাজার	null
596	47	Banasree	বনশ্রী	null
597	47	Banani	বনানী	null
598	47	Banani DOHS	বনানী ডিওএইচএস	null
599	47	Bangshal	বংশাল	null
600	47	Basundhara	বসুন্ধরা	null
601	47	Basundhara -Joyarsahar	বসুন্ধরা- জোয়ারসাহার	null
602	47	Badda	বাড্ডা	null
603	47	Badda - United City	বাড্ডা - ইউনাইটেড সিটি	null
604	47	Badda - Beraid	বাড্ডা - বেরাইদ	null
605	47	Badda - Mogardia	বাড্ডা - মগারদিয়া	null
606	47	Badda - Middle Badda	বাড্ডা - মধ্য বাড্ডা	null
607	47	Badda - Saterkul	বাড্ডা - সাতারকুল	null
608	47	Baridhara	বারিধারা	null
609	47	Baridhara DOHS	বারিধারা ডিওএইচএস	null
610	47	Banglabazar	বাংলাবাজার	null
611	47	Banglamotor	বাংলামটর	null
612	47	Basabo	বাসাবো	null
613	47	Airport Thana	বিমানবন্দর থানা	null
614	47	BUET campus	বুয়েট ক্যাম্পাস	null
615	47	Vatara	ভাটারা	null
616	47	Vashantek	ভাষানটেক	null
617	47	Maghbazar	মগবাজার	null
618	47	Motijheel	মতিঝিল	null
619	47	Mohakhali	মহাখালী	null
620	47	Mohakhali DOHS	মহাখালী ডিওএইচএস	null
621	47	Maniknagar	মানিকনগর	null
622	47	Malibag	মালিবাগ	null
623	47	Mirpur	মিরপুর	null
624	47	Mirpur DOHS	মিরপুর ডিওএইচএস	null
625	47	Mirpur-1	মিরপুর-১	null
626	47	Mirpur-10	মিরপুর-১০	null
627	47	Mirpur-11	মিরপুর-১১	null
628	47	Mirpur-12	মিরপুর-১২	null
629	47	Mirpur-13	মিরপুর-১৩	null
630	47	Mirpur-14	মিরপুর-১৪	null
631	47	Mirpur-2	মিরপুর-২	null
632	47	Mughda	মুগদা	null
633	47	Mohammadpur	মোহাম্মদপুর	null
634	47	Jatrabari	যাত্রাবাড়ী	null
635	47	Ramna	রমনা	null
636	47	Rajabazar	রাজাবাজার	null
637	47	Rajarbag	রাজারবাগ	null
638	47	Rampura	রামপুরা	null
639	47	Rayerbag	রায়েরবাগ	null
640	47	Rayerbazar	রায়েরবাজার	null
641	47	Rupnagar	রূপনগর	null
642	47	Lakshmibazar	লক্ষীবাজার	null
643	47	Lalbag	লালবাগ	null
644	47	Lalmatia	লালমাটিয়া	null
645	47	Shonirakhra	শনিরআখড়া	null
646	47	Shantinagar	শান্তিনগর	null
647	47	Shajahanpur	শাহজানপুর	null
648	47	Shahbag	শাহবাগ	null
649	47	Shimrail	শিমরাইল	null
650	47	Shukrabad	শুক্রাবাদ	null
651	47	Sher-e-Bangla Nagar	শেরে বাংলা নগর	null
652	47	Shampur	শ্যামপুর	null
653	47	Shyamoli	শ্যামলী	null
654	47	Sadarghat	সদরঘাট	null
655	47	Sabujbag	সবুজবাগ	null
656	47	Siddeswary	সিদ্ধেশ্বরী	null
657	47	Sutrapur	সূত্রাপুর	null
658	47	Segunbagicha	সেগুনবাগিচা	null
659	47	Hazaribagh	হাজারীবাগ	null
660	47	Hatirpul	হাতিরপুল	null
661	1	Debidwar	দেবিদ্বার	debidwar.comilla.gov.bd
662	1	Barura	বরুড়া	barura.comilla.gov.bd
663	1	Brahmanpara	ব্রাহ্মণপাড়া	brahmanpara.comilla.gov.bd
664	1	Chandina	চান্দিনা	chandina.comilla.gov.bd
665	1	Chauddagram	চৌদ্দগ্রাম	chauddagram.comilla.gov.bd
666	1	Daudkandi	দাউদকান্দি	daudkandi.comilla.gov.bd
667	1	Homna	হোমনা	homna.comilla.gov.bd
668	1	Laksam	লাকসাম	laksam.comilla.gov.bd
669	1	Muradnagar	মুরাদনগর	muradnagar.comilla.gov.bd
670	1	Nangalkot	নাঙ্গলকোট	nangalkot.comilla.gov.bd
671	1	Comilla Sadar	কুমিল্লা সদর	comillasadar.comilla.gov.bd
672	1	Meghna	মেঘনা	meghna.comilla.gov.bd
673	1	Monohargonj	মনোহরগঞ্জ	monohargonj.comilla.gov.bd
674	1	Sadarsouth	সদর দক্ষিণ	sadarsouth.comilla.gov.bd
675	1	Titas	তিতাস	titas.comilla.gov.bd
676	1	Burichang	বুড়িচং	burichang.comilla.gov.bd
677	1	Lalmai	লালমাই	lalmai.comilla.gov.bd
678	2	Chhagalnaiya	ছাগলনাইয়া	chhagalnaiya.feni.gov.bd
679	2	Feni Sadar	ফেনী সদর	sadar.feni.gov.bd
680	2	Sonagazi	সোনাগাজী	sonagazi.feni.gov.bd
681	2	Fulgazi	ফুলগাজী	fulgazi.feni.gov.bd
682	2	Parshuram	পরশুরাম	parshuram.feni.gov.bd
683	2	Daganbhuiyan	দাগনভূঞা	daganbhuiyan.feni.gov.bd
684	3	Brahmanbaria Sadar	ব্রাহ্মণবাড়িয়া সদর	sadar.brahmanbaria.gov.bd
685	3	Kasba	কসবা	kasba.brahmanbaria.gov.bd
686	3	Nasirnagar	নাসিরনগর	nasirnagar.brahmanbaria.gov.bd
687	3	Sarail	সরাইল	sarail.brahmanbaria.gov.bd
688	3	Ashuganj	আশুগঞ্জ	ashuganj.brahmanbaria.gov.bd
689	3	Akhaura	আখাউড়া	akhaura.brahmanbaria.gov.bd
690	3	Nabinagar	নবীনগর	nabinagar.brahmanbaria.gov.bd
691	3	Bancharampur	বাঞ্ছারামপুর	bancharampur.brahmanbaria.gov.bd
692	3	Bijoynagar	বিজয়নগর	bijoynagar.brahmanbaria.gov.bd
693	4	Rangamati Sadar	রাঙ্গামাটি সদর	sadar.rangamati.gov.bd
694	4	Kaptai	কাপ্তাই	kaptai.rangamati.gov.bd
695	4	Kawkhali	কাউখালী	kawkhali.rangamati.gov.bd
696	4	Baghaichari	বাঘাইছড়ি	baghaichari.rangamati.gov.bd
697	4	Barkal	বরকল	barkal.rangamati.gov.bd
698	4	Langadu	লংগদু	langadu.rangamati.gov.bd
699	4	Rajasthali	রাজস্থলী	rajasthali.rangamati.gov.bd
700	4	Belaichari	বিলাইছড়ি	belaichari.rangamati.gov.bd
701	4	Juraichari	জুরাছড়ি	juraichari.rangamati.gov.bd
702	4	Naniarchar	নানিয়ারচর	naniarchar.rangamati.gov.bd
703	5	Noakhali Sadar	নোয়াখালী সদর	sadar.noakhali.gov.bd
704	5	Companiganj	কোম্পানীগঞ্জ	companiganj.noakhali.gov.bd
705	5	Begumganj	বেগমগঞ্জ	begumganj.noakhali.gov.bd
706	5	Hatia	হাতিয়া	hatia.noakhali.gov.bd
707	5	Subarnachar	সুবর্ণচর	subarnachar.noakhali.gov.bd
708	5	Kabirhat	কবিরহাট	kabirhat.noakhali.gov.bd
709	5	Senbug	সেনবাগ	senbug.noakhali.gov.bd
710	5	Chatkhil	চাটখিল	chatkhil.noakhali.gov.bd
711	5	Sonaimori	সোনাইমুড়ী	sonaimori.noakhali.gov.bd
712	6	Haimchar	হাইমচর	haimchar.chandpur.gov.bd
713	6	Kachua	কচুয়া	kachua.chandpur.gov.bd
714	6	Shahrasti	শাহরাস্তি	shahrasti.chandpur.gov.bd
715	6	Chandpur Sadar	চাঁদপুর সদর	sadar.chandpur.gov.bd
716	6	Matlab South	মতলব দক্ষিণ	matlabsouth.chandpur.gov.bd
717	6	Hajiganj	হাজীগঞ্জ	hajiganj.chandpur.gov.bd
718	6	Matlab North	মতলব উত্তর	matlabnorth.chandpur.gov.bd
719	6	Faridgonj	ফরিদগঞ্জ	faridgonj.chandpur.gov.bd
720	7	Lakshmipur Sadar	লক্ষ্মীপুর সদর	sadar.lakshmipur.gov.bd
721	7	Kamalnagar	কমলনগর	kamalnagar.lakshmipur.gov.bd
722	7	Raipur	রায়পুর	raipur.lakshmipur.gov.bd
723	7	Ramgati	রামগতি	ramgati.lakshmipur.gov.bd
724	7	Ramganj	রামগঞ্জ	ramganj.lakshmipur.gov.bd
725	8	Rangunia	রাঙ্গুনিয়া	rangunia.chittagong.gov.bd
726	8	Sitakunda	সীতাকুন্ড	sitakunda.chittagong.gov.bd
727	8	Mirsharai	মীরসরাই	mirsharai.chittagong.gov.bd
728	8	Patiya	পটিয়া	patiya.chittagong.gov.bd
729	8	Sandwip	সন্দ্বীপ	sandwip.chittagong.gov.bd
730	8	Banshkhali	বাঁশখালী	banshkhali.chittagong.gov.bd
731	8	Boalkhali	বোয়ালখালী	boalkhali.chittagong.gov.bd
732	8	Anwara	আনোয়ারা	anwara.chittagong.gov.bd
733	8	Chandanaish	চন্দনাইশ	chandanaish.chittagong.gov.bd
734	8	Satkania	সাতকানিয়া	satkania.chittagong.gov.bd
735	8	Lohagara	লোহাগাড়া	lohagara.chittagong.gov.bd
736	8	Hathazari	হাটহাজারী	hathazari.chittagong.gov.bd
737	8	Fatikchhari	ফটিকছড়ি	fatikchhari.chittagong.gov.bd
738	8	Raozan	রাউজান	raozan.chittagong.gov.bd
739	8	Karnafuli	কর্ণফুলী	karnafuli.chittagong.gov.bd
740	9	Coxsbazar Sadar	কক্সবাজার সদর	sadar.coxsbazar.gov.bd
741	9	Chakaria	চকরিয়া	chakaria.coxsbazar.gov.bd
742	9	Kutubdia	কুতুবদিয়া	kutubdia.coxsbazar.gov.bd
743	9	Ukhiya	উখিয়া	ukhiya.coxsbazar.gov.bd
744	9	Moheshkhali	মহেশখালী	moheshkhali.coxsbazar.gov.bd
745	9	Pekua	পেকুয়া	pekua.coxsbazar.gov.bd
746	9	Ramu	রামু	ramu.coxsbazar.gov.bd
747	9	Teknaf	টেকনাফ	teknaf.coxsbazar.gov.bd
748	10	Khagrachhari Sadar	খাগড়াছড়ি সদর	sadar.khagrachhari.gov.bd
749	10	Dighinala	দিঘীনালা	dighinala.khagrachhari.gov.bd
750	10	Panchari	পানছড়ি	panchari.khagrachhari.gov.bd
751	10	Laxmichhari	লক্ষীছড়ি	laxmichhari.khagrachhari.gov.bd
752	10	Mohalchari	মহালছড়ি	mohalchari.khagrachhari.gov.bd
753	10	Manikchari	মানিকছড়ি	manikchari.khagrachhari.gov.bd
754	10	Ramgarh	রামগড়	ramgarh.khagrachhari.gov.bd
755	10	Matiranga	মাটিরাঙ্গা	matiranga.khagrachhari.gov.bd
756	10	Guimara	গুইমারা	guimara.khagrachhari.gov.bd
757	11	Bandarban Sadar	বান্দরবান সদর	sadar.bandarban.gov.bd
758	11	Alikadam	আলীকদম	alikadam.bandarban.gov.bd
759	11	Naikhongchhari	নাইক্ষ্যংছড়ি	naikhongchhari.bandarban.gov.bd
760	11	Rowangchhari	রোয়াংছড়ি	rowangchhari.bandarban.gov.bd
761	11	Lama	লামা	lama.bandarban.gov.bd
762	11	Ruma	রুমা	ruma.bandarban.gov.bd
763	11	Thanchi	থানচি	thanchi.bandarban.gov.bd
764	12	Belkuchi	বেলকুচি	belkuchi.sirajganj.gov.bd
765	12	Chauhali	চৌহালি	chauhali.sirajganj.gov.bd
766	12	Kamarkhand	কামারখন্দ	kamarkhand.sirajganj.gov.bd
767	12	Kazipur	কাজীপুর	kazipur.sirajganj.gov.bd
768	12	Raigonj	রায়গঞ্জ	raigonj.sirajganj.gov.bd
769	12	Shahjadpur	শাহজাদপুর	shahjadpur.sirajganj.gov.bd
770	12	Sirajganj Sadar	সিরাজগঞ্জ সদর	sirajganjsadar.sirajganj.gov.bd
771	12	Tarash	তাড়াশ	tarash.sirajganj.gov.bd
772	12	Ullapara	উল্লাপাড়া	ullapara.sirajganj.gov.bd
773	13	Sujanagar	সুজানগর	sujanagar.pabna.gov.bd
774	13	Ishurdi	ঈশ্বরদী	ishurdi.pabna.gov.bd
775	13	Bhangura	ভাঙ্গুড়া	bhangura.pabna.gov.bd
776	13	Pabna Sadar	পাবনা সদর	pabnasadar.pabna.gov.bd
777	13	Bera	বেড়া	bera.pabna.gov.bd
778	13	Atghoria	আটঘরিয়া	atghoria.pabna.gov.bd
779	13	Chatmohar	চাটমোহর	chatmohar.pabna.gov.bd
780	13	Santhia	সাঁথিয়া	santhia.pabna.gov.bd
781	13	Faridpur	ফরিদপুর	faridpur.pabna.gov.bd
782	14	Kahaloo	কাহালু	kahaloo.bogra.gov.bd
783	14	Bogra Sadar	বগুড়া সদর	sadar.bogra.gov.bd
784	14	Shariakandi	সারিয়াকান্দি	shariakandi.bogra.gov.bd
785	14	Shajahanpur	শাজাহানপুর	shajahanpur.bogra.gov.bd
786	14	Dupchanchia	দুপচাচিঁয়া	dupchanchia.bogra.gov.bd
787	14	Adamdighi	আদমদিঘি	adamdighi.bogra.gov.bd
788	14	Nondigram	নন্দিগ্রাম	nondigram.bogra.gov.bd
789	14	Sonatala	সোনাতলা	sonatala.bogra.gov.bd
790	14	Dhunot	ধুনট	dhunot.bogra.gov.bd
791	14	Gabtali	গাবতলী	gabtali.bogra.gov.bd
792	14	Sherpur	শেরপুর	sherpur.bogra.gov.bd
793	14	Shibganj	শিবগঞ্জ	shibganj.bogra.gov.bd
794	15	Paba	পবা	paba.rajshahi.gov.bd
795	15	Durgapur	দুর্গাপুর	durgapur.rajshahi.gov.bd
796	15	Mohonpur	মোহনপুর	mohonpur.rajshahi.gov.bd
797	15	Charghat	চারঘাট	charghat.rajshahi.gov.bd
798	15	Puthia	পুঠিয়া	puthia.rajshahi.gov.bd
799	15	Bagha	বাঘা	bagha.rajshahi.gov.bd
800	15	Godagari	গোদাগাড়ী	godagari.rajshahi.gov.bd
801	15	Tanore	তানোর	tanore.rajshahi.gov.bd
802	15	Bagmara	বাগমারা	bagmara.rajshahi.gov.bd
803	16	Natore Sadar	নাটোর সদর	natoresadar.natore.gov.bd
804	16	Singra	সিংড়া	singra.natore.gov.bd
805	16	Baraigram	বড়াইগ্রাম	baraigram.natore.gov.bd
806	16	Bagatipara	বাগাতিপাড়া	bagatipara.natore.gov.bd
807	16	Lalpur	লালপুর	lalpur.natore.gov.bd
808	16	Gurudaspur	গুরুদাসপুর	gurudaspur.natore.gov.bd
809	16	Naldanga	নলডাঙ্গা	naldanga.natore.gov.bd
810	17	Akkelpur	আক্কেলপুর	akkelpur.joypurhat.gov.bd
811	17	Kalai	কালাই	kalai.joypurhat.gov.bd
812	17	Khetlal	ক্ষেতলাল	khetlal.joypurhat.gov.bd
813	17	Panchbibi	পাঁচবিবি	panchbibi.joypurhat.gov.bd
814	17	Joypurhat Sadar	জয়পুরহাট সদর	joypurhatsadar.joypurhat.gov.bd
815	18	Chapainawabganj Sadar	চাঁপাইনবাবগঞ্জ সদর	chapainawabganjsadar.chapainawabganj.gov.bd
816	18	Gomostapur	গোমস্তাপুর	gomostapur.chapainawabganj.gov.bd
817	18	Nachol	নাচোল	nachol.chapainawabganj.gov.bd
818	18	Bholahat	ভোলাহাট	bholahat.chapainawabganj.gov.bd
819	18	Shibganj	শিবগঞ্জ	shibganj.chapainawabganj.gov.bd
820	19	Mohadevpur	মহাদেবপুর	mohadevpur.naogaon.gov.bd
821	19	Badalgachi	বদলগাছী	badalgachi.naogaon.gov.bd
822	19	Patnitala	পত্নিতলা	patnitala.naogaon.gov.bd
823	19	Dhamoirhat	ধামইরহাট	dhamoirhat.naogaon.gov.bd
824	19	Niamatpur	নিয়ামতপুর	niamatpur.naogaon.gov.bd
825	19	Manda	মান্দা	manda.naogaon.gov.bd
826	19	Atrai	আত্রাই	atrai.naogaon.gov.bd
827	19	Raninagar	রাণীনগর	raninagar.naogaon.gov.bd
828	19	Naogaon Sadar	নওগাঁ সদর	naogaonsadar.naogaon.gov.bd
829	19	Porsha	পোরশা	porsha.naogaon.gov.bd
830	19	Sapahar	সাপাহার	sapahar.naogaon.gov.bd
831	20	Manirampur	মণিরামপুর	manirampur.jessore.gov.bd
832	20	Abhaynagar	অভয়নগর	abhaynagar.jessore.gov.bd
833	20	Bagherpara	বাঘারপাড়া	bagherpara.jessore.gov.bd
834	20	Chougachha	চৌগাছা	chougachha.jessore.gov.bd
835	20	Jhikargacha	ঝিকরগাছা	jhikargacha.jessore.gov.bd
836	20	Keshabpur	কেশবপুর	keshabpur.jessore.gov.bd
837	20	Jessore Sadar	যশোর সদর	sadar.jessore.gov.bd
838	20	Sharsha	শার্শা	sharsha.jessore.gov.bd
839	21	Assasuni	আশাশুনি	assasuni.satkhira.gov.bd
840	21	Debhata	দেবহাটা	debhata.satkhira.gov.bd
841	21	Kalaroa	কলারোয়া	kalaroa.satkhira.gov.bd
842	21	Satkhira Sadar	সাতক্ষীরা সদর	satkhirasadar.satkhira.gov.bd
843	21	Shyamnagar	শ্যামনগর	shyamnagar.satkhira.gov.bd
844	21	Tala	তালা	tala.satkhira.gov.bd
845	21	Kaliganj	কালিগঞ্জ	kaliganj.satkhira.gov.bd
846	22	Mujibnagar	মুজিবনগর	mujibnagar.meherpur.gov.bd
847	22	Meherpur Sadar	মেহেরপুর সদর	meherpursadar.meherpur.gov.bd
848	22	Gangni	গাংনী	gangni.meherpur.gov.bd
849	23	Narail Sadar	নড়াইল সদর	narailsadar.narail.gov.bd
850	23	Lohagara	লোহাগড়া	lohagara.narail.gov.bd
851	23	Kalia	কালিয়া	kalia.narail.gov.bd
852	24	Chuadanga Sadar	চুয়াডাঙ্গা সদর	chuadangasadar.chuadanga.gov.bd
853	24	Alamdanga	আলমডাঙ্গা	alamdanga.chuadanga.gov.bd
854	24	Damurhuda	দামুড়হুদা	damurhuda.chuadanga.gov.bd
855	24	Jibannagar	জীবননগর	jibannagar.chuadanga.gov.bd
856	25	Kushtia Sadar	কুষ্টিয়া সদর	kushtiasadar.kushtia.gov.bd
857	25	Kumarkhali	কুমারখালী	kumarkhali.kushtia.gov.bd
858	25	Khoksa	খোকসা	khoksa.kushtia.gov.bd
859	25	Mirpur	মিরপুর	mirpurkushtia.kushtia.gov.bd
860	25	Daulatpur	দৌলতপুর	daulatpur.kushtia.gov.bd
861	25	Bheramara	ভেড়ামারা	bheramara.kushtia.gov.bd
862	26	Shalikha	শালিখা	shalikha.magura.gov.bd
863	26	Sreepur	শ্রীপুর	sreepur.magura.gov.bd
864	26	Magura Sadar	মাগুরা সদর	magurasadar.magura.gov.bd
865	26	Mohammadpur	মহম্মদপুর	mohammadpur.magura.gov.bd
866	27	Paikgasa	পাইকগাছা	paikgasa.khulna.gov.bd
867	27	Fultola	ফুলতলা	fultola.khulna.gov.bd
868	27	Digholia	দিঘলিয়া	digholia.khulna.gov.bd
869	27	Rupsha	রূপসা	rupsha.khulna.gov.bd
870	27	Terokhada	তেরখাদা	terokhada.khulna.gov.bd
871	27	Dumuria	ডুমুরিয়া	dumuria.khulna.gov.bd
872	27	Botiaghata	বটিয়াঘাটা	botiaghata.khulna.gov.bd
873	27	Dakop	দাকোপ	dakop.khulna.gov.bd
874	27	Koyra	কয়রা	koyra.khulna.gov.bd
875	28	Fakirhat	ফকিরহাট	fakirhat.bagerhat.gov.bd
876	28	Bagerhat Sadar	বাগেরহাট সদর	sadar.bagerhat.gov.bd
877	28	Mollahat	মোল্লাহাট	mollahat.bagerhat.gov.bd
878	28	Sarankhola	শরণখোলা	sarankhola.bagerhat.gov.bd
879	28	Rampal	রামপাল	rampal.bagerhat.gov.bd
880	28	Morrelganj	মোড়েলগঞ্জ	morrelganj.bagerhat.gov.bd
881	28	Kachua	কচুয়া	kachua.bagerhat.gov.bd
882	28	Mongla	মোংলা	mongla.bagerhat.gov.bd
883	28	Chitalmari	চিতলমারী	chitalmari.bagerhat.gov.bd
884	29	Jhenaidah Sadar	ঝিনাইদহ সদর	sadar.jhenaidah.gov.bd
885	29	Shailkupa	শৈলকুপা	shailkupa.jhenaidah.gov.bd
886	29	Harinakundu	হরিণাকুন্ডু	harinakundu.jhenaidah.gov.bd
887	29	Kaliganj	কালীগঞ্জ	kaliganj.jhenaidah.gov.bd
888	29	Kotchandpur	কোটচাঁদপুর	kotchandpur.jhenaidah.gov.bd
889	29	Moheshpur	মহেশপুর	moheshpur.jhenaidah.gov.bd
890	30	Jhalakathi Sadar	ঝালকাঠি সদর	sadar.jhalakathi.gov.bd
891	30	Kathalia	কাঠালিয়া	kathalia.jhalakathi.gov.bd
892	30	Nalchity	নলছিটি	nalchity.jhalakathi.gov.bd
893	30	Rajapur	রাজাপুর	rajapur.jhalakathi.gov.bd
894	31	Bauphal	বাউফল	bauphal.patuakhali.gov.bd
895	31	Patuakhali Sadar	পটুয়াখালী সদর	sadar.patuakhali.gov.bd
896	31	Dumki	দুমকি	dumki.patuakhali.gov.bd
897	31	Dashmina	দশমিনা	dashmina.patuakhali.gov.bd
898	31	Kalapara	কলাপাড়া	kalapara.patuakhali.gov.bd
899	31	Mirzaganj	মির্জাগঞ্জ	mirzaganj.patuakhali.gov.bd
900	31	Galachipa	গলাচিপা	galachipa.patuakhali.gov.bd
901	31	Rangabali	রাঙ্গাবালী	rangabali.patuakhali.gov.bd
902	32	Pirojpur Sadar	পিরোজপুর সদর	sadar.pirojpur.gov.bd
903	32	Nazirpur	নাজিরপুর	nazirpur.pirojpur.gov.bd
904	32	Kawkhali	কাউখালী	kawkhali.pirojpur.gov.bd
905	32	Zianagar	জিয়ানগর	zianagar.pirojpur.gov.bd
906	32	Bhandaria	ভান্ডারিয়া	bhandaria.pirojpur.gov.bd
907	32	Mathbaria	মঠবাড়ীয়া	mathbaria.pirojpur.gov.bd
908	32	Nesarabad	নেছারাবাদ	nesarabad.pirojpur.gov.bd
909	33	Barisal Sadar	বরিশাল সদর	barisalsadar.barisal.gov.bd
910	33	Bakerganj	বাকেরগঞ্জ	bakerganj.barisal.gov.bd
911	33	Babuganj	বাবুগঞ্জ	babuganj.barisal.gov.bd
912	33	Wazirpur	উজিরপুর	wazirpur.barisal.gov.bd
913	33	Banaripara	বানারীপাড়া	banaripara.barisal.gov.bd
914	33	Gournadi	গৌরনদী	gournadi.barisal.gov.bd
915	33	Agailjhara	আগৈলঝাড়া	agailjhara.barisal.gov.bd
916	33	Mehendiganj	মেহেন্দিগঞ্জ	mehendiganj.barisal.gov.bd
917	33	Muladi	মুলাদী	muladi.barisal.gov.bd
918	33	Hizla	হিজলা	hizla.barisal.gov.bd
919	34	Bhola Sadar	ভোলা সদর	sadar.bhola.gov.bd
920	34	Borhan Sddin	বোরহান উদ্দিন	borhanuddin.bhola.gov.bd
921	34	Charfesson	চরফ্যাশন	charfesson.bhola.gov.bd
922	34	Doulatkhan	দৌলতখান	doulatkhan.bhola.gov.bd
923	34	Monpura	মনপুরা	monpura.bhola.gov.bd
924	34	Tazumuddin	তজুমদ্দিন	tazumuddin.bhola.gov.bd
925	34	Lalmohan	লালমোহন	lalmohan.bhola.gov.bd
926	35	Amtali	আমতলী	amtali.barguna.gov.bd
927	35	Barguna Sadar	বরগুনা সদর	sadar.barguna.gov.bd
928	35	Betagi	বেতাগী	betagi.barguna.gov.bd
929	35	Bamna	বামনা	bamna.barguna.gov.bd
930	35	Pathorghata	পাথরঘাটা	pathorghata.barguna.gov.bd
931	35	Taltali	তালতলি	taltali.barguna.gov.bd
932	36	Balaganj	বালাগঞ্জ	balaganj.sylhet.gov.bd
933	36	Beanibazar	বিয়ানীবাজার	beanibazar.sylhet.gov.bd
934	36	Bishwanath	বিশ্বনাথ	bishwanath.sylhet.gov.bd
935	36	Companiganj	কোম্পানীগঞ্জ	companiganj.sylhet.gov.bd
936	36	Fenchuganj	ফেঞ্চুগঞ্জ	fenchuganj.sylhet.gov.bd
937	36	Golapganj	গোলাপগঞ্জ	golapganj.sylhet.gov.bd
938	36	Gowainghat	গোয়াইনঘাট	gowainghat.sylhet.gov.bd
939	36	Jaintiapur	জৈন্তাপুর	jaintiapur.sylhet.gov.bd
940	36	Kanaighat	কানাইঘাট	kanaighat.sylhet.gov.bd
941	36	Sylhet Sadar	সিলেট সদর	sylhetsadar.sylhet.gov.bd
942	36	Zakiganj	জকিগঞ্জ	zakiganj.sylhet.gov.bd
943	36	Dakshinsurma	দক্ষিণ সুরমা	dakshinsurma.sylhet.gov.bd
944	36	Osmaninagar	ওসমানী নগর	osmaninagar.sylhet.gov.bd
945	37	Barlekha	বড়লেখা	barlekha.moulvibazar.gov.bd
946	37	Kamolganj	কমলগঞ্জ	kamolganj.moulvibazar.gov.bd
947	37	Kulaura	কুলাউড়া	kulaura.moulvibazar.gov.bd
948	37	Moulvibazar Sadar	মৌলভীবাজার সদর	moulvibazarsadar.moulvibazar.gov.bd
949	37	Rajnagar	রাজনগর	rajnagar.moulvibazar.gov.bd
950	37	Sreemangal	শ্রীমঙ্গল	sreemangal.moulvibazar.gov.bd
951	37	Juri	জুড়ী	juri.moulvibazar.gov.bd
952	38	Nabiganj	নবীগঞ্জ	nabiganj.habiganj.gov.bd
953	38	Bahubal	বাহুবল	bahubal.habiganj.gov.bd
954	38	Ajmiriganj	আজমিরীগঞ্জ	ajmiriganj.habiganj.gov.bd
955	38	Baniachong	বানিয়াচং	baniachong.habiganj.gov.bd
956	38	Lakhai	লাখাই	lakhai.habiganj.gov.bd
957	38	Chunarughat	চুনারুঘাট	chunarughat.habiganj.gov.bd
958	38	Habiganj Sadar	হবিগঞ্জ সদর	habiganjsadar.habiganj.gov.bd
959	38	Madhabpur	মাধবপুর	madhabpur.habiganj.gov.bd
960	39	Sunamganj Sadar	সুনামগঞ্জ সদর	sadar.sunamganj.gov.bd
961	39	South Sunamganj	দক্ষিণ সুনামগঞ্জ	southsunamganj.sunamganj.gov.bd
962	39	Bishwambarpur	বিশ্বম্ভরপুর	bishwambarpur.sunamganj.gov.bd
963	39	Chhatak	ছাতক	chhatak.sunamganj.gov.bd
964	39	Jagannathpur	জগন্নাথপুর	jagannathpur.sunamganj.gov.bd
965	39	Dowarabazar	দোয়ারাবাজার	dowarabazar.sunamganj.gov.bd
966	39	Tahirpur	তাহিরপুর	tahirpur.sunamganj.gov.bd
967	39	Dharmapasha	ধর্মপাশা	dharmapasha.sunamganj.gov.bd
968	39	Jamalganj	জামালগঞ্জ	jamalganj.sunamganj.gov.bd
969	39	Shalla	শাল্লা	shalla.sunamganj.gov.bd
970	39	Derai	দিরাই	derai.sunamganj.gov.bd
971	40	Belabo	বেলাবো	belabo.narsingdi.gov.bd
972	40	Monohardi	মনোহরদী	monohardi.narsingdi.gov.bd
973	40	Narsingdi Sadar	নরসিংদী সদর	narsingdisadar.narsingdi.gov.bd
974	40	Palash	পলাশ	palash.narsingdi.gov.bd
975	40	Raipura	রায়পুরা	raipura.narsingdi.gov.bd
976	40	Shibpur	শিবপুর	shibpur.narsingdi.gov.bd
977	41	Kaliganj	কালীগঞ্জ	kaliganj.gazipur.gov.bd
978	41	Kaliakair	কালিয়াকৈর	kaliakair.gazipur.gov.bd
979	41	Kapasia	কাপাসিয়া	kapasia.gazipur.gov.bd
980	41	Gazipur Sadar	গাজীপুর সদর	sadar.gazipur.gov.bd
981	41	Sreepur	শ্রীপুর	sreepur.gazipur.gov.bd
982	42	Shariatpur Sadar	শরিয়তপুর সদর	sadar.shariatpur.gov.bd
983	42	Naria	নড়িয়া	naria.shariatpur.gov.bd
984	42	Zajira	জাজিরা	zajira.shariatpur.gov.bd
985	42	Gosairhat	গোসাইরহাট	gosairhat.shariatpur.gov.bd
986	42	Bhedarganj	ভেদরগঞ্জ	bhedarganj.shariatpur.gov.bd
987	42	Damudya	ডামুড্যা	damudya.shariatpur.gov.bd
988	43	Araihazar	আড়াইহাজার	araihazar.narayanganj.gov.bd
989	43	Bandar	বন্দর	bandar.narayanganj.gov.bd
990	43	Narayanganj Sadar	নারায়নগঞ্জ সদর	narayanganjsadar.narayanganj.gov.bd
991	43	Rupganj	রূপগঞ্জ	rupganj.narayanganj.gov.bd
992	43	Sonargaon	সোনারগাঁ	sonargaon.narayanganj.gov.bd
993	44	Basail	বাসাইল	basail.tangail.gov.bd
994	44	Bhuapur	ভুয়াপুর	bhuapur.tangail.gov.bd
995	44	Delduar	দেলদুয়ার	delduar.tangail.gov.bd
996	44	Ghatail	ঘাটাইল	ghatail.tangail.gov.bd
997	44	Gopalpur	গোপালপুর	gopalpur.tangail.gov.bd
998	44	Madhupur	মধুপুর	madhupur.tangail.gov.bd
999	44	Mirzapur	মির্জাপুর	mirzapur.tangail.gov.bd
1000	44	Nagarpur	নাগরপুর	nagarpur.tangail.gov.bd
1001	44	Sakhipur	সখিপুর	sakhipur.tangail.gov.bd
1002	44	Tangail Sadar	টাঙ্গাইল সদর	tangailsadar.tangail.gov.bd
1003	44	Kalihati	কালিহাতী	kalihati.tangail.gov.bd
1004	44	Dhanbari	ধনবাড়ী	dhanbari.tangail.gov.bd
1005	45	Itna	ইটনা	itna.kishoreganj.gov.bd
1006	45	Katiadi	কটিয়াদী	katiadi.kishoreganj.gov.bd
1007	45	Bhairab	ভৈরব	bhairab.kishoreganj.gov.bd
1008	45	Tarail	তাড়াইল	tarail.kishoreganj.gov.bd
1009	45	Hossainpur	হোসেনপুর	hossainpur.kishoreganj.gov.bd
1010	45	Pakundia	পাকুন্দিয়া	pakundia.kishoreganj.gov.bd
1011	45	Kuliarchar	কুলিয়ারচর	kuliarchar.kishoreganj.gov.bd
1012	45	Kishoreganj Sadar	কিশোরগঞ্জ সদর	kishoreganjsadar.kishoreganj.gov.bd
1013	45	Karimgonj	করিমগঞ্জ	karimgonj.kishoreganj.gov.bd
1014	45	Bajitpur	বাজিতপুর	bajitpur.kishoreganj.gov.bd
1015	45	Austagram	অষ্টগ্রাম	austagram.kishoreganj.gov.bd
1016	45	Mithamoin	মিঠামইন	mithamoin.kishoreganj.gov.bd
1017	45	Nikli	নিকলী	nikli.kishoreganj.gov.bd
1018	46	Harirampur	হরিরামপুর	harirampur.manikganj.gov.bd
1019	46	Saturia	সাটুরিয়া	saturia.manikganj.gov.bd
1020	46	Manikganj Sadar	মানিকগঞ্জ সদর	sadar.manikganj.gov.bd
1021	46	Gior	ঘিওর	gior.manikganj.gov.bd
1022	46	Shibaloy	শিবালয়	shibaloy.manikganj.gov.bd
1023	46	Doulatpur	দৌলতপুর	doulatpur.manikganj.gov.bd
1024	46	Singiar	সিংগাইর	singiar.manikganj.gov.bd
1025	47	Savar	সাভার	savar.dhaka.gov.bd
1026	47	Dhamrai	ধামরাই	dhamrai.dhaka.gov.bd
1027	47	Keraniganj	কেরাণীগঞ্জ	keraniganj.dhaka.gov.bd
1028	47	Nawabganj	নবাবগঞ্জ	nawabganj.dhaka.gov.bd
1029	47	Dohar	দোহার	dohar.dhaka.gov.bd
1030	48	Munshiganj Sadar	মুন্সিগঞ্জ সদর	sadar.munshiganj.gov.bd
1031	48	Sreenagar	শ্রীনগর	sreenagar.munshiganj.gov.bd
1032	48	Sirajdikhan	সিরাজদিখান	sirajdikhan.munshiganj.gov.bd
1033	48	Louhajanj	লৌহজং	louhajanj.munshiganj.gov.bd
1034	48	Gajaria	গজারিয়া	gajaria.munshiganj.gov.bd
1035	48	Tongibari	টংগীবাড়ি	tongibari.munshiganj.gov.bd
1036	49	Rajbari Sadar	রাজবাড়ী সদর	sadar.rajbari.gov.bd
1037	49	Goalanda	গোয়ালন্দ	goalanda.rajbari.gov.bd
1038	49	Pangsa	পাংশা	pangsa.rajbari.gov.bd
1039	49	Baliakandi	বালিয়াকান্দি	baliakandi.rajbari.gov.bd
1040	49	Kalukhali	কালুখালী	kalukhali.rajbari.gov.bd
1041	50	Madaripur Sadar	মাদারীপুর সদর	sadar.madaripur.gov.bd
1042	50	Shibchar	শিবচর	shibchar.madaripur.gov.bd
1043	50	Kalkini	কালকিনি	kalkini.madaripur.gov.bd
1044	50	Rajoir	রাজৈর	rajoir.madaripur.gov.bd
1045	51	Gopalganj Sadar	গোপালগঞ্জ সদর	sadar.gopalganj.gov.bd
1046	51	Kashiani	কাশিয়ানী	kashiani.gopalganj.gov.bd
1047	51	Tungipara	টুংগীপাড়া	tungipara.gopalganj.gov.bd
1048	51	Kotalipara	কোটালীপাড়া	kotalipara.gopalganj.gov.bd
1049	51	Muksudpur	মুকসুদপুর	muksudpur.gopalganj.gov.bd
1050	52	Faridpur Sadar	ফরিদপুর সদর	sadar.faridpur.gov.bd
1051	52	Alfadanga	আলফাডাঙ্গা	alfadanga.faridpur.gov.bd
1052	52	Boalmari	বোয়ালমারী	boalmari.faridpur.gov.bd
1053	52	Sadarpur	সদরপুর	sadarpur.faridpur.gov.bd
1054	52	Nagarkanda	নগরকান্দা	nagarkanda.faridpur.gov.bd
1055	52	Bhanga	ভাঙ্গা	bhanga.faridpur.gov.bd
1056	52	Charbhadrasan	চরভদ্রাসন	charbhadrasan.faridpur.gov.bd
1057	52	Madhukhali	মধুখালী	madhukhali.faridpur.gov.bd
1058	52	Saltha	সালথা	saltha.faridpur.gov.bd
1059	53	Panchagarh Sadar	পঞ্চগড় সদর	panchagarhsadar.panchagarh.gov.bd
1060	53	Debiganj	দেবীগঞ্জ	debiganj.panchagarh.gov.bd
1061	53	Boda	বোদা	boda.panchagarh.gov.bd
1062	53	Atwari	আটোয়ারী	atwari.panchagarh.gov.bd
1063	53	Tetulia	তেতুলিয়া	tetulia.panchagarh.gov.bd
1064	54	Nawabganj	নবাবগঞ্জ	nawabganj.dinajpur.gov.bd
1065	54	Birganj	বীরগঞ্জ	birganj.dinajpur.gov.bd
1066	54	Ghoraghat	ঘোড়াঘাট	ghoraghat.dinajpur.gov.bd
1067	54	Birampur	বিরামপুর	birampur.dinajpur.gov.bd
1068	54	Parbatipur	পার্বতীপুর	parbatipur.dinajpur.gov.bd
1069	54	Bochaganj	বোচাগঞ্জ	bochaganj.dinajpur.gov.bd
1070	54	Kaharol	কাহারোল	kaharol.dinajpur.gov.bd
1071	54	Fulbari	ফুলবাড়ী	fulbari.dinajpur.gov.bd
1072	54	Dinajpur Sadar	দিনাজপুর সদর	dinajpursadar.dinajpur.gov.bd
1073	54	Hakimpur	হাকিমপুর	hakimpur.dinajpur.gov.bd
1074	54	Khansama	খানসামা	khansama.dinajpur.gov.bd
1075	54	Birol	বিরল	birol.dinajpur.gov.bd
1076	54	Chirirbandar	চিরিরবন্দর	chirirbandar.dinajpur.gov.bd
1077	55	Lalmonirhat Sadar	লালমনিরহাট সদর	sadar.lalmonirhat.gov.bd
1078	55	Kaliganj	কালীগঞ্জ	kaliganj.lalmonirhat.gov.bd
1079	55	Hatibandha	হাতীবান্ধা	hatibandha.lalmonirhat.gov.bd
1080	55	Patgram	পাটগ্রাম	patgram.lalmonirhat.gov.bd
1081	55	Aditmari	আদিতমারী	aditmari.lalmonirhat.gov.bd
1082	56	Syedpur	সৈয়দপুর	syedpur.nilphamari.gov.bd
1083	56	Domar	ডোমার	domar.nilphamari.gov.bd
1084	56	Dimla	ডিমলা	dimla.nilphamari.gov.bd
1085	56	Jaldhaka	জলঢাকা	jaldhaka.nilphamari.gov.bd
1086	56	Kishorganj	কিশোরগঞ্জ	kishorganj.nilphamari.gov.bd
1087	56	Nilphamari Sadar	নীলফামারী সদর	nilphamarisadar.nilphamari.gov.bd
1088	57	Sadullapur	সাদুল্লাপুর	sadullapur.gaibandha.gov.bd
1089	57	Gaibandha Sadar	গাইবান্ধা সদর	gaibandhasadar.gaibandha.gov.bd
1090	57	Palashbari	পলাশবাড়ী	palashbari.gaibandha.gov.bd
1091	57	Saghata	সাঘাটা	saghata.gaibandha.gov.bd
1092	57	Gobindaganj	গোবিন্দগঞ্জ	gobindaganj.gaibandha.gov.bd
1093	57	Sundarganj	সুন্দরগঞ্জ	sundarganj.gaibandha.gov.bd
1094	57	Phulchari	ফুলছড়ি	phulchari.gaibandha.gov.bd
1095	58	Thakurgaon Sadar	ঠাকুরগাঁও সদর	thakurgaonsadar.thakurgaon.gov.bd
1096	58	Pirganj	পীরগঞ্জ	pirganj.thakurgaon.gov.bd
1097	58	Ranisankail	রাণীশংকৈল	ranisankail.thakurgaon.gov.bd
1098	58	Haripur	হরিপুর	haripur.thakurgaon.gov.bd
1099	58	Baliadangi	বালিয়াডাঙ্গী	baliadangi.thakurgaon.gov.bd
1100	59	Rangpur Sadar	রংপুর সদর	rangpursadar.rangpur.gov.bd
1101	59	Gangachara	গংগাচড়া	gangachara.rangpur.gov.bd
1102	59	Taragonj	তারাগঞ্জ	taragonj.rangpur.gov.bd
1103	59	Badargonj	বদরগঞ্জ	badargonj.rangpur.gov.bd
1104	59	Mithapukur	মিঠাপুকুর	mithapukur.rangpur.gov.bd
1105	59	Pirgonj	পীরগঞ্জ	pirgonj.rangpur.gov.bd
1106	59	Kaunia	কাউনিয়া	kaunia.rangpur.gov.bd
1107	59	Pirgacha	পীরগাছা	pirgacha.rangpur.gov.bd
1108	60	Kurigram Sadar	কুড়িগ্রাম সদর	kurigramsadar.kurigram.gov.bd
1109	60	Nageshwari	নাগেশ্বরী	nageshwari.kurigram.gov.bd
1110	60	Bhurungamari	ভুরুঙ্গামারী	bhurungamari.kurigram.gov.bd
1111	60	Phulbari	ফুলবাড়ী	phulbari.kurigram.gov.bd
1112	60	Rajarhat	রাজারহাট	rajarhat.kurigram.gov.bd
1113	60	Ulipur	উলিপুর	ulipur.kurigram.gov.bd
1114	60	Chilmari	চিলমারী	chilmari.kurigram.gov.bd
1115	60	Rowmari	রৌমারী	rowmari.kurigram.gov.bd
1116	60	Charrajibpur	চর রাজিবপুর	charrajibpur.kurigram.gov.bd
1117	61	Sherpur Sadar	শেরপুর সদর	sherpursadar.sherpur.gov.bd
1118	61	Nalitabari	নালিতাবাড়ী	nalitabari.sherpur.gov.bd
1119	61	Sreebordi	শ্রীবরদী	sreebordi.sherpur.gov.bd
1120	61	Nokla	নকলা	nokla.sherpur.gov.bd
1121	61	Jhenaigati	ঝিনাইগাতী	jhenaigati.sherpur.gov.bd
1122	62	Fulbaria	ফুলবাড়ীয়া	fulbaria.mymensingh.gov.bd
1123	62	Trishal	ত্রিশাল	trishal.mymensingh.gov.bd
1124	62	Bhaluka	ভালুকা	bhaluka.mymensingh.gov.bd
1125	62	Muktagacha	মুক্তাগাছা	muktagacha.mymensingh.gov.bd
1126	62	Mymensingh Sadar	ময়মনসিংহ সদর	mymensinghsadar.mymensingh.gov.bd
1127	62	Dhobaura	ধোবাউড়া	dhobaura.mymensingh.gov.bd
1128	62	Phulpur	ফুলপুর	phulpur.mymensingh.gov.bd
1129	62	Haluaghat	হালুয়াঘাট	haluaghat.mymensingh.gov.bd
1130	62	Gouripur	গৌরীপুর	gouripur.mymensingh.gov.bd
1131	62	Gafargaon	গফরগাঁও	gafargaon.mymensingh.gov.bd
1132	62	Iswarganj	ঈশ্বরগঞ্জ	iswarganj.mymensingh.gov.bd
1133	62	Nandail	নান্দাইল	nandail.mymensingh.gov.bd
1134	62	Tarakanda	তারাকান্দা	tarakanda.mymensingh.gov.bd
1135	63	Jamalpur Sadar	জামালপুর সদর	jamalpursadar.jamalpur.gov.bd
1136	63	Melandah	মেলান্দহ	melandah.jamalpur.gov.bd
1137	63	Islampur	ইসলামপুর	islampur.jamalpur.gov.bd
1138	63	Dewangonj	দেওয়ানগঞ্জ	dewangonj.jamalpur.gov.bd
1139	63	Sarishabari	সরিষাবাড়ী	sarishabari.jamalpur.gov.bd
1140	63	Madarganj	মাদারগঞ্জ	madarganj.jamalpur.gov.bd
1141	63	Bokshiganj	বকশীগঞ্জ	bokshiganj.jamalpur.gov.bd
1142	64	Barhatta	বারহাট্টা	barhatta.netrokona.gov.bd
1143	64	Durgapur	দুর্গাপুর	durgapur.netrokona.gov.bd
1144	64	Kendua	কেন্দুয়া	kendua.netrokona.gov.bd
1145	64	Atpara	আটপাড়া	atpara.netrokona.gov.bd
1146	64	Madan	মদন	madan.netrokona.gov.bd
1147	64	Khaliajuri	খালিয়াজুরী	khaliajuri.netrokona.gov.bd
1148	64	Kalmakanda	কলমাকান্দা	kalmakanda.netrokona.gov.bd
1149	64	Mohongonj	মোহনগঞ্জ	mohongonj.netrokona.gov.bd
1150	64	Purbadhala	পূর্বধলা	purbadhala.netrokona.gov.bd
1151	64	Netrokona Sadar	নেত্রকোণা সদর	netrokonasadar.netrokona.gov.bd
1152	9	Eidgaon	ঈদগাঁও	null
1153	39	Madhyanagar	মধ্যনগর	null
1154	50	Dasar	ডাসার	null
1155	47	Uttara- Sector 4	উওরা- সেক্টর -৪	null
1156	47	Uttara- Sector 6	উওরা- সেক্টর -৬	null
1157	47	Uttara- Sector 8	উওরা- সেক্টর -৮	null
1158	47	Dhanmondi-27	ধানমন্ডি-২৭	null
1159	47	Dhanmondi-32	ধানমন্ডি-৩২	null
1160	47	Mirpur Estern Housing	মিরপুর ইস্টার্ণ হাউজিং	null
1161	47	Mirpur-Alubdi	মিরপুর- আলুব্দি	null
1162	47	Mirpur-7	মিরপুর-৭	null
1163	47	Shyamoli - Road No 01- 04	শ্যামলী - রোড ১থেকে ৪	null
1164	47	Agargaon	আগারগাঁও	null
1165	47	Azimpur	আজিমপুর	null
1166	47	Adabar	আদাবর	null
1167	47	Aftabnagar	আফতাবনগর	null
1168	47	Ibrahimpur	ইব্রাহিমপুর	null
1169	47	Islampur	ইসলামপুর	null
1170	47	Eskaton	ইস্কাটন	null
1171	47	Uttara- Sector 2	উওরা- সেক্টর -২	null
1172	47	Uttara- Sector 17	উওরা- সেক্টর ১৭	null
1173	47	Uttara- Sector 18	উওরা- সেক্টর ১৮	null
1174	47	UttarKhan	উত্তর খান	null
1175	47	Uttara	উত্তরা	null
1176	47	Uttara - Ranavola	উত্তরা - রানাভোলা	null
1177	47	Uttara-Abdullahpur	উত্তরা-আব্দুল্লাহপর	null
1178	47	Uttara-Kaola	উত্তরা-কাওলা	null
1179	47	Uttara-Kamarpara	উত্তরা-কামারপাড়া	null
1180	47	Uttara-Diabari	উত্তরা-দিয়াবাড়ি	null
1181	47	Uttara-Baunia	উত্তরা-বাউনিয়া	null
1182	47	Elephant Road	এ্যালিফেন্ট রোড	null
1183	47	Wari	ওয়ারী	null
1184	47	Kadamtoli	কদমতলী	null
1185	47	Kamalapur	কমলাপুর	null
1186	47	Kalabagan	কলাবাগান	null
1187	47	Kalyanpur	কল্যাণপুর	null
1188	47	Kawranbazar	কাওরানবাজার	null
1189	47	Kakrail	কাকরাইল	null
1190	47	Kazipara	কাজীপাড়া	null
1191	47	KathalBagan	কাঠালবাগান	null
1192	47	Kafrul	কাফরুল	null
1193	47	Kamrangirchar	কামরঙ্গীরচর	null
1194	47	Kuril Bisshoroad	কুড়িল বিশ্বরোড	null
1195	47	Kotwali	কোতয়ালী	null
1196	47	Cantonment	ক্যান্টনমেন্ট	null
1197	47	Cantonment-ECB	ক্যান্টনমেন্ট- ইসিবি	null
1198	47	Cantonment-Balughat	ক্যান্টনমেন্ট-বালুঘাট	null
1199	47	Cantonment-Matikata	ক্যান্টনমেন্ট-মাটিকাটা	null
1200	47	Cantonment-Manikdi	ক্যান্টনমেন্ট-মানিকদি	null
1201	47	Khilkhet	খিলখেত	null
1202	47	Khilkhet-Dumni	খিলখেত-ডুমনী	null
1203	47	Khilkhet-Namapara	খিলখেত-নামাপাড়া	null
1204	47	Khilkhet-Patira	খিলখেত-পাতিরা	null
1205	47	Khilkhet-Pink City	খিলখেত-পিংসিটি	null
1206	47	Khilkhet-Barua	খিলখেত-বরুয়া	null
1207	47	Khilgaon	খিলগাঁও	null
1208	47	Khilgaon - Goran	খিলগাঁও - গোড়ান	null
1209	47	Khilgaon - Thrimohni	খিলগাঁও - ত্রিমোহনী	null
1210	47	Khilgaon - Dakkhingaon	খিলগাঁও - দক্ষিনগাঁও	null
1211	47	Khilgaon - Nandipara	খিলগাঁও - নন্দিপাড়া	null
1212	47	Khilgaon - Nasirabad	খিলগাঁও - নাসিরাবাদ	null
1213	47	Khilgaon - Begunbari	খিলগাঁও - বেগুনবাড়ি	null
1214	47	Khilgaon - Meradia	খিলগাঁও - মেরাদিয়া	null
1215	47	Khilgaon - Shekher Jayga	খিলগাঁও - শেখের জায়গা	null
1216	47	Gabtali	গাবতলী	null
1217	47	Gulshan-1	গুলশান-১	null
1218	47	Gulshan-2	গুলশান-২	null
1219	47	Gulistan	গুলিস্থান	null
1220	47	Gandaria	গেন্ডারিয়া	null
1221	47	Green Road	গ্রীন রোড	null
1222	47	Choukbazar	চকবাজার	null
1223	47	Jigatala	জিগাতলা	null
1224	47	Jurain	জুরাইন	null
1225	47	Tikatuli	টিকাটুলি	null
1226	47	DU campus	ডিইউ ক্যাম্পাস	null
1227	47	Demra	ডেমরা	null
1228	47	Demra - Amulia	ডেমরা - আমুলিয়া	null
1229	47	Demra - Kayetpara	ডেমরা - কায়েতপাড়া	null
1230	47	Demra - Vabani	ডেমরা - ভাবানি	null
1231	47	Demra Bazer	ডেমরা বাজার	null
1232	47	Turag	তুরাগ	null
1233	47	Tejkunipara	তেজকুনিপাড়া	null
1234	47	Tejgaon	তেজগাঁও	null
1235	47	DakhinKhan	দক্ষিণখান	null
1236	47	Dayaganj	দয়াগঞ্জ	null
1237	47	Daraz Office	দারাজ অফিস	null
1238	47	Dhanmondi	ধানমন্ডি	null
1239	47	NayaPaltan	নয়া পল্টন	null
1240	47	Nardda	নর্দ্দা	null
1241	47	Nakhalpara	নাখালপাড়া	null
1242	47	Narinda	নারিন্দা	null
1243	47	New Eskaton	নিউ ইস্কাটন	null
1244	47	New Market	নিউ মার্কেট	null
1245	47	Nikunjo	নিকুঞ্জ	null
1246	47	Niketon	নিকেতন	null
1247	47	Nilkhet	নীলক্ষেত	null
1248	47	Polashi	পলাশী	null
1249	47	Pallabi	পল্লবী	null
1250	47	Panthapath	পান্থপথ	null
1251	47	Purana Paltan	পুরানা পল্টন	null
1252	47	Purbachal	পূর্বাচল	null
1253	47	Postagola	পোস্তগোলা	null
1254	47	Farmgate	ফার্মগেট	null
1255	47	Bakshibazar	বকশীবাজার	null
1256	47	Banasree	বনশ্রী	null
1257	47	Banani	বনানী	null
1258	47	Banani DOHS	বনানী ডিওএইচএস	null
1259	47	Bangshal	বংশাল	null
1260	47	Basundhara	বসুন্ধরা	null
1261	47	Basundhara -Joyarsahar	বসুন্ধরা- জোয়ারসাহার	null
1262	47	Badda	বাড্ডা	null
1263	47	Badda - United City	বাড্ডা - ইউনাইটেড সিটি	null
1264	47	Badda - Beraid	বাড্ডা - বেরাইদ	null
1265	47	Badda - Mogardia	বাড্ডা - মগারদিয়া	null
1266	47	Badda - Middle Badda	বাড্ডা - মধ্য বাড্ডা	null
1267	47	Badda - Saterkul	বাড্ডা - সাতারকুল	null
1268	47	Baridhara	বারিধারা	null
1269	47	Baridhara DOHS	বারিধারা ডিওএইচএস	null
1270	47	Banglabazar	বাংলাবাজার	null
1271	47	Banglamotor	বাংলামটর	null
1272	47	Basabo	বাসাবো	null
1273	47	Airport Thana	বিমানবন্দর থানা	null
1274	47	BUET campus	বুয়েট ক্যাম্পাস	null
1275	47	Vatara	ভাটারা	null
1276	47	Vashantek	ভাষানটেক	null
1277	47	Maghbazar	মগবাজার	null
1278	47	Motijheel	মতিঝিল	null
1279	47	Mohakhali	মহাখালী	null
1280	47	Mohakhali DOHS	মহাখালী ডিওএইচএস	null
1281	47	Maniknagar	মানিকনগর	null
1282	47	Malibag	মালিবাগ	null
1283	47	Mirpur	মিরপুর	null
1284	47	Mirpur DOHS	মিরপুর ডিওএইচএস	null
1285	47	Mirpur-1	মিরপুর-১	null
1286	47	Mirpur-10	মিরপুর-১০	null
1287	47	Mirpur-11	মিরপুর-১১	null
1288	47	Mirpur-12	মিরপুর-১২	null
1289	47	Mirpur-13	মিরপুর-১৩	null
1290	47	Mirpur-14	মিরপুর-১৪	null
1291	47	Mirpur-2	মিরপুর-২	null
1292	47	Mughda	মুগদা	null
1293	47	Mohammadpur	মোহাম্মদপুর	null
1294	47	Jatrabari	যাত্রাবাড়ী	null
1295	47	Ramna	রমনা	null
1296	47	Rajabazar	রাজাবাজার	null
1297	47	Rajarbag	রাজারবাগ	null
1298	47	Rampura	রামপুরা	null
1299	47	Rayerbag	রায়েরবাগ	null
1300	47	Rayerbazar	রায়েরবাজার	null
1301	47	Rupnagar	রূপনগর	null
1302	47	Lakshmibazar	লক্ষীবাজার	null
1303	47	Lalbag	লালবাগ	null
1304	47	Lalmatia	লালমাটিয়া	null
1305	47	Shonirakhra	শনিরআখড়া	null
1306	47	Shantinagar	শান্তিনগর	null
1307	47	Shajahanpur	শাহজানপুর	null
1308	47	Shahbag	শাহবাগ	null
1309	47	Shimrail	শিমরাইল	null
1310	47	Shukrabad	শুক্রাবাদ	null
1311	47	Sher-e-Bangla Nagar	শেরে বাংলা নগর	null
1312	47	Shampur	শ্যামপুর	null
1313	47	Shyamoli	শ্যামলী	null
1314	47	Sadarghat	সদরঘাট	null
1315	47	Sabujbag	সবুজবাগ	null
1316	47	Siddeswary	সিদ্ধেশ্বরী	null
1317	47	Sutrapur	সূত্রাপুর	null
1318	47	Segunbagicha	সেগুনবাগিচা	null
1319	47	Hazaribagh	হাজারীবাগ	null
1320	47	Hatirpul	হাতিরপুল	null
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_activities (id, user_id, "timestamp") FROM stdin;
1	1	2025-06-26T01:29:58.040+00:00
2	1	2025-06-26T01:30:48.296+00:00
3	1	2025-06-27T06:58:58.737+00:00
4	1	2025-07-21T15:37:22.715+00:00
5	1	2025-07-21T15:46:36.019+00:00
6	1	2025-08-08T03:39:34.983+00:00
7	1	2025-08-08T03:42:09.482+00:00
8	1	2025-08-08T04:05:38.239+00:00
9	1	2025-12-10T02:06:18.127+00:00
10	1	2025-12-11T02:12:36.846+00:00
11	1	2025-12-12T01:41:40.592+00:00
12	1	2025-12-13T12:33:50.213+00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, name, username, password, email, type, phone, dob, gender, point, address, image, role, status, last_login, last_logout, ip_address, divice_id, reset_token, created_at, updated_at, is_verified, verification_token, failed_login_attempts, block_until) FROM stdin;
1	gowtam kumar	gowtamkumar	$2a$10$KZkB1lyQePSqsXC.YzPd1Op7txHtdZ.NPTV85mF.cowLK289lv/Xq	gowtampaul0@gmail.com	Admin	\N	\N	\N	\N	\N	\N	Admin	Active	2025-12-13 12:33:50.18	\N	::ffff:172.19.0.5	\N	\N	2025-06-26 01:29:52.362724	2025-12-13 12:33:50.182612	f	\N	0	\N
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.wishlists (id, product_id, user_id, created_at, updated_at) FROM stdin;
1	2	1	2025-12-12 08:32:51.887369	2025-12-12 08:32:51.887369
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

SELECT pg_catalog.setval('public.carts_id_seq', 4, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- Name: colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.colors_id_seq', 1, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


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
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.currencies_id_seq', 2, true);


--
-- Name: discounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.discounts_id_seq', 1, false);


--
-- Name: districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.districts_id_seq', 128, true);


--
-- Name: divisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.divisions_id_seq', 16, true);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.files_id_seq', 8, true);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.leads_id_seq', 1, true);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.menus_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, true);


--
-- Name: order_trackings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.order_trackings_id_seq', 1, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.post_categories_id_seq', 1, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, true);


--
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 2, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.shipping_addresses_id_seq', 1, true);


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

SELECT pg_catalog.setval('public.unions_id_seq', 9080, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.units_id_seq', 2, true);


--
-- Name: upazilas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.upazilas_id_seq', 1320, true);


--
-- Name: user_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_activities_id_seq', 8, true);


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
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


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
-- Name: posts PK_2829ac61eff60fcec60d7274b9e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY (id);


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
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- Name: pages PK_8f21ed625aa34c8391d636b7d3b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY (id);


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
-- Name: post_categories PK_9c45c4e9fb6ebf296990e1d3972; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT "PK_9c45c4e9fb6ebf296990e1d3972" PRIMARY KEY (id);


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
-- Name: currencies PK_d528c54860c4182db13548e08c4; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY (id);


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
-- Name: leads UQ_b3eea7add0e16594dba102716c5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "UQ_b3eea7add0e16594dba102716c5" UNIQUE (email);


--
-- Name: shipping_charges UQ_bd573fdf130e65e1c0945cbd47a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges
    ADD CONSTRAINT "UQ_bd573fdf130e65e1c0945cbd47a" UNIQUE (district_id);


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
-- Name: pages UQ_fe66ca6a86dc94233e5d7789535; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT "UQ_fe66ca6a86dc94233e5d7789535" UNIQUE (slug);


--
-- Name: IDX_8e229d453b21312155c6ab8cfd; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_8e229d453b21312155c6ab8cfd" ON public.audit_logs USING btree ("resourceType", "resourceId");


--
-- Name: IDX_99e589da8f9e9326ee0d01a028; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_99e589da8f9e9326ee0d01a028" ON public.audit_logs USING btree ("userId", "createdAt");


--
-- Name: IDX_c69efb19bf127c97e6740ad530; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "IDX_c69efb19bf127c97e6740ad530" ON public.audit_logs USING btree ("createdAt");


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
-- Name: comments FK_259bf9825d9d198608d1b46b0b5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


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
-- Name: comments FK_4c675567d2a58f0b07cef09c13d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY (user_id) REFERENCES public.users(id);


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
-- Name: shipping_charges FK_bd573fdf130e65e1c0945cbd47a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.shipping_charges
    ADD CONSTRAINT "FK_bd573fdf130e65e1c0945cbd47a" FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: post_categories FK_becbe37977577e3eeb089b69fe1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT "FK_becbe37977577e3eeb089b69fe1" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: product_variants FK_bf3e96b7fc720a0ea3a81953373; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "FK_bf3e96b7fc720a0ea3a81953373" FOREIGN KEY (size_id) REFERENCES public.sizes(id) ON DELETE SET NULL;


--
-- Name: posts FK_c4f9a7bd77b489e711277ee5986; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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
-- Name: post_categories FK_f6e2655c798334198182db6399b; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT "FK_f6e2655c798334198182db6399b" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


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

\unrestrict Wxwad785ceWoquj8jfiqLQVxaB3WbQUpZTMUWGEfXa49tzrWgn1WCJA7bDZCxam

