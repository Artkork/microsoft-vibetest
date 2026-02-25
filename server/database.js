const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    sku TEXT UNIQUE NOT NULL
  )
`);

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, description, sku) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const products = [
    ['MacBook Pro 16"', 'Electronics', 2499.99, 15, 'Apple M3 Pro chip, 18GB RAM, 512GB SSD. Professional laptop for creatives and developers.', 'ELEC-MBP16-001'],
    ['Samsung 4K TV 55"', 'Electronics', 799.99, 8, '55-inch QLED 4K Smart TV with HDR10+ and built-in Alexa voice assistant.', 'ELEC-SAM55-002'],
    ['iPhone 15 Pro', 'Electronics', 999.99, 25, 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP main camera.', 'ELEC-IP15P-003'],
    ['AirPods Pro', 'Electronics', 249.99, 30, 'Active noise cancellation, adaptive transparency, and spatial audio for immersive sound.', 'ELEC-APP2-004'],
    ['Sony WH-1000XM5 Headphones', 'Electronics', 349.99, 20, 'Industry-leading noise cancellation with 30-hour battery life and multipoint connection.', 'ELEC-SONWH-005'],
    ['Nike Air Max 270', 'Clothing', 150.00, 45, 'Mens lifestyle shoe with Airs largest heel unit yet for all-day comfort.', 'CLTH-NAM270-006'],
    ["Levi's 501 Jeans", 'Clothing', 79.99, 60, 'The original straight fit jean. Button fly, sits at waist, straight through thigh and leg.', 'CLTH-LV501-007'],
    ['North Face Parka', 'Clothing', 299.99, 18, 'Waterproof and breathable DryVent shell with 550-fill down insulation for extreme cold.', 'CLTH-TNFP-008'],
    ['Adidas Running Shorts', 'Clothing', 35.00, 75, 'Lightweight running shorts with built-in briefs and reflective details for evening runs.', 'CLTH-ADRS-009'],
    ['Ray-Ban Sunglasses', 'Clothing', 175.00, 22, 'Classic Wayfarer style with UV400 protection lenses and acetate frame.', 'CLTH-RBSG-010'],
    ['Organic Coffee Beans 1kg', 'Food', 24.99, 100, 'Single-origin Arabica beans from Ethiopia. Medium roast with notes of berries and citrus.', 'FOOD-OCB1K-011'],
    ['Extra Virgin Olive Oil', 'Food', 18.99, 80, 'Cold-pressed extra virgin olive oil from Spanish olive groves. 750ml bottle.', 'FOOD-EVOO-012'],
    ['Premium Chocolate Box', 'Food', 45.00, 50, 'Assorted artisan chocolates from Belgium. 24-piece box with milk, dark, and white varieties.', 'FOOD-PCB24-013'],
    ['Himalayan Pink Salt', 'Food', 12.99, 120, 'Unrefined mineral-rich pink salt harvested from ancient sea beds. 500g resealable bag.', 'FOOD-HPS500-014'],
    ['Green Tea Collection', 'Food', 29.99, 65, 'Premium Japanese green teas including Sencha, Matcha, and Gyokuro. 30 individually wrapped sachets.', 'FOOD-GTC30-015'],
    ['Yoga Mat Premium', 'Sports', 89.99, 35, 'Non-slip 6mm thick TPE yoga mat with alignment lines and carrying strap. Eco-friendly material.', 'SPRT-YMP6-016'],
    ['Resistance Bands Set', 'Sports', 34.99, 55, 'Set of 5 resistance bands from 10-50 lbs. Includes door anchor, handles, and ankle straps.', 'SPRT-RBS5-017'],
    ['Kettlebell 20kg', 'Sports', 79.99, 12, 'Cast iron kettlebell with powder-coat finish for durability. Wide handle fits both hands.', 'SPRT-KB20-018'],
    ['Plant Pot Large Ceramic', 'Home & Garden', 49.99, 28, 'Hand-glazed ceramic planter with drainage hole and saucer. 30cm diameter, suitable for large plants.', 'HOME-PLC30-019'],
    ['LED Desk Lamp', 'Home & Garden', 59.99, 40, 'Adjustable color temperature (2700K-6500K) and brightness. USB-C charging port built in.', 'HOME-LEDDL-020'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

module.exports = db;
