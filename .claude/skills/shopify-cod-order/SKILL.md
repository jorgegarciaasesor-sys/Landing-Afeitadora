---
name: shopify-cod-order
description: Use when creating a COD (cash on delivery) order in Shopify via Admin API from a server-side context (Next.js Server Action, Vercel Function, or any backend). Triggers include "create COD order in Shopify", "Shopify Admin API order", "POST /admin/api/orders", "send order to Effi", "Shopify order Guatemala", or troubleshooting why an order didn't reach Effi. Documents the exact request/response shape, required scopes, error codes, idempotency, and the handoff convention to Effi for fulfillment.
---

# Shopify COD Order — Admin API Reference

Documentación operativa del shape de request/response para crear una orden COD en Shopify desde server-side y dejarla lista para que Effi la recoja.

## Cuándo usar

- Al implementar la Server Action / API Route que recibe el form COD.
- Al debugear órdenes que llegan a Shopify pero no a Effi.
- Al actualizar a una nueva versión del Admin API de Shopify.
- Al onboarding de un nuevo producto en el catálogo (validar `variant_id` correcto).

## Pre-requisitos

### Scopes del Custom App

```
write_orders
read_orders
write_customers
read_customers
read_products
read_inventory      (opcional, si validás stock antes de crear)
```

Si falta cualquiera, el endpoint devuelve **403 Forbidden**.

### Variables de entorno

```env
SHOPIFY_STORE_DOMAIN=tutienda.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_API_VERSION=2025-01
```

⚠️ El token **debe** empezar con `shpat_`. Si empieza con `shpss_` es Storefront API y **no funciona** para crear órdenes.

## Endpoint

```
POST https://{SHOPIFY_STORE_DOMAIN}/admin/api/{SHOPIFY_API_VERSION}/orders.json

Headers:
  X-Shopify-Access-Token: {SHOPIFY_ADMIN_TOKEN}
  Content-Type: application/json
  Accept: application/json
```

## Request body — orden COD Guatemala

```json
{
  "order": {
    "line_items": [
      {
        "variant_id": 41234567890,
        "quantity": 2
      }
    ],
    "customer": {
      "first_name": "Diego",
      "last_name": "García",
      "phone": "+50255123456"
    },
    "shipping_address": {
      "first_name": "Diego",
      "last_name": "García",
      "address1": "5a avenida 12-34, Zona 10",
      "address2": "Edificio Real Reforma, oficina 304. Ref: frente al Wendy's.",
      "city": "Guatemala",
      "province": "Guatemala",
      "country": "Guatemala",
      "country_code": "GT",
      "phone": "+50255123456"
    },
    "billing_address": {
      "first_name": "Diego",
      "last_name": "García",
      "address1": "5a avenida 12-34, Zona 10",
      "address2": "Edificio Real Reforma, oficina 304. Ref: frente al Wendy's.",
      "city": "Guatemala",
      "province": "Guatemala",
      "country": "Guatemala",
      "country_code": "GT",
      "phone": "+50255123456"
    },
    "financial_status": "pending",
    "currency": "GTQ",
    "tags": "cod, effi-pending, landing-mini-shaver, idempotency:550e8400-e29b-41d4-a716-446655440000",
    "note": "Pedido desde landing — confirmar por WhatsApp antes de despachar.",
    "note_attributes": [
      { "name": "source", "value": "landing-mini-shaver" },
      { "name": "ad_platform", "value": "tiktok" },
      { "name": "creative_id", "value": "C1-emergencia-v3" }
    ],
    "send_receipt": false,
    "send_fulfillment_receipt": false,
    "inventory_behaviour": "decrement_obeying_policy"
  }
}
```

### Campos críticos — qué hace cada uno

| Campo | Valor | Por qué importa |
|---|---|---|
| `line_items[].variant_id` | ID numérico de la variante | Define qué producto y precio. Tomar de Shopify Admin → Products. |
| `line_items[].quantity` | 1, 2 o 3 según oferta seleccionada | Para 2x1 va `quantity: 2`, para 3x2 va `quantity: 3`. |
| `customer.phone` | E.164 con `+502` | Effi necesita teléfono con código país. |
| `shipping_address.country_code` | `"GT"` | Código ISO 3166-1 alpha-2. **Obligatorio**. |
| `shipping_address.province` | nombre del departamento | "Guatemala", "Quetzaltenango", etc. Sin código. |
| `financial_status` | `"pending"` | COD no está pagado al crear. Cuando se cobra al recibir, se actualiza a `"paid"`. |
| `currency` | `"GTQ"` | Quetzales. Sin esto, Shopify usa la default de la tienda. |
| `tags` | incluir `cod` + tag Effi | El tag dispara el flujo Effi (verificar convención exacta con la app instalada). |
| `note_attributes` | metadata del lead | Atribución de fuente para análisis post-venta. |
| `send_receipt` | `false` | La confirmación va por WhatsApp, no email Shopify. |
| `inventory_behaviour` | `"decrement_obeying_policy"` | Descuenta inventario respetando política del producto. |

### Descuentos en bundles 2x1 / 3x2

Para que el precio mostrado al cliente coincida con el cobro, aplicar `discount_codes` o `total_discounts`:

```json
"discount_codes": [
  {
    "code": "BUNDLE-2X1",
    "amount": "299.00",
    "type": "fixed_amount"
  }
]
```

O alternativamente, crear el bundle como una variante específica del producto en Shopify y usar ese `variant_id` directamente. **Recomendación**: variante específica > código de descuento (más fácil de trackear AOV y reportar).

## Response (éxito 201)

