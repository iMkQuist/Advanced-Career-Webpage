import { useEffect, useState } from 'react';
import AdminService from '../services/adminService'; // Import the entire service
import { toast } from 'react-toastify';
import Modal from './Modal'; // Assume you have a reusable Modal component for confirmation
import { Job } from './types/Job'; // Assume Job type is defined in types
import Loader from './Loader'; // Assume there's a loader/spinner component

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 5;

  // Load jobs with pagination
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const jobList = await AdminService.fetchAllJobs(currentPage, jobsPerPage);
        setJobs(jobList.data); // Assumes jobList.data contains the list of jobs
      } catch (err) {
        setError('Failed to load jobs.');
        toast.error('Error loading jobs');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [currentPage]); // Add currentPage as a dependency to re-fetch jobs on page change

  const handleDelete = async (id: number) => {
    setSelectedJobId(id);
    setIsModalOpen(true); // Open confirmation modal
  };

  const confirmDelete = async () => {
    if (selectedJobId) {
      try {
        await AdminService.deleteJob(selectedJobId);
        setJobs(jobs.filter((job: Job) => job.metadata.id !== selectedJobId)); // Updated to use metadata.id
        toast.success('Job deleted successfully');
      } catch (err) {
        toast.error('Failed to delete job');
      } finally {
        setIsModalOpen(false);
        setSelectedJobId(null);
      }
    }
  };

  const handleEdit = (id: number, title: string) => {
    setIsEditing(id);
    setUpdatedTitle(title);
  };

  const handleUpdateJob = async (id: number) => {
    try {
      await AdminService.updateJob(id, { title: updatedTitle });
      setJobs(jobs.map((job: Job) => (
        job.metadata.id === id
          ? { ...job, metadata: { ...job.metadata, jobTitle: updatedTitle } } // Update metadata.jobTitle
          : job
      )));
      toast.success('Job updated successfully');
      setIsEditing(null);
    } catch (err) {
      toast.error('Failed to update job');
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (loading) return <Loader />; // Assume Loader is a spinner component

  if (error) return <p>{error}</p>;

  return (
    <div className="admin-panel">
      <h1>Manage Jobs</h1>

      {/* Pagination controls */}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={i + 1 === currentPage ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {currentJobs.map((job: Job) => (
        <div key={job.metadata.id} className="job-item">
          {isEditing === job.metadata.id ? (
            <div>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button onClick={() => handleUpdateJob(job.metadata.id)}>Save</button>
              <button onClick={() => setIsEditing(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h3>{job.metadata.jobTitle}</h3>
              <p>{job.company.name}</p>
              <div className="job-actions">
                <button onClick={() => handleEdit(job.metadata.id, job.metadata.jobTitle)}>Edit</button>
                <button onClick={() => handleDelete(job.metadata.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Confirmation"
        body="Are you sure you want to delete this job?"
      />

      {/* Pagination controls */}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={i + 1 === currentPage ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
