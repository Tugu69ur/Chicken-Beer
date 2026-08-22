import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '/assets/logo.png';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';

const clientLinks = [
  { to: '/client-dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/client-orders', label: 'Orders', icon: '📦' },
];

function ClientNavbar() {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-sticky border-b border-surface-dim bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/client-dashboard" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Client"
            className="h-10 w-10 rounded-xl object-contain bg-surface-muted p-1"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Client Panel</p>
            <h1 className="text-base font-extrabold text-ink tracking-tight">CHICKEN2030</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {clientLinks.map((link) => {
            const isActive = link.to === '/client-dashboard'
              ? location.pathname === '/client-dashboard'
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-surface-dim bg-surface-muted px-4 py-2 text-sm text-ink">
              <span className="font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-3 py-1.5 text-white text-xs font-semibold transition hover:bg-brand-red-hover"
              >
                <LogoutOutlined /> Logout
              </button>
            </div>
          ) : (
            <Link to="/" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="md:hidden btn btn-ghost btn-sm"
          aria-label="Open client menu"
        >
          <MenuOutlined />
        </button>
      </div>

      {showMobileMenu && (
        <div className="border-t border-surface-dim bg-surface px-4 pb-4 pt-3 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {clientLinks.map((link) => {
              const isActive = link.to === '/client-dashboard'
                ? location.pathname === '/client-dashboard'
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-brand-red-soft text-brand-red' : 'text-ink-secondary hover:bg-surface-muted'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setShowMobileMenu(false);
                handleLogout();
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 mt-2"
            >
              <LogoutOutlined />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </nav>
  );
}

export default ClientNavbar;
