import { useState } from 'react'

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Sports', 'Home & Garden', 'Other']

const EMPTY = { name: '', category: 'Electronics', sku: '', price: '', quantity: '', description: '' }

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required'
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) e.quantity = 'Valid quantity required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    setApiError(null)
    try {
      await onAdd({
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity)
      })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="modal-close" onClick={onClose} title="Close">✕</button>
        </div>

        {apiError && <div className="error-banner" style={{ marginBottom: '1rem' }}>⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="pname">Product Name</label>
              <input
                id="pname"
                type="text"
                placeholder="e.g. Wireless Keyboard"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pcat">Category</label>
              <select id="pcat" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="psku">SKU</label>
              <input
                id="psku"
                type="text"
                placeholder="e.g. ELEC-WKB-021"
                value={form.sku}
                onChange={e => set('sku', e.target.value)}
                className={errors.sku ? 'error' : ''}
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pprice">Price ($)</label>
              <input
                id="pprice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pqty">Quantity</label>
              <input
                id="pqty"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="pdesc">Description</label>
              <textarea
                id="pdesc"
                placeholder="Optional product description…"
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
