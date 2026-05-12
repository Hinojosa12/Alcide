const Database = require('better-sqlite3')
const db = new Database('caribzoom.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL,
    image TEXT,
    category TEXT,
    brand TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_url TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS brand_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    title TEXT,
    description TEXT,
    button_text TEXT,
    button_url TEXT,
    whatsapp TEXT DEFAULT '',
    size TEXT DEFAULT 'square',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS shop_banner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT DEFAULT '',
    top_text TEXT DEFAULT 'Find the Boundaries. Push Through!',
    title TEXT DEFAULT 'Summer Sale',
    subtitle TEXT DEFAULT '30% OFF',
    price_text TEXT DEFAULT '$19999',
    button_text TEXT DEFAULT 'GET YOURS!',
    button_url TEXT DEFAULT '/shop',
    bg_color TEXT DEFAULT '#2d8a6e'
  );
`)

// Agregar columnas nuevas si la DB ya existe (migracion segura)
const cols = db.prepare("PRAGMA table_info(brand_banners)").all().map(c => c.name)
if (!cols.includes('whatsapp')) {
  db.prepare("ALTER TABLE brand_banners ADD COLUMN whatsapp TEXT DEFAULT ''").run()
}
if (!cols.includes('size')) {
  db.prepare("ALTER TABLE brand_banners ADD COLUMN size TEXT DEFAULT 'square'").run()
}

console.log('Base de datos lista ✅')

module.exports = db