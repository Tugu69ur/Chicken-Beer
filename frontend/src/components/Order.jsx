import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";
import icon from "/assets/cart.png";
import { Modal, Row, Col, Button, Typography } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text, Paragraph } = Typography;

// Safe parse helper for selectedBranch
function safeParseSelectedBranch() {
  const val = localStorage.getItem("selectedBranch");
  if (!val) return null;

  try {
    return JSON.parse(val);
  } catch {
    return { name: val };
  }
}

function groupByCategory(items) {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return Object.entries(grouped).map(([title, items]) => ({ title, items }));
}

function Menu({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loginPrompt, setLoginPrompt] = useState(false);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const getNumericPrice = (priceString) => {
    return parseInt(priceString.replace(/[^\d]/g, ""), 10);
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedOption = localStorage.getItem("orderOption") || "delivery";
  const selectedBranch = safeParseSelectedBranch();
  const locationText = localStorage.getItem("locationText") || "";

  const handleAddToBasket = (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setLoginPrompt(true);
      return;
    }

    if (selectedOption === "pickup" && !selectedBranch) {
      toast.error("Салбар сонгоогүй байна. Салбар сонгоно уу.");
      return;
    }

    if (
      selectedOption === "delivery" &&
      (!locationText || locationText.trim() === "")
    ) {
      toast.error(
        "Байршил тодорхойлогдоогүй байна. Байршил авах эсвэл оруулна уу."
      );
      return;
    }

    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const confirmAddToBasket = () => {
    if (selectedItem) {
      addToCart(selectedItem);
      setShowConfirmDialog(false);
      setShowSuccess(true);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSelectedItem(null);
  };

  const handleGoToOrders = () => {
    navigate("/orders");
  };

  const addToCart = (product) => {
    addOrder(product, quantity);
    toast.success("Сагсанд нэмэгдлээ");
  };

  useEffect(() => {
    fetch(`${BASE_URL}api/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setMenu(groupByCategory(json.data));
        } else {
          setMenu([]);
          console.warn("API returned success false or data is not array");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (menu.length === 0)
    return <div className="text-center mt-20">No menu items found</div>;

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-44 mt-8 sm:mt-12">
      {menu.map((category, idx) => (
        <div key={idx} className="mb-12">
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6 ml-2 sm:ml-6 text-start">{category.title}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-9">
            {category.items.map((item, index) => (
              <div
                key={index}
                className="group bg-[#F9F9F9] border overflow-hidden rounded-md shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 sm:h-48 md:h-56 object-cover"
                />
                <div className="p-4 transition-all duration-300">
                  <h2 className="text-md font-bold">{item.name}</h2>
                  <p className="text-red-600 font-bold text-lg sm:text-xl">
                    {item.price}
                  </p>
                  <div className="mt-2 sm:mt-[-20px] opacity-100 sm:opacity-0 sm:max-h-0 sm:group-hover:opacity-100 sm:group-hover:max-h-40 transition-all duration-300 overflow-hidden">
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <button
                      className="w-full h-[40px] px-3 py-1 mt-3 bg-[#D81E1E] text-white text-sm font-bold rounded hover:bg-red-700"
                      onClick={() => handleAddToBasket(item)}
                    >
                      Сагсанд хийх
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Modal
        open={loginPrompt}
        footer={null}
        centered
        onCancel={() => setLoginPrompt(false)}
        styles={{
          body: { padding: 24, textAlign: "center" },
        }}
      >
        <Title level={4}>Нэвтрэх шаардлагатай</Title>
        <Paragraph>Үргэлжлэхийн тулд эхлээд нэвтэрнэ үү.</Paragraph>
        <Button
          type="primary"
          danger
          onClick={() => {
            setLoginPrompt(false);
            navigate("/");
          }}
        >
          Нэвтрэх
        </Button>
      </Modal>

      <Modal
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        footer={null}
        width={600}
        centered
        styles={{
          body: { padding: 24 },
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={icon} alt={selectedItem?.name} className="w-6 h-6" />
          <Title level={3} style={{ margin: 0 }}>
            Захиалга
          </Title>
        </div>

        {selectedItem && (
          <Row gutter={24} align="middle">
            {/* Image Section */}
            <Col xs={24} md={10}>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 12,
                  objectFit: "cover",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Col>

            {/* Info Section */}
            <Col xs={24} md={14}>
              <Title level={4} style={{ marginBottom: 2, marginTop: 0 }}>
                {selectedItem.name}
              </Title>
              <Text strong style={{ fontSize: 16 }}>
                {getNumericPrice(selectedItem.price).toLocaleString()} ₮
              </Text>
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                {selectedItem.description}
              </Paragraph>

              {/* Quantity Controls */}
              <div
                style={{ display: "flex", alignItems: "center", marginTop: 16 }}
              >
                <Button shape="circle" onClick={decreaseQuantity}>
                  −
                </Button>
                <span style={{ margin: "0 16px", fontSize: 18 }}>
                  {quantity}
                </span>
                <Button shape="circle" onClick={increaseQuantity}>
                  +
                </Button>
              </div>

              {/* Total & Action Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <Text strong style={{ fontSize: 20, color: "#D81E1E" }}>
                  {(
                    getNumericPrice(selectedItem.price) * quantity
                  ).toLocaleString()}{" "}
                  ₮
                </Text>
                <Button type="primary" danger onClick={confirmAddToBasket}>
                  Сагсанд хийх
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Modal>

      {/* Success Dialog */}
      {showSuccess && (
        <Modal
          open={showSuccess}
          footer={null}
          centered
          closable={false}
          styles={{
            body: { padding: 24, textAlign: "center" },
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <Title level={3} style={{ color: "#D81E1E", marginBottom: 16 }}>
            Сагсанд хийлээ
          </Title>
          <Paragraph style={{ marginBottom: 24 }}>
            Таны сагсанд амжилттай хийлэээ.
          </Paragraph>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Button onClick={handleContinueShopping} type="default">
              Бүтээгдэхүүн нэмэх
            </Button>
            <Button onClick={handleGoToOrders} type="primary" danger>
              Захиалга дуусгах
            </Button>
          </div>
        </Modal>
      )}

      {/* Toast container to display toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Menu;
