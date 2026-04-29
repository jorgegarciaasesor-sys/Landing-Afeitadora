import Image from "next/image";
import { COPY } from "@/lib/config";
import { Reveal } from "./Reveal";

export function Problem() {
  return (
    <section
      id="detalle"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 max-w-3xl sm:mb-20">
          <p className="eyebrow mb-5">El problema</p>
          <h2 className="h-section text-3xl text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            <span className="gradient-text">{COPY.problem.title}</span>
          </h2>
        </Reveal>

        {/* Lista asimétrica */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {COPY.problem.items.map((item, idx) => (
            <Reveal
              key={item}
              delay={idx * 80}
              className={`group rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-border-strong)] sm:p-8 ${
                idx % 3 === 1 ? "lg:translate-y-6" : ""
              }`}
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-warn)]/40 bg-[var(--color-warn)]/10 text-sm font-bold text-[var(--color-warn)]">
                0{idx + 1}
              </div>
              <p className="text-base leading-relaxed text-[var(--color-text)] sm:text-lg">
                {item}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Solution callout — Tesla style asimétrico */}
        <Reveal delay={200} className="mt-20 sm:mt-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-bg)] to-[var(--color-surface)] sm:rounded-[2.5rem]">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/[0.08] via-transparent to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] accent-glow"
            />

            <div className="relative grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
              <div>
                <p className="eyebrow mb-5">La solución</p>
                <h3 className="h-section mb-5 text-3xl text-[var(--color-text)] sm:text-4xl lg:text-5xl">
                  <span className="gradient-text">{COPY.solution.title}</span>
                </h3>
                <p className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                  {COPY.solution.body}
                </p>
                <a href="#oferta" className="btn-primary mt-8">
                  Pedir la mía
                  <span className="-translate-x-0.5 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>

              <div className="relative aspect-square w-full max-w-[420px] justify-self-center lg:justify-self-end">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent"
                />
                <Image
                  src="/producto.png"
                  alt="PULSO Mini Pro detalle"
                  fill
                  sizes="(max-width: 1024px) 70vw, 420px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
