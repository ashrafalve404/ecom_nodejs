import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Layout.css";

export function Layout() {
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return <Outlet />;

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">MINIMAL</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Shop</Link>
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
            Cart ({count})
          </Link>
          <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>Orders</Link>
          <button onClick={() => navigate("/admin")} className="admin-btn">Admin</button>
        </nav>
      </header>
      <main className="main"><Outlet /></main>
      <footer className="footer">
        <p>© 2024 Minimal E-Commerce. All rights reserved.</p>
      </footer>
    </div>
  );
}
