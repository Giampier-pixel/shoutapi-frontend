# ShopAPI — Tech Stack
**v1.0 · Node.js + Express + MySQL (Aiven) + React**

---

## 1. Stack general

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React + Vite | SPA rápida, fácil de conectar al API REST |
| Routing (FE) | React Router v6 | Navegación declarativa sin recarga |
| Estado global | Context API + useReducer | Sin over-engineering para un proyecto Jr. |
| HTTP client | Axios | Interceptors para adjuntar JWT en cada request |
| Estilos | Tailwind CSS | Utility-first, rápido para UI funcional |
| Backend runtime | Node.js v20 LTS | Requerido por IOTECNOVA, npm ecosystem |
| Backend framework | Express v4 | Requerido por IOTECNOVA, ligero y flexible |
| Base de datos | MySQL 8 — **Aiven Cloud** | Relacional, requerido; Aiven = SSL + cloud managed |
| ORM | Sequelize v6 | Modelos, asociaciones y migraciones |
| Auth | JWT + bcryptjs | Estándar stateless |
| Validación | express-validator | Middleware en rutas, chain-based |
| Documentación | swagger-jsdoc + swagger-ui-express | Docs interactivas desde el código |
| Variables de entorno | dotenv | Separación de config por entorno |
| Deploy Frontend | **Vercel** | CDN global, auto-deploy desde repo GitHub |
| Deploy Backend | **Render** | Free tier, auto-deploy desde repo GitHub |
| Deploy DB | **Aiven** | MySQL managed con SSL obligatorio |

---

## 2. Repositorios y estructura de deploy

```
GitHub
├── shopapi-frontend/   ← repo independiente → conectado a Vercel
└── shopapi-backend/    ← repo independiente → conectado a Render
```

### Flujo de deploy

```
# Backend (Render)
git push origin main   # en shopapi-backend/
→ Render detecta el push y redeploya automáticamente

# Frontend (Vercel)
git push origin main   # en shopapi-frontend/
→ Vercel detecta el push y redeploya automáticamente

# Base de datos
# Aiven corre siempre. Solo se ejecutan migraciones manualmente
# desde Render Shell: npx sequelize-cli db:migrate
```

---

## 3. Backend — dependencias

### Producción
| Paquete | Uso |
|---|---|
| `express` | Framework HTTP principal |
| `sequelize` | ORM para MySQL |
| `mysql2` | Driver MySQL (requerido por Sequelize) |
| `jsonwebtoken` | Genera y verifica tokens JWT |
| `bcryptjs` | Hash de contraseñas |
| `express-validator` | Validación de inputs en rutas |
| `dotenv` | Variables de entorno desde `.env` |
| `cors` | Habilita CORS para el frontend |
| `morgan` | Logger HTTP para debugging |
| `cookie-parser` | Parsea cookies httpOnly para refresh token |
| `swagger-jsdoc` | Genera spec OpenAPI desde JSDoc |
| `swagger-ui-express` | Sirve Swagger UI en `/api-docs` |

### Desarrollo
| Paquete | Uso |
|---|---|
| `nodemon` | Auto-restart en desarrollo |
| `sequelize-cli` | Migraciones y seeders desde terminal |

### Scripts de `package.json`
```json
{
  "start":          "node src/server.js",
  "dev":            "nodemon src/server.js",
  "migrate":        "sequelize-cli db:migrate",
  "migrate:undo":   "sequelize-cli db:migrate:undo",
  "seed":           "sequelize-cli db:seed:all"
}
```

---

## 4. Variables de entorno

### Backend (`shopapi-backend/.env`)
```env
# Servidor
PORT=3000
NODE_ENV=development

# MySQL — Aiven (copiar desde Aiven Console > Connection info)
DB_HOST=mysql-xxxx.aivencloud.com
DB_PORT=14781
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASS=tu_password_aiven
DB_SSL=true

# JWT
JWT_SECRET=cadena_aleatoria_minimo_32_chars
JWT_REFRESH_SECRET=otra_cadena_diferente_minimo_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=https://shopapi.vercel.app
```

