import React, { useEffect, useState } from "react";
import ClientNavbar from "../../components/ClientNavbar";
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
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }
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
      <ClientNavbar />
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <Title level={2} className="text-center text-slate-900">
              Таны салбар: {userBranch || "Тодорхойгүй"}
            </Title>
          </div>

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
                      style={{ width: "100%" }}
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
    </div>
      <Footer />
    </>
  );
}

export default ClientDashboard;
