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
  EditOutlined,
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

  const calculateTotal = () => {
    return orders.reduce((total, order) => {
      const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
      return total + cleanPrice * order.quantity;
    }, 0);
  };

  // const handleEdit = (order) => {
  //   setEditingOrder({ ...order });
  // };

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

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Empty
            description="Таны сагс хоосон байна"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="mt-4"
            style={{ backgroundColor: "#D81E1E", borderColor: "#D81E1E" }}
            onClick={() => navigate("/")}
          >
            Бүтээгдэхүүн сонгох
          </Button>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-6xl mx-auto mb-72">
        <div className="flex items-center mb-6 ">
          <Button
            size="large"
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          ></Button>
          <Title level={2} className="!mb-0 ml-8">
            Таны сагс
          </Title>
        </div>

        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={orders}
          renderItem={(order, index) => {
            const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
            const total = cleanPrice * order.quantity;

            return (
              <List.Item key={index}>
                <Card
                  variant="outlined"
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <Row align="middle" gutter={24}>
                    <Col xs={24} sm={6}>
                      <img
                        src={order.image}
                        alt={order.name}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Title level={4} className="!mb-2">
                        {order.name}
                      </Title>
                      <Text type="secondary" className="text-base">
                        {order.price} × {order.quantity}
                      </Text>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Space
                        direction="vertical"
                        align="end"
                        style={{ width: "100%" }}
                      >
                        <Space>
                          <Text strong className="text-lg mr-7">
                            {total.toLocaleString()}₮
                          </Text>
                          <Button
                            icon={<MinusOutlined />}
                            style={{ marginRight: 4 }}
                            onClick={() =>
                              handleQuantityChange(order, order.quantity - 1)
                            }
                            disabled={order.quantity <= 1}
                          />

                          <Text
                            strong
                            className="text-lg min-w-[40px] text-center"
                          >
                            {order.quantity}
                          </Text>

                          <Button
                            icon={<PlusOutlined />}
                            style={{ marginRight: 4 }}
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
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />

        <Card className="mt-6">
          <Row gutter={24} align="middle">
            <Col xs={24} sm={12}>
              <Statistic
                title="Нийт захиалга"
                value={orders.length}
                suffix="ширхэг"
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Нийт дүн"
                value={calculateTotal()}
                suffix="₮"
                valueStyle={{ color: "#D81E1E" }}
              />
            </Col>
          </Row>
          <Divider />
          <div className="flex justify-end gap-4">
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#D81E1E", borderColor: "#D81E1E" }}
              icon={<ShoppingCartOutlined />}
              onClick={() => {
                const totalAmount = calculateTotal();
                navigate("/qpay", { state: { amount: totalAmount } });
              }}
            >
              Захиалга хийх
            </Button>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Захиалга засах"
        open={editingOrder !== null}
        onOk={handleSaveEdit}
        onCancel={() => setEditingOrder(null)}
        okText="Хадгалах"
        cancelText="Болих"
        styles={{
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="Захиалга устгах"
        open={deleteConfirmOrder !== null}
        onOk={confirmDelete}
        onCancel={() => setDeleteConfirmOrder(null)}
        okText="Тийм"
        cancelText="Үгүй"
        styles={{
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <p>
          Та {deleteConfirmOrder?.name} захиалгыг устгахдаа итгэлтэй байна уу?
        </p>
      </Modal>
      <Footer />
    </>
  );
}

export default MyOrders;
