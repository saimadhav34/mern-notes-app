import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { About } from "./components/About";
import Login from './components/login';
import Signup from './components/Signup';
import Notes from './components/notes';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenAfterLogin = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        if (token) {
          await axios.get('http://localhost:5000/api/notes', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuthenticated(true);
        } else if (refreshToken && !isRefreshing) {
          setIsRefreshing(true);
          const refreshResponse = await axios.post('http://localhost:5000/refresh', {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          localStorage.setItem('token', refreshResponse.data.access_token);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
        } else {
          console.error('Error fetching notes:', error);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    checkTokenAfterLogin();
  }, [isRefreshing]); // Only re-run when `isRefreshing` changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <div className="container p-4">
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/login">
            {!isAuthenticated ? <Login /> : <Redirect to="/notes" />}
          </Route>
          <Route path="/signup">
            {!isAuthenticated ? <Signup /> : <Redirect to="/notes" />}
          </Route>
          <Route path="/notes">
            {isAuthenticated ? <Notes /> : <Redirect to="/login" />}
          </Route>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;



