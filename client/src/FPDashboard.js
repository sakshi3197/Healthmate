import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

const FPDashboard = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('type');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5001/api/users/${userType}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error.message);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      {user && (
        
        <div>
        <header className="header">
        <div className="logo">Healthmate</div>
        <nav>
          <ul className="nav-list">
          <li>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
          </li>
          <li>
            <Link to="/Posts">
              <button className="nav-button" >
                Posts
              </button>
              </Link>
          </li>
          <li>
          <Link to={{pathname: "/newpost", state: {user: user, token: localStorage.getItem('token')}}}>
              <button className="nav-button" >
                New Post
              </button>
            </Link>
          </li>
          <li>
              <button className="nav-button" >
                Profile
              </button>
          </li>
    
          </ul>
        </nav>
      </header>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div>
            <h1>This is fitness professional dashboard page</h1>
          <h1>Welcome, {user.firstName} {user.lastName}!</h1>
          <p>Email: {user.email}</p>
          <p>User Type: {user.type}</p>
        </div>

        </div>
      )}
    </div>
    

    
  );
};

export default FPDashboard;
