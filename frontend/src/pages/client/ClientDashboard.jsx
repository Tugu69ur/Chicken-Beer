import { useEffect, useState } from 'react';
import { Card, Typography, List, Divider, Tag, Space, Image } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import { SkeletonCard } from '../../components/ui/loading-state';
import EmptyState from '../../components/ui/empty-state';
import { MapPin, Phone, User, Clock, ShoppingBag } from 'lucide-react';

const { Title, Text } = Typography;

function ClientDashboard() {
  const [userBranch, setUserBranch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch {
      user = null;
    }
    if (!user?.branch) {
      setError('Branch information not found.');
      setLoading(false);
      return;
    }

    setUserBranch(user.branch);
    setLoading(true);
    setError(null);

    axios
      .get(`${BASE_URL}api/orderss`)
      .then((res) => {
        const branchOrders = res.data.filter(
          (order) => order.address === user.branch
        );
        setOrders(branchOrders);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load orders.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <SkeletonCard />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl bg-white border border-surface-dim p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <MapPin size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Your Branch</p>
              <Title level={3} className="!mt-0.5 !mb-0 text-ink">{userBranch || 'Unknown'}</Title>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <EmptyState
            title="No orders at your branch"
            description="Orders will appear here once customers place them at your branch."
          />
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const orderDate = new Date(order.createdAt).toLocaleString('mn-MN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <Card key={order._id} className="card-elevated border-0 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="text-ink-muted" />
                      <Text className="text-xs text-ink-muted uppercase tracking-wider">Order</Text>
                      <Text keyboard className="text-sm font-mono text-ink">
                        #{order._id.substring(0, 8)}
                      </Text>
                    </div>
                    <Tag color={order.paymentMethod === 'qpay' ? 'volcano' : 'gold'}>
                      {order.paymentMethod?.toUpperCase() || 'UNKNOWN'}
                    </Tag>
                  </div>

                  <Space direction="vertical" size="middle" className="w-full">
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-ink-muted" />
                        <div>
                          <Text type="secondary" className="text-xs uppercase tracking-wider">Phone</Text>
                          <p className="text-sm font-medium text-ink">{order.extraPhone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User size={14} className="text-ink-muted" />
                        <div>
                          <Text type="secondary" className="text-xs uppercase tracking-wider">Person Type</Text>
                          <p className="text-sm font-medium text-ink">{order.personType || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-ink-muted" />
                        <div>
                          <Text type="secondary" className="text-xs uppercase tracking-wider">Pickup Time</Text>
                          <p className="text-sm font-medium text-ink">{order.note || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    <div>
                      <Text type="secondary" className="text-xs uppercase tracking-wider font-semibold">Items</Text>
                      <List
                        dataSource={order.orders}
                        itemLayout="horizontal"
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0' }} className="rounded-xl">
                            <List.Item.Meta
                              avatar={
                                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f5f3f0', flexShrink: 0 }}>
                                  <Image src={item.image} alt={item.name} width={48} height={48} style={{ objectFit: 'cover' }} preview={false} fallback="/fallback-image.png" />
                                </div>
                              }
                              title={<Text strong className="text-ink text-sm">{item.name}</Text>}
                              description={
                                <Text className="text-ink-secondary text-xs">{item.price} × {item.quantity}</Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </Space>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
