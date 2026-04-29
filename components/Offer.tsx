"use client";

import Image from "next/image";
import { OFFERS, COPY, type OfferId } from "@/lib/config";
import { formatQ } from "@/lib/gt";
import { Reveal } from "./Reveal";

interface Props {
  selected: OfferId;
  onSelect: (id: OfferId) => void;
}

export function Offer({ selected, onSelect }: Props) {
  return (
    <section
      id="oferta"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28"
    >
      {/* Tech grid */}
      <div aria-hidden className="absolute inset-0 tech-grid opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 accent-glow"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-warn)]/30 bg-[var(--color-warn)]/[0.07] px-4 py-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-warn)] animate-pulse-ring" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-warn)] sm:text-xs">
              {COPY.fomo.label}
            </span>
          </div>
          <h2 className="h-section text-3xl text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            <span className="gradient-text">Elegí tu combo</span>
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted)] sm:text-lg">
            {COPY.fomo.note}
          </p>
        </Reveal>

        {/* Cards de oferta */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {OFFERS.options.map((opt, idx) => {
            const isSelected = selected === opt.id;
            const isHero = opt.id === OFFERS.primary;
            const discount = Math.round(
              ((opt.anchorQ - opt.priceQ) / opt.anchorQ) * 100,
            );

            return (
              <Reveal key={opt.id} delay={idx * 100} className="h-full">
                <button
                  type="button"
                  onClick={() => onSelect(opt.id as OfferId)}
                  aria-pressed={isSelected}
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 sm:p-8 ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-gradient-to-br from-[var(--color-accent)]/[0.08] via-[var(--color-surface)] to-[var(--color-surface)] shadow-[0_24px_60px_-24px_rgba(0,255,136,0.3)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
                  } ${isHero ? "lg:scale-[1.04] lg:-translate-y-2" : ""}`}
                >
                  {/* Badge superior */}
                  {opt.badge && (
                    <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                        {opt.badge}
                      </span>
                    </div>
                  )}

                  {/* Visual del producto en el card */}
                  <div className="relative mx-auto mb-6 aspect-square w-full max-w-[180px]">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)]/15 via-transparent to-transparent"
                    />
                    <Image
                      src="/producto.png"
                      alt={opt.label}
                      fill
                      sizes="180px"
                      className="object-contain"
                    />
                    {/* Quantity indicator */}
                    {opt.qty > 1 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-1 text-xs font-bold text-[var(--color-text)]">
                        × {opt.qty}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    {opt.qty === 1 ? "Individual" : `Combo ${opt.qty} unidades`}
                  </p>
                  <h3 className="font-display mb-4 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                    {opt.label}
                  </h3>

                  {/* Precio */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-black text-[var(--color-text)] sm:text-5xl">
                        {formatQ(opt.priceQ)}
                      </span>
                      {discount > 0 && (
                        <span className="rounded-md bg-[var(--color-accent)]/15 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[var(--color-accent)]">
                          −{discount}%
                        </span>
                      )}
                    </div>
                    {opt.anchorQ > opt.priceQ && (
                      <p className="mt-1 text-sm text-[var(--color-muted)] line-through">
                        {formatQ(opt.anchorQ)}
                      </p>
                    )}
                    {opt.qty > 1 && (
                      <p className="mt-2 text-xs text-[var(--color-muted)]">
                        {formatQ(opt.perUnitQ)} cada una
                      </p>
                    )}
                  </div>

                  {/* Beneficios incluidos */}
                  <ul className="mb-6 mt-auto space-y-2 text-sm text-[var(--color-text-soft)]">
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Envío gratis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Pago contraentrega
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Garantía 7 días
                    </li>
                  </ul>

                  {/* Selector */}
                  <div
                    className={`flex items-center justify-between rounded-xl border p-3 transition ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                        : "border-[var(--color-border)] bg-[var(--color-bg-2)]"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider transition ${
                        isSelected
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {isSelected ? "Seleccionado" : "Elegir este combo"}
                    </span>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                        isSelected
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                          : "border-[var(--color-border-strong)] bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          aria-hidden
                          className="h-4 w-4 text-black"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8.5l3.5 3.5L13 4.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* CTA continuar */}
        <Reveal delay={400} className="mt-12 text-center">
          <a
            href="#pedir"
            className="btn-primary inline-flex w-full max-w-md sm:w-auto"
          >
            Continuar al pedido
            <ArrowRight />
          </a>
          <p className="mt-4 text-xs text-[var(--color-muted)]">
            🔒 No pagás nada ahora · Pagás cuando recibís
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 flex-shrink-0 text-[var(--color-accent)]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 4.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 3l5 5-5 5" />
    </svg>
  );
}
