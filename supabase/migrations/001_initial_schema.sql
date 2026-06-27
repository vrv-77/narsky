create extension if not exists pgcrypto;

create schema if not exists app;

create type public.admin_role as enum ('admin', 'editor');
create type public.catalog_status as enum ('draft', 'active', 'inactive', 'archived');
create type public.promotion_scope as enum ('product', 'category', 'general');
create type public.promotion_discount_type as enum ('percentage', 'fixed_amount', 'special_price');
create type public.document_type as enum ('boleta', 'factura');
create type public.delivery_mode as enum ('pickup', 'shipping');
create type public.order_payment_status as enum (
  'pending_payment',
  'processing',
  'paid',
  'rejected',
  'cancelled',
  'expired',
  'refunded',
  'payment_error'
);
create type public.order_logistics_status as enum (
  'pending',
  'preparing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'cancelled'
);
create type public.payment_provider as enum ('flow');
create type public.inventory_movement_type as enum (
  'initial_stock',
  'confirmed_purchase',
  'manual_positive_adjustment',
  'manual_negative_adjustment',
  'cancellation',
  'return',
  'restock',
  'correction'
);
create type public.email_type as enum (
  'order_pending_payment',
  'order_paid',
  'order_rejected',
  'order_preparing',
  'order_shipped',
  'order_ready_for_pickup',
  'order_delivered',
  'order_cancelled',
  'admin_sale_confirmed',
  'admin_low_stock',
  'admin_out_of_stock',
  'admin_payment_error',
  'admin_email_error'
);
create type public.email_log_status as enum ('queued', 'sent', 'failed', 'skipped');
create type public.theme_mode as enum ('light', 'dark', 'system');
create type public.stock_reservation_status as enum ('active', 'released', 'applied', 'expired');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.admin_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function app.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_roles
    where user_id = auth.uid()
      and is_active = true
      and role = 'admin'
  );
$$;

