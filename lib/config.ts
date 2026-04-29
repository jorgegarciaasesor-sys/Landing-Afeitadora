/**
 * 🔧 ARCHIVO EDITABLE — cambiá precios, ofertas, copy y marca acá.
 * No toques otros componentes para ajustes de marketing.
 */

export const BRAND = {
  name: "PULSO",
  tagline: "Para el hombre que no improvisa.",
  domain: "pulso.gt",                  // dominio futuro
  whatsapp: "+50253000000",            // ⚠️ poner número real cuando tengamos el WhatsApp Business
  whatsappDisplay: "+502 5300 0000",
  email: "hola@pulso.gt",
} as const;

export const PRODUCT = {
  name: "PULSO Mini Pro",
  shortName: "PULSO Mini",
  category: "Mini afeitadora portátil",
  // Para Shopify (custom line item — funciona sin que el producto exista en Shopify)
  shopifyTitle: "PULSO Mini Pro — Afeitadora portátil",
  // SKU interno (referencia en órdenes)
  sku: "PULSO-MINI-001",
} as const;

/**
 * 💰 OFERTAS — editá precios acá. La oferta principal es 2x1.
 * Los valores `priceQ` están en quetzales sin decimales.
 */
export const OFFERS = {
  primary: "2x1",                      // qué oferta destacar arriba
  options: [
    {
      id: "1x",
      label: "1 unidad",
      qty: 1,
      priceQ: 159,
      anchorQ: 199,                    // precio "regular" tachado
      badge: null,
      perUnitQ: 159,
    },
    {
      id: "2x1",
      label: "Combo 2x1",
      qty: 2,
      priceQ: 259,
      anchorQ: 318,                    // 2 × 159
      badge: "MÁS VENDIDO",
      perUnitQ: 130,                   // round(259/2)
    },
    {
      id: "3x2",
      label: "Combo 3x2",
      qty: 3,
      priceQ: 299,
      anchorQ: 477,                    // 3 × 159
      badge: "MEJOR PRECIO",
      perUnitQ: 100,                   // round(299/3)
    },
  ],
  shippingFreeAtQty: 1,                // envío gratis siempre
  shippingCostQ: 0,
} as const;

export type OfferId = (typeof OFFERS.options)[number]["id"];

/**
 * 🎯 COPY DE LA LANDING — editá texto acá.
 * Tono: español-GT, masculino, FOMO, problema-solución personal.
 */
