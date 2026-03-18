# ShopAPI — Web Design
**v1.0 · React + Tailwind CSS · Clean & Functional**

> El frontend es un complemento para demostrar la integración con el API. El foco del proyecto es el backend.

---

## 1. Filosofía

- **Clean & functional:** mínimo ruido visual, máxima claridad
- **Mobile-first:** grid responsivo 1 → 2 → 3 columnas
- **Estados explícitos:** loading skeletons, empty states y errores siempre presentes
- **Feedback inmediato:** botones muestran spinner durante peticiones

---

## 2. Paleta de colores (Tailwind)

| Token | Clase Tailwind | Uso |
|---|---|---|
| Primary | `indigo-600 / indigo-50` | Botones CTA, links activos, badges |
| Text principal | `slate-900` | Títulos, precios |
| Text secundario | `slate-500` | Descripciones, labels, fechas |
| Background | `slate-100` | Fondo de página, divisores |
| Surface | `white` | Cards, Navbar |
| Success | `green-500` | Stock disponible, orden entregada |
| Danger | `red-500` | Errores, orden cancelada |
| Warning | `amber-500` | Orden pendiente, procesando |

---

## 3. Tipografía

- **Fuente:** Inter (Google Fonts) — pesos 400, 500, 600, 700
- **Títulos de página:** 30px / 700
- **Nombre de producto:** 16px / 600
- **Body / descripción:** 14px / 400
- **Precio:** 20px / 700 `text-indigo-600`
- **Badge / label:** 12px / 500
- **IDs de orden:** `font-mono` 12px

---

## 4. Componentes clave

### Navbar
```
[Logo ShopAPI]  Catálogo · Mis órdenes  |  🔍  🛒(n)  👤
```
- Sticky, fondo blanco, borde `slate-100`
- Contador del carrito vive en `CartContext` (sin llamada al API)
- Mobile: hamburguesa colapsable

### ProductCard
```
┌─────────────────────┐
│  [Imagen — 4:3]     │
├─────────────────────┤
│  [Badge categoría]  │
│  Nombre (2 líneas)  │
│  S/ 129.90          │
│  Stock: 12 unid.    │
│  [Agregar al ─────] │
└─────────────────────┘
```

### OrderStatusBadge

| Estado | Clase Tailwind |
|---|---|
| `pending` | `bg-amber-100 text-amber-800` |
| `processing` | `bg-blue-100 text-blue-800` |
| `shipped` | `bg-indigo-100 text-indigo-800` |
| `delivered` | `bg-green-100 text-green-800` |
| `cancelled` | `bg-red-100 text-red-800` |

---

## 5. Páginas y rutas

| Ruta | Componente | Auth |
|---|---|---|
| `/` | `CatalogPage` | No |
| `/product/:id` | `ProductDetailPage` | No |
| `/cart` | `CartPage` | Sí (customer) |
| `/orders` | `OrdersPage` | Sí (customer) |
| `/orders/:id` | `OrderDetailPage` | Sí (customer) |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/admin` | `AdminDashboard` | Sí (admin) |
| `/admin/products` | `AdminProducts` | Sí (admin) |
| `/admin/orders` | `AdminOrders` | Sí (admin) |

Las rutas protegidas usan un componente `<PrivateRoute>` que verifica el token en `AuthContext` antes de renderizar. Si no hay sesión, redirige a `/login`.

---

## 6. Wireframes (texto)

### Catálogo (`/`)
```
[ Navbar ]
─────────────────────────────────────────────────────
Filtros laterales  |  Grid 3 cols
  ○ Electrónica    |  [Card] [Card] [Card]
  ● Ropa           |  [Card] [Card] [Card]
  ○ Hogar          |  ─────────────────────
                   |  < 1  2  3  4  5 >
```

### Carrito (`/cart`)
```
[ Navbar ]
─────────────────────────────────────────────────────
[ Ítems (70%) ]              [ Resumen (30%) ]
  [Img] Producto A  2×129      Subtotal:  S/ 388.80
  [Img] Producto B  1×99       Total:     S/ 388.80
                               [Confirmar pedido →]
← Seguir comprando
```

### Mis órdenes (`/orders`)
```
# Orden    | Fecha       | Items | Total      | Estado        | Acción
#ORD-0024  | 15 Mar 2025 |   3   | S/ 388.80  | [Processing]  | [Ver]
#ORD-0021  | 10 Mar 2025 |   1   | S/ 129.90  | [Delivered]   | [Ver]
```

### Panel admin productos (`/admin/products`)
```
[ Sidebar: Dashboard | Productos | Órdenes ]
─────────────────────────────────────────────────────
Gestión de Productos                [+ Nuevo Producto]
Img | Nombre        | Cat.  | Precio | Stock | Acciones
[·] | Auriculares   | Elec. | 299.90 |   8   | [✏] [🗑]
[·] | Camiseta      | Ropa  |  49.90 |  45   | [✏] [🗑]
```

---

## 7. Estados de UI

| Situación | Patrón |
|---|---|
| Cargando catálogo | Skeleton cards (`animate-pulse bg-slate-200`) |
| Catálogo vacío | Texto + botón "Limpiar filtros" |
| Error de API | Banner rojo con mensaje + botón "Reintentar" |
| Carrito vacío | Ícono + texto + botón "Ir al catálogo" |
| Botón enviando | Spinner inline, botón `disabled` |
| Checkout exitoso | Toast verde auto-dismiss 3s: "Orden #ORD-XXXX creada" |
| Error de validación | Texto rojo bajo el input específico |

---

## 8. Conexión con el API

```js
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // necesario para enviar la cookie del refreshToken
});

// Adjunta el accessToken en cada request
api.interceptors.request.use((config) => {
  const token = /* obtener de AuthContext o variable en memoria */;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

> El `accessToken` se guarda en memoria (variable JS), no en `localStorage`, para evitar ataques XSS. El `refreshToken` viaja como cookie httpOnly.
