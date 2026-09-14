import { useState, useEffect } from "react";
import { Button, Spin, Empty, message } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../../../Contexts/CartContext";
import { useWishlist } from "../../../Contexts/WishlistContext";
import api from "../../../Api/axiosInstance";

const WishlistComponent = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      const list = res.data?.wishlist || [];
      setWishlistItems(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      message.error("Failed to load your wishlist. Please try again.");
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

const handleRemove = async (productId) => {
    try {
      // Sirf context ka toggle call karo jo single source of truth hai
      await toggleWishlist(productId);
      message.success("Item removed from wishlist.");
      // Local state ko filter out kar do
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      message.error("Failed to remove item.",error);
    }
  };

  return (
    <div className="home-page" style={{ minHeight: "70vh" }}>
      <div className="products-section">
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <HeartFilled style={{ color: "#e53935", fontSize: 26 }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>
              My Wishlist
            </h2>
            <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: 13 }}>
              Your saved favorite vegetables and fresh produce
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <Empty description="Your wishlist is currently empty.">
            <Link to="/shop">
              <Button type="primary" style={{ backgroundColor: "#2e7d32", borderRadius: 8 }}>
                Explore Fresh Produce
              </Button>
            </Link>
          </Empty>
        ) : (
          <div className="products-grid">
            {wishlistItems.map((item) => {
              if (!item || !item._id) return null;

              return (
                <div className="product-card" key={item._id}>
                  <div className="image-container">
                    <img src={item.imageURL} alt={item.name} loading="lazy" />
                    <button
                      type="button"
                      className="wishlist-btn"
                      onClick={() => handleRemove(item._id)}
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <DeleteOutlined style={{ color: "#e53935" }} />
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="name-wrap">
                      <h3 className="en-name">{item.name}</h3>
                      <span className="ur-name">{item.urduName}</span>
                    </div>

                    <div className="price-wrap">
                      <span className="currency">Rs.</span>
                      <span className="price">{item.price}</span>
                      <span className="unit">/{item.unit || "kg"}</span>
                    </div>

                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      block
                      className="add-cart-btn"
                      onClick={() => {
                        addToCart(item);
                        message.success(`${item.name} added to cart!`);
                      }}
                    >
                      Move To Cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistComponent;