import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Spin,
  Empty,
  Badge,
  Image,
  Space,
} from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../constants";

const { Title } = Typography;

const STATUS_FLOW = {
  pending: "accepted",
  accepted: "cooking",
  cooking: "delivering",
  delivering: "delivered",
  delivered: null,
};

const STATUS_COLORS = {
  pending: "gold",
  accepted: "blue",
  cooking: "orange",
  delivering: "purple",
  delivered: "green",
};

const ALL_STATUSES = ["pending", "accepted", "cooking", "delivering", "delivered"];

function ClientDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending"); // default filter

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}api/orders`);
      if (res.data.success && Array.isArray(res.data.orders)) {
        const ordersWithStatus = res.data.orders.map((order) => ({
          ...order,
          status: order.status || "pending",
        }));
        setOrders(ordersWithStatus);
      } else {
        setError("Failed to fetch orders");
        toast.warn("Failed to fetch orders");
      }
    } catch (err) {
      setError("Server connection error");
      toast.error("Failed to load orders");
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      await axios.patch(`${BASE_URL}api/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/orders/${id}`);
      toast.success("Order deleted successfully");
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      toast.error("Failed to delete order");
      console.error("Delete error:", err);
    }
  };

  // Filter orders by selected status
  const filteredOrders = orders.filter(
    (order) => order.status === filterStatus
  );

  const columns = [
    {
      title: "Order #",
      key: "idx",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Customer Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || "default"}>
          {(status || "pending").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ordered Items",
      dataIndex: "orders",
      key: "orders",
      render: (items) =>
        items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={60}
              height={45}
              style={{ objectFit: "cover", borderRadius: 6 }}
              preview={false}
              fallback="/fallback-image.png"
            />
            <div>
              <div>{item.name}</div>
              <div style={{ color: "#888" }}>
                {item.price} × {item.quantity}
              </div>
            </div>
          </div>
        )) || "No items",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const next = STATUS_FLOW[record.status];
        return (
          <Space>
            {next && (
              <Button
                type="primary"
                size="small"
                onClick={() => updateStatus(record._id, next)}
              >
                {next === "delivered"
                  ? "Mark Delivered"
                  : `Set to ${next.charAt(0).toUpperCase() + next.slice(1)}`}
              </Button>
            )}
            <Button size="small" danger onClick={() => handleDelete(record._id)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-7xl mx-auto min-h-screen">
        <Title level={2} className="mb-6">
          2030Chicken Orders Dashboard
        </Title>

        {/* Status filter buttons */}
        <Space style={{ marginBottom: 20 }}>
          {ALL_STATUSES.map((status) => (
            <Button
              key={status}
              type={filterStatus === status ? "primary" : "default"}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </Space>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Spin size="large" tip="Loading orders..." />
          </div>
        ) : error ? (
          <Typography.Text type="danger">{error}</Typography.Text>
        ) : filteredOrders.length === 0 ? (
          <Empty description={`No ${filterStatus} orders`} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ClientDashboard;
