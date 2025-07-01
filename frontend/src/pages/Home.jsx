import logo from "../assets/logo4.png";
import logo1 from "../assets/logo3.png";
import logo2 from "../assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import Order from "../components/Order";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Input, message, Button, Dropdown } from "antd";
import axios from "axios";
import { BASE_URL } from "../../constants.js";

// Safe parse helper for selectedBranch
function safeParseSelectedBranch() {
  const val = localStorage.getItem("selectedBranch");
  if (!val) return null;

  try {
    return JSON.parse(val);
  } catch {
    return { name: val };
  }
}

const Home = () => {
  const images = [logo2, logo1, logo];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const orderRef = useRef(null);
  const [locationText, setLocationText] = useState("");
  const savedLocation = localStorage.getItem("locationText");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOption, setSelectedOption] = useState("delivery");

  // Save option and branch to localStorage
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    localStorage.setItem("orderOption", option);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    message.success(`Сонгосон салбар: ${branch.name}`);
  };

  // Load saved option and branch on mount
  useEffect(() => {
    const savedOption = localStorage.getItem("orderOption");
    if (savedOption) setSelectedOption(savedOption);

    setSelectedBranch(safeParseSelectedBranch());
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches", error);
        message.error("Салбаруудыг ачааллахад алдаа гарлаа");
      }
    };
    fetchBranches();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      message.error("Таны браузер байршил дэмжихгүй байна.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=80e27b99aa1f483cbd5a18415b749908&language=mn`
          );
          const address = response.data.results[0]?.formatted;
          setLocationText(address || "Хаяг тодорхойлогдсонгүй");
          localStorage.setItem(
            "locationText",
            address || "Хаяг тодорхойлогдсонгүй"
          );
        } catch (error) {
          message.error("Хаяг тодорхойлоход алдаа гарлаа.");
        }
      },
      () => {
        message.error("Байршил авахад алдаа гарлаа.");
      }
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleOrderClick = () => {
    if (orderRef.current) {
      const yOffset = -80;
      const y =
        orderRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      setTimeout(() => {
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 50);
    }
  };

  const updateBasketCount = (count) => {
    setBasketCount((prevCount) => prevCount + count);
  };

  const addOrder = (item, quantity) => {
    const orderItem = {
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
    };
    const updatedOrders = [...orders, orderItem];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("cartUpdated"));
    updateBasketCount(quantity);
    const newCount = basketCount + quantity;
    localStorage.setItem("basketCount", newCount);
  };

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const savedCount = parseInt(localStorage.getItem("basketCount")) || 0;
    setOrders(savedOrders);
    setBasketCount(savedCount);
  }, []);

  return (
    <>
      <Navbar basketCount={basketCount} orders={orders} />

      <div className="relative w-full h-[657px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent z-10" />
        <img
          src={images[currentIndex]}
          alt="swipeable"
          className={`w-full h-full object-cover transform transition-transform duration-500 ease-in-out opacity-100 ${
            isAnimating ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
          }`}
          key={currentIndex}
        />
        {!isAnimating && (
          <div className="absolute w-[500px] left-0 top-1/2 transform -translate-y-1/2 p-4 bg-opacity-50 text-white text-center flex-start z-20">
            <h2 className="text-7xl font-bold">Онлайн захиалга</h2>
            <p className="mt-4 text-xl">
              Амтат шарсан тахиагаа онлайнаар захиалаад амралтын өдрийг гэр бүлтэйгээ өнгөрүүлээрэй.
            </p>
            <button
              className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded"
              onClick={handleOrderClick}
            >
              Захиалах
            </button>
          </div>
        )}
      </div>

      <div className="h-24 w-full bg-slate-100 px-6 md:px-24 lg:px-48 flex items-center gap-4">
        <EnvironmentOutlined
          style={{ fontSize: "24px", color: "#ff4d4f", cursor: "pointer" }}
          onClick={handleGetLocation}
        />
        {selectedOption === "delivery" ? (
          <Input
            placeholder="Байршил оруулах"
            value={locationText || savedLocation || ""}
            readOnly
            variant="default"  // fixed deprecated prop here
            required
            className="h-10 flex-1 min-w-28"
          />
        ) : (
          <Dropdown
            menu={{
              items: branches.map((branch, index) => ({
                key: index,
                label: branch.name,
              })),
              onClick: ({ key }) => handleBranchSelect(branches[key]),
            }}
            placement="bottomLeft"
            arrow
          >
            <Button className="h-10 flex-1 min-w-28 text-left">
              {selectedBranch ? selectedBranch.name : "Салбар сонгох"}
            </Button>
          </Dropdown>
        )}

        <Button
          type="text"
          onClick={() => handleOptionChange("delivery")}
          className={`rounded-full px-6 py-1 text-sm font-medium transition-colors duration-200 ${
            selectedOption === "delivery"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "border border-red-500 text-red-500 hover:bg-red-100"
          }`}
        >
          Хүргэлт
        </Button>
        <Button
          type="text"
          onClick={() => handleOptionChange("pickup")}
          className={`rounded-full px-6 py-1 text-sm font-medium transition-colors duration-200 ${
            selectedOption === "pickup"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "border border-red-500 text-red-500 hover:bg-red-100"
          }`}
        >
          Очиж авах
        </Button>
      </div>

      <div ref={orderRef} className="mt-[-40px]">
        <Order addOrder={addOrder} />
      </div>
      <Footer />
    </>
  );
};

export default Home;
