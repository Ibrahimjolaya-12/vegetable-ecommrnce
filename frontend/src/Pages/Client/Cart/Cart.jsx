import { useState, useEffect } from "react";
import { Table, InputNumber, Button, Card, message, Modal, Input, Form } from "antd";
import { DeleteOutlined, CheckCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../Contexts/CartContext";
import { useAuth } from "../../../Contexts/AuthContext";
import api from "../../../Api/axiosInstance";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [feeLoading, setFeeLoading] = useState(true);
  const [form] = Form.useForm();

  // Fetch live delivery fee setting from admin database
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        setFeeLoading(true);
        const res = await api.get("/settings/delivery-fee");
        if (res.data?.deliveryFee !== undefined) {
          setDeliveryFee(Number(res.data.deliveryFee));
        }
      } catch (error) {
        console.error("Cart delivery fee fetch error:", error);
      } finally {
        setFeeLoading(false);
      }
    };

    fetchDeliveryFee();
  }, []);

  // Subtotal & Estimated Total Calculation
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + Number(curr.price || 0) * Number(curr.quantity || 1),
    0
  );

  const finalTotal = subtotal + (cartItems.length > 0 ? Number(deliveryFee) : 0);

  const handleProceedCheckout = () => {
    if (!token) {
      message.warning("Please sign in to proceed with your order.");
      navigate("/auth/login");
      return;
    }
    if (cartItems.length === 0) {
      message.error("Your shopping cart is currently empty.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async (values) => {
    try {
      setLoading(true);

      const payload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),
        deliveryAddress: {
          address: values.address.trim(),
          phone: values.phone.trim(),
          note: values.note ? values.note.trim() : "",
        },
        deliveryFee: Number(deliveryFee),
        paymentMethod: "COD",
      };

      const res = await api.post("/order", payload);

      if (res.data?.success || res.status === 201) {
        message.success("Order placed successfully!");
        clearCart();
        setIsModalOpen(false);
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order confirmation error:", error);
      message.error(
        error.response?.data?.message || "Failed to process your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      width: 140,
      render: (_, record) => (
        <div className="cart-product-cell">
          <img
            src={record.imageURL}
            alt={record.name}
            className="product-img"
          />
          <div className="product-titles">
            <b className="name-en">{record.name}</b>
            <div className="name-ur">{record.urduName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      width: 90,
      render: (price, record) => `Rs. ${price} / ${record.unit || "kg"}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (qty, record) => (
        <div className="qty-control">
          <InputNumber
            min={0.25}
            step={0.5}
            precision={2}
            value={qty}
            onChange={(val) => updateQuantity(record._id, val)}
            style={{ width: 70 }}
          />
          <span style={{ fontSize: 12, color: "#666" }}>{record.unit || "kg"}</span>
        </div>
      ),
    },
    {
      title: "Subtotal",
      key: "total",
      width: 90,
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>
          Rs. {Math.round(record.price * record.quantity)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 60,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record._id)}
          aria-label="Remove item"
        />
      ),
    },
  ];

  return (
    <div className="cart-page-wrapper">
      <h2 className="cart-heading">
        Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "Item" : "Items"})
      </h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-card">
          <p>Your shopping cart is currently empty.</p>
          <Link to="/shop">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={{ backgroundColor: "#2e7d32" }}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="cart-layout-grid">
          <div className="cart-table-card">
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="_id"
              pagination={false}
              scroll={{ x: 500 }}
            />
          </div>

          <div className="cart-summary-wrapper">
            <Card className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items Subtotal</span>
                <b>Rs. {Math.round(subtotal)}</b>
              </div>
              <div className="summary-row">
                <span>Standard Delivery</span>
                <b>
                  {feeLoading ? "..." : Number(deliveryFee) === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                </b>
              </div>
              <div className="summary-row">
                <span>Payment Method</span>
                <b>Cash on Delivery</b>
              </div>
              <hr className="divider" />
              <div className="summary-row total-row">
                <b>Estimated Total</b>
                <b className="total-amount">Rs. {Math.round(finalTotal)}</b>
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="checkout-btn"
                onClick={handleProceedCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Checkout / Delivery Address Modal */}
      <Modal
        title="Confirm Shipping Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConfirmOrder}
          initialValues={{
            phone: user?.phone || "",
            address: user?.address || "",
            note: "",
          }}
        >
          <Form.Item
            name="phone"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter your active contact number." }]}
          >
            <Input placeholder="03001234567" size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Delivery Address"
            rules={[{ required: true, message: "Please provide your full shipping address." }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="House/Apartment #, Street, Area, Landmark"
            />
          </Form.Item>

          <Form.Item name="note" label="Delivery Instructions (Optional)">
            <Input placeholder="e.g., Ring bell twice or leave at reception" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            icon={<CheckCircleOutlined />}
            style={{ backgroundColor: "#2e7d32", height: 44, marginTop: 10 }}
          >
            Confirm & Place Order (Rs. {Math.round(finalTotal)})
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Cart;