import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Input, Radio, Typography, Card, Divider, Select, Space, Badge } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../constants.js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const { Title, Text, Paragraph } = Typography;
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
  const selectedBranch = (() => {
    try {
      return JSON.parse(localStorage.getItem("selectedBranch") || "null");
    } catch {
      return null;
    }
  })();
  const branchName = selectedBranch?.name || "Сонгогдоогүй салбар";
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
    if (!selectedBranch) {
      toast.error("Салбарыг сонгоно уу.");
      return false;
    }
    return true;
  };

  const totalAmount = orders.reduce((sum, item) => {
    const numericPrice = parseInt(String(item.price).replace(/[^\d]/g, ""), 10) || 0;
    return sum + numericPrice * item.quantity;
  }, 0);

  const amountUSD = (totalAmount / 3500).toFixed(2);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (selectedPayment === "paypal") {
      toast.info("PayPal төлбөрийг доорх товчоор гүйцээнэ үү.");
      return;
    }

    const orderData = {
      note,
      extraPhone,
      paymentMethod: selectedPayment,
      personType,
      address: branchName,
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
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,0.14),transparent_18%),linear-gradient(180deg,#fffaf6_0%,#fdf7f1_56%,#fff_100%)] min-h-screen pb-24 pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Space align="center" size="middle">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')} />
                <Title level={2} className="!mb-0">Төлбөр төлөх</Title>
              </Space>
              <Paragraph className="mt-3 max-w-2xl text-slate-600">
                Очиж авах захиалгын төлбөрийг сонгосон төлбөрийн аргаар гүйцэтгэнэ.
              </Paragraph>
            </div>
            <div className="rounded-[24px] bg-[#fff4ed] px-5 py-4 text-slate-900 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-[#D81E1E]">Салбар</p>
              <p className="mt-2 text-lg font-semibold">{branchName}</p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.85fr]">
            <div className="space-y-8">
              <Card className="rounded-[32px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <div className="space-y-6">
                  <div>
                    <Title level={4} className="mb-2">Төлбөрийн мэдээлэл</Title>
                    <Paragraph className="text-slate-600">
                      Захиалгын утгууд болон холбоо барих мэдээллээ оруулна уу.
                    </Paragraph>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      size="large"
                      placeholder="Утасны дугаар"
                      value={extraPhone}
                      onChange={(e) => setExtraPhone(e.target.value)}
                    />
                    <Select
                      size="large"
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

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Төлбөрийн төрөл</p>
                    <Space className="mt-3" direction="vertical" size="middle">
                      <Radio.Group
                        onChange={(e) => setPersonType(e.target.value)}
                        value={personType}
                        className="flex flex-col gap-3 sm:flex-row"
                      >
                        <Radio value="individual">Хувь хүн</Radio>
                        <Radio value="company">Байгууллага</Radio>
                      </Radio.Group>
                    </Space>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[32px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <div className="space-y-6">
                  <div>
                    <Title level={4} className="mb-2">Төлбөрийн аргууд</Title>
                    <Paragraph className="text-slate-600">
                      Та Qpay эсвэл карт төлбөрийн аль нэгийг сонгон захиалгаа дуусгана.
                    </Paragraph>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Button
                      type={selectedPayment === "qpay" ? "primary" : "default"}
                      size="large"
                      className={selectedPayment === "qpay" ? "bg-red-600 text-white" : ""}
                      onClick={() => setSelectedPayment("qpay")}
                    >
                      Qpay
                    </Button>
                    <Button
                      type={selectedPayment === "paypal" ? "primary" : "default"}
                      size="large"
                      className={selectedPayment === "paypal" ? "bg-yellow-500 text-white" : ""}
                      onClick={() => setSelectedPayment("paypal")}
                    >
                      Card
                    </Button>
                  </div>

                  {selectedPayment === "qpay" && randomQR && (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center">
                      <Badge color="#D81E1E" text="Qpay QR код" />
                      <img
                        src={randomQR}
                        alt="Qpay QR Code"
                        className="mx-auto mt-6 h-52 w-52 object-contain"
                      />
                      <Paragraph className="mt-4 text-slate-600">
                        Энэ QR кодыг Qpay апп дээр уншуулан төлбөрөө гүйцэтгэнэ.
                      </Paragraph>
                    </div>
                  )}

                  {selectedPayment === "paypal" && (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6">
                      <Badge color="#2a7ad8" text="PayPal" />
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

                  <Button type="primary" size="large" block onClick={handleSubmit}>
                    Төлбөр төлөх
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="rounded-[32px] border border-slate-200 bg-[#fff4ed] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="space-y-6">
                <div>
                  <Title level={4}>Захиалгын тойм</Title>
                  <Paragraph className="text-slate-600">
                    Худалдан авалтын дүн болон захиалгын мэдээллийг шалгана уу.
                  </Paragraph>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-[24px] bg-white p-6 text-center text-slate-500">
                    Сагс хоосон байна.
                  </div>
                ) : (
                  orders.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-[24px] bg-white p-4 shadow-sm">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <Text strong>{item.name}</Text>
                        <Paragraph className="mb-0 text-sm text-slate-500">x{item.quantity}</Paragraph>
                      </div>
                      <Text strong>{item.price}</Text>
                    </div>
                  ))
                )}

                <Divider />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Хүргэлтийн үнэ</span>
                    <span>0₮</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Купон</span>
                    <span>0₮</span>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-between text-lg font-semibold text-slate-900">
                  <span>Нийт</span>
                  <span>{totalAmount.toLocaleString()}₮</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </>
  );
}

export default Qpay;
