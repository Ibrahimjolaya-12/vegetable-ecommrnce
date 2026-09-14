// // import { useState } from "react";
// // import { Layout, Menu, Button, Drawer } from "antd";
// // import {
// //   DashboardOutlined,
// //   ShoppingOutlined,
// //   PlusCircleOutlined,
// //   OrderedListOutlined,
// //   ShopOutlined,
// //   LogoutOutlined,
// //   MenuOutlined,
// //   CloseOutlined,
// //   UserOutlined,
// // } from "@ant-design/icons";
// // import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
// // import { useAuth } from "../../Contexts/AuthContext";

// // const { Header, Sider, Content } = Layout;

// // // 1. SidebarContent ko component ke bahar nikal diya (No ESLint / React Render Errors)
// // const SidebarContent = ({
// //   collapsed,
// //   isMobile = false,
// //   user,
// //   pathname,
// //   onMenuClick,
// //   onCloseDrawer,
// //   onLogout,
// // }) => {
// //   const menuItems = [
// //     {
// //       key: "/dashboard",
// //       icon: <DashboardOutlined className="menu-icon" />,
// //       label: "Overview",
// //     },
// //     {
// //       key: "/dashboard/products",
// //       icon: <ShoppingOutlined className="menu-icon" />,
// //       label: "Manage Products",
// //     },
// //     {
// //       key: "/dashboard/add-product",
// //       icon: <PlusCircleOutlined className="menu-icon" />,
// //       label: "Add Product",
// //     },
// //     {
// //       key: "/dashboard/orders",
// //       icon: <OrderedListOutlined className="menu-icon" />,
// //       label: "Customer Orders",
// //     },
// //   ];

// //   return (
// //     <div className="clean-sidebar-container">
// //       {/* 1. Header Logo */}
// //       <div className="sidebar-brand-box">
// //         <Link to="/" className="brand-logo-link">
// //           <span className="brand-emoji">🥬</span>
// //           {(!collapsed || isMobile) && (
// //             <div className="brand-titles">
// //               <span className="brand-main">
// //                 Sabzi<span>Mandi</span>
// //               </span>
// //               <span className="brand-tag">ADMIN PORTAL</span>
// //             </div>
// //           )}
// //         </Link>
// //         {isMobile && (
// //           <button
// //             type="button"
// //             className="drawer-close-icon"
// //             onClick={onCloseDrawer}
// //           >
// //             <CloseOutlined />
// //           </button>
// //         )}
// //       </div>

// //       {/* 2. Admin User Info Card */}
// //       {(!collapsed || isMobile) && (
// //         <div className="admin-user-card">
// //           <div className="avatar-circle">
// //             <UserOutlined />
// //           </div>
// //           <div className="user-details">
// //             <span className="user-name-text">{user?.name || "Administrator"}</span>
// //             <span className="user-role-badge">Store Manager</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* 3. Navigation Links */}
// //       <div className="menu-scroll-box">
// //         <Menu
// //           theme="light"
// //           selectedKeys={[pathname]}
// //           mode="inline"
// //           items={menuItems}
// //           onClick={({ key }) => onMenuClick(key)}
// //           className="clean-admin-menu"
// //         />
// //       </div>

// //       {/* 4. Bottom Footer Actions */}
// //       <div className="sidebar-bottom-actions">
// //         <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
// //           <Button
// //             icon={<ShopOutlined />}
// //             block
// //             className="live-store-btn"
// //           >
// //             {(!collapsed || isMobile) && "Live Store"}
// //           </Button>
// //         </Link>
// //         <Button
// //           danger
// //           icon={<LogoutOutlined />}
// //           block
// //           onClick={onLogout}
// //           className="sign-out-btn"
// //         >
// //           {(!collapsed || isMobile) && "Sign Out"}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // };

// // const DashboardLayout = () => {
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { logout, user } = useAuth();

// //   const handleLogout = () => {
// //     logout();
// //     navigate("/auth/login");
// //   };

// //   const handleMenuClick = (key) => {
// //     navigate(key);
// //     setMobileDrawerOpen(false);
// //   };

