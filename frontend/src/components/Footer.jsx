import { Link } from "react-router-dom";
import logo from "../assets/icon5.png"; 
import { FaPhone, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-10 pb-4 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-600 pb-6">
        <div className="md:col-span-2 flex items-start gap-4">
          <img src={logo} alt="KFC Logo" className="h-24" />
          <p className="text-sm mt-7">
            Хаанаас ч хайгаад оломгүй Шунан дурламаар амтыг Та зөвхөн CHICKEN2030-ээс амтална.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">CHICKEN2030</h4>
          <ul className="text-sm space-y-1">
            <li><Link to="#">Түүх</Link></li>
            <li><Link to="#">Чанарын стандарт</Link></li>
            <li><Link to="#">Харшлын мэдээлэл</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Журам</h4>
          <ul className="text-sm space-y-1">
            <li><Link to="#">Үйлчилгээний нөхцөл</Link></li>
            <li><Link to="#">Нууцлалын бодлого</Link></li>
          </ul>
        </div>

      </div>

      <div className="flex flex-col mx-56 md:flex-row items-center mt-4 gap-4">
        <p className="text-xs text-gray-400">
          © 2025 Chicken2030. Зохиогчийн эрх хуулиар хамгаалагдсан. Developed by Tugu&Khangunt.
        </p>

        <div className="flex items-start gap-4 ml-[600px] text-white">
          <FaFacebookF className="hover:text-red-500 cursor-pointer" />
          <FaInstagram className="hover:text-red-500 cursor-pointer" />
          <FaTwitter className="hover:text-red-500 cursor-pointer" />
        </div>
      </div>
      

      <div className="fixed bottom-6 right-6 bg-white text-black rounded-full p-2 shadow-md">
        <Link to="/orders">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.3A1 1 0 007 20h10a1 1 0 001-1l.6-3" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              0
            </span>
          </div>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
