import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HeartFilled,
} from "@ant-design/icons";

const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <Row gutter={[24, 32]}>
          {/* 1. Brand & Intro */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-brand">
              <span className="logo-emoji">🥬</span>
              <span className="logo-text">
                Sabzi<span>Mandi</span>
              </span>
            </div>
            <p className="brand-desc">
              Taza aur certified organic sabziyan seedha khet se aapke darwaze
              tak. Fast delivery aur guaranteed freshness.
            </p>
          </Col>

          {/* 2. Quick Links */}
          <Col xs={12} sm={6} md={6}>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop Sabzi</Link>
              </li>
              <li>
                <Link to="/wishlist">My Wishlist</Link>
              </li>
              <li>
                <Link to="/cart">My Cart</Link>
              </li>
            </ul>
          </Col>

          {/* 3. Customer Service */}
          <Col xs={12} sm={6} md={6}>
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links">
              <li>
                <Link to="/customer-care?tab=faq">FAQ</Link>
              </li>
              <li>
                <Link to="/customer-care?tab=delivery">Delivery Policy</Link>
              </li>
              <li>
                <Link to="/customer-care?tab=refund">Refund Policy</Link>
              </li>
              <li>
                <Link to="/customer-care?tab=privacy">Privacy Terms</Link>
              </li>
            </ul>
          </Col>

          {/* 4. Contact Details */}
          <Col xs={24} sm={12} md={6}>
            <h4 className="footer-heading">Contact Us</h4>
            <div className="contact-list">
              <p>
                <EnvironmentOutlined className="contact-icon" /> Islan Nagar main bazar,
                Faisalabad, PK
              </p>
              <p>
                <PhoneOutlined className="contact-icon" /> +92 300 1234567
              </p>
              <p>
                <MailOutlined className="contact-icon" /> support@sabzimandi.pk
              </p>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} SabziMandi. All rights reserved.</p>
          <p>
            Design and Developed with{" "}
            <HeartFilled style={{ color: "#ef4444", margin: "0 4px" }} /> by{" "}
            <b style={{ color: "#22c55e", fontWeight: 700 }}>
               Muhammad Ibrahim
            </b>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Copyright;