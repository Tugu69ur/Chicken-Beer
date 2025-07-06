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
        const branchData = response.data;
        setBranches(branchData);
      } catch (error) {
        console.error("Failed to fetch branches", error);
      }
    };

    fetchBranches(); // <- call it inside useEffect
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await axios.get(`${BASE_URL}api/users`);
      const users = res.data.users || [];
      // Filter only client users
      const clientUsers = users.filter((user) => user.role === "client");
      // Map to include only necessary fields
      const clientData = clientUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        branch: user.branch || [],
      }));
      setClients(clientData);
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
      await axios.post(`${BASE_URL}api/users`, {
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role: "client",
        branch: values.branch,
      }
      );
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
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.name}`,
    },
    {
      title: "Утас",
      dataIndex: "phone",
      key: "phone",
      render: (_, record) => `${record.phone || "Утас оруулаагүй"}`,
    },
    {
      title: "Имэйл",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Салбар",
      dataIndex: "branch",
      key: "branch",
      render: (_, record) => `${record.branch}`,
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
                      name="name"
                      rules={[{ required: true, message: "Нэр оруулна уу!" }]}
                    >
                      <Input placeholder="Жишээ: Бат" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="phone"
                      name="phone"
                      rules={[{ required: true, message: "Утасны дугаар оруулна уу!" }]}
                    >
                      <Input placeholder="Жишээ: 99119911" />
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
                      <Option key={branch._id} value={branch.name}>
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
