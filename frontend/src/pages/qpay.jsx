import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Radio, Typography, Card, Divider, Tabs } from 'antd';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const { TextArea } = Input;
const { Title, Text } = Typography;

function Qpay() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [personType, setPersonType] = useState('individual');
  const [loading, setLoading] = useState(false);

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const [phone, setPhone] = useState('');
  const [entrance, setEntrance] = useState('');
  const [code, setCode] = useState('');
  const [door, setDoor] = useState('');
  const [note, setNote] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [extraPhone, setExtraPhone] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to determine location.');
        }
      );
    } else {
      toast.error('Your browser does not support geolocation.');
    }
  }, []);

  const address = latitude && longitude ? `${latitude}, ${longitude}` : 'Location not determined';
  const exchangeRate = 3500;

  const totalAmount = orders.reduce((sum, item) => {
    const numericPrice = parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
    return sum + numericPrice * item.quantity;
  }, 0);

  const amountUSD = (totalAmount / exchangeRate).toFixed(2);

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
    if (!phone || !entrance || !code || !door || !extraPhone) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!/^\d{8}$/.test(phone)) {
      toast.error('Phone number must be 8 digits');
      return false;
    }
    if (!/^\d{8}$/.test(extraPhone)) {
      toast.error('Additional phone must be 8 digits');
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
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (selectedPayment === 'paypal') {
      toast.info('Please complete payment via PayPal button below.');
      return;
    }

    setLoading(true);

    const orderData = {
      phone,
      entranceOrCompany: entrance,
      code,
      door,
      note,
      extraPhone,
      paymentMethod: selectedPayment,
      personType,
      address: address,
      orders: orders.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    try {
      const res = await axios.post(`${BASE_URL}api/orders`, orderData);
      if (res.data.success) {
        toast.success('Order placed successfully!');
        setTimeout(() => navigate('/'), 1500);
        localStorage.removeItem('orders');
        setPhone('');
        setEntrance('');
        setCode('');
        setDoor('');
        setNote('');
        setExtraPhone('');
        setSelectedPayment(null);
        setPersonType('individual');
        setTab('home');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Checkout</h1>
          <p className="mt-1.5 text-ink-secondary">Complete your delivery order details below.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            <Card className="card-elevated border-0" title={<span className="text-sm font-semibold text-ink">Delivery Information</span>}>
              <div className="space-y-5">
                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">Location</p>
                  <p className="text-sm text-ink">{address}</p>
                </div>

                <Tabs activeKey={tab} onChange={setTab} className="checkout-tabs">
                  <Tabs.TabPane tab="Apartment" key="home" />
                  <Tabs.TabPane tab="Office" key="office" />
                </Tabs>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Phone Number</label>
                    <Input
                      placeholder="8-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <label className="label">{tab === 'office' ? 'Company Name' : 'Entrance Number'}</label>
                    <Input
                      placeholder={tab === 'office' ? 'Company name' : 'Entrance number'}
                      value={entrance}
                      onChange={(e) => setEntrance(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Entrance Code</label>
                    <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Door Number</label>
                    <Input placeholder="Door number" value={door} onChange={(e) => setDoor(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="label">Address Notes</label>
                  <TextArea rows={2} placeholder="Additional address details" value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="mt-4">
                    <label className="label">Additional Phone</label>
                    <Input
                      placeholder="Additional phone number"
                      value={extraPhone}
                      onChange={(e) => setExtraPhone(e.target.value)}
                      maxLength={8}
                    />
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
                    <p className="text-sm font-semibold text-ink mb-4">Scan QR Code to Pay</p>
                    <img src={randomQR} alt="QPay QR Code" className="mx-auto h-44 w-44 object-contain" />
                    <Text type="secondary" className="text-sm mt-2 block">
                      Scan this QR code with your QPay app to complete payment.
                    </Text>
                  </div>
                )}

                {selectedPayment === 'paypal' && (
                  <div className="rounded-xl border border-surface-dim bg-white p-6">
                    <p className="text-sm font-semibold text-ink mb-4">Pay with PayPal</p>
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

                {selectedPayment !== 'paypal' && (
                  <Button type="primary" size="large" block onClick={handleSubmit} loading={loading} className="rounded-full h-12">
                    Place Order
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <Card className="card-elevated border-0 h-fit sticky top-24">
            <Title level={5} className="!text-ink !mb-4">Order Summary</Title>
            {orders.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">Your cart is empty</p>
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

export default Qpay;
