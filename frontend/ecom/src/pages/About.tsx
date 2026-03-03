import { Link } from "react-router-dom";
import "./Page.css";

export function About() {
  return (
    <div className="page">
      <h1>About Us</h1>
      <p className="page-desc">
        Welcome to MINIMAL, your destination for minimalist lifestyle products. 
        We believe in the beauty of simplicity and the power of thoughtful design.
      </p>
      <div className="page-content">
        <h2>Our Story</h2>
        <p>
          Founded in 2024, MINIMAL started with a simple idea: great products don't need 
          to be complicated. We curate the finest minimalist products across electronics, 
          clothing, home goods, and accessories.
        </p>
        <h2>Our Mission</h2>
        <p>
          To provide our customers with high-quality, thoughtfully designed products 
          that enhance everyday life without unnecessary complexity.
        </p>
        <h2>Contact Us</h2>
        <p>
          Have questions? We'd love to hear from you.<br />
          Email: support@minimal.com<br />
          Phone: +1 (555) 123-4567
        </p>
      </div>
      <Link to="/" className="back-link">← Back to Shop</Link>
    </div>
  );
}
