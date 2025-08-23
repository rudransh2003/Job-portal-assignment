import React, { useState } from "react";

const Filters = ({ onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ keyword, location, jobType, minSalary, maxSalary });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-md">
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      >
        <option value="">All Types</option>
        <option value="Full-Time">Full-Time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Internship">Internship</option>
      </select>
      <input
        type="number"
        placeholder="Min Salary"
        value={minSalary}
        onChange={(e) => setMinSalary(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="number"
        placeholder="Max Salary"
        value={maxSalary}
        onChange={(e) => setMaxSalary(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="bg-[#B85042] text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Filter
      </button>
    </form>
  );
};

export default Filters;