import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCartUI } from '../context/CartContext';
import CartSidebar from './CartSidebar';

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleCart } = useCartUI();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">BookShop</Link>
          <nav>
            <Link to="/">Каталог</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile"><User size={20} /> Профіль</Link>
                {user?.role === 'admin' && <Link to="/admin"><LayoutDashboard size={20} /> Адмін</Link>}
                <button onClick={toggleCart}><ShoppingCart size={20} /></button>
                <button onClick={logout}><LogOut size={20} /></button>
              </>
            ) : (
              <>
                <button onClick={toggleCart}><ShoppingCart size={20} /></button>
                <Link to="/login">Вхід</Link>
                <Link to="/register">Реєстрація</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <CartSidebar />
    </div>
  );
}

export default Layout;
