import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import Login from "./Login";
import ProfileIcon from "../assets/profile.png"; // Assuming you have a profile icon

function Navbar({ basketCount, orders }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="font-manrope bg-[#F9F9F9] shadow-md w-full">
        <div
          className={`mx-auto px-4 py-3 flex justify-between items-center ${
            user?.role === "admin" || user?.role === "client"
              ? "max-w-4xl"
              : "max-w-2xl"
          }`}
        >
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="h-14" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {user ? (
              user.role === "client" ? (
                <>
                  <Link
                    to="/client-dashboard"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Салбарын захиалгууд
                  </Link>
                  <Link
                    to="/client-orders"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Хүргэлтийн захиалгууд
                  </Link>
                  <Link
                    to="/map"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Түүхий эд захиалга
                  </Link>
                </>
              ) : user.role === "admin" ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/manage-admins"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Admins
                  </Link>
                  <Link
                    to="/manage-clients"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Clients
                  </Link>
                  <Link
                    to="/admin-menu"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Menu
                  </Link>
                  <Link
                    to="/admin-branchs"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Branchs
                  </Link>
                </>
              ) : (
                // Other logged-in users
                <>
                  <Link to="/" className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base">
                    Меню
                  </Link>
                  <Link
                    to="/map"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Салбар
                  </Link>
                  <Link
                    to="/delivery"
                    className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                  >
                    Захиалгын явц
                  </Link>
                </>
              )
            ) : (
              // Guest links (not logged in)
              <>
                <Link to="/" className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base">
                  Меню
                </Link>
                <Link to="/map" className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base">
                  Салбар
                </Link>
                <Link
                  to="/delivery"
                  className="text-gray-700 hover:text-[#D81E1E] text-sm md:text-base"
                >
                  Захиалгын явц
                </Link>
              </>
            )}

            {/* User profile or login (desktop) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={ProfileIcon}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-bold text-sm md:text-base">{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-700 hover:text-red-600 text-sm md:text-base"
              >
                Нэвтрэх
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="md:hidden text-gray-700 focus:outline-none text-2xl"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="flex flex-col space-y-3 px-4 pb-4 md:hidden bg-[#F9F9F9] shadow">
            {user ? (
              user.role === "client" ? (
                <>
                  <Link
                    to="/client-dashboard"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Салбарын захиалгууд
                  </Link>
                  <Link
                    to="/client-orders"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Хүргэлтийн захиалгууд
                  </Link>
                  <Link
                    to="/map"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Түүхий эд захиалга
                  </Link>
                </>
              ) : user.role === "admin" ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/manage-admins"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Admins
                  </Link>
                  <Link
                    to="/manage-clients"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Clients
                  </Link>
                  <Link
                    to="/admin-menu"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Menu
                  </Link>
                  <Link
                    to="/admin-branchs"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Branchs
                  </Link>
                </>
              ) : (
                // Other logged-in users
                <>
                  <Link to="/" className="text-gray-700 hover:text-[#D81E1E] text-base" onClick={() => setShowMobileMenu(false)}>
                    Меню
                  </Link>
                  <Link
                    to="/map"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Салбар
                  </Link>
                  <Link
                    to="/delivery"
                    className="text-gray-700 hover:text-[#D81E1E] text-base"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Захиалгын явц
                  </Link>
                </>
              )
            ) : (
              // Guest links (not logged in)
              <>
                <Link to="/" className="text-gray-700 hover:text-[#D81E1E] text-base" onClick={() => setShowMobileMenu(false)}>
                  Меню
                </Link>
                <Link to="/map" className="text-gray-700 hover:text-[#D81E1E] text-base" onClick={() => setShowMobileMenu(false)}>
                  Салбар
                </Link>
                <Link
                  to="/delivery"
                  className="text-gray-700 hover:text-[#D81E1E] text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Захиалгын явц
                </Link>
              </>
            )}

            {/* User profile or login (mobile) */}
            {user ? (
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={ProfileIcon}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-gray-700 font-bold text-base">{user.name}</span>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="ml-2 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Гарах
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setShowMobileMenu(false);
                }}
                className="text-gray-700 hover:text-red-600 text-base mt-2"
              >
                Нэвтрэх
              </button>
            )}
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
      <div className="w-full h-4 bg-red-600"></div>
    </>
  );
}

export default Navbar;
