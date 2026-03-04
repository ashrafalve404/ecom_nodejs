import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Product } from "../api";
import type { Order } from "../api";
import "./AdminDashboard.css";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStock: number;
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "", image: "" });
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, statsData] = await Promise.all([
        api.getProducts(),
        api.getAllOrders(),
        api.getStats(),
      ]);
      console.log("Products:", productsData);
      console.log("Orders:", ordersData);
      console.log("Stats:", statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }

      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
      setShowProductForm(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image || "",
    });
    setShowProductForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this product?")) {
      await api.deleteProduct(id);
      loadData();
    }
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    await api.updateOrderStatus(orderId, status);
    loadData();
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await api.deleteOrder(orderId);
      loadData();
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-icon">◆</span>
          <span>Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab("products")} className={activeTab === "products" ? "active" : ""}>
            Products
          </button>
          <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
            Orders
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>{activeTab === "products" ? "Products" : "Orders"}</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>

        {activeTab === "products" && (
          <>
            <div className="section-header">
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" }); }}>
                + Add Product
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleSubmit} className="product-form">
                <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                <div className="form-actions">
                  <button type="submit">{editingProduct ? "Update" : "Add"}</button>
                  <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>Cancel</button>
                </div>
              </form>
            )}

            {products.length === 0 ? (
              <p className="no-data">No products found</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td className={product.stock < 10 ? "low-stock" : ""}>{product.stock}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "orders" && (
          <>
            {orders.length === 0 ? (
              <p className="no-data">No orders found</p>
            ) : (
              <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.customer_name || order.user_name || "Guest"}</span>
                        <span className="customer-email">{order.customer_email || order.user_email || "-"}</span>
                      </div>
                    </td>
                    <td>{order.customer_phone || "-"}</td>
                    <td className="address-cell">{order.shipping_address || "-"}</td>
                    <td>
                      {order.items?.length || 0} item(s)
                      <div className="items-preview">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span key={idx}>{item.product_name} x{item.quantity}</span>
                        ))}
                        {order.items && order.items.length > 2 && <span>+{order.items.length - 2} more</span>}
                      </div>
                    </td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td>
                      <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`status-select ${order.status}`}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedOrder(order)}>View</button>
                      <button className="delete-btn" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}

            {orders.length > 0 && selectedOrder && (
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Order #{selectedOrder.id}</h2>
                    <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="order-info-section">
                      <h3>Customer Information</h3>
                      <p><strong>Name:</strong> {selectedOrder.customer_name || selectedOrder.user_name || "Guest"}</p>
                      <p><strong>Email:</strong> {selectedOrder.customer_email || selectedOrder.user_email || "-"}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customer_phone || "-"}</p>
                      <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address || "-"}</p>
                    </div>
                    <div className="order-info-section">
                      <h3>Order Status</h3>
                      <p><strong>Status:</strong> <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                      <p><strong>Date:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "-"}</p>
                      <p><strong>Last Updated:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString() : "-"}</p>
                    </div>
                    <div className="order-info-section">
                      <h3>Order Items</h3>
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items?.map((item) => (
                            <tr key={item.id}>
                              <td>{item.product_name}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3}><strong>Total</strong></td>
                            <td><strong>${selectedOrder.total?.toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
