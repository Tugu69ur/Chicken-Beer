import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';
import logo from '/assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu, X, ShoppingCart, ChevronDown, UtensilsCrossed } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Menu' },
  { to: '/map', label: 'Locations' },
  { to: '/delivery', label: 'Track Order' },
];

function Navbar({ basketCount = 0 }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(basketCount);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setCartCount(basketCount);
  }, [basketCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const user = (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`sticky top-0 z-sticky border-b border-surface-dim bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 h-16 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red text-white">
              <UtensilsCrossed size={20} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
                Chicken & Beer
              </p>
              <h1 className="text-base font-extrabold text-ink tracking-tight">
                CHICKEN2030
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? 'text-brand-red'
                      : 'text-ink-secondary hover:text-ink hover:bg-surface-muted'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand-red" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-xl text-ink-secondary transition hover:bg-surface-muted hover:text-ink"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl border border-surface-dim bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-ink-muted hover:shadow-sm"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red-soft text-brand-red text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={14} className="text-ink-muted" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-surface-dim bg-white shadow-lg animate-scale-in">
                      <div className="px-4 py-3 border-b border-surface-dim bg-surface-muted/50">
                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{user.phone}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-error transition hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-sm">
                Sign In
              </button>
            )}

            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-ink-secondary hover:bg-surface-muted"
              aria-label="Open menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="border-t border-surface-dim bg-white px-4 pb-4 pt-2 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-red-soft text-brand-red'
                        : 'text-ink-secondary hover:bg-surface-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/orders"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-ink-secondary hover:bg-surface-muted"
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <ToastContainer position="top-right" autoClose={3000} />

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;
