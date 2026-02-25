import ProductCard from './ProductCard'

export default function ProductList({ products, onDelete, onQuantityChange }) {
  return (
    <div className="product-grid">
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>No products found</h3>
          <p>Try a different search term or add a new product.</p>
        </div>
      ) : (
        products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDelete}
            onQuantityChange={onQuantityChange}
          />
        ))
      )}
    </div>
  )
}
