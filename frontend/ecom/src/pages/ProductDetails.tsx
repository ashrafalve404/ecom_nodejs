import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, type Product } from "../api";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(Number(id));
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/" className="back-link">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/">{product.category}</Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-details-content">
          <div className="product-gallery">
            <div className="main-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="placeholder-image">◆</div>
              )}
            </div>
          </div>

          <div className="product-info-panel">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price">
              ${product.price.toFixed(2)}
            </div>

            <div className={`stock-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock > 0 ? (
                <>
                  <span className="stock-dot"></span>
                  {product.stock <= 5 ? `Only ${product.stock} left in stock` : "In Stock"}
                </>
              ) : (
                <>
                  <span className="stock-dot"></span>
                  Out of Stock
                </>
              )}
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="purchase-section">
              <div className="quantity-selector">
                <button 
                  className="qty-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {addedToCart ? "✓ Added to Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">SKU</span>
                <span className="meta-value">PROD-{product.id.toString().padStart(4, "0")}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{product.category}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="continue-shopping" onClick={() => navigate("/")}>
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
