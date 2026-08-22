import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { Typography, Steps, Card, Tag, Space, Badge, Spin, Empty, List, Image, Divider, Button, Input, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/empty-state';
import { MapPin, Search, Package } from 'lucide-react';

const { Title, Paragraph } = Typography;

const STATUS_ORDER = ['pending', 'accepted', 'cooking', 'delivering', 'delivered'];
const STATUS_COLORS = {
  pending: 'warning',
  accepted: 'info',
  cooking: 'warning',
  delivering: 'info',
  delivered: 'success',
};

function getSavedPhone() {
  const saved = localStorage.getItem('trackPhone') || '';
  if (saved) return saved;
  try {
    const rawUser = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!rawUser) return '';
    const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    return parsed?.phone ? String(parsed.phone) : '';
  } catch {
    return '';
  }
}

function Delivery() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(getSavedPhone);
  const [searchPhone, setSearchPhone] = useState('');
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}api/orders`);
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setAllOrders(res.data.orders);
      }
    } catch {
      // ignore errors
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleSearch = () => {
    const normalized = searchPhone.trim();
    if (!/^[0-9]{8}$/.test(normalized)) {
      message.error('Phone number must be 8 digits');
      return;
    }
    setPhone(normalized);
    localStorage.setItem('trackPhone', normalized);
    message.success('Phone number saved');
  };

  const handleClearPhone = () => {
    setPhone('');
    setSearchPhone('');
    localStorage.removeItem('trackPhone');
  };

  const userOrders = useMemo(() => {
    if (!phone) return [];
    return allOrders
      .filter((o) => (o.phone || '').trim() === phone.trim())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [allOrders, phone]);

  const latestOrder = userOrders[0];

  useEffect(() => {
    if (!latestOrder || latestOrder.status === 'delivered') return;
    const id = setInterval(fetchAllOrders, 50000);
    return () => clearInterval(id);
  }, [latestOrder]);

  const currentStepIndex = (status) => {
    const idx = STATUS_ORDER.indexOf(status || 'pending');
    return idx === -1 ? 0 : idx;
  };

  const orderDate = latestOrder?.createdAt
    ? new Date(latestOrder.createdAt).toLocaleString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const totalAmount = latestOrder?.orders?.reduce((sum, item) => {
    const price = parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
    return sum + price * (item.quantity || 1);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            <MapPin size={14} />
            Order Tracking
          </div>
          <Title level={2} className="!mb-2 text-ink">
            Track Your Order
          </Title>
          <Paragraph type="secondary" className="text-base">
            Enter your phone number to check the status of your order.
          </Paragraph>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_1fr]">
          <Card className="card-elevated border-0">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Spin size="large" tip="Loading order information..." />
              </div>
            ) : !phone ? (
              <div className="flex min-h-[320px] flex-col justify-center gap-6">
                <div className="text-center">
                  <Title level={4} className="text-ink">Enter your phone number</Title>
                  <Paragraph className="max-w-lg mx-auto text-ink-secondary">
                    Enter your 8-digit phone number to view your order status.
                  </Paragraph>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1.5fr_0.7fr]">
                  <Input
                    size="large"
                    placeholder="8-digit phone number"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    maxLength={8}
                    prefix={<Search size={16} className="text-ink-muted" />}
                  />
                  <Button type="primary" size="large" onClick={handleSearch} className="rounded-full h-11">
                    Track
                  </Button>
                </div>
              </div>
            ) : !latestOrder ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No orders found for this number"
                />
                <Paragraph className="max-w-md text-ink-secondary">
                  Your order status will appear here after placing an order.
                </Paragraph>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button type="primary" onClick={() => navigate('/')} className="rounded-full">
                    Place Order
                  </Button>
                  <Button onClick={handleClearPhone}>Change Number</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 rounded-xl border border-surface-dim bg-brand-red-soft/30 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Order</p>
                      <p className="mt-1 text-lg font-bold text-ink">#{latestOrder._id?.slice(-6) || '---'}</p>
                    </div>
                    <Tag color={STATUS_COLORS[latestOrder.status] || 'default'}>
                      {(latestOrder.status || 'pending').toUpperCase()}
                    </Tag>
                  </div>
                </div>

                <Steps
                  current={currentStepIndex(latestOrder.status)}
                  status={latestOrder.status === 'delivered' ? 'finish' : 'process'}
                  className="mb-8"
                  size="small"
                >
                  <Steps.Step title="Pending" description="Received" />
                  <Steps.Step title="Accepted" description="Confirmed" />
                  <Steps.Step title="Preparing" description="Cooking" />
                  <Steps.Step title="Delivering" description="On the way" />
                  <Steps.Step title="Delivered" description="Complete" />
                </Steps>

                <Divider />

                <Title level={5} className="!text-ink mb-4">Order Details</Title>
                <List
                  dataSource={latestOrder.orders || []}
                  rowKey={(item, idx) => `${latestOrder._id}-${idx}`}
                  renderItem={(item) => (
                    <List.Item className="rounded-xl border border-surface-dim bg-surface-muted p-4 mb-3 last:mb-0">
                      <Space align="start" size={16}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={70}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: 10 }}
                          preview={false}
                          fallback="/fallback-image.png"
                        />
                        <div>
                          <p className="font-medium text-ink">{item.name}</p>
                          <p className="text-sm text-ink-muted">{item.price} × {item.quantity}</p>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>

          <Card className="card-elevated border-0 h-fit sticky top-24">
            <div className="space-y-5">
              <Title level={4} className="!text-ink">Quick Info</Title>
              <div className="grid gap-4">
                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Total Orders</p>
                  <p className="mt-2 text-2xl font-bold text-ink">{userOrders.length}</p>
                </div>
                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Last Order Amount</p>
                  <p className="mt-2 text-2xl font-bold text-ink">{totalAmount.toLocaleString()} ₮</p>
                </div>
                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Last Updated</p>
                  <p className="mt-2 text-base font-semibold text-ink">{latestOrder ? orderDate : '---'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
