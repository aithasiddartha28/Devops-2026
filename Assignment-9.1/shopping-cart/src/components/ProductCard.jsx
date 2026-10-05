function ProductCard({ name, price, category, onAdd }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Category: {category}</p>
      <p>Price: ₹{price}</p>

      <button onClick={onAdd}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;