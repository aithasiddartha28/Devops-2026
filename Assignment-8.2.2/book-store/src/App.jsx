import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((currentCart) => [...currentCart, book]);
  };

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/books" element={<Books />} />

        <Route
          path="/books/:id"
          element={<BookDetails onAddToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} />}
        />

        <Route path="/about" element={<About />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;