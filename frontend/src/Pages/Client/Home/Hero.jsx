import { useState, useEffect } from "react";
import { Button, Spin, Empty, message } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useCart } from "../../../Contexts/CartContext";
import { useAuth } from "../../../Contexts/AuthContext";
import { useWishlist } from "../../../Contexts/WishlistContext";
import api from "../../../Api/axiosInstance";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { token } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/product");
        const prodData =
          res.data?.products || res.data?.data || res.data || [];
        setProducts(prodData);
      } catch (error) {
        console.error("Fetch products error:", error);
        message.error("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isWishlisted = (productId) => {
    if (!Array.isArray(wishlistItems)) return false;
    return wishlistItems.some((item) => {
      const id = item._id || item.product?._id || item.product || item;
      return id?.toString() === productId?.toString();
    });
  };

  const handleWishlistClick = async (productId) => {
    if (!token) {
      message.warning("Please sign in to manage your wishlist!");
      return;
    }
    await toggleWishlist(productId);
  };

  return (
    <div className="home-page home-page-reveal">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            From Farm Directly <span>To Your Doorstep</span>
          </h1>
          <p>
            100% fresh, organic produce at daily wholesale market rates. 
            Order early morning, enjoy same-day fresh delivery.
          </p>
          <div className="hero-actions">
            <Link to="/shop">
              <Button type="primary" size="large" className="shop-btn">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-banner">
        <div className="feature-item">
          <ThunderboltOutlined className="f-icon" />
          <div>
            <h4>Same-Day Delivery</h4>
            <p>Dispatched within 2 hours</p>
          </div>
        </div>
        <div className="feature-item">
          <SafetyCertificateOutlined className="f-icon" />
          <div>
            <h4>100% Organic</h4>
            <p>Naturally grown, chemical-free</p>
          </div>
        </div>
        <div className="feature-item">
          <DollarCircleOutlined className="f-icon" />
          <div>
            <h4>Wholesale Rates</h4>
            <p>Guaranteed authentic mandi pricing</p>
          </div>
        </div>
      </section>

      {/* Real Products Grid */}
      <section className="products-section">
        <div className="section-title">
          <h2>Fresh Produce</h2>
          <p>Direct daily stock from local farms</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products available at the moment. Please check back shortly!" />
        ) : (
          <div className="products-grid">
            {products.map((item) => {
              const active = isWishlisted(item._id);

              return (
                <div className="product-card" key={item._id}>
                  <div className="image-container">
                    <img src={item.imageURL} alt={item.name} loading="lazy" />
                    <button
                      type="button"
                      className="wishlist-btn"
                      onClick={() => handleWishlistClick(item._id)}
                      aria-label="Add to wishlist"
                    >
                      {active ? (
                        <HeartFilled style={{ color: "#e53935" }} />
                      ) : (
                        <HeartOutlined />
                      )}
                    </button>
                    {item.stockQuantity <= 5 && (
                      <span className="badge-stock">Low Stock</span>
                    )}
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
                      Add To Cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Hero;