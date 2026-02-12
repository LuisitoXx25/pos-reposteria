# MVC  Repostería Artesanal

Sistema web de punto de venta diseñado para la gestión de pedidos, clientes y productos de una repostería artesanal.

## Descripción

Aplicación web responsiva que permite gestionar el flujo completo de una repostería: desde el registro de clientes y productos hasta la creación de pedidos con cálculo automático de totales y descuentos. Incluye un dashboard con alertas de entregas próximas.

### Funcionalidades principales

- **Autenticación** — Login seguro con email y contraseña
- **Gestión de Clientes** — CRUD completo con historial de pedidos
- **Gestión de Productos** — Alta, baja lógica y modificación de precios
- **Gestión de Pedidos** — Creación de pedidos con múltiples productos, descuentos por línea y cálculo automático de totales
- **Dashboard** — Vista general con alertas de pedidos próximos a entregar (hoy, mañana, próximos 3 días)

##  Arquitectura

```
[ Cliente (Browser) ]
        ↓
[ Next.js App — Vercel ]
        ↓
[ Supabase (PostgreSQL + Auth) ]
```

Arquitectura serverless. Sin infraestructura propia, sin costos de hosting.

##  Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Server Actions (Next.js) |
| Base de Datos | PostgreSQL (Supabase) |
| Autenticación | Supabase Auth (Email + Password) |
| Hosting | Vercel (Free Tier) |

##  Modelo de Datos

```
estados_pedido    clientes        productos
┌──────────┐     ┌───────────┐   ┌───────────┐
│ id (PK)  │     │ id (PK)   │   │ id (PK)   │
│ nombre   │     │ user_id   │   │ user_id   │
└──────────┘     │ nombre    │   │ nombre    │
      ↑          │ telefono  │   │ precio    │
      │          │ notas     │   │ activo    │
      │          │ created_at│   │ created_at│
      │          │ updated_at│   │ updated_at│
      │          └───────────┘   └───────────┘
      │               ↑               ↑
      │               │               │
      │          pedidos              │
      │          ┌──────────────┐     │
      └──────────│ estado_id    │     │
                 │ id (PK)      │     │
                 │ user_id      │     │
                 │ cliente_id ──┘     │
                 │ fecha_entrega│     │
                 │ total        │     │
                 │ created_at   │     │
                 │ updated_at   │     │
                 └──────────────┘     │
                       ↑              │
                 pedido_detalle       │
                 ┌──────────────────┐ │
                 │ id (PK)         │ │
                 │ pedido_id       │ │
                 │ producto_id ────┘ │
                 │ cantidad          │
                 │ precio_unitario   │
                 │ descuento_%       │
                 │ descuento_monto   │
                 │ subtotal          │
                 └──────────────────┘
```

> Los campos `precio_unitario`, `descuento_monto` y `subtotal` en `pedido_detalle` funcionan como snapshot histórico del momento en que se creó el pedido.

##  Decisiones Técnicas

| Decisión | Razón |
|----------|-------|
| **Next.js + Vercel** | Deploy gratuito con CI/CD automático en cada push. Server Actions eliminan la necesidad de un backend separado. |
| **Supabase** | PostgreSQL real (no NoSQL), autenticación incluida, Row Level Security nativo, y free tier suficiente para el volumen esperado. |
| **Tailwind CSS** | Prototipado rápido sin necesidad de diseñar un sistema de estilos desde cero. |
| **Tabla catálogo `estados_pedido`** | Evita hardcodear estados en el código. Permite agregar nuevos estados sin deployar cambios. |
| **Descuento a nivel de línea** | Cada producto en un pedido puede tener un descuento diferente, reflejando la realidad del negocio. |
| **Snapshots en `pedido_detalle`** | Guardar precio y descuento al momento del pedido permite auditar el historial aunque los precios cambien después. |

##  Seguridad

- Row Level Security (RLS) activo en todas las tablas
- Cada usuario solo puede ver y modificar sus propios datos
- Variables de entorno protegidas en Vercel
- Autenticación manejada por Supabase Auth

##  Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pos-reposteria.git
cd pos-reposteria

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

##  Roadmap

- [x] Documentación y estructura del proyecto
- [ ] Autenticación (login / registro)
- [ ] CRUD de Clientes
- [ ] CRUD de Productos
- [ ] Módulo de Pedidos
- [ ] Dashboard con alertas de entrega
- [ ] Filtros y búsquedas avanzadas
- [ ] Reportes mensuales y exportación a PDF
- [ ] Métricas de ventas
- [ ] Roles de usuario

##  Licencia

MIT
