import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from '../context/AuthContext';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Завантаження кошика з сервера після логіну
  useEffect(() => {
    if (user) {
      cartAPI.get()
        .then(res => setCartItems(res.data))
        .catch(() => setCartItems([]));
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (book) => {
    try {
      const exists = cartItems.find(item => item.id === book.id);
      if (exists) {
        await cartAPI.updateItem(book.id, { quantity: exists.quantity + 1 });
      } else {
        await cartAPI.addItem({ productId: book.id, quantity: 1 });
      }
      refreshCart();
    } catch (error) {
      console.error('Cart add error:', error);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await cartAPI.removeItem(bookId);
      refreshCart();
    } catch (error) {
      console.error('Cart remove error:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const toggleCartItem = (book) => {
    const exists = cartItems.find(item => item.id === book.id);
    if (exists) removeFromCart(book.id);
    else addToCart(book);
  };

  const refreshCart = () => {
    cartAPI.get().then(res => setCartItems(res.data)).catch(() => setCartItems([]));
  };

  const toggleCartOpen = (state) => {
    setIsCartOpen(state !== undefined ? state : !isCartOpen);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      toggleCartItem,
      refreshCart,
      isCartOpen,
      toggleCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
