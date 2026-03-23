# SUUDAI — Plan de Proyecto Optimizado

**Stack:** Astro Static | **ERP:** Dolibarr v19+ (interno) | **Sprints:** 4 | **Horas estimadas:** ~65 hrs
**Hosting:** Mismo servidor actual de suudai.com | **Deploy:** `deploy.sh` (rsync vía SSH)
**Ahorro vs plan original:** ~53 hrs (45%)

---

## Arquitectura

```
┌─────────────────────┐                          ┌─────────────────────┐
│   suudai.com        │                          │  sistema.suudai.com │
│   (Astro Static)    │    SIN CONEXIÓN          │  (Dolibarr v19+)    │
│                     │◄──────────────────────►  │                     │
│  - HTML/CSS/JS      │    Dolibarr es solo      │  Uso interno planta │
│  - Productos hardcoded   uso interno           │  Tickets, stock     │
│  - WhatsApp pedidos │                          │  Ordenes manuales   │
└─────────────────────┘                          └─────────────────────┘
         │
         │  deploy.sh → build + rsync SSH
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Servidor actual                                                     │
│  Nginx → archivos estáticos (suudai.com) + Dolibarr (sistema.*)     │
└──────────────────────────────────────────────────────────────────────┘
```

### Flujo de pedido

1. Cliente selecciona productos con contadores +/- en cada card
2. Llena nombre, teléfono y dirección
3. JS calcula fecha estimada (corte 4PM, skip domingos/festivos hardcodeados)
4. Click **"Enviar Pedido"** → abre WhatsApp con mensaje prellenado (`wa.me`)
5. Planta recibe pedido por WhatsApp, genera ticket manual como siempre
6. Pantalla de confirmación: fecha estimada + "Cobro a la entrega"

### Precios

Hardcodeados en el código (~6 productos de reparto). Cambios de precio (1-2 veces/año): editar array → `deploy.sh`.

### Qué se eliminó y por qué

- **Integración Dolibarr API** — la planta maneja órdenes manual, no necesitan que la web cree órdenes
- **SSR / Node.js / PM2** — sin API routes, todo es estático
- **Carrito localStorage** — 6 productos, selección directa con +/- es más simple
- **PWA / Service Worker** — bajo volumen web (~5% clientes), no agrega valor
- **Leaflet mapa** — Google Maps embed es más ligero y abre navegación nativa
- **Newsletter UI** — sin funcionalidad real, nadie va a escribir esa newsletter
- **Stock en frontend** — Dolibarr maneja alertas internas
- **GitHub Actions CI/CD** — `deploy.sh` con rsync es suficiente para 1 dev

---

## Sprint 1 — Fundación + Landing

**Duración:** Semana 1-2 · **20 hrs** (antes: 28 hrs) · **Ahorro: 8 hrs**

> Toda la estética, animaciones y secciones del plan original se mantienen.
> Se simplifica complejidad técnica sin perder resultado visual.

---

### SUUDAI-101 · Setup proyecto Astro Static

| Campo | Valor |
|-------|-------|
| **Tipo** | Config |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-101-project-setup` |

**Descripción:**
Inicializar proyecto Astro con output `static`, estructura de carpetas, scripts de dev/build, `.env` para número de WhatsApp y config general.

**Criterios de aceptación:**
- [x] `npm run dev` levanta servidor local
- [x] `npm run build` genera sitio estático en `dist/`
- [x] `.env.example` documentado con variables necesarias
- [x] `.gitignore` configurado
- [x] Estructura: `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `public/`

> **✅ COMPLETADO**

---

### SUUDAI-102 · Sistema de diseño

| Campo | Valor |
|-------|-------|
| **Tipo** | Diseño |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-102-design-system` |
| **Depende de** | SUUDAI-101 |

**Descripción:**
Definir variables CSS globales, tipografía y breakpoints mobile-first. Paleta azul/verde tipo Watera.

**Especificaciones:**
- Primario: `#0277BD` (azul water)
- Secundario: `#2E7D32` (verde hoja)
- Acento: `#01579B` (azul oscuro)
- Fondo: blanco con textura sutil de agua
- Tipografía: Instrument Sans bold para headings, Poppins limpia para body
- Breakpoints: 375px base, 768px tablet, 1024px desktop

**Criterios de aceptación:**
- [x] `global.css` con custom properties para colores, tipografía, espaciados
- [x] Reset/normalize incluido
- [x] Breakpoints definidos como custom properties o comentados para referencia
- [x] Font imports configurados

> **✅ COMPLETADO** — Paleta actualizada: #1B1464 (azul oscuro), #0fbcf9 (azul claro), #12CBC4 (verde aqua)

---

### SUUDAI-103 · Header + navegación

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-103-header-nav` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Header sticky con navegación responsive. Hamburguesa animada en mobile, nav horizontal en desktop.

**Especificaciones (ref: Watera top):**
- Logo Suudai izquierda (placeholder SVG: gota verde/azul con tipografía bold)
- Mobile: hamburguesa derecha (3 líneas → X animado), fullscreen overlay
- Links: Inicio, Nosotros, Productos, Pedidosinventalos, Contacto
- Desktop: nav horizontal
- CTA destacado: "Pedir Agua" azul sólido, esquinas redondeadas
- Link discreto: "Acceso empleados →" → sistema.suudai.com
- Sticky con backdrop-filter blur al scroll

**Criterios de aceptación:**
- [x] Hamburguesa se anima a X al abrir
- [x] Overlay mobile cubre viewport completo
- [x] Header sticky con blur funcional
- [x] CTA visible en ambos breakpoints
- [x] Links navegan a las secciones correctas (anchor scroll)

> **✅ COMPLETADO**

---

### SUUDAI-104 · Hero section

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-104-hero` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Sección hero fullscreen con gradiente, imagen de producto y SVG wave inferior.

**Especificaciones (ref: Watera hero):**
- Fondo: gradiente azul cielo → cyan, foto splash agua overlay (opacity ~0.3)
- Imagen garrafón/botella derecha (placeholder)
- H1 blanco bold: "Agua Purificada a Domicilio en Durango" (36px mobile, 56px desktop)
- Subtítulo: "Pide antes de las 4PM y recibe mañana"
- CTA grande azul oscuro: "Haz tu Pedido →"
- **Borde inferior: SVG wave blanca** — curva orgánica suave tipo Watera
- Mobile: stack vertical (texto arriba, garrafón abajo), viewport height completo

**Criterios de aceptación:**
- [x] SVG wave se adapta al ancho sin distorsión
- [x] Hero ocupa 100vh en mobile
- [x] CTA visible sin scroll en mobile
- [x] Responsive: 2 columnas desktop, stack mobile

> **✅ COMPLETADO** — 3 olas animadas SVG con viewBox 2880 (patrón duplicado), splash responsive (100% auto mobile, cover desktop)

---

### SUUDAI-105 · Sección Sobre Nosotros + animación 360°

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-105-about` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Sección con garrafón central rodeado de splash de agua circular con rotación 360° continua. Texto descriptivo y badges de estadísticas.

**Especificaciones (ref: Watera imagen 2):**
- Garrafón estático al centro
- Splash/círculo de agua alrededor con **animación CSS rotate 360° continua** (`animation: rotate360 20s linear infinite`)
- Badges circulares azul oscuro con estadísticas (ej: "24 Años de Experiencia", "250 Special Expert Team" — adaptar a datos reales de Suudai)
- Heading azul bold centrado
- Párrafo descriptivo (placeholder)
- Línea decorativa diagonal tipo Watera debajo del texto
- Botón secundario: "Conócenos →" outline azul

**Criterios de aceptación:**
- [x] Animación de rotación suave y continua en el splash (no en el garrafón)
- [x] Badges posicionados sobre la imagen sin romperse en mobile
- [x] Responsive: imagen + texto stack en mobile, side-by-side en desktop

> **✅ COMPLETADO** — Water_Circle.png con rotate 360°, badges: 5+ años, 20k+ clientes, 1000+ garrafones/semana

---

### SUUDAI-106 · Sección Productos con selección directa

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 3 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-106-products` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Grid de cards de productos con precios hardcodeados y contadores +/- integrados. Esto reemplaza el carrito del plan original.