export const COPY = {
  hero: {
    eyebrow: "PARA HOMBRES QUE NO PUEDEN ANDAR PELUDOS",
    headline: "Afeitada limpia en 60 segundos. Donde sea.",
    subhook:
      "La mini afeitadora que cabe en tu bolsillo y te saca del apuro cuando la rasuradora grande te falló.",
    bullets: [
      "Sin cables, sin enchufe",
      "Carga USB · 90 minutos de uso",
      "No pellizca · piel sensible",
    ],
    cta: "PEDIR LA MÍA",
    trustLine: "Pagás contraentrega · Envío gratis 24–72 h · Devolución 7 días",
  },

  fomo: {
    label: "OFERTA POR TIEMPO LIMITADO",
    note: "Stock limitado. Última semana al precio combo.",
  },

  problem: {
    title: "¿Te ha pasado?",
    items: [
      "Llegás al trabajo y te ves al espejo: peludo. La reu empieza en 10 min.",
      "Salís de viaje y la rasuradora grande no entra en el neceser.",
      "La barbería te cobra Q200 al mes solo por afeitarte.",
      "La rasuradora vieja te pellizca el cuello y te deja rojo.",
    ],
  },

  solution: {
    title: "PULSO Mini Pro lo resuelve.",
    body: "Una mini afeitadora del tamaño de una tarjeta de crédito, con motor japonés y cuchilla flotante. Andá listo donde sea.",
  },

  benefits: [
    {
      icon: "⚡",
      title: "60 segundos al rostro",
      text: "Cuchilla flotante de doble lámina. Afeitada uniforme, sin pellizcos.",
    },
    {
      icon: "🔋",
      title: "90 min de uso por carga",
      text: "Cargá por USB en 1 hora. Suficiente para todo un mes de uso diario.",
    },
    {
      icon: "📦",
      title: "Cabe en cualquier bolsa",
      text: "Tamaño tarjeta de crédito. Mochila, neceser, gym bag, guantera.",
    },
    {
      icon: "💧",
      title: "Resistente al agua",
      text: "Apta para uso en seco o húmedo. Limpieza bajo el grifo.",
    },
  ],

  socialProof: {
    title: "+2,400 hombres en Guatemala ya la usan",
    testimonials: [
      {
        name: "Daniel R.",
        zone: "Zona 10, Guatemala",
        quote:
          "La compré para los viajes de trabajo. Ahora no salgo de casa sin ella. Cabe perfecto en el neceser.",
        rating: 5,
      },
      {
        name: "Andrea M.",
        zone: "Mixco",
        quote:
          "Se la regalé a mi novio para su cumple. La usa todos los días. Mejor regalo que le di en años.",
        rating: 5,
      },
      {
        name: "Esteban G.",
        zone: "Quetzaltenango",
        quote:
          "Llevaba 2 años yendo a la barbería cada semana. Esto se pagó solo en un mes. Cabal lo recomiendo.",
        rating: 5,
      },
    ],
  },

  faq: [
    {
      q: "¿Cómo funciona el pago contraentrega?",
      a: "Pagás solo cuando recibís el producto. El repartidor te entrega tu PULSO Mini Pro y vos le pagás en efectivo. Sin tarjetas, sin transferencias, sin riesgo.",
    },
    {
      q: "¿En cuánto tiempo me llega?",
      a: "En la zona metropolitana de Guatemala te llega en 24–48 horas. En el resto de los departamentos, en 2–3 días hábiles.",
    },
    {
      q: "¿Hacen envíos a todo Guatemala?",
      a: "Sí, llegamos a los 22 departamentos. El envío es gratis en cualquier combo.",
    },
    {
      q: "¿Y si no me funciona o no me gusta?",
      a: "Tenés 7 días de garantía. Si el producto falla o no cumple lo que prometemos, te devolvemos el dinero o cambiamos la unidad. Cero preguntas.",
    },
    {
      q: "¿Cuánto dura la batería?",
      a: "Hasta 90 minutos de uso continuo por carga. Si la usás 5 minutos al día, te dura casi 3 semanas. Carga por USB en menos de 1 hora.",
    },
    {
      q: "¿Es resistente al agua?",
      a: "Sí. Podés usarla seca o con espuma. La cuchilla se limpia bajo el grifo.",
    },
    {
      q: "¿Cómo confirmo mi pedido?",
      a: "Después de llenar el formulario, te contactamos por WhatsApp en menos de 2 horas para confirmar dirección y agendar la entrega. Solo enviamos órdenes confirmadas.",
    },
  ],

  form: {
    title: "Llená tus datos · pagás cuando recibís",
    subtitle: "Te contactamos por WhatsApp en menos de 2 horas para confirmar.",
    submit: "PEDIR AHORA · PAGO CONTRAENTREGA",
    submitting: "Procesando...",
    successTitle: "✅ Pedido recibido",
    successBody:
      "Te contactamos por WhatsApp en menos de 2 horas para confirmar la dirección y agendar la entrega. ¡Gracias por confiar en PULSO!",
    errorGeneric: "No pudimos procesar tu pedido. Intentá de nuevo o escribinos por WhatsApp.",
    fields: {
      fullName: { label: "Nombre completo", placeholder: "Diego García" },
      phone: {
        label: "Teléfono / WhatsApp",
        placeholder: "5123-4567",
        prefix: "+502",
      },
      department: { label: "Departamento", placeholder: "Seleccioná tu departamento" },
      address: {
        label: "Dirección de entrega",
        placeholder:
          "Zona 10, 5a avenida 12-34, edificio Real Reforma, oficina 304. Ref: frente al Wendy's.",
      },
    },
  },

  stickyCta: {
    label: "Reservá la tuya",
    sublabel: "Pagás al recibir",
  },

  footer: {
    legal: "© 2026 PULSO · Mini afeitadora portátil. Hecho en Guatemala.",
    links: [
      { label: "Términos", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
      { label: "WhatsApp", href: "https://wa.me/50253000000" },
    ],
  },
} as const;

/** Configuración técnica de la landing (no es marketing) */
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
} as const;
