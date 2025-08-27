import { useDispatch } from "react-redux";
import { useState } from "react";
import { applyJob, saveJob } from "../features/seeker/seekerJobSlice.js";

const JobCard = ({ job, role = "seeker", isAppliedPage = false, onEdit, onDelete }) => {
    const dispatch = useDispatch();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);

    const handleApply = () => dispatch(applyJob(job._id));
    const handleSave = () => dispatch(saveJob(job._id));

    const handleDelete = () => {
        if (onDelete) onDelete(job._id);
        setShowDeleteConfirm(false);
    };

    const isLongDescription = job.description && job.description.length > 120;

    // Format date function (same as admin dashboard)
    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    // Get status badge function (adapted from admin dashboard)
    const getStatusBadge = (job) => {
        if (isAppliedPage && job.applicationStatus) {
            const statusStyles = {
                accepted: 'bg-green-600 text-white',
                rejected: 'bg-red-600 text-white',
                under_review: 'bg-yellow-500 text-black',
                applied: 'bg-gray-500 text-white',
            };
            
            return (
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusStyles[job.applicationStatus] || statusStyles.applied}`}>
                    {job.applicationStatus.replace("_", " ").toUpperCase()}
                </span>
            );
        }

        const isExpired = new Date(job.expiry_date || job.expiryDate) <= new Date();
        const status = isExpired ? 'expired' : (job.status || 'active');
        
        const statusStyles = {
            active: 'bg-green-100 text-green-800 border-green-200',
            expired: 'bg-red-100 text-red-800 border-red-200',
            paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            default: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status] || statusStyles.default}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Get employer name function (adapted from admin dashboard)
    const getEmployerName = (job) => {
        if (!job.employerId) return 'N/A (No Employer)';
        
        if (job.employerId.companyName) return job.employerId.companyName;
      
        if (job.employerId.userId?.name) return job.employerId.userId.name;
      
        return 'Unspecified Employer';
    };
      
    // Get employer email function (adapted from admin dashboard)
    const getEmployerEmail = (job) => {
        if (!job.employerId) return '---';
      
        if (job.employerId.contactEmail) return job.employerId.contactEmail;
        
        if (job.employerId.userId?.email) return job.employerId.userId.email;
      
        return 'Email not available';
    };

    return (
        <>
            <div className="relative bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col justify-between w-full max-w-md">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-white">{job.title}</h3>

                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {job.description}
                    </p>

                    {isAppliedPage && (
                        <div className="mb-2">
                            {getStatusBadge(job)}
                        </div>
                    )}

                    {isLongDescription && (
                        <button
                            onClick={() => setShowJobDetailsModal(true)}
                            className="text-sm text-[#B85042] hover:underline mb-2"
                        >
                            Read More
                        </button>
                    )}

                    <p className="text-gray-500 text-sm mb-1">
                        📍 {job.location} • 💰 {job.salary}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">Experience: {job.experience}</p>
                    <p className="text-gray-500 text-sm mb-2">
                        Skills: {job.skills?.join(", ")}
                    </p>
                </div>

                <div className="flex space-x-3 mt-4 relative z-30">
                    {role === "seeker" && (
                        <>
                            {!isAppliedPage && (
                                <button
                                    onClick={handleApply}
                                    className="flex-1 bg-[#B85042] hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                                >
                                    Apply
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </>
                    )}

                    {role === "employer" && (
                        <>
                            <button
                                onClick={() => onEdit && onEdit(job)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                            >
                                🗑️ Delete
                            </button>
                        </>
                    )}

                    {role === "admin" && (
                        <span className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm">
                            🔍 View Only
                        </span>
                    )}
                </div>

                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Delete Job</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete "{job.title}"? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Job Details Modal (same as admin dashboard) */}
            {showJobDetailsModal && (
                <JobDetailsModal 
                    job={job} 
                    onClose={() => setShowJobDetailsModal(false)} 
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    getEmployerName={getEmployerName}
                    getEmployerEmail={getEmployerEmail}
                    role={role}
                    isAppliedPage={isAppliedPage}
                    handleApply={handleApply}
                    handleSave={handleSave}
                />
            )}
        </>
    );
};

// Job Details Modal Component (adapted from admin dashboard)
const JobDetailsModal = ({ 
    job, 
    onClose, 
    getStatusBadge, 
    formatDate, 
    getEmployerName, 
    getEmployerEmail, 
    role, 
    isAppliedPage,
    handleApply,
    handleSave 
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-white">{job.title}</h2>
                    <p className="text-gray-400">{job.company || getEmployerName(job)}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InfoItem label="Location" value={job.location} />
                    <InfoItem label="Salary" value={job.salary ? `$${job.salary.toLocaleString()}`: 'Not specified'} />
                    <InfoItem label="Job Type" value={job.jobType} />
                    <InfoItem label="Experience Required" value={job.experience} />
                    <div><label className="block text-sm font-medium text-gray-400 mb-1">Status</label>{getStatusBadge(job)}</div>
                    <InfoItem label="Created" value={formatDate(job.createdAt)} />
                    <InfoItem label="Expires" value={formatDate(job.expiry_date || job.expiryDate)} />
                </div>
                <hr className="border-gray-700" />
                <div>
                    <h3 className="text-lg font-semibold mb-2">Employer Details</h3>
                    <InfoItem label="Name" value={getEmployerName(job)} />
                    <InfoItem label="Email" value={getEmployerEmail(job)} />
                </div>
                {job.description && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                        <p className="text-gray-300 whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">{job.description}</p>
                    </div>
                )}
                {job.skills && job.skills.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map(skill => <span key={skill} className="px-3 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">{skill}</span>)}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Action buttons for seekers */}
            {role === "seeker" && (
                <div className="p-4 bg-gray-700/50 border-t border-gray-700">
                    <div className="flex space-x-3">
                        {!isAppliedPage && (
                            <button
                                onClick={() => {
                                    handleApply();
                                    onClose();
                                }}
                                className="flex-1 bg-[#B85042] hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                Apply Now
                            </button>
                        )}
                        <button
                            onClick={() => {
                                handleSave();
                                onClose();
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Save Job
                        </button>
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            {/* Close button for non-seekers */}
            {role !== "seeker" && (
                <div className="p-4 bg-gray-700/50 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Close</button>
                </div>
            )}
        </div>
    </div>
);

// Info Item Component (same as admin dashboard)
const InfoItem = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <p className="text-white">{value || 'N/A'}</p>
    </div>
);

export default JobCard;