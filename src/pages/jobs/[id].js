import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import JobDetail from '../../../components/JobDetail';
import Loader from '../../../components/Loader'; // Assume a loader component
import Head from 'next/head';

const JobDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      // Simulate fetching job data from an API (replace with actual API call)
      const fetchJobData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/jobs/${id}`);
          if (!response.ok) throw new Error('Job not found');
          const data = await response.json();
          setJob(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchJobData();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="error-message">
          <p>Job not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{job.title} at {job.company}</title>
        <meta name="description" content={`Job opening for ${job.title} at ${job.company} located in ${job.location}.`} />
      </Head>

      <section className="job-detail-section">
        <JobDetail job={job} />
      </section>

      {/* Styles for job detail page */}
      <style jsx>{`
        .job-detail-section {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .error-message {
          padding: 20px;
          text-align: center;
          color: red;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .job-detail-section {
            padding: 10px;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default JobDetailPage;
