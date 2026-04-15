import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";
import icon from "/assets/cart.png";
import { Modal, Row, Col, Button, Typography } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text, Paragraph } = Typography;

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
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedOption = localStorage.getItem("orderOption") || "delivery";
  const selectedBranch = safeParseSelectedBranch();
  const locationText = localStorage.getItem("locationText") || "";

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const getNumericPrice = (priceString) => {
    return parseInt(priceString.replace(/[^\d]/g, ""), 10);
  };

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

    if (selectedOption === "delivery" && !locationText.trim()) {
      toast.error("Байршил тодорхойлогдоогүй байна. Байршил авах эсвэл оруулна уу.");
      return;
    }

    setSelectedItem(item);
    setQuantity(1);
    setShowConfirmDialog(true);
  };

  const addToCart = (product) => {
    addOrder(product, quantity);
    toast.success("Сагсанд нэмэгдлээ");
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
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20 text-slate-600">Loading...</div>;
  if (menu.length === 0)
    return <div className="text-center mt-20 text-slate-600">No menu items found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 mt-8 sm:mt-12">
      {menu.map((category, idx) => (
        <section key={idx} className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">{category.title}</h2>
            <span className="rounded-full bg-[#FFF0E7] px-3 py-1 text-sm font-semibold text-[#B94200]">
              Нийт {category.items.length}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item, index) => (
              <article key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-64 overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-lg font-bold text-[#D81E1E]">{item.price}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{item.description}</p>
                  <button
                    onClick={() => handleAddToBasket(item)}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#D81E1E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B11616]"
                  >
                    Сагсанд хийх
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <Modal
        open={loginPrompt}
        footer={null}
        centered
        onCancel={() => setLoginPrompt(false)}
        style={{ textAlign: "center" }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={4}>Нэвтрэх шаардлагатай</Title>
        <Paragraph>Үргэлжлэхийн тулд эхлээд нэвтэрнэ үү.</Paragraph>
        <Button type="primary" danger onClick={() => {
          setLoginPrompt(false);
          navigate("/");
        }}>
          Нэвтрэх
        </Button>
      </Modal>

      <Modal
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        footer={null}
        width={600}
        centered
        style={{ textAlign: "center" }}
        bodyStyle={{ padding: 24 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <img src={icon} alt={selectedItem?.name} className="h-7 w-7" />
          <Title level={3} style={{ margin: 0 }}>Захиалга</Title>
        </div>

        {selectedItem && (
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={10}>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="h-40 w-full rounded-[20px] object-cover"
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={4} style={{ margin: 0 }}>{selectedItem.name}</Title>
              <Text strong style={{ fontSize: 16, display: 'block', marginTop: 8 }}>
                {getNumericPrice(selectedItem.price).toLocaleString()} ₮
              </Text>
              <Paragraph type="secondary" style={{ marginTop: 10 }}>{selectedItem.description}</Paragraph>

              <div className="mt-5 flex items-center gap-4">
                <Button type="default" shape="circle" onClick={decreaseQuantity} disabled={quantity <= 1}>−</Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button type="default" shape="circle" onClick={increaseQuantity}>+</Button>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <Text strong style={{ fontSize: 20, color: "#D81E1E" }}>
                  {(getNumericPrice(selectedItem.price) * quantity).toLocaleString()} ₮
                </Text>
                <Button type="primary" danger onClick={confirmAddToBasket}>
                  Сагсанд хийх
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Modal>

      {showSuccess && (
        <Modal
          open={showSuccess}
          footer={null}
          centered
          closable={false}
          style={{ textAlign: "center" }}
          bodyStyle={{ padding: 24 }}
        >
          <Title level={3} style={{ color: "#D81E1E", marginBottom: 16 }}>Сагсанд хийлээ</Title>
          <Paragraph style={{ marginBottom: 24 }}>Таны сагсанд амжилттай нэмэгдлээ.</Paragraph>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={handleContinueShopping} type="default">Бүтээгдэхүүн нэмэх</Button>
            <Button onClick={handleGoToOrders} type="primary" danger>Захиалга дуусгах</Button>
          </div>
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Menu;
