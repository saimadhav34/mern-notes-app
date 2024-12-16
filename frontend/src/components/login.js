import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state to show a spinner or message
  const [error, setError] = useState(null);  // For error messages
  const history = useHistory();  // useHistory to handle redirect

  // Check if token already exists in localStorage
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/notes');  // If token exists, redirect to /notes
    }
  }, [history]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    setError(null);  // Reset error state before making request

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });

      // Store JWT token in localStorage and redirect on success
      localStorage.setItem('token', res.data.access_token);
      setLoading(false);  // Stop loading
      history.push('/notes');  // Redirect to Notes page after successful login
    } catch (error) {
      setLoading(false);  // Stop loading
      setError('Login failed! Check credentials.');  // Show error message
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>} {/* Display error message */}

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'} {/* Button text changes during loading */}
          </button>
        </div>
      </form>

      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;



