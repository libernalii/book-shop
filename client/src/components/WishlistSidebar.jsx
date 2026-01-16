import { useWishlist } from '../context/WishlistContext';
import "../styles/WishlistSidebar.scss";

function WishlistSidebar() {
  const { wishlist, removeFromWishlist, isWishlistOpen, toggleWishlistOpen } = useWishlist();

  if (!isWishlistOpen) return null;

  return (
    <div className="wishlist-sidebar">
      <div className="wishlist-header">
        <h3>Вішліст</h3>
        <button onClick={() => toggleWishlistOpen(false)}>✖</button>
      </div>

      {wishlist.length === 0 ? (
        <p>Ваш вішліст порожній</p>
      ) : (
        <ul>
          {wishlist.map(item => (
            <li key={item.id}>
              {item.name} - {item.price} ₴
              <button onClick={() => removeFromWishlist(item.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistSidebar;
