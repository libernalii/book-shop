import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  const syncedRef = useRef(false); // 🔒 щоб sync був 1 раз

  /* ========= LOAD FROM LOCALSTORAGE ========= */
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  /* ========= SAVE TO LOCALSTORAGE ========= */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /* ========= SYNC AFTER LOGIN ========= */
  useEffect(() => {
  if (!user || syncedRef.current || cartItems.length === 0) return;

  syncedRef.current = true;

  cartAPI.sync(
    cartItems.map(item => ({
      product: item._id,
      quantity: item.quantity
    }))
  )
    .then(res => {
      setCartItems(
        res.data.items.map(i => ({
          _id: i.product._id,
          name: i.product.name,
          price: i.product.finalPrice ?? i.product.price,
          image: i.product.image,
          quantity: i.quantity
        }))
      );
    })
    .catch(console.error);

}, [user, cartItems]);



  /* ========= ACTIONS ========= */

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
          name: product.name,
          price: product.finalPrice ?? product.price,
          image: product.image,
          quantity: 1
        }
      ];
    });
  };



  const removeFromCart = (id) =>
    setCartItems(prev => prev.filter(i => i._id !== id));

  const increaseQuantity = (id) =>
    setCartItems(prev =>
      prev.map(i =>
        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  const decreaseQuantity = (id) =>
    setCartItems(prev =>
      prev
        .map(i =>
          i._id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );

  const clearCart = () => setCartItems([]);

  const toggleCartOpen = (state) =>
    setIsCartOpen(state !== undefined ? state : !isCartOpen);

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
