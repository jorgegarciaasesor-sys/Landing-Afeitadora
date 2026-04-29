import Image from "next/image";
import { COPY, BRAND } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-bg)] pt-20 sm:pt-28">
      {/* Tech grid backdrop */}
      <div aria-hidden className="absolute inset-0 tech-grid opacity-60" />

      {/* Top brand bar */}
      <div className="absolute inset-x-0 top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse-ring" />
            <span className="text-sm font-bold tracking-[0.4em] text-[var(--color-text)]">
              {BRAND.name}
            </span>
          </div>
          <a href="#oferta" className="btn-outline hidden text-xs sm:inline-flex">
            Comprar ahora
            <ArrowRight />
          </a>
        </div>
      </div>

      {/* Accent radial glow detrás del producto */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 accent-glow animate-orbit-glow sm:h-[800px] sm:w-[800px]"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:pt-24">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <p className="eyebrow mb-5 sm:mb-6">{COPY.hero.eyebrow}</p>

          <h1 className="h-hero mb-6 text-[2.6rem] sm:text-[3.75rem] lg:text-[5.25rem]">
            <span className="block gradient-text">{COPY.hero.headline}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg lg:mx-0 lg:text-xl">
            {COPY.hero.subhook}
          </p>

          {/* Bullets compactos en línea */}
          <ul className="mb-9 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[var(--color-text-soft)] sm:text-sm lg:justify-start">
            {COPY.hero.bullets.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5">
                <CheckIcon />
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <a href="#oferta" className="btn-primary">
              {COPY.hero.cta}
              <ArrowRight />
            </a>
            <a href="#detalle" className="btn-outline">
              Ver detalles
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
            {COPY.hero.trustLine}
          </p>
        </div>

        {/* Foto del producto — full bleed */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-[2.5rem]">
            {/* Halo */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/[0.18] via-transparent to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tl from-white/[0.02] via-transparent to-transparent"
            />

            <Image
              src="/producto.png"
              alt="PULSO Mini Pro — afeitadora portátil"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 460px"
              className="object-contain animate-float"
            />
          </div>

          {/* Stats badges flotantes */}
          <div className="pointer-events-none absolute -left-2 top-1/4 hidden lg:block">
            <FloatingBadge label="Autonomía" value="90 min" />
          </div>
          <div className="pointer-events-none absolute -right-2 bottom-1/4 hidden lg:block">
            <FloatingBadge label="Carga" value="USB-C" />
          </div>
        </div>
      </div>

      {/* Divisor inferior con marca */}
      <div className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg-2)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-5 py-4 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)] sm:px-8 sm:text-xs">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <DotIcon /> Pago contraentrega
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <DotIcon /> Envío gratis 24–72 h
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <DotIcon /> Garantía 7 días
          </span>
          <span className="hidden items-center gap-2 whitespace-nowrap sm:flex">
            <DotIcon /> Hecho para Guatemala
          </span>
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass animate-float rounded-2xl px-4 py-3 shadow-2xl shadow-black/40">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
        {label}
      </p>
      <p className="font-display text-lg font-bold text-[var(--color-text)]">
        {value}
      </p>
    </div>
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

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5 text-[var(--color-accent)]"
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

function DotIcon() {
  return (
    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-accent)]" />
  );
}
