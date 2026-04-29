# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Operación de dropshipping en Guatemala. Producto inicial: **mini afeitadora eléctrica portátil**. El plan es escalar a un catálogo de productos físicos de impulso vendidos COD en GT/LATAM.

- **Mercado**: Guatemala primero (78 % de e-commerce GT es COD).
- **Plataforma de ventas**: tienda Shopify ya existente.
- **Logística / fulfillment**: Effi (app instalada en Shopify; toma órdenes automáticamente).
- **Tráfico**: Meta Ads (Facebook + Instagram) y TikTok Ads.
- **Idioma**: español guatemalteco (no LATAM neutro).
- **Pago**: COD exclusivo en V1.

## Stack confirmado (build phase)

| Capa | Decisión | Razón |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server Actions limpias para llamar Shopify Admin API. Deploy nativo Vercel. |
| Lenguaje | TypeScript estricto | Validación de payloads (Zod), seguridad de tipos en formularios. |
| Estilos | **Tailwind v4** | Mobile-first, mantenible, rápido. |
| Hosting | **Vercel** | Edge runtime para landing, env vars seguras, Image Optimization. |
| Validación | Zod en input + server | Doble validación obligatoria. |
| Tracking | Meta CAPI + TikTok Events API server-side | Pixel cliente solo captura 60–80 % en 2026. Server-side es obligatorio. |

## Flujo de orden — end to end

```
1. Usuario llega a la landing desde Meta/TikTok ad
2. Llena form COD (4 campos: nombre, tel +502, departamento, dirección)
3. Server Action en Next.js valida (Zod) → genera idempotencyKey
4. POST /admin/api/{version}/orders.json a Shopify
   · financial_status: "pending"
   · currency: "GTQ"
   · country_code: "GT"
   · tags: cod, effi-pending, idempotency:{uuid}
5. Server Action devuelve { ok: true, orderId } al cliente
6. Disparo de eventos pixel server-side:
   · Meta CAPI → Lead
   · TikTok Events API → submit_form
7. App Effi (instalada en Shopify) detecta la orden y la toma para fulfillment
8. WhatsApp (app Confirmify/WhatFlow) envía mensaje al cliente con botones Confirmar/Cancelar
9. Confirma → orden pasa a "confirmed" → Effi despacha en 24–72 h
10. Repartidor cobra al entregar → financial_status: "paid"
11. Pixel Purchase real disparado (CAPI + Events API) — solo cuando confirmó por WhatsApp
```

## Convenciones de seguridad — obligatorias

### NUNCA

- ❌ Pegar tokens, API keys, secretos en archivos del repo (incluye comentarios, ejemplos, tests).
- ❌ Hardcodear `shpat_*`, `shpss_*`, pixel IDs reales o IDs de creadores.
- ❌ Commitear `.env.local`, `.env.production`, ni archivos con `.env` (excepto `.env.example` con placeholders).
- ❌ Loggear el body completo de la respuesta de Shopify (puede contener PII del cliente).

### SIEMPRE

- ✅ Variables de entorno desde `process.env.*`.
- ✅ `.env.example` versionado con nombres de vars y descripción, sin valores reales.
- ✅ `.env.local` en `.gitignore` desde el primer commit.
- ✅ Variables de producción en `Vercel → Project → Settings → Environment Variables`.
- ✅ Si un usuario o agent pega un token en chat, avisar inmediatamente que rote y regenere.

### Variables de entorno esperadas

```env
# Shopify
SHOPIFY_STORE_DOMAIN=tutienda.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx     # ⚠️ Admin API, NO Storefront
SHOPIFY_API_VERSION=2025-01

# Meta (CAPI)
META_PIXEL_ID=
META_CAPI_TOKEN=

# TikTok (Events API)
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=

# WhatsApp app (si aplica)
WHATSAPP_APP_TOKEN=

# Vercel runtime
NEXT_PUBLIC_SITE_URL=https://landing.tu-dominio.gt
```

⚠️ El token de Shopify **debe** empezar con `shpat_`. `shpss_` es Storefront API y no sirve para crear órdenes server-side.

## Estructura esperada del repo (cuando se haga la build)

```
.
├── app/                          # Next.js App Router
│   ├── (landing)/
│   │   ├── page.tsx              # Landing principal
│   │   └── thank-you/page.tsx
│   ├── api/
│   │   └── webhooks/             # Shopify / WhatsApp / Effi (si aplica)
│   ├── actions/
│   │   └── create-cod-order.ts   # Server Action principal
│   └── layout.tsx
├── components/
│   ├── landing/                  # Hero, Offer, FAQ, Form, etc.
│   └── ui/                       # Botones, inputs, etc.
├── lib/
│   ├── shopify/                  # cliente Admin API + tipos
│   ├── tracking/                 # Meta CAPI + TikTok Events API
│   ├── validation/               # esquemas Zod
│   └── gt/                       # constantes GT (departamentos, máscaras tel)
├── research/                     # docs de avatar, ángulos, tendencias
├── public/                       # imágenes, video UGC
├── .claude/
│   ├── agents/                   # agentes de proyecto
│   └── skills/                   # skills de proyecto
├── .env.example
├── .env.local                    # ❌ no commitear
├── CLAUDE.md
├── package.json
└── tsconfig.json
```

