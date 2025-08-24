import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"; 
import { navConfig } from "./navConfig";

const Navbar = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  const config = navConfig[role]; 

  useEffect(() => {
    const currentItem = config.items.find((item) => item.path === location.pathname);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname, config.items]);

  const handleNavigation = (item) => {
    if (item.id === "logout") {
      dispatch(logout());     
      navigate("/login");       
      return;
    }
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">{config.title}</h2>
          </div>

        
          <div className="hidden md:flex space-x-1">
            {config.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === item.id && item.id !== "logout"
                    ? "bg-[#B85042] text-white shadow-lg"
                    : item.id === "logout"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {config.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === item.id && item.id !== "logout"
                    ? "bg-[#B85042] text-white"
                    : item.id === "logout"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
