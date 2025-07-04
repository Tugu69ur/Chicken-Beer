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
  Select,
} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const ManageClients = () => {
  const [branches, setBranches] = useState([]);
  const [clientForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [addingClient, setAddingClient] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };
    fetchBranches();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await axios.get(`${BASE_URL}api/clients`);
      setClients(res.data);
    } catch (err) {
      notification.error({
        message: "Алдаа",
        description: "Үйлчлүүлэгчдийн мэдээллийг татаж чадсангүй.",
      });
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (values) => {
    try {
      setAddingClient(true);
      await axios.post(`${BASE_URL}api/clients`, values);
      notification.success({
        message: "Амжилттай!",
        description: "Үйлчлүүлэгч амжилттай нэмэгдлээ.",
      });
      clientForm.resetFields();
      fetchClients();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      notification.error({ message: "Алдаа", description: msg });
    } finally {
      setAddingClient(false);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/clients/${id}`);
      notification.success({
        message: "Устгасан!",
        description: "Үйлчлүүлэгч амжилттай устлаа.",
      });
      fetchClients();
    } catch (err) {
      notification.error({ message: "Алдаа", description: err.message });
    }
  };

  const showDeleteConfirm = (id, name) => {
    confirm({
      title: `${name} үйлчлүүлэгчийг устгах уу?`,
      icon: <ExclamationCircleOutlined />,
      content: "Энэ үйлдэл нь буцаж болдоггүй.",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        return handleDeleteClient(id);
      },
    });
  };

  const clientColumns = [
    {
      title: "Нэр",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Имэйл",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Үйлчилгээнүүд",
      dataIndex: "services",
      key: "services",
      render: (services) => services?.join(", "),
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => showDeleteConfirm(record._id, record.firstName)}
        >
          Устгах
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-[1500px] w-full mx-auto">
        <Row gutter={[24, 24]}>
          {/* Add Client */}
          <Col xs={24} md={12}>
            <Card title="Шинэ Үйлчлүүлэгч Нэмэх" bordered={false}>
              <Form
                layout="vertical"
                form={clientForm}
                onFinish={handleAddClient}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Нэр"
                      name="firstName"
                      rules={[{ required: true, message: "Нэр оруулна уу!" }]}
                    >
                      <Input placeholder="Жишээ: Бат" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Овог"
                      name="lastName"
                      rules={[{ required: true, message: "Овог оруулна уу!" }]}
                    >
                      <Input placeholder="Жишээ: Дорж" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Имэйл"
                  name="email"
                  rules={[
                    { required: true, message: "Имэйл оруулна уу!" },
                    { type: "email", message: "Имэйл формат буруу байна!" },
                  ]}
                >
                  <Input placeholder="email@example.com" />
                </Form.Item>
                <Form.Item
                  label="Нууц үг"
                  name="password"
                  rules={[
                    { required: true, message: "Нууц үг оруулна уу!" },
                    {
                      min: 6,
                      message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Салбар"
                  name="branch"
                  rules={[{ required: true, message: "Салбар сонгоно уу!" }]}
                >
                  <Select placeholder="Салбар сонгох">
                    {branches.map((branch) => (
                      <Option key={branch._id} value={branch._id}>
                        {branch.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={addingClient}
                    block
                  >
                    Үйлчлүүлэгч Нэмэх
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Client List */}
          <Col xs={24} md={12}>
            <Card title="Бүртгэлтэй Үйлчлүүлэгчид" bordered={false}>
              {loadingClients ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  dataSource={clients}
                  columns={clientColumns}
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

export default ManageClients;
