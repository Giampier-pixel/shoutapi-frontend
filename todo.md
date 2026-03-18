# ShopAPI — To-Do List

This to-do list is based on the provided PRD, Tech Stack, and Web Design documents. Features are broken down into logical steps and sprints.

## 1. Initial Setup & Database
- [x] **Database Setup Note:** I will provide you with an `.sql` file containing the schema, tables, and seed data. You can simply run this file in your "defaultdb" database in MySQL Workbench to set everything up directly in your Aiven cloud database.

## 2. Backend Development (Express + MySQL)

**Sprint 1: Architecture & Models**
- [x ] Initialize Node.js/Express project and install dependencies (`express`, `sequelize`, `mysql2`, etc.).
- [ x] Set up the database connection using Sequelize (configured for Aiven SSL).
- [ x] Define Models and Associations: `User`, `Category`, `Product`, `CartItem`, `Order`, `OrderItem`.
- [ x] Create the central error handling middleware and standard response utilities.

**Sprint 2: Authentication & Authorization**
- [ x] Implement user registration (`POST /api/auth/register`) with bcrypt hashing.
- [x ] Implement login (`POST /api/auth/login`) generating an `accessToken` and a httpOnly cookie for `refreshToken`.
- [ x] Implement token refresh (`POST /api/auth/refresh`) and logout (`POST /api/auth/logout`).
- [x ] Create `verifyToken` and `isAdmin` middleware to protect routes.

**Sprint 3: Catalog (Products & Categories)**
- [ x] Create CRUD endpoints for Categories (Admin protected: POST, PUT, DELETE; Public: GET).
- [x ] Create CRUD endpoints for Products (Admin protected: POST, PUT, DELETE; Public: GET with pagination/filters).

**Sprint 4: Shopping Cart**
- [x ] Implement add to cart (`POST /api/cart/items`) with stock validation.
- [x ] Implement update item quantity (`PUT /api/cart/items/:productId`).
- [ x] Implement remove item (`DELETE /api/cart/items/:productId`) and clear cart (`DELETE /api/cart`).
- [x ] Implement fetch cart (`GET /api/cart`).

**Sprint 5: Orders & User Management**
- [x ] Implement checkout process (`POST /api/orders/checkout`) turning cart items into an order, running within a database transaction to decrement stock atomically.
- [x ] Implement order history for customers (`GET /api/orders/my`).
- [x ] Implement order management for admins (listing all orders, advancing order states like pending -> processing -> shipped).
- [x ] Implement user profiles and admin user list/deactivation.
- [x ] Generate Swagger UI documentation at `/api-docs`.
- [x ] **Push to Repository:** *Once the backend is fully complete and tested locally, it is time to push the code to your `shopapi-backend` GitHub repository.*

## 3. Frontend Development (React + Tailwind)
*Note: We will build the frontend after the backend is ready. We will push it to the repo once everything is functioning locally against the backend.*

**Sprint 6: React App & Integrations**
- [ ] Initialize React project with Vite and Tailwind CSS.
- [ ] Set up React Router for declarative navigation.
- [ ] Configure Axios instance with interceptors to automatically attach the `accessToken` and handle the `withCredentials` setting for cookies.
- [ ] Set up global state (`AuthContext` and potentially `CartContext`).
- [ ] Build global UI components: `Navbar` (with cart counter), loading skeletons, error banners, and the `ProductCard`.
- [ ] Build Public Pages: `CatalogPage`, `ProductDetailPage`, `LoginPage`, `RegisterPage`.
- [ ] Build Protected Customer Pages: `CartPage` (cart management), `OrdersPage` (order history), `OrderDetailPage`.
- [ ] Build Protected Admin Pages: `AdminDashboard`, `AdminProducts`, `AdminOrders`.
- [ ] **Push to Repository:** *Once the frontend is fully complete and tested locally, it is time to push the code to your `shopapi-frontend` GitHub repository.*

## 4. Deployment

You will handle the deployment for Render and Vercel. Here is the credential and deployment sequence information you'll need:

**Step 1: Deploy Backend to Render**
- Connect `shopapi-backend` repo.
- Ensure the Build Command is `npm install` and Start Command is `npm start`.
- **Environment Variables Required:**
  - `NODE_ENV=production`
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` (From Aiven Connection Info).
  - `DB_SSL=true`
  - `JWT_SECRET` (A strong random string).
  - `JWT_REFRESH_SECRET` (A different strong random string).
  - `CLIENT_URL=https://your-frontend-project.vercel.app` (You can update this after Vercel deployment).

**Step 2: Deploy Frontend to Vercel**
- Connect `shopapi-frontend` repo.
- Select "Vite" framework.
- **Environment Variables Required:**
  - `VITE_API_URL=https://your-backend-project.onrender.com/api` (The URL Render provides you).

**Step 3: Final Integration**
- Ensure Render's `CLIENT_URL` perfectly matches your Vercel URL to avoid CORS errors.
- Run migrations and seed the Aiven database (via Workbench using the `.sql` script I will provide, or via the Render shell if preferred).
