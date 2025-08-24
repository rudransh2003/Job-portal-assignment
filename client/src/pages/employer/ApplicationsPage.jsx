import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicantsForJob,
  updateApplicantStatus,
  fetchEmployerJobs,
} from "../../features/employer/employerJobSlice.js";
import Navbar from "../../components/Navbar.jsx";

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const { jobs, applicants, loading, error } = useSelector(
    (state) => state.employerJobs
  );

  // Track which job's applicants are shown
  const [openJobId, setOpenJobId] = useState(null);
  // Track which applicant inside each job is expanded
  const [openApplicant, setOpenApplicant] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  // Handle view applicants per job
  const handleViewApplicants = (jobId) => {
    if (openJobId !== jobId) {
      dispatch(fetchApplicantsForJob(jobId));
      setOpenApplicant(null); // reset any open applicant when switching jobs
    }
    setOpenJobId((prev) => (prev === jobId ? null : jobId));
  };

  // Handle approve/decline
  const handleUpdateStatus = (jobId, seekerId, status) => {
    dispatch(updateApplicantStatus({ jobId, seekerId, status }));
  };

  if (loading && !jobs.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 space-y-6">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar role="employer" />
      </div>
      <div className="flex flex-col items-center p-6 space-y-6 pt-20 w-full max-w-6xl">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-800 rounded-lg shadow-md w-full p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-gray-400">{job.location}</p>
            <p className="mt-1 text-sm">Salary: {job.salary}</p>
            <p className="mt-1 text-sm">Type: {job.jobType}</p>

            <button
              onClick={() => handleViewApplicants(job._id)}
              className="mt-4 px-4 py-2 bg-[#B85042] hover:bg-red-700 rounded-lg"
            >
              {openJobId === job._id ? "Hide Applicants" : "View Applicants"}
            </button>

            {/* Applicants Dropdown */}
            {openJobId === job._id && (
              <div className="mt-4 bg-gray-700 rounded-lg p-4 space-y-3">
                {loading && <p className="text-gray-400">Loading applicants...</p>}

                {!loading && (!applicants || applicants.length === 0) && (
                  <p className="text-gray-400">No applicants yet.</p>
                )}

                {(applicants || []).map((applicant, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-600 rounded-lg p-3"
                  >
                    {/* Applicant summary */}
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setOpenApplicant(openApplicant === idx ? null : idx)
                      }
                    >
                      <span className="font-semibold">
                        {applicant.seekerId?.userId?.name || "Unknown"}
                      </span>
                      <span className="text-sm text-gray-400">
                        {openApplicant === idx ? "▲" : "▼"}
                      </span>
                    </div>

                    {/* Applicant details */}
                    {openApplicant === idx && (
                      <div className="mt-3 text-sm space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {applicant.seekerId?.userId?.email || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {applicant.seekerId?.userId?.phone || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Experience (years):</span>{" "}
                            {applicant.seekerId?.experienceYears ?? "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Skills:</span>{" "}
                            {(applicant.seekerId?.skills || []).join(", ")}
                          </p>
                        </div>
                        
                        <p>
                          <span className="font-medium">Education:</span>{" "}
                          {applicant.seekerId?.education?.map((edu, i) => (
                            <span key={i}>
                              {edu.degree} ({edu.startYear}-{edu.endYear}){" "}
                            </span>
                          )) || "N/A"}
                        </p>

                        {/* Resume */}
                        {applicant.seekerId?.resumeUrl && (
                          <p>
                            <a
                              href={applicant.seekerId.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline"
                            >
                              View Resume
                            </a>
                          </p>
                        )}

                        {/* Approve / Decline */}
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(job._id, applicant.seekerId?._id, "approved")
                            }
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(job._id, applicant.seekerId?._id, "declined")
                            }
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;