> **Nota Aiven:** La conexión a Aiven requiere SSL. En `config/database.js` se debe incluir `dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }` cuando `DB_SSL=true`.

### Frontend (`shopapi-frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

En Vercel (producción), setear:
```
VITE_API_URL=https://shopapi-backend.onrender.com/api
```

---

## 5. Conexión Sequelize — Aiven SSL

```js
// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

module.exports = sequelize;
```

---

## 6. Estructura de carpetas

### Backend (`shopapi-backend/`)
```
src/
├── config/
│   ├── database.js        # Instancia Sequelize + conexión Aiven
│   └── swagger.js         # Config swagger-jsdoc
├── models/
│   ├── index.js           # Asociaciones entre modelos
│   ├── user.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── cartItem.model.js
│   ├── order.model.js
│   └── orderItem.model.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   └── order.controller.js
├── routes/
│   ├── index.js           # Monta todos los routers en /api
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   └── order.routes.js
├── middleware/
│   ├── auth.middleware.js  # Verifica JWT
│   ├── role.middleware.js  # Verifica rol (admin)
│   └── error.middleware.js # Handler global de errores
├── validators/
│   ├── auth.validator.js
│   ├── product.validator.js
│   └── order.validator.js
├── utils/
│   ├── jwt.js             # generateToken, verifyToken
│   └── response.js        # Helpers: success(), error()
├── app.js                 # Config Express, middlewares globales, rutas
└── server.js              # Punto de entrada, escucha puerto
migrations/                # Archivos Sequelize CLI (versionados)
seeders/                   # Datos de prueba
.env                       # NO commitear
.env.example               # SÍ commitear
.gitignore                 # incluir: node_modules/, .env
```

### Frontend (`shopapi-frontend/`)
```
src/
├── api/
│   ├── axios.js           # Instancia Axios con baseURL + interceptors JWT
│   ├── auth.api.js
│   ├── products.api.js
│   ├── cart.api.js
│   └── orders.api.js
├── context/
│   └── AuthContext.jsx    # Estado global del usuario + token
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── CartItem.jsx
│   └── OrderStatusBadge.jsx
├── pages/
│   ├── CatalogPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── OrdersPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       └── AdminOrders.jsx
├── hooks/
│   └── useCart.js
├── utils/
│   └── formatPrice.js
├── App.jsx                # Router + rutas protegidas (PrivateRoute)
└── main.jsx
.env                       # VITE_API_URL=... NO commitear
.env.example               # SÍ commitear
.gitignore                 # incluir: node_modules/, .env, dist/
```

---

## 7. Deploy paso a paso

### 7.1 Aiven — Base de datos MySQL
1. Crear cuenta en [aiven.io](https://aiven.io)
2. Nuevo servicio → MySQL → Free tier
3. Copiar las credenciales de conexión (host, port, user, password)
4. Las credenciales van al `.env` del backend y en las variables de entorno de Render

### 7.2 Render — Backend
1. Push del repo `shopapi-backend` a GitHub
2. En Render: New → Web Service → conectar repo `shopapi-backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Agregar todas las variables de entorno (las del `.env` con valores de producción)
6. En Render Shell ejecutar: `npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`

### 7.3 Vercel — Frontend
1. Push del repo `shopapi-frontend` a GitHub
2. En Vercel: New Project → conectar repo `shopapi-frontend`
3. Framework: Vite (auto-detectado)
4. Agregar variable de entorno: `VITE_API_URL=https://[tu-backend].onrender.com/api`
5. Deploy automático

### 7.4 Actualizar CORS en Render
Una vez conocida la URL de Vercel, actualizar `CLIENT_URL` en las variables de Render con la URL de producción del frontend.
