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

  const handleAddToCart = (e) => {
    e.stopPropagation(); // ⬅️ щоб клік по кнопці не відкривав сторінку
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(book);
    toggleCartOpen(true);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation(); // ⬅️ щоб клік по кнопці не відкривав сторінку
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(book);
    toggleWishlistOpen(true);

    setHeartAnimation(true);
    setTimeout(() => setHeartAnimation(false), 300);
  };

  const goToProductPage = () => {
    navigate(`/products/${book._id}`);
  };

  return (
    <div className="book-card" onClick={goToProductPage}>
      <img src={book.image} alt={book.name} />
      <h3>{book.name}</h3>
      <p className="author">{book.author || 'Невідомо'}</p>
      <p className="price">{book.price} ₴</p>

      <div className="actions">
        <button
          className={`cart-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} /> {inCart ? 'У кошику' : 'Додати'}
        </button>

        <button
          className={`wishlist-btn ${isInWishlist(book._id) ? 'active' : ''} ${heartAnimation ? 'beat' : ''}`}
          onClick={handleToggleWishlist}
        >
          <Heart size={18} />
        </button>
      </div>
    </div>
  );
}

export default BookCard;
