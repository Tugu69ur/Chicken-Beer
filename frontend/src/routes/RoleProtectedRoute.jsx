import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRole }) {
  const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : null;
  if (!role) return <Navigate to="/" />;
  if (role !== allowedRole) return <Navigate to="/" />;

  return children;
}

export default RoleProtectedRoute;