// //   return (
// //     <Layout className="clean-admin-layout">
// //       {/* Desktop Sider */}
// //       <Sider
// //         collapsible
// //         collapsed={collapsed}
// //         onCollapse={(val) => setCollapsed(val)}
// //         theme="light"
// //         width={250}
// //         className="desktop-white-sider"
// //       >
// //         <SidebarContent
// //           collapsed={collapsed}
// //           isMobile={false}
// //           user={user}
// //           pathname={location.pathname}
// //           onMenuClick={handleMenuClick}
// //           onCloseDrawer={() => {}}
// //           onLogout={handleLogout}
// //         />
// //       </Sider>

// //       {/* Mobile Drawer */}
// //       <Drawer
// //         placement="left"
// //         onClose={() => setMobileDrawerOpen(false)}
// //         open={mobileDrawerOpen}
// //         closable={false}
// //         width={275}
// //         className="mobile-white-drawer"
// //       >
// //         <SidebarContent
// //           collapsed={false}
// //           isMobile={true}
// //           user={user}
// //           pathname={location.pathname}
// //           onMenuClick={handleMenuClick}
// //           onCloseDrawer={() => setMobileDrawerOpen(false)}
// //           onLogout={handleLogout}
// //         />
// //       </Drawer>

// //       {/* Main Workspace */}
// //       <Layout className="admin-workspace-body">
// //         <Header className="admin-top-navbar">
// //           <div className="nav-left-box">
// //             <Button
// //               type="text"
// //               icon={<MenuOutlined className="mobile-toggle-icon" />}
// //               onClick={() => setMobileDrawerOpen(true)}
// //               className="hamburger-btn"
// //               aria-label="Toggle Navigation"
// //             />
// //             <div className="nav-title-group">
// //               <span className="page-title">Admin Dashboard</span>
// //               <span className="page-desc">Live Produce Inventory</span>
// //             </div>
// //           </div>

// //           <div className="nav-right-user">
// //             <span className="active-dot" />
// //             <span className="nav-username">{user?.name || "Admin"}</span>
// //           </div>
// //         </Header>

// //         <Content className="admin-page-content">
// //           <Outlet />
// //         </Content>
// //       </Layout>
// //     </Layout>
// //   );
// // };

// // export default DashboardLayout;

// import { useState, useEffect } from "react";
// import { Layout, Menu, Button, Drawer, notification } from "antd";
// import {
//   DashboardOutlined,
//   ShoppingOutlined,
//   PlusCircleOutlined,
//   OrderedListOutlined,
//   ShopOutlined,
//   LogoutOutlined,
//   MenuOutlined,
//   CloseOutlined,
//   UserOutlined,
//   ShoppingCartOutlined,
// } from "@ant-design/icons";
// import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
// import { io } from "socket.io-client";
// import { useAuth } from "../../Contexts/AuthContext";

// const { Header, Sider, Content } = Layout;

// // 1. Sidebar Content Component
// const SidebarContent = ({
//   collapsed,
//   isMobile = false,
//   user,
//   pathname,
//   onMenuClick,
//   onCloseDrawer,
//   onLogout,
// }) => {
//   const menuItems = [
//     {
//       key: "/dashboard",
//       icon: <DashboardOutlined className="menu-icon" />,
//       label: "Overview",
//     },
//     {
//       key: "/dashboard/products",
//       icon: <ShoppingOutlined className="menu-icon" />,
//       label: "Manage Products",
//     },
//     {
//       key: "/dashboard/add-product",
//       icon: <PlusCircleOutlined className="menu-icon" />,
//       label: "Add Product",
//     },
//     {
//       key: "/dashboard/orders",
//       icon: <OrderedListOutlined className="menu-icon" />,
//       label: "Customer Orders",
//     },
//   ];

