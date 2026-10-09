require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const db = require('./db/database');

// Routers
const healthRouter = require('./routes/health');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const loyaltyRouter = require('./routes/loyalty');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: "Tezkor Oziq-ovqat yetkazib berish xizmati API ishlamoqda!",
    docs: {
      healthcheck: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      orders: '/api/orders',
      loyalty: '/api/loyalty/:phone'
    }
  });
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/loyalty', loyaltyRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Bunday endpoint topilmadi'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Serverda ichki xatolik yuz berdi',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server if run directly
let server = null;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} manzilida ishga tushdi`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📦 Mahsulotlar: http://localhost:${PORT}/api/products`);
  });
}

module.exports = { app, server };
