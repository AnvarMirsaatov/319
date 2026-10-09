const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * GET /api/loyalty/:phone
 * Mijozning sodiqlik dasturi holatini tekshirish
 */
router.get('/:phone', (req, res) => {
  try {
    const { phone } = req.params;
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    const customer = db.prepare('SELECT * FROM customers WHERE phone = ?').get(cleanPhone);
    const orderHistory = db.prepare('SELECT COUNT(*) as total_orders FROM orders WHERE customer_phone = ?').get(cleanPhone);

    const count350k = customer ? customer.orders_count_350k_plus : 0;
    const isDiscountActive = customer ? Boolean(customer.next_order_discount_active) : false;
    const remainingForDiscount = isDiscountActive ? 0 : Math.max(0, 7 - count350k);

    res.json({
      success: true,
      phone: cleanPhone,
      orders_count_350k_plus: count350k,
      next_order_discount_active: isDiscountActive,
      remaining_orders_for_discount: remainingForDiscount,
      progress: `${count350k}/7`,
      total_orders: orderHistory ? orderHistory.total_orders : 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sodiqlik holatini tekshirishda xatolik yuz berdi',
      error: error.message
    });
  }
});

module.exports = router;