//   return (
//     <div className="clean-sidebar-container">
//       {/* Brand Header */}
//       <div className="sidebar-brand-box">
//         <Link to="/" className="brand-logo-link">
//           <span className="brand-emoji">🥬</span>
//           {(!collapsed || isMobile) && (
//             <div className="brand-titles">
//               <span className="brand-main">
//                 Sabzi<span>Mandi</span>
//               </span>
//               <span className="brand-tag">ADMIN PORTAL</span>
//             </div>
//           )}
//         </Link>
//         {isMobile && (
//           <button
//             type="button"
//             className="drawer-close-icon"
//             onClick={onCloseDrawer}
//           >
//             <CloseOutlined />
//           </button>
//         )}
//       </div>

//       {/* Admin Profile Details */}
//       {(!collapsed || isMobile) && (
//         <div className="admin-user-card">
//           <div className="avatar-circle">
//             <UserOutlined />
//           </div>
//           <div className="user-details">
//             <span className="user-name-text">{user?.name || "Administrator"}</span>
//             <span className="user-role-badge">Store Manager</span>
//           </div>
//         </div>
//       )}

//       {/* Navigation Menu */}
//       <div className="menu-scroll-box">
//         <Menu
//           theme="light"
//           selectedKeys={[pathname]}
//           mode="inline"
//           items={menuItems}
//           onClick={({ key }) => onMenuClick(key)}
//           className="clean-admin-menu"
//         />
//       </div>

//       {/* Bottom Actions */}
//       <div className="sidebar-bottom-actions">
//         <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
//           <Button
//             icon={<ShopOutlined />}
//             block
//             className="live-store-btn"
//           >
//             {(!collapsed || isMobile) && "Live Store"}
//           </Button>
//         </Link>
//         <Button
//           danger
//           icon={<LogoutOutlined />}
//           block
//           onClick={onLogout}
//           className="sign-out-btn"
//         >
//           {(!collapsed || isMobile) && "Sign Out"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// const DashboardLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

//   // Ant Design Notification Hook
//   const [notifyApi, contextHolder] = notification.useNotification();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { logout, user } = useAuth();

//   // Real-time Socket.io Notification Listener
//   useEffect(() => {
//     // Backend ka origin URL
//     const socket = io("https://vegetable-ecommrnce-backend.vercel.app", {
//       withCredentials: true,
//     });

//     // Admin room join karo
//     socket.emit("join-admin-room");

//     // Order generate hone par trigger
//     // Order generate hone par trigger
//     socket.on("new-order-received", (data) => {
//       // 1. Local Sound Play (Direct from public folder)
//       try {
//         const audio = new Audio("/notification.mp3");
//         audio.volume = 0.9;

//         const playPromise = audio.play();
//         if (playPromise !== undefined) {
//           playPromise.catch((error) => {
//             console.warn("Browser autoplay policy ne sound block kar di jab tak page par user interact na kare:", error);
//           });
//         }
//       } catch (err) {
//         console.error("Audio playback error:", err);
//       }

//       // 2. Interactive Admin Notification Popup
//       notifyApi.open({
//         message: <b style={{ color: "#2e7d32" }}>🚨 Naya Order Receive Hua!</b>,
//         description: (
//           <div style={{ marginTop: 4 }}>
//             <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>
//               <b>Customer:</b> {data.customerName} ({data.customerPhone || "N/A"})
//             </div>
//             <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
//               <b>Total Bill:</b> Rs. {data.totalAmount} ({data.itemsCount} Items)
//             </div>
//             <Button
//               type="primary"
//               size="small"
//               icon={<OrderedListOutlined />}
//               style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32", borderRadius: 6 }}
//               onClick={() => navigate("/dashboard/orders")}
//             >
//               Order View Karein
//             </Button>
//           </div>
//         ),
//         icon: <ShoppingCartOutlined style={{ color: "#2e7d32", fontSize: 22 }} />,
//         duration: 8,
//         placement: "topRight",
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [notifyApi, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate("/auth/login");
//   };

//   const handleMenuClick = (key) => {
//     navigate(key);
//     setMobileDrawerOpen(false);
//   };

//   return (
//     <Layout className="clean-admin-layout">
//       {/* Context Holder zaroori hai notifications render karne ke liye */}
//       {contextHolder}

//       {/* Desktop Sider */}
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(val) => setCollapsed(val)}
//         theme="light"
//         width={250}
//         className="desktop-white-sider"
//       >
//         <SidebarContent
//           collapsed={collapsed}
//           isMobile={false}
//           user={user}
//           pathname={location.pathname}
//           onMenuClick={handleMenuClick}
//           onCloseDrawer={() => {}}
//           onLogout={handleLogout}
//         />
//       </Sider>

