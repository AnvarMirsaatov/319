const { buildOrderMessage } = require('./services/telegram');

const sampleOrder = {
  id: 'ORD-123456-789',
  created_at: '2026-10-06T18:30:00.000Z',
  deadline_at: '2026-10-06T19:30:00.000Z',
  customer_name: 'Anvar Qodirov',
  customer_phone: '+998901234567',
  address: 'Toshkent shahar, Yunusobod tumani, 4-mavze, 12-uy',
  landmark: 'Mega Planet orqasida',
  lat: 41.3654,
  lng: 69.2891,
  items: [
    { title: 'Toshkent Un Oliy Nav 1kg', quantity: 2, price: 14000, total: 28000 },
    { title: "Musaffo Sut 3.2% 1L", quantity: 3, price: 12000, total: 36000 },
    { title: "Mol go'shti lahm", quantity: 2, price: 115000, total: 230000 }
  ],
  total_products: 294000,
  delivery_fee: 0,
  discount: 0,
  total_amount: 294000,
  payment_type: 'click',
  qualifying_orders_count: 3
};

console.log('--- GENERATED TELEGRAM MESSAGE TEST ---');
const message = buildOrderMessage(sampleOrder);
console.log(message);
console.log('---------------------------------------');

// Validations
const assertions = [
  message.includes('YANGI BUYURTMA: #ORD-123456-789'),
  message.includes('Yetkazish muddati:') && message.includes('(Maksimal 1 soat!)'),
  message.includes('• Ism: Anvar Qodirov'),
  message.includes('• Tel: +998901234567'),
  message.includes('• Mo\'ljal: Mega Planet orqasida'),
  message.includes('Lokatsiya: https://yandex.uz/maps/?pt=69.2891,41.3654&z=16&l=map'),
  message.includes('1. Toshkent Un Oliy Nav 1kg - 2 x 14,000 = 28,000 so\'m'),
  message.includes('• Mahsulotlar summasi: 294,000 so\'m'),
  message.includes('• Yetkazib berish: BEPUL (250,000 so\'mdan yuqori)'),
  message.includes('• Chegirma: 0 so\'m (Sodiqlik: 3/7 ta 350k+ buyurtma mavjud)'),
  message.includes('JAMI TO\'LOV: 294,000 so\'m'),
  message.includes('To\'lov turi: CLICK')
];

const allPassed = assertions.every(Boolean);
if (allPassed) {
  console.log('✅ ALL TELEGRAM MESSAGE FORMAT ASSERTIONS PASSED!');
} else {
  console.error('❌ ASSERTION FAILED:', assertions);
  process.exit(1);
}
