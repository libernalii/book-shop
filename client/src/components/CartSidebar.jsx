import { useCartUI } from '../context/CartContext';
import "../styles/CartSidebar.scss";

const CartSidebar = () => {
  const { isCartOpen, closeCart } = useCartUI();

  // Тут поки просто мок-дані, потім підключимо CartContext для реальних товарів
  const cartItems = [
    { id: 1, name: "Book 1", price: 15 },
    { id: 2, name: "Book 2", price: 20 },
  ];

  if (!isCartOpen) return null;

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Корзина</h3>
        <button onClick={closeCart}>✖</button>
      </div>
      <ul className="cart-items">
        {cartItems.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <strong>Загальна сума: ${cartItems.reduce((acc, item) => acc + item.price, 0)}</strong>
        <button className="checkout-btn">Перейти до оплати</button>
      </div>
    </div>
  );
};

export default CartSidebar;
