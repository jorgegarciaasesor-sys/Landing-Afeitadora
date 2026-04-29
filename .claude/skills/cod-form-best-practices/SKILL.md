---
name: cod-form-best-practices
description: Use when designing, building, or auditing a COD (cash on delivery / contraentrega) order form for a Guatemalan landing page. Triggers include "form COD", "checkout contraentrega", "order form Guatemala", "phone validation Guatemala", "departamento dropdown", or any form that captures customer name, phone, department, and address for COD shipping. Provides a deterministic checklist + ready-to-use validation rules + accessibility requirements.
---

# COD Form — Best Practices Guatemala 2026

Checklist y patrones reutilizables para construir un form COD que convierta en Guatemala. Aplicable a cualquier landing del catálogo.

## Cuándo usar

- Al diseñar el form de una landing nueva.
- Al auditar un form existente que está convirtiendo bajo.
- Al validar accesibilidad o la integración con la Server Action a Shopify.

## Campos — los únicos 4 necesarios

```
1. Nombre completo            (text)
2. Teléfono (WhatsApp)        (tel) — máscara +502 ____-____
3. Departamento               (select) — 22 opciones
4. Dirección de entrega       (textarea) — incluye zona + ref
```

**No agregar**:
- ❌ Email — innecesario en COD, suma fricción.
- ❌ Apellido separado — un solo campo "nombre completo".
- ❌ Cantidad — la oferta seleccionada lo define.
- ❌ Notas/comentarios — caben en el textarea de dirección.
- ❌ Contraseña / registro — COD es one-shot, sin cuenta.

## Validación

### Nombre

```ts
fullName: z.string().trim().min(3, "Nombre muy corto").max(80)
```

### Teléfono Guatemala

Formato esperado: 8 dígitos, sin código país en el input visible.

```ts
// Móviles GT empiezan con 3, 4 o 5
// Fijos GT empiezan con 2, 6 o 7
phone: z.string()
  .transform(v => v.replace(/\D/g, ""))           // quitar guiones/espacios
  .pipe(z.string().regex(/^[2-7]\d{7}$/, "Teléfono inválido"))
```

Antes de enviar a Shopify, **anteponer `+502`** → formato E.164 `+50255123456`.

Máscara visual sugerida (input):
```
+502 ####-####
```
Con autoformat al escribir: `4123` → `4123-`, `41234567` → `4123-4567`.

### Departamento

Dropdown obligatorio con las 22 opciones (orden alfabético):

```ts
const GT_DEPARTMENTS = [
  "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula",
  "El Progreso", "Escuintla", "Guatemala", "Huehuetenango",
  "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
  "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos",
  "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa",
] as const;

department: z.enum(GT_DEPARTMENTS)
```

Pre-seleccionar **"Guatemala"** si la mayoría del tráfico es capitalino (típico).

### Dirección

```ts
address: z.string().trim().min(10, "Dirección muy corta").max(300)
```

Placeholder útil:
> *"Zona 10, 5a avenida 12-34, Edificio Real Reforma, oficina 304. Ref: frente al Wendy's."*

## UX — reglas que mueven CR

| Práctica | Por qué |
|---|---|
| **Inputs grandes** (min-height 48 px) | Mobile-first, target táctil. WCAG 2.2 Target Size Min. |
| **Labels arriba**, no flotantes | Más legibles, no se ocultan al escribir. |
| **`inputmode="tel"`** en teléfono | Abre teclado numérico en mobile. |
| **`autocomplete` correcto** | `name`, `tel`, `address-level1`, `street-address`. |
| **Errores inline**, debajo del campo, en rojo accesible | No mostrar todos los errores arriba después del submit. |
| **Botón submit con label de acción + valor** | "PEDIR AHORA · PAGO CONTRAENTREGA · Q299" |
| **Mensaje de éxito instantáneo** | "✅ Tu pedido fue recibido. Te llamamos por WhatsApp en menos de 2 horas." |
| **Loading state en submit** | Botón disabled + spinner. Evita doble submit. |
| **Pre-fill desde URL params** | `?dept=guatemala&phone=...&offer=2x1` |
| **Multi-step (opcional)** | Paso 1: tel + nombre. Paso 2: depto + dirección. +21 % CR vs. todo junto. |

## Anti-patterns

- ❌ Captcha visible (reCAPTCHA v2 con casilla, hCaptcha visible). Usar honeypot + validación server-side.
- ❌ Dropdown nativo mobile sin estilo — usar componente accesible custom o `<select>` bien estilizado.
- ❌ Validación solo client-side. **Siempre revalidar en server**.
- ❌ "Este campo es requerido" en cada campo — solo en los que faltaron.
- ❌ Auto-submit cuando se completa el último campo. Confunde y crea órdenes sin querer.
- ❌ Campos tipo "DPI", "fecha de nacimiento" — irrelevantes para COD impulso.

## Anti-bot suave

```ts
// Honeypot: campo invisible que un bot llena pero un humano no ve.
<input type="text" name="website" tabIndex={-1} autoComplete="off"
       style={{ position: "absolute", left: "-9999px" }} />

// En server:
if (formData.get("website")) return { ok: false, code: "spam" };
```

Combinar con:
- Time-to-submit mínimo de 2 s (un bot llena en < 500 ms).
- Rate limit por IP en la Server Action (3 intentos / 10 min).
- Validación de formato teléfono antes de tocar Shopify (descarta basura).

## Accesibilidad — WCAG 2.2

- [ ] Cada input tiene `<label>` asociado.
- [ ] `aria-invalid="true"` y `aria-describedby` en inputs con error.
- [ ] Mensajes de error con `role="alert"` o región `aria-live="polite"`.
- [ ] Contraste texto 4.5:1 mínimo (errores en rojo accesible, no #FF0000 puro).
- [ ] Foco visible en todos los inputs y el botón (no `outline: none` sin alternativa).
- [ ] Botón submit con texto, no solo ícono.
- [ ] Tab order lógico (nombre → tel → depto → dirección → submit).
- [ ] Compatible con teclado solo (sin atajos exclusivos de mouse).

## Integración con Shopify (handoff a `shopify-integrator` agent)

Después de validar input, el form llama a la Server Action que:

1. Recibe los 4 campos validados.
2. Anteponi `+502` al teléfono → formato E.164.
3. Genera `idempotencyKey` (UUID v4).
4. Llama a Shopify Admin API `POST /admin/api/{version}/orders.json`.
5. Devuelve `{ ok: true, orderId }` o `{ ok: false, code }`.

Ver agente `shopify-integrator` para el shape del payload y manejo de errores.

## Checklist final antes de prender ads

- [ ] Form tiene exactamente 4 campos.
- [ ] Validación zod (o equivalente) client + server.
- [ ] Máscara teléfono GT visible.
- [ ] Dropdown 22 departamentos completo.
- [ ] Honeypot + rate limit activos.
- [ ] Mensaje de éxito post-submit ("Te llamamos por WhatsApp…").
- [ ] Loading state en submit, no doble submit posible.
- [ ] WCAG 2.2 — labels, errores accesibles, foco visible.
- [ ] Pre-fill desde URL params funcionando.
- [ ] Server Action conectada a Shopify devuelve orderId al éxito.
- [ ] Eventos pixel (Lead) disparados después del submit exitoso.

## Referencias

- `research/03-trends-landing-cod-latam-2026.md` — sección 5 (form quirúrgico).
- `research/01-avatar-guatemala-mini-shaver.md` — sección 7 (cobertura departamentos).
- WCAG 2.2 Target Size Minimum (target táctil 24 × 24 px AA, 44 × 44 px AAA).
