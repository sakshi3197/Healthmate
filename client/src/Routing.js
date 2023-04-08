import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App"

import Register from './Register';
import Login from './Login';
import ClientDashboard from "./ClientDashboard"
import FPDashboard from './FPDashboard';
import NewPost from './NewPost'
import Posts from './Posts'

function Routing() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
         
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />}/>
          <Route path="/ClientDashboard" element={<ClientDashboard />} />
          <Route path="/FPDashboard" element={<FPDashboard />} />
          <Route path="/NewPost" element={<NewPost />} />
          <Route path="/Posts" element={<Posts />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default Routing;