//       {/* Mobile Drawer */}
//       <Drawer
//         placement="left"
//         onClose={() => setMobileDrawerOpen(false)}
//         open={mobileDrawerOpen}
//         closable={false}
//         width={275}
//         className="mobile-white-drawer"
//       >
//         <SidebarContent
//           collapsed={false}
//           isMobile={true}
//           user={user}
//           pathname={location.pathname}
//           onMenuClick={handleMenuClick}
//           onCloseDrawer={() => setMobileDrawerOpen(false)}
//           onLogout={handleLogout}
//         />
//       </Drawer>

//       {/* Main Workspace */}
//       <Layout className="admin-workspace-body">
//         <Header className="admin-top-navbar">
//           <div className="nav-left-box">
//             <Button
//               type="text"
//               icon={<MenuOutlined className="mobile-toggle-icon" />}
//               onClick={() => setMobileDrawerOpen(true)}
//               className="hamburger-btn"
//               aria-label="Toggle Navigation"
//             />
//             <div className="nav-title-group">
//               <span className="page-title">Admin Dashboard</span>
//               <span className="page-desc">Live Produce Inventory</span>
//             </div>
//           </div>

//           <div className="nav-right-user">
//             <span className="active-dot" />
//             <span className="nav-username">{user?.name || "Admin"}</span>
//           </div>
//         </Header>

//         <Content className="admin-page-content">
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default DashboardLayout;

import { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, notification } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  OrderedListOutlined,
  ShopOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../Contexts/AuthContext";

const { Header, Sider, Content } = Layout;

