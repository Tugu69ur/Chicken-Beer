import logo from "/assets/logo4.png";
import logo1 from "/assets/logo3.png";
import logo2 from "/assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import Order from "../components/Order";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Input, message, Button, Dropdown, Select } from "antd";
import axios from "axios";
import { BASE_URL } from "../../constants.js";

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

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    localStorage.setItem("orderOption", option);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    message.success(`Сонгосон салбар: ${branch.name}`);
  };

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
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=80e27b99aa1f483cbd5a18415b749908&language=mn`,
          );
          const address = response.data.results[0]?.formatted;
          setLocationText(address || "Хаяг тодорхойлогдсонгүй");
          localStorage.setItem(
            "locationText",
            address || "Хаяг тодорхойлогдсонгүй",
          );
        } catch (error) {
          message.error("Хаяг тодорхойлоход алдаа гарлаа.");
        }
      },
      () => {
        message.error("Байршил авахад алдаа гарлаа.");
      },
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
      quantity,
      image: item.image,
    };
    const updatedOrders = [...orders, orderItem];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("cartUpdated"));
    updateBasketCount(quantity);
    localStorage.setItem("basketCount", basketCount + quantity);
  };

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const savedCount = parseInt(localStorage.getItem("basketCount")) || 0;
    setOrders(savedOrders);
    setBasketCount(savedCount);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 bg-[#f8eec]">
      <Navbar basketCount={basketCount} orders={orders} />

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle,_rgba(255,249,241,0.84),transparent_70%)]" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,186,98,0.34),transparent_50%)] blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(179,95,255,0.22),transparent_50%)] blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-56 h-44 w-44 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(98,210,255,0.2),transparent_50%)] blur-3xl" />
        <section className="relative overflow-hidden pt-8">
          <div className="absolute inset-0 bg-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="hero-panel rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,241,229,0.88))] p-8 shadow-2xl backdrop-blur-xl sm:p-12">
                <span className="inline-flex rounded-full bg-gradient-to-r from-[#FFD8A8] via-[#FFB3BA] to-[#F8D2FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9D2D2A] shadow-sm">
                  Шинэ амт
                </span>
                <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Тахианы шинэ эрин үед тавтай морилно уу
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                  Шүүслэг, амтлаг тахиаг өдөр бүр шинээр бэлтгэн таны ширээнд
                  хүргэнэ.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={handleOrderClick} className="btn-brand">
                    Захиалах
                  </button>
                  <button className="btn-secondary">Салбарууд</button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Хурдан хүргэлт",
                    description:
                      "30 минутын дотор халуун, шинэхэн бүтээгдэхүүн",
                    icon: "🚚",
                  },
                  {
                    title: "Хямд үнэ",
                    description: "Өндөр чанар, боломжийн үнэ",
                    icon: "💰",
                  },
                  {
                    title: "Шинэ орц",
                    description: "Өдөр бүр шинэ чанар",
                    icon: "🥗",
                  },
                  {
                    title: "Хялбар захиалга",
                    description: "Нэг товшилтоор авах",
                    icon: "📱",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-[#fff6f1] to-[#f7f2ff] p-6 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFE0B2] to-[#FFBACD] text-2xl shadow-sm">
                      {card.icon}
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="-mt-12 rounded-[32px] bg-gradient-to-br from-[#fff4ef] via-[#fff0ff] to-[#eef7ff] border border-[#F5D7B4] p-6 shadow-2xl shadow-[#f4dbce]/40 sm:p-8 md:p-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#D81E1E]">
                  Байршил ба түргэн сонголтууд
                </p>
                <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                  Таны захиалгыг илүү хялбар болгоно
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="btn-secondary"
                >
                  Байршил авах
                </button>
                <button
                  type="button"
                  onClick={() => handleOptionChange("pickup")}
                  className={
                    selectedOption === "pickup" ? "btn-brand" : "btn-secondary"
                  }
                >
                  Салбараас авах
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-[1.9fr_1.1fr] items-center">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-2">
                  {/* Location label */}
                  <div className="flex items-center gap-2 text-slate-600">
                    <EnvironmentOutlined
                      style={{ fontSize: 20, color: "#D81E1E" }}
                    />
                    <span className="text-sm font-medium">
                      Таньд хамгийн ойр байршил
                    </span>
                  </div>

                  {/* Dropdown */}
                  {selectedOption === "pickup" && (
                    <Dropdown
                      menu={{
                        items: branches.map((branch, index) => ({
                          key: index,
                          label: (
                            <span className="block px-2 py-1">
                              {branch.name}
                            </span>
                          ),
                          onClick: () => handleBranchSelect(branch),
                        })),
                        selectable: true,
                        selectedKeys: selectedBranch
                          ? [
                              branches
                                .findIndex(
                                  (b) => b.name === selectedBranch.name,
                                )
                                .toString(),
                            ]
                          : [],
                      }}
                      trigger={["click"]}
                      placement="bottomLeft"
                    >
                      <button
                        className="
          w-full max-w-md
          flex items-center justify-between
          px-4 py-3
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-900
          shadow-sm
          hover:border-red-500
          hover:shadow-md
          transition-all duration-200
        "
                      >
                        <span
                          className={selectedBranch ? "" : "text-slate-400"}
                        >
                          {selectedBranch
                            ? selectedBranch.name
                            : "Салбар сонгох"}
                        </span>

                        <span className="text-slate-400 text-sm">▼</span>
                      </button>
                    </Dropdown>
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#FFF4ED] p-4 text-sm text-slate-800 shadow-sm">
                  <p className="font-semibold">Төлбөр</p>
                  <p className="mt-2 text-slate-600">
                    Онлайн болон хүргэлтийн төлбөрт тохирсон.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#EDF7FF] p-4 text-sm text-slate-800 shadow-sm">
                  <p className="font-semibold">Нууцлал</p>
                  <p className="mt-2 text-slate-600">
                    Танд зориулсан нууцлал ба аюулгүй захиалга.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full mt-[-35px] h-0.5 bg-[#c97f7f]" />

        <div ref={orderRef} className="mt-[-30px]">
          <Order addOrder={addOrder} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
