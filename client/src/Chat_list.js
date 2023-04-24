import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chat_list.css';
import UserChat from './UserChat';

const ChatList = () => {
  const [professionals, setProfessionals] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedProfessionalEmail, setSelectedProfessionalEmail] = useState(null);
  const userId = localStorage.getItem('id');
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
  
    if (userId && token) {
      fetchUserEmail();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/fp_list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProfessionals(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleClick = (professionalId, professionalEmail) => {
    setSelectedProfessional(professionalId);
    setSelectedProfessionalEmail(professionalEmail);
  };

  return (
    <div className="chat-list">
      <h1>Available Fitness Professionals</h1>
      <div className="professionals-container">
        {professionals.map((professional) => (
          <div
            key={professional._id}
            className="professional-box"
            onClick={() => handleClick(professional._id, professional.email)}
          >
            <p>
              {professional.firstName} {professional.lastName}
            </p>
            <p>{professional.email}</p>
          </div>
        ))}
      </div>
      {selectedProfessional && userEmail && (
        <UserChat
          userEmail={userEmail}
          professionalId={selectedProfessional}
          professionalEmail={selectedProfessionalEmail}
        />
      )}
    </div>
  );
};

export default ChatList;
