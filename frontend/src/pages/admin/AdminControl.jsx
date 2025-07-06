import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Modal,
  notification,
  Spin,
} from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../../../constants.js";
import Navbar from "../../components/Navbar.jsx";
import { ToastContainer, toast } from "react-toastify";



const { Title } = Typography;
const { confirm } = Modal;

const ManageAdmins = () => {
  const [form] = Form.useForm();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/users`);
      const users = res.data.users || [];
      // Filter only admin users
      const adminUsers = users.filter((user) => user.role === "admin");
      // Map to include only necessary fields
      const adminData = adminUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
      // Set the state with admin data

      setAdmins(adminData);
    } catch (error) {
      notification.error({ message: "Алдаа", description: "Админуудыг татаж чадсангүй." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

const handleAddAdmin = async (values) => {
  setAddingAdmin(true);
  try {
    await axios.post(`${BASE_URL}api/users`, {
      name: values.firstName,
      phone: values.phone,
      email: values.email,
      password: values.password,
      role: "admin",
    });
    notification.success({ message: "Амжилттай!", description: "Шинэ админ нэмэгдлээ." });
    form.resetFields();
    fetchAdmins();
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    notification.error({ message: "Алдаа", description: msg });
  } finally {
    setAddingAdmin(false);
  }
};

  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(`${BASE_URL}api/users/${adminId}`);
      notification.success({ message: "Устгасан!", description: "Админ устгагдлаа." });
      fetchAdmins();
    } catch (error) {
      notification.error({ message: "Алдаа", description: error.message });
    }
  };

  const showDeleteConfirm = (adminId, name) => {
    confirm({
      title: `${name} админыг устгах уу?`,
      icon: <ExclamationCircleOutlined />,
      content: "Энэ үйлдэл нь буцаж болдоггүй!",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        return handleDeleteAdmin(adminId);
      },
    });
  };

  const columns = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      render: (text, record) => `${record.name}`,
    },
    {
      title: "Имэйл",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Утас",
      dataIndex: "phone",
      key: "phone",
      render: (text, record) => `${record.phone}`,
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
      <Row gutter={[24, 24]}>
        {/* Admin Add Form */}
        <Col xs={24} md={12}>
          <Card title="Шинэ Админ Нэмэх" bordered={false}>
            <Form layout="vertical" form={form} onFinish={handleAddAdmin}>
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
                    label="Утас"
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
                  { min: 6, message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  loading={addingAdmin}
                  block
                >
                  Админ Нэмэх
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Admin List Table */}
        <Col xs={24} md={12}>
          <Card title="Бүртгэлтэй Админууд" bordered={false}>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={admins}
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

export default ManageAdmins;
