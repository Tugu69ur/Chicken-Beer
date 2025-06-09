import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./components/Register";
import Qpay from "./pages/qpay.jsx";
import MyOrders from "./pages/MyOrders";
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
      </Routes>
    </Router>
  );
}

export default App;
