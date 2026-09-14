import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Dropdown } from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HomeOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../Contexts/AuthContext";
import { useCart } from "../../Contexts/CartContext";
import { useWishlist } from "../../Contexts/WishlistContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    setOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm("");
        setOpen(false);
      }
    }
  };

  const userMenuItems = [
    {
      key: "my-orders",
      label: (
        <Link to="/orders" className="text-decoration-none">
          My Orders
        </Link>
      ),
      icon: <ShoppingOutlined />,
    },
    ...(user?.role === "admin"
      ? [
          {
            key: "dashboard",
            label: (
              <Link to="/dashboard" className="text-decoration-none">
                Dashboard
              </Link>
            ),
            icon: <DashboardOutlined />,
          },
        ]
      : []),
    {
      key: "logout",
      label: <span onClick={handleLogout}>Logout</span>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <>
      <header
        className="custom-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#ffffff",
        }}
      >
        <div className="navbar-wrapper">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setOpen(false)}>
            <span className="logo-emoji">🥬</span>
            <span className="logo-title">
              Sabzi<span>Mandi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <nav className="links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
            </nav>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search sabzi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <SearchOutlined className="search-icon" onClick={handleSearch} />
            </div>

            <div className="action-icons">
              <Link to="/wishlist" className="icon-wrapper">
                <Badge count={wishlistCount} size="small">
                  <HeartOutlined className="ant-icon" />
                </Badge>
              </Link>

              <Link to="/cart" className="icon-wrapper">
                <Badge count={cartItems?.length || 0} size="small">
                  <ShoppingCartOutlined className="ant-icon" />
                </Badge>
              </Link>
            </div>

            {token ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button shape="circle" icon={<UserOutlined />} />
              </Dropdown>
            ) : (
              <Link to="/auth/login">
                <Button type="primary" className="login-pill-btn">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions: Cart + Hamburger */}
          <div className="mobile-right-actions">
            <Link to="/cart" className="mobile-cart-btn">
              <Badge count={cartItems?.length || 0} size="small">
                <ShoppingCartOutlined />
              </Badge>
            </Link>

            <button
              className="mobile-toggle-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              {open ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Card */}
        {open && (
          <div className="mobile-menu-drawer">
            {/* Search Box */}
            <div className="mobile-search-wrap">
              <input
                type="text"
                placeholder="Search sabzi, e.g. Tomato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button
                type="button"
                className="search-submit-btn"
                onClick={handleSearch}
              >
                <SearchOutlined />
              </button>
            </div>

            {/* Styled Menu Items */}
            <div className="mobile-links-list">
              <Link
                to="/"
                className="mobile-nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="item-left">
                  <HomeOutlined className="nav-icon" /> Home
                </span>
              </Link>

              <Link
                to="/shop"
                className="mobile-nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="item-left">
                  <ShopOutlined className="nav-icon" /> Shop Produce
                </span>
                <span className="pill-badge">Fresh</span>
              </Link>

              <Link
                to="/about"
                className="mobile-nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="item-left">
                  <InfoCircleOutlined className="nav-icon" /> About Us
                </span>
              </Link>

              <Link
                to="/wishlist"
                className="mobile-nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="item-left">
                  <HeartOutlined className="nav-icon" /> Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="count-pill">{wishlistCount}</span>
                )}
              </Link>

              <Link
                to="/cart"
                className="mobile-nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="item-left">
                  <ShoppingCartOutlined className="nav-icon" /> My Cart
                </span>
                <span className="count-pill count-cart">
                  {cartItems?.length || 0}
                </span>
              </Link>

              {/* My Orders link in mobile view */}
              {token && (
                <Link
                  to="/orders"
                  className="mobile-nav-item"
                  onClick={() => setOpen(false)}
                >
                  <span className="item-left">
                    <ShoppingOutlined className="nav-icon" /> My Orders
                  </span>
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="mobile-nav-item admin-link"
                  onClick={() => setOpen(false)}
                >
                  <span className="item-left">
                    <DashboardOutlined className="nav-icon" /> Admin Panel
                  </span>
                </Link>
              )}
            </div>

            {/* Action Bottom */}
            <div className="mobile-drawer-footer">
              {token ? (
                <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout ({user?.name || "Account"})
                </Button>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  style={{ width: "100%" }}
                >
                  <Button type="primary" block className="login-btn">
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Dim Backdrop when open */}
      {open && (
        <div className="navbar-backdrop" onClick={() => setOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
