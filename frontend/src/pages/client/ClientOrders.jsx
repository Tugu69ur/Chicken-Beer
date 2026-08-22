import { useEffect, useState } from 'react';
import { Card, Typography, List, Tag, Button, Row, Col, Spin, Empty, Badge, Image, Space, message, Divider } from 'antd';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../../constants';
import { SkeletonCard, SkeletonTable } from '../../components/ui/loading-state';
import EmptyState from '../../components/ui/empty-state';
import Section from '../../components/ui/section';
import { CheckCircle, XCircle, MapPin, Phone, Clock, User } from 'lucide-react';

const { Title, Text } = Typography;

const STATUS_FLOW = {
  pending: 'accepted',
  accepted: 'cooking',
  cooking: 'delivering',
  delivered: null,
};

const STATUS_COLORS = {
  pending: 'warning',
  accepted: 'info',
  cooking: 'orange',
  delivering: 'purple',
  delivered: 'success',
};

const ALL_STATUSES = ['pending', 'accepted', 'cooking', 'delivering', 'delivered'];

function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}api/orders`);
      if (res.data.success && Array.isArray(res.data.orders)) {
        const ordersWithStatus = res.data.orders.map((order) => ({
          ...order,
          status: order.status || 'pending',
        }));
        setOrders(ordersWithStatus);
      } else {
        setError('Failed to fetch orders');
        toast.warn('Failed to fetch orders');
      }
    } catch (err) {
      setError('Server connection error');
      toast.error('Failed to load orders');
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      await axios.patch(`${BASE_URL}api/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/orders/${id}`);
      toast.success('Order deleted successfully');
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      toast.error('Failed to delete order');
      console.error('Delete error:', err);
    }
  };

  const filteredOrders = orders.filter((order) => order.status === filterStatus);

  const columns = [
    { title: 'Order #', key: 'idx', render: (_, __, index) => <span className="font-mono text-sm text-ink">#{index + 1}</span>, width: 80 },
    { title: 'Customer', dataIndex: 'phone', key: 'phone', render: (text) => <span className="text-ink">{text}</span> },
    { title: 'Address', dataIndex: 'address', key: 'address', ellipsis: true, render: (text) => <span className="text-ink-secondary">{text}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'} icon={status === 'delivered' ? <CheckCircle size={12} /> : status === 'pending' ? <XCircle size={12} /> : null}>
          {(status || 'pending').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'orders',
      key: 'orders',
      render: (items) =>
        items?.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 py-1">
            <Image src={item.image} alt={item.name} width={40} height={30} style={{ objectFit: 'cover', borderRadius: 6 }} preview={false} fallback="/fallback-image.png" />
            <div>
              <div className="text-sm font-medium text-ink">{item.name}</div>
              <div className="text-xs text-ink-muted">{item.price} × {item.quantity}</div>
            </div>
          </div>
        )) || 'No items',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => {
        const next = STATUS_FLOW[record.status];
        return (
          <Space>
            {next && (
              <Button type="primary" size="small" onClick={() => updateStatus(record._id, next)} className="rounded-full">
                {next === 'delivered' ? 'Mark Delivered' : `Set to ${next.charAt(0).toUpperCase() + next.slice(1)}`}
              </Button>
            )}
            <Button size="small" danger onClick={() => handleDelete(record._id)} className="rounded-full">
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Section title="Order Management" subtitle="Track and manage all customer orders." />

        <Card className="card-elevated border-0 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Text type="secondary" className="text-sm">Filter orders by status</Text>
            <Space wrap>
              {ALL_STATUSES.map((status) => (
                <Button
                  key={status}
                  type={filterStatus === status ? 'primary' : 'default'}
                  onClick={() => setFilterStatus(status)}
                  className="rounded-full"
                  size="small"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </Space>
          </div>
        </Card>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : error ? (
          <EmptyState title="Error loading orders" description={error} actionLabel="Try Again" action={<Button type="primary" onClick={fetchOrders}>Try Again</Button>} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title={`No ${filterStatus} orders`} description={`There are currently no orders with status "${filterStatus}".`} />
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order, index) => (
              <Card key={order._id || index} className="card-elevated border-0">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red-soft">
                      <span className="font-bold text-brand-red">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text strong className="text-ink">{order.phone}</Text>
                        <Tag color={STATUS_COLORS[order.status] || 'default'}>
                          {(order.status || 'pending').toUpperCase()}
                        </Tag>
                      </div>
                      <Text type="secondary" className="text-xs">{order.address}</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {STATUS_FLOW[order.status] && (
                      <Button type="primary" size="small" onClick={() => updateStatus(order._id, STATUS_FLOW[order.status])} className="rounded-full">
                        {STATUS_FLOW[order.status] === 'delivered' ? 'Mark Delivered' : `Set ${STATUS_FLOW[order.status]}`}
                      </Button>
                    )}
                    <Button size="small" danger onClick={() => handleDelete(order._id)} className="rounded-full">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ClientOrders;
