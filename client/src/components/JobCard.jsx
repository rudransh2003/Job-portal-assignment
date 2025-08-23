import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-md">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p>{job.company} - {job.location}</p>
      <p>{job.jobType} | ₹{job.salary}</p>
      <p className="mt-2 text-gray-300">{job.description}</p>
    </div>
  );
};

export default JobCard;
