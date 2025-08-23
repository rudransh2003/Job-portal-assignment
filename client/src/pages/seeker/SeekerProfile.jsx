import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, createProfile, updateProfile } from "../../features/seeker/seekerProfileSlice";
import { useNavigate, useLocation } from "react-router-dom";

const SeekerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('profile');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/seeker/view-jobs', icon: '🏠' },
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

const SeekerProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading, error, profileExists } = useSelector((state) => state.seekerProfile);
    const [formData, setFormData] = useState({
        skills: "",
        experience: { company: "", role: "", description: "", startDate: "", endDate: "" },
        education: [],
        experienceYears: 0,
        resumeUrl: "",
    });

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
                experience: profile.experience || { company: "", role: "", description: "", startDate: "", endDate: "" },
                education: profile.education || [],
                experienceYears: profile.experienceYears || 0,
                resumeUrl: profile.resumeUrl || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prevData) => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(s => s),
        };

        try {
            if (profile) {
                await dispatch(updateProfile(payload)).unwrap();
            } else {
                await dispatch(createProfile(payload)).unwrap();
            }
            // Navigate to dashboard after successful submission
            navigate('/seeker/view-jobs');
        } catch (err) {
            // Error is handled by Redux, just stay on the page
            console.error('Profile operation failed:', err);
        }
    };

    const renderError = () => {
        if (!error) return null;
        
        // Don't show error if it's just that profile doesn't exist yet
        if (error.message === "Profile not found" || error.status === 404) {
            return null;
        }
        
        // Handle different error formats
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
            <SeekerNavbar />
            
            <div className="max-w-4xl mx-auto p-4">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">
                        {profile ? "Update Profile" : "Create Profile"}
                    </h1>
                    <p className="text-gray-400">
                        {profile 
                            ? "Keep your profile updated to attract better opportunities" 
                            : "Complete your profile to get started with job applications"
                        }
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="mb-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
                            <p className="text-blue-300">Loading profile data...</p>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {renderError()}

                {/* Profile Form */}
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Skills Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="JavaScript, React, Node.js, Python"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                            />
                        </div>

                        {/* Experience Section */}
                        <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-[#B85042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706zm-8 0V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706z" />
                                </svg>
                                Work Experience
                            </h2>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                                    <input
                                        type="text"
                                        name="experience.company"
                                        placeholder="Google Inc."
                                        value={formData.experience.company}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                    <input
                                        type="text"
                                        name="experience.role"
                                        placeholder="Software Engineer"
                                        value={formData.experience.role}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    name="experience.description"
                                    placeholder="Describe your role, responsibilities, and achievements..."
                                    value={formData.experience.description}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    rows="3"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="experience.startDate"
                                        value={formData.experience.startDate}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="experience.endDate"
                                        value={formData.experience.endDate}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Total Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    placeholder="5"
                                    min="0"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Resume URL
                                </label>
                                <input
                                    type="url"
                                    name="resumeUrl"
                                    placeholder="https://drive.google.com/file/..."
                                    value={formData.resumeUrl}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                    profile ? "Update Profile" : "Create Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back to Dashboard Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/seeker/view-jobs')}
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

export default SeekerProfile;