**Especificaciones (ref: Watera imagen 4):**
- Heading centrado azul bold: "Elige tu Agua"
- Subtítulo gris
- Grid: 2 columnas mobile, 3-4 desktop
- Cada card: fondo blanco, sombra sutil, imagen producto, nombre bold, precio grande azul/verde, **contador +/- con cantidad**
- Hover: sombra más pronunciada + scale sutil
- Bordes redondeados
- Productos hardcodeados en array JS (nombre, precio, imagen, id)

**Criterios de aceptación:**
- [x] Contador +/- funcional (mín 0, máx razonable como 20)
- [x] Precio total se actualiza visualmente al cambiar cantidad
- [x] Array de productos fácil de editar en el código
- [x] Grid responsive sin overflow

> **✅ COMPLETADO** — 3 productos: Paq 12x500ml ($150), Paq 6x1.5L ($120), Garrafón 20L ($35). Botón "Continuar con mi pedido" aparece al seleccionar

---

### SUUDAI-107 · Sección Servicios/Beneficios

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1 hr |
| **Prioridad** | P2 — Medium |
| **Branch** | `feat/SUUDAI-107-benefits` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
3 bloques de beneficios con íconos SVG line-art.

**Especificaciones (ref: Watera imagen 6):**
- Fondo blanco/gris muy claro
- 3 bloques: ícono SVG outlined arriba, título bold azul, descripción corta gris
- Íconos: delivery/moto, reloj/cronómetro, pulgar/estrellas (line-art, no filled)
- Mobile: stack vertical. Desktop: horizontal

**Criterios de aceptación:**
- [x] Íconos SVG consistentes en estilo
- [x] Separación generosa entre bloques
- [x] Responsive funcional

> **✅ COMPLETADO** — 3 beneficios con íconos line-art + waves decorativas de fondo

---

### SUUDAI-108 · Sección Testimonios

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1 hr |
| **Prioridad** | P2 — Medium |
| **Branch** | `feat/SUUDAI-108-testimonials` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
3 cards estáticas de testimonios con comillas decorativas. Sin carrusel para v1 (no hay testimonios reales aún).

**Especificaciones (ref: Watera imagen 7):**
- Fondo con textura sutil agua/gris claro
- Heading azul centrado: "¿Qué Dicen Nuestros Clientes?"
- 3 cards blancas con sombra
- Comillas decorativas grandes azules semitransparentes
- Texto testimonio gris, foto circular del cliente, nombre azul
- Mobile: stack vertical. Desktop: 3 columnas

**Criterios de aceptación:**
- [x] Cards con diseño consistente
- [x] Comillas decorativas visibles
- [x] Contenido placeholder profesional

> **✅ COMPLETADO** — 2 cards con avatares, comillas decorativas verde aqua

**Nota:** Si el cliente quiere carrusel después, se agrega como mejora.

---

### SUUDAI-109 · Sección Contacto + Mapa

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-109-contact-map` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Info de contacto + Google Maps embed. Sin Leaflet, sin newsletter.

**Especificaciones (ref: Watera imagen 8):**
- Fondo azul oscuro
- Logo Suudai blanco, dirección con ícono pin, teléfono, email
- Íconos sociales: Facebook, Instagram, X (círculos outline blancos)
- **Google Maps iframe embed** con pin en ubicación de planta
- Link "Abrir en Google Maps" que abre navegación nativa
- Mobile: info arriba, mapa abajo full width

**Criterios de aceptación:**
- [x] Mapa muestra ubicación correcta
- [x] Link abre Google Maps/navegación en mobile
- [x] Todos los datos de contacto visibles
- [x] Íconos sociales linkeados (placeholders OK si no tienen redes aún)

> **✅ COMPLETADO** — Datos reales, Google Maps embed, Facebook link

---

### SUUDAI-110 · Footer

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 0.5 hrs |
| **Prioridad** | P2 — Medium |
| **Branch** | `feat/SUUDAI-110-footer` |
| **Depende de** | SUUDAI-102 |

**Descripción:**
Footer con fondo azul oscuro `#01579B`. Copyright, links rápidos, link a sistema.suudai.com.

