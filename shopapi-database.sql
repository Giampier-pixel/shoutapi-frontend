-- =============================================
-- ShopAPI — Database Setup
-- Run this file in MySQL Workbench against
-- your Aiven "defaultdb" database.
-- =============================================

-- -----------------------------------------------
-- 1. TABLES
-- -----------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role       ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  is_active  TINYINT(1)    NOT NULL DEFAULT 1,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  slug        VARCHAR(120) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id          INT            NOT NULL AUTO_INCREMENT,
  category_id INT            NOT NULL,
  name        VARCHAR(200)   NOT NULL,
  description TEXT,
  price       DECIMAL(10,2)  NOT NULL,
  stock       INT            NOT NULL DEFAULT 0,
  image_url   VARCHAR(500),
  is_active   TINYINT(1)     NOT NULL DEFAULT 1,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cart_items (
  id         INT      NOT NULL AUTO_INCREMENT,
  user_id    INT      NOT NULL,
  product_id INT      NOT NULL,
  quantity   INT      NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_user_product (user_id, product_id),
  KEY idx_cart_user (user_id),
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id         INT           NOT NULL AUTO_INCREMENT,
  user_id    INT           NOT NULL,
  status     ENUM('pending','processing','shipped',
                  'delivered','cancelled')
             NOT NULL DEFAULT 'pending',
  total      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id         INT           NOT NULL AUTO_INCREMENT,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------
-- 2. SEED DATA
-- -----------------------------------------------

-- Admin user
-- Password: Admin123!  (bcrypt hash, salt 10)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin ShopAPI',
  'admin@shopapi.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
);

-- Categories
INSERT INTO categories (name, description, slug) VALUES
  ('Electrónica',
   'Dispositivos electrónicos, audio und accesorios tecnológicos.',
   'electronica'),
  ('Ropa',
   'Prendas de vestir para hombre y mujer.',
   'ropa'),
  ('Hogar',
   'Artículos y accesorios para el hogar.',
   'hogar');

-- Products — Electrónica (category_id = 1)
INSERT INTO products
  (category_id, name, description, price, stock, image_url)
VALUES
  (1, 'Auriculares Bluetooth Pro',
   'Auriculares inalámbricos con cancelación de ruido activa y 30 h de batería.',
   299.90, 25,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
  (1, 'Teclado Mecánico RGB',
   'Teclado mecánico switches azules, retroiluminación RGB personalizable.',
   189.90, 40,
   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'),
  (1, 'Mouse Ergonómico Inalámbrico',
   'Mouse vertical ergonómico con sensor 4000 DPI y conectividad dual.',
   79.90, 60,
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'),
  (1, 'Monitor 27" 4K IPS',
   'Monitor 27 pulgadas 4K UHD, panel IPS, 99 % sRGB, USB-C.',
   1299.90, 10,
   'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'),
  (1, 'Webcam Full HD 1080p',
   'Cámara web con micrófono integrado, enfoque automático y corrección de luz.',
   149.90, 35,
   'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600');

-- Products — Ropa (category_id = 2)
INSERT INTO products
  (category_id, name, description, price, stock, image_url)
VALUES
  (2, 'Camiseta Algodón Premium',
   'Camiseta 100 % algodón peinado, corte regular, colores sólidos.',
   49.90, 100,
   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),
  (2, 'Jeans Slim Fit Azul',
   'Jeans stretch slim fit, lavado medio, cinco bolsillos.',
   129.90, 50,
   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'),
  (2, 'Zapatillas Urbanas',
   'Zapatillas casuales con suela de goma, diseño minimalista.',
   199.90, 30,
   'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'),
  (2, 'Chaqueta Cortaviento',
   'Chaqueta ligera impermeable con capucha plegable y bolsillos con cierre.',
   179.90, 20,
   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'),
  (2, 'Gorra Snapback Clásica',
   'Gorra ajustable con panel frontal estructurado y visera plana.',
   39.90, 75,
   'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600');

-- Products — Hogar (category_id = 3)
INSERT INTO products
  (category_id, name, description, price, stock, image_url)
VALUES
  (3, 'Lámpara de Escritorio LED',
   'Lámpara ajustable con 5 niveles de brillo y temperatura de color regulable.',
   89.90, 45,
   'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600'),
  (3, 'Set de Tazas Cerámicas x4',
   'Juego de 4 tazas de cerámica 350 ml, diseño nórdico minimalista.',
   59.90, 60,
   'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'),
  (3, 'Organizador de Escritorio',
   'Organizador de bambú con compartimentos para lápices, clips y celular.',
   44.90, 80,
   'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'),
  (3, 'Cojín Decorativo 45x45',
   'Funda de lino lavado con cierre invisible, relleno de fibra siliconada.',
   34.90, 55,
   'https://images.unsplash.com/photo-1584100936595-c0c2989dae8f?w=600'),
  (3, 'Reloj de Pared Minimalista',
   'Reloj de pared 30 cm, movimiento silencioso, estilo escandinavo.',
   69.90, 30,
   'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600');
