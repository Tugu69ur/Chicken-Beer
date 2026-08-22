import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
  notification,
  Spin,
  Select,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../../constants';
import DataTable from '../../components/ui/data-table';
import EmptyState from '../../components/ui/empty-state';
import Section from '../../components/ui/section';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import { UtensilsCrossed, DollarSign, Tag, FileText, Image } from 'lucide-react';

const { Title } = Typography;

const CATEGORIES = [
  'GARLIC CHICKENS',
  'FRIED CHICKENS',
  'GOLD CHICKENS',
  'CHEESE CHICKENS',
  'YANGNYUM CHICKEN',
  'SIDE MENU',
  'BEVERAGES',
];

function MenuControl() {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/menu`);
      setMenus(res.data?.data || []);
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to load menu.' });
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
      const payload = { ...values, image: imageBase64 };
      await axios.post(`${BASE_URL}api/menu`, payload);
      message.success('Menu item added successfully');
      form.resetFields();
      setImageBase64(null);
      fetchMenus();
    } catch (error) {
      notification.error({ message: 'Error', description: error?.response?.data?.message || error.message });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/menu/${id}`);
      message.success('Menu item deleted');
      fetchMenus();
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
    }
    setDeleteConfirm(null);
  };

  const columns = [
    {
      title: 'Image', dataIndex: 'image', key: 'image', width: 80,
      render: (image) => image ? (
        <img src={image} alt="menu" className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-surface-muted flex items-center justify-center text-ink-muted text-xs">No img</div>
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-ink">{text}</span> },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => <span className="font-semibold text-brand-red">{text}</span> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (text) => <span className="text-ink-secondary">{text}</span> },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, render: (text) => <span className="text-ink-secondary">{text || '—'}</span> },
    {
      title: 'Actions', key: 'action', width: 120,
      render: (_, record) => (
        <Button danger size="small" onClick={() => setDeleteConfirm(record)} className="rounded-full">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Section title="Menu Management" subtitle="Add, edit, and remove items from your menu." />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Add Menu Item</span>
              </div>
            }>
              <Form layout="vertical" form={form} onFinish={handleAddMenu}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
                  <Input placeholder="e.g. Garlic Chicken" />
                </Form.Item>
                <Form.Item label="Price (₮)" name="price" rules={[{ required: true, message: 'Please enter price!' }]}>
                  <Input addonAfter="₮" placeholder="0" />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
                  <Select placeholder="Select category">
                    {CATEGORIES.map((cat) => (
                      <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter description!' }]}>
                  <Input.TextArea rows={3} placeholder="Describe this item..." />
                </Form.Item>
                <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please upload an image!' }]}>
                  <Upload beforeUpload={handleImageUpload} showUploadList={false} accept="image/*" listType="picture">
                    <Button icon={<UploadOutlined />} className="rounded-full">Upload Image</Button>
                  </Upload>
                  {imageBase64 && (
                    <div className="mt-3">
                      <img src={imageBase64} alt="Preview" className="h-28 w-auto rounded-xl object-cover border border-surface-dim" />
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={adding} block className="rounded-full h-11">
                    Add Item
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Menu Items</span>
              </div>
            }>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : menus.length === 0 ? (
                <EmptyState title="No menu items" description="Add your first menu item to get started." />
              ) : (
                <DataTable columns={columns} dataSource={menus} rowKey="_id" pagination={{ pageSize: 10 }} />
              )}
            </Card>
          </Col>
        </Row>

        <ConfirmDialog
          open={deleteConfirm !== null}
          title="Delete Menu Item?"
          description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteMenu(deleteConfirm?._id)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          danger
        />
      </div>
    </div>
  );
}

export default MenuControl;
