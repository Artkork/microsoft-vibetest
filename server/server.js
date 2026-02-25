const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET all products (optional ?search= query)
app.get('/api/products', (req, res) => {
  const { search } = req.query;
  let products;
  if (search) {
    products = db.prepare(
      `SELECT * FROM products WHERE name LIKE ? OR category LIKE ? OR sku LIKE ? OR description LIKE ? ORDER BY id`
    ).all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    products = db.prepare('SELECT * FROM products ORDER BY id').all();
  }
  res.json(products);
});

// GET product by exact SKU (barcode lookup)
app.get('/api/products/barcode/:sku', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE sku = ?').get(req.params.sku);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST new product
app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, description, sku } = req.body;
  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price, quantity, sku' });
  }
  try {
    const result = db.prepare(
      'INSERT INTO products (name, category, price, quantity, description, sku) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, category, parseFloat(price), parseInt(quantity), description || '', sku);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PATCH update product
app.patch('/api/products/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const fields = { ...existing, ...req.body };
  try {
    db.prepare(
      'UPDATE products SET name=?, category=?, price=?, quantity=?, description=?, sku=? WHERE id=?'
    ).run(fields.name, fields.category, parseFloat(fields.price), parseInt(fields.quantity), fields.description, fields.sku, req.params.id);
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted', id: parseInt(req.params.id) });
});

app.listen(PORT, () => {
  console.log(`Inventory server running on http://localhost:${PORT}`);
});
