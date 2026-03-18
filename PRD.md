# ShopAPI — Product Requirements Document
**v1.0 · Portafolio Backend Jr. · IOTECNOVA S.A.C.**

---

## 1. Resumen ejecutivo

ShopAPI es una API REST de e-commerce construida con Node.js (Express) + MySQL (Aiven), con un frontend React desacoplado. Demuestra dominio de diseño de APIs, modelado relacional, autenticación JWT y deploy profesional en servicios cloud.

| Campo | Detalle |
|---|---|
| Nombre | ShopAPI |
| Repo frontend | `https://github.com/Giampier-pixel/shoutapi-frontend.git` → deploy en Vercel |
| Repo backend | `https://github.com/Giampier-pixel/shoutapi-backend.git` → deploy en Render |
| Base de datos | MySQL — Aiven Cloud |

---

## 2. Objetivos

**General:** Construir una API REST funcional y desplegada que demuestre capacidad de diseñar, implementar y conectar un backend Express con MySQL (Aiven) y un frontend React.

**Específicos:**
- Implementar autenticación JWT con roles `customer` y `admin`
- Diseñar modelo relacional normalizado en MySQL con Sequelize ORM
- Exponer endpoints REST documentados con Swagger UI en `/api-docs`
- Conectar backend (Render) con frontend (Vercel) en producción
- Aplicar validaciones, manejo de errores estandarizado y middleware de seguridad

---

## 3. Alcance

### 3.1 MVP — Dentro del alcance
- Auth: registro, login, refresh token, logout
- Catálogo: CRUD de categorías y productos con paginación y filtros
- Carrito: agregar, actualizar cantidad, eliminar ítems, validar stock
- Órdenes: checkout con transacción, historial del cliente, cambio de estado (admin)
- Usuarios: perfil propio, listado y desactivación (admin)
- Frontend React: catálogo, detalle, carrito, órdenes, login/registro, panel admin básico

---

## 4. Roles y permisos

| Rol | Capacidades |
|---|---|
| `guest` | Ver catálogo, buscar productos, ver detalle |
| `customer` | Lo anterior + carrito, checkout, historial de órdenes, perfil |
| `admin` | Lo anterior + CRUD productos/categorías, gestión de órdenes y usuarios |

---

## 5. Requerimientos funcionales

### Auth
- **RF-01** Registro con nombre, email y contraseña (bcrypt, salt 10)
- **RF-02** Login retorna `accessToken` (JWT 15 min) + `refreshToken` (cookie httpOnly, 7 días)
- **RF-03** Endpoint refresh renueva el `accessToken` sin re-login
- **RF-04** Logout invalida la cookie del `refreshToken`

### Catálogo
- **RF-05** Admin: CRUD categorías (nombre, descripción, slug)
- **RF-06** Admin: CRUD productos (nombre, descripción, precio, stock, imagen URL, categoría, estado)
- **RF-07** Cualquier usuario: listar productos con paginación, filtro por categoría y búsqueda
- **RF-08** Cualquier usuario: detalle de producto por `id`

### Carrito
- **RF-09** Cliente: agregar producto al carrito con cantidad
- **RF-10** Sistema verifica stock disponible antes de agregar
- **RF-11** Cliente: actualizar cantidad o eliminar ítem
- **RF-12** Cliente: vaciar carrito completo

### Órdenes
- **RF-13** Cliente: checkout convierte el carrito en orden con estado `pending`
- **RF-14** Checkout decrementa stock en transacción atómica MySQL
- **RF-15** Cliente: historial y detalle de sus órdenes
- **RF-16** Admin: listar órdenes y cambiar estado (`pending → processing → shipped → delivered / cancelled`)

### Usuarios
- **RF-17** Admin: listar usuarios con paginación
- **RF-18** Admin: activar/desactivar cuenta
- **RF-19** Cliente: ver y actualizar su perfil

---

## 6. Requerimientos no funcionales

- **RNF-01** Endpoints protegidos validan `Authorization: Bearer <token>`
- **RNF-02** Contraseñas almacenadas solo como hash bcrypt
- **RNF-03** Validación de entrada en cada endpoint con `express-validator`
- **RNF-04** Errores estandarizados: `{ error, message, statusCode }` con HTTP correcto
- **RNF-05** Swagger UI accesible en `/api-docs`
- **RNF-06** `.env.example` con todas las variables de entorno necesarias
- **RNF-07** `README.md` con pasos de instalación, variables y ejemplos de uso

---

## 7. Endpoints

