import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedJobs } from "../../features/seeker/seekerJobSlice.js";
import Navbar from "../../components/Navbar.jsx";
import JobCard from "../../components/JobCard.jsx";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((state) => state.seekerJob);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar role="seeker" />

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>

        {loading ? (
          <div className="text-center py-12">Loading saved jobs...</div>
        ) : savedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => (
              <JobCard key={job._id} job={job} role="seeker" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">You haven’t saved any jobs yet.</div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;