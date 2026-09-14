import { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { VEGETABLE_PRESETS } from "../../Data/vegetablePresets";
import api from "../../Api/axiosInstance";

const AddProduct = () => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePresetSelect = (selectedName) => {
    const selectedVeg = VEGETABLE_PRESETS.find((v) => v.name === selectedName);

    if (selectedVeg) {
      form.setFieldsValue({
        name: selectedVeg.name,
        urduName: selectedVeg.urduName,
        unit: selectedVeg.unit,
        imageURL: selectedVeg.imageURL,
        description: selectedVeg.description,
      });
      setPreviewImage(selectedVeg.imageURL);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/product", values);

      if (res.data?.success || res.status === 201 || res.status === 200) {
        message.success("Product successfully added to inventory!");
        form.resetFields();
        setPreviewImage("");
      }
    } catch (error) {
      console.error("Product add error:", error);
      message.error(error.response?.data?.message || "Failed to add product to inventory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <Card title="Add New Product (Inventory / Vendor)" className="form-card" bordered={false}>
        <div className="preset-selector-box">
          <label className="box-label">⚡ Fast Entry with Presets</label>
          <Select
            showSearch
            placeholder="Select a vegetable preset (e.g., Tomato)"
            size="large"
            style={{ width: "100%" }}
            onChange={handlePresetSelect}
            options={VEGETABLE_PRESETS.map((item) => ({
              value: item.name,
              label: `${item.name} (${item.urduName})`,
            }))}
          />
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Product Name (English)"
                name="name"
                rules={[{ required: true, message: "Please enter the product name in English!" }]}
              >
                <Input placeholder="e.g., Tomato" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Regional Name (Urdu)"
                name="urduName"
                rules={[{ required: true, message: "Please enter the product name in Urdu!" }]}
              >
                <Input placeholder="e.g., ٹماٹر" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Price (Rs)"
                name="price"
                rules={[{ required: true, message: "Please enter the unit price!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} size="large" placeholder="120" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                label="Available Stock"
                name="stockQuantity"
                rules={[{ required: true, message: "Please specify stock quantity!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} size="large" placeholder="50" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item label="Measurement Unit" name="unit" initialValue="kg">
                <Select size="large">
                  <Select.Option value="kg">Per Kilogram (Kg)</Select.Option>
                  <Select.Option value="gram">Per Gram (g)</Select.Option>
                  <Select.Option value="dozen">Per Dozen</Select.Option>
                  <Select.Option value="gaddi">Per gaddi</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Product Image URL"
            name="imageURL"
            rules={[{ required: true, message: "Please provide a valid image URL!" }]}
          >
            <Input
              size="large"
              placeholder="https://example.com/produce.jpg"
              onChange={(e) => setPreviewImage(e.target.value)}
            />
          </Form.Item>

          {previewImage && (
            <div className="preview-container">
              <img src={previewImage} alt="Product Preview" />
              <span>Image Preview</span>
            </div>
          )}

          <Form.Item label="Product Description" name="description">
            <Input.TextArea rows={3} placeholder="Provide details regarding freshness, source, or grading..." />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusCircleOutlined />}
            size="large"
            block
            loading={loading}
            className="submit-btn"
          >
            Publish Product to Store
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;