**Criterios de aceptación:**
- [x] Copyright con año dinámico
- [x] Link "Acceso sistema" funcional
- [x] Responsive

> **✅ COMPLETADO**

---

### SUUDAI-111 · SEO básico

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1 hr |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-111-seo` |
| **Depende de** | SUUDAI-101 |

**Descripción:**
Meta tags, Open Graph y structured data para posicionamiento local.

**Criterios de aceptación:**
- [x] `<title>` y `<meta description>` optimizados
- [x] Open Graph tags (og:title, og:description, og:image)
- [x] JSON-LD structured data tipo `LocalBusiness`
- [x] `robots.txt` y `sitemap.xml` generados por Astro

> **✅ COMPLETADO**

---

### SUUDAI-112 · Testing mobile-first

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `fix/SUUDAI-112-mobile-testing` |
| **Depende de** | SUUDAI-103 a SUUDAI-110 |

**Descripción:**
Verificar todas las secciones en breakpoints clave.

**Criterios de aceptación:**
- [x] 375px (iPhone SE)
- [x] 390px (iPhone 14)
- [x] 768px (iPad)
- [x] 1024px+ (desktop)
- [x] Menú hamburguesa funcional
- [x] Scroll suave entre secciones
- [x] Sin overflow horizontal en ningún breakpoint

> **✅ COMPLETADO** — Revisado por el usuario en todos los breakpoints durante desarrollo

---

## Sprint 2 — Pedido + WhatsApp

**Duración:** Semana 3-4 · **15 hrs** (antes: 55 hrs S2+S3 originales) · **Ahorro: 40 hrs**

> Reemplaza Sprints 2 y 3 originales. Sin integración Dolibarr, todo es frontend + WhatsApp.
> No se necesita backend. Todo corre en el navegador del cliente.

---

### SUUDAI-201 · Formulario de pedido

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 3 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-201-order-form` |
| **Depende de** | SUUDAI-106 |

**Descripción:**
Formulario con nombre, teléfono y dirección. Se activa después de seleccionar al menos 1 producto.

**Criterios de aceptación:**
- [ ] Campos: nombre (requerido), teléfono (requerido, formato MX), dirección (requerida)
- [ ] Validación HTML5 + JS antes de enviar
- [ ] Muestra resumen de productos seleccionados con cantidades y total
- [ ] No permite enviar con 0 productos
- [ ] Responsive y accesible
- [ ] Transición suave desde sección de productos

---

### SUUDAI-202 · Lógica corte 4PM + fecha de entrega

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-202-delivery-date` |
| **Depende de** | SUUDAI-201 |

**Descripción:**
Calcular fecha estimada de entrega en JS del lado del cliente. Regla de corte 4PM CST.

**Lógica:**
- Antes de 4PM → entrega mañana
- Después de 4PM → entrega pasado mañana
- Si fecha cae en domingo → siguiente lunes
- Si fecha cae en día festivo → siguiente día hábil

**Criterios de aceptación:**
- [ ] Fecha se calcula correctamente en zona horaria CST (America/Mexico_City)
- [ ] Skip domingos funcional
- [ ] Fecha visible en el resumen antes de enviar

---

### SUUDAI-203 · Días festivos hardcodeados

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1 hr |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-203-holidays` |
| **Depende de** | SUUDAI-202 |

**Descripción:**
Array de fechas festivas oficiales de México para el cálculo de entrega.

**Festivos fijos:**
- 1 enero (Año Nuevo)
- 5 febrero (Constitución — lunes más cercano)
- 21 marzo (Natalicio Benito Juárez — lunes más cercano)
- 1 mayo (Día del Trabajo)
- 16 septiembre (Independencia)
- 20 noviembre (Revolución — lunes más cercano)
- 25 diciembre (Navidad)

**Criterios de aceptación:**
- [ ] Array fácil de editar (agregar/quitar fechas)
- [ ] Festivos con lunes más cercano calculados para el año actual
- [ ] Integrado con lógica de SUUDAI-202
- [ ] Cliente confirma si hay días adicionales (ej: Semana Santa, días locales)

