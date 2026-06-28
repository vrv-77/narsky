# Formato de importación masiva de productos Narsky

Archivo base: `templates/importacion-productos-narsky.csv`

## Uso recomendado

- Trabajar en `CSV UTF-8`.
- Mantener la primera fila como encabezado.
- Usar una fila por producto.
- Referenciar la categoría por `category_slug`.
- Usar URLs públicas de imágenes o rutas que luego pueda procesar el importador.

## Columnas

- `external_id`: identificador interno del archivo o ERP. No existe hoy en la tabla, pero sirve para mapear importaciones futuras.
- `name`: nombre del producto.
- `slug`: slug único para URL pública.
- `sku`: SKU único.
- `category_slug`: slug de una categoría existente, por ejemplo `ropa`, `figuras`, `accesorios`, `decoracion`, `regalos`.
- `short_description`: texto corto para cards y resúmenes.
- `description`: descripción completa.
- `price`: precio actual en número, sin `$` ni puntos. Ejemplo `24990`.
- `compare_at_price`: precio anterior o de referencia. Debe ser mayor o igual a `price`.
- `stock`: stock actual.
- `minimum_stock`: umbral de alerta.
- `track_stock`: `true` o `false`.
- `allow_backorder`: `true` o `false`.
- `is_featured`: `true` o `false`.
- `is_new`: `true` o `false`.
- `status`: `draft`, `active`, `inactive` o `archived`.
- `primary_image_url`: imagen principal.
- `primary_image_alt`: alt de imagen principal.
- `secondary_image_url`: imagen secundaria opcional.
- `secondary_image_alt`: alt de imagen secundaria.
- `gallery_image_urls`: imágenes extra separadas por `|`.
- `seo_title`: título SEO opcional.
- `seo_description`: descripción SEO opcional.

## Reglas de validación

- `slug` debe ser único.
- `sku` debe ser único.
- `price` no puede ser negativo.
- `compare_at_price` debe ser vacío o mayor/igual a `price`.
- `stock` y `minimum_stock` deben ser enteros positivos o cero.
- `status` debe usar uno de los valores permitidos por la base.
- `category_slug` debe existir antes de importar productos.

## Flujo recomendado

1. Crear o verificar categorías.
2. Completar este CSV.
3. Validar duplicados de `slug` y `sku`.
4. Importar productos.
5. Procesar imágenes primarias, secundarias y galería.
6. Revisar productos en `/admin/productos`.

## Nota técnica para implementación futura

Cuando hagamos el importador, este formato puede convertirse así:

- `category_slug` -> buscar `categories.id`
- `primary_image_url` y `secondary_image_url` -> columnas de apoyo en `products`
- `gallery_image_urls` -> registros en `product_images`
- `external_id` -> útil para evitar duplicados en sincronizaciones futuras
