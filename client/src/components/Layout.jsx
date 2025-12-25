import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Heart, Search } from 'lucide-react';
import { useCartUI } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import "../styles/Header.scss";

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleCart } = useCartUI();
  const { toggleWishlist } = useWishlist();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="text-link logo">BookShop</Link>

          <div className="search-box">
            <input type="text" placeholder="Пошук книг..." />
            <Search size={18} />
          </div>

          <nav>
            <Link to="/" className="text-link catalog-link">Каталог</Link>
            <button className="icon-btn" onClick={toggleWishlist}><Heart size={20} /></button>
            <button className="icon-btn" onClick={toggleCart}><ShoppingCart size={20} /></button>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-link"><User size={20} /> Профіль</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-link"><LayoutDashboard size={20} /> Адмін</Link>
                )}
                <button className="icon-btn" onClick={logout}><LogOut size={20} /></button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-link">Вхід</Link>
                <Link to="/register" className="text-link">Реєстрація</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <CartSidebar />
      <WishlistSidebar />
    </div>
  );
}

export default Layout;
