import { Link } from "react-router-dom";
import "./Page.css";

export function Privacy() {
  return (
    <div className="page">
      <h1>Privacy Policy</h1>
      <div className="page-content">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, including name, email address, 
          shipping address, and payment information when you place an order.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to process your orders, communicate with you 
          about your purchases, and improve our services.
        </p>
        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to 
          outside parties except as necessary to complete your order.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at 
          privacy@minimal.com
        </p>
      </div>
      <Link to="/" className="back-link">← Back to Shop</Link>
    </div>
  );
}
