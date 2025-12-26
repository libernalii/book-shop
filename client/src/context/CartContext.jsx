import { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user } = useAuth();

  // 🔹 Синхронізація кошика з сервером при логіні
  useEffect(() => {
    if (user && cartItems.length > 0) {
      cartAPI.sync(
        cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity
        }))
      )
      .then(res => {
        // Перетворюємо відповідь сервера на формат фронтенду
        setCartItems(
          res.data.items.map(i => ({
            _id: i.product._id,
            title: i.product.name,
            price: i.product.finalPrice ?? i.product.price,
            image: i.product.image,
            quantity: i.quantity
          }))
        );
      })
      .catch(err => console.error('Cart sync error', err));
    }
  }, [user]);

  // 🔹 Завантаження з localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // 🔹 Збереження в localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔹 Додати товар
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          title: product.name,
          price: product.finalPrice ?? product.price,
          image: product.image,
          quantity: 1
        }
      ];
    });
  };

  // 🔹 Видалити товар
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  // 🔹 Збільшити кількість
  const increaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 🔹 Зменшити кількість
  const decreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // 🔹 Очистити кошик
  const clearCart = () => setCartItems([]);

  // 🔹 Відкрити / закрити кошик
  const toggleCartOpen = (state) => {
    setIsCartOpen(state !== undefined ? state : !isCartOpen);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      isCartOpen,
      toggleCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
