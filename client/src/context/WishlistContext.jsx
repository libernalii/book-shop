import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const storageKey = user ? `wishlist_${user._id}` : null;

  /* ========= LOAD FROM LOCALSTORAGE ========= */
  useEffect(() => {
    if (!storageKey) {
      setWishlist([]);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setWishlist(JSON.parse(stored));
    } else {
      setWishlist([]);
    }
  }, [storageKey]);

  /* ========= SAVE TO LOCALSTORAGE ========= */
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  }, [wishlist, storageKey]);

  /* ========= ACTIONS ========= */

  const addToWishlist = (book) => {
    if (!user) return;

    setWishlist(prev => {
      const exists = prev.find(item => item._id === book._id);
      if (exists) return prev;

      return [
        ...prev,
        {
          _id: book._id,
          name: book.name,
          price: book.price,
          image: book.image
        }
      ];
    });
  };

  const removeFromWishlist = (bookId) =>
    setWishlist(prev => prev.filter(item => item._id !== bookId));

  const toggleWishlist = (book) => {
    const exists = wishlist.find(item => item._id === book._id);
    if (exists) removeFromWishlist(book._id);
    else addToWishlist(book);
  };

  const isInWishlist = (bookId) =>
    wishlist.some(item => item._id === bookId);

  const toggleWishlistOpen = (state) =>
    setIsWishlistOpen(state !== undefined ? state : !isWishlistOpen);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      isWishlistOpen,
      toggleWishlistOpen
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