---

### SUUDAI-204 · Integración WhatsApp

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-204-whatsapp` |
| **Depende de** | SUUDAI-201, SUUDAI-202 |

**Descripción:**
Generar link `wa.me` con mensaje prellenado que incluye todos los datos del pedido.

**Formato del mensaje:**
```
🧾 *Nuevo Pedido Web - Suudai*

*Productos:*
- Garrafón 19L x2 — $130.00
- Pack 2 Garrafones x1 — $120.00

*Total: $250.00*

*Cliente:* Juan Pérez
*Teléfono:* 618-123-4567
*Dirección:* Calle Ejemplo #123, Col. Centro

*Entrega estimada:* Martes 25 de marzo
*Cobro a la entrega*
```

**Criterios de aceptación:**
- [ ] Link `wa.me/52XXXXXXXXXX?text=...` correctamente formateado
- [ ] Mensaje incluye: productos, cantidades, total, datos cliente, fecha
- [ ] Emojis y formato WhatsApp (*bold*) para legibilidad
- [ ] Número de WhatsApp viene de `.env` / config, no hardcodeado
- [ ] Funciona en mobile (abre app) y desktop (abre WhatsApp Web)

---

### SUUDAI-205 · Pantalla de confirmación

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-205-confirmation` |
| **Depende de** | SUUDAI-204 |

**Descripción:**
Pantalla post-envío con resumen y próximos pasos.

**Criterios de aceptación:**
- [ ] Muestra: resumen de productos, total, fecha estimada
- [ ] Mensaje: "Tu pedido fue enviado por WhatsApp. Te confirmaremos la entrega."
- [ ] "Cobro a la entrega" visible
- [ ] Botón "Hacer otro pedido" que resetea el flujo
- [ ] Número de contacto visible como fallback

---

### SUUDAI-206 · Flujo completo integrado

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-206-full-flow` |
| **Depende de** | SUUDAI-201 a SUUDAI-205 |

**Descripción:**
Integrar el flujo completo: selección → formulario → resumen → WhatsApp → confirmación. Asegurar que la navegación entre pasos sea fluida.

**Criterios de aceptación:**
- [ ] Flujo lineal sin saltos raros
- [ ] Se puede regresar a editar productos antes de enviar
- [ ] Estado se mantiene durante la navegación (productos seleccionados no se pierden)
- [ ] Transiciones suaves entre pasos

---

### SUUDAI-207 · Validaciones y manejo de errores

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-207-error-handling` |
| **Depende de** | SUUDAI-206 |

**Descripción:**
Validaciones defensivas y mensajes de error claros.

**Criterios de aceptación:**
- [ ] Campos vacíos: mensaje inline en rojo
- [ ] Teléfono inválido: formato 10 dígitos
- [ ] 0 productos seleccionados: no deja avanzar al formulario
- [ ] Si WhatsApp no abre: muestra fallback con número de teléfono para llamar
- [ ] Mensajes de error en español, claros y amigables

---

### SUUDAI-208 · Testing E2E

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `fix/SUUDAI-208-e2e-testing` |
| **Depende de** | SUUDAI-206, SUUDAI-207 |

**Descripción:**
Testing manual del flujo completo en mobile y desktop.

**Criterios de aceptación:**
- [ ] Seleccionar productos → formulario → WhatsApp → confirmación (mobile)
- [ ] Mismo flujo en desktop (WhatsApp Web)
- [ ] Validaciones bloquean envío incorrecto
- [ ] Fecha de entrega correcta para: antes de 4PM, después de 4PM, sábado, víspera de festivo
- [ ] Mensaje de WhatsApp formateado correctamente con todos los datos

---

## Sprint 3 — Animaciones + Pulido Visual

**Duración:** Semana 5-6 · **14 hrs** · Sprint dedicado a estética

> Toda la estética clave para el cliente. Animaciones scroll-reveal,
> micro-interacciones y contenido real.

---

