import logo from "../assets/logo4.png";
import logo1 from "../assets/logo3.png";
import logo2 from "../assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import Order from "../components/Order";
import Navbar from "../components/Navbar";
import MyOrders from "../pages/MyOrders";
import Footer from "../components/Footer.jsx";

const Home = () => {
  const images = [logo2, logo1, logo];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [basketCount, setBasketCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const orderRef = useRef(null);

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
      }, 50); // slight delay
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
            isAnimating
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
          key={currentIndex}
        />
        {!isAnimating && (
          <div className="absolute w-[500px] left-0 top-1/2 transform -translate-y-1/2 p-4 bg-opacity-50 text-white text-center flex-start z-20">
            <h2 className="text-7xl font-bold">Онлайн захиалга</h2>
            <p className="mt-4 text-xl">
              Амтат шарсан тахиагаа онлайнаар захиалаад амралтын өдрийг гэр
              бүлтэйгээ өнгөрүүлээрэй.
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
      <div className="h-24 w-full bg-slate-100"></div>
      <div ref={orderRef} className="mt-[-40px]">
        <Order addOrder={addOrder} />
      </div>
      <Footer />
    </>
  );
};

export default Home;
