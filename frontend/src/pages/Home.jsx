import { useState, useEffect, useRef } from 'react';
import Order from '../components/Order';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer.jsx';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../constants.js';

function safeParseSelectedBranch() {
  const val = localStorage.getItem('selectedBranch');
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return { name: val };
  }
}

function Home() {
  const [basketCount, setBasketCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [locationText, setLocationText] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOption, setSelectedOption] = useState('delivery');
  const orderRef = useRef(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const savedCount = parseInt(localStorage.getItem('basketCount') || '0');
    setOrders(savedOrders);
    setBasketCount(savedCount);
    setSelectedBranch(safeParseSelectedBranch());
    const savedOption = localStorage.getItem('orderOption');
    if (savedOption) setSelectedOption(savedOption);
    const savedLocation = localStorage.getItem('locationText');
    if (savedLocation) setLocationText(savedLocation);
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error('Failed to fetch branches', error);
        message.error('Failed to load branches');
      }
    };
    fetchBranches();
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    localStorage.setItem('orderOption', option);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
    message.success(`Selected: ${branch.name}`);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      message.error('Your browser does not support geolocation.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=80e27b99aa1f483cbd5a18415b749908&language=mn`,
          );
          const address = response.data.results[0]?.formatted;
          setLocationText(address || 'Location not found');
          localStorage.setItem('locationText', address || 'Location not found');
        } catch (error) {
          message.error('Failed to get address.');
        }
      },
      () => {
        message.error('Failed to get location.');
      },
    );
  };

  const addOrder = (item, quantity) => {
    const orderItem = {
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
    };
    const updatedOrders = [...orders, orderItem];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    const newCount = basketCount + quantity;
    setBasketCount(newCount);
    localStorage.setItem('basketCount', newCount.toString());
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleOrderClick = () => {
    if (orderRef.current) {
      const yOffset = -80;
      const y = orderRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      setTimeout(() => {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-red-soft/30 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center rounded-full bg-brand-red-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-red">
                  New Taste
                </span>
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-[1.1]">
                  The new era of<br />
                  <span className="text-brand-red">chicken</span> has arrived
                </h1>
                <p className="mt-6 text-lg text-ink-secondary leading-relaxed max-w-lg">
                  Marinated, crispy, and freshly prepared chicken delivered straight to your table every single day.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={handleOrderClick} className="btn btn-primary btn-lg">
                    Order Now
                  </button>
                  <button onClick={() => window.location.href = '/map'} className="btn btn-secondary btn-lg">
                    Our Locations
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                {[
                  { icon: '🚚', title: 'Fast Delivery', desc: 'Hot & fresh in 30 min' },
                  { icon: '💰', title: 'Best Prices', desc: 'Premium quality, fair price' },
                  { icon: '🥗', title: 'Fresh Ingredients', desc: 'Fresh produce daily' },
                  { icon: '📱', title: 'Easy Ordering', desc: 'One-tap ordering' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 text-xl">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-ink">{feature.title}</h3>
                    <p className="mt-1.5 text-xs text-ink-secondary leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Location & Options Section */}
        <section className="border-t border-surface-dim bg-surface-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="card p-6 sm:p-8 shadow-md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-red">Location & Preferences</p>
                  <h2 className="mt-2 text-2xl font-bold text-ink">Make your order easier</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="btn btn-secondary btn-sm"
                  >
                    Get Location
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('pickup')}
                    className={`btn btn-sm ${selectedOption === 'pickup' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('delivery')}
                    className={`btn btn-sm ${selectedOption === 'delivery' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Delivery
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="card p-5">
                  <div className="flex items-center gap-2 text-ink-secondary mb-3">
                    <EnvironmentOutlined style={{ fontSize: 18, color: '#9f1239' }} />
                    <span className="text-sm font-semibold">Your nearest location</span>
                  </div>
                  {selectedOption === 'pickup' && (
                    <Dropdown
                      menu={{
                        items: branches.map((branch, index) => ({
                          key: index,
                          label: <span className="block px-2 py-1.5 text-sm">{branch.name}</span>,
                          onClick: () => handleBranchSelect(branch),
                        })),
                        selectable: true,
                        selectedKeys: selectedBranch
                          ? [branches.findIndex((b) => b.name === selectedBranch.name).toString()]
                          : [],
                      }}
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-surface-dim bg-white text-ink text-sm font-medium shadow-sm hover:border-brand-red transition-all">
                        <span className={selectedBranch ? '' : 'text-ink-muted'}>
                          {selectedBranch ? selectedBranch.name : 'Select a branch'}
                        </span>
                        <span className="text-ink-muted text-xs">▼</span>
                      </button>
                    </Dropdown>
                  )}
                  {selectedOption === 'delivery' && (
                    <div className="px-4 py-3 rounded-xl border border-surface-dim bg-white text-sm text-ink-muted">
                      {locationText || 'Click "Get Location" to enable delivery'}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Payment</p>
                    <p className="mt-2 text-sm text-ink-secondary">Online & cash on delivery available.</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Privacy</p>
                    <p className="mt-2 text-sm text-ink-secondary">Your data is safe with us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-surface-dim" />
        </div>

        {/* Menu Section */}
        <div ref={orderRef} className="mt-8 sm:mt-12">
          <Order addOrder={addOrder} />
        </div>
      </main>
    </div>
  );
}

export default Home;
