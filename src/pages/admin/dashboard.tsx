import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminPanel from '../../components/AdminPanel';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext for authentication
import Loader from '../../components/Loader'; // Assuming a Loader component for loading states
import ErrorBoundary from '../../components/ErrorBoundary'; // Assuming an ErrorBoundary component

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth(); // Get user and loading state from AuthContext
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user has admin privileges
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      setError('You do not have permission to access this page.');
      router.push('/login'); // Redirect to login if not authenticated or not an admin
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <Loader />; // Show a loader while checking authentication
  }

  if (error) {
    return <p className="error">{error}</p>; // Show an error message if access is denied
  }

  return (
    <MainLayout title="Admin Dashboard" description="Manage jobs and users from the admin dashboard">
      <div className="admin-dashboard">
        <ErrorBoundary>
          <nav aria-label="breadcrumb" className="breadcrumb">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/admin">Admin</a></li>
              <li aria-current="page">Dashboard</li>
            </ol>
          </nav>

          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.username}! Manage jobs, users, and more.</p>

          {/* Admin panel that contains job management functionality */}
          <AdminPanel />
        </ErrorBoundary>
      </div>

      {/* Page-specific styles */}
      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          background-color: #f9f9f9;
          min-height: calc(100vh - 150px);
        }
        .breadcrumb {
          background-color: #f0f0f0;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .breadcrumb ol {
          display: flex;
          gap: 10px;
          list-style: none;
        }
        .breadcrumb ol li a {
          color: #0070f3;
          text-decoration: none;
        }
        .breadcrumb ol li a:hover {
          text-decoration: underline;
        }
        .error {
          color: red;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </MainLayout>
  );
}
