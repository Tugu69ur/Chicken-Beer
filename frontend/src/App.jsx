import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "./components/shells/app-shell";
import AdminShell from "./components/shells/admin-shell";
import ClientShell from "./components/shells/client-shell";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./components/Register";
import Qpay from "./pages/qpay.jsx";
import Qpayy from "./pages/qpayy.jsx";
import MyOrders from "./pages/MyOrders";
import Map from "./pages/Map.jsx";
import Delivery from "./pages/Delivery.jsx";
import ClientDashboard from "./pages/client/ClientDashboard.jsx";
import ClientOrders from "./pages/client/ClientOrders.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminControl from "./pages/admin/AdminControl.jsx";
import ClientControl from "./pages/admin/ClientControl.jsx";
import MenuControl from "./pages/admin/MenuControl.jsx";
import BranchControl from "./pages/admin/BranchControl.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/qpay" element={<Qpay />} />
          <Route path="/qpayy" element={<Qpayy />} />
          <Route path="/map" element={<Map />} />
          <Route path="/delivery" element={<Delivery />} />
        </Route>

        <Route
          path="/client-dashboard"
          element={
            <RoleProtectedRoute allowedRole="client">
              <ClientShell>
                <ClientDashboard />
              </ClientShell>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/client-orders"
          element={
            <RoleProtectedRoute allowedRole="client">
              <ClientShell>
                <ClientOrders />
              </ClientShell>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminShell>
                <AdminDashboard />
              </AdminShell>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/manage-admins"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminShell>
                <AdminControl />
              </AdminShell>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/manage-clients"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminShell>
                <ClientControl />
              </AdminShell>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin-menu"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminShell>
                <MenuControl />
              </AdminShell>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin-branchs"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminShell>
                <BranchControl />
              </AdminShell>
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
