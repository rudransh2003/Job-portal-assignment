import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, fetchAppliedJobs} from "../../features/seeker/seekerJobSlice.js"
import JobCard from "../../components/JobCard.jsx"
import Filters from "../../components/Filters";
import { useNavigate, useLocation } from "react-router-dom";
import { markAlertAsShown, fetchProfile} from "../../features/seeker/seekerProfileSlice.js";
import Navbar from "../../components/Navbar.jsx";

const SeekerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { jobs, loading: jobsLoading } = useSelector((state) => state.seekerJob);
    const {
        profileComplete,
        hasShownIncompleteAlert,
        loading: profileLoading,
        profileExists,
    } = useSelector((state) => state.seekerProfile);

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchAppliedJobs());
        dispatch(fetchProfile());
    }, [dispatch]);

    // Mark alert as shown after displaying once
    useEffect(() => {
        if (!profileLoading && profileExists && !profileComplete && !hasShownIncompleteAlert) {
            const timer = setTimeout(() => {
                dispatch(markAlertAsShown());
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [profileLoading, profileExists, profileComplete, hasShownIncompleteAlert, dispatch]);

    const handleFilter = (filters) => {
        dispatch(fetchJobs(filters));
    };

    const shouldShowProfileAlert =
        !profileLoading && profileExists && !profileComplete && !hasShownIncompleteAlert;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar role="seeker"/>

            <div className="max-w-7xl mx-auto p-4">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Jobs Dashboard</h1>
                    <p className="text-gray-400">Discover your next career opportunity</p>
                </div>

                {/* Profile Completion Alert */}
                {shouldShowProfileAlert && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#B85042] to-red-700 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Complete Your Profile</h3>
                                    <p className="text-red-100 text-sm">
                                        Boost your chances of getting hired by completing your profile
                                    </p>
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
                            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                </div>

                {jobsLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85042] mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading amazing opportunities...</p>
                        </div>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} role="seeker" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg
                                className="h-16 w-16 text-gray-600 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706zm-8 0V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-400 mb-2">No jobs found</h3>
                        <p className="text-gray-500">
                            Try adjusting your filters or check back later for new opportunities.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerDashboard;