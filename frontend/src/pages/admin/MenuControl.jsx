// MenuControl.jsx
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
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";

const { Title } = Typography;
const { confirm } = Modal;

const MenuControl = () => {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/menus`);
      setMenus(res.data);
    } catch (error) {
      notification.error({ message: "Алдаа", description: "Меню татаж чадсангүй." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddMenu = async (values) => {
    try {
      setAdding(true);
      await axios.post(`${BASE_URL}api/menus`, values);
      notification.success({ message: "Амжилттай", description: "Меню нэмэгдлээ." });
      form.resetFields();
      fetchMenus();
    } catch (error) {
      notification.error({ message: "Алдаа", description: error.message });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/menus/${id}`);
      notification.success({ message: "Устгасан", description: "Меню устгалаа." });
      fetchMenus();
    } catch (error) {
      notification.error({ message: "Алдаа", description: error.message });
    }
  };

  const showDeleteConfirm = (id, name) => {
    confirm({
      title: `${name} устгах уу?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return handleDeleteMenu(id);
      },
    });
  };

  const columns = [
    { title: "Нэр", dataIndex: "name", key: "name" },
    { title: "Үнэ", dataIndex: "price", key: "price" },
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
          <Col xs={24} md={12}>
            <Card title="Шинэ Меню Нэмэх">
              <Form layout="vertical" form={form} onFinish={handleAddMenu}>
                <Form.Item label="Нэр" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Үнэ" name="price" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={adding}
                    block
                  >
                    Нэмэх
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Меню жагсаалт">
              {loading ? (
                <Spin size="large" />
              ) : (
                <Table dataSource={menus} columns={columns} rowKey="_id" />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MenuControl;
