/** Constantes específicas de Guatemala */

export const GT_DEPARTMENTS = [
  "Alta Verapaz",
  "Baja Verapaz",
  "Chimaltenango",
  "Chiquimula",
  "El Progreso",
  "Escuintla",
  "Guatemala",
  "Huehuetenango",
  "Izabal",
  "Jalapa",
  "Jutiapa",
  "Petén",
  "Quetzaltenango",
  "Quiché",
  "Retalhuleu",
  "Sacatepéquez",
  "San Marcos",
  "Santa Rosa",
  "Sololá",
  "Suchitepéquez",
  "Totonicapán",
  "Zacapa",
] as const;

export type GtDepartment = (typeof GT_DEPARTMENTS)[number];

/** Validación: 8 dígitos, móvil empieza con 3/4/5, fijo con 2/6/7 */
export const GT_PHONE_REGEX = /^[2-7]\d{7}$/;

/** Formatea Q sin decimales con separador de miles (1,259) */
export function formatQ(value: number): string {
  return `Q${value.toLocaleString("es-GT")}`;
}

/** Limpia teléfono: deja solo dígitos */
export function cleanPhone(input: string): string {
  return input.replace(/\D/g, "");
}

/** Formatea teléfono GT visualmente: 5123-4567 */
export function formatPhoneGt(digits: string): string {
  const clean = cleanPhone(digits).slice(0, 8);
  if (clean.length <= 4) return clean;
  return `${clean.slice(0, 4)}-${clean.slice(4)}`;
}

/** Convierte teléfono GT a E.164 para Shopify: +50251234567 */
export function toE164Gt(digits: string): string {
  return `+502${cleanPhone(digits)}`;
}
