import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Button, Input, Radio, Tabs, Typography, Card, Divider } from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Footer from "../components/Footer.jsx";

const { TextArea } = Input;
const { Title, Text } = Typography;

function Qpay() {
  const navigate = useNavigate();
  const [personType, setPersonType] = useState("individual");
  const [tab, setTab] = useState("home");
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Form inputs
  const [phone, setPhone] = useState("");
  const [entrance, setEntrance] = useState("");
  const [code, setCode] = useState("");
  const [door, setDoor] = useState("");
  const [note, setNote] = useState("");
  const [extraPhone, setExtraPhone] = useState("");

  const logInfo = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    console.log(
      "Selected Payment:",
      paymentMethod === "qpay" ? "Qpay" : "Card"
    );
    console.log("Person Type:", personType);
    console.log("Tab:", tab === "home" ? "Орон сууц" : "Оффис");
    console.log({
      phone,
      entranceOrCompany: entrance,
      code,
      door,
      note,
      extraPhone,
    });
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
            <Text>bashyo</Text>

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

            <div className="mt-6">
              <Text strong>Төлбөрийн хэлбэр</Text>
              <div className="mt-2">
                <Radio.Group
                  onChange={(e) => setPersonType(e.target.value)}
                  value={personType}
                >
                  <Radio value="individual">Хувь хүн</Radio>
                  <Radio value="company">Байгууллага</Radio>
                </Radio.Group>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  type={selectedPayment === "qpay" ? "primary" : "default"}
                  size="large"
                  className={
                    selectedPayment === "qpay" ? "bg-red-600 text-white" : ""
                  }
                  onClick={() => logInfo("qpay")}
                >
                  Qpay
                </Button>
                <Button
                  type={selectedPayment === "card" ? "primary" : "default"}
                  icon={<CreditCardOutlined />}
                  size="large"
                  className={
                    selectedPayment === "card" ? "bg-red-600 text-white" : ""
                  }
                  onClick={() => logInfo("card")}
                >
                  Карт
                </Button>
              </div>
            </div>
          </div>

          <Card className="w-full md:w-80" bordered>
            <Title level={5}>Таны бүтээгдэхүүн</Title>
            <div className="flex items-center">
              <img
                src="/random.png"
                alt="food"
                className="w-24 h-16 object-cover mr-10"
              />
              <div>
                <Text className="mr-8">БАГЦx1</Text>
                <br />
              </div>
              <Text strong>40,000₮</Text>
            </div>

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
                40,000₮
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              block
              className="mt-4"
              onClick={() => {
                if (!selectedPayment) {
                  alert("Төлбөрийн хэлбэр сонгоно уу");
                  return;
                }
                logInfo(selectedPayment);
              }}
            >
              Төлбөр төлөх
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Qpay;
