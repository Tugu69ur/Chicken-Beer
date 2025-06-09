import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import Login from "./Login";
import basket from "../assets/basket.png";
import ProfileIcon from "../assets/profile.png"; // Assuming you have a profile icon

function Navbar({ basketCount, orders }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <>
      <nav className="font-manrope bg-[#F9F9F9] h-2xl shadow-md w-full">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-14" />
          </Link>

          <div className="space-x-6 flex items-center">
            <Link to="/" className="text-gray-700 hover:text-[#D81E1E]">
              Меню
            </Link>
            <Link to="/bar" className="text-gray-700 hover:text-[#D81E1E]">
              Салбар
            </Link>
            <Link to="/delivery" className="text-gray-700 hover:text-[#D81E1E]">
              Захиалгын явц
            </Link>

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
                  <span className="text-gray-700 font-bold">{user.name}</span>
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
                className="text-gray-700 hover:text-red-600"
              >
                Нэвтрэх
              </button>
            )}

            <Link to="/orders" className="relative">
              <img src={basket} alt="Basket" className="h-8" />
              {basketCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D81E1E] text-white text-xs rounded-full px-1">
                  {basketCount}
                </span>
              )}
            </Link>
          </div>
        </div>
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
