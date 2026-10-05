import CartItem from "./CartItem";

function Cart({ cart, onIncrease, onDecrease, onRemove }) {
  return (
    <div>
      <h2>Shopping Cart</h2>

      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default Cart;