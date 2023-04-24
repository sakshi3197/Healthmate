// import React, { useState, useEffect } from 'react';
// import './Posts.css';
// import { Link } from "react-router-dom";

// const token = localStorage.getItem('token');
// const Posts = () => {
//     const [posts, setPosts] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const fetchPosts = async (query = '') => {
//         try {
//           const response = await fetch(`http://localhost:5001/api/posts${query}`,{
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//           })
        
//           if (!response.ok) {
//             throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
//           }
      
//           const data = await response.json();
//           setPosts(data);
//         } catch (error) {
//           console.error('Error fetching posts:', error.message);
//         }
//       };

//       const handleSearch = () => {
//         fetchPosts(`?search=${searchQuery}`);
//       };
      

//       useEffect(() => {
//         fetchPosts();
//       }, []);


//       return (
//         <div>
//           <header className="navbar">
//             <h1>Posts</h1>
//             <div className="searchBox">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search..."
//                 className="searchInput"
//               />
//               <button onClick={handleSearch}>Search</button>
//             </div>
//           </header>
//           <div className="postsContainer">
//         <ul>
//           {posts.map((post) => (
//             <li key={post._id} className="postItem">
//               <Link to={`/post/${post._id}`}>
//                 <h2>{post.title}</h2>
//                 <p>{post.description}</p>
//                 <p>Type: {post.type}</p>
//                 <p>Author: {post.name}</p>
//                 <p>Email: {post.email}</p>
//                 <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//         </div>
//       );
//     };

// export default Posts;
import React, { useState, useEffect } from 'react';
import './Posts.css';
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

  const fetchPosts = async (query = '') => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${query}`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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
      <header className="navbar">
        <h1>Posts</h1>
        <div className="searchBox">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="searchInput"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>
      <div className="postsContainer">
        <ul>
          {posts.map((post) => (
            <li key={post._id} className="postItem">
              <Link to={`/post/${post._id}`}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p>Type: {post.type}</p>
                <p>Author: {post.name}</p>
                <p>Email: {post.email}</p>
                <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Posts;
