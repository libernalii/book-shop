import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, LayoutDashboard, LogOut, X } from 'lucide-react';
import { useCartUI } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import "../styles/MobileMenu.scss";

function MobileMenu({ isOpen, onClose, categories }) {
    const { toggleCart } = useCartUI();
    const { toggleWishlist } = useWishlist();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            <div className="mobile-menu-header">
                <h2>Меню</h2>
                <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>

            <nav className="mobile-nav">
                <Link to="/" onClick={onClose}>Головна</Link>

                <div className="categories">
                    <h3>Категорії</h3>
                    {categories.map(cat => (
                        <Link key={cat._id} to={`/category/${cat.name}`} onClick={onClose}>{cat.name}</Link>
                    ))}
                </div>

                <div className="actions">
                    <button className="icon-btn" onClick={() => toggleWishlistOpen()}>
                        <Heart size={20} />
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </button>
                    <button className="icon-btn" onClick={toggleCartOpen}>
                        <ShoppingCart size={20} />
                        {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                    </button>
                </div>

                <div className="auth">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" onClick={onClose}><User size={20} /> Профіль</Link>
                            {user?.role === 'admin' && <Link to="/admin" onClick={onClose}><LayoutDashboard size={20} /> Адмін</Link>}
                            <button onClick={() => { logout(); onClose(); }}><LogOut size={20} /> Вийти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={onClose}>Вхід</Link>
                            <Link to="/register" onClick={onClose}>Реєстрація</Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default MobileMenu;
