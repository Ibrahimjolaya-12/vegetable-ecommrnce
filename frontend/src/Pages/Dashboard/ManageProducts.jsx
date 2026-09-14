import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  message,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import api from "../../Api/axiosInstance";

// Pre-defined Produce Presets for Fast Entry
const PRESET_VEGETABLES = [
  { name: "Potato", urduName: "آلو" },
  { name: "Tomato", urduName: "ٹماٹر" },
  { name: "Onion", urduName: "پیاز" },
  { name: "Garlic", urduName: "لہسن" },
  { name: "Ginger", urduName: "ادرک" },
  { name: "Green Chilli", urduName: "سبز مرچ" },
  { name: "Coriander", urduName: "دھنیا" },
  { name: "Mint", urduName: "پودینہ" },
  { name: "Spinach", urduName: "پالک" },
  { name: "Cauliflower", urduName: "پھول گوبھی" },
  { name: "Cabbage", urduName: "بند گوبھی" },
  { name: "Peas", urduName: "مٹر" },
  { name: "Carrot", urduName: "گاجر" },
  { name: "Cucumber", urduName: "کھیرا" },
  { name: "Bitter Gourd", urduName: "کریلا" },
  { name: "Eggplant", urduName: "بینگن" },
  { name: "Lady Finger", urduName: "بھنڈی" },
  { name: "Bottle Gourd", urduName: "لوکی / کدو" },
  { name: "Capsicum", urduName: "شملہ مرچ" },
  { name: "Lemon", urduName: "لیموں" },
];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product");
      const data = res.data?.products || res.data?.data || res.data || [];
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      message.error("Failed to load inventory products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/product/${id}`);
      message.success("Product deleted successfully!");
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete product.",
      );
    }
  };

  const handleEditClick = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      urduName: record.urduName,
      price: record.price,
      stockQuantity: record.stockQuantity,
      unit: record.unit || "kg",
      imageURL: record.imageURL,
    });
    setEditModalOpen(true);
  };

  const handleSelectVegetable = (selectedName) => {
    const found = PRESET_VEGETABLES.find(
      (v) => v.name.toLowerCase() === selectedName.toLowerCase(),
    );
    if (found) {
      form.setFieldsValue({
        name: found.name,
        urduName: found.urduName,
      });
    } else {
      form.setFieldsValue({
        name: selectedName,
      });
    }
  };

  const handleUpdateProduct = async (values) => {
    try {
      setUpdating(true);
      const res = await api.put(`/product/${editingProduct._id}`, values);

      if (res.data?.success || res.status === 200) {
        message.success("Product details updated successfully!");
        setProducts((prev) =>
          prev.map((item) =>
            item._id === editingProduct._id ? { ...item, ...values } : item,
          ),
        );
        setEditModalOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Update product error:", error);
      message.error(
        error.response?.data?.message || "Failed to update product.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: "Produce",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={
              record.imageURL ||
              "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80"
            }
            alt={record.name}
            style={{
              width: 44,
              height: 44,
              objectFit: "cover",
              borderRadius: 8,
              background: "#f1f5f9",
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#111827",
                textTransform: "capitalize",
              }}
            >
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.urduName}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      width: 130,
      render: (price, record) => (
        <span style={{ fontWeight: 700, color: "#2e7d32" }}>
          Rs. {price} / {record.unit || "kg"}
        </span>
      ),
    },
    {
      title: "Stock Level",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 130,
      render: (stock, record) => (
        <Tag color={stock <= 3 ? "red" : "green"}>
          {stock <= 3
            ? `Low: ${stock} ${record.unit || "kg"}`
            : `${stock} ${record.unit || "kg"}`}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            style={{
              backgroundColor: "#2e7d32",
              borderColor: "#2e7d32",
              borderRadius: 6,
            }}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to permanently remove this produce item?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px 16px",
        background: "#ffffff",
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
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Inventory Management
          </h3>
          <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: 13 }}>
            Monitor real-time stock levels, pricing, and product catalogs
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchProducts}
          loading={loading}
          style={{ borderRadius: 8 }}
        >
          Refresh
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 680 }}
      />

      {/* Edit Product Modal */}
      <Modal
        title={
          <span style={{ fontSize: 17, fontWeight: 700 }}>
            Edit Product Details ({editingProduct?.name || ""})
          </span>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnHidden
        centered
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProduct}
          style={{ marginTop: 16 }}
        >
          {/* Quick Select Dropdown */}
          <Form.Item label="Select Produce Preset (Auto-fills English & Urdu Name)">
            <Select
              showSearch
              placeholder="Search produce preset..."
              optionFilterProp="label"
              onChange={handleSelectVegetable}
              size="large"
              options={PRESET_VEGETABLES.map((v) => ({
                value: v.name,
                label: `${v.name} (${v.urduName})`,
              }))}
            />
          </Form.Item>

          {/* English & Urdu Name Grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item
              name="name"
              label="English Name"
              rules={[
                { required: true, message: "Please enter the English name" },
              ]}
            >
              <Input placeholder="e.g. Tomato" size="large" />
            </Form.Item>

            <Form.Item
              name="urduName"
              label="Urdu Name"
              rules={[
                { required: true, message: "Please enter the Urdu name" },
              ]}
            >
              <Input placeholder="e.g. ٹماٹر" size="large" />
            </Form.Item>
          </div>

          {/* Price & Unit Grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Form.Item
              name="price"
              label="Price (Rs)"
              rules={[{ required: true, message: "Please specify price" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} size="large" />
            </Form.Item>

            <Form.Item
              name="unit"
              label="Measurement Unit"
              rules={[{ required: true, message: "Please select unit" }]}
            >
              <Select
                size="large"
                options={[
                  { value: "kg", label: "Per Kilogram (Kg)" },
                  { value: "gram", label: "Per Gram (g)" },
                  { value: "dozen", label: "Per Dozen" },
                  { value: "gaddi", label: "Per gaddi" },
                ]}
              />
            </Form.Item>
          </div>

          {/* Stock Quantity */}
          <Form.Item
            name="stockQuantity"
            label="Available Stock"
            rules={[{ required: true, message: "Stock quantity is required" }]}
          >
            <InputNumber
              min={0}
              step={0.5}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>

          {/* Image URL */}
          <Form.Item
            name="imageURL"
            label="Product Image URL"
            rules={[{ required: true, message: "Please provide image URL" }]}
          >
            <Input placeholder="https://image-link.com" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            block
            loading={updating}
            size="large"
            style={{
              backgroundColor: "#2e7d32",
              borderColor: "#2e7d32",
              marginTop: 10,
              height: 44,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Save Product Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageProducts;
