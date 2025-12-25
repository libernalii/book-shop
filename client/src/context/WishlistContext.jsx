import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [isWishlistOpen, setWishlistOpen] = useState(false);

    // Робота з масивом обраних
    const addToWishlist = (item) => {
        setWishlist(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
    };

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const toggleWishlist = (item) => {
        setWishlist(prev =>
            prev.find(i => i.id === item.id)
                ? prev.filter(i => i.id !== item.id)
                : [...prev, item]
        );
    };

    // Управління UI сайдбару
    const toggleWishlistUI = () => setWishlistOpen(prev => !prev);
    const openWishlist = () => setWishlistOpen(true);
    const closeWishlist = () => setWishlistOpen(false);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isWishlistOpen,
            toggleWishlistUI,
            openWishlist,
            closeWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
