"use client";

import { useState } from "react";
import { COPY } from "@/lib/config";
import { Reveal } from "./Reveal";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5">Soporte</p>
          <h2 className="h-section text-3xl text-[var(--color-text)] sm:text-5xl">
            <span className="gradient-text">Preguntas frecuentes</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)]">
            Resolvemos las dudas que la mayoría tiene antes de pedir su PULSO.
            Si no ves la tuya, escribinos por WhatsApp.
          </p>
        </Reveal>

        <div className="space-y-3 lg:col-span-8">
          {COPY.faq.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <Reveal key={item.q} delay={idx * 50}>
                <div
                  className={`overflow-hidden rounded-2xl border transition ${
                    isOpen
                      ? "border-[var(--color-accent)]/40 bg-[var(--color-surface)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]/50 hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8 sm:py-6"
                  >
                    <span className="font-display text-base font-bold text-[var(--color-text)] sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition ${
                        isOpen
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-black"
                          : "border-[var(--color-border)] text-[var(--color-text)]"
                      }`}
                    >
                      <svg
                        aria-hidden
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="animate-fade-up border-t border-[var(--color-border)] px-6 py-5 text-base leading-relaxed text-[var(--color-muted)] sm:px-8 sm:py-6 sm:text-lg">
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
