const CATEGORY_BADGE = {
  'Consumer Drones':    'badge-consumer',
  'Professional Drones':'badge-professional',
  'FPV & Racing':       'badge-fpv',
  'Controllers':        'badge-controllers',
  'Batteries':          'badge-batteries',
  'Accessories':        'badge-accessories',
  'Parts & Components': 'badge-parts',
}

function qtyClass(qty) {
  if (qty === 0) return 'low'
  if (qty <= 10) return 'low'
  if (qty <= 25) return 'medium'
  return 'high'
}

export default function ProductCard({ product, onDelete, onQuantityChange }) {
  const { id, name, category, price, quantity, description, sku } = product
  const badgeClass = CATEGORY_BADGE[category] || 'badge-default'

  const handleDelete = () => {
    if (window.confirm(`Delete "${name}"?`)) onDelete(id)
  }

  return (
    <div className="product-card">
      <div className="card-header">
        <span className="card-title">{name}</span>
        <span className={`category-badge ${badgeClass}`}>{category}</span>
      </div>

      <div className="card-sku">SKU: {sku}</div>
      <div className="card-price">${Number(price).toFixed(2)}</div>

      {description && (
        <div className="card-description">{description}</div>
      )}

      <div className="card-footer">
        <div className="quantity-control">
          <span className="quantity-label">Qty</span>
          <button
            className="qty-btn"
            onClick={() => onQuantityChange(id, -1)}
            disabled={quantity <= 0}
            title="Decrease quantity"
          >−</button>
          <span className={`qty-value ${qtyClass(quantity)}`}>{quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onQuantityChange(id, 1)}
            title="Increase quantity"
          >＋</button>
        </div>

        <button className="btn-delete" onClick={handleDelete} title="Delete product">
          🗑 Delete
        </button>
      </div>
    </div>
  )
}
