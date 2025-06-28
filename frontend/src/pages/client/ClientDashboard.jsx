import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Card, Typography, List } from "antd";

const { Title, Text } = Typography;

function ClientDashboard() {
  const [userBranch, setUserBranch] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    if (user?.branch) {
      setUserBranch(user.branch);
      const branchOrders = savedOrders.filter(
        (order) => order.branch === user.branch
      );

      setOrders(branchOrders);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-4xl mx-auto">
        <Title level={2}>Таны салбар: {userBranch}</Title>

        {orders.length > 0 ? (
          <Card title={`${userBranch} салбарын захиалгууд`} className="my-6">
            <List
              itemLayout="horizontal"
              dataSource={orders}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.name} × ${item.quantity}`}
                    description={`${item.price}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        ) : (
          <Text type="secondary">Таны салбарт захиалга алга</Text>
        )}
      </div>
    </>
  );
}

export default ClientDashboard;
