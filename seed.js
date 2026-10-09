const fs = require('fs');
const path = require('path');
const db = require('./db/database');

function runSeed() {
  const seedFile = path.resolve(__dirname, 'seeds', 'products.json');
  if (!fs.existsSync(seedFile)) {
    console.error(`Seed file not found at: ${seedFile}`);
    process.exit(1);
  }

  const productsData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
  console.log(`Starting seed: Importing ${productsData.length} products into SQLite database...`);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO products (id, title, category, price, unit, inStock, image)
    VALUES (@id, @title, @category, @price, @unit, @inStock, @image)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertStmt.run({
        id: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        unit: item.unit,
        inStock: item.inStock ? 1 : 0,
        image: item.image || null
      });
    }
  });

  insertMany(productsData);

  const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  console.log(`Seeding complete! Total products in database: ${count}`);
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
