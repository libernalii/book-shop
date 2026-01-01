import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, ShoppingBag } from 'lucide-react';
import '../../styles/AdminLayout.scss';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin</h2>

        <nav className="admin-nav">
          <NavLink to="categories" className="admin-link">
            <Tags size={18} />
            Категорії
          </NavLink>

          <NavLink to="products" className="admin-link">
            <BookOpen size={18} />
            Товари
          </NavLink>

          <NavLink to="orders" className="admin-link">
            <ShoppingBag size={18} />
            Замовлення
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <section className="admin-content">
        <header className="admin-header">
          <LayoutDashboard size={20} />
          <h1>Панель адміністратора</h1>
        </header>

        <div className="admin-page">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
