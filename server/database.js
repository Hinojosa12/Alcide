const Database = require('better-sqlite3')
const db = new Database('caribzoom.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, price REAL, image TEXT,
    category TEXT, brand TEXT, description TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, total REAL, status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER, product_id INTEGER, quantity INTEGER, price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
  CREATE TABLE IF NOT EXISTS slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL, title TEXT, subtitle TEXT,
    description TEXT, button_text TEXT, button_url TEXT, sort_order INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS brand_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL, title TEXT, description TEXT,
    button_text TEXT, button_url TEXT,
    whatsapp TEXT DEFAULT '', size TEXT DEFAULT 'square', sort_order INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS shop_brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL, title TEXT, description TEXT,
    button_text TEXT, button_url TEXT,
    whatsapp TEXT DEFAULT '', size TEXT DEFAULT 'square',
    text_x INTEGER DEFAULT 5,
    text_y INTEGER DEFAULT 20,
    text_color TEXT DEFAULT '#1a1a1a',
    sort_order INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS shop_banner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT DEFAULT '', top_text TEXT DEFAULT 'Find the Boundaries. Push Through!',
    title TEXT DEFAULT 'Summer Sale', subtitle TEXT DEFAULT '30% OFF',
    price_text TEXT DEFAULT '$19999', button_text TEXT DEFAULT 'GET YOURS!',
    button_url TEXT DEFAULT '/shop', bg_color TEXT DEFAULT '#2d8a6e'
  );
  CREATE TABLE IF NOT EXISTS about_us (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hero_subtitle TEXT DEFAULT 'Who We Are',
    hero_title TEXT DEFAULT 'About Us',
    hero_description TEXT DEFAULT 'We are your ultimate destination for quality, convenience, and style.',
    story_label TEXT DEFAULT 'Since 2019',
    story_heading TEXT DEFAULT 'Our story is one of growth, creativity, and purpose.',
    story_text TEXT DEFAULT 'Founded in March 2019, Carib-Zoom Inc began as a small social commerce venture.',
    story_image1 TEXT DEFAULT '', story_image2 TEXT DEFAULT '',
    mission_title TEXT DEFAULT 'Our Mission', mission_text TEXT DEFAULT '',
    vision_title TEXT DEFAULT 'Our Vision',   vision_text TEXT DEFAULT '',
    quality_title TEXT DEFAULT 'Our Quality', quality_text TEXT DEFAULT '',
    team_title TEXT DEFAULT 'Our Team', team_image TEXT DEFAULT '', team_text TEXT DEFAULT '',
    promise_label TEXT DEFAULT 'Our Promise', promise_heading TEXT DEFAULT '',
    promise_text TEXT DEFAULT '', promise_image TEXT DEFAULT '',
    stat1_number TEXT DEFAULT '100,000+', stat1_label TEXT DEFAULT 'Sales in 8 Years',
    stat2_number TEXT DEFAULT '99%',      stat2_label TEXT DEFAULT 'Customer Satisfaction Rate',
    stat3_number TEXT DEFAULT '2,000+',   stat3_label TEXT DEFAULT 'Products Available'
  );
  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL, answer TEXT NOT NULL, sort_order INTEGER DEFAULT 0
  );
`)

// Migraciones seguras
const bbCols = db.prepare("PRAGMA table_info(brand_banners)").all().map(c => c.name)
if (!bbCols.includes('whatsapp')) db.prepare("ALTER TABLE brand_banners ADD COLUMN whatsapp TEXT DEFAULT ''").run()
if (!bbCols.includes('size'))     db.prepare("ALTER TABLE brand_banners ADD COLUMN size TEXT DEFAULT 'square'").run()

const sbCols = db.prepare("PRAGMA table_info(shop_brands)").all().map(c => c.name)
if (!sbCols.includes('text_x'))     db.prepare("ALTER TABLE shop_brands ADD COLUMN text_x INTEGER DEFAULT 5").run()
if (!sbCols.includes('text_y'))     db.prepare("ALTER TABLE shop_brands ADD COLUMN text_y INTEGER DEFAULT 20").run()
if (!sbCols.includes('text_color')) db.prepare("ALTER TABLE shop_brands ADD COLUMN text_color TEXT DEFAULT '#1a1a1a'").run()

const aboutExists = db.prepare('SELECT id FROM about_us LIMIT 1').get()
if (!aboutExists) db.prepare('INSERT INTO about_us DEFAULT VALUES').run()

console.log('Base de datos lista ✅')
module.exports = db