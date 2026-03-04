const Database = require("better-sqlite3");
const path = require("path");
const config = require("../config");

const db = new Database(path.resolve(config.DB_PATH));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    customer_name TEXT,
    customer_email TEXT,
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get();
if (productCount.count === 0) {
  const insert = db.prepare("INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)");
  insert.run("Minimalist Desk Lamp", "Sleek design with adjustable brightness", 89.99, "Electronics", 25, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400");
  insert.run("Wireless Earbuds", "High-quality sound with noise cancellation", 149.99, "Electronics", 50, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400");
  insert.run("Cotton T-Shirt", "Premium organic cotton, comfortable fit", 29.99, "Clothing", 100, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400");
  insert.run("Ceramic Coffee Mug", "Handcrafted, microwave safe", 18.99, "Home", 40, "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400");
  insert.run("Leather Wallet", "Genuine leather, slim design", 49.99, "Accessories", 30, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400");
  insert.run("Stainless Steel Bottle", "Keep drinks cold for 24 hours", 24.99, "Home", 60, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400");
}

module.exports = db;
