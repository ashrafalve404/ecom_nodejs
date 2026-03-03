import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Product, type Order } from "../api";
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
    try {
      const [productsData, ordersData, statsData] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getStats(),
      ]);
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
          </>
        )}

        {activeTab === "orders" && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
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
                  <td>{order.customer_name || "Guest"}</td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`status-select ${order.status}`}>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.items_summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
