import { useState, useEffect, useRef } from "react";
import { Button, Spin, Modal, Popconfirm, message } from "antd";
import {
  FileTextOutlined,
  ReloadOutlined,
  CheckCircleFilled,
  DownloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import { useAuth } from "../../../Contexts/AuthContext";
import { VEGETABLE_PRESETS } from "../../../Data/vegetablePresets";
import api from "../../../Api/axiosInstance";

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const receiptRef = useRef(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/my-orders");
      const data = res.data?.orders || res.data?.data || res.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Fetch client orders error:", error);
      message.error("Failed to load your orders history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }
    fetchMyOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/order/${orderId}/cancel`);
      if (res.data?.success) {
        message.success("Order has been cancelled successfully.");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: "cancelled" }));
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to cancel order.");
    } finally {
      setActionLoading(false);
    }
  };

  const getProduceImage = (item) => {
    const prod = typeof item.product === "object" && item.product !== null ? item.product : {};
    const directImage = item.imageURL || prod.imageURL || item.image || prod.image;
    if (directImage && directImage.trim() !== "") return directImage;

    const targetName = (prod.name || item.name || "").trim().toLowerCase();
    if (targetName && Array.isArray(VEGETABLE_PRESETS)) {
      const matchedPreset = VEGETABLE_PRESETS.find(
        (p) => p.name.toLowerCase() === targetName || (p.urduName && p.urduName === targetName)
      );
      if (matchedPreset?.imageURL) return matchedPreset.imageURL;
    }

    return "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80";
  };

  const handleDownloadSlip = async () => {
    if (!receiptRef.current) return;

    try {
      setDownloading(true);
      message.loading({ content: "Generating receipt image...", key: "download" });

      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `SabziMandi-Receipt-#${selectedOrder?._id?.slice(-6).toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();

      message.success({ content: "Receipt downloaded successfully!", key: "download" });
    } catch (err) {
      console.error("Error downloading receipt:", err);
      message.error({ content: "Failed to download receipt image.", key: "download" });
    } finally {
      setDownloading(false);
    }
  };

  const getStatusBadge = (status = "pending") => {
    const s = status.toLowerCase();
    switch (s) {
      case "delivered":
        return <span className="status-badge status-delivered">Delivered</span>;
      case "confirmed":
        return <span className="status-badge status-confirmed">Confirmed</span>;
      case "cancelled":
        return <span className="status-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="status-badge status-pending">Pending</span>;
    }
  };

  const openSlipModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const calculateSlipFinancials = (order) => {
    if (!order) return { itemsSubtotal: 0, appliedDeliveryFee: 0 };

    const itemsSubtotal =
      order.orderItems?.reduce((sum, it) => {
        const itemPrice = Number(it.price || it.product?.price || 0);
        const itemQty = Number(it.quantity || 1);
        return sum + itemPrice * itemQty;
      }, 0) || 0;

    const appliedDeliveryFee =
      order.deliveryFee !== undefined && order.deliveryFee !== null
        ? Number(order.deliveryFee)
        : Math.max(0, Number(order.totalAmount || 0) - itemsSubtotal);

    return { itemsSubtotal, appliedDeliveryFee };
  };

  return (
    <div className="client-orders-container">
      <div className="orders-top-header">
        <div>
          <h2>My Orders</h2>
          <p>Track deliveries, download receipts or modify pending orders</p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchMyOrders}
          loading={loading}
          className="refresh-btn"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="loader-box">
          <Spin size="large" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-view">
          <span className="empty-bag-icon" />
          <h3>No Orders Found</h3>
          <p>You have not placed any orders yet.</p>
          <Link to="/shop">
            <Button type="primary" size="large" className="shop-fresh-btn">
              Explore Fresh Produce
            </Button>
          </Link>
        </div>
      ) : (
        <div className="orders-list-grid">
          {orders.map((order) => {
            const isPending = (order.status || "pending").toLowerCase() === "pending";

            return (
              <div className="order-summary-card" key={order._id}>
                <div className="card-head">
                  <div>
                    <span className="order-hash">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-timestamp">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="card-items-preview">
                  {order.orderItems?.map((item, idx) => {
                    const prod = typeof item.product === "object" && item.product !== null ? item.product : {};
                    const displayName = prod.name || item.name || "Produce";
                    const displayUrdu = prod.urduName || item.urduName || "";
                    const displayUnit = prod.unit || item.unit || "kg";

                    return (
                      <div className="preview-row" key={idx}>
                        <div className="item-name-info">
                          <span className="dot">•</span>
                          <span className="title">{displayName}</span>
                          {displayUrdu && <span className="ur-sub">({displayUrdu})</span>}
                        </div>
                        <span className="qty-tag">
                          {item.quantity} {displayUnit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="card-footer-row" style={{ flexWrap: "wrap", gap: 10 }}>
                  <div className="total-block">
                    <span className="lbl">Total Bill</span>
                    <span className="val">Rs. {order.totalAmount}</span>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {isPending && (
                      <Popconfirm
                        title="Cancel this order?"
                        description="Are you sure you want to cancel this entire order?"
                        onConfirm={() => handleCancelOrder(order._id)}
                        okText="Yes, Cancel"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          loading={actionLoading}
                          style={{ borderRadius: 8, height: 38 }}
                        >
                          Cancel
                        </Button>
                      </Popconfirm>
                    )}

                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      className="view-slip-btn"
                      onClick={() => openSlipModal(order)}
                    >
                      View Slip
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slip Modal: Scroll wrapper modal level par hai, receipt level par nahi */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={440}
        className="digital-slip-modal"
        destroyOnHidden
        styles={{
          body: {
            maxHeight: "85vh",
            overflowY: "auto",
            padding: "12px",
          },
        }}
      >
        {selectedOrder && (() => {
          const { itemsSubtotal, appliedDeliveryFee } = calculateSlipFinancials(selectedOrder);

          return (
            <div className="modal-inner-wrapper">
              {/* Receipt element: No scrollbar, full height expansion */}
              <div
                className="digital-receipt-slip"
                ref={receiptRef}
                style={{
                  height: "auto",
                  maxHeight: "none",
                  overflow: "visible",
                }}
              >
                <div className="slip-top-status">
                  <div className="check-circle">
                    <CheckCircleFilled />
                  </div>
                  <h3>Order Receipt</h3>
                  <p className="status-text">
                    {selectedOrder.status?.toUpperCase() || "PENDING"}
                  </p>
                  <h1 className="slip-total-amount">
                    Rs. {selectedOrder.totalAmount}
                  </h1>
                </div>

                <div className="slip-meta-table">
                  <div className="meta-row">
                    <span className="meta-lbl">Order ID</span>
                    <span className="meta-val highlight">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-lbl">Date & Time</span>
                    <span className="meta-val">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-lbl">Payment Mode</span>
                    <span className="meta-val">Cash on Delivery (COD)</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-lbl">Contact Phone</span>
                    <span className="meta-val">
                      {selectedOrder.deliveryAddress?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="meta-row address-row">
                    <span className="meta-lbl">Delivery Address</span>
                    <span className="meta-val">
                      {selectedOrder.deliveryAddress?.address || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="slip-zigzag-divider">
                  <div className="circle-cut left"></div>
                  <div className="dashed-line"></div>
                  <div className="circle-cut right"></div>
                </div>

                {/* Items Breakdown: Saari items bina cut huye expand hongi */}
                <div className="slip-items-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4>Vegetables Breakdown</h4>
                  </div>

                  <div
                    className="slip-items-list"
                    style={{
                      maxHeight: "none",
                      overflow: "visible",
                      height: "auto",
                    }}
                  >
                    {selectedOrder.orderItems?.map((item, idx) => {
                      const prod = typeof item.product === "object" && item.product !== null ? item.product : {};
                      const name = prod.name || item.name || "Sabzi";
                      const urduName = prod.urduName || item.urduName || "";
                      const unit = prod.unit || item.unit || "kg";
                      const price = Number(item.price || prod.price || 0);
                      const qty = Number(item.quantity || 1);
                      const imageUrl = getProduceImage(item);

                      return (
                        <div className="slip-product-item" key={idx} style={{ position: "relative" }}>
                          <img
                            src={imageUrl}
                            alt={name}
                            crossOrigin="anonymous"
                            className="slip-prod-img"
                          />
                          <div className="slip-prod-details">
                            <span className="slip-p-name">{name}</span>
                            {urduName && <span className="slip-p-urdu">{urduName}</span>}
                            <span className="slip-p-rate">
                              Rs. {price} / {unit}
                            </span>
                          </div>

                          <div className="slip-prod-calc" style={{ textAlign: "right" }}>
                            <span className="calc-qty">x {qty}</span>
                            <span className="calc-total">Rs. {Math.round(price * qty)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="slip-final-summary">
                  <div className="sum-line">
                    <span>Subtotal</span>
                    <span>Rs. {itemsSubtotal}</span>
                  </div>
                  <div className="sum-line">
                    <span>Delivery Charges</span>
                    {appliedDeliveryFee === 0 ? (
                      <span className="free-tag">FREE</span>
                    ) : (
                      <span style={{ fontWeight: 600, color: "#111827" }}>
                        Rs. {appliedDeliveryFee}
                      </span>
                    )}
                  </div>
                  <div className="sum-line net-total">
                    <b>Total Amount</b>
                    <b>Rs. {selectedOrder.totalAmount}</b>
                  </div>
                </div>

                <div className="slip-footer-note">
                  <p>🥬 SabziMandi - Taza Mandi Rates</p>
                  <span>Thank you for choosing fresh produce!</span>
                </div>
              </div>

              <div className="slip-modal-actions d-flex flex-row align-items-center justify-content-between" style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  loading={downloading}
                  onClick={handleDownloadSlip}
                  className="slip-download-btn"
                  style={{ backgroundColor: "#2E7D32" }}
                >
                  Download Slip
                </Button>
                <Button
                  className="slip-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default ClientOrders;