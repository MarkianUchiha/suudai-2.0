# SUUDAI 2.0 — Agua Purificada a Domicilio en Durango

Sitio web estático para la purificadora SUUDAI. Los clientes seleccionan productos, llenan un formulario y envían su pedido por WhatsApp.

## Stack

- **Astro 6** (output estático, sin SSR)
- **CSS vanilla** (custom properties, mobile-first)
- **JS vanilla** (sin frameworks)
- **Google Maps embed**
- **WhatsApp** para pedidos (wa.me link)

## Comandos

```bash
npm install        # Instalar dependencias
npm run dev        # Servidor de desarrollo (localhost:4321)
npm run build      # Build estático → dist/
```

## Deploy

Automático via GitHub Actions. Al hacer push a `main`:

1. `npm run build` → genera `dist/`
2. Sube `dist/` por FTP a Hostinger (`public_html/`)

Los secrets de FTP están en GitHub → Settings → Secrets → Actions:
- `FTP_SERVER` — IP del servidor Hostinger
- `FTP_USERNAME` — Usuario FTP
- `FTP_PASSWORD` — Contraseña FTP

## Estructura

```
src/
  components/   → Componentes Astro (.astro)
    Header      → Nav sticky con hamburguesa mobile
    Hero        → Splash agua + olas animadas SVG
    About       → Nosotros + anillo de agua rotando 360°
    Products    → Grid de productos con contadores +/-
    Benefits    → 3 bloques: entrega, horario, calidad
    Testimonials → Cards con comillas decorativas
    Contact     → Info + Google Maps embed
    Footer      → Copyright + link sistema
    OrderModal  → Modal de pedido + WhatsApp
  layouts/      → Layout base con SEO (meta, OG, JSON-LD)
  pages/        → index.astro (single page)
  styles/       → global.css (sistema de diseño)
  data/         → products.js, holidays.js
  scripts/      → cart.js, delivery-date.js
public/
  images/       → Fotos de productos (PNG) y assets (WebP)
  fonts/        → Instrument Sans, Poppins (woff2)
  icons/        → Logo venado (favicon)
```

## Productos

Editar `src/data/products.js` → push a main → deploy automático.

Productos actuales:
| Producto | Cantidad | Precio |
|----------|----------|--------|
| Garrafón | 1 × 20L | $38 |
| Paq Botella chica | 20 × 355ml | $80 |
| Paq Botella 1L | 12 × 1L | $96 |
| Paq Botella 500ml | 30 × 500ml | $107 |
| Paq Botella 1.5L | 12 × 1.5L | $110 |

## Días festivos

Editar `src/data/holidays.js` para agregar/quitar fechas. Los festivos con "lunes más cercano" se calculan automáticamente. Solo se descansan domingos.

## Flujo de pedido

1. Cliente selecciona productos con contadores +/-
2. Click "Continuar con mi pedido" → abre modal
3. Llena nombre, teléfono y dirección
4. JS calcula fecha de entrega (corte 4PM CST, skip domingos/festivos)
5. Click "Enviar por WhatsApp" → abre WhatsApp con mensaje prellenado
6. Modal muestra confirmación con resumen

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Azul oscuro | `#1B1464` | Headings, fondos dark |
| Azul claro | `#0fbcf9` | Links, acentos |
| Verde aqua | `#12CBC4` | Botones, badges |
| Blanco | `#FFFFFF` | Fondo principal |

## URLs

- Producción: https://suudai.com
- Dolibarr (interno): https://sistema.suudai.com
- Repo: https://github.com/MarkianUchiha/suudai-2.0

## Contacto

- Tel: +52 618 106 3930
- Email: suudai@outlook.com
- Dirección: C. Acuario 102, Valentín Gómez Farías, 34010 Durango, Dgo.
- Facebook: https://www.facebook.com/SuudaiDgo
