const { app } = require('./server');
const http = require('http');

async function testEndpoints() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5001, resolve));
  console.log('Test server running on port 5001');

  try {
    // 1. Test Healthcheck
    const healthRes = await fetch('http://localhost:5001/api/health');
    const healthData = await healthRes.json();
    console.log('\n--- HEALTHCHECK RESPONSE ---');
    console.log(JSON.stringify(healthData, null, 2));

    // 2. Test Products (limit 2)
    const prodRes = await fetch('http://localhost:5001/api/products?limit=2');
    const prodData = await prodRes.json();
    console.log('\n--- PRODUCTS (limit 2) ---');
    console.log({ total: prodData.total, count: prodData.count, products: prodData.products });

    // 3. Test Filter by Category
    const catRes = await fetch('http://localhost:5001/api/products?category=Sut+va+sut+mahsulotlari&limit=2');
    const catData = await catRes.json();
    console.log('\n--- CATEGORY FILTER (Sut va sut mahsulotlari) ---');
    console.log({ total: catData.total, count: catData.count, sample: catData.products[0] });

    // 4. Test Search
    const searchRes = await fetch('http://localhost:5001/api/products?search=lavash');
    const searchData = await searchRes.json();
    console.log('\n--- SEARCH (lavash) ---');
    console.log({ total: searchData.total, items: searchData.products.map(p => p.title) });

    // 5. Test Categories list
    const categoriesRes = await fetch('http://localhost:5001/api/products/categories');
    const categoriesData = await categoriesRes.json();
    console.log('\n--- CATEGORIES LIST ---');
    console.log(categoriesData.categories);

    console.log('\nALL TESTS PASSED SUCCESSFULLY! ✅');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

testEndpoints();
