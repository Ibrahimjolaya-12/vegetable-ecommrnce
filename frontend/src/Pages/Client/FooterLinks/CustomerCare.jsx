import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, Collapse } from "antd";
import {
  QuestionCircleOutlined,
  CarOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const faqItems = [
  {
    key: "1",
    label: "Mandi rates rozana kab update hotay hain?",
    children: (
      <p>
        Humari team rozana subah 6 baje mandi se taaza rates aur stock update karti hai taake aapko hamesha din ka sahi rate mile.
      </p>
    ),
  },
  {
    key: "2",
    label: "Sabziyon ki quality ki kya guarantee hai?",
    children: (
      <p>
        Har sabzi deliver hone se pehle manual sorting aur inspection se guzarti hai. Koi bhi kharab ya daag-daar sabzi pack nahi ki jati.
      </p>
    ),
  },
  {
    key: "3",
    label: "Kya payment sirf Cash on Delivery (COD) par hai?",
    children: (
      <p>
        Jee haan, filhal tamam orders Cash on Delivery par deliver hotay hain taake aap pehle sabzi check karein aur tasalli ke baad payment dein.
      </p>
    ),
  },
  {
    key: "4",
    label: "Order cancel kaise karein?",
    children: (
      <p>
        Jab tak order ka status "Pending" hai, aap hamaray helpline number par foran call kar ke order cancel karwa saktay hain.
      </p>
    ),
  },
];

const CustomerCare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "faq";
  const [activeKey, setActiveKey] = useState(currentTab);

  useEffect(() => {
    setActiveKey(currentTab);
  }, [currentTab]);

  const handleTabChange = (key) => {
    setActiveKey(key);
    setSearchParams({ tab: key });
  };

  const tabItems = [
    {
      key: "faq",
      label: (
        <span>
          <QuestionCircleOutlined /> FAQ
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0" }}>
          <h3 style={{ color: "#1b5e20", marginBottom: 16 }}>Aam Pooche Jane Walay Sawalat (FAQ)</h3>
          <Collapse items={faqItems} defaultActiveKey={["1"]} accordion />
        </div>
      ),
    },
    {
      key: "delivery",
      label: (
        <span>
          <CarOutlined /> Delivery Policy
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0", lineHeight: 1.8, color: "#374151" }}>
          <h3 style={{ color: "#1b5e20", marginBottom: 16 }}>Delivery Policy</h3>
          <p>
            • <b>Delivery Timing:</b> Subah 7 baje se dopehar 12 baje tak aane wale orders shaam tak deliver kiye jatay hain.
          </p>
          <p>
            • <b>Express Sourcing:</b> Sabziyan khet aur mandi se direct pick hoti hain, is liye delivery ke waqt freshness 100% barkarar rehti hai.
          </p>
          <p>
            • <b>Delivery Charges:</b> Delivery fee cart page par admin settings ke mutabiq dynamically show hoti hai.
          </p>
          <p>
            • <b>Delivery Area:</b> Filhal pure shehar ke tamam major residential areas mein service available hai.
          </p>
        </div>
      ),
    },
    {
      key: "refund",
      label: (
        <span>
          <DollarCircleOutlined /> Refund Policy
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0", lineHeight: 1.8, color: "#374151" }}>
          <h3 style={{ color: "#1b5e20", marginBottom: 16 }}>Return & Refund Policy</h3>
          <p>
            • <b>Doorstep Check:</b> Delivery rider ke samne sabziyan check karein. Agar koi sabzi kharab ya daag-daar nikle to aap rider ko foran wapis kar saktay hain.
          </p>
          <p>
            • <b>Instant Deduction:</b> Wapis ki gayi sabzi ki raqam foran total bill se minus kar di jaye gi.
          </p>
          <p>
            • <b>Post-Delivery Claim:</b> Delivery ke 2 ghantay ke andar customer care number par tasweer bhej kar replacement ya coupon claim kiya ja sakta hai.
          </p>
        </div>
      ),
    },
    {
      key: "privacy",
      label: (
        <span>
          <SafetyCertificateOutlined /> Privacy Terms
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0", lineHeight: 1.8, color: "#374151" }}>
          <h3 style={{ color: "#1b5e20", marginBottom: 16 }}>Privacy Policy & Terms</h3>
          <p>
            • <b>Personal Information:</b> Aapka phone number aur address sirf order delivery aur rider contact ke liye istemal hota hai.
          </p>
          <p>
            • <b>Data Protection:</b> Hum aapka data kisi teesri party ya marketing agency ke sath share nahi kartay.
          </p>
          <p>
            • <b>Account Security:</b> Aapke login credentials encrypted form mein secure database mein store hotay hain.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px", minHeight: "70vh" }}>
      <div
        style={{
          background: "#ffffff",
          padding: "30px 24px",
          borderRadius: 14,
          border: "1px solid #edf2f7",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 20 }}>
          Customer Care Center
        </h2>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          items={tabItems}
          type="card"
        />
      </div>
    </div>
  );
};

export default CustomerCare;