import { Row, Col, Card } from "antd";
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SmileOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const AboutLink = () => {
  return (
    <div className="about-page-container">
      {/* Hero Header */}
      <div className="about-hero-section">
        <span className="brand-badge-icon">🥬</span>
        <h1 className="hero-title">About SabziMandi</h1>
        <p className="hero-subtitle">
          Eliminating middlemen to bridge the gap between local growers and your kitchen. 
          We deliver farm-fresh, premium produce directly to your doorstep at true market rates.
        </p>
      </div>

      {/* Core Pillars Grid */}
      <Row gutter={[20, 20]} className="pillars-grid">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="pillar-card">
            <div className="icon-wrapper">
              <ShopOutlined />
            </div>
            <h3>Direct Sourcing</h3>
            <p>Direct procurement from wholesale markets at dawn to guarantee optimal freshness.</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="pillar-card">
            <div className="icon-wrapper">
              <SafetyCertificateOutlined />
            </div>
            <h3>Quality Graded</h3>
            <p>Every vegetable is meticulously hand-sorted and inspected before dispatch.</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="pillar-card">
            <div className="icon-wrapper">
              <ThunderboltOutlined />
            </div>
            <h3>Express Delivery</h3>
            <p>Same-day doorstep delivery to ensure zero loss in nutritional value.</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="pillar-card">
            <div className="icon-wrapper">
              <SmileOutlined />
            </div>
            <h3>Customer Promise</h3>
            <p>100% satisfaction guaranteed with hassle-free replacements and swift refunds.</p>
          </Card>
        </Col>
      </Row>

      {/* Trust & Commitment Banner */}
      <div className="mission-banner">
        <h2>Uncompromised Freshness, Fair Market Pricing</h2>
        <p>
          Say goodbye to stale shelf produce and inflated retail margins. With SabziMandi, 
          manage your kitchen essentials efficiently without sacrificing quality.
        </p>
      </div>
    </div>
  );
};

export default AboutLink;