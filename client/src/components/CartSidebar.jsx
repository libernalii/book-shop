import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import '../styles/CartSidebar.scss';

const CartSidebar = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isCartOpen,
    toggleCartOpen
  } = useCart();

  if (!isCartOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Кошик</h3>
        <button onClick={() => toggleCartOpen(false)}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty">Ваш кошик порожній</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map(item => (
              <li key={item._id} className="cart-item">
                <div className="info">
                  <span className="title">{item.name}</span>
                  <span className="price">{item.price} ₴</span>
                </div>

                <div className="quantity">
                  <button onClick={() => decreaseQuantity(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>

                <button
                  className="remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <strong>Разом: {totalPrice} ₴</strong>

            <div className="actions">
              <button onClick={clearCart}>Очистити</button>
              <Link to="/checkout" onClick={() => toggleCartOpen(false)}>
                <button className="checkout-btn">
                  Оформити замовлення
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
