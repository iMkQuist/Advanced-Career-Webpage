"use client";

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadJobs } from '../redux/jobSlice';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import Head from 'next/head';
import { AppDispatch } from '../redux/store';
import JobService from '../services/jobService';

const useAppDispatch = () => useDispatch<AppDispatch>();

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { jobs, loading, error } = useSelector((state: any) => state.jobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await JobService.getAllJobs();
      dispatch(loadJobs({ page: currentPage, pageSize: jobsPerPage }));
    };
    fetchJobs();
  }, [dispatch, currentPage, jobsPerPage]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <Head>
        <title>Available Jobs</title>
        <meta name="description" content="Browse available job listings and find your next opportunity." />
      </Head>

      <h1>Available Jobs</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs by title or company"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="job-listing-grid">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p>No jobs found</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          padding: 10px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #ddd;
        }
        .job-listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .pagination button {
          padding: 10px;
          border: none;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
        }
        .pagination button.active {
          background-color: #005bb5;
        }
        .error-message {
          color: red;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}