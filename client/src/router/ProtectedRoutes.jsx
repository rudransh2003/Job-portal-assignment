import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth); 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return children;
}
