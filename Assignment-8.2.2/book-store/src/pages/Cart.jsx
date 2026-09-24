function Cart({ cart }) {
  return (
    <section className="page">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map((book) => (
            <div className="cart-item" key={book.id}>
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Price: ₹{book.price}</p>
            </div>
          ))}

          <h2>
            Total: ₹
            {cart.reduce((total, book) => total + book.price, 0)}
          </h2>
        </div>
      )}
    </section>
  );
}

export default Cart;