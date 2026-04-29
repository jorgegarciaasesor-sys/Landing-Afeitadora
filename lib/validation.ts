import { z } from "zod";
import { GT_DEPARTMENTS, GT_PHONE_REGEX, cleanPhone } from "./gt";
import { OFFERS } from "./config";

const offerIds = OFFERS.options.map((o) => o.id) as [string, ...string[]];

export const CodOrderInput = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Nombre muy corto")
    .max(80, "Nombre muy largo"),

  phone: z
    .string()
    .transform((v) => cleanPhone(v))
    .pipe(
      z.string().regex(GT_PHONE_REGEX, "Teléfono inválido (8 dígitos GT)"),
    ),

  department: z.enum(GT_DEPARTMENTS as unknown as [string, ...string[]], {
    message: "Seleccioná tu departamento",
  }),

  address: z
    .string()
    .trim()
    .min(10, "Dirección muy corta")
    .max(300, "Dirección muy larga"),

  offerId: z.enum(offerIds),

  /** Honeypot — debe venir vacío. Si llega lleno, es bot. */
  website: z.string().max(0).optional().default(""),
});

export type CodOrderInputType = z.infer<typeof CodOrderInput>;
