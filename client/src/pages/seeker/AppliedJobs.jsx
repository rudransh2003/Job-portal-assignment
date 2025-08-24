import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs } from "../../features/seeker/seekerJobSlice.js";
// import SeekerNavbar from "./SeekerNavbar";
import JobCard from "../../components/JobCard.jsx"

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { appliedJobs, loading } = useSelector((state) => state.seekerJob);

  useEffect(() => {
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <SeekerNavbar /> */}
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Applied Jobs</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85042]"></div>
          </div>
        ) : appliedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appliedJobs.map((job) => (
              <JobCard key={job._id} job={job}isAppliedPage={true}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>You haven’t applied to any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;