"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { COPY, OFFERS, type OfferId } from "@/lib/config";
import { GT_DEPARTMENTS, formatPhoneGt, formatQ } from "@/lib/gt";
import { submitCodOrder, type ActionResult } from "@/app/actions/create-cod-order";
import { Reveal } from "./Reveal";
import { trackInitiateCheckout, trackLead } from "./Pixels";

interface Props {
  selectedOffer: OfferId;
}

export function CodForm({ selectedOffer }: Props) {
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ orderName: string } | null>(null);

  const offer = OFFERS.options.find((o) => o.id === selectedOffer)!;

  if (success) {
    return (
      <section
        id="pedir"
        className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-24 sm:px-8 sm:py-32"
      >
        <Reveal className="mx-auto max-w-xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-accent)]/40 bg-gradient-to-br from-[var(--color-accent)]/[0.1] via-[var(--color-surface)] to-[var(--color-surface)] p-10 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] accent-glow"
            />
            <div className="relative">
              <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 text-4xl">
                ✓
              </div>
              <h2 className="h-section mb-4 text-3xl text-[var(--color-text)] sm:text-4xl">
                <span className="gradient-text">{COPY.form.successTitle}</span>
              </h2>
              <p className="mb-2 text-sm text-[var(--color-muted)]">
                Pedido{" "}
                <span className="font-mono font-bold text-[var(--color-text)]">
                  {success.orderName}
                </span>
              </p>
              <p className="text-base leading-relaxed text-[var(--color-text-soft)] sm:text-lg">
                {COPY.form.successBody}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    );
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    trackInitiateCheckout();

    const input = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      department: String(formData.get("department") || ""),
      address: String(formData.get("address") || ""),
      offerId: selectedOffer,
      website: String(formData.get("website") || ""),
    };

    startTransition(async () => {
      const result: ActionResult = await submitCodOrder(input);
      if (result.ok) {
        trackLead(offer.priceQ);
        setSuccess({ orderName: result.orderName });
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <section
      id="pedir"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div aria-hidden className="absolute inset-0 tech-grid opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 accent-glow"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Resumen del pedido — sticky en desktop */}
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <p className="eyebrow mb-5">Tu pedido</p>
            <h2 className="h-section mb-6 text-3xl text-[var(--color-text)] sm:text-4xl lg:text-5xl">
              <span className="gradient-text">
                Cerrá tu pedido contraentrega
              </span>
            </h2>

            {/* Card resumen */}
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="grid grid-cols-[120px_1fr] gap-5 border-b border-[var(--color-border)] p-5 sm:grid-cols-[140px_1fr] sm:p-6">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
                  <Image
                    src="/producto.png"
                    alt={offer.label}
                    fill
                    sizes="140px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                    {offer.qty === 1 ? "Individual" : `Combo × ${offer.qty}`}
                  </p>
                  <p className="font-display text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                    {offer.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    PULSO Mini Pro
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5 text-sm sm:p-6 sm:text-base">
                <Row label={`Subtotal (${offer.qty} ${offer.qty === 1 ? "unidad" : "unidades"})`} value={formatQ(offer.priceQ)} />
                <Row label="Envío" value="Gratis" accent />
                <Row label="Pago" value="Contraentrega" />
                <div className="my-4 border-t border-[var(--color-border)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    Total
                  </span>
                  <span className="font-display text-3xl font-black text-[var(--color-text)] sm:text-4xl">
                    {formatQ(offer.priceQ)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
              <TrustBadge icon="🔒" label="Pago al recibir" />
              <TrustBadge icon="🚚" label="Envío 24–72 h" />
              <TrustBadge icon="↩️" label="Devolución 7 días" />
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={150} className="lg:col-span-7">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10">
            <p className="text-sm text-[var(--color-muted)]">
              {COPY.form.subtitle}
            </p>

            <form action={handleSubmit} className="mt-6 space-y-5" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
              />

              <Field
                id="fullName"
                name="fullName"
                label={COPY.form.fields.fullName.label}
                placeholder={COPY.form.fields.fullName.placeholder}
                autoComplete="name"
                required
              />

              {/* Teléfono con prefijo */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-soft)]"
                >
                  {COPY.form.fields.phone.label}
                </label>
                <div className="flex gap-2">
                  <span className="flex flex-shrink-0 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 font-mono text-sm font-bold text-[var(--color-text)]">
                    {COPY.form.fields.phone.prefix}
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel-national"
                    placeholder={COPY.form.fields.phone.placeholder}
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneGt(e.target.value))}
                    maxLength={9}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3.5 text-base text-[var(--color-text)] transition placeholder:text-[var(--color-muted-strong)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-2)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Departamento */}
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-soft)]"
                >
                  {COPY.form.fields.department.label}
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  defaultValue="Guatemala"
                  autoComplete="address-level1"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3.5 text-base text-[var(--color-text)] transition focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-2)] focus:outline-none"
                >
                  <option value="" disabled>
                    {COPY.form.fields.department.placeholder}
                  </option>
                  {GT_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-soft)]"
                >
                  {COPY.form.fields.address.label}
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  placeholder={COPY.form.fields.address.placeholder}
                  className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3.5 text-base text-[var(--color-text)] transition placeholder:text-[var(--color-muted-strong)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-2)] focus:outline-none"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 p-4 text-sm text-[var(--color-warn)]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full !py-4 text-sm sm:text-base"
              >
                {isPending ? (
                  <>
                    <Spinner /> {COPY.form.submitting}
                  </>
                ) : (
                  <>
                    {COPY.form.submit} · {formatQ(offer.priceQ)}
                  </>
                )}
              </button>

              <p className="pt-2 text-center text-xs leading-relaxed text-[var(--color-muted)]">
                Te llamamos por WhatsApp en menos de 2 horas para confirmar.
                <br />
                Solo enviamos pedidos confirmados.
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  required,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-soft)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3.5 text-base text-[var(--color-text)] transition placeholder:text-[var(--color-muted-strong)] focus:border-[var(--color-accent)] focus:bg-[var(--color-surface-2)] focus:outline-none"
      />
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span
        className={`font-bold ${accent ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <p className="text-base">{icon}</p>
      <p className="mt-1">{label}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
