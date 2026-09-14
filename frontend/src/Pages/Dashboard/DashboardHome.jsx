import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Spin, InputNumber, Button, message } from "antd";
import {
  ShoppingOutlined,
  AlertOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import api from "../../Api/axiosInstance";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [loading, setLoading] = useState(true);
  const [updatingFee, setUpdatingFee] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const pRes = await api.get("/product");
        const products = pRes.data?.products || pRes.data?.data || pRes.data || [];
        const lowStockCount = products.filter(
          (p) => (p.stockQuantity || 0) <= 3
        ).length;

        const oRes = await api.get("/order");
        const orders = oRes.data?.orders || oRes.data?.data || oRes.data || [];
        const revenue = orders.reduce(
          (acc, curr) => acc + (curr.totalAmount || 0),
          0
        );

        setStats({
          totalProducts: products.length,
          lowStock: lowStockCount,
          totalOrders: orders.length,
          totalRevenue: revenue,
        });

        try {
          const feeRes = await api.get("/settings/delivery-fee");
          if (feeRes.data?.deliveryFee !== undefined) {
            setDeliveryFee(feeRes.data.deliveryFee);
          }
        } catch {
          setDeliveryFee(50);
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateDeliveryFee = async () => {
    try {
      setUpdatingFee(true);
      await api.post("/settings/delivery-fee", { deliveryFee });
      message.success(`Standard delivery fee updated to Rs. ${deliveryFee}!`);
    } catch (error) {
      console.error("Fee update error:", error);
      message.error(error.response?.data?.message || "Failed to update delivery fee.");
    } finally {
      setUpdatingFee(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-home-view" style={{ width: "100%", minWidth: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>
          Store Performance Overview
        </h2>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13.5 }}>
          Real-time metrics on inventory levels, completed shipments, and revenue
        </p>
      </div>

      {/* 1. Statistics Cards */}
      <Row gutter={[14, 14]}>
        <Col xs={12} sm={12} lg={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              borderRadius: 12,
              border: "1px solid #edf2f7",
            }}
            styles={{ body: { padding: "16px 14px" } }}
          >
            <Statistic
              title="Listed Produce"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined style={{ color: "#2e7d32" }} />}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              borderRadius: 12,
              border: "1px solid #edf2f7",
            }}
            styles={{ body: { padding: "16px 14px" } }}
          >
            <Statistic
              title="Low Stock Alert"
              value={stats.lowStock}
              styles={{ content: { color: stats.lowStock > 0 ? "#cf1322" : "#3f8600" } }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              borderRadius: 12,
              border: "1px solid #edf2f7",
            }}
            styles={{ body: { padding: "16px 14px" } }}
          >
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              borderRadius: 12,
              border: "1px solid #edf2f7",
            }}
            styles={{ body: { padding: "16px 14px" } }}
          >
            <Statistic
              title="Gross Revenue"
              value={stats.totalRevenue}
              prefix={<DollarCircleOutlined style={{ color: "#faad14" }} />}
              suffix="PKR"
            />
          </Card>
        </Col>
      </Row>

      {/* 2. Delivery Configuration */}
      <Row style={{ marginTop: 20 }}>
        <Col xs={24} md={16} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CarOutlined style={{ color: "#2e7d32", fontSize: 18 }} />
                <span>Base Shipping & Delivery Charge</span>
              </div>
            }
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              borderRadius: 12,
              border: "1px solid #edf2f7",
            }}
          >
            <p style={{ color: "#6b7280", fontSize: 13.5, marginBottom: 14 }}>
              Configure the flat-rate delivery charge automatically applied to all customer checkouts:
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <InputNumber
                min={0}
                step={10}
                value={deliveryFee}
                onChange={(val) => setDeliveryFee(val || 0)}
                size="large"
                style={{ flex: 1, minWidth: 140, borderRadius: 8 }}
                prefix="Rs."
              />
              <Button
                type="primary"
                onClick={handleUpdateDeliveryFee}
                loading={updatingFee}
                size="large"
                style={{
                  backgroundColor: "#2e7d32",
                  borderColor: "#2e7d32",
                  borderRadius: 8,
                  fontWeight: 600,
                  minWidth: 120,
                }}
              >
                Update Fee
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;