### SUUDAI-301 · Animaciones scroll-reveal

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 3 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-301-scroll-reveal` |
| **Depende de** | Sprint 1 completo |

**Descripción:**
Animaciones de aparición al hacer scroll usando IntersectionObserver + CSS transitions.

**Criterios de aceptación:**
- [ ] Fade-in + slide-up en: headings, cards de productos, testimonios, beneficios
- [ ] Stagger en elementos de grid (cada card aparece con ligero delay)
- [ ] Animaciones solo se ejecutan una vez (no re-trigger al scroll up)
- [ ] `prefers-reduced-motion` respetado
- [ ] Sin librerías externas (puro IntersectionObserver + CSS)
- [ ] Performance: no causa jank ni layout shift

---

### SUUDAI-302 · Micro-interacciones

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-302-micro-interactions` |
| **Depende de** | Sprint 1 completo |

**Descripción:**
Transiciones y efectos hover/active en elementos interactivos.

**Criterios de aceptación:**
- [ ] Cards producto: hover → sombra más pronunciada + scale sutil
- [ ] Botones: hover → darken/lighten, active → press effect
- [ ] Contadores +/-: feedback visual al click
- [ ] CTA buttons: transición de color suave
- [ ] Links: underline animado o color transition
- [ ] Formulario: focus states estilizados (no default browser)

---

### SUUDAI-303 · SVG waves y elementos decorativos

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 2 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-303-decorative-elements` |
| **Depende de** | Sprint 1 completo |

**Descripción:**
Refinar SVG waves entre secciones y agregar elementos decorativos de agua.

**Criterios de aceptación:**
- [ ] Wave hero→contenido: curva orgánica suave tipo Watera
- [ ] Waves/separadores adicionales entre secciones clave
- [ ] Líneas decorativas diagonales (ref: Watera imagen 2)
- [ ] Todos los SVG responsive sin distorsión
- [ ] Consistencia visual en toda la página

---

### SUUDAI-304 · Contenido real

| Campo | Valor |
|-------|-------|
| **Tipo** | Contenido |
| **Estimación** | 3 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-304-real-content` |
| **Depende de** | Sprint 1 completo |

**Descripción:**
Reemplazar todos los placeholders con contenido real del cliente.

**Criterios de aceptación:**
- [ ] Logo real (SVG o PNG optimizado)
- [ ] Fotos reales de productos
- [ ] Textos descriptivos reales (Sobre Nosotros, descripciones productos)
- [ ] Datos de contacto reales (dirección, teléfono, email, redes)
- [ ] Ubicación exacta en Google Maps
- [ ] Estadísticas reales para badges de "Sobre Nosotros"
- [ ] Testimonios reales si están disponibles

**Nota:** Si el cliente no entrega contenido, se mantienen placeholders profesionales y se reemplazan post-launch.

---

### SUUDAI-305 · Optimización de imágenes

