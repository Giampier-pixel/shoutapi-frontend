

## 1. Descripción del proyecto

ShopAPI es una API REST de e-commerce. Dos repositorios independientes en GitHub:
- `shopapi-backend` → Express + MySQL (Aiven) → deploy en **Render**
- `shopapi-frontend` → React + Vite + Tailwind → deploy en **Vercel**

El foco es el **backend**. El frontend es funcional pero simple.

---

## 2. Cuándo activar cada skill / modo

| Situación | Qué hacer |
|---|---|
| Crear o modificar un endpoint Express | Seguir estructura de controlador + ruta + validador |
| Crear un modelo Sequelize | Incluir asociaciones en `models/index.js` |
| Crear una migración | Usar `sequelize-cli` — nunca alterar tablas a mano |
| Escribir lógica de negocio | Va en el **controlador**, no en la ruta ni en el modelo |
| Validar inputs | Siempre con `express-validator` en el archivo `validators/` |
| Manejar errores | Lanzar al middleware global con `next(error)` |
| Escribir código React | Componentes funcionales + hooks. Sin clases |
| Llamar al API desde React | Siempre vía las funciones de `src/api/*.api.js`, nunca fetch directo |
| Agregar variable de entorno | Agregarla también en `.env.example` y documentarla aquí |

---

## 3. Convenciones de código

### General
- Idioma del código: **inglés** (variables, funciones, comentarios)
- Idioma de mensajes de error y UI: **español**
- Sin comentarios obvios — el código debe ser autoexplicativo
- Máximo 80 caracteres por línea
- `const` por defecto, `let` solo si la variable cambia

### Backend
- Archivos: `kebab-case` → `auth.controller.js`, `user.model.js`
- Funciones y variables: `camelCase` → `getUserById`, `accessToken`
- Constantes globales: `UPPER_SNAKE_CASE` → `JWT_SECRET`
- Rutas: siempre en plural y minúsculas → `/api/products`, `/api/users`
- HTTP status codes explícitos: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`
- Respuesta de éxito siempre con `{ data, message }` o `{ data, meta }` para listas
- Respuesta de error siempre con `{ error, message, statusCode }`

### Frontend
- Archivos de componentes: `PascalCase` → `ProductCard.jsx`
- Archivos de utilidades y hooks: `camelCase` → `useCart.js`, `formatPrice.js`
- Props destructuradas en la firma del componente
- Sin `console.log` en producción

---

## 4. Patrones de código

### Patrón de controlador (backend)
```js
// controllers/product.controller.js
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category } = req.query;
    // lógica...
    return res.status(200).json({ data: products, meta: { total, page, totalPages } });
  } catch (error) {
    next(error); // siempre delegar al middleware de error
  }
};
```

### Patrón de ruta (backend)
```js
// routes/product.routes.js
const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validateProduct } = require('../validators/product.validator');
const { getProducts, createProduct } = require('../controllers/product.controller');

router.get('/', getProducts);
router.post('/', verifyToken, isAdmin, validateProduct, createProduct);

