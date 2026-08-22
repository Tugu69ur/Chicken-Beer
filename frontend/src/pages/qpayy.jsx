import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Radio, Typography, Card, Divider, Select, Badge } from 'antd';
import { ArrowLeft, MapPin } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import EmptyState from '../components/ui/empty-state';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function generatePickupTimes() {
  const times = [];
  const now = new Date();
  let currentMinutes = now.getHours() * 60 + now.getMinutes();
  currentMinutes = Math.ceil(currentMinutes / 15) * 15;
  const start = Math.max(currentMinutes, 9 * 60);
  const end = 24 * 60;
  for (let t = start; t <= end; t += 15) {
    const hours = Math.floor(t / 60);
    const minutes = t % 60;
    const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    times.push(label);
  }
  return times;
}

function Qpayy() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [personType, setPersonType] = useState('individual');
  const [loading, setLoading] = useState(false);

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const [note, setNote] = useState('');
  const [extraPhone, setExtraPhone] = useState('');

  const selectedBranch = (() => {
    try {
      return JSON.parse(localStorage.getItem('selectedBranch') || 'null');
    } catch {
      return null;
    }
  })();
  const branchName = selectedBranch?.name || 'No branch selected';

  const qpayQRCodes = ['/qr.png'];
  const [randomQR, setRandomQR] = useState(null);

  useEffect(() => {
    if (selectedPayment === 'qpay') {
      const randomIndex = Math.floor(Math.random() * qpayQRCodes.length);
      setRandomQR(qpayQRCodes[randomIndex]);
    } else {
      setRandomQR(null);
    }
  }, [selectedPayment]);

  const validateForm = () => {
    if (!extraPhone || !note) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return false;
    }
    if (!personType) {
      toast.error('Please select person type');
      return false;
    }
    if (!selectedBranch) {
      toast.error('Please select a branch');
      return false;
    }
    return true;
  };

  const totalAmount = orders.reduce((sum, item) => {
    const numericPrice = parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
    return sum + numericPrice * item.quantity;
  }, 0);

  const amountUSD = (totalAmount / 3500).toFixed(2);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (selectedPayment === 'paypal') {
      toast.info('Please complete the PayPal payment below.');
      return;
    }

    setLoading(true);

    const orderData = {
      note,
      extraPhone,
      paymentMethod: selectedPayment,
      personType,
      address: branchName,
      orders: orders.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    try {
      const res = await axios.post(`${BASE_URL}api/orderss`, orderData);
      if (res.status === 201 || res.data.success) {
        toast.success('Order placed successfully!');
        setTimeout(() => navigate('/'), 1500);
        localStorage.removeItem('orders');
        setNote('');
        setExtraPhone('');
        setSelectedPayment(null);
        setPersonType('individual');
        setRandomQR(null);
      } else {
        toast.error('Error. Please try again.');
      }
    } catch (err) {
      console.error('Order submit error:', err);
      toast.error('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/orders')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-ink-muted">Cart</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Pickup Order</h1>
          <p className="mt-1.5 text-ink-secondary">Complete your pickup order details below.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            <Card className="card-elevated border-0" title={<span className="text-sm font-semibold text-ink">Order Details</span>}>
              <div className="space-y-5">
                <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                  <MapPin size={18} className="text-amber-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Selected Branch</p>
                    <p className="text-sm font-semibold text-ink mt-0.5">{branchName}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Phone Number</label>
                    <Input
                      size="large"
                      placeholder="Phone number"
                      value={extraPhone}
                      onChange={(e) => setExtraPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Pickup Time</label>
                    <Select
                      size="large"
                      placeholder="Select pickup time"
                      value={note}
                      onChange={(value) => setNote(value)}
                      className="w-full"
                    >
                      {generatePickupTimes().map((time) => (
                        <Option key={time} value={time}>{time}</Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="rounded-xl border border-surface-dim bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">Person Type</p>
                  <Radio.Group onChange={(e) => setPersonType(e.target.value)} value={personType} className="flex gap-4">
                    <Radio value="individual">Individual</Radio>
                    <Radio value="company">Company</Radio>
                  </Radio.Group>
                </div>
              </div>
            </Card>

            <Card className="card-elevated border-0" title={<span className="text-sm font-semibold text-ink">Payment Method</span>}>
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setSelectedPayment('qpay')}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                      selectedPayment === 'qpay'
                        ? 'border-brand-red bg-brand-red-soft text-brand-red'
                        : 'border-surface-dim hover:border-ink-muted text-ink-secondary'
                    }`}
                  >
                    QPay
                  </button>
                  <button
                    onClick={() => setSelectedPayment('paypal')}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                      selectedPayment === 'paypal'
                        ? 'border-brand-red bg-brand-red-soft text-brand-red'
                        : 'border-surface-dim hover:border-ink-muted text-ink-secondary'
                    }`}
                  >
                    Card
                  </button>
                </div>

                {selectedPayment === 'qpay' && randomQR && (
                  <div className="rounded-xl border border-surface-dim bg-white p-6 text-center">
                    <Badge color="#9f1239" text="QPay QR Code" />
                    <img src={randomQR} alt="QPay QR Code" className="mx-auto mt-6 h-44 w-44 object-contain" />
                    <Paragraph className="mt-4 text-ink-secondary text-sm">
                      Scan this QR code with your QPay app to complete payment.
                    </Paragraph>
                  </div>
                )}

                {selectedPayment === 'paypal' && (
                  <div className="rounded-xl border border-surface-dim bg-white p-6">
                    <Badge color="#2563eb" text="PayPal" />
                    <PayPalScriptProvider
                      options={{
                        'client-id': 'AUT2RUGAsNVG2RoDVeyI2S_a7RrfL7K_y8qWloWjPOorgG7AdWPVAxAkHvA_T72EhsUKLrf8fs766JBo',
                        currency: 'USD',
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{ amount: { value: amountUSD } }],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order.capture();
                          toast.success(`Payment successful! Transaction ID: ${details.id}`);
                        }}
                        onError={(err) => {
                          toast.error('Payment failed.');
                          console.error('PayPal error:', err);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}

                <Button type="primary" size="large" block onClick={handleSubmit} loading={loading} className="rounded-full h-12">
                  Place Order
                </Button>
              </div>
            </Card>
          </div>

          <Card className="card-elevated border-0 h-fit sticky top-24">
            <Title level={5} className="!text-ink !mb-4">Order Summary</Title>
            {orders.length === 0 ? (
              <EmptyState title="Cart is empty" description="Add items to your cart to see them here." />
            ) : (
              <div className="space-y-4">
                {orders.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-xl bg-surface-muted p-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <Text strong className="text-ink block truncate text-sm">{item.name}</Text>
                      <Text type="secondary" className="text-xs">×{item.quantity}</Text>
                    </div>
                    <Text strong className="text-ink text-sm whitespace-nowrap">
                      {(parseInt(String(item.price).replace(/[^\d]/g, ''), 10) * item.quantity).toLocaleString()} ₮
                    </Text>
                  </div>
                ))}
                <Divider style={{ margin: '12px 0' }} />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-ink-secondary">
                    <span>Delivery</span>
                    <span>0 ₮</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-secondary">
                    <span>Coupon</span>
                    <span>0 ₮</span>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div className="flex justify-between text-lg font-bold text-ink">
                  <span>Total</span>
                  <span className="text-brand-red">{totalAmount.toLocaleString()} ₮</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Qpayy;
