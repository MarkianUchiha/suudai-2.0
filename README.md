# SUUDAI 2.0 — Agua Purificada a Domicilio en Durango

Sitio web estático para la purificadora SUUDAI. Los clientes seleccionan productos, llenan un formulario y envían su pedido por WhatsApp.

## Stack

- **Astro** (output estático, sin SSR)
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

El deploy es automático via GitHub Actions. Al hacer push a `main`, se ejecuta:

1. `npm run build` → genera `dist/`
2. Sube `dist/` por FTP a Hostinger (`public_html/`)

Los secrets de FTP están en GitHub → Settings → Secrets → Actions.

## Estructura

```
src/
  components/   → Componentes Astro (.astro)
  layouts/      → Layout base
  pages/        → index.astro (single page)
  styles/       → global.css (sistema de diseño)
  data/         → products.js, holidays.js
  scripts/      → cart.js, delivery-date.js
public/
  images/       → Fotos de productos y assets
  fonts/        → Tipografías locales (woff2)
  icons/        → Logo, iconos
```

## Actualizar precios

Editar `src/data/products.js` → push a main → deploy automático.

## Actualizar festivos

Editar `src/data/holidays.js` → agregar/quitar fechas → push a main.

## Flujo de pedido

1. Cliente selecciona productos con contadores +/-
2. Click "Continuar con mi pedido" → abre modal
3. Llena nombre, teléfono y dirección
4. JS calcula fecha de entrega (corte 4PM, skip domingos/festivos)
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
