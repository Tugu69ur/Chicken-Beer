import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {
  Button,
  Input,
  Radio,
  Tabs,
  Space,
  Typography,
  Card,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
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

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-24 mt-10">
          {/* Left Section - Form */}
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
              <Input placeholder="Утасны дугаар" required />
              <Input placeholder="Орцны дугаар" />
              <Input placeholder="Орцны код" required />
              <Input placeholder="Хаалганы дугаар" />
            </div>

            <div className="mt-4">
              <TextArea rows={2} placeholder="Хаягийн тайлбар" />
              <Input className="mt-2" placeholder="Нэмэлт утасны дугаар" />
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
                  type="default"
                  icon={<CreditCardOutlined />}
                  size="large"
                >
                  Карт
                </Button>
                <Button type="default" size="large">
                  Social Pay
                </Button>
                <Button type="default" size="large">
                  Monpay
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Cart Summary */}
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
              <Text strong className="text-red-600">40,000₮</Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              className="mt-4 bg-red-600"
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
