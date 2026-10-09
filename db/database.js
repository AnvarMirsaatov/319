const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'market.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize database tables
function initDb() {
  // 1. Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      inStock INTEGER NOT NULL DEFAULT 1,
      image TEXT
    );
  `);

  // 2. Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      landmark TEXT,
      lat REAL,
      lng REAL,
      items_json TEXT NOT NULL,
      total_products REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      discount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_type TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      deadline_at TEXT
    );
  `);

  // Migration: add landmark column if table already existed without it
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN landmark TEXT;`);
  } catch (e) {
    // Column already exists
  }

  // 3. Customers / Loyalty table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      phone TEXT PRIMARY KEY,
      orders_count_350k_plus INTEGER DEFAULT 0,
      next_order_discount_active INTEGER DEFAULT 0
    );
  `);

  // Indexes for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `);
}

initDb();

module.exports = db;
