import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerProfile, createEmployerProfile, updateEmployerProfile } from "../../features/employer/employerProfileSlice";
import { useNavigate, useLocation } from "react-router-dom";

const EmployerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profile');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/employer/view-jobs', icon: '🏠' },
        { id: 'profile', label: 'My Profile', path: '/employer/profile', icon: '🏢' },
        { id: 'create-job', label: 'Create Job', path: '/employer/create-job', icon: '➕' },
        { id: 'applications', label: 'Applications', path: '/employer/applications', icon: '📄' },
    ];

    useEffect(() => {
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
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold text-white">JobEmployer</h2>
                    </div>
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

                    <div className="md:hidden">
                        <button className="text-gray-300 hover:text-white p-2">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

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

const EmployerProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading, error, profileExists } = useSelector((state) => state.employerProfile);
    const [formData, setFormData] = useState({
        companyName: "",
        companyProfile: "",
        location: "",
        companyWebsite: "",
        contactEmail: "",
    });

    useEffect(() => {
        dispatch(fetchEmployerProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                companyName: profile.companyName || "",
                companyProfile: profile.companyProfile || "",
                location: profile.location || "",
                companyWebsite: profile.companyWebsite || "",
                contactEmail: profile.contactEmail || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (profile) {
                await dispatch(updateEmployerProfile(formData)).unwrap();
            } else {
                await dispatch(createEmployerProfile(formData)).unwrap();
            }
            navigate('/employer/view-jobs');
        } catch (err) {
            console.error('Profile operation failed:', err);
        }
    };

    const renderError = () => {
        if (!error) return null;
        
        if (error.message === "Profile not found" || error.status === 404) {
            return null;
        }
        
        if (typeof error === 'string') {
            return (
                <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                    <p className="text-red-300">{error}</p>
                </div>
            );
        } else if (error.message) {
            return (
                <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                    <p className="text-red-300">{error.message}</p>
                </div>
            );
        } else if (typeof error === 'object') {
            return (
                <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                    <p className="text-red-300">Something went wrong</p>
                </div>
            );
        }
        
        return (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300">Something went wrong</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <EmployerNavbar />
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">
                        {profile ? "Update Company Profile" : "Create Company Profile"}
                    </h1>
                    <p className="text-gray-400">
                        {profile 
                            ? "Keep your company information updated to attract the best talent" 
                            : "Complete your company profile to start posting jobs and finding candidates"
                        }
                    </p>
                </div>

                {loading && (
                    <div className="mb-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
                            <p className="text-blue-300">Loading company profile...</p>
                        </div>
                    </div>
                )}

                {renderError()}

                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-[#B85042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Company Information
                            </h2>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name *</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Acme Corporation"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="San Francisco, CA"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Company Profile</label>
                                <textarea
                                    name="companyProfile"
                                    placeholder="Tell candidates about your company, mission, and culture..."
                                    value={formData.companyProfile}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    rows="4"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Company Website</label>
                                <input
                                    type="url"
                                    name="companyWebsite"
                                    placeholder="https://www.company.com"
                                    value={formData.companyWebsite}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-[#B85042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Information
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    placeholder="hr@company.com"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-[#B85042] to-red-700 text-white font-medium py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-[#B85042] focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    profile ? "Update Company Profile" : "Create Company Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/employer/view-jobs')}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center mx-auto"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;