create or replace function app.can_manage_store()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_roles
    where user_id = auth.uid()
      and is_active = true
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email,
      updated_at = timezone('utc', now());

  return new;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  status public.catalog_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  short_description text,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= price),
  stock integer not null default 0 check (stock >= 0),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  track_stock boolean not null default true,
  allow_backorder boolean not null default false,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  status public.catalog_status not null default 'draft',
  primary_image_alt text,
  secondary_image_alt text,
  seo_title text,
  seo_description text,
  last_stock_update timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null unique,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  scope public.promotion_scope not null,
  discount_type public.promotion_discount_type not null,
  percentage numeric(5, 2) check (percentage is null or (percentage > 0 and percentage <= 100)),
  amount numeric(12, 2) check (amount is null or amount > 0),
  special_price numeric(12, 2) check (special_price is null or special_price >= 0),
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  min_purchase_amount numeric(12, 2) check (min_purchase_amount is null or min_purchase_amount >= 0),
  usage_limit_total integer check (usage_limit_total is null or usage_limit_total > 0),
  usage_limit_per_order integer check (usage_limit_per_order is null or usage_limit_per_order > 0),
  priority integer not null default 0,
  is_stackable boolean not null default false,
  coupon_code text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  check (
    (discount_type = 'percentage' and percentage is not null and amount is null and special_price is null) or
    (discount_type = 'fixed_amount' and amount is not null and percentage is null and special_price is null) or
    (discount_type = 'special_price' and special_price is not null and amount is null and percentage is null)
  ),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.promotion_products (
  promotion_id uuid not null references public.promotions (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (promotion_id, product_id)
);

create table public.promotion_categories (
  promotion_id uuid not null references public.promotions (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (promotion_id, category_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  promotion_id uuid references public.promotions (id) on delete cascade,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  redemption_count integer not null default 0 check (redemption_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  normalized_rut text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  label text,
  recipient_name text not null,
  line1 text not null,
  line2 text,
  commune text not null,
  region text not null,
  reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  delivery_mode public.delivery_mode not null,
  description text,
  is_active boolean not null default true,
  fixed_cost numeric(12, 2) not null default 0 check (fixed_cost >= 0),
  free_from_amount numeric(12, 2) check (free_from_amount is null or free_from_amount >= 0),
  estimated_window text,
  instructions text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  shipping_method_id uuid not null references public.shipping_methods (id) on delete cascade,
  name text not null,
  region text,
  commune text,
  no_coverage boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  shipping_method_id uuid not null references public.shipping_methods (id) on delete cascade,
  shipping_zone_id uuid references public.shipping_zones (id) on delete cascade,
  commune text,
  cost numeric(12, 2) not null default 0 check (cost >= 0),
  free_from_amount numeric(12, 2) check (free_from_amount is null or free_from_amount >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  commercial_name text,
  legal_name text,
  company_rut text,
  business_activity text,
  address text,
  store_email text,
  public_contact_email text,
  store_phone text,
  whatsapp text,
  social_links jsonb not null default '{}'::jsonb,
  currency_code text not null default 'CLP',
  price_format text not null default '$ {{amount}}',
  timezone text not null default 'America/Santiago',
  shipping_message text,
  pickup_message text,
  checkout_message text,
  terms_html text,
  privacy_html text,
  sales_notification_email text,
  footer_text text,
  home_sections jsonb not null default '{
    "showBanner": true,
    "showFeaturedProducts": true,
    "showFeaturedCategories": true,
    "showNewProducts": true,
    "showActiveOffers": true,
    "showShippingInfo": true,
    "showPaymentMethods": true,
    "showInformationBlock": true
  }'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.theme_settings (
  id uuid primary key default gen_random_uuid(),
  theme_mode public.theme_mode not null default 'light',
  logo_url text,
  favicon_url text,
  primary_color text not null default '#be5b2c',
  secondary_color text not null default '#194b47',
  accent_color text not null default '#e7b84f',
  background_color text not null default '#f7f2ea',
  surface_color text not null default '#fffdf9',
  text_color text not null default '#1f2937',
  muted_text_color text not null default '#6b7280',
  button_text_color text not null default '#fffaf5',
  border_radius text not null default '1.25rem',
  shadow_style text not null default 'soft',
  heading_font text not null default 'var(--font-source-serif), serif',
  body_font text not null default 'var(--font-manrope), sans-serif',
  base_font_size text not null default '16px',
  card_style text not null default 'elevated',
  content_max_width text not null default '1200px',
  show_contact_button boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  public_token text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  customer_email text not null,
  customer_full_name text not null,
  customer_rut text,
  customer_phone text,
  shipping_address_snapshot jsonb,
  billing_address_snapshot jsonb,
  delivery_mode public.delivery_mode not null,
  shipping_method_id uuid references public.shipping_methods (id) on delete set null,
  shipping_method_name text,
  shipping_amount numeric(12, 2) not null default 0 check (shipping_amount >= 0),
  shipping_label text,
  shipping_reference text,
  subtotal_amount numeric(12, 2) not null default 0 check (subtotal_amount >= 0),
  discount_amount numeric(12, 2) not null default 0 check (discount_amount >= 0),
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  payment_status public.order_payment_status not null default 'pending_payment',
  logistics_status public.order_logistics_status not null default 'pending',
  document_type public.document_type not null default 'boleta',
  admin_note text,
  checkout_comment text,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  placed_at timestamptz not null default timezone('utc', now()),
  paid_at timestamptz,
  cancelled_at timestamptz,
  flow_token text,
  flow_order_id text,
  flow_payment_id text,
  source_channel text not null default 'storefront',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  product_name text not null,
  product_slug text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  discount_amount numeric(12, 2) not null default 0 check (discount_amount >= 0),
  final_unit_price numeric(12, 2) not null check (final_unit_price >= 0),
  line_total numeric(12, 2) not null check (line_total >= 0),
  image_url text,
  taxes_amount numeric(12, 2) not null default 0 check (taxes_amount >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.invoice_details (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  company_name text not null,
  company_rut text not null,
  business_activity text not null,
  tax_address text not null,
  commune text not null,
  region text not null,
  billing_email text not null,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider public.payment_provider not null default 'flow',
  provider_reference text,
  provider_token text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency_code text not null default 'CLP',
  status public.order_payment_status not null default 'pending_payment',
  is_test_mode boolean not null default true,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments (id) on delete cascade,
  order_id uuid references public.orders (id) on delete cascade,
  event_type text not null,
  provider_reference text,
  event_payload jsonb not null default '{}'::jsonb,
  is_verified boolean not null default false,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  expires_at timestamptz not null,
  status public.stock_reservation_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.stock_reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.stock_reservations (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  order_id uuid references public.orders (id) on delete set null,
  admin_user_id uuid references auth.users (id) on delete set null,
  previous_quantity integer not null check (previous_quantity >= 0),
  delta_quantity integer not null check (delta_quantity <> 0),
  resulting_quantity integer not null check (resulting_quantity >= 0),
  movement_type public.inventory_movement_type not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.email_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  email_type public.email_type not null,
  recipient_email text not null,
  status public.email_log_status not null default 'queued',
  resend_id text,
  template_name text,
  error_message text,
  last_attempt_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  payment_status public.order_payment_status,
  logistics_status public.order_logistics_status,
  note text,
  changed_by_admin_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  ip_address text not null,
  user_agent text,
  success boolean not null default false,
  user_id uuid references auth.users (id) on delete set null,
  failure_reason text,
  blocked_until timestamptz,
  attempted_at timestamptz not null default timezone('utc', now())
);

create unique index product_images_one_primary_per_product_idx
  on public.product_images (product_id)
  where is_primary = true;

create unique index store_settings_one_active_idx
  on public.store_settings ((true))
  where is_active = true;

create unique index theme_settings_one_active_idx
  on public.theme_settings ((true))
  where is_active = true;

create index categories_status_sort_idx
  on public.categories (status, sort_order)
  where deleted_at is null;

create index products_status_created_idx
  on public.products (status, created_at desc)
  where deleted_at is null;

create index products_category_idx
  on public.products (category_id)
  where deleted_at is null;

create index promotions_active_window_idx
  on public.promotions (is_active, starts_at, ends_at)
  where deleted_at is null;

create index orders_status_idx
  on public.orders (payment_status, logistics_status, created_at desc);

create index orders_customer_email_idx
  on public.orders (customer_email);

create index payments_provider_reference_idx
  on public.payments (provider_reference);

create index payment_events_order_idx
  on public.payment_events (order_id, created_at desc);

create index stock_reservations_status_idx
  on public.stock_reservations (status, expires_at);

create index inventory_movements_product_idx
  on public.inventory_movements (product_id, created_at desc);

create index email_logs_order_idx
  on public.email_logs (order_id, created_at desc);

create index admin_activity_logs_user_idx
  on public.admin_activity_logs (admin_user_id, created_at desc);

create index admin_login_attempts_ip_idx
  on public.admin_login_attempts (ip_address, attempted_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger admin_roles_set_updated_at
before update on public.admin_roles
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger promotions_set_updated_at
before update on public.promotions
for each row execute function public.set_updated_at();

create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger customer_addresses_set_updated_at
before update on public.customer_addresses
for each row execute function public.set_updated_at();

create trigger shipping_methods_set_updated_at
before update on public.shipping_methods
for each row execute function public.set_updated_at();

create trigger shipping_zones_set_updated_at
before update on public.shipping_zones
for each row execute function public.set_updated_at();

create trigger shipping_rates_set_updated_at
before update on public.shipping_rates
for each row execute function public.set_updated_at();

create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

create trigger theme_settings_set_updated_at
before update on public.theme_settings
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger invoice_details_set_updated_at
before update on public.invoice_details
for each row execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger stock_reservations_set_updated_at
before update on public.stock_reservations
for each row execute function public.set_updated_at();

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_user();
