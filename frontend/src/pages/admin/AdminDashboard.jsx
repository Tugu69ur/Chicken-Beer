import { useEffect, useState } from 'react';
import { Row, Col, Progress, Card } from 'antd';
import {
  ShoppingCart,
  DollarSign,
  Users,
  UserCircle,
  TrendingUp,
  Clock,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import StatCard from '../../components/ui/stat-card';
import EmptyState from '../../components/ui/empty-state';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalAdmins: 0,
    totalClients: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [res1, res2, res3] = await Promise.all([
        axios.get(`${BASE_URL}api/orders`),
        axios.get(`${BASE_URL}api/orderss`),
        axios.get(`${BASE_URL}api/users`),
      ]);

      const orders1 = res1.data?.orders || [];
      const orders2 = res2.data || [];
      const allOrders = [...orders1, ...orders2];
      const users = res3.data?.users || [];

      const admins = users.filter((user) => user.role === 'admin');
      const clients = users.filter((user) => user.role === 'client');
      const pending = allOrders.filter((o) => o.status === 'pending' || !o.status).length;

      let revenue = 0;
      allOrders.forEach((orderEntry) => {
        if (orderEntry.orders) {
          orderEntry.orders.forEach((item) => {
            const numericPrice = Number(String(item.price).replace(/[₮,]/g, '').trim()) || 0;
            revenue += numericPrice * item.quantity;
          });
        }
      });

      const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalOrders: allOrders.length,
        totalRevenue: revenue,
        totalAdmins: admins.length,
        totalClients: clients.length,
        pendingOrders: pending,
        recentOrders,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-8 w-48 rounded" />
          </div>
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4].map((i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <div className="card p-6">
                  <div className="skeleton h-4 w-20 mb-4" />
                  <div className="skeleton h-8 w-32 mb-2" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="Unable to load dashboard"
            description={error}
            actionLabel="Try Again"
            action={() => fetchData()}
          />
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => `${value.toLocaleString()} ₮`;

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            <Activity size={14} />
            Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Dashboard</h1>
          <p className="mt-1.5 text-ink-secondary">
            Welcome back. Here's what's happening with your business today.
          </p>
        </div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders.toLocaleString()}
              subtitle={`${stats.pendingOrders} pending`}
              trend="12%"
              trendUp={true}
              icon={<ShoppingCart size={20} />}
              color="red"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Revenue"
              value={formatCurrency(stats.totalRevenue)}
              subtitle="Total earnings"
              trend="8%"
              trendUp={true}
              icon={<DollarSign size={20} />}
              color="amber"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Admins"
              value={stats.totalAdmins}
              subtitle="Active administrators"
              icon={<UserCircle size={20} />}
              color="blue"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Clients"
              value={stats.totalClients}
              subtitle="Registered clients"
              trend="5%"
              trendUp={true}
              icon={<Users size={20} />}
              color="green"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              className="card-elevated border-0"
              title={
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-ink-muted" />
                  <span className="text-sm font-semibold text-ink">Recent Orders</span>
                </div>
              }
            >
              {stats.recentOrders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Orders will appear here once customers start placing them."
                />
              ) : (
                <div className="divide-y divide-surface-dim">
                  {stats.recentOrders.map((order, index) => (
                    <div
                      key={order._id || index}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red-soft text-brand-red">
                          <ShoppingCart size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            #{order._id?.slice(-6) || '---'}
                          </p>
                          <p className="text-xs text-ink-muted">
                            {new Date(order.createdAt).toLocaleDateString('mn-MN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-ink">
                          {order.orders?.reduce((sum, item) => {
                            const price = parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
                            return sum + price * (item.quantity || 1);
                          }, 0).toLocaleString()} ₮
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-green-50 text-green-700'
                              : order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className="card-elevated border-0 h-full"
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-ink-muted" />
                  <span className="text-sm font-semibold text-ink">Quick Stats</span>
                </div>
              }
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-secondary">Pending Orders</span>
                    <span className="text-sm font-bold text-ink">{stats.pendingOrders}</span>
                  </div>
                  <Progress
                    percent={stats.totalOrders > 0 ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) : 0}
                    strokeColor="#9f1239"
                    trailColor="#f5f3f0"
                    size="small"
                    showInfo={false}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-secondary">Admin Ratio</span>
                    <span className="text-sm font-bold text-ink">{stats.totalAdmins}</span>
                  </div>
                  <Progress
                    percent={
                      stats.totalAdmins + stats.totalClients > 0
                        ? Math.round((stats.totalAdmins / (stats.totalAdmins + stats.totalClients)) * 100)
                        : 0
                    }
                    strokeColor="#2563eb"
                    trailColor="#f5f3f0"
                    size="small"
                    showInfo={false}
                  />
                </div>
                <div className="rounded-xl border border-surface-dim bg-surface-muted p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                    System Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-soft" />
                    <span className="text-sm font-semibold text-green-700">All systems operational</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AdminDashboard;
