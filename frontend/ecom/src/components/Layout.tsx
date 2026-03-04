import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export function Layout() {
  const { count } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link>
              <button onClick={handleLogout} className="auth-btn">Logout</button>
            </>
          ) : (
            <Link to="/signin" className="auth-btn">Sign In</Link>
          )}
          <button onClick={() => navigate("/admin")} className="admin-btn">Admin</button>
        </nav>
      </header>
      <main className="main"><Outlet /></main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">MINIMAL</span>
            </div>
            <p className="footer-desc">Your destination for minimalist lifestyle products. Quality craftsmanship meets modern design.</p>
          </div>
          <div className="footer-section">
            <h4>Shop</h4>
            <Link to="/">All Products</Link>
            <Link to="/">New Arrivals</Link>
            <Link to="/">Best Sellers</Link>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/orders">Order Status</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Minimal E-Commerce. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">f</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
