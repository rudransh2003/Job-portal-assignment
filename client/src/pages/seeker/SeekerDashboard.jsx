import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../features/seeker/seekerJobSlice.js"
import JobCard from "../../components/JobCard.jsx"
import Filters from "../../components/Filters";
import { useNavigate, useLocation } from "react-router-dom";

// Navbar Component
const SeekerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/seeker/dashboard', icon: '🏠' },
        { id: 'profile', label: 'My Profile', path: '/seeker/profile', icon: '👤' },
        { id: 'saved', label: 'Saved Jobs', path: '/seeker/saved-jobs', icon: '💾' },
        { id: 'applied', label: 'Applied Jobs', path: '/seeker/applied-jobs', icon: '📝' },
    ];

    useEffect(() => {
        // Set active tab based on current path
        const currentItem = navItems.find(item => item.path === location.pathname);
        if (currentItem) {
            setActiveTab(currentItem.id);
        }
    }, [location.pathname]);

    const handleNavigation = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 mb-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold text-white">JobSeeker</h2>
                    </div>

                    {/* Navigation Items */}
                    <div className="hidden md:flex space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    activeTab === item.id
                                        ? 'bg-[#B85042] text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-300 hover:text-white p-2">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-4">
                    <div className="flex flex-wrap gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    activeTab === item.id
                                        ? 'bg-[#B85042] text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

const SeekerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { jobs, loading } = useSelector((state) => state.seekerJob);
    const { profileComplete } = useSelector((state) => state.seekerProfile);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const handleFilter = (filters) => {
        dispatch(fetchJobs(filters));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <SeekerNavbar />
            
            <div className="max-w-7xl mx-auto p-4">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Jobs Dashboard</h1>
                    <p className="text-gray-400">Discover your next career opportunity</p>
                </div>

                {/* Profile Completion Alert */}
                {!profileComplete && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#B85042] to-red-700 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Complete Your Profile</h3>
                                    <p className="text-red-100 text-sm">Boost your chances of getting hired by completing your profile</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/seeker/profile")}
                                className="bg-white text-[#B85042] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                            >
                                Complete Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters Section */}
                <div className="mb-6">
                    <Filters onFilter={handleFilter} />
                </div>

                {/* Jobs Section */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Available Jobs</h2>
                    {jobs.length > 0 && (
                        <span className="text-gray-400 text-sm">
                            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85042] mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading amazing opportunities...</p>
                        </div>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg className="h-16 w-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706zm-8 0V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-400 mb-2">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your filters or check back later for new opportunities.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerDashboard;