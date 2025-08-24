import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJob } from '../../features/employer/employerJobSlice.js'
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

const CreateJob = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.employerJobs);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        experience: "",
        skills: "",
        jobType: "",
        expiry_date: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillsChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, skills: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const skillsArray = formData.skills
                ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
                : [];

            const jobData = {
                ...formData,
                skills: skillsArray,
                salary: formData.salary ? Number(formData.salary) : undefined,
            };

            await dispatch(createJob(jobData)).unwrap();
            navigate('/employer/view-jobs');
        } catch (err) {
            console.error('Job creation failed:', err);
        }
    };

    const renderError = () => {
        if (!error) return null;

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
        }

        return (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300">Something went wrong</p>
            </div>
        );
    };

    const jobTypeOptions = ["Full-time", "Part-time", "Remote"];
    const experienceOptions = [
        "Entry Level (0-1 years)",
        "Junior (1-3 years)",
        "Mid Level (3-5 years)",
        "Senior (5-8 years)",
        "Lead/Principal (8+ years)"
    ];
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar role="employer" />

            <div className="max-w-4xl mx-auto p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Create New Job Posting</h1>
                    <p className="text-gray-400">
                        Fill in the details below to create a new job posting and start attracting top talent
                    </p>
                </div>

                {loading && (
                    <div className="mb-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
                            <p className="text-blue-300">Creating job posting...</p>
                        </div>
                    </div>
                )}

                {renderError()}

                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Job Information */}
                        <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-[#B85042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                                </svg>
                                Job Details
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Senior Software Engineer"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Type *</label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    >
                                        <option value="">Select Job Type</option>
                                        {jobTypeOptions.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Job Description *</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    rows="6"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="San Francisco, CA or Remote"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    >
                                        <option value="">Select Experience</option>
                                        {experienceOptions.map((exp) => (
                                            <option key={exp} value={exp}>{exp}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 mr-2 text-[#B85042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Compensation & Requirements
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Annual Salary (USD)</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        placeholder="80000"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Optional: Leave blank if salary is negotiable</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Application Deadline *</label>
                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={formData.expiry_date}
                                        onChange={handleChange}
                                        min={today}
                                        required
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Required Skills</label>
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="JavaScript, React, Node.js, Python, AWS"
                                    value={formData.skills}
                                    onChange={handleSkillsChange}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#B85042] focus:outline-none focus:ring-1 focus:ring-[#B85042]"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
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
                                        Creating Job...
                                    </div>
                                ) : (
                                    "Create Job Posting"
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

export default CreateJob;