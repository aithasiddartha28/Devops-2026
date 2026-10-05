function Summary({
  totalItems,
  totalPrice,
  discount,
  finalPrice,
  freeDelivery
}) {
  return (
    <div>
      <h2>Order Summary</h2>

      <p>Total Items: {totalItems}</p>

      <p>Total Price: ₹{totalPrice}</p>

      <p>Discount: ₹{discount}</p>

      <p>Final Price: ₹{finalPrice}</p>

      {freeDelivery ? (
        <p>Free Delivery</p>
      ) : (
        <p>Delivery Charges Apply</p>
      )}
    </div>
  );
}

export default Summary;