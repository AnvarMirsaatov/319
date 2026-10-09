const { app } = require('./server');
const http = require('http');
const db = require('./db/database');

async function runBusinessRulesTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5002, resolve));
  const baseUrl = 'http://localhost:5002';
  console.log('Test server running on port 5002 for business rules verification...\n');

  try {
    const testPhone = '+998901112233';
    // Tozalash
    db.prepare('DELETE FROM orders WHERE customer_phone = ?').run(testPhone);
    db.prepare('DELETE FROM customers WHERE phone = ?').run(testPhone);

    // -------------------------------------------------------------
    // TEST 1: Geolocation / Radius tekshiruvi (> 10 km xato berishi kerak)
    // Chirchiq (41.468, 69.582) ~33 km
    // -------------------------------------------------------------
    console.log('▶️ TEST 1: Radius > 10 km bo\'lganda buyurtma rad etilishi kerak...');
    const farOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Farrux',
        customer_phone: testPhone,
        address: 'Chirchiq shahri',
        lat: 41.468,
        lng: 69.582,
        items: [{ id: 'prod_001', quantity: 1 }]
      })
    });

    const farOrderData = await farOrderRes.json();
    console.log(`Status: ${farOrderRes.status}`);
    console.log(`Javob:`, farOrderData);

    if (farOrderRes.status === 400 && farOrderData.message === "Yetkazib berish xizmati faqat do'kondan 10 km radiusda amalga oshiriladi") {
      console.log('✅ TEST 1 PASSED: 10 km dan uzoq manzil to\'g\'ri rad etildi!\n');
    } else {
      throw new Error('TEST 1 FAILED!');
    }

    // -------------------------------------------------------------
    // TEST 2: Yetkazib berish narxi < 250,000 so'm (20,000 so'm bo'lishi kerak)
    // Toshkent Chilonzor (41.275, 69.205) ~5 km
    // -------------------------------------------------------------
    console.log('▶️ TEST 2: Buyurtma < 250,000 so\'m bo\'lganda yetkazib berish 20,000 so\'m bo\'lishi kerak...');
    const smallOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Farrux',
        customer_phone: testPhone,
        address: 'Chilonzor 9-mavze',
        landmark: 'Rayhon milliy taomlari',
        lat: 41.275,
        lng: 69.205,
        items: [{ id: 'prod_001', quantity: 2 }], // 12,000 x 2 = 24,000
        payment_type: 'cash'
      })
    });

    const smallOrderData = await smallOrderRes.json();
    console.log(`Status: ${smallOrderRes.status}`);
    console.log(`Total Products: ${smallOrderData.order.total_products}, Delivery Fee: ${smallOrderData.order.delivery_fee}, Total: ${smallOrderData.order.total_amount}`);

    if (smallOrderData.order.delivery_fee === 20000 && smallOrderData.order.total_products === 24000 && smallOrderData.order.total_amount === 44000) {
      console.log('✅ TEST 2 PASSED: 20,000 so\'m yetkazib berish tarifi to\'g\'ri hisoblandi!\n');
    } else {
      throw new Error('TEST 2 FAILED!');
    }

    // -------------------------------------------------------------
    // TEST 3: Yetkazib berish narxi >= 250,000 so'm (0 so'm BEPUL bo'lishi kerak)
    // -------------------------------------------------------------
    console.log('▶️ TEST 3: Buyurtma >= 250,000 so\'m bo\'lganda yetkazib berish 0 so\'m (BEPUL) bo\'lishi kerak...');
    const freeDeliveryRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Farrux',
        customer_phone: testPhone,
        address: 'Chilonzor 9-mavze',
        lat: 41.275,
        lng: 69.205,
        items: [{ id: 'prod_076', quantity: 3 }], // Mol go'shti lahm: 115,000 x 3 = 345,000
        payment_type: 'payme'
      })
    });

    const freeDeliveryData = await freeDeliveryRes.json();
    console.log(`Status: ${freeDeliveryRes.status}`);
    console.log(`Total Products: ${freeDeliveryData.order.total_products}, Delivery Fee: ${freeDeliveryData.order.delivery_fee}, Total: ${freeDeliveryData.order.total_amount}`);

    if (freeDeliveryData.order.delivery_fee === 0 && freeDeliveryData.order.total_products === 345000) {
      console.log('✅ TEST 3 PASSED: Yetkazib berish bepul (0 so\'m) bo\'ldi!\n');
    } else {
      throw new Error('TEST 3 FAILED!');
    }

    // -------------------------------------------------------------
    // TEST 4: Sodiqlik dasturi (Loyalty 7 ta >= 350,000 so'mlik buyurtma va 5% chegirma)
    // -------------------------------------------------------------
    console.log('▶️ TEST 4: Sodiqlik dasturi — 7 ta >= 350k buyurtmadan keyin 5% chegirma berilishi...');
    const loyaltyPhone = '+998907778899';
    db.prepare('DELETE FROM orders WHERE customer_phone = ?').run(loyaltyPhone);
    db.prepare('DELETE FROM customers WHERE phone = ?').run(loyaltyPhone);

    // 7 ta 350k+ buyurtma yuboramiz (har biri Mol go'shti lahm 4kg = 460,000 so'm)
    for (let i = 1; i <= 7; i++) {
      const orderRes = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'Loyal Mijoz',
          customer_phone: loyaltyPhone,
          address: 'Yunusobod 4-mavze',
          lat: 41.35,
          lng: 69.28,
          items: [{ id: 'prod_076', quantity: 4 }] // 115,000 x 4 = 460,000
        })
      });
      const orderData = await orderRes.json();
      console.log(`  Buyurtma #${i}: count350k=${orderData.loyalty.orders_count_350k_plus}, nextDiscount=${orderData.loyalty.next_order_discount_active}`);
    }

    // 7 ta buyurtmadan keyin mijozning sodiqlik holatini tekshiramiz
    const loyaltyStatusRes = await fetch(`${baseUrl}/api/loyalty/${loyaltyPhone}`);
    const loyaltyStatus = await loyaltyStatusRes.json();
    console.log('Mijoz sodiqlik holati:', loyaltyStatus);

    if (!loyaltyStatus.next_order_discount_active) {
      throw new Error('7 ta buyurtmadan keyin chegirma faollashmadi!');
    }
    console.log('7 ta buyurtma to\'plandi va 5% chegirma faollashdi!');

    // Endi 8-buyurtmani beramiz: 5% CHEGIRMA QO\'LLANILISHI KERAK!
    console.log('8-buyurtma: 5% chegirma qo\'llanilishini tekshirish...');
    const discountOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Loyal Mijoz',
        customer_phone: loyaltyPhone,
        address: 'Yunusobod 4-mavze',
        lat: 41.35,
        lng: 69.28,
        items: [{ id: 'prod_076', quantity: 1 }] // 115,000 so'm
      })
    });

    const discountOrderData = await discountOrderRes.json();
    console.log(`8-buyurtma natijasi:`, {
      total_products: discountOrderData.order.total_products,
      discount: discountOrderData.order.discount,
      delivery_fee: discountOrderData.order.delivery_fee,
      total_amount: discountOrderData.order.total_amount,
      discount_applied: discountOrderData.order.discount_applied
    });

    // 115,000 ning 5% = 5750 so'm chegirma
    if (discountOrderData.order.discount === 5750 && discountOrderData.order.total_amount === (115000 + 20000 - 5750)) {
      console.log('✅ TEST 4 PASSED: 5% chegirma to\'liq va aniq qo\'llandi!');
    } else {
      throw new Error('5% chegirma xato hisoblandi!');
    }

    // Chegirma ishlatilgach, keyingi holat tekshiriladi
    const postLoyaltyRes = await fetch(`${baseUrl}/api/loyalty/${loyaltyPhone}`);
    const postLoyalty = await postLoyaltyRes.json();
    console.log('Chegirma ishlatilgandan keyingi sodiqlik holati:', postLoyalty);

    if (postLoyalty.next_order_discount_active === false) {
      console.log('✅ TEST 5 PASSED: Chegirma ishlatilgach faollik o\'chirildi va yangi sikl boshlandi!\n');
    }

    console.log('🎉 BARCHA QAT\'IY BIZNES QOIDALARI TESTLARDAN MUVAFFAQIYATLI O\'TDI! 🚀');
  } catch (err) {
    console.error('❌ Xatolik:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runBusinessRulesTests();