### Auth
| Método | Ruta | Auth requerida |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/auth/refresh` | Cookie refreshToken |
| POST | `/api/auth/logout` | JWT |

### Usuarios
| Método | Ruta | Auth requerida |
|---|---|---|
| GET | `/api/users/me` | JWT (any) |
| PUT | `/api/users/me` | JWT (any) |
| GET | `/api/users` | JWT (admin) |
| PATCH | `/api/users/:id/status` | JWT (admin) |

### Categorías
| Método | Ruta | Auth requerida |
|---|---|---|
| GET | `/api/categories` | No |
| GET | `/api/categories/:id` | No |
| POST | `/api/categories` | JWT (admin) |
| PUT | `/api/categories/:id` | JWT (admin) |
| DELETE | `/api/categories/:id` | JWT (admin) |

### Productos
| Método | Ruta | Auth requerida |
|---|---|---|
| GET | `/api/products` | No |
| GET | `/api/products/:id` | No |
| POST | `/api/products` | JWT (admin) |
| PUT | `/api/products/:id` | JWT (admin) |
| DELETE | `/api/products/:id` | JWT (admin) — soft delete |

### Carrito
| Método | Ruta | Auth requerida |
|---|---|---|
| GET | `/api/cart` | JWT (customer) |
| POST | `/api/cart/items` | JWT (customer) |
| PUT | `/api/cart/items/:productId` | JWT (customer) |
| DELETE | `/api/cart/items/:productId` | JWT (customer) |
| DELETE | `/api/cart` | JWT (customer) |

### Órdenes
| Método | Ruta | Auth requerida |
|---|---|---|
| POST | `/api/orders/checkout` | JWT (customer) |
| GET | `/api/orders/my` | JWT (customer) |
| GET | `/api/orders/my/:id` | JWT (customer) |
| GET | `/api/orders` | JWT (admin) |
| PATCH | `/api/orders/:id/status` | JWT (admin) |

---

## 8. Modelo de datos (MySQL — Aiven)

```
users        id · name · email (UNIQUE) · password_hash · role (ENUM: customer,admin) · is_active · timestamps
categories   id · name · description · slug (UNIQUE) · timestamps
products     id · category_id (FK) · name · description · price · stock · image_url · is_active · timestamps
cart_items   id · user_id (FK) · product_id (FK) · quantity · timestamps
orders       id · user_id (FK) · status (ENUM: pending,processing,shipped,delivered,cancelled) · total · timestamps
order_items  id · order_id (FK) · product_id (FK) · quantity · unit_price (snapshot) · timestamps
```

**Relaciones clave:**
- `users` 1:N `cart_items` y `orders`
- `categories` 1:N `products`
- `orders` 1:N `order_items` — `products` N:M `orders` via `order_items`

---

## 9. Flujos principales

### Flujo 1 — Registro e inicio de sesión

| # | Actor | Acción |
|---|---|---|
| 1 | Cliente | Completa formulario de registro (nombre, email, contraseña) |
| 2 | Frontend → API | `POST /api/auth/register` — valida campos y verifica email único |
| 3 | API → MySQL | Hashea contraseña bcrypt, inserta usuario `role='customer'` |
| 4 | API → Frontend | `201 Created` con datos del usuario. Frontend redirige a `/login` |
| 5 | Cliente | Ingresa credenciales |
| 6 | Frontend → API | `POST /api/auth/login` — API verifica credenciales |
| 7 | API → Frontend | Retorna `accessToken` (body) + cookie httpOnly `refreshToken` |
| 8 | Frontend | Guarda `accessToken` en memoria, actualiza estado global |

### Flujo 2 — Compra (happy path)

| # | Actor | Acción |
|---|---|---|
| 1 | Cliente | Navega catálogo → `GET /api/products?category=&page=1&limit=12` |
| 2 | API → MySQL | Retorna productos activos paginados con metadata |
| 3 | Cliente | Click en producto → `GET /api/products/:id` |
| 4 | Cliente | Click "Agregar al carrito" → `POST /api/cart/items { productId, quantity: 1 }` |
| 5 | Middleware | Verifica JWT. Si inválido → `401` |
| 6 | API → MySQL | Verifica `stock >= quantity`. Si no → `400` |
| 7 | API → MySQL | Inserta/actualiza `cart_items`. Retorna carrito actualizado |
| 8 | Cliente | Click "Confirmar pedido" → `POST /api/orders/checkout` |
| 9 | API (Transaction) | Crea `order` + `order_items` con precio snapshot, decrementa stock, vacía carrito |
| 10 | API → Frontend | `201 Created` con objeto orden. Redirige a `/orders/:id` |

### Flujo 3 — Gestión de orden (admin)

| # | Actor | Acción |
|---|---|---|
| 1 | Admin | Panel → `GET /api/orders?status=pending&page=1` |
| 2 | API → MySQL | Lista paginada con datos de cliente y total |
| 3 | Admin | `PATCH /api/orders/:id/status { status: 'processing' }` |
| 4 | Middleware | Verifica JWT + `role === 'admin'`. Si no → `403` |
| 5 | API → MySQL | Actualiza `status`. Retorna orden actualizada |
| 6 | Admin | Puede continuar: `processing → shipped → delivered` o `→ cancelled` |

---

## 10. Criterios de aceptación

| ID | Criterio | Módulo |
|---|---|---|
| CA-01 | `POST /auth/register` retorna `201` con usuario y `409` si email ya existe | Auth |
| CA-02 | `accessToken` expira en 15 min, `refreshToken` en 7 días | Auth |
| CA-03 | Endpoint protegido retorna `401` sin token y `403` si el rol no tiene permiso | Auth/Roles |
| CA-04 | `GET /products` soporta paginación y retorna `{ data, total, page, totalPages }` | Catálogo |
| CA-05 | `POST /cart/items` retorna `400` si stock es insuficiente | Carrito |
| CA-06 | `POST /orders/checkout` decrementa stock en transacción atómica MySQL | Órdenes |
| CA-07 | Estado de orden no puede retroceder en la secuencia definida | Órdenes |
| CA-08 | Swagger UI accesible en `/api-docs` con todos los endpoints | Docs |
| CA-09 | El proyecto arranca con `npm start` usando variables del `.env.example` | DevOps |
| CA-10 | Frontend muestra catálogo, carrito funcional e historial de órdenes | Frontend |

---
