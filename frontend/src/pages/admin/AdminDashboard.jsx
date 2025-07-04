import React, { useEffect, useState } from "react";
import { Layout, Typography, Card, Row, Col, Progress } from "antd";
import { Bar } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";

const { Header, Content } = Layout;
const { Text } = Typography;

// Register Chart.js components and datalabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AdminDashboard = () => {
  // State to hold fetched data
  const parseOrdersData = (ordersArray) => {
    if (!Array.isArray(ordersArray)) return { count: 0, revenue: 0 };

    let count = ordersArray.length; // total orders entries
    let revenue = 0;

    ordersArray.forEach((orderEntry) => {
      orderEntry.orders.forEach((item) => {
        const numericPrice = Number(item.price.replace(/[₮,]/g, "").trim());
        revenue += numericPrice * item.quantity;
      });
    });

    return { count, revenue };
  };

  const [ordersCount, setOrdersCount] = useState(0);
  const [revenueAmount, setRevenueAmount] = useState(0);

  const formatRevenue = (amount) => {
    return amount.toLocaleString("en-US") + "₮";
  };

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`${BASE_URL}api/orders`),
        axios.get(`${BASE_URL}api/orderss`),
      ]);

      const result1 = parseOrdersData(res1.data.orders);
      const result2 = parseOrdersData(res2.data);

      setOrdersCount(result1.count + result2.count);
      setRevenueAmount(result1.revenue + result2.revenue);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ordersData = {
    labels: ["Orders"],
    datasets: [
      {
        label: "Total Orders",
        data: [ordersCount],
        backgroundColor: "#302F2F",
        borderColor: "#302F2F",
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ["Revenue (₮)"],
    datasets: [
      {
        label: "Revenue (₮)",
        data: [revenueAmount],
        backgroundColor: "#302F2F",
        borderColor: "#302F2F",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        color: "#fff",
        font: { size: 18, weight: "bold" },
        anchor: "center",
        align: "center",
        formatter: (value) => value,
      },
    },
  };

  // Progress bar config
  const progressConfig = (percent) => ({
    percent,
    strokeColor: "#D81E1E",
    trailColor: "#eee",
    strokeWidth: 12,
    showInfo: false,
  });

  return (
    <>
      <Navbar />
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }} className="mx-auto">
        <Layout>
          <Header
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 2px 8px #f0f1f2",
            }}
          />
          <Content
            style={{
              margin: "24px 32px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ maxWidth: 1400, width: "100%" }}>
              <Row gutter={[24, 24]}>
                {/* Total Orders */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    title="Total Orders"
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgb(255 77 79 / 0.2)",
                    }}
                  >
                    <div style={{ height: 450 }}>
                      <Bar data={ordersData} options={barOptions} />
                    </div>
                  </Card>
                </Col>

                {/* Revenue */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    title="Revenue (₮)"
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgb(255 77 79 / 0.2)",
                    }}
                  >
                    <div style={{ height: 450 }}>
                      <Bar data={revenueData} options={barOptions} />
                    </div>
                  </Card>
                </Col>

                {/* Admins and Clients - static for now */}
                <Col xs={24} sm={12} md={6}>
                  <Card
                    title="Admins"
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgb(255 77 79 / 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 36,
                        marginBottom: 16,
                        display: "block",
                      }}
                    >
                      4
                    </Text>
                    <Progress {...progressConfig(40)} />
                  </Card>
                  <Card
                    title="Clients"
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      marginTop: 36,
                      boxShadow: "0 4px 12px rgb(255 77 79 / 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 36,
                        marginBottom: 16,
                        display: "block",
                      }}
                    >
                      860
                    </Text>
                    <Progress {...progressConfig(86)} />
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminDashboard;
