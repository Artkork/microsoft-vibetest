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
    ['DJI Mavic 3 Pro', 'Consumer Drones', 2199.99, 12, 'Triple-camera drone with Hasselblad main camera, 43-min flight time, and omnidirectional obstacle sensing.', 'CON-DJI-M3P-001'],
    ['DJI Mini 4 Pro', 'Consumer Drones', 759.99, 20, 'Under-249g foldable drone with 4K/60fps video, 34-min flight time, and obstacle avoidance.', 'CON-DJI-M4P-002'],
    ['DJI Air 3', 'Consumer Drones', 1099.99, 15, 'Dual-camera drone with wide-angle and medium tele lenses. 46-min flight time and APAS 5.0.', 'CON-DJI-AIR3-003'],
    ['Autel EVO Lite+', 'Consumer Drones', 899.99, 10, '6K CMOS sensor, 40-min flight time, and SkyLink transmission up to 12 km. Lightweight foldable design.', 'CON-AUT-EVOL-004'],
    ['DJI Phantom 4 RTK', 'Professional Drones', 5799.99, 5, 'Centimeter-level precise mapping drone with RTK module for surveying, mapping, and inspection.', 'PRO-DJI-P4RTK-005'],
    ['Autel EVO II Pro V3', 'Professional Drones', 1749.99, 8, '6K 1" CMOS sensor, adjustable aperture f/2.8-f/11, 42-min flight time for professional aerial photography.', 'PRO-AUT-EVO2P-006'],
    ['DJI Matrice 350 RTK', 'Professional Drones', 7399.99, 3, 'Enterprise-grade drone platform with IP55 rating, hot-swappable batteries, and 55-min flight time.', 'PRO-DJI-M350-007'],
    ['DJI Avata 2', 'FPV & Racing', 939.99, 14, 'Immersive FPV drone with 4K stabilized video, 23-min flight time, and beginner-friendly design.', 'FPV-DJI-AVT2-008'],
    ['iFlight Nazgul5 Evoque F5X', 'FPV & Racing', 299.99, 18, 'High-performance 5" FPV freestyle drone with F7 FC, 45A 4-in-1 ESC, and 2306.5 1900KV motors.', 'FPV-IFL-NAZ5-009'],
    ['BetaFPV Cetus X Kit', 'FPV & Racing', 199.99, 25, 'Ready-to-fly FPV kit for beginners. Includes drone, Lite Radio 3 transmitter, and VR02 goggles.', 'FPV-BFV-CETX-010'],
    ['DJI RC Pro Controller', 'Controllers', 699.99, 14, 'Bright 1000-nit display, built-in Android, 15 km transmission range. Compatible with Mavic 3 series.', 'CTR-DJI-RCPRO-011'],
    ['DJI RC 2 Controller', 'Controllers', 349.99, 22, '7-inch touchscreen controller with DJI O3+ transmission. Compatible with DJI Mini 4 Pro and Air 3.', 'CTR-DJI-RC2-012'],
    ['Radiomaster TX16S MKII', 'Controllers', 199.99, 30, 'Multi-protocol 16-channel radio transmitter with Hall gimbals, ELRS, and EdgeTX firmware support.', 'CTR-RDM-TX16S-013'],
    ['DJI Mavic 3 Intelligent Battery', 'Batteries', 169.99, 35, '5000 mAh intelligent flight battery for DJI Mavic 3 series. Provides up to 46 minutes of flight.', 'BAT-DJI-M3BAT-014'],
    ['DJI Mini 4 Pro Intelligent Battery', 'Batteries', 79.99, 40, '2590 mAh intelligent battery for Mini 4 Pro. Offers up to 34-minute flight time.', 'BAT-DJI-M4BAT-015'],
    ['Tattu Plus 4S 3300mAh 45C LiPo', 'Batteries', 49.99, 60, 'Smart LiPo battery with LED indicator and balance plug. Suitable for 5-inch freestyle and racing quads.', 'BAT-TAT-4S33-016'],
    ['DJI Mavic 3 ND Filter Set', 'Accessories', 79.99, 28, 'Set of 4 ND filters (ND64/128/256/512) for DJI Mavic 3 series. Optical glass with multi-layer coating.', 'ACC-DJI-NDSET-017'],
    ['Universal Drone Landing Pad 90cm', 'Accessories', 35.99, 32, 'Foldable waterproof landing pad with high-visibility markings. Compatible with all consumer drones.', 'ACC-UNI-LP90-018'],
    ['T-Motor F60 Pro IV 2550KV Motor', 'Parts & Components', 29.99, 45, 'High-performance brushless motor for 5-inch FPV drones. Stainless steel shaft, titanium screws.', 'PRT-TMT-F60P4-019'],
    ['Holybro Kakute H7 V2 Flight Controller', 'Parts & Components', 89.99, 20, 'H7 MCU at 480MHz, MPU6000 IMU, BMP280 barometer, 4x UARTs, OSD chip. Supports BLHeli_32.', 'PRT-HLB-KH7V2-020'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

module.exports = db;
