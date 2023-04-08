import React, { useRef } from "react";
import './App.css';
import { Link } from "react-router-dom";
import axios from "axios";


function HomePage() {
  const phyRef = useRef(null);
  const dietRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const handleNavigation = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Healthmate</div>
        <nav>
          <ul className="nav-list">
          <li>
              <button className="nav-button" onClick={() => handleNavigation(dietRef)}>
                Diet
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => handleNavigation(phyRef)}>
                Physical Fitness
              </button>
            </li>
            <li>
            <Link to="/Login">
              <button className="nav-button" onClick={() => handleNavigation(projectsRef)}>
                Login
              </button>
              </Link>
            </li>
            <li>
            <Link to="/Register">
              <button className="nav-button" onClick={() => handleNavigation(contactRef)}>
                Register
              </button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {/* <div className="login-form-container">
      
         <Signin />
        <Link to="/Signup">
        <button>SignUp</button>
        </Link>
          <br />
          <br />
        <Link to="/Reports">
        <button>Reports</button>
        </Link>
      </div> */}
     
      <div className="content">
      
      </div>

      <div ref={phyRef} className="pfit">
        <h1 className="dashboard-h">Physical Fitness</h1>
        <div className="fitness-container">
        </div>
      </div>

      <div ref={dietRef} className="dfit">
        <h1 className="dashboard-h">Dietary Fitness</h1>
        <div className="dietary-container">
        </div>
      </div>




    </div>
  );
}

export default HomePage;
