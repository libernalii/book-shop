import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const addToWishlist = (book) => {
    if (!wishlist.find(item => item.id === book.id)) setWishlist(prev => [...prev, book]);
  };

  const removeFromWishlist = (bookId) => {
    setWishlist(prev => prev.filter(item => item.id !== bookId));
  };

  const toggleWishlist = (book) => {
    const exists = wishlist.find(item => item.id === book.id);
    if (exists) removeFromWishlist(book.id);
    else addToWishlist(book);
  };

  const isInWishlist = (bookId) => wishlist.some(item => item.id === bookId);

  const toggleWishlistOpen = (state) => {
    setIsWishlistOpen(state !== undefined ? state : !isWishlistOpen);
  };

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
