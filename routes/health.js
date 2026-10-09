const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  try {
    // Check SQLite database connectivity
    const dbCheck = db.prepare('SELECT 1 as connected').get();
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;

    const storeLat = process.env.DOKON_LAT || process.env["DO'KON_LAT"] || 41.311081;
    const storeLng = process.env.DOKON_LNG || process.env["DO'KON_LNG"] || 69.240562;

    res.json({
      status: 'ok',
      service: 'Bozor Tezkor Yetkazib Berish API',
      timestamp: new Date().toISOString(),
      database: {
        connected: Boolean(dbCheck && dbCheck.connected === 1),
        type: 'SQLite (better-sqlite3)',
        counts: {
          products: productCount,
          orders: orderCount,
          customers: customerCount
        }
      },
      store: {
        lat: parseFloat(storeLat),
        lng: parseFloat(storeLng)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Healthcheck failed',
      error: error.message
    });
  }
});

module.exports = router;
