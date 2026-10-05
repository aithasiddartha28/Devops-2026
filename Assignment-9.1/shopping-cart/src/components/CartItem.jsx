function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <div>
      <h3>{item.name}</h3>

      <p>Price: ₹{item.price}</p>

      <p>Quantity: {item.quantity}</p>

      <button onClick={() => onDecrease(item.id)}>
        -
      </button>

      <button onClick={() => onIncrease(item.id)}>
        +
      </button>

      <button onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </div>
  );
}

export default CartItem;