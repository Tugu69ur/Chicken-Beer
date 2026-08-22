import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Menu, X } from 'lucide-react';

const clientLinks = [
  { to: '/client-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/client-orders', label: 'Orders', icon: Package },
];

function ClientShell({ children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="hidden lg:flex flex-col border-r border-surface-dim bg-surface w-64">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-dim">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-sm">
            C
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Client Panel</p>
            <h1 className="text-sm font-bold text-ink tracking-tight">CHICKEN2030</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {clientLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} className="flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-surface-dim">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition hover:bg-red-50 w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-surface border-b border-surface-dim sticky top-0 z-sticky">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-secondary hover:bg-surface-muted"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs">
              C
            </div>
            <span className="text-sm font-bold text-ink">Client</span>
          </div>
          <div className="w-10" />
        </header>

        {showMobileMenu && (
          <div className="lg:hidden border-b border-surface-dim bg-surface px-4 py-3 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {clientLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive ? 'bg-amber-500 text-white' : 'text-ink-secondary hover:bg-surface-muted'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error hover:bg-red-50 mt-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default ClientShell;
