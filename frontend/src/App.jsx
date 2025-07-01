import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./components/Register";
import Qpay from "./pages/qpay.jsx";
import MyOrders from "./pages/MyOrders";
import Map from "./pages/Map.jsx"
import Qpayy from "./pages/qpayy.jsx";
import ClientDashboard from "./pages/client/ClientDashboard.jsx";
import ClientOrders from "./pages/client/ClientOrders.jsx";
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/qpay" element={<Qpay />} />
        <Route path="/qpayy" element={<Qpayy />} />
        <Route path="/map" element={<Map />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/client-orders" element={<ClientOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
