import { useCart } from '../context/CartContext';
import "../styles/CartSidebar.scss";

const CartSidebar = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, toggleCartOpen } = useCart();

  if (!isCartOpen) return null;

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Кошик</h3>
        <button onClick={toggleCartOpen}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <p>Ваш кошик порожній</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map(item => (
              <li key={item.id}>
                <span>{item.title}</span>
                <span>{item.price} ₴ x {item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}>Видалити</button>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <strong>Загальна сума: {totalPrice} ₴</strong>
            <button className="checkout-btn" onClick={clearCart}>Очистити кошик</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