## Mapa de agentes — cuándo usar cada uno

Los archivos están en `.claude/agents/`. Invocar vía `Task` tool con `subagent_type`:

| Agente | Usar cuando |
|---|---|
| `copywriter-gt` | Escribir/refinar copy en español-GT: headlines, sub-hooks, CTAs, scripts de ads (TikTok/Meta), FAQ, mensajes WhatsApp, descripciones. **Siempre lee `research/01` y `research/02` primero.** |
| `shopify-integrator` | Cualquier integración server-side con Shopify Admin API: Server Actions, manejo de scopes, troubleshooting handoff con Effi, webhooks. |
| `conversion-optimizer` | Auditoría CRO de una landing existente, diseño de A/B tests, priorización de cambios, análisis del funnel ad → form → WhatsApp → entrega. |
| `frontend-developer` | Build técnica de la landing en Next.js: arquitectura de componentes, accesibilidad WCAG 2.2, performance LCP/INP/CLS. |
| `ui-ux-designer` | Auditoría visual y usabilidad de la landing antes de prender ads. |

## Mapa de skills de proyecto

Los skills están en `.claude/skills/`. Se activan automáticamente cuando el contexto los invoca:

| Skill | Para qué sirve |
|---|---|
| `avatar-research` | Framework para investigar el avatar de un nuevo producto del catálogo. Produce `research/NN-avatar-{producto}.md`. |
| `cod-form-best-practices` | Checklist + reglas de validación para construir/auditar el form COD GT (4 campos, máscara tel, dropdown 22 deptos, A11y). |
| `shopify-cod-order` | Referencia operativa del request/response al crear orden COD vía Shopify Admin API + handoff a Effi. |

Skills globales relevantes que ya existían: `copywriting`, `frontend-design`, `senior-frontend`, `seo-optimizer`, `ui-ux-pro-max`. Los project skills los complementan con conocimiento GT/COD/Shopify específico.

## Research base

| Doc | Qué contiene |
|---|---|
| `research/01-avatar-guatemala-mini-shaver.md` | Persona, JTBD, dolores, deseos, objeciones COD GT, pricing psychology, 22 departamentos, hipótesis a validar. |
| `research/02-sales-angles-mini-shaver.md` | 8 ángulos priorizados con scoring + hooks alternativos + plan de creatividades para Meta/TikTok. |
| `research/03-trends-landing-cod-latam-2026.md` | Anatomía de landing 2026, video UGC, form COD, trust badges, page speed targets, Meta CAPI + TikTok Events API. |

Cualquier copy o build técnico **debe leer estos 3 docs primero**. No inventar contexto.

## Comandos esperados (cuando exista el repo Next.js)

```bash
# Setup
pnpm install                      # o npm/yarn según se decida

# Dev
pnpm dev                          # localhost:3000

# Build
pnpm build
pnpm start

# Lint / type check
pnpm lint
pnpm typecheck                    # tsc --noEmit

# Deploy (Vercel)
vercel                            # preview
vercel --prod                     # producción
```

Cuando se inicialice el proyecto, actualizar este bloque con los comandos exactos del `package.json` real.

## Estado actual del proyecto (abril 2026)

- ✅ Research base completo (3 docs en `research/`).
- ✅ Agentes de proyecto definidos (3 en `.claude/agents/`).
- ✅ Skills de proyecto definidos (3 en `.claude/skills/`).
- ⏳ **Pendiente del usuario** antes de la siguiente iteración:
  - Token Admin API de Shopify (`shpat_*`) con scopes correctos. El token compartido inicialmente fue `shpss_*` (Storefront, no sirve para crear órdenes).
  - Specs reales del producto (batería, autonomía, dimensiones, garantía).
  - Precios definitivos: 1x / 2x1 / 3x2 + envío.
  - Fotos del producto (6–8 mínimo).
  - Decisión de branding (marca propia vs. neutro DR).
  - Dominio.
  - Pixel IDs (Meta + TikTok) o decisión de crearlos.
- ⏳ **Próxima iteración (no iniciada)**: copy final + build técnico + integración Shopify + deploy Vercel.

## Notas de trabajo con Claude Code en este repo

- El target principal es **mobile** (375 px). Diseñar y testear ahí primero.
- Tono de escritura: español-GT real, no LATAM neutro. "Q" siempre, nunca "$".
- Performance no es opcional: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Form COD: máximo 4 campos. Más es bajar CR.
- Pixel cliente solo no es suficiente en 2026 — server-side CAPI/Events API obligatorio.
- Effi toma órdenes vía Shopify automáticamente — verificar tag exacto que usa la instalación antes de prender ads.
