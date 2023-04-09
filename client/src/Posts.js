import React, { useState, useEffect } from 'react';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const fetchPosts = async (query = '') => {
        try {
          
          //const response = await fetch(`http://localhost:5001/api/posts${query}`);
          const response = await fetch(`https://healthmate-backend.onrender.com/api/posts${query}`);
      
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
          }
      
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error.message);
        }
      };

      const handleSearch = () => {
        fetchPosts(`?search=${searchQuery}`);
      };
      

      useEffect(() => {
        fetchPosts();
      }, []);

      return (
        <div>
          <h1>Posts</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
          <ul>
            {posts.map((post) => (
              <li key={post._id}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p>Type: {post.type}</p>
                <p>Author: {post.name}</p>
                <p>Email: {post.email}</p>
                <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      );
      
      

  };

export default Posts;