module.exports = router;
```

### Patrón de transacción Sequelize (checkout)
```js
const t = await sequelize.transaction();
try {
  // 1. crear order
  // 2. crear order_items con precio snapshot
  // 3. decrementar stock de cada producto
  // 4. vaciar cart_items
  await t.commit();
} catch (error) {
  await t.rollback();
  next(error);
}
```

### Patrón de llamada API (frontend)
```js
// api/products.api.js
import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
```

```js
// En el componente
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  getProducts({ page: 1, limit: 12 })
    .then(res => setProducts(res.data.data))
    .catch(err => setError(err.response?.data?.message))
    .finally(() => setLoading(false));
}, []);
```

---

## 5. Prohibiciones

### Backend
- ❌ No escribir queries SQL crudas — usar Sequelize ORM siempre
- ❌ No retornar `password_hash` en ninguna respuesta
- ❌ No poner lógica de negocio en las rutas — va en controladores
- ❌ No usar `console.log` para errores en producción — usar `next(error)`
- ❌ No commitear `.env` — solo `.env.example`
- ❌ No usar `WidthType.PERCENTAGE` en tablas docx (rompe en Google Docs)
- ❌ No hardcodear la URL del API en el frontend — usar `import.meta.env.VITE_API_URL`

### Frontend
- ❌ No guardar el `accessToken` en `localStorage` — guardar en memoria (variable)
- ❌ No hacer llamadas directas con `fetch` — usar las funciones de `src/api/`
- ❌ No usar clases React — solo functional components + hooks
- ❌ No instalar librerías de UI complejas (MUI, Chakra) — usar Tailwind puro
- ❌ No commitear `dist/` ni `.env`

---

## 6. Paleta de colores (frontend)

```
Primary:      indigo-600 (#4F46E5)    → botones, links, badges
Primary bg:   indigo-50  (#EEF2FF)    → hover, fondos de selección
Text:         slate-900  (#0F172A)    → títulos, precios
Text muted:   slate-500  (#64748B)    → descripciones, fechas
Background:   slate-100  (#F1F5F9)    → fondo de página
Surface:      white      (#FFFFFF)    → cards, navbar
Success:      green-500  (#22C55E)    → stock, delivered
Danger:       red-500    (#EF4444)    → errores, cancelled
Warning:      amber-500  (#F59E0B)    → pending, processing
```

---

## 7. Variables de entorno

### Backend (`shopapi-backend/.env`)
```env
PORT=3000
NODE_ENV=development

DB_HOST=mysql-xxxx.aivencloud.com
DB_PORT=14781
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASS=
DB_SSL=true

JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

### Frontend (`shopapi-frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Producción
| Servicio | Variable | Valor |
|---|---|---|
| Render | `CLIENT_URL` | `https://shopapi.vercel.app` |
| Render | `NODE_ENV` | `production` |
| Render | `DB_*` | Credenciales de Aiven (producción) |
| Vercel | `VITE_API_URL` | `https://shopapi-backend.onrender.com/api` |

---

## 8. Flujo completo del proyecto

```
1. SETUP
   ├── Crear repo shopapi-backend en GitHub
   ├── Crear repo shopapi-frontend en GitHub
   ├── Crear servicio MySQL en Aiven → copiar credenciales al .env
   └── Instalar dependencias y verificar conexión a Aiven

2. BACKEND (Sprints 1–5)
   ├── S1: modelos + migraciones + conexión Aiven SSL
   ├── S2: auth completo (register, login, refresh, logout)
   ├── S3: CRUD categorías y productos
   ├── S4: carrito con validación de stock
   └── S5: órdenes con transacción y cambio de estado

3. FRONTEND (Sprint 6)
   ├── Setup React + Vite + Tailwind + React Router
   ├── AuthContext + instancia Axios con interceptors
   ├── Páginas: CatalogPage, ProductDetailPage, CartPage
   ├── Páginas: OrdersPage, LoginPage, RegisterPage
   └── Admin: AdminProducts, AdminOrders

4. DOCUMENTACIÓN Y DEPLOY (Sprint 7)
   ├── Swagger: documentar todos los endpoints
   ├── README.md: instrucciones locales y producción
   ├── Seeders: 1 admin + 3 categorías + 15 productos
   ├── Push backend → GitHub → conectar a Render
   │     └── En Render Shell: db:migrate + db:seed:all
   ├── Push frontend → GitHub → conectar a Vercel
   │     └── Setear VITE_API_URL en Vercel
   └── Actualizar CLIENT_URL en Render con URL de Vercel
```

---

## 9. Checklist de deploy

- [ ] `.env` no está commiteado (verificar `.gitignore`)
- [ ] `.env.example` está actualizado con todas las variables
- [ ] `DB_SSL=true` en producción (Aiven requiere SSL)
- [ ] `CLIENT_URL` en Render apunta a la URL real de Vercel
- [ ] `VITE_API_URL` en Vercel apunta a la URL real de Render
- [ ] Migraciones ejecutadas en Render Shell
- [ ] Seeders ejecutados (al menos 1 admin + productos)
- [ ] `/api-docs` accesible en el backend desplegado
- [ ] Frontend puede hacer login y ver el catálogo en producción
