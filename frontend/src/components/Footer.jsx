import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '/assets/icon5.png';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';

function Footer() {
  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateQuantity = () => {
    const cart = JSON.parse(localStorage.getItem('orders') || '[]');
    const qty = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setTotalQuantity(qty);
  };

  useEffect(() => {
    updateQuantity();
    window.addEventListener('cartUpdated', updateQuantity);
    window.addEventListener('storage', updateQuantity);
    return () => {
      window.removeEventListener('cartUpdated', updateQuantity);
      window.removeEventListener('storage', updateQuantity);
    };
  }, []);

  return (
    <footer className="mt-auto border-t border-surface-dim bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
                  CHICKEN2030
                </p>
                <p className="max-w-lg text-sm leading-relaxed text-slate-400 mt-1">
                  Premium chicken experience delivered fresh to your door.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-700 px-3 py-1.5">Fast Delivery</span>
              <span className="rounded-full border border-slate-700 px-3 py-1.5">Pickup</span>
              <span className="rounded-full border border-slate-700 px-3 py-1.5">Premium Quality</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Menu</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="transition hover:text-white">Our Menu</Link></li>
              <li><Link to="/about" className="transition hover:text-white">About Us</Link></li>
              <li><Link to="/map" className="transition hover:text-white">Locations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="#" className="transition hover:text-white">Terms of Service</Link></li>
              <li><Link to="#" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/delivery" className="transition hover:text-white">Track Order</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Chicken2030. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#" className="p-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 transition">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 transition">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 transition">
              <FaTwitter size={16} />
            </a>
          </div>
        </div>
      </div>

      <Link
        to="/orders"
        className="fixed bottom-6 right-6 z-toast flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition hover:scale-105 hover:shadow-xl"
      >
        <ShoppingCart size={22} className="text-ink" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
            {totalQuantity}
          </span>
        )}
      </Link>
    </footer>
  );
}

export default Footer;
