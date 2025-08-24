import { useDispatch } from "react-redux";
import { useState } from "react";
import { applyJob, saveJob } from "../features/seeker/seekerJobSlice.js";

const JobCard = ({ job, role = "seeker", isAppliedPage = false, onEdit, onDelete }) => {
    const dispatch = useDispatch();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    // Seeker handlers
    const handleApply = () => dispatch(applyJob(job._id));
    const handleSave = () => dispatch(saveJob(job._id));

    // Employer handler
    const handleDelete = () => {
        if (onDelete) onDelete(job._id);
        setShowDeleteConfirm(false);
    };

    const isLongDescription = job.description && job.description.length > 120;

    return (
        <div className="relative bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col justify-between w-full max-w-md">
            {/* Card body */}
            <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-white">{job.title}</h3>

                {/* Truncated description */}
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {job.description}
                </p>

                {/* Read More link if description is long */}
                {isLongDescription && (
                    <button
                        onClick={() => setShowDescription(true)}
                        className="text-sm text-[#B85042] hover:underline"
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

            {/* Role-specific buttons */}
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

            {/* Floating Description Dialog */}
            {showDescription && (
                <div className="absolute top-2 left-0 w-full z-40">
                    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg border border-gray-700 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowDescription(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        {/* Full Description */}
                        <h4 className="text-lg font-semibold mb-2">{job.title}</h4>
                        <p className="text-gray-300 text-sm max-h-48 overflow-y-auto pr-2">
                            {job.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
    );
};

export default JobCard;
