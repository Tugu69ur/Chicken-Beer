import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Input, Radio, Tabs, Typography, Card, Divider } from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const { TextArea } = Input;
const { Title, Text } = Typography;

function Qpay() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [personType, setPersonType] = useState("individual");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const [phone, setPhone] = useState("");
  const [entrance, setEntrance] = useState("");
  const [code, setCode] = useState("");
  const [door, setDoor] = useState("");
  const [note, setNote] = useState("");

  const exchangeRate = 3500;
  
  const totalAmount = orders.reduce((sum, item) => {
    const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""), 10);
    return sum + numericPrice * item.quantity;
  }, 0);

  const amountUSD = (totalAmount / exchangeRate).toFixed(2);

  const [extraPhone, setExtraPhone] = useState("");
  const location =
    localStorage.getItem("locationText") || "Хаяг тодорхойлогдоогүй";

  // Array of QR code image paths (update with your actual images)
  const qpayQRCodes = [
    "/qr.png",
  ];

  // State to hold random QR code when qpay is selected
  const [randomQR, setRandomQR] = useState(null);

  useEffect(() => {
    if (selectedPayment === "qpay") {
      const randomIndex = Math.floor(Math.random() * qpayQRCodes.length);
      setRandomQR(qpayQRCodes[randomIndex]);
    } else {
      setRandomQR(null);
    }
  }, [selectedPayment]);

  const validateForm = () => {
    if (!phone || !entrance || !code || !door) {
      toast.error("Бүх талбарыг бүрэн бөглөнө үү");
      return false;
    }
    if (!selectedPayment) {
      toast.error("Төлбөрийн хэлбэр сонгоно уу");
      return false;
    }
    if (!personType) {
      toast.error("Төлбөрийн төрөл сонгоно уу");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (selectedPayment === "paypal") {
      toast.info("Please complete the payment via PayPal button below.");
      return;
    }

    console.log({
      phone,
      entranceOrCompany: entrance,
      code,
      door,
      note,
      extraPhone,
      paymentMethod: selectedPayment,
      personType,
    });

    toast.success("Төлбөр амжилттай илгээгдлээ!");
  };

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-6xl mx-auto mb-52">
        <div className="flex items-center mb-6">
          <Button
            size="large"
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/orders")}
          />
          <Title level={2} className="!mb-0 ml-8">
            Захиалга
          </Title>
        </div>

        <div className="flex flex-col md:flex-row gap-24 mt-10">
          <div className="flex-1">
            <Title level={4}>
              <HomeOutlined className="mr-2" />
              Хүргэлтийн захиалга
            </Title>

            <Text strong>Хаяг: </Text>
            <Text>{location}</Text>

            <Tabs activeKey={tab} onChange={setTab} className="mt-2">
              <Tabs.TabPane tab="Орон сууц" key="home" />
              <Tabs.TabPane tab="Оффис" key="office" />
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                placeholder="Утасны дугаар"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {tab === "office" ? (
                <Input
                  placeholder="Байгууллагын нэр"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                />
              ) : (
                <Input
                  placeholder="Орцны дугаар"
                  value={entrance}
                  onChange={(e) => setEntrance(e.target.value)}
                />
              )}
              <Input
                placeholder="Орцны код"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Input
                placeholder="Хаалганы дугаар"
                value={door}
                onChange={(e) => setDoor(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <TextArea
                rows={2}
                placeholder="Хаягийн тайлбар"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Input
                className="mt-2"
                placeholder="Нэмэлт утасны дугаар"
                value={extraPhone}
                onChange={(e) => setExtraPhone(e.target.value)}
              />
            </div>

            {/* Person Type */}
            <div className="mt-6">
              <Text strong>Төлбөрийн төрөл</Text>
              <div className="mt-2">
                <Radio.Group
                  onChange={(e) => setPersonType(e.target.value)}
                  value={personType}
                >
                  <Radio value="individual">Хувь хүн</Radio>
                  <Radio value="company">Байгууллага</Radio>
                </Radio.Group>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <Text strong>Төлбөрийн хэлбэр</Text>
              <div className="mt-2 flex gap-4">
                <Button
                  type={selectedPayment === "qpay" ? "primary" : "default"}
                  size="large"
                  className={
                    selectedPayment === "qpay" ? "bg-red-600 text-white" : ""
                  }
                  onClick={() => setSelectedPayment("qpay")}
                >
                  Qpay
                </Button>

                <Button
                  type={selectedPayment === "paypal" ? "primary" : "default"}
                  size="large"
                  className={
                    selectedPayment === "paypal"
                      ? "bg-yellow-500 text-white"
                      : ""
                  }
                  onClick={() => setSelectedPayment("paypal")}
                >
                  Card
                </Button>
              </div>
            </div>

            {/* Show random QR code when Qpay is selected */}
            {selectedPayment === "qpay" && randomQR && (
              <div className="mt-6 flex justify-center">
                <img
                  src={randomQR}
                  alt="Qpay QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            )}

            {/* PayPal Buttons */}
            {selectedPayment === "paypal" && (
              <div className="mt-6">
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "AUT2RUGAsNVG2RoDVeyI2S_a7RrfL7K_y8qWloWjPOorgG7AdWPVAxAkHvA_T72EhsUKLrf8fs766JBo",
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: amountUSD,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      toast.success(
                        `Төлбөр амжилттай! Транзакцийн ID: ${details.id}`
                      );
                      console.log("Payment approved: ", details);
                    }}
                    onError={(err) => {
                      toast.error("Төлбөр хийхэд алдаа гарлаа.");
                      console.error("PayPal error:", err);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {/* Submit button for other payment methods */}
            {selectedPayment !== "paypal" && (
              <Button
                type="primary"
                size="large"
                block
                className="mt-4"
                onClick={handleSubmit}
              >
                Төлбөр төлөх
              </Button>
            )}
          </div>

          <Card className="w-full md:w-80" bordered>
            <Title level={5}>Таны бүтээгдэхүүн</Title>

            {orders.length === 0 ? (
              <Text>Сагс хоосон байна.</Text>
            ) : (
              orders.map((item, index) => (
                <div className="flex items-center mb-4" key={index}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-16 object-cover mr-4"
                  />
                  <div className="flex-1">
                    <Text className="block">
                      {item.name} x{item.quantity}
                    </Text>
                    <Text strong>{item.price}</Text>
                  </div>
                </div>
              ))
            )}

            <Divider />

            <div className="flex justify-between">
              <Text>Хүргэлтийн үнэ</Text>
              <Text>0₮</Text>
            </div>
            <div className="flex justify-between">
              <Text>Купон</Text>
              <Text>0₮</Text>
            </div>

            <Divider />

            <div className="flex justify-between">
              <Text strong>Нийт</Text>
              <Text strong className="text-red-600">
                {totalAmount.toLocaleString()}₮
              </Text>
            </div>
          </Card>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </>
  );
}

export default Qpay;
