import { useState } from 'react';
import { signupUser } from '../services/userService';
import { useRouter } from 'next/router';
import Loader from '../components/Loader'; // Assume you have a Loader component
import Head from 'next/head';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (password.match(/[A-Za-z]/) && password.match(/[0-9]/)) return 'Moderate';
    if (password.match(/[A-Za-z]/) && password.match(/[0-9]/) && password.match(/[@$!%*#?&]/)) return 'Strong';
    return 'Weak';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordStrength(validatePasswordStrength(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic client-side validation
    if (!username || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      await signupUser({ username, email, password });
      setLoading(false);
      router.push('/login'); // Redirect to login after successful signup
    } catch (err) {
      setLoading(false);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <Head>
        <title>Create Your Account</title>
        <meta name="description" content="Create your account and join our platform." />
      </Head>

      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <Loader /> // Display a loading spinner while processing
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
                onChange={handlePasswordChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {password && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          <button type="submit" className="submit-button">Sign Up</button>
        </form>
      )}

      {/* Styles for the signup page */}
      <style jsx>{`
        .signup-page {
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
          border-radius: 5px;
          border: 1px solid #ddd;
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
        .password-strength {
          margin-top: 10px;
          font-weight: bold;
        }
        .password-strength.weak {
          color: red;
        }
        .password-strength.moderate {
          color: orange;
        }
        .password-strength.strong {
          color: green;
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
          .signup-page {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
