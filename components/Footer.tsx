import { COPY, BRAND } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 pb-32 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
          {/* Marca */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-sm font-bold tracking-[0.4em] text-[var(--color-text)]">
                {BRAND.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              {BRAND.tagline}
            </p>
          </div>

          {/* Soporte */}
          <div>
            <p className="eyebrow mb-4">Soporte</p>
            <ul className="space-y-2 text-sm text-[var(--color-text-soft)]">
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[var(--color-accent)]"
                >
                  WhatsApp · {BRAND.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="transition hover:text-[var(--color-accent)]"
                >
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="eyebrow mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-[var(--color-text-soft)]">
              {COPY.footer.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="transition hover:text-[var(--color-accent)]"
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center">
          <p className="text-xs text-[var(--color-muted)]">{COPY.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
