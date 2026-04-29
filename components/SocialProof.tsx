import { COPY } from "@/lib/config";
import { Reveal } from "./Reveal";

export function SocialProof() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <p className="eyebrow mb-5">Reviews verificadas</p>
          <h2 className="h-section text-3xl text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            <span className="gradient-text">{COPY.socialProof.title}</span>
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <span className="text-sm font-bold text-[var(--color-text)]">
              4.9 · 2,400+ pedidos
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {COPY.socialProof.testimonials.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100}>
              <figure className="group relative h-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition hover:border-[var(--color-accent)]/40 sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--color-accent)]/10 opacity-0 blur-2xl transition group-hover:opacity-100"
                />

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} small />
                    ))}
                  </div>
                  <QuoteIcon />
                </div>

                <blockquote className="mb-6 text-base leading-relaxed text-[var(--color-text)] sm:text-lg">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] text-sm font-black text-[var(--color-accent)]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {t.zone}
                    </p>
                  </div>
                  <div className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                    Verificado
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Star({ small = false }: { small?: boolean }) {
  return (
    <svg
      aria-hidden
      className={`${small ? "h-3.5 w-3.5" : "h-4 w-4"} text-[var(--color-accent)]`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      aria-hidden
      className="h-7 w-7 text-[var(--color-border-strong)]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9.5 6.5c-3.038 0-5.5 2.462-5.5 5.5v6h6v-6h-3c0-1.657 1.343-3 3-3v-2.5zm10 0c-3.038 0-5.5 2.462-5.5 5.5v6h6v-6h-3c0-1.657 1.343-3 3-3v-2.5z" />
    </svg>
  );
}
