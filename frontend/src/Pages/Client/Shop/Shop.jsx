import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input, Select, Spin, Empty, Button, message } from "antd";
import {
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useCart } from "../../../Contexts/CartContext";
import { useWishlist } from "../../../Contexts/WishlistContext";
import { useAuth } from "../../../Contexts/AuthContext";
import api from "../../../Api/axiosInstance";

const { Option } = Select;

const ShopLink = () => {
  const [searchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchTerm);
  const [sortBy, setSortBy] = useState("default");

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { token } = useAuth();

  // 1. Fetch live products from backend
  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/product");
        const data =
          res.data?.products || res.data?.data || res.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Shop fetch error:", error);
        message.error("Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopProducts();
  }, []);

  // 2. Sync search input with Navbar URL query parameter
  useEffect(() => {
    setSearchQuery(urlSearchTerm);
  }, [urlSearchTerm]);

  const isWishlisted = (id) =>
    wishlistItems.some((w) => (w._id || w.product?._id || w) === id);

  // 3. Multi-field search & sort filter
  const filteredProducts = products
    .filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        (item.urduName && item.urduName.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "lowToHigh") return a.price - b.price;
      if (sortBy === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="home-page shop-page" style={{ minHeight: "75vh", marginTop: 20 }}>
      {/* Search & Filter Header Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          background: "#ffffff",
          padding: 20,
          borderRadius: 14,
          border: "1px solid #edf2f7",
          marginBottom: 30,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>
            Fresh Produce Market
          </h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
            Direct mandi procurement with guaranteed morning harvest quality
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: 420 }}>
          <Input
            placeholder="Search produce..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchQuery}
            allowClear
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: 160, borderRadius: 8, height: 40 }}
          />

          <Select
            value={sortBy}
            style={{ width: 170, height: 40 }}
            onChange={(val) => setSortBy(val)}
          >
            <Option value="default">Sort by: Featured</Option>
            <Option value="lowToHigh">Price: Low to High</Option>
            <Option value="highToLow">Price: High to Low</Option>
          </Select>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Empty description="No vegetables matched your search criteria." />
      ) : (
        <div className="products-grid">
          {filteredProducts.map((item) => {
            const active = isWishlisted(item._id);

            return (
              <div className="product-card" key={item._id}>
                <div className="image-container">
                  <img src={item.imageURL} alt={item.name} loading="lazy" />
                  <button
                    type="button"
                    className="wishlist-btn"
                    aria-label="Toggle Wishlist"
                    onClick={() => {
                      if (!token) {
                        message.warning("Please sign in to save items to your wishlist.");
                        return;
                      }
                      toggleWishlist(item._id);
                    }}
                  >
                    {active ? (
                      <HeartFilled style={{ color: "#e53935" }} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </button>
                  {item.stockQuantity <= 3 && (
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
    </div>
  );
};

export default ShopLink;