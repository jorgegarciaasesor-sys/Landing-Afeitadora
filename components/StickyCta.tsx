"use client";

import { useEffect, useState } from "react";
import { COPY, OFFERS, type OfferId } from "@/lib/config";
import { formatQ } from "@/lib/gt";

interface Props {
  selectedOffer: OfferId;
}

export function StickyCta({ selectedOffer }: Props) {
  const [show, setShow] = useState(false);
  const offer = OFFERS.options.find((o) => o.id === selectedOffer)!;

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 720);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-40 px-3 sm:hidden">
      <a
        href="#pedir"
        className="flex items-center gap-3 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-bg)]/95 p-2 pr-3 backdrop-blur-md shadow-2xl shadow-black/40"
      >
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]">
          <svg
            aria-hidden
            className="h-5 w-5 text-black"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 3l5 5-5 5" />
          </svg>
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
            {COPY.stickyCta.label}
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            {COPY.stickyCta.sublabel}
          </p>
        </div>
        <p className="font-display text-2xl font-black text-[var(--color-text)]">
          {formatQ(offer.priceQ)}
        </p>
      </a>
    </div>
  );
}
