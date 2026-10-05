import ProductCard from "./ProductCard";

function ProductList({ products, onAdd }) {
  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          onAdd={() => onAdd(product)}
        />
      ))}
    </div>
  );
}

export default ProductList;