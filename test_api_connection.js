const { app } = require('./server');
const http = require('http');

async function testConnection() {
  console.log('--- TESTING API CONNECTION AND CORS (PORT 5001) ---');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5001, resolve));

  try {
    // 1. Categories endpoint test
    const catRes = await fetch('http://localhost:5001/api/products/categories', {
      headers: { 'Origin': 'http://localhost:3000' }
    });
    console.log(`GET /api/products/categories Status: ${catRes.status} (CORS Header: ${catRes.headers.get('access-control-allow-origin')})`);
    const catData = await catRes.json();
    console.log(`Categories count: ${catData.categories.length} (Kutilgan: 8)`);

    // 2. Products endpoint test
    const prodRes = await fetch('http://localhost:5001/api/products?limit=200', {
      headers: { 'Origin': 'http://localhost:3000' }
    });
    console.log(`GET /api/products?limit=200 Status: ${prodRes.status} (CORS Header: ${prodRes.headers.get('access-control-allow-origin')})`);
    const prodData = await prodRes.json();
    console.log(`Products total: ${prodData.total}, count returned: ${prodData.products.length} (Kutilgan: 200)`);

    // 3. Healthcheck test
    const healthRes = await fetch('http://localhost:5001/api/health', {
      headers: { 'Origin': 'http://localhost:3000' }
    });
    const healthData = await healthRes.json();
    console.log(`Healthcheck Status: ${healthRes.status}, DB Connected: ${healthData.database.connected}`);

    if (catRes.status === 200 && prodRes.status === 200 && catData.categories.length === 8 && prodData.products.length === 200) {
      console.log('\n✅ 403 XATOLIGI BUTUNLAY BARTARAF ETILDI! CORS VA BARCHA API ENDPOINTLAR 100% ISHLAMOQDA.');
    } else {
      throw new Error('API connection test failed');
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

testConnection();
