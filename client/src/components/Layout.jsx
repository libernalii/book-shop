import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  Menu,
  X,
  Search,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCartUI } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import '../styles/Header.scss';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleCart } = useCartUI();
  const { toggleWishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="container">

          {/* LOGO */}
          <Link to="/" className="logo">
            BookShop
          </Link>

          {/* SEARCH — DESKTOP */}
          <div className="search-box desktop-only">
            <input type="text" placeholder="Пошук книги..." />
            <Search size={18} />
          </div>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav desktop-only">
            <Link to="/">Каталог</Link>

            <button className="icon-btn" onClick={toggleWishlist}>
              <Heart size={20} />
            </button>

            <button className="icon-btn" onClick={toggleCart}>
              <ShoppingCart size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <User size={18} /> Профіль
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <LayoutDashboard size={18} /> Адмін
                  </Link>
                )}

                <button className="icon-btn" onClick={logout}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Вхід</Link>
                <Link to="/register">Реєстрація</Link>
              </>
            )}
          </nav>

          {/* MOBILE ICONS */}
          <div className="mobile-icons mobile-only">
            <button
              className="icon-btn"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            <button className="icon-btn" onClick={toggleWishlist}>
              <Heart size={20} />
            </button>

            <button className="icon-btn" onClick={toggleCart}>
              <ShoppingCart size={20} />
            </button>

            <button
              className="icon-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU (DROPDOWN) */}
        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Каталог
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Профіль
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    Адмін
                  </Link>
                )}

                <button onClick={logout}>Вийти</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Вхід
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-box">
            <input
              type="text"
              placeholder="Пошук книги..."
              autoFocus
            />
            <button onClick={() => setMobileSearchOpen(false)}>
              <X />
            </button>
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
