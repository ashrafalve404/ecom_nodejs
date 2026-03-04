import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import "./Cart.css";

export function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: "/cart" } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map((item) => ({ productId: item.product.id, quantity: item.quantity }));
      await api.createOrder({ items: orderItems, ...customerInfo });
      clearCart();
      navigate("/orders");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">◇</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product.id} className="cart-item">
              <div className="item-image">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} />
                ) : (
                  <div className="placeholder">◆</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
              </div>
              <p className="item-total">${(item.product.price * item.quantity).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}>×</button>
            </div>
          ))}
        </div>

        <div className="checkout-form">
          <h2>Checkout</h2>
          <div className="summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout}>
            <input
              type="text"
              placeholder="Your Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              required
            />
            <textarea
              placeholder="Shipping Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading} className="checkout-btn">
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
