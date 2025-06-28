import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Card, Typography, List, Button, Divider, Spin, Empty } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../constants";

const { Title, Text } = Typography;

function ClientDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}api/orders`);
      if (res.data.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setError("Захиалгын мэдээлэл буруу байна");
        toast.warn("Захиалгын мэдээлэл буруу байна");
      }
    } catch (err) {
      setError("Сервертэй холбогдох үед алдаа гарлаа");
      toast.error("Захиалгыг татаж чадсангүй");
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/orders/${id}`);
      toast.success("Захиалга амжилттай устлаа");
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      toast.error("Захиалгыг устгаж чадсангүй");
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-5xl mx-auto min-h-screen">
        <Title level={2} className="mb-6">
          Захиалгууд
        </Title>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spin size="large" tip="Уншиж байна..." />
          </div>
        ) : error ? (
          <Text type="danger">{error}</Text>
        ) : orders.length === 0 ? (
          <Empty description="Одоогоор захиалга алга" />
        ) : (
          <List
            grid={{ gutter: 24, xs: 1, sm: 1, md: 1, lg: 1 }}
            dataSource={orders}
            renderItem={(order, idx) => (
              <List.Item key={order._id}>
                <Card
                  title={`Захиалга №${idx + 1}`}
                  bordered
                  className="shadow-md w-full"
                  extra={
                    <Button onClick={() => handleDelete(order._id) }>✔️</Button>
                  }
                >
                  <div className="space-y-1">
                    <Text>
                      <b>Утас:</b> {order.phone}
                    </Text>
                    <br />
                    <Text>
                      <b>Нэмэлт утас:</b> {order.extraPhone || "Байхгүй"}
                    </Text>
                    <br />
                    <Text>
                      <b>Орц/Байгууллага:</b> {order.entranceOrCompany}
                    </Text>
                    <br />
                    <Text>
                      <b>Код:</b> {order.code}
                    </Text>
                    <br />
                    <Text>
                      <b>Хаалга:</b> {order.door}
                    </Text>
                    <br />
                    <Text>
                      <b>Тайлбар:</b> {order.note || "Байхгүй"}
                    </Text>
                    <br />
                    <Text>
                      <b>Хаяг:</b> {order.address}
                    </Text>
                    <br />
                    <Text>
                      <b>Төлбөрийн хэлбэр:</b>{" "}
                      {order.paymentMethod?.toUpperCase()}
                    </Text>
                    <br />
                    <Text>
                      <b>Төрөл:</b>{" "}
                      {order.personType === "company"
                        ? "Байгууллага"
                        : "Хувь хүн"}
                    </Text>
                  </div>

                  <Divider />

                  <Title level={5} className="mb-4">
                    Захиалсан бүтээгдэхүүнүүд
                  </Title>

                  {order.orders && order.orders.length > 0 ? (
                    order.orders.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between mb-3"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-16 object-cover rounded-md"
                          />
                          <div>
                            <Text>{item.name}</Text>
                            <br />
                            <Text type="secondary">{item.price}</Text>
                          </div>
                        </div>
                        <Text strong>× {item.quantity}</Text>
                      </div>
                    ))
                  ) : (
                    <Text type="secondary">Бүтээгдэхүүн алга</Text>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ClientDashboard;
