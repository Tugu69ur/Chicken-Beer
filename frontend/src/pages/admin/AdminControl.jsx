import { useState, useEffect } from 'react';
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
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import DataTable from '../../components/ui/data-table';
import EmptyState from '../../components/ui/empty-state';
import Section from '../../components/ui/section';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import { Users, Mail, Phone, Shield } from 'lucide-react';

const { Title } = Typography;

function AdminControl() {
  const [form] = Form.useForm();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}api/users`);
      const users = res.data.users || [];
      const adminUsers = users.filter((user) => user.role === 'admin');
      const adminData = adminUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      }));
      setAdmins(adminData);
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to load admins.' });
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
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
        role: 'admin',
      });
      message.success('New admin added successfully');
      form.resetFields();
      fetchAdmins();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      notification.error({ message: 'Error', description: msg });
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.delete(`${BASE_URL}api/users/${adminId}`);
      message.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
    }
    setDeleteConfirm(null);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-ink">{text}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (text) => <span className="text-ink-secondary">{text}</span> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (text) => <span className="text-ink-secondary">{text}</span> },
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
        <Section title="Admin Management" subtitle="Add new administrators and manage existing accounts." />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Add New Admin</span>
              </div>
            }>
              <Form layout="vertical" form={form} onFinish={handleAddAdmin}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
                      <Input placeholder="e.g. Munkhbat" prefix={<Users size={14} className="text-ink-muted" />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter phone number!' }]}>
                      <Input placeholder="e.g. 99119911" prefix={<Phone size={14} className="text-ink-muted" />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email!' }, { type: 'email', message: 'Invalid email format!' }]}>
                  <Input placeholder="email@example.com" prefix={<Mail size={14} className="text-ink-muted" />} />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}>
                  <Input.Password placeholder="Min. 6 characters" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={addingAdmin} block className="rounded-full h-11">
                    Add Admin
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Registered Admins</span>
              </div>
            }>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : admins.length === 0 ? (
                <EmptyState title="No admins found" description="Add your first admin to get started." />
              ) : (
                <DataTable columns={columns} dataSource={admins} rowKey="_id" pagination={{ pageSize: 10 }} />
              )}
            </Card>
          </Col>
        </Row>

        <ConfirmDialog
          open={deleteConfirm !== null}
          title="Delete Admin?"
          description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteAdmin(deleteConfirm?._id)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          danger
        />
      </div>
    </div>
  );
}

export default AdminControl;
