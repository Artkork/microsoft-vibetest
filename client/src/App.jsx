import { useState, useEffect, useCallback } from 'react'
import ProductList from './components/ProductList'
import AddProductModal from './components/AddProductModal'
import BarcodeModal from './components/BarcodeModal'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)

  const fetchProducts = useCallback(async (q = '') => {
    try {
      setError(null)
      const url = q ? `/api/products?search=${encodeURIComponent(q)}` : '/api/products'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(search), 300)
    return () => clearTimeout(timer)
  }, [search, fetchProducts])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleQuantityChange = async (id, delta) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    const newQty = Math.max(0, product.quantity + delta)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddProduct = async (formData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to add product')
      }
      const newProduct = await res.json()
      setProducts(prev => [...prev, newProduct])
      setShowModal(false)
    } catch (err) {
      throw err
    }
  }

  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-icon">🚁</span>
            <div>
              <h1>SkyStore Inventory</h1>
              <p>Drone &amp; aerial equipment management</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{totalItems.toLocaleString()}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay">
          <h2 className="hero-title">Your Sky, Your Business</h2>
          <p className="hero-subtitle">Professional drone &amp; aerial equipment — managed in one place</p>
        </div>
      </section>

      <main className="main">
        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search products, categories, SKUs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-barcode" onClick={() => setShowBarcodeModal(true)}>
            <span>📦</span> Scan Barcode
          </button>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <span>＋</span> Add Product
          </button>
        </div>

        {!loading && (
          <p className="results-info">
            {products.length === 0
              ? 'No products found'
              : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        )}

        {loading ? (
          <div className="loading">⏳ Loading products…</div>
        ) : (
          <ProductList
            products={products}
            onDelete={handleDelete}
            onQuantityChange={handleQuantityChange}
          />
        )}
      </main>

      {showBarcodeModal && (
        <BarcodeModal
          onClose={() => setShowBarcodeModal(false)}
          onQuantityChange={handleQuantityChange}
        />
      )}

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </>
  )
}
