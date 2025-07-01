import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, Typography, List, Spin, Alert, Divider, Tag, Space, Image } from "antd";
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
        const branchOrders = res.data.filter((order) => order.address === user.branch);
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
      <div className="p-10 max-w-6xl mx-auto">
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Таны салбар: {userBranch || "Тодорхойгүй"}
        </Title>

        {loading && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Spin size="large" />
          </div>
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 24 }}
            showIcon
          />
        )}

        {!loading && !error && orders.length === 0 && (
          <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 40 }}>
            Таны салбарт захиалга алга
          </Text>
        )}

        {!loading && !error && orders.length > 0 && (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={orders}
            renderItem={(order) => {
              const orderDate = new Date(order.createdAt).toLocaleString("mn-MN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <List.Item key={order._id}>
                  <Card
                    title={`Захиалга ID: ${order._id.substring(0, 8)}`}
                    bordered
                    hoverable
                    extra={<Tag color={order.paymentMethod === "qpay" ? "red" : "gold"}>{order.paymentMethod.toUpperCase()}</Tag>}
                  >
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                      <Text><b>Захиалагчийн утас:</b> {order.extraPhone || "Тодорхойгүй"}</Text>
                      <Text><b>Төлбөрийн төрөл:</b> {order.personType || "Тодорхойгүй"}</Text>
                      <Text><b>Очиж авах цаг:</b> {order.note || "Тодорхойгүй"}</Text>
                      <Text><b>Хаяг:</b> {order.address || "Тодорхойгүй"}</Text>
                      <Text><b>Захиалсан огноо:</b> {orderDate}</Text>

                      <Divider>Бараанууд</Divider>

                      <List
                        dataSource={order.orders}
                        itemLayout="horizontal"
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Image
                                  width={80}
                                  src={item.image}
                                  alt={item.name}
                                  style={{ borderRadius: 8, objectFit: "cover" }}
                                  placeholder={
                                    <div style={{ width: 80, height: 80, backgroundColor: "#f0f0f0" }} />
                                  }
                                />
                              }
                              title={item.name}
                              description={
                                <>
                                  <Text>Үнэ: <b>{item.price}</b></Text><br />
                                  <Text>Тоо ширхэг: <b>{item.quantity}</b></Text>
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
