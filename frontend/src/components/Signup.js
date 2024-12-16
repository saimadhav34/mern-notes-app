import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';  // Import the Signup CSS

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for the button
  const [error, setError] = useState(null);  // Error message state
  const history = useHistory();  // useHistory to handle redirect

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    setError(null);  // Reset any previous errors
    
    try {
      // Make the POST request to signup endpoint
      await axios.post('http://localhost:5000/signup', { email, password });
      setLoading(false);  // Stop loading
      alert('Signup successful! Please login.');
      history.push('/login');  // Redirect to login page after successful signup
    } catch (error) {
      setLoading(false);  // Stop loading
      setError('Signup failed! Email may already be in use or check other details.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      <form onSubmit={handleSignup}>
        <div>
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}  {/* Show loading text when loading */}
          </button>
        </div>
      </form>
      <div className="login-link">
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Signup;
