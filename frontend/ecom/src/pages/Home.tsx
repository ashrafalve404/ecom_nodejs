import { useState, useEffect } from "react";
import { api, type Product } from "../api";
import { useCart } from "../context/CartContext";
import "./Home.css";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedCategory, search]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching products...");
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts({ category: selectedCategory || undefined, search: search || undefined }),
        api.getCategories(),
      ]);
      console.log("Products received:", productsData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Failed to load:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <div className="filters">
        <div className="category-tabs">
          <button className={selectedCategory === "" ? "active" : ""} onClick={() => setSelectedCategory("")}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat} className={selectedCategory === cat ? "active" : ""} onClick={() => setSelectedCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <p style={{marginBottom: '1rem', color: '#666'}}>Products count: {products.length}</p>

      {products.length === 0 ? (
        <div className="empty">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="placeholder-image">◆</div>
                )}
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button
                  className="add-btn"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
