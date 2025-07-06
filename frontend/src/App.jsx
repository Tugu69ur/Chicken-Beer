import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./components/Register";
import Qpay from "./pages/qpay.jsx";
import MyOrders from "./pages/MyOrders";
import Map from "./pages/Map.jsx";
import Qpayy from "./pages/qpayy.jsx";
import ClientDashboard from "./pages/client/ClientDashboard.jsx";
import ClientOrders from "./pages/client/ClientOrders.jsx";
import RoleProtectedRoute from "./routes/RoleProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminControl from "./pages/admin/AdminControl.jsx";
import ClientControl from "./pages/admin/ClientControl.jsx";
import MenuControl from "./pages/admin/MenuControl.jsx";
import BranchControl from "./pages/admin/BranchControl.jsx";
import "antd/dist/reset.css";


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

        <Route
          path="/client-dashboard"
          element={
            <RoleProtectedRoute allowedRole="client">
              <ClientDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/client-orders"
          element={
            <RoleProtectedRoute allowedRole="client">
              <ClientOrders />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/manage-admins"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminControl />
            </RoleProtectedRoute>
          } 
        />
        <Route
          path="/manage-clients"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <ClientControl />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin-menu"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <MenuControl />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-branchs"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <BranchControl />
            </RoleProtectedRoute>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
