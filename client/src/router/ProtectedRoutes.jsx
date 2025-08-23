import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // redirect to homepage if not authorized
  }

  return children;
}
