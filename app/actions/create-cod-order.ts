"use server";

import { headers } from "next/headers";
import { CodOrderInput, type CodOrderInputType } from "@/lib/validation";
import { createCodOrder, type ShopifyOrderResult } from "@/lib/shopify";

/** Rate limit muy simple en memoria por IP (10 intentos / 10 min) */
const ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = ATTEMPTS.get(ip);
  if (!entry || entry.resetAt < now) {
    ATTEMPTS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

export type ActionResult =
  | { ok: true; orderName: string }
  | { ok: false; code: string; message: string };

export async function submitCodOrder(
  rawInput: unknown,
): Promise<ActionResult> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (!checkRate(ip)) {
    return {
      ok: false,
      code: "RATE_LIMIT",
      message: "Demasiados intentos. Esperá unos minutos o escribinos por WhatsApp.",
    };
  }

  // 1. Validación zod
  const parsed = CodOrderInput.safeParse(rawInput);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      code: "VALIDATION",
      message: first?.message ?? "Datos inválidos",
    };
  }

  // 2. Honeypot — campo "website" debe venir vacío
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: false, code: "SPAM", message: "Detección anti-bot." };
  }

  const data = parsed.data as CodOrderInputType;

  // 3. Idempotency key + atribución
  const idempotencyKey = crypto.randomUUID();
  const referer = h.get("referer") ?? "";
  const ua = h.get("user-agent") ?? "";
  const source = ua.includes("TikTok")
    ? "tiktok"
    : referer.includes("facebook") || referer.includes("instagram")
      ? "meta"
      : "direct";

  // 4. Crear orden en Shopify
  const result: ShopifyOrderResult = await createCodOrder({
    fullName: data.fullName,
    phone: data.phone,
    department: data.department,
    address: data.address,
    offerId: data.offerId,
    idempotencyKey,
    attribution: { source },
  });

  if (!result.ok) {
    // Errores que el usuario puede entender
    const userMessage =
      result.errorCode === "UNAUTHORIZED"
        ? "Hay un problema técnico. Escribinos por WhatsApp y te ayudamos."
        : result.errorCode === "VALIDATION"
          ? "Revisá los datos e intentá de nuevo."
          : "No pudimos procesar tu pedido. Intentá de nuevo o escribinos por WhatsApp.";

    // Log server-side para debug (no se ve en el cliente)
    console.error("[create-cod-order] Shopify error:", {
      code: result.errorCode,
      detail: result.errorDetail,
    });

    return {
      ok: false,
      code: result.errorCode ?? "UNKNOWN",
      message: userMessage,
    };
  }

  return { ok: true, orderName: result.orderName ?? `#${result.orderId}` };
}
