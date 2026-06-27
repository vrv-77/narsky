alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_products enable row level security;
alter table public.promotion_categories enable row level security;
alter table public.coupons enable row level security;
alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.store_settings enable row level security;
alter table public.theme_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.invoice_details enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.stock_reservations enable row level security;
alter table public.stock_reservation_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.email_logs enable row level security;
alter table public.order_status_history enable row level security;
alter table public.admin_activity_logs enable row level security;
alter table public.admin_login_attempts enable row level security;

create policy "profiles_self_or_admin_select"
on public.profiles
for select
using (auth.uid() = id or app.can_manage_store());

create policy "profiles_self_update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "admin_roles_self_or_admin_select"
on public.admin_roles
for select
using (auth.uid() = user_id or app.is_admin());

create policy "admin_roles_admin_manage"
on public.admin_roles
for all
using (app.is_admin())
with check (app.is_admin());

create policy "categories_public_select"
on public.categories
for select
using (status = 'active' and deleted_at is null);

create policy "categories_admin_manage"
on public.categories
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "products_public_select"
on public.products
for select
using (status = 'active' and deleted_at is null);

create policy "products_admin_manage"
on public.products
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "product_images_public_select"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.status = 'active'
      and products.deleted_at is null
  )
);

create policy "product_images_admin_manage"
on public.product_images
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "promotions_public_select"
on public.promotions
for select
using (
  is_active = true and
  deleted_at is null and
  (starts_at is null or starts_at <= timezone('utc', now())) and
  (ends_at is null or ends_at >= timezone('utc', now()))
);

create policy "promotions_admin_manage"
on public.promotions
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "promotion_products_admin_manage"
on public.promotion_products
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "promotion_categories_admin_manage"
on public.promotion_categories
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "coupons_admin_manage"
on public.coupons
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "customers_admin_manage"
on public.customers
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "customer_addresses_admin_manage"
on public.customer_addresses
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "shipping_methods_public_select"
on public.shipping_methods
for select
using (is_active = true);

create policy "shipping_methods_admin_manage"
on public.shipping_methods
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "shipping_zones_public_select"
on public.shipping_zones
for select
using (is_active = true);

create policy "shipping_zones_admin_manage"
on public.shipping_zones
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "shipping_rates_public_select"
on public.shipping_rates
for select
using (is_active = true);

create policy "shipping_rates_admin_manage"
on public.shipping_rates
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "store_settings_public_select"
on public.store_settings
for select
using (is_active = true);

create policy "store_settings_admin_manage"
on public.store_settings
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "theme_settings_public_select"
on public.theme_settings
for select
using (is_active = true);

create policy "theme_settings_admin_manage"
on public.theme_settings
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "orders_admin_manage"
on public.orders
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "order_items_admin_manage"
on public.order_items
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "invoice_details_admin_manage"
on public.invoice_details
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "payments_admin_manage"
on public.payments
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "payment_events_admin_manage"
on public.payment_events
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "stock_reservations_admin_manage"
on public.stock_reservations
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "stock_reservation_items_admin_manage"
on public.stock_reservation_items
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "inventory_movements_admin_manage"
on public.inventory_movements
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "email_logs_admin_manage"
on public.email_logs
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "order_status_history_admin_manage"
on public.order_status_history
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "admin_activity_logs_admin_manage"
on public.admin_activity_logs
for all
using (app.can_manage_store())
with check (app.can_manage_store());

create policy "admin_login_attempts_admin_select"
on public.admin_login_attempts
for select
using (app.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-media', 'product-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('branding', 'branding', true, 3145728, array['image/jpeg', 'image/png', 'image/webp', 'image/x-icon'])
on conflict (id) do nothing;

create policy "storage_public_read_media"
on storage.objects
for select
using (bucket_id in ('product-media', 'branding'));

create policy "storage_admin_insert_media"
on storage.objects
for insert
to authenticated
with check (bucket_id in ('product-media', 'branding') and app.can_manage_store());

create policy "storage_admin_update_media"
on storage.objects
for update
to authenticated
using (bucket_id in ('product-media', 'branding') and app.can_manage_store())
with check (bucket_id in ('product-media', 'branding') and app.can_manage_store());

create policy "storage_admin_delete_media"
on storage.objects
for delete
to authenticated
using (bucket_id in ('product-media', 'branding') and app.can_manage_store());