// 1. Sidebar Content Component
const SidebarContent = ({
  collapsed,
  isMobile = false,
  user,
  pathname,
  onMenuClick,
  onCloseDrawer,
  onLogout,
}) => {
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined className="menu-icon" />,
      label: "Overview",
    },
    {
      key: "/dashboard/products",
      icon: <ShoppingOutlined className="menu-icon" />,
      label: "Manage Products",
    },
    {
      key: "/dashboard/add-product",
      icon: <PlusCircleOutlined className="menu-icon" />,
      label: "Add Product",
    },
    {
      key: "/dashboard/orders",
      icon: <OrderedListOutlined className="menu-icon" />,
      label: "Customer Orders",
    },
  ];

  return (
    <div className="clean-sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <Link to="/" className="brand-logo-link">
          <span className="brand-emoji">🥬</span>
          {(!collapsed || isMobile) && (
            <div className="brand-titles">
              <span className="brand-main">
                Sabzi<span>Mandi</span>
              </span>
              <span className="brand-tag">ADMIN PORTAL</span>
            </div>
          )}
        </Link>
        {isMobile && (
          <button
            type="button"
            className="drawer-close-icon"
            onClick={onCloseDrawer}
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      {/* Admin Profile Details */}
      {(!collapsed || isMobile) && (
        <div className="admin-user-card">
          <div className="avatar-circle">
            <UserOutlined />
          </div>
          <div className="user-details">
            <span className="user-name-text">
              {user?.name || "Administrator"}
            </span>
            <span className="user-role-badge">Store Manager</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="menu-scroll-box">
        <Menu
          theme="light"
          selectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => onMenuClick(key)}
          className="clean-admin-menu"
        />
      </div>

      {/* Bottom Actions */}
      <div className="sidebar-bottom-actions">
        <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
          <Button icon={<ShopOutlined />} block className="live-store-btn">
            {(!collapsed || isMobile) && "Live Store"}
          </Button>
        </Link>
        <Button
          danger
          icon={<LogoutOutlined />}
          block
          onClick={onLogout}
          className="sign-out-btn"
        >
          {(!collapsed || isMobile) && "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Ant Design Notification Hook
  const [notifyApi, contextHolder] = notification.useNotification();

  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Real-time Socket.io Notification Listener
  useEffect(() => {
    // 1. Connection initialize
    const socket = io("https://vegetable-ecommrnce-backend.vercel.app", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // 2. Pure Web Audio API Chime (Bina kisi .mp3 file ke loud ding bell bajata hai)
    const playBellSound = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        // Do-tone Mandi Notification chime (D5 to A5)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.6,
        );

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch (err) {
        console.warn("Web Audio chime playback error:", err);
      }
    };

    // 3. Connection confirm hone ke BAAD room join karo
    socket.on("connect", () => {
      console.log("🟢 [Socket Connected] Admin Socket ID:", socket.id);
      socket.emit("join-admin-room");
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 [Socket Connection Error]:", err.message);
    });

    // 4. New Order Event Trigger
    // 4. New Order Event Trigger (English Notification)
    socket.on("new-order-received", (data) => {
      playBellSound();

      // Format: Sun, 13 Sep 2026 - 07:35 PM
      const orderDate = new Date(data.time || Date.now());
      const formattedTime = orderDate.toLocaleString("en-PK", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      notifyApi.open({
        message: (
          <b style={{ color: "#2e7d32", fontSize: 15 }}>
            🚨 New Order Received!
          </b>
        ),
        description: (
          <div style={{ marginTop: 4 }}>
            <div
              style={{
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              🕒 {formattedTime}
            </div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>
              <b>Customer:</b> {data.customerName || "Customer"} (
              {data.customerPhone || "N/A"})
            </div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 8 }}>
              <b>Total Amount:</b>{" "}
              <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                Rs. {data.totalAmount}
              </span>{" "}
              ({data.itemsCount} {data.itemsCount === 1 ? "Item" : "Items"})
            </div>
            <Button
              type="primary"
              size="small"
              icon={<OrderedListOutlined />}
              style={{
                backgroundColor: "#2e7d32",
                borderColor: "#2e7d32",
                borderRadius: 6,
              }}
              onClick={() => navigate("/dashboard/orders")}
            >
              View Order Details
            </Button>
          </div>
        ),
        icon: (
          <ShoppingCartOutlined style={{ color: "#2e7d32", fontSize: 24 }} />
        ),
        duration: 10,
        placement: "topRight",
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [notifyApi, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleMenuClick = (key) => {
    navigate(key);
    setMobileDrawerOpen(false);
  };

  return (
    <Layout className="clean-admin-layout">
      {/* Context Holder zaroori hai notification popup render karne ke liye */}
      {contextHolder}

      {/* Desktop Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        theme="light"
        width={250}
        className="desktop-white-sider"
      >
        <SidebarContent
          collapsed={collapsed}
          isMobile={false}
          user={user}
          pathname={location.pathname}
          onMenuClick={handleMenuClick}
          onCloseDrawer={() => {}}
          onLogout={handleLogout}
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        closable={false}
        width={275}
        className="mobile-white-drawer"
      >
        <SidebarContent
          collapsed={false}
          isMobile={true}
          user={user}
          pathname={location.pathname}
          onMenuClick={handleMenuClick}
          onCloseDrawer={() => setMobileDrawerOpen(false)}
          onLogout={handleLogout}
        />
      </Drawer>

      {/* Main Workspace */}
      <Layout className="admin-workspace-body">
        <Header className="admin-top-navbar">
          <div className="nav-left-box">
            <Button
              type="text"
              icon={<MenuOutlined className="mobile-toggle-icon" />}
              onClick={() => setMobileDrawerOpen(true)}
              className="hamburger-btn"
              aria-label="Toggle Navigation"
            />
            <div className="nav-title-group">
              <span className="page-title">Admin Dashboard</span>
              <span className="page-desc">Live Produce Inventory</span>
            </div>
          </div>

          <div className="nav-right-user">
            <span className="active-dot" />
            <span className="nav-username">{user?.name || "Admin"}</span>
          </div>
        </Header>

        <Content className="admin-page-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
