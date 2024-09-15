import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import UserProfile from '../../components/UserProfile';
import Loader from '../../components/Loader'; // Assume a loader component
import Head from 'next/head';

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      // Simulate fetching user data from an API (replace with actual API call)
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/users/${username}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [username]);

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

  if (!user) {
    return (
      <MainLayout>
        <div className="error-message">
          <p>User not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{user.username}'s Profile</title>
        <meta name="description" content={`${user.username}'s profile - ${user.bio}`} />
      </Head>

      <section className="profile-section">
        <UserProfile user={user} />
      </section>

      {/* Styles for profile page */}
      <style jsx>{`
        .profile-section {
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
          .profile-section {
            padding: 10px;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default ProfilePage;
