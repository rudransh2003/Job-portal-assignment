import { useDispatch, useSelector } from "react-redux";
import { updateJob } from "../../features/employer/employerJobSlice";
import JobForm from "../../components/JobForm";

const UpdateJobModal = ({ job, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.employerJobs);

  const handleUpdate = async (jobData) => {
    try {
      await dispatch(updateJob({ jobId: job._id, jobData })).unwrap();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Scrollable container */}
      <div className="bg-gray-800/90 rounded-lg shadow-xl border border-gray-700 max-w-2xl w-full max-h-screen overflow-y-auto p-4">
        <h2 className="text-xl font-semibold text-white mb-2">Edit Job</h2>
        <JobForm
          mode="update"
          initialData={job}
          onSubmit={handleUpdate}
          onCancel={onClose}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default UpdateJobModal;