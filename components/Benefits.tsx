import { COPY } from "@/lib/config";
import { Reveal } from "./Reveal";

export function Benefits() {
  return (
    <section className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <p className="eyebrow mb-5">Especificaciones</p>
          <h2 className="h-section text-3xl text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            <span className="gradient-text">
              Diseñada para resolver, no para impresionar.
            </span>
          </h2>
        </Reveal>

        {/* Bento grid 2026 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:gap-4">
          {COPY.benefits.map((b, idx) => {
            const span = getSpan(idx);
            return (
              <Reveal
                key={b.title}
                delay={idx * 90}
                className={`group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition hover:border-[var(--color-accent)]/40 sm:p-9 ${span}`}
              >
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--color-accent)]/10 opacity-0 blur-2xl transition group-hover:opacity-100"
                />

                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] text-2xl">
                  {b.icon}
                </div>
                <h3 className="font-display mb-2 text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                  {b.text}
                </p>
              </Reveal>
            );
          })}
        </div>

        {/* Stats strip — Tesla style */}
        <Reveal delay={300} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] sm:grid-cols-4">
            <Stat value="60s" label="Por afeitada" />
            <Stat value="90 min" label="Autonomía" />
            <Stat value="USB-C" label="Carga rápida" />
            <Stat value="IPX5" label="Resistente al agua" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-5 py-7 text-center sm:px-7 sm:py-9">
      <p className="font-display text-3xl font-black text-[var(--color-text)] sm:text-5xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
        {label}
      </p>
    </div>
  );
}

/** Bento span pattern — primer card grande, otros mixtos */
function getSpan(idx: number): string {
  const map: Record<number, string> = {
    0: "sm:col-span-3 sm:row-span-2",
    1: "sm:col-span-3",
    2: "sm:col-span-2",
    3: "sm:col-span-1",
  };
  return map[idx] ?? "sm:col-span-2";
}