```json
{
  "order": {
    "id": 5234567890,
    "name": "#GT1042",
    "order_number": 1042,
    "financial_status": "pending",
    "fulfillment_status": null,
    "tags": "cod, effi-pending, landing-mini-shaver",
    "total_price": "299.00",
    "currency": "GTQ",
    "created_at": "2026-04-28T22:14:33-06:00",
    "customer": { "id": 4567890123, ... },
    "line_items": [...],
    "shipping_address": {...}
  }
}
```

Devolver al cliente solo `{ ok: true, orderId: order.id, orderName: order.name }`. **No devolver el response crudo** — filtra info no necesaria.

## Códigos de error

| Status | Body típico | Causa | Acción |
|---|---|---|---|
| **401** | `{"errors": "[API] Invalid API key or access token"}` | Token revocado/inválido | Detener. Pedir al usuario rotar token. **No reintentar**. |
| **403** | `{"errors": "Access denied"}` | Falta scope | Listar scope esperado. Reinstalar Custom App con scopes correctos. |
| **404** | `{"errors": "Not Found"}` | URL mal formada (api version, store domain) | Verificar env vars. |
| **422** | `{"errors": {"line_items": ["Variant id ... is not found"]}}` | Payload inválido | Devolver error específico al cliente. **No reintentar**. |
| **429** | `{"errors": "Throttled"}` | Rate limit | Backoff exponencial 500 ms / 1 s / 2 s, max 3 retries. |
| **5xx** | `{"errors": "Internal Server Error"}` | Shopify side | Backoff 1 s / 2 s / 4 s, max 3 retries. |

## Rate limits Shopify Admin API

- **REST**: 2 req/seg sostenido, bucket de 40. Si pasás, 429.
- Header `X-Shopify-Shop-Api-Call-Limit: 39/40` te dice cuánto del bucket usaste.
- Para landing COD volumen normal (decenas a cientos de órdenes/día) no es problema. Para campañas masivas, considerar GraphQL Admin API (cost-based, más generoso).

## Idempotencia

Generar UUID v4 client-side, enviarlo en el body de la Server Action y meterlo en `tags`:

```typescript
const idempotencyKey = crypto.randomUUID();

// Antes de POST a Shopify, chequear si ya existe:
const existing = await fetch(
  `https://${domain}/admin/api/${version}/orders.json?status=any&fields=id,tags&limit=1`
    + `&query=tag:idempotency:${idempotencyKey}`,
  { headers: { "X-Shopify-Access-Token": token } }
);

if (existingOrder) return { ok: true, orderId: existingOrder.id, dedup: true };

// Si no existe, crear con el tag.
```

Esto evita órdenes duplicadas si el cliente reenvía el form (red intermitente, doble click).

## Handoff a Effi — convención de tags

⚠️ **Verificar con la cuenta del usuario** cuál es el tag o trigger exacto que usa la instalación de Effi. Convenciones comunes:

| Convención | Cómo Effi la detecta |
|---|---|
| `tag: cod` | Effi escucha webhooks de `orders/create` filtrando por tag. |
| `tag: effi`, `tag: effi-pending` | Tag explícito del proveedor. |
| Metafield `effi.status: pending` | Más robusto pero requiere uno extra. |
| Webhook directo a Effi | Bypass del tag, requiere config en panel Effi. |

**Acción**: en el setup inicial, abrir un test order, ver si Effi la toma sola, y ajustar el tag según corresponda.

## Actualización post-creación

Cuando WhatsApp confirma la orden:
- `PUT /admin/api/{version}/orders/{order_id}.json` con `"financial_status": "authorized"` o agregar tag `confirmed`.

Cuando se entrega y se cobra:
- Crear transaction: `POST /admin/api/{version}/orders/{order_id}/transactions.json` con `kind: "capture"`, `amount`, `currency: "GTQ"`.
- O simplemente actualizar `financial_status: "paid"` si Effi reporta el cobro vía su propio webhook a Shopify.

## Eventos pixel post-creación

Después de un 201 exitoso:

```typescript
// Meta CAPI
await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`, {
  method: "POST",
  body: JSON.stringify({
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: idempotencyKey,            // dedup contra pixel cliente
      action_source: "website",
      user_data: { ph: [hashSha256(phone)], fn: [hashSha256(firstName)] },
      custom_data: { value: 299, currency: "GTQ", content_ids: [variantId] },
    }],
  }),
});

// TikTok Events API similar — endpoint y schema en docs oficial.
```

El evento `Purchase` real va cuando WhatsApp confirma — no al crear la orden.

## Checklist final

- [ ] Token `shpat_` con scopes correctos.
- [ ] Env vars cargadas (no hardcoded).
- [ ] Validación zod de input antes de tocar Shopify.
- [ ] Idempotencia con UUID + tag check.
- [ ] `currency: "GTQ"`, `country_code: "GT"`, `financial_status: "pending"`.
- [ ] Tag para Effi correcto (verificar convención de la app instalada).
- [ ] Manejo de 401/403/422 sin retry; 429/5xx con backoff.
- [ ] Response al cliente filtrada (solo `orderId`, `orderName`).
- [ ] Eventos CAPI/Events API disparados después del éxito.

## Referencias

- [Shopify Admin API — Orders](https://shopify.dev/docs/api/admin-rest/2025-01/resources/order)
- [Shopify Custom Apps](https://shopify.dev/docs/apps/build/scopes)
- `research/03-trends-landing-cod-latam-2026.md` sección 10 — pixel server-side.
- `.claude/agents/shopify-integrator.md` — agente que orquesta esta integración.
