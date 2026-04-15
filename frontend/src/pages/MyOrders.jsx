import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Typography,
  Divider,
  Empty,
  Modal,
  InputNumber,
  Button,
  message,
  Space,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
const { Title, Text } = Typography;

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const calculateTotal = () =>
    orders.reduce((total, order) => {
      const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
      return total + cleanPrice * order.quantity;
    }, 0);

  const handleSaveEdit = () => {
    if (editingOrder) {
      const updatedOrders = orders.map((order) =>
        order.name === editingOrder.name ? editingOrder : order
      );
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setEditingOrder(null);
      message.success("Захиалга амжилттай шинэчлэгдлээ");
    }
  };

  const handleDelete = (order) => {
    setDeleteConfirmOrder(order);
  };

  const confirmDelete = () => {
    if (deleteConfirmOrder) {
      const updatedOrders = orders.filter(
        (order) => order.name !== deleteConfirmOrder.name
      );
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setDeleteConfirmOrder(null);
      message.success("Захиалга амжилттай устгагдлаа");
    }
  };

  const handleQuantityChange = (order, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedOrders = orders.map((item) =>
      item.name === order.name ? { ...item, quantity: newQuantity } : item
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const totalAmount = calculateTotal();

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,0.12),transparent_20%),linear-gradient(180deg,#fffaf6_0%,#f8f2ee_55%,#fff_100%)] px-4 py-20">
          <Card className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl">
            <Empty
              description="Таны сагс хоосон байна"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              className="mt-6 rounded-full bg-[#D81E1E] border-[#D81E1E]"
              onClick={() => navigate("/")}
            >
              Бүтээгдэхүүн сонгох
            </Button>
          </Card>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,0.12),transparent_20%),linear-gradient(180deg,#fffaf6_0%,#f8f2ee_55%,#fff_100%)] pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 overflow-hidden rounded-[32px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Таны захиалга</p>
                <Title className="!mb-0 text-slate-950">Сагс</Title>
              </div>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:border-slate-300"
              >
                Буцах
              </Button>
            </div>
            <p className="mt-4 max-w-2xl text-slate-600">
              Захиалгын сагсандаа нэмсэн бүтээгдэхүүнүүд, тоо ширхэг, нийт дүнг эндээс хялбархан засварлана.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <List
                grid={{ gutter: 24, column: 1 }}
                dataSource={orders}
                renderItem={(order, index) => {
                  const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
                  const total = cleanPrice * order.quantity;

                  return (
                    <List.Item key={index}>
                      <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                        <Row align="middle" gutter={24}>
                          <Col xs={24} sm={6}>
                            <img
                              src={order.image}
                              alt={order.name}
                              className="h-32 w-full rounded-3xl object-cover"
                            />
                          </Col>
                          <Col xs={24} sm={12}>
                            <Title level={4} className="!mb-2 text-slate-950">
                              {order.name}
                            </Title>
                            <Text className="text-base text-slate-600">
                              {order.price} × {order.quantity}
                            </Text>
                          </Col>
                          <Col xs={24} sm={6}>
                            <div className="flex flex-col gap-4 items-end">
                              <Text strong className="text-lg text-slate-900">
                                {total.toLocaleString()}₮
                              </Text>
                              <Space>
                                <Button
                                  icon={<MinusOutlined />}
                                  onClick={() =>
                                    handleQuantityChange(order, order.quantity - 1)
                                  }
                                  disabled={order.quantity <= 1}
                                />
                                <Text className="min-w-[40px] text-center text-lg font-semibold">
                                  {order.quantity}
                                </Text>
                                <Button
                                  icon={<PlusOutlined />}
                                  onClick={() =>
                                    handleQuantityChange(order, order.quantity + 1)
                                  }
                                />
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDelete(order)}
                                />
                              </Space>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  );
                }}
              />
            </div>

            <Card className="rounded-[32px] border border-slate-200 bg-[#fff7f3] p-6 shadow-xl">
              <Title level={4} className="text-slate-950">Товч захиалга</Title>
              <Divider className="my-5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Тоо ширхэг</span>
                  <span>{orders.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Нийт дүн</span>
                  <span>{totalAmount.toLocaleString()}₮</span>
                </div>
              </div>
              <Divider className="my-5" />
              <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
                <span>Төлбөрийн дүн</span>
                <span>{totalAmount.toLocaleString()}₮</span>
              </div>
              <Button
                type="primary"
                size="large"
                className="mt-8 w-full rounded-full bg-[#D81E1E] border-[#D81E1E]"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  const orderOption =
                    localStorage.getItem("orderOption") || "delivery";
                  const route = orderOption === "delivery" ? "/qpay" : "/qpayy";
                  navigate(route, { state: { amount: totalAmount } });
                }}
              >
                Захиалга хийх
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="Захиалга засах"
        open={editingOrder !== null}
        onOk={handleSaveEdit}
        onCancel={() => setEditingOrder(null)}
        okText="Хадгалах"
        cancelText="Болих"
        style={{ top: 20 }}
      >
        {editingOrder && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>Бүтээгдэхүүн:</Text>
              <Text className="ml-2">{editingOrder.name}</Text>
            </div>
            <div>
              <Text strong>Тоо ширхэг:</Text>
              <InputNumber
                min={1}
                value={editingOrder.quantity}
                onChange={(value) =>
                  setEditingOrder({ ...editingOrder, quantity: value })
                }
                className="ml-2"
              />
            </div>
            <div>
              <Text strong>Нэгж үнэ:</Text>
              <Text className="ml-2">{editingOrder.price}</Text>
            </div>
            <div>
              <Text strong>Нийт үнэ:</Text>
              <Text className="ml-2">
                {(
                  Number(editingOrder.price.replace(/[,₮]/g, "")) *
                  editingOrder.quantity
                ).toLocaleString()}
                ₮
              </Text>
            </div>
          </Space>
        )}
      </Modal>

      <Modal
        title="Захиалга устгах"
        open={deleteConfirmOrder !== null}
        onOk={confirmDelete}
        onCancel={() => setDeleteConfirmOrder(null)}
        okText="Тийм"
        cancelText="Үгүй"
      >
        <p>Та {deleteConfirmOrder?.name} захиалгыг устгахдаа итгэлтэй байна уу?</p>
      </Modal>

      <Footer />
    </>
  );
}

export default MyOrders;
