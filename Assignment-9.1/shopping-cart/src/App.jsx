
import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Summary from "./components/Summary";

function App() {

  // Product data
  const products = [
    {
      id: "P101",
      name: "Laptop",
      category: "Electronics",
      price: 60000
    },
    {
      id: "P102",
      name: "Headphones",
      category: "Electronics",
      price: 2000
    },
    {
      id: "P103",
      name: "Backpack",
      category: "Accessories",
      price: 1500
    }
  ];

  // Cart state
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Add product
  const handleAddToCart = (product) => {

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {

      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);

    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove product
  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };
  const clearCart = () => {
  setCart([]);
};
  const totalItems = cart.reduce(
  (total, item) => total + item.quantity,
  0
);

const totalPrice = cart.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const discount = totalPrice > 5000 ? totalPrice * 0.10 : 0;

const finalPrice = totalPrice - discount;

const freeDelivery = totalPrice > 2000;

  const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || product.category === category;

  return matchesSearch && matchesCategory;
});


  return (
    <div>

      <Header />

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Accessories">Accessories</option>
      </select>

      <ProductList
        products={filteredProducts}
        onAdd={handleAddToCart}
      />

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Cart
            cart={cart}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
          />

          <button onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
      <Summary
        totalItems={totalItems}
        totalPrice={totalPrice}
        discount={discount}
        finalPrice={finalPrice}
        freeDelivery={freeDelivery}
      />
    </div>
  );
}

export default App;