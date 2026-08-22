import { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants.js';
import { useNavigate } from 'react-router-dom';
import icon from '/assets/cart.png';
import { Modal, Row, Col, Button, Typography, message } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SkeletonCard, SkeletonText } from '../components/ui/loading-state';
import EmptyState from '../components/ui/empty-state';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

function safeParseSelectedBranch() {
  const val = localStorage.getItem('selectedBranch');
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return { name: val };
  }
}

function groupByCategory(items) {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return Object.entries(grouped).map(([title, items]) => ({ title, items }));
}

function Menu({ addOrder }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedOption = localStorage.getItem('orderOption') || 'delivery';
  const selectedBranch = safeParseSelectedBranch();
  const locationText = localStorage.getItem('locationText') || '';

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const getNumericPrice = (priceString) => {
    return parseInt(String(priceString).replace(/[^\d]/g, ''), 10) || 0;
  };

  const handleAddToBasket = (item) => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem('user'));
      } catch {
        return null;
      }
    })();

    if (!user) {
      setLoginPrompt(true);
      return;
    }

    if (selectedOption === 'pickup' && !selectedBranch) {
      toast.error('Please select a branch first.');
      return;
    }

    if (selectedOption === 'delivery' && !locationText.trim()) {
      toast.error('Location not set. Please enable location or enter it manually.');
      return;
    }

    setSelectedItem(item);
    setQuantity(1);
    setShowConfirmDialog(true);
  };

  const confirmAddToBasket = () => {
    if (selectedItem) {
      addOrder(selectedItem, quantity);
      setShowConfirmDialog(false);
      setShowSuccess(true);
    }
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSelectedItem(null);
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  useEffect(() => {
    fetch(`${BASE_URL}api/menu`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setMenu(groupByCategory(json.data));
        } else {
          setMenu([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
        message.error('Failed to load menu');
      });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="space-y-12">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-6">
              <SkeletonText lines={1} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (menu.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <EmptyState
          title="No menu items available"
          description="Our menu is being updated. Please check back later for delicious options."
          actionLabel="Browse Home"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 mt-8 sm:mt-12">
      {menu.map((category, idx) => (
        <section key={idx} className="mb-14 last:mb-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">{category.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{category.items.length} items</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl border border-surface-dim overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-surface-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink leading-tight">{item.name}</h3>
                    <p className="text-base font-bold text-brand-red whitespace-nowrap">
                      {getNumericPrice(item.price).toLocaleString()} ₮
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-ink-secondary leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAddToBasket(item)}
                    className="mt-4 w-full btn btn-primary btn-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Login Prompt Modal */}
      <Modal
        open={loginPrompt}
        footer={null}
        centered
        onCancel={() => setLoginPrompt(false)}
        width={400}
        className="premium-modal"
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-soft">
            <ShoppingCart size={24} className="text-brand-red" />
          </div>
          <Title level={4} className="!text-ink">Sign in required</Title>
          <Paragraph className="text-ink-secondary">Please sign in to continue ordering.</Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setLoginPrompt(false);
              navigate('/');
            }}
            className="rounded-full"
          >
            Sign In
          </Button>
        </div>
      </Modal>

      {/* Add to Cart Confirmation Modal */}
      <Modal
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        footer={null}
        width={520}
        centered
        className="premium-modal"
      >
        {selectedItem && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <Title level={4} className="!mb-0 text-ink">Add to Order</Title>
              <button onClick={() => setShowConfirmDialog(false)} className="text-ink-muted hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={10}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-40 w-full rounded-xl object-cover"
                />
              </Col>
              <Col xs={24} md={14}>
                <Title level={5} className="!mb-1 text-ink">{selectedItem.name}</Title>
                <Text strong className="text-lg text-brand-red">
                  {getNumericPrice(selectedItem.price).toLocaleString()} ₮
                </Text>
                <Paragraph type="secondary" className="mt-2 text-sm">
                  {selectedItem.description}
                </Paragraph>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim text-ink transition hover:border-ink-muted disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-base font-bold text-ink w-8 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-dim text-ink transition hover:border-ink-muted"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <Text strong className="text-xl text-brand-red">
                    {(getNumericPrice(selectedItem.price) * quantity).toLocaleString()} ₮
                  </Text>
                  <Button type="primary" size="large" onClick={confirmAddToBasket} className="rounded-full">
                    Add to Cart
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        open={showSuccess}
        footer={null}
        centered
        closable={false}
        width={380}
        className="premium-modal"
      >
        <div className="text-center py-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <Title level={4} className="!mb-2 text-ink">Added to Cart</Title>
          <Paragraph className="text-ink-secondary mb-6">Item successfully added to your cart.</Paragraph>
          <div className="flex flex-col gap-3">
            <Button onClick={handleContinueShopping} className="rounded-full">Continue Shopping</Button>
            <Button type="primary" onClick={handleGoToOrders} className="rounded-full">View Cart</Button>
          </div>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Menu;
