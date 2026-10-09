const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/products/categories - toifalar ro'yxatini olish
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY category ASC
    `).all();

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Toifalarni yuklashda xatolik yuz berdi',
      error: error.message
    });
  }
});

// GET /api/products - mahsulotlarni kategoriya va qidiruv bo'yicha filterlash
router.get('/', (req, res) => {
  try {
    const { category, search, inStock, limit, offset } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all' && category !== 'Barchasi') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (inStock !== undefined) {
      query += ' AND inStock = ?';
      params.push(inStock === 'true' || inStock === '1' ? 1 : 0);
    }

    // Umumiy sonini olish
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalResult = db.prepare(countQuery).get(...params);
    const total = totalResult ? totalResult.total : 0;

    // Pagination
    query += ' ORDER BY id ASC';
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));

      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset, 10));
      }
    }

    const rows = db.prepare(query).all(...params);

    // inStock qiymatini boolean ga aylantirish
    const products = rows.map((row) => ({
      ...row,
      inStock: Boolean(row.inStock)
    }));

    res.json({
      success: true,
      total,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Mahsulotlarni olishda xatolik yuz berdi',
      error: error.message
    });
  }
});

// GET /api/products/:id - alohida mahsulotni olish
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }

    res.json({
      success: true,
      product: {
        ...product,
        inStock: Boolean(product.inStock)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Mahsulotni olishda xatolik yuz berdi',
      error: error.message
    });
  }
});

module.exports = router;
