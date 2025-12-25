import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../styles/BookCard.scss';

function BookCard({ book }) {
  const { toggleWishlist, isInWishlist, toggleWishlistOpen } = useWishlist();
  const { addToCart, cartItems, toggleCartOpen } = useCart();

  const inCart = cartItems.some(item => item._id === book._id);

  const handleAddToCart = () => {
    addToCart(book);
    toggleCartOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(book);
    toggleWishlistOpen(true);
  };

  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.price} ₴</p>

      <div className="actions">
        <button
          className={`wishlist-btn ${isInWishlist(book._id) ? 'active' : ''}`}
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
