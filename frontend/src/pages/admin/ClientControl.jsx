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
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../../constants';
import DataTable from '../../components/ui/data-table';
import EmptyState from '../../components/ui/empty-state';
import Section from '../../components/ui/section';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import { Users, Mail, Phone } from 'lucide-react';

const { Title } = Typography;
const { Option } = Select;

function ClientControl() {
  const [branches, setBranches] = useState([]);
  const [clientForm] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [addingClient, setAddingClient] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error('Failed to fetch branches', error);
      }
    };
    fetchBranches();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await axios.get(`${BASE_URL}api/users`);
      const users = res.data.users || [];
      const clientUsers = users.filter((user) => user.role === 'client');
      const clientData = clientUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        branch: user.branch || 'Not assigned',
        createdAt: user.createdAt,
      }));
      setClients(clientData);
    } catch (err) {
      notification.error({ message: 'Error', description: 'Failed to load clients.' });
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
        role: 'client',
        branch: values.branch,
      });
      message.success('New client added successfully');
      clientForm.resetFields();
      fetchClients();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      notification.error({ message: 'Error', description: msg });
    } finally {
      setAddingClient(false);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/users/${id}`);
      message.success('Client deleted successfully');
      fetchClients();
    } catch (err) {
      notification.error({ message: 'Error', description: err.message });
    }
    setDeleteConfirm(null);
  };

  const clientColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-ink">{text}</span> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (text) => <span className="text-ink-secondary">{text || 'Not provided'}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (text) => <span className="text-ink-secondary">{text}</span> },
    { title: 'Branch', dataIndex: 'branch', key: 'branch', render: (text) => <span className="text-ink-secondary">{text}</span> },
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
        <Section title="Client Management" subtitle="Add new clients and manage branch assignments." />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Add New Client</span>
              </div>
            }>
              <Form layout="vertical" form={clientForm} onFinish={handleAddClient}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
                      <Input placeholder="e.g. Bat" prefix={<Users size={14} className="text-ink-muted" />} />
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
                <Form.Item label="Branch" name="branch" rules={[{ required: true, message: 'Please select a branch!' }]}>
                  <Select placeholder="Select a branch">
                    {branches.map((branch) => (
                      <Option key={branch._id} value={branch.name}>{branch.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={addingClient} block className="rounded-full h-11">
                    Add Client
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Registered Clients</span>
              </div>
            }>
              {loadingClients ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : clients.length === 0 ? (
                <EmptyState title="No clients found" description="Add your first client to get started." />
              ) : (
                <DataTable columns={clientColumns} dataSource={clients} rowKey="_id" pagination={{ pageSize: 10 }} />
              )}
            </Card>
          </Col>
        </Row>

        <ConfirmDialog
          open={deleteConfirm !== null}
          title="Delete Client?"
          description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteClient(deleteConfirm?._id)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          danger
        />
      </div>
    </div>
  );
}

export default ClientControl;
