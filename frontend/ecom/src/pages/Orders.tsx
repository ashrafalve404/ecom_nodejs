import { useState, useEffect } from "react";
import { api, type Order } from "../api";
import "./Orders.css";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">◇</div>
        <h2>No orders yet</h2>
        <p>Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.id}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="order-body">
              <p className="order-items">{order.items_summary || "No items"}</p>
              <p className="order-total">${order.total?.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
