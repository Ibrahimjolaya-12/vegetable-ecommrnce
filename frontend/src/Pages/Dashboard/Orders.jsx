import { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
  Button,
  Modal,
  Descriptions,
  Divider,
  Tag,
  Space,
} from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../Api/axiosInstance";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order");
      const data = res.data?.orders || res.data?.data || res.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Fetch orders error:", error);
      message.error("Failed to load customer orders!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/order/${orderId}/status`, { status: newStatus });
      message.success("Order status updated successfully!");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update status!");
    }
  };

  const openDetailsModal = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const getStatusColor = (status = "pending") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "green";
      case "confirmed":
        return "blue";
      case "out for delivery":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "gold";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 105,
      render: (id) => (
        <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1f2937" }}>
          #{id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Order Placed At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 175,
      render: (date) => {
        if (!date) return <span style={{ color: "#9ca3af" }}>N/A</span>;
        const d = new Date(date);
        
        const dayDate = d.toLocaleDateString("en-PK", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const exactTime = d.toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>
              {dayDate}
            </div>
            <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 2 }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {exactTime}
            </div>
          </div>
        );
      },
    },
    {
      title: "Customer",
      key: "customer",
      width: 150,
      render: (_, record) =>
        record.userId?.name ||
        record.deliveryAddress?.phone ||
        "Guest Customer",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 130,
      render: (val) => (
        <span style={{ fontWeight: 700, color: "#2e7d32" }}>Rs. {val}</span>
      ),
    },
    {
      title: "Items",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 90,
      render: (items) => `${items?.length || 0} items`,
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status, record) => (
        <Select
          value={status || "pending"}
          style={{ width: "100%", minWidth: 135 }}
          onChange={(val) => handleStatusChange(record._id, val)}
          options={[
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "out for delivery", label: "Out for Delivery" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32", borderRadius: 6 }}
          onClick={() => openDetailsModal(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px 16px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Customer Orders
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
            Track deliveries, verify client invoices & update shipping milestones
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchOrders}
          loading={loading}
          style={{ borderRadius: 8 }}
        >
          Refresh
        </Button>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 860 }}
      />

      {/* Order Full Details Modal */}
      <Modal
        title={
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
            Order Details #{selectedOrder?._id?.slice(-6).toUpperCase()}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)} style={{ borderRadius: 6 }}>
            Close
          </Button>,
        ]}
        width={620}
        destroyOnHidden
        centered
      >
        {selectedOrder && (
          <div style={{ marginTop: 14 }}>
            {/* Customer & Delivery Information */}
            <Descriptions
              title="Shipping & Customer Details"
              bordered
              size="small"
              column={1}
            >
              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined /> Placed At
                  </Space>
                }
              >
                <b>
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("en-PK", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </b>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined /> Customer Name
                  </Space>
                }
              >
                {selectedOrder.userId?.name || "Guest Customer"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined /> Contact Phone
                  </Space>
                }
              >
                <b>{selectedOrder.deliveryAddress?.phone || "N/A"}</b>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <HomeOutlined /> Delivery Address
                  </Space>
                }
              >
                {selectedOrder.deliveryAddress?.address || "N/A"}
              </Descriptions.Item>

              {selectedOrder.deliveryAddress?.note && (
                <Descriptions.Item label="Delivery Note">
                  <span style={{ color: "#d97706", fontWeight: 500 }}>
                    {selectedOrder.deliveryAddress.note}
                  </span>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Payment Method">
                <Tag color="green">{selectedOrder.paymentMethod || "COD"}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Current Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status?.toUpperCase() || "PENDING"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "16px 0" }} />

            {/* Ordered Produce List */}
            <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#374151" }}>
              Purchased Vegetables:
            </h4>
            <div
              style={{
                background: "#f9fafb",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            >
              {selectedOrder.orderItems?.map((item, index) => {
                const prod = item.product || {};
                const name = prod.name || item.name || "Produce Item";
                const urduName = prod.urduName || item.urduName || "";
                const unit = prod.unit || item.unit || "kg";
                const price = Number(prod.price || item.price || 0);
                const qty = Number(item.quantity || 1);

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom:
                        index < selectedOrder.orderItems.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  >
                    <div>
                      <b style={{ textTransform: "capitalize", color: "#1f2937" }}>{name}</b>
                      {urduName && (
                        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                          ({urduName})
                        </span>
                      )}
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        Qty: {qty} {unit}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: "#111827" }}>
                      Rs. {Math.round(price * qty)}
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "2px dashed #d1d5db",
                  fontSize: 15,
                }}
              >
                <b>Total Invoice:</b>
                <b style={{ color: "#2e7d32", fontSize: 17 }}>
                  Rs. {selectedOrder.totalAmount}
                </b>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;