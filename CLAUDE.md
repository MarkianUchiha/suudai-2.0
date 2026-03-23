# SUUDAI 2.0 — Agua Purificada a Domicilio en Durango

## Stack
- **Astro** (static output, NO SSR)
- **CSS vanilla** (custom properties, mobile-first)
- **JS vanilla** (no frameworks)
- **Google Maps embed** (no Leaflet)
- **WhatsApp** para pedidos (wa.me link)

## Arquitectura
Sitio 100% estático servido por Nginx. Sin backend, sin base de datos.
Dolibarr vive en sistema.suudai.com (uso interno planta, sin conexión con la web).

## Estructura
```
src/
  components/   → Astro components (.astro)
  layouts/      → Layout base
  pages/        → index.astro (single page)
  styles/       → global.css + variables
  data/         → products.js (array hardcoded), holidays.js
  scripts/      → JS client-side (cart logic, WhatsApp, delivery date)
public/
  images/       → Fotos productos, hero, splash
  fonts/        → Tipografías locales
  icons/        → SVG icons (delivery, clock, quality)
```

## Flujo de pedido
1. Selección con +/- en cards → formulario (nombre, tel, dirección)
2. JS calcula fecha entrega (corte 4PM CST, skip domingos/festivos)
3. Click "Enviar" → abre WhatsApp con mensaje prellenado
4. Planta recibe por WhatsApp, genera ticket manual

## Actualizar precios
Editar `src/data/products.js` → `./deploy.sh`

## Comandos
- `npm run dev` — dev server
- `npm run build` — build estático a dist/
- `./deploy.sh` — build + rsync a producción

## Paleta
- Primario oscuro: #1B1464 (azul profundo — headings, fondos dark)
- Primario claro: #0fbcf9 (azul cielo — botones, links, acentos)
- Secundario: #12CBC4 (verde aqua — badges, acentos secundarios)
- Fondo: blanco

## URLs
- Producción: https://suudai.com
- Dolibarr: https://sistema.suudai.com (NO tocar)
