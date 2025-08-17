import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "/assets/icon5.png";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Basket from "/assets/cart.png";

function Footer() {
  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateQuantity = () => {
    const cart = JSON.parse(localStorage.getItem("orders")) || [];
    const qty = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(qty);
  };

  useEffect(() => {
    updateQuantity();
    window.addEventListener("cartUpdated", updateQuantity);
    window.addEventListener("storage", updateQuantity);
    return () => {
      window.removeEventListener("cartUpdated", updateQuantity);
      window.removeEventListener("storage", updateQuantity);
    };
  }, []);

  return (
    <footer className="bg-[#302F2F] text-white pt-10 pb-4 px-6 md:px-20">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-600 pb-6">
        {/* Logo + Description */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src={logo} alt="Logo" className="h-16 sm:h-24 object-contain" />
          <p className="text-sm leading-relaxed">
            Хаанаас ч хайгаад оломгүй Шунан дурламаар амтыг Та зөвхөн
            CHICKEN2030-ээс амтална.
          </p>
        </div>

        {/* Column 1 */}
        <div>
          <h4 className="font-semibold mb-2">CHICKEN2030</h4>
          <ul className="text-sm space-y-1">
            <li><Link to="#">Түүх</Link></li>
            <li><Link to="#">Чанарын стандарт</Link></li>
            <li><Link to="#">Харшлын мэдээлэл</Link></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold mb-2">Журам</h4>
          <ul className="text-sm space-y-1">
            <li><Link to="#">Үйлчилгээний нөхцөл</Link></li>
            <li><Link to="#">Нууцлалын бодлого</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4 text-center md:text-left">
        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © 2025 Chicken2030. Зохиогчийн эрх хуулиар хамгаалагдсан. Developed by Tugu&Khangunt.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 text-lg">
          <FaFacebookF className="hover:text-red-500 cursor-pointer" />
          <FaInstagram className="hover:text-red-500 cursor-pointer" />
          <FaTwitter className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Floating Basket */}
      <div className="fixed bottom-4 right-4 bg-white text-black rounded-full p-2 shadow-md">
        <Link to="/orders">
          <div className="relative">
            <img src={Basket} alt="Basket Icon" className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {totalQuantity > 0 ? totalQuantity : 0}
            </span>
          </div>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
