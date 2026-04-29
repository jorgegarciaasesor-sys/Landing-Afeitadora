---
name: avatar-research
description: Use when the user wants to research the target customer (avatar / persona) for a new physical product to sell COD in Guatemala or LATAM. Triggers include "investigar avatar", "build persona for", "who is the buyer", "research the target market", or starting a new product line that needs the avatar doc before copy/landing work begins. Produces a structured research/NN-avatar-{product}.md following the same skeleton used for the mini shaver doc.
---

# Avatar Research — Guatemala / LATAM Physical Products COD

Framework reusable para investigar el avatar de un nuevo producto físico de impulso destinado a venta COD en Guatemala (extensible a LATAM).

## Cuándo usar este skill

- Cada vez que se inicia un producto nuevo en el catálogo.
- Antes de escribir copy o construir landing.
- Antes de pedir al `copywriter-gt` agente que produzca cualquier headline.

## Producto resultante

Un archivo `research/NN-avatar-{producto-slug}.md` con secciones idénticas al template (sección 9 abajo). Numerar `NN` de forma incremental (01, 02…).

## Workflow — 7 pasos

### 1. Recolectar input del usuario

Preguntar (si no está claro):
- ¿Cuál es el producto? (nombre, categoría, función principal).
- ¿Rango de precio aproximado? (Q__ a Q__).
- ¿Hay producto similar ya vendido en GT/LATAM? (referencia para benchmarks).
- ¿Quién es la hipótesis de comprador? (si el usuario tiene intuición, anotarla — luego se valida).

### 2. WebSearch — datos demográficos GT/LATAM

Búsquedas estándar:
- `Guatemala demographics 2026 [edad] [género] e-commerce`
- `LATAM e-commerce trends 2026 COD physical products`
- `[categoría producto] Guatemala mercado consumidor 2026`
- `TikTok Facebook ads demographics Guatemala 2026`

Capturar:
- Tamaño del mercado e-commerce GT (referencia: $2.1 B en 2026).
- % adopción COD (referencia: 78 % en GT).
- % mobile de e-commerce (referencia: 68 % en GT).
- Distribución urbano/rural (Guatemala City metro = 55 % de pedidos).

### 3. WebSearch — categoría del producto

- Tendencias de la categoría (ej. grooming masculino, hogar, electrónicos).
- Productos virales similares en TikTok Shop / Mercado Libre / Amazon.
- Reviews y comentarios de productos similares — fuente de dolores y deseos reales.

### 4. Construir persona

Tabla con: Edad, Género, NSE, Ubicación, Ocupación, Dispositivo, Plataforma de descubrimiento, Confianza pago.

Si el producto es para mujeres, incluir vector "comprado como regalo por hombre" como persona secundaria. Si es para hombres, incluir vector "comprado como regalo por mujer" — esto suele desbloquear AOV y audiencias en Meta.

### 5. JTBD — Jobs to be Done

Listar 4–6 jobs concretos en formato:
> Cuando [persona] compra [producto], contrata el producto para [job].

Ejemplo: *"Cuando Diego compra una mini afeitadora, contrata el producto para resolver una afeitada de emergencia sin tener que ir al baño/casa."*

### 6. Dolores, deseos, objeciones COD

- **5–7 dolores reales** en lenguaje del cliente, voz primera persona.
- **3–5 deseos** (lo que quiere lograr / sentir).
- **5–6 objeciones COD típicas** + antídoto sugerido para landing.

### 7. Pricing psychology

- Rango Q de impulso para la categoría.
- Sweet spot del producto.
- Estrategia de bundle (2x1, 3x2) y por qué.
- Anchoring sugerido.

## Reglas

- **Citar fuentes reales** con URL al final. No inventar URLs.
- **Específico GT, no LATAM neutro**. Si una conclusión es genérica LATAM, marcarla como tal, no presentarla como GT.
- **Cuantificar siempre que se pueda**. "78 % COD" > "muchos usan COD".
- **Hipótesis claras al final** — qué se va a validar con los primeros ads.

## Template de archivo

```markdown
# Avatar — {Producto}, Guatemala 2026

> Investigación base. Refinar con datos reales una vez se prendan ads.

## 1. Persona principal: "{Nombre}, {edad}, {ubicación}"
[tabla]

## 2. Jobs-to-be-done
[lista]

## 3. Dolores reales
[lista voz primera persona]

## 4. Deseos
[lista]

## 5. Objeciones COD típicas en Guatemala
[tabla: objeción / cómo se manifiesta / antídoto en landing]

## 6. Pricing psychology — Guatemala
[notas de rango, anchoring, bundle]

## 7. Cobertura geográfica
[mención departamentos relevantes]

## 8. Tráfico — Meta vs. TikTok
[tabla por plataforma]

## 9. Hipótesis a validar en las primeras 2 semanas de ads
[lista numerada]

## Fuentes
[URLs reales con título]
```

## Referencia base

- `research/01-avatar-guatemala-mini-shaver.md` — el primer doc generado con este skill. Usar como modelo de profundidad y estructura.