| Campo | Valor |
|-------|-------|
| **Tipo** | Frontend |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-305-image-optimization` |
| **Depende de** | SUUDAI-304 |

**Descripción:**
Optimizar todas las imágenes con Astro assets.

**Criterios de aceptación:**
- [ ] Todas las imágenes convertidas a WebP via `astro:assets`
- [ ] Lazy loading en imágenes below the fold
- [ ] Dimensiones explícitas (width/height) para evitar layout shift
- [ ] Hero image con loading eager

---

### SUUDAI-306 · Testing visual

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 2.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `fix/SUUDAI-306-visual-testing` |
| **Depende de** | SUUDAI-301 a SUUDAI-305 |

**Descripción:**
Verificar consistencia visual completa en todos los breakpoints.

**Criterios de aceptación:**
- [ ] Animaciones fluidas sin jank (60fps)
- [ ] Waves sin gaps ni overlap entre secciones
- [ ] Imágenes reales se ven bien en todos los tamaños
- [ ] Tipografía legible en todos los breakpoints
- [ ] Colores consistentes con sistema de diseño
- [ ] Sin elementos cortados o con overflow

---

## Sprint 4 — Deploy + Go Live

**Duración:** Semana 7 · **16 hrs** (antes: 25 hrs) · **Ahorro: 9 hrs**

> Deploy simplificado: sin Node.js ni PM2. Solo archivos estáticos servidos por Nginx.

---

### SUUDAI-401 · Backup web anterior

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 1 hr |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A (operación en servidor) |

**Descripción:**
Backup completo de la web actual antes de cualquier cambio.

**Criterios de aceptación:**
- [ ] Backup completo de `/var/www/suudai.com` (o ruta actual)
- [ ] Backup de config Nginx actual
- [ ] Verificar que Dolibarr (sistema.suudai.com) NO se toca
- [ ] Backup almacenado en ruta segura del servidor

---

### SUUDAI-402 · Configurar Nginx para Astro static

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A (operación en servidor) |
| **Depende de** | SUUDAI-401 |

**Descripción:**
Configurar Nginx para servir archivos estáticos de Astro en suudai.com.

**Criterios de aceptación:**
- [ ] `suudai.com` sirve contenido de `dist/`
- [ ] Gzip habilitado para HTML, CSS, JS, SVG
- [ ] Cache headers configurados (assets con hash: 1 año, HTML: no-cache)
- [ ] Redirect www → non-www (o viceversa)
- [ ] 404 page personalizada

---

### SUUDAI-403 · Verificar Dolibarr intacto

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 0.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A |
| **Depende de** | SUUDAI-402 |

**Descripción:**
Smoke test para confirmar que sistema.suudai.com sigue funcionando después de los cambios en Nginx.

**Criterios de aceptación:**
- [ ] sistema.suudai.com carga correctamente
- [ ] Login funcional
- [ ] No se modificó nada de Dolibarr

---

### SUUDAI-404 · SSL verificar/renovar

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 1 hr |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A |
| **Depende de** | SUUDAI-402 |

**Descripción:**
Verificar certificados SSL con Certbot. Renovar si es necesario.

**Criterios de aceptación:**
- [ ] HTTPS funcional en suudai.com
- [ ] HTTPS funcional en sistema.suudai.com
- [ ] Redirect HTTP → HTTPS
- [ ] Certbot auto-renewal configurado

---

### SUUDAI-405 · Script deploy.sh

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | `feat/SUUDAI-405-deploy-script` |

**Descripción:**
Script de deploy: build local + rsync al servidor vía SSH.

```bash
#!/bin/bash
npm run build
rsync -avz --delete dist/ user@servidor:/var/www/suudai.com/
echo "Deploy completado"
```

**Criterios de aceptación:**
- [ ] `./deploy.sh` ejecuta build + sync en un comando
- [ ] Solo sincroniza archivos cambiados (rsync incremental)
- [ ] Muestra output claro de éxito/error
- [ ] Documentado en README

---

### SUUDAI-406 · Variables de entorno producción

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 0.5 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `feat/SUUDAI-406-env-prod` |

**Descripción:**
Configurar `.env` de producción.

**Variables:**
- `WHATSAPP_NUMBER` — número de la planta
- `SITE_URL` — https://suudai.com
- `MAPS_EMBED_URL` — URL del embed de Google Maps

**Criterios de aceptación:**
- [ ] `.env.example` actualizado con todas las variables
- [ ] Build de producción usa valores correctos
- [ ] Ningún dato sensible en el repo

---

### SUUDAI-407 · Lighthouse audit

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 2 hrs |
| **Prioridad** | P1 — High |
| **Branch** | `fix/SUUDAI-407-lighthouse` |
| **Depende de** | SUUDAI-402 |

**Descripción:**
Correr Lighthouse en producción y optimizar hasta scores aceptables.

**Criterios de aceptación:**
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90
- [ ] Documentar scores finales

---

### SUUDAI-408 · Testing producción

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 2 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A |
| **Depende de** | SUUDAI-402, SUUDAI-405 |

**Descripción:**
Flujo de pedido real en producción.

**Criterios de aceptación:**
- [ ] Seleccionar productos → formulario → WhatsApp → mensaje llega al número de la planta
- [ ] Probar en mobile real (no solo emulador)
- [ ] Probar en desktop (WhatsApp Web)
- [ ] Fecha de entrega correcta
- [ ] Todos los links funcionan
- [ ] Google Maps muestra ubicación correcta

---

### SUUDAI-409 · Smoke test general

| Campo | Valor |
|-------|-------|
| **Tipo** | QA |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A |
| **Depende de** | SUUDAI-408 |

**Descripción:**
Verificación final de todo el sitio.

**Criterios de aceptación:**
- [ ] suudai.com carga con HTTPS
- [ ] sistema.suudai.com sigue funcionando
- [ ] Todas las secciones visibles y correctas
- [ ] Animaciones funcionando
- [ ] Formulario + WhatsApp funcional
- [ ] SEO: meta tags correctos en view-source
- [ ] Mobile + desktop OK

---

### SUUDAI-410 · Documentación

| Campo | Valor |
|-------|-------|
| **Tipo** | Docs |
| **Estimación** | 1 hr |
| **Prioridad** | P2 — Medium |
| **Branch** | `docs/SUUDAI-410-readme` |

**Descripción:**
README y CLAUDE.md para mantenimiento futuro.

**Criterios de aceptación:**
- [ ] README: setup, estructura, cómo correr dev, cómo hacer deploy
- [ ] CLAUDE.md: contexto del proyecto para Claude Code
- [ ] Documentar cómo actualizar precios (editar array + deploy.sh)

---

### SUUDAI-411 · Go live + DNS

| Campo | Valor |
|-------|-------|
| **Tipo** | DevOps |
| **Estimación** | 1.5 hrs |
| **Prioridad** | P0 — Blocker |
| **Branch** | N/A |
| **Depende de** | SUUDAI-408, SUUDAI-409 |

**Descripción:**
DNS swap final y verificación post-launch.

**Criterios de aceptación:**
- [ ] DNS apuntando correctamente
- [ ] Propagación verificada
- [ ] Sitio accesible desde red externa
- [ ] Web anterior removida (backup ya guardado en SUUDAI-401)

---

### SUUDAI-412 · Handoff al cliente

| Campo | Valor |
|-------|-------|
| **Tipo** | Docs |
| **Estimación** | 2 hrs |
| **Prioridad** | P1 — High |
| **Branch** | N/A |

**Descripción:**
Sesión/documento de handoff para que el cliente entienda cómo operar.

**Criterios de aceptación:**
- [ ] Documento o video corto explicando:
  - Cómo llegan los pedidos por WhatsApp
  - Qué hacer cuando llega un pedido
  - Cómo solicitar cambio de precios
  - Contacto de soporte (tú)
- [ ] Cliente confirma que entiende el flujo

---

## Resumen comparativo

| Sprint | Original | Optimizado | Ahorro |
|--------|----------|------------|--------|
| Sprint 1 — Fundación + Landing | 28 hrs | 20 hrs | 8 hrs |
| Sprint 2 — Pedido + WhatsApp | 55 hrs* | 15 hrs | 40 hrs |
| Sprint 3 — Animaciones + Pulido | (incluido) | 14 hrs | — |
| Sprint 4 — Deploy + Go Live | 25 hrs | 16 hrs | 9 hrs |
| **Total** | **~118 hrs** | **~65 hrs** | **~53 hrs (45%)** |

_* Sprint 2 original (30 hrs) + Sprint 3 original (25 hrs) = 55 hrs, ambos reemplazados._

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| WhatsApp no disponible | Mostrar teléfono de contacto como fallback |
| Cliente no entrega contenido | Placeholders profesionales, se reemplazan post-launch |
| Migración rompe Dolibarr | Backup completo antes de tocar Nginx. Smoke test sistema.suudai.com |
| Precios desactualizados | Documentar proceso: editar array → deploy.sh |

---

## Prerequisitos del cliente

- [ ] Logo en SVG o PNG alta resolución
- [ ] Lista de ~6 productos con precios para reparto
- [ ] Número de WhatsApp de la planta para recibir pedidos
- [ ] Dirección exacta de la planta (para mapa)
- [ ] Horarios de operación y días no laborables adicionales
- [ ] Acceso SSH al servidor de hosting actual
- [ ] Fotos reales de productos (idealmente antes de Sprint 3)
