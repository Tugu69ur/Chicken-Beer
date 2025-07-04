import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  Row,
  Col,
  Card,
  Modal,
  notification,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";

const { Title } = Typography;
const { confirm } = Modal;

const BranchControl = () => {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch branches from MongoDB
  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/branches`);
      setBranches(res.data);
    } catch (error) {
      notification.error({
        message: "Алдаа",
        description: "Салбаруудыг татаж чадсангүй.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Add new branch
  const handleAddBranch = async (values) => {
    try {
      setAdding(true);
      await axios.post(`${BASE_URL}api/branches`, values);
      notification.success({
        message: "Амжилттай",
        description: "Шинэ салбар нэмэгдлээ.",
      });
      form.resetFields();
      fetchBranches();
    } catch (error) {
      notification.error({
        message: "Алдаа",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setAdding(false);
    }
  };

  // Delete a branch
  const handleDeleteBranch = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/branches/${id}`);
      notification.success({
        message: "Устгасан!",
        description: "Салбар амжилттай устлаа.",
      });
      fetchBranches();
    } catch (error) {
      notification.error({
        message: "Алдаа",
        description: error.message,
      });
    }
  };

  // Confirm before deleting
  const showDeleteConfirm = (id, name) => {
    confirm({
      title: `${name} салбарыг устгах уу?`,
      icon: <ExclamationCircleOutlined />,
      content: "Энэ үйлдэл нь буцаж болдоггүй!",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        return handleDeleteBranch(id);
      },
    });
  };

  const columns = [
    {
      title: "Салбарын нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => showDeleteConfirm(record._id, record.name)}>
          Устгах
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-[1500px] w-full mx-auto">
        <Title level={2}>Салбар Удирдах</Title>
        <Row gutter={[24, 24]}>
          {/* Add Branch */}
          <Col xs={24} md={12}>
            <Card title="Шинэ Салбар Нэмэх" bordered={false}>
              <Form layout="vertical" form={form} onFinish={handleAddBranch}>
                <Form.Item
                  label="Салбарын нэр"
                  name="name"
                  rules={[{ required: true, message: "Салбарын нэр оруулна уу!" }]}
                >
                  <Input placeholder="Жишээ: Хороолол салбар" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={adding}
                    block
                  >
                    Салбар нэмэх
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Branch List */}
          <Col xs={24} md={12}>
            <Card title="Бүртгэлтэй Салбарууд" bordered={false}>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={branches}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BranchControl;
