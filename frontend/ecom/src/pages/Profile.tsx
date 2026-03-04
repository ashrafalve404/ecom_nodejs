import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Account Details</h2>
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Type</span>
              <span className="info-value">Customer</span>
            </div>
          </div>

          <div className="profile-section">
            <h2>Quick Links</h2>
            <Link to="/orders" className="profile-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 11V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v5"/>
                <path d="M16 11v6"/>
                <path d="M22 11h-2"/>
                <rect x="2" y="7" width="20" height="14" rx="2"/>
              </svg>
              <span>My Orders</span>
            </Link>
            <Link to="/cart" className="profile-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Shopping Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
