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
    <footer className="bg-[#121212] text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-[2.2fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F7B500]">
                  CHICKEN2030
                </p>
                <p className="max-w-lg text-sm leading-6 text-slate-300">
                  Хаанаас ч хайгаад оломгүй шунан дурламаар амтыг та зөвхөн Chicken2030-ээс амтална.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-slate-700 px-3 py-1">Хүргэлт</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">Pickup</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">Түргэн үйлчилгээ</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Меню</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#">Түүх</Link></li>
              <li><Link to="#">Чанарын стандарт</Link></li>
              <li><Link to="#">Харшлын мэдээлэл</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Журам</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#">Үйлчилгээний нөхцөл</Link></li>
              <li><Link to="#">Нууцлалын бодлого</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-700 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2025 Chicken2030. Зохиогчийн эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex items-center gap-4 text-lg text-slate-400">
            <FaFacebookF className="cursor-pointer transition hover:text-[#D81E1E]" />
            <FaInstagram className="cursor-pointer transition hover:text-[#D81E1E]" />
            <FaTwitter className="cursor-pointer transition hover:text-[#D81E1E]" />
          </div>
        </div>
      </div>

      <Link to="/orders" className="fixed bottom-5 right-5 z-50 rounded-full bg-white p-3 shadow-2xl transition hover:scale-105">
        <div className="relative">
          <img src={Basket} alt="Basket Icon" className="h-9 w-9" />
          <span className="absolute -top-2 -right-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#D81E1E] px-1.5 text-xs font-semibold text-white">
            {totalQuantity > 0 ? totalQuantity : 0}
          </span>
        </div>
      </Link>
    </footer>
  );
}

export default Footer;
