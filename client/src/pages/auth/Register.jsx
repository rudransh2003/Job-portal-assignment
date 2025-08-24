import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "seeker",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

//   function handleGoogleRegister() {
//     window.location.href = `${import.meta.env.VITE_API_BASE_URL}/users/google`;
//   } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
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
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="role">
              Role
            </label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* <button
          onClick={handleGoogleRegister}
          className="w-full p-3 mt-4 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Continue with Google
        </button> */}

        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}