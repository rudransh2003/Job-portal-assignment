import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "seeker", // default
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const { role, isSuperAdmin } = res.payload.user;
        
        if (role === "admin") {
          if (isSuperAdmin) {
            navigate("/admin/dashboard");
          } else {
            // Handle case where someone tries to login as admin but isn't super admin
            alert("Access denied. Super admin privileges required.");
          }
        } else if (role === "employer") {
          navigate("/employer/view-jobs");
        } else {
          navigate("/seeker/view-jobs");
        }
      }
    });
  };

  // Quick login function for super admin (for testing/development)
  const handleSuperAdminLogin = () => {
    const adminFormData = {
      email: "rudranshadmin@gmail.com",
      password: "12345678",
      role: "admin"
    };
    
    dispatch(loginUser(adminFormData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/admin/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="role">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Quick Admin Login Button (for development/testing) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4">
            <button
              onClick={handleSuperAdminLogin}
              disabled={loading}
              className="w-full p-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 text-sm"
            >
              Quick Super Admin Login (Dev Only)
            </button>
          </div>
        )}

        {/* Admin Login Notice */}
        {formData.role === "admin" && (
          <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded">
            <p className="text-yellow-300 text-sm">
              ⚠️ Admin access requires super admin privileges
            </p>
          </div>
        )}

        <p className="text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}