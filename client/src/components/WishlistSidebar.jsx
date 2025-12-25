import { useWishlist } from '../context/WishlistContext';
import "../styles/WishlistSidebar.scss";

function WishlistSidebar() {
    const { isWishlistOpen, closeWishlist, wishlist, removeFromWishlist } = useWishlist();

    if (!isWishlistOpen) return null;

    return (
        <div className="wishlist-sidebar">
            <div className="wishlist-header">
                <h3>Вішліст</h3>
                <button onClick={closeWishlist}>Закрити</button>
            </div>
            {wishlist.length === 0 ? (
                <p>Ваш вішліст порожній</p>
            ) : (
                <ul>
                    {wishlist.map(item => (
                        <li key={item.id}>
                            {item.name}
                            <button onClick={() => removeFromWishlist(item.id)}>Видалити</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default WishlistSidebar;
