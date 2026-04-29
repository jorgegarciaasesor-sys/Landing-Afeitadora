"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Benefits } from "@/components/Benefits";
import { Offer } from "@/components/Offer";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { CodForm } from "@/components/CodForm";
import { StickyCta } from "@/components/StickyCta";
import { Footer } from "@/components/Footer";
import { OFFERS, type OfferId } from "@/lib/config";

export default function Home() {
  const [offer, setOffer] = useState<OfferId>(OFFERS.primary as OfferId);

  return (
    <main>
      <Hero />
      <Problem />
      <Benefits />
      <Offer selected={offer} onSelect={setOffer} />
      <SocialProof />
      <FAQ />
      <CodForm selectedOffer={offer} />
      <Footer />
      <StickyCta selectedOffer={offer} />
    </main>
  );
}
