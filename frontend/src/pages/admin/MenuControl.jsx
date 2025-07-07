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
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";
import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";

const { confirm } = Modal;

const MenuControl = () => {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/menu`); // <- uses 'menu'
      setMenus(res.data?.data || []);
    } catch (error) {
      notification.error({
        message: "Алдаа",
        description: "Меню татаж чадсангүй.",
      });
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
    const payload = {
      ...values,
      image: imageBase64,
    };
    await axios.post(`${BASE_URL}api/menu`, payload);
    notification.success({
      message: "Амжилттай",
      description: "Меню нэмэгдлээ.",
    });
    form.resetFields();
    setImageBase64(null);
    fetchMenus();
  } catch (error) {
    notification.error({
      message: "Алдаа",
      description: error?.response?.data?.message || error.message,
    });
  } finally {
    setAdding(false);
  }
};


  const handleDeleteMenu = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/menu/${id}`); 
      notification.success({
        message: "Устгасан",
        description: "Меню устгалаа.",
      });
      fetchMenus();
    } catch (error) {
      notification.error({
        message: "Алдаа",
        description: error.message,
      });
    }
  };

  const showDeleteConfirm = (id, name) => {
    confirm({
      title: `${name} устгах уу?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        return handleDeleteMenu(id);
      },
    });
  };

  const columns = [
    { title: "Нэр", dataIndex: "name", key: "name" },
    { title: "Үнэ", dataIndex: "price", key: "price" },
    { title: "Тайлбар", dataIndex: "description", key: "description" },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => showDeleteConfirm(record._id, record.name)}
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
          <Col xs={24} md={12}>
            <Card title="Шинэ Меню Нэмэх">
              <Form layout="vertical" form={form} onFinish={handleAddMenu}>
                <Form.Item label="Нэр" name="name" rules={[{ required: true ,message: "Нэр оруулна уу!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Үнэ"
                  name="price"
                  rules={[{ required: true, message: "Дүнгээ оруулна уу!" }]}
                >
                  <Input addonAfter="₮" />
                </Form.Item>
                <Form.Item
                  label="Төрөл"
                  name="category"
                  rules={[{ required: true, message: "Төрөл сонгоно уу!" }]}
                >
                  <Select placeholder="Төрөл сонгох">
                    <Select.Option value="GARLIC CHICKENS">
                      GARLIC CHICKENS
                    </Select.Option>
                    <Select.Option value="FRIED CHICKENS">
                      FRIED CHICKENS
                    </Select.Option>
                    <Select.Option value="GOLD CHICKENS">
                      GOLD CHICKENS
                    </Select.Option>
                    <Select.Option value="CHEESE CHICKENS">
                      CHEESE CHICKENS
                    </Select.Option>
                    <Select.Option value="YANGNYUM CHICKEN">
                      YANGNYUM CHICKEN
                    </Select.Option>
                    <Select.Option value="SIDE MENU">SIDE MENU</Select.Option>
                    <Select.Option value="BEVERAGES">BEVERAGES</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Тайлбар"
                  name="description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Зураг" name="image" valuePropName="file" rules={[{required: true, message: "Зураг оруулна уу!"}]}>
                  <Upload
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                  {imageBase64 && (
                    <img
                      src={imageBase64}
                      alt="preview"
                      style={{ marginTop: 10, maxWidth: "100%" }}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={adding}
                    icon={<PlusOutlined />}
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
                <Table
                  dataSource={menus}
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

export default MenuControl;
