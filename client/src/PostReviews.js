import React from 'react';

const PostReviews = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
          <div>
            <h3>No reviews yet.</h3>
          </div>
        );
      }
return (
<div>
<h3>Reviews and Ratings</h3>
{reviews.map((review, index) => (
<div key={index}>
<p>Reviewer: {review.fullName} </p>
<p>Email: {review.email}</p>
<p>Review: {review.review}</p>
<p>Rating: {review.rating}</p>
</div>
))}
</div>
);
};

export default PostReviews;