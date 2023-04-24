import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PostReviews from './PostReviews';

const PostDetails = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);


  const userType = localStorage.getItem('type');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        setPost(response.data);
        setReviews(response.data.reviews || []);

      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    
  }, [id]);

 


  
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const { firstName, lastName, email } = response.data;
      const fullName=firstName+lastName
        await axios.post(`http://localhost:5001/api/posts/${id}/reviews`, {
          userId,
          userType,
          rating,
          review,
          fullName,
          email
        },{
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setRating('');
        setReview('');
        navigate('/posts'); // Replace `history.push('/posts')` with `navigate('/posts')`
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
     
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
        <PostReviews reviews={reviews}/>
      </form>
    </div>
  );
};

export default PostDetails;


