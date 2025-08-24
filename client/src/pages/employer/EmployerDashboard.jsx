import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerJobs, deleteJob, setSelectedJob } from "../../features/employer/employerJobSlice.js";
import { fetchEmployerProfile } from "../../features/employer/employerProfileSlice.js";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import JobCard from "../../components/JobCard.jsx";
import UpdateJob from './UpdateJob.jsx'

const EmployerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, loading, error } = useSelector((state) => state.employerJobs);
    const { profileComplete } = useSelector((state) => state.employerProfile);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployerJobs());
        dispatch(fetchEmployerProfile());
    }, [dispatch]);

    const handleEditJob = (job) => {
        setSelectedJob(job);
        setShowUpdateModal(true);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await dispatch(deleteJob(jobId)).unwrap();
        } catch (err) {
            console.error('Failed to delete job:', err);
        }
    };

    const renderError = () => {
        if (!error) return null;

        return (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300">
                    {typeof error === 'string' ? error : error.message || 'Something went wrong'}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar role="employer" />
            <div className="max-w-7xl mx-auto p-4">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
                    <p className="text-gray-400">Manage your job postings and find the best candidates</p>
                </div>

                {/* Profile Completion Alert - Only show when profileComplete is explicitly false */}
                {profileComplete === false && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#B85042] to-red-700 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Complete Your Company Profile</h3>
                                    <p className="text-red-100 text-sm">Attract top talent by completing your company information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/employer/profile")}
                                className="bg-white text-[#B85042] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                            >
                                Complete Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {renderError()}

                {/* Quick Actions */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/employer/create-job')}
                        className="px-6 py-3 bg-gradient-to-r from-[#B85042] to-red-700 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 flex items-center space-x-2"
                    >
                        <span>➕</span>
                        <span>Create New Job</span>
                    </button>
                </div>

                {/* Jobs Section */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
                    {jobs.length > 0 && (
                        <span className="text-gray-400 text-sm">
                            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85042] mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading your jobs...</p>
                        </div>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard
                                job={job}
                                role="employer"
                                onEdit={handleEditJob}
                                onDelete={handleDeleteJob}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg className="h-16 w-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706zm-8 0V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0a2 2 0 012 2v6.294a11.948 11.948 0 01-2 .706z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-400 mb-2">No jobs posted yet</h3>
                        <p className="text-gray-500 mb-6">Start by creating your first job posting to find great candidates.</p>
                        <button
                            onClick={() => navigate('/employer/create-job')}
                            className="px-6 py-3 bg-[#B85042] text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Create Your First Job
                        </button>
                    </div>
                )}
            </div>
            {showUpdateModal && selectedJob && (
                <UpdateJob
                    job={selectedJob}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}

        </div>
    );
};

export default EmployerDashboard;