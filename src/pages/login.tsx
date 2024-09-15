import { useState } from 'react';
import { loginUser } from '../services/userService';
import { useRouter } from 'next/router';
import Loader from '../components/Loader'; // Assume you have a Loader component
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      await loginUser({ email, password, rememberMe });
      setLoading(false);
      router.push('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setLoading(false);
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-page">
      <Head>
        <title>Login to Your Account</title>
        <meta name="description" content="Login to your account and access your personalized dashboard." />
      </Head>

      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <Loader /> // Display a loading spinner while the login is processing
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <button type="submit" className="submit-button">Login</button>
        </form>
      )}

      {/* Styles for the login page */}
      <style jsx>{`
        .login-page {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .password-input {
          display: flex;
          align-items: center;
        }
        .password-input button {
          margin-left: 10px;
          padding: 8px 12px;
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .password-input button:hover {
          background: #005bb5;
        }
        .submit-button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #005bb5;
        }
        .error-message {
          color: red;
          font-weight: bold;
          text-align: center;
        }
        @media (max-width: 768px) {
          .login-page {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
