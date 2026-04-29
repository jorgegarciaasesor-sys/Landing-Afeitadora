/**
 * Cliente para Shopify Admin API.
 * Usa custom line items — no requiere que el producto exista en Shopify.
 */

import { OFFERS, PRODUCT } from "./config";
import { toE164Gt } from "./gt";

const STORE = process.env.SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN!;
const VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

if (!STORE || !TOKEN) {
  console.warn(
    "[shopify] Faltan SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_TOKEN en .env.local",
  );
}

interface CreateOrderArgs {
  fullName: string;
  phone: string;          // 8 dígitos limpios
  department: string;
  address: string;
  offerId: string;
  idempotencyKey: string;
  attribution?: {
    source?: string;      // "tiktok", "meta", "direct"
    creative?: string;    // ID/nombre de creatividad
  };
}

export interface ShopifyOrderResult {
  ok: boolean;
  orderId?: number;
  orderName?: string;
  errorCode?: string;
  errorDetail?: string;
}

export async function createCodOrder(
  args: CreateOrderArgs,
): Promise<ShopifyOrderResult> {
  const offer = OFFERS.options.find((o) => o.id === args.offerId);
  if (!offer) {
    return { ok: false, errorCode: "INVALID_OFFER" };
  }

  // Separar nombre y apellido (Shopify acepta ambos)
  const nameParts = args.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? args.fullName;
  const lastName = nameParts.slice(1).join(" ") || ".";

  const phoneE164 = toE164Gt(args.phone);

  // Nota: idempotencia simplificada — se trackea vía note_attributes.
  // En producción real, agregar dedup por (phone + 60s ventana) si se vuelve necesario.

  // Tags simples para evitar problemas con caracteres especiales en Shopify
  const tagsArr = [
    "cod",
    "effi-pending",
    `landing-${PRODUCT.sku.toLowerCase().replace(/[^a-z0-9-]/g, "")}`,
  ];
  if (args.attribution?.source) {
    tagsArr.push(`src-${args.attribution.source}`);
  }
  const tags = tagsArr.join(", ");

  // El idempotency_key va en note_attributes en vez de tags (más limpio)

  const body = {
    order: {
      line_items: [
        {
          title: PRODUCT.shopifyTitle,
          price: offer.priceQ.toFixed(2),
          quantity: 1, // El "combo" es 1 ítem con el precio total del bundle
          requires_shipping: true,
          taxable: false,
          sku: `${PRODUCT.sku}-${offer.id}`,
          properties: [
            { name: "Combo", value: offer.label },
            { name: "Unidades", value: String(offer.qty) },
          ],
        },
      ],
      customer: {
        first_name: firstName,
        last_name: lastName,
        phone: phoneE164,
      },
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address1: args.address.slice(0, 255),
        city: args.department,
        province: args.department,
        country: "Guatemala",
        country_code: "GT",
        phone: phoneE164,
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        address1: args.address.slice(0, 255),
        city: args.department,
        province: args.department,
        country: "Guatemala",
        country_code: "GT",
        phone: phoneE164,
      },
      financial_status: "pending",
      currency: "GTQ",
      tags,
      note: `Pedido desde landing ${PRODUCT.shopifyTitle} — confirmar por WhatsApp antes de despachar.\nCombo: ${offer.label} (${offer.qty} unidades)`,
      note_attributes: [
        { name: "source", value: args.attribution?.source ?? "direct" },
        { name: "creative", value: args.attribution?.creative ?? "" },
        { name: "offer", value: offer.id },
        { name: "department", value: args.department },
        { name: "idempotency_key", value: args.idempotencyKey },
      ],
      send_receipt: false,
      send_fulfillment_receipt: false,
    },
  };

  // Backoff exponencial para 429 / 5xx
  const maxAttempts = 3;
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(
        `https://${STORE}/admin/api/${VERSION}/orders.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
          cache: "no-store",
        },
      );

      if (res.status === 401) return { ok: false, errorCode: "UNAUTHORIZED" };
      if (res.status === 403) return { ok: false, errorCode: "FORBIDDEN_SCOPE" };
      if (res.status === 422) {
        const errBody = await res.json().catch(() => ({}));
        return {
          ok: false,
          errorCode: "VALIDATION",
          errorDetail: JSON.stringify(errBody?.errors ?? errBody),
        };
      }

      if (res.ok) {
        const data = (await res.json()) as {
          order: { id: number; name: string };
        };
        return {
          ok: true,
          orderId: data.order.id,
          orderName: data.order.name,
        };
      }

      // 429 / 5xx → reintentar
      if (res.status === 429 || res.status >= 500) {
        lastError = `HTTP ${res.status}`;
        await new Promise((r) =>
          setTimeout(r, 500 * Math.pow(2, attempt - 1)),
        );
        continue;
      }

      lastError = `HTTP ${res.status}`;
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "network error";
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }
  }

  return {
    ok: false,
    errorCode: "NETWORK_OR_RETRIES_EXHAUSTED",
    errorDetail: lastError,
  };
}
