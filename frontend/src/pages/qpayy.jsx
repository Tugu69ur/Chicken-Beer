import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Input, Radio, Typography, Card, Divider, Select } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../constants.js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

function generatePickupTimes() {
  const times = [];
  const now = new Date();
  let currentMinutes = now.getHours() * 60 + now.getMinutes();
  currentMinutes = Math.ceil(currentMinutes / 15) * 15;

  const start = Math.max(currentMinutes, 9 * 60);
  const end = 24 * 60; // 8:00 PM

  for (let t = start; t <= end; t += 15) {
    const hours = Math.floor(t / 60);
    const minutes = t % 60;
    const label = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
    times.push(label);
  }

  return times;
}

function Qpay() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [personType, setPersonType] = useState("individual");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const [note, setNote] = useState(undefined);
  const [extraPhone, setExtraPhone] = useState("");
  const location = localStorage.getItem("selectedBranch");
  const branch = JSON.parse(location);
  const qpayQRCodes = ["/qr.png"];
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
    if (!extraPhone || !note) {
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

  const totalAmount = orders.reduce((sum, item) => {
    const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""), 10);
    return sum + numericPrice * item.quantity;
  }, 0);

  const amountUSD = (totalAmount / 3500).toFixed(2);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (selectedPayment === "paypal") {
      toast.info("Please complete the payment via PayPal button below.");
      return;
    }

    const orderData = {
      note,
      extraPhone,
      paymentMethod: selectedPayment,
      personType,
      address: branch.name,
      orders: orders.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    try {
      const res = await axios.post(`${BASE_URL}api/orderss`, orderData);
      if (res.status === 201 || res.data.success) {
        toast.success("Төлбөр амжилттай илгээгдлээ!");
        setTimeout(() => navigate("/"), 1500);
        localStorage.removeItem("orders");
        setNote("");
        setExtraPhone("");
        setSelectedPayment(null);
        setPersonType("individual");
        setRandomQR(null);
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (err) {
      console.error("Order submit error:", err);
      toast.error("Сервертэй холбогдож чадсангүй.");
    }
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
              Очиж авах захиалга
            </Title>

            <Text strong>Хаяг: </Text>
            <Text>{branch.name}</Text>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="Утасны дугаар"
                rules={[
                  {
                    required: true,
                    message: "Утасны дугаараа оруулна уу",
                  },
                  {
                    pattern: /^\d{8}$/,
                    message: "Утасны дугаар 8 оронтой тоо байх ёстой",
                  },
                ]}
                value={extraPhone}
                onChange={(e) => setExtraPhone(e.target.value)}
              />

              <Select
                className="w-full"
                placeholder="Очиж авах цаг"
                value={note}
                onChange={(value) => setNote(value)}
              >
                {generatePickupTimes().map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
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

            {selectedPayment === "qpay" && randomQR && (
              <div className="mt-6 flex justify-center">
                <img
                  src={randomQR}
                  alt="Qpay QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            )}

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
