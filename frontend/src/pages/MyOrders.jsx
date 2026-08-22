import { Card, Typography, Divider, Modal, InputNumber, Button, message, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard, SkeletonTable } from '../components/ui/loading-state';
import EmptyState from '../components/ui/empty-state';
import ConfirmDialog from '../components/ui/confirm-dialog';
import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

const { Title, Text } = Typography;

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  const calculateTotal = () =>
    orders.reduce((total, order) => {
      const cleanPrice = Number(String(order.price).replace(/[,₮]/g, '')) || 0;
      return total + cleanPrice * order.quantity;
    }, 0);

  const handleSaveEdit = () => {
    if (editingOrder) {
      const updatedOrders = orders.map((order) =>
        order.name === editingOrder.name ? editingOrder : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setEditingOrder(null);
      message.success('Order updated successfully');
    }
  };

  const handleDelete = (order) => {
    setDeleteConfirmOrder(order);
  };

  const confirmDelete = () => {
    if (deleteConfirmOrder) {
      const updatedOrders = orders.filter(
        (order) => order.name !== deleteConfirmOrder.name
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setDeleteConfirmOrder(null);
      message.success('Order removed from cart');
    }
  };

  const handleQuantityChange = (order, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedOrders = orders.map((item) =>
      item.name === order.name ? { ...item, quantity: newQuantity } : item
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const totalAmount = calculateTotal();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SkeletonTable rows={4} />
        </div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-4 py-20">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Browse our menu to find something delicious."
          actionLabel="Browse Menu"
          icon={<ShoppingCart size={48} className="text-ink-muted opacity-50" />}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/')} className="btn btn-ghost btn-sm">
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm font-medium text-ink-muted">Menu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Shopping Cart</h1>
          <p className="mt-1.5 text-ink-secondary">{orders.length} item{orders.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            {orders.map((order, index) => {
              const cleanPrice = Number(String(order.price).replace(/[,₮]/g, '')) || 0;
              const total = cleanPrice * order.quantity;

              return (
                <Card key={index} className="card-elevated border-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 sm:h-32 h-48 w-full flex-shrink-0">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="h-full w-full object-cover sm:rounded-l-2xl rounded-t-2xl sm:rounded-t-none"
                      />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <Title level={5} className="!mb-1 text-ink">{order.name}</Title>
                          <Text className="text-sm text-ink-secondary">{order.price} each</Text>
                        </div>
                        <Text strong className="text-lg text-ink">{total.toLocaleString()} ₮</Text>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(order, order.quantity - 1)}
                            disabled={order.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-dim text-ink transition hover:border-ink-muted disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-ink">{order.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(order, order.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-dim text-ink transition hover:border-ink-muted"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="text"
                            size="small"
                            onClick={() => setEditingOrder(order)}
                            className="text-ink-muted hover:text-ink"
                          >
                            Edit
                          </Button>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<Trash2 size={14} />}
                            onClick={() => handleDelete(order)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            <Card className="card-elevated border-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-secondary">Items</span>
                  <span className="text-sm font-semibold text-ink">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-secondary">Subtotal</span>
                  <span className="text-sm font-semibold text-ink">{totalAmount.toLocaleString()} ₮</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-secondary">Delivery</span>
                  <span className="text-sm font-semibold text-ink">0 ₮</span>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-ink">Total</span>
                  <span className="text-xl font-bold text-brand-red">{totalAmount.toLocaleString()} ₮</span>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => {
                    const orderOption = localStorage.getItem('orderOption') || 'delivery';
                    const route = orderOption === 'delivery' ? '/qpay' : '/qpayy';
                    navigate(route, { state: { amount: totalAmount } });
                  }}
                  className="rounded-full h-12"
                  icon={<ShoppingCartOutlined />}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Order"
        open={editingOrder !== null}
        onOk={handleSaveEdit}
        onCancel={() => setEditingOrder(null)}
        okText="Save"
        cancelText="Cancel"
        centered
        className="premium-modal"
      >
        {editingOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div className="flex justify-between">
              <Text className="text-ink-secondary">Product:</Text>
              <Text strong className="text-ink">{editingOrder.name}</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text className="text-ink-secondary">Quantity:</Text>
              <InputNumber
                min={1}
                value={editingOrder.quantity}
                onChange={(value) => setEditingOrder({ ...editingOrder, quantity: value })}
                className="w-24"
              />
            </div>
            <div className="flex justify-between">
              <Text className="text-ink-secondary">Unit price:</Text>
              <Text className="text-ink">{editingOrder.price}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-ink-secondary">Total:</Text>
              <Text strong className="text-brand-red">
                {(Number(String(editingOrder.price).replace(/[,₮]/g, '')) * editingOrder.quantity).toLocaleString()} ₮
              </Text>
            </div>
          </Space>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOrder !== null}
        title="Remove item?"
        description={`Are you sure you want to remove "${deleteConfirmOrder?.name}" from your cart?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOrder(null)}
        confirmText="Remove"
        danger
      />
    </div>
  );
}

export default MyOrders;
