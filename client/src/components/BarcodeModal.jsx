import { useState, useRef, useEffect } from 'react'

export default function BarcodeModal({ onClose, onQuantityChange }) {
  const [barcode, setBarcode] = useState('')
  const [product, setProduct] = useState(null)
  const [amount, setAmount] = useState(1)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleScan = async (e) => {
    e.preventDefault()
    if (!barcode.trim()) return
    setLoading(true)
    setStatus(null)
    setProduct(null)
    try {
      const res = await fetch(`/api/products/barcode/${encodeURIComponent(barcode.trim())}`)
      if (!res.ok) {
        setStatus({ type: 'error', message: 'Product not found for this barcode.' })
        return
      }
      const data = await res.json()
      setProduct(data)
      setAmount(1)
    } catch {
      setStatus({ type: 'error', message: 'Failed to connect to server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdjust = async (delta) => {
    if (!product) return
    const qty = parseInt(amount) || 1
    try {
      await onQuantityChange(product.id, delta * qty)
      setStatus({
        type: 'success',
        message: `${delta > 0 ? 'Added' : 'Removed'} ${qty} unit${qty !== 1 ? 's' : ''} ${delta > 0 ? 'to' : 'from'} "${product.name}".`
      })
      setProduct(prev => ({ ...prev, quantity: Math.max(0, prev.quantity + delta * qty) }))
    } catch {
      setStatus({ type: 'error', message: 'Failed to update quantity.' })
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleNewScan = () => {
    setBarcode('')
    setProduct(null)
    setStatus(null)
    setAmount(1)
    inputRef.current?.focus()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>📦 Barcode Scanner</h2>
          <button className="modal-close" onClick={onClose} title="Close">✕</button>
        </div>

        <form onSubmit={handleScan} className="barcode-form">
          <div className="form-group full-width">
            <label htmlFor="barcode-input">Scan or enter barcode (SKU)</label>
            <div className="barcode-input-row">
              <input
                id="barcode-input"
                ref={inputRef}
                type="text"
                placeholder="e.g. CON-DJI-M3P-001"
                value={barcode}
                onChange={e => { setBarcode(e.target.value); setProduct(null); setStatus(null) }}
                className="barcode-input"
                autoComplete="off"
              />
              <button type="submit" className="btn-submit" disabled={loading || !barcode.trim()}>
                {loading ? '…' : 'Find'}
              </button>
            </div>
          </div>
        </form>

        {status && (
          <div className={`barcode-status barcode-status-${status.type}`}>
            {status.type === 'success' ? '✅' : '⚠️'} {status.message}
          </div>
        )}

        {product && (
          <div className="barcode-product">
            <div className="barcode-product-name">{product.name}</div>
            <div className="card-sku">SKU: {product.sku}</div>
            <div className="barcode-product-meta">
              <span className="card-price">${Number(product.price).toFixed(2)}</span>
              <span className={`barcode-stock qty-value ${product.quantity === 0 ? 'low' : product.quantity <= 10 ? 'low' : product.quantity <= 25 ? 'medium' : 'high'}`}>
                Stock: {product.quantity}
              </span>
            </div>

            <div className="barcode-adjust">
              <div className="form-group">
                <label htmlFor="barcode-amount">Amount</label>
                <input
                  id="barcode-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="barcode-amount-input"
                />
              </div>
              <div className="barcode-adjust-btns">
                <button
                  className="btn-barcode-add"
                  onClick={() => handleAdjust(1)}
                  title="Add to stock"
                >＋ Add to Stock</button>
                <button
                  className="btn-barcode-remove"
                  onClick={() => handleAdjust(-1)}
                  disabled={product.quantity <= 0}
                  title="Remove from stock"
                >− Remove from Stock</button>
              </div>
            </div>

            <div className="modal-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button type="button" className="btn-cancel" onClick={handleNewScan}>Scan Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
