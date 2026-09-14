import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/axiosInstance";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", values);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        message.success(res.data.message || "Account registered successfully!");
        form.resetFields();
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" bordered={false}>
        <div className="auth-header">
          <span className="logo-icon">🥬</span>
          <h2>Create an Account</h2>
          <p>Sign up to order fresh farm produce</p>
        </div>

        <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
          {/* 1. Full Name */}
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          {/* 2. Email Address */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
          </Form.Item>

          {/* 3. Phone Number */}
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please enter your contact number!" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number (e.g., 03001234567)" size="large" />
          </Form.Item>

          {/* 4. Delivery Address */}
          <Form.Item name="address">
            <Input prefix={<HomeOutlined />} placeholder="Delivery Address (Optional)" size="large" />
          </Form.Item>

          {/* 5. Password */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {/* 6. Confirm Password */}
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="auth-btn"
            size="large"
            block
            loading={loading}
          >
            Register
          </Button>

          <div className="auth-footer">
            Already have an account? <Link to="/auth/login">Sign in</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;