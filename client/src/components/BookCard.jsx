import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/BookCard.scss';

function BookCard({ book }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist, toggleWishlistOpen } = useWishlist();
  const { addToCart, cartItems, toggleCartOpen } = useCart();

  const [heartAnimation, setHeartAnimation] = useState(false);

  const inCart = cartItems.some(item => item._id === book._id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(book);
    toggleCartOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(book);
    toggleWishlistOpen(true);

    // Анімація «биття» сердечка
    setHeartAnimation(true);
    setTimeout(() => setHeartAnimation(false), 300);
  };

  const goToProductPage = () => {
    navigate(`/products/${book._id}`);
  };

  return (
    <div className="book-card">
      <img
        src={book.image}
        alt={book.title}
        onClick={goToProductPage}
        style={{ cursor: 'pointer' }}
      />
      <h3 onClick={goToProductPage} style={{ cursor: 'pointer' }}>
        {book.title}
      </h3>
      <p>{book.author}</p>
      <p>{book.price} ₴</p>

      <div className="actions">
        <button
          className={`wishlist-btn ${isInWishlist(book._id) ? 'active' : ''} ${heartAnimation ? 'beat' : ''}`}
          onClick={handleToggleWishlist}
        >
          <Heart size={16} />
        </button>

        <button
          className={`cart-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} /> {inCart ? 'У кошику' : 'Додати'}
        </button>
      </div>
    </div>
  );
}

export default BookCard;
