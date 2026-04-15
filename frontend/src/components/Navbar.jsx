import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "/assets/logo.png";
import Login from "./Login";
import ProfileIcon from "/assets/profile.png";

const navLinks = [
  { to: "/", label: "Меню" },
  { to: "/map", label: "Салбар" },
  { to: "/delivery", label: "Захиалгын явц" },
];

function Navbar() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Chicken2030" className="h-14 w-auto object-contain" />
            <div className="ml-10 mt-2 hidden sm:block">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D81E1E]">Chicken & Beer</p>
              <h1 className="text-lg font-black text-slate-900">CHICKEN2030</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-base font-medium transition ${
                    isActive
                      ? "text-[#D81E1E]"
                      : "text-slate-700 hover:text-[#D81E1E]"
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
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  <img src={ProfileIcon} alt="User" className="h-8 w-8 rounded-full object-cover" />
                  <span>{user.name}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
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
              <button
                onClick={() => setShowLogin(true)}
                className="btn-brand"
              >
                Нэвтрэх
              </button>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="md:hidden rounded-full border border-slate-200 bg-white p-2 text-xl text-slate-700 transition hover:border-slate-300"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {showMobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive =
                  link.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#FDECE7] text-[#D81E1E]"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Гарах
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLogin(true);
                  }}
                  className="btn-brand w-full"
                >
                  Нэвтрэх
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showLogin && (
        <Login
          onClose={() => {
            setShowLogin(false);
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }}
        />
      )}
    </>
  );
}

export default Navbar;
