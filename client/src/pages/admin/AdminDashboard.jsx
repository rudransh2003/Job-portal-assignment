import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Trash2, RefreshCw, Calendar, User, Search } from 'lucide-react';
import {
  fetchAllJobs,
  fetchStatistics,
  removeJob,
  clearError,
  selectJobs,
  selectStatistics,
  selectLoading,
  selectError,
  selectLastUpdated
} from '../../features/admin/adminJobSlice.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const jobs = useSelector(selectJobs);
  const statistics = useSelector(selectStatistics);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastUpdated = useSelector(selectLastUpdated);

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: 'All Types',
    minSalary: '',
    maxSalary: '',
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchAllJobs());
    dispatch(fetchStatistics());
  }, [dispatch]);
  useEffect(() => {
    let newFilteredJobs = [...jobs];
    if (filters.keyword) {
      newFilteredJobs = newFilteredJobs.filter(job =>
        job.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company?.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    if (filters.location) {
      newFilteredJobs = newFilteredJobs.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.jobType && filters.jobType !== 'All Types') {
      newFilteredJobs = newFilteredJobs.filter(job => job.jobType === filters.jobType);
    }
    const minSal = parseFloat(filters.minSalary);
    const maxSal = parseFloat(filters.maxSalary);

    if (!isNaN(minSal)) {
      newFilteredJobs = newFilteredJobs.filter(job => job.salary >= minSal);
    }
    if (!isNaN(maxSal)) {
      newFilteredJobs = newFilteredJobs.filter(job => job.salary <= maxSal);
    }

    setFilteredJobs(newFilteredJobs);
  }, [jobs, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const getStatusBadge = (job) => {
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

const getEmployerName = (job) => {
    if (!job.employerId) return 'N/A (No Employer)';
    
    if (job.employerId.companyName) return job.employerId.companyName;
  
    if (job.employerId.userId?.name) return job.employerId.userId.name;
  
    return 'Unspecified Employer';
  };
  
  const getEmployerEmail = (job) => {
    if (!job.employerId) return '---';
  
    if (job.employerId.contactEmail) return job.employerId.contactEmail;
    
    if (job.employerId.userId?.email) return job.employerId.userId.email;
  
    return 'Email not available';
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(removeJob(jobId));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllJobs());
    dispatch(fetchStatistics());
  };

  const activeJobsCount = jobs.filter(job => new Date(job.expiry_date || job.expiryDate) > new Date()).length;
  const expiredJobsCount = jobs.length - activeJobsCount;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {lastUpdated && <p className="text-gray-400 mt-1 text-sm">Last updated: {formatDate(lastUpdated)}</p>}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading.jobs || loading.statistics}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading.jobs || loading.statistics ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-900 border border-red-700 rounded-lg flex justify-between">
          <p className="text-red-300">{error}</p>
          <button onClick={() => dispatch(clearError())} className="text-red-300 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        <StatCard title="Total Jobs" value={statistics.totalJobs} icon={<Search size={24} />} />
        <StatCard title="Active Jobs" value={activeJobsCount} icon={<Calendar size={24} />} />
        <StatCard title="Expired Jobs" value={expiredJobsCount} icon={<Calendar size={24} />} />
        <StatCard title="Total Applications" value={statistics.totalApplications} icon={<User size={24} />} />
      </div>

      <div className="px-6 pb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input type="text" name="keyword" placeholder="Keyword (title, company)" value={filters.keyword} onChange={handleFilterChange} className="col-span-1 md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"/>
                <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"/>
                <input type="number" name="minSalary" placeholder="Min Salary" value={filters.minSalary} onChange={handleFilterChange} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"/>
                <input type="number" name="maxSalary" placeholder="Max Salary" value={filters.maxSalary} onChange={handleFilterChange} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading.jobs ? (
                 <tr><td colSpan={6} className="text-center text-gray-400 py-6">Loading jobs...</td></tr>
              ) : filteredJobs.length > 0 ? filteredJobs.map(job => (
                <tr key={job._id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{job.title}</div>
                      {/* <div className="text-sm text-gray-400">{job.company || 'N/A'}</div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{getEmployerName(job)}</div>
                    <div className="text-sm text-gray-400">{getEmployerEmail(job)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(job)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(job.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(job.expiry_date || job.expiryDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedJob(job)} className="text-blue-400 hover:text-blue-300 p-1"><Eye size={16} /></button>
                      <button onClick={() => handleDeleteJob(job._id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">No jobs found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} getStatusBadge={getStatusBadge} formatDate={formatDate} getEmployerName={getEmployerName} getEmployerEmail={getEmployerEmail} />
      )}
    </div>
  );
};


const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex justify-between items-center">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value ?? '...'}</p>
    </div>
    <div className="p-3 rounded-full bg-gray-700 text-blue-400">{icon}</div>
  </div>
);

const JobDetailsModal = ({ job, onClose, getStatusBadge, formatDate, getEmployerName, getEmployerEmail }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
      <div className="p-6 border-b border-gray-700 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{job.title}</h2>
          <p className="text-gray-400">{job.company || 'Company not specified'}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Location" value={job.location} />
          <InfoItem label="Salary" value={job.salary ? `$${job.salary.toLocaleString()}`: 'Not specified'} />
          <InfoItem label="Job Type" value={job.jobType} />
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
       <div className="p-4 bg-gray-700/50 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Close</button>
      </div>
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <p className="text-white">{value || 'N/A'}</p>
  </div>
);

export default AdminDashboard;