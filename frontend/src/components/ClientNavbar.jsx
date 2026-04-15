import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "/assets/logo.png";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";

const clientLinks = [
  { to: "/client-dashboard", label: "Самбар" },
  { to: "/client-orders", label: "Захиалгууд" },
];

function ClientNavbar() {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = (() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/client-dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Chicken2030" className="h-12 w-auto object-contain" />
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.28em] text-[#D81E1E]">Client Panel</p>
            <h1 className="text-lg font-black text-slate-900">CHICKEN2030</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {clientLinks.map((link) => {
            const isActive = link.to === "/client-dashboard"
              ? location.pathname === "/client-dashboard"
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium transition ${
                  isActive ? "text-[#D81E1E]" : "text-slate-700 hover:text-[#D81E1E]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                <span>{user.name}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Гарах
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" className="btn-brand">
              Нэвтрэх
            </Link>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700"
          aria-label="Open client menu"
        >
          <MenuOutlined />
        </button>
      </div>

      {showMobileMenu && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            {clientLinks.map((link) => {
              const isActive = link.to === "/client-dashboard"
                ? location.pathname === "/client-dashboard"
                : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-[#FDECE7] text-[#D81E1E]" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setShowMobileMenu(false);
                handleLogout();
              }}
              className="rounded-2xl border border-slate-200 bg-[#D81E1E] px-4 py-3 text-sm font-medium text-white"
            >
              Гарах
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default ClientNavbar;
