import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Heart, Menu, X, Search } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useFilter } from '../context/FilterContext';

import '../styles/Header.scss';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleCartOpen } = useCart();
  const { toggleWishlistOpen } = useWishlist();
  const { searchTerm, setSearchTerm } = useFilter(); // підключення фільтрів

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">BookShop</Link>

          <div className="search-box desktop-only">
            <input
              type="text"
              placeholder="Пошук книги..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} />
          </div>

          <nav className="desktop-nav desktop-only">
            <Link to="/catalog">Каталог</Link> {/* <-- змінили посилання на CatalogPage */}

            <button className="icon-btn" onClick={toggleWishlistOpen}>
              <Heart size={20} />
            </button>

            <button className="icon-btn" onClick={toggleCartOpen}>
              <ShoppingCart size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile"><User size={18} /> Профіль</Link>
                {user?.role === 'admin' && <Link to="/admin"><LayoutDashboard size={18} /> Адмін</Link>}
                <button className="icon-btn" onClick={logout}><LogOut size={18} /></button>
              </>
            ) : (
              <>
                <Link to="/login">Вхід</Link>
                <Link to="/register">Реєстрація</Link>
              </>
            )}
          </nav>

          <div className="mobile-icons mobile-only">
            <button className="icon-btn" onClick={() => setMobileSearchOpen(true)}><Search size={20} /></button>
            <button className="icon-btn" onClick={toggleWishlistOpen}><Heart size={20} /></button>
            <button className="icon-btn" onClick={toggleCartOpen}><ShoppingCart size={20} /></button>
            <button className="icon-btn" onClick={() => setMobileMenuOpen(prev => !prev)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu mobile-only">
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Каталог</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Профіль</Link>
                {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Адмін</Link>}
                <button onClick={logout}>Вийти</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Вхід</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Реєстрація</Link>
              </>
            )}
          </div>
        )}
      </header>

      {mobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-box">
            <input
              type="text"
              placeholder="Пошук книги..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button onClick={() => setMobileSearchOpen(false)}><X /></button>
          </div>
        </div>
      )}

      <main>
        <Outlet /> {/* Тут будуть відображатися сторінки, включаючи CatalogPage */}
      </main>
    </div>
  );
}

export default Layout;
