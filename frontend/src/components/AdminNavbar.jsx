import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "/assets/logo.png";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";

const adminLinks = [
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/manage-admins", label: "Админ" },
  { to: "/admin-branchs", label: "Салбар" },
  { to: "/manage-clients", label: "Үйлчлүүлэгч" },
  { to: "/admin-menu", label: "Меню" },
];

function AdminNavbar() {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-slate-950/95 text-slate-100 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/admin-dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Admin" className="h-12 w-auto rounded-2xl bg-white/10 p-1" />
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Admin Panel</p>
            <h1 className="text-lg font-black text-white">CHICKEN2030</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                location.pathname === link.to
                  ? "bg-[#D81E1E] text-white shadow-lg shadow-[#D81E1E]/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <span>{user.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#D81E1E] px-3 py-2 text-white transition hover:bg-[#b11c1c]"
              >
                <LogoutOutlined /> Гарах
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[#D81E1E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b11c1c]"
            >
              <LogoutOutlined /> Гарах
            </button>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xl text-white"
          aria-label="Open admin menu"
        >
          <MenuOutlined />
        </button>
      </div>

      {showMobileMenu && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setShowMobileMenu(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  location.pathname === link.to ? "bg-[#D81E1E] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-slate-700 bg-[#D81E1E] px-4 py-3 text-sm font-medium text-white"
            >
              Гарах
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;
