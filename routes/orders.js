const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { calculateHaversineDistance } = require('../utils/geo');
const { sendOrderNotification } = require('../services/telegram');

const MAX_DELIVERY_RADIUS_KM = 10.0;
const STANDARD_DELIVERY_FEE = 20000;
const FREE_DELIVERY_THRESHOLD = 250000;
const LOYALTY_ORDER_THRESHOLD = 350000;
const LOYALTY_ORDERS_REQUIRED = 7;
const LOYALTY_DISCOUNT_PERCENT = 0.05; // 5%

/**
 * POST /api/orders
 * Yangi buyurtma yaratish
 */
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      address,
      landmark,
      lat,
      lng,
      items,
      payment_type = 'cash'
    } = req.body;

    // 1. Asosiy maydonlarni tekshirish (Validation)
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mijoz ismi kiritilishi shart'
      });
    }

    if (!customer_phone || !customer_phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mijoz telefon raqami kiritilishi shart'
      });
    }

    const cleanPhone = customer_phone.trim().replace(/\s+/g, '');

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Yetkazib berish manzili kiritilishi shart'
      });
    }

    if (lat === undefined || lng === undefined || lat === null || lng === null) {
      return res.status(400).json({
        success: false,
        message: 'Geolokatsiya koordinatalari (lat, lng) kiritilishi shart'
      });
    }

    const customerLat = parseFloat(lat);
    const customerLng = parseFloat(lng);

    if (isNaN(customerLat) || isNaN(customerLng)) {
      return res.status(400).json({
        success: false,
        message: "Noto'g'ri geolokatsiya koordinatalari"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Buyurtmada kamida bitta mahsulot bo\'lishi kerak'
      });
    }

    // 2. Geolocation / Radius tekshiruvi (Haversine formulasi)
    const storeLat = parseFloat(process.env.DOKON_LAT || process.env["DO'KON_LAT"] || 41.311081);
    const storeLng = parseFloat(process.env.DOKON_LNG || process.env["DO'KON_LNG"] || 69.240562);

    const distanceKm = calculateHaversineDistance(storeLat, storeLng, customerLat, customerLng);

    if (distanceKm > MAX_DELIVERY_RADIUS_KM) {
      return res.status(400).json({
        success: false,
        message: 'Yetkazib berish xizmati faqat do\'kondan 10 km radiusda amalga oshiriladi',
        distance_km: distanceKm,
        max_radius_km: MAX_DELIVERY_RADIUS_KM
      });
    }

    // 3. Mahsulotlarni tekshirish va serverda narxlarni hisoblash
    let totalProducts = 0;
    const validatedItems = [];

    const getProductStmt = db.prepare('SELECT * FROM products WHERE id = ?');

    for (const item of items) {
      const prodId = item.id || item.product_id;
      const quantity = parseInt(item.quantity || item.count || 1, 10);

      if (!prodId || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Har bir mahsulot uchun to\'g\'ri ID va miqdor (quantity > 0) berilishi kerak'
        });
      }

      const product = getProductStmt.get(prodId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Mahsulot topilmadi: ${prodId}`
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Mahsulot ayni paytda omborda mavjud emas: ${product.title}`
        });
      }

      const itemTotal = product.price * quantity;
      totalProducts += itemTotal;

      validatedItems.push({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        unit: product.unit,
        quantity,
        total: itemTotal,
        image: product.image
      });
    }

    // 4. Yetkazib berish narxi logikasi
    // Standart: 20,000 so'm. Agar buyurtma summasi >= 250,000 bo'lsa: 0 so'm (BEPUL).
    const deliveryFee = totalProducts >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

    // 5. Sodiqlik tizimi (Loyalty logic)
    const customer = db.prepare('SELECT * FROM customers WHERE phone = ?').get(cleanPhone) || {
      phone: cleanPhone,
      orders_count_350k_plus: 0,
      next_order_discount_active: 0
    };

    let discount = 0;
    let discountApplied = false;

    // Agar mijozda chegirma faol bo'lsa yoki 7 ta 350k+ buyurtma yig'ilgan bo'lsa
    if (customer.next_order_discount_active === 1 || customer.orders_count_350k_plus >= LOYALTY_ORDERS_REQUIRED) {
      discount = Math.round(totalProducts * LOYALTY_DISCOUNT_PERCENT);
      discountApplied = true;
    }

    // Yakuniy to'lov summasi
    const totalAmount = Math.max(0, totalProducts + deliveryFee - discount);

    // Sodiqlik hisoblagichlarini yangilash
    let nextDiscountActive = 0;
    let nextOrdersCount = customer.orders_count_350k_plus;

    if (discountApplied) {
      // Chegirma ishlatildi, faollikni o'chiramiz va hisoblagichni yangilaymiz
      nextDiscountActive = 0;
      nextOrdersCount = 0;
    }

    // Ushbu joriy buyurtma >= 350,000 so'm bo'lsa, hisoblagichni oshiramiz
    if (totalProducts >= LOYALTY_ORDER_THRESHOLD) {
      nextOrdersCount += 1;
      // Agar 7 taga yetgan bo'lsa, keyingi buyurtma uchun chegirma faollashadi va hisoblagich qayta yangilanadi
      if (nextOrdersCount >= LOYALTY_ORDERS_REQUIRED) {
        nextDiscountActive = 1;
        nextOrdersCount = 0;
      }
    }

    // 6. Buyurtma identifikatori va muddatini (Deadline) yaratish
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const cleanLandmark = landmark && landmark.trim() ? landmark.trim() : null;
    const fullAddress = address.trim();
    const createdAt = new Date().toISOString();
    // Tezkor yetkazish muddati: 1 soat (Maksimal 1 soat!)
    const deadlineAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // 7. SQLite tranzaksiya ichida saqlash
    const createOrderTransaction = db.transaction(() => {
      // Buyurtmani kiritish
      db.prepare(`
        INSERT INTO orders (
          id, customer_name, customer_phone, address, landmark, lat, lng,
          items_json, total_products, delivery_fee, discount,
          total_amount, payment_type, status, created_at, deadline_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
      `).run(
        orderId,
        customer_name.trim(),
        cleanPhone,
        fullAddress,
        cleanLandmark,
        customerLat,
        customerLng,
        JSON.stringify(validatedItems),
        totalProducts,
        deliveryFee,
        discount,
        totalAmount,
        payment_type,
        'new',
        createdAt,
        deadlineAt
      );

      // Mijoz sodiqlik ma'lumotlarini yangilash
      db.prepare(`
        INSERT INTO customers (phone, orders_count_350k_plus, next_order_discount_active)
        VALUES (?, ?, ?)
        ON CONFLICT(phone) DO UPDATE SET
          orders_count_350k_plus = excluded.orders_count_350k_plus,
          next_order_discount_active = excluded.next_order_discount_active
      `).run(cleanPhone, nextOrdersCount, nextDiscountActive);
    });

    createOrderTransaction();

    const createdOrder = {
      id: orderId,
      customer_name: customer_name.trim(),
      customer_phone: cleanPhone,
      address: fullAddress,
      landmark: cleanLandmark,
      lat: customerLat,
      lng: customerLng,
      distance_km: distanceKm,
      total_products: totalProducts,
      delivery_fee: deliveryFee,
      discount,
      discount_applied: discountApplied,
      total_amount: totalAmount,
      payment_type,
      status: 'new',
      created_at: createdAt,
      deadline_at: deadlineAt,
      items: validatedItems,
      qualifying_orders_count: discountApplied ? 7 : customer.orders_count_350k_plus
    };

    // 8. Telegram xabarnoma (asinxron, inline tugmalar bilan)
    sendOrderNotification(createdOrder).catch((err) => {
      console.warn('Telegram notification failed:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      order: createdOrder,
      loyalty: {
        orders_count_350k_plus: nextOrdersCount,
        next_order_discount_active: Boolean(nextDiscountActive),
        progress: `${nextOrdersCount}/${LOYALTY_ORDERS_REQUIRED}`
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Buyurtmani yaratishda xatolik yuz berdi',
      error: error.message
    });
  }
});

/**
 * GET /api/orders/:id
 * Alohida buyurtmani olish
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    res.json({
      success: true,
      order: {
        ...order,
        items: JSON.parse(order.items_json)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Buyurtmani olishda xatolik yuz berdi',
      error: error.message
    });
  }
});

/**
 * GET /api/orders
 * Barcha buyurtmalar ro'yxati (oxirgi buyurtmalar birinchi)
 */
router.get('/', (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const rows = db.prepare(query).all(...params);
    const orders = rows.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json)
    }));

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Buyurtmalarni olishda xatolik yuz berdi',
      error: error.message
    });
  }
});

module.exports = router;
