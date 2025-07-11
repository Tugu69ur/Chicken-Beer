import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Card,
  Typography,
  List,
  Spin,
  Alert,
  Divider,
  Tag,
  Space,
  Image,
  Row,
  Col,
  Badge,
} from "antd";
import axios from "axios";
import { BASE_URL } from "../../../constants";

const { Title, Text } = Typography;

function ClientDashboard() {
  const [userBranch, setUserBranch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.branch) {
      setError("Салбарын мэдээлэл олдсонгүй.");
      return;
    }

    setUserBranch(user.branch);
    setLoading(true);
    setError(null);

    axios
      .get(`${BASE_URL}api/orderss`)
      .then((res) => {
        // Filter orders by address matching user.branch
        const branchOrders = res.data.filter(
          (order) => order.address === user.branch
        );
        setOrders(branchOrders);
      })
      .catch((err) => {
        console.error(err);
        setError("Захиалгуудыг татахад алдаа гарлаа.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="p-8 max-w-7xl mx-auto"
        style={{ minHeight: "80vh", backgroundColor: "#fafafa" }}
      >
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: 36, color: "#222" }}
        >
          Таны салбар: {userBranch || "Тодорхойгүй"}
        </Title>

        {loading && (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <Spin size="large" />
          </div>
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 32, maxWidth: 600, margin: "0 auto" }}
            showIcon
          />
        )}

        {!loading && !error && orders.length === 0 && (
          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 80,
              fontSize: 18,
              fontWeight: "500",
              color: "#555",
            }}
          >
            Таны салбарт захиалга алга
          </Text>
        )}

        {!loading && !error && orders.length > 0 && (
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
            }}
            dataSource={orders}
            renderItem={(order) => {
              const orderDate = new Date(order.createdAt).toLocaleString(
                "mn-MN",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <List.Item key={order._id}>
                  <Card
                    title={
                      <>
                        Захиалга ID:{" "}
                        <Text keyboard>{order._id.substring(0, 8)}</Text>
                      </>
                    }
                    bordered={false}
                    hoverable
                    style={{
                      borderRadius: 12,
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.1), 0 0 6px rgba(0,0,0,0.05)",
                      backgroundColor: "#fff",
                    }}
                    extra={
                      <Tag
                        color={
                          order.paymentMethod === "qpay"
                            ? "volcano"
                            : "gold"
                        }
                        style={{ fontWeight: "bold", fontSize: 14 }}
                      >
                        {order.paymentMethod?.toUpperCase() || "UNKNOWN"}
                      </Tag>
                    }
                  >
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "340px" }}
                    >
                      <Row justify="space-between" style={{ fontSize: 15 }}>
                        <Col xs={24} sm={12}>
                          <Text strong>Захиалагчийн утас:</Text>{" "}
                          {order.extraPhone || "Тодорхойгүй"}
                        </Col>
                        <Col xs={24} sm={12}>
                          <Text strong>Төлбөрийн төрөл:</Text>{" "}
                          {order.personType || "Тодорхойгүй"}
                        </Col>
                      </Row>

                      <Row justify="space-between" style={{ fontSize: 15 }}>
                        <Col xs={24} sm={12}>
                          <Text strong>Очиж авах цаг:</Text>{" "}
                          {order.note || "Тодорхойгүй"}
                        </Col>
                        <Col xs={24} sm={12}>
                          <Text strong>Хаяг:</Text> {order.address || "Тодорхойгүй"}
                        </Col>
                      </Row>

                      <Row style={{ fontSize: 15 }}>
                        <Col>
                          <Text strong>Захиалсан огноо:</Text> {orderDate}
                        </Col>
                      </Row>

                      <Divider>Бараанууд</Divider>

                      <List
                        dataSource={order.orders}
                        itemLayout="horizontal"
                        renderItem={(item) => (
                          <List.Item style={{ paddingLeft: 0 }}>
                            <List.Item.Meta
                              avatar={
                                <div
                                  style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    backgroundColor: "#f0f0f0",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "cover" }}
                                    preview={false}
                                    fallback="/fallback-image.png"
                                  />
                                </div>
                              }
                              title={
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    fontSize: 16,
                                  }}
                                >
                                  {item.name}
                                </Text>
                              }
                              description={
                                <>
                                  <Text>Үнэ: </Text>
                                  <Text strong>{item.price}</Text>
                                  <br />
                                  <Text>Тоо ширхэг: </Text>
                                  <Text strong>{item.quantity}</Text>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Space>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default ClientDashboard;
