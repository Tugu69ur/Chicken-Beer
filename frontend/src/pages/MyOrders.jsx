import React, { useEffect, useState } from "react";
import { List, Card, Typography, Divider, Empty } from "antd";
import Navbar from "../components/Navbar";

const { Title, Text } = Typography;

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  if (!Array.isArray(orders) || orders.length === 0)
    return <Empty className="mt-20" description="No orders yet" />;

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-6xl mx-auto">
        <Title level={2} className="mb-6">
         Сагс
        </Title>
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={orders}
          renderItem={(order, index) => {
            const cleanPrice =
              Number(order.price.replace(/[,₮]/g, "")) || 0;
            const total = cleanPrice * order.quantity;

            return (
              <List.Item key={index}>
                <Card  bordered>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={order.image}
                        alt={order.name}
                        width={120}
                        height={120}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                      <div>
                        <Text strong>{order.name}</Text>
                        <br />
                        <Text type="secondary">
                          {order.price} × {order.quantity}
                        </Text>
                      </div>
                    </div>
                    <Text strong className="text-lg">
                      {total.toLocaleString()}₮
                    </Text>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
}

export default MyOrders;
