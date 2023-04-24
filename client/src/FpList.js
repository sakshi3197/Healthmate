import React, { useState, useEffect } from 'react';
import './fpList.css';
import axios from 'axios';

const FpList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setIsLoading(true);
    const source = axios.CancelToken.source();
    try {
      const userResponse = await axios.get(`http://localhost:5001/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cancelToken: source.token,
      });
      setUser(userResponse.data);

      const fpListResponse = await axios.get('http://localhost:5001/api/fp_list', {
        cancelToken: source.token,
      });
      setProfessionals(fpListResponse.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const subscribeToProfessional = async (professionalId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/subscribe/${professionalId}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Successfully subscribed to professional');
        try {
          await fetchData(); // Fetch the updated user data after subscribing
        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      } else {
        console.error('Error subscribing to professional:', response.statusText);
      }
    } catch (error) {
      console.error('Error subscribing to professional:', error);
      try {
        const errorJson = await error.response.data;
        console.error('Error data:', errorJson);
      } catch (parseError) {
        console.error('Unable to parse error JSON:', parseError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const unsubscribeFromProfessional = async (professionalId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/unsubscribe/${professionalId}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Successfully unsubscribed from professional');
        try {
          await fetchData(); // Fetch the updated user data after unsubscribing
        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      } else {
        console.error('Error unsubscribing from professional:', response.statusText);
      }
    } catch (error) {
      console.error('Error unsubscribing from professional:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = (professionalId) => {
    if (!user) return false;
    return user.subscribed.some((professional) => professional._id === professionalId);
  };

  return (
    <div className="fitness-professionals">
      <h1>Fitness Professionals</h1>
      {isLoading && <p>Loading...</p>}
      <ul>
        {professionals.map((professional, index) => (
          <li key={index}>
            {professional.firstName} {professional.lastName} - {professional.email}
            {isSubscribed(professional._id) ? (
              <>
                <button className="subscribed-button" disabled>
                  Subscribed
                </button>
                <button
                  className="unsubscribe-button"
                  onClick={() => unsubscribeFromProfessional(professional._id)}
                  disabled={isLoading}
                >
                  Unsubscribe
                </button>
              </>
            ) : (
              <button
                className="subscribe-button"
                onClick={() => subscribeToProfessional(professional._id)}
                disabled={isLoading}
              >
                Subscribe
              </button>
            )}
          </li>
        ))}
      </ul>
      {user && user.subscribed.length === 0 && (
        <p>Please subscribe to give recommendations</p>
      )}
    </div>
  );
};

export default FpList;
