import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchApplicantsForJob,
  updateApplicantStatus,
  fetchEmployerJobs,
} from "../../features/employer/employerJobSlice.js";
import Navbar from "../../components/Navbar.jsx";

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, applicants, loading, error } = useSelector(
    (state) => state.employerJobs
  );

  const [openJobId, setOpenJobId] = useState(null);
  const [openApplicant, setOpenApplicant] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const handleViewApplicants = (jobId) => {
    if (openJobId !== jobId) {
      dispatch(fetchApplicantsForJob(jobId));
      setOpenApplicant(null); 
    }
    setOpenJobId((prev) => (prev === jobId ? null : jobId));
  };

  const handleUpdateStatus = (jobId, seekerId, status) => {
    dispatch(updateApplicantStatus({ jobId, seekerId, status }));
  };

  if (loading && !jobs.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar role="employer" />
        <div className="flex justify-center items-center pt-20 min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B85042] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your jobs and applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar role="employer" />
        <div className="flex justify-center items-center pt-20 min-h-screen">
          <div className="text-center">
            <div className="mb-4">
              <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-red-400 mb-2">Error Loading Applications</h3>
            <p className="text-red-300 mb-6">{error.message || "Something went wrong"}</p>
            <button
              onClick={() => dispatch(fetchEmployerJobs())}
              className="px-6 py-3 bg-[#B85042] text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar role="employer" />
        <div className="flex justify-center items-center pt-20 min-h-screen">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg className="h-20 w-20 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Job Applications Yet</h2>
            <p className="text-gray-400 mb-6">
              You need to create and publish job postings before you can receive applications from job seekers.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/employer/create-job')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B85042] to-red-700 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Create Your First Job</span>
              </button>
              <button
                onClick={() => navigate('/employer/view-jobs')}
                className="w-full px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 space-y-6">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar role="employer" />
      </div>
      
      <div className="flex flex-col items-center pt-20 w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
        <p className="text-gray-400 text-center">Review and manage applications for your job postings</p>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full max-w-6xl">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-800 rounded-lg shadow-md w-full p-6 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{job.title}</h2>
                <p className="text-gray-400">{job.location}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                  <span>Salary: {job.salary}</span>
                  <span>Type: {job.jobType}</span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-400">
                <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <button
              onClick={() => handleViewApplicants(job._id)}
              className="px-4 py-2 bg-[#B85042] hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{openJobId === job._id ? "Hide" : "View"} Applicants</span>
              <span>{openJobId === job._id ? "▲" : "▼"}</span>
            </button>

            {openJobId === job._id && (
              <div className="mt-4 bg-gray-700 rounded-lg p-4 space-y-3">
                {loading && <p className="text-gray-400">Loading applicants...</p>}

                {!loading && (!applicants || applicants.length === 0) && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg className="h-12 w-12 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 mb-2">No applications yet for this job</p>
                    <p className="text-gray-500 text-sm">Applications will appear here when job seekers apply</p>
                  </div>
                )}

                {(applicants || []).map((applicant, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-colors duration-200"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setOpenApplicant(openApplicant === idx ? null : idx)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#B85042] rounded-full flex items-center justify-center text-sm font-medium">
                          {(applicant.seekerId?.userId?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold">
                            {applicant.seekerId?.userId?.name || "Unknown"}
                          </span>
                          <p className="text-sm text-gray-400">
                            {applicant.seekerId?.userId?.email || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          applicant.status === 'approved' ? 'bg-green-900 text-green-300' :
                          applicant.status === 'declined' ? 'bg-red-900 text-red-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {applicant.status || 'Pending'}
                        </span>
                        <span className="text-sm text-gray-400">
                          {openApplicant === idx ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    {openApplicant === idx && (
                      <div className="mt-4 pt-4 border-t border-gray-600 text-sm space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p>
                            <span className="font-medium text-gray-300">Email:</span>{" "}
                            <span className="text-blue-400">{applicant.seekerId?.userId?.email || "N/A"}</span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">Phone:</span>{" "}
                            {applicant.seekerId?.userId?.phone || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">Experience:</span>{" "}
                            {applicant.seekerId?.experienceYears ?? "N/A"} years
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">Skills:</span>{" "}
                            {(applicant.seekerId?.skills || []).join(", ") || "N/A"}
                          </p>
                        </div>
                        
                        {applicant.seekerId?.education && applicant.seekerId.education.length > 0 && (
                          <p>
                            <span className="font-medium text-gray-300">Education:</span>{" "}
                            {applicant.seekerId.education.map((edu, i) => (
                              <span key={i} className="block ml-2">
                                • {edu.degree} ({edu.startYear}-{edu.endYear})
                              </span>
                            ))}
                          </p>
                        )}

                        {applicant.seekerId?.resumeUrl && (
                          <p>
                            <span className="font-medium text-gray-300">Resume:</span>{" "}
                            <a
                              href={applicant.seekerId.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline hover:text-blue-300"
                            >
                              View Resume →
                            </a>
                          </p>
                        )}

                        <div className="flex gap-3 pt-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(job._id, applicant.seekerId?._id, "approved")
                            }
                            disabled={applicant.status === 'approved'}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                              applicant.status === 'approved' 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {applicant.status === 'approved' ? 'Approved' : 'Approve'}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(job._id, applicant.seekerId?._id, "declined")
                            }
                            disabled={applicant.status === 'declined'}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                              applicant.status === 'declined' 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {applicant.status === 'declined' ? 'Declined' : 'Decline'}
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