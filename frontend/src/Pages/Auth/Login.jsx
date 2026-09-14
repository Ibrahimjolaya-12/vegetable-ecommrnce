import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await login(values.email, values.password);

      if (res.success) {
        message.success("Logged in successfully!");
        form.resetFields();
        navigate("/");
      } else {
        message.error(res.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" bordered={false}>
        <div className="auth-header">
          <span className="logo-icon">🥬</span>
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to access your account</p>
        </div>

        <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="auth-btn"
            size="large"
            block
            loading={loading}
          >
            Sign In
          </Button>

          <div className="auth-footer">
            Don't have an account? <Link to="/auth/register">Create an account</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;