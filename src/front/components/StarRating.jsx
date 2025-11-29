import React, { useState } from "react";
import "./StarRating.css"; 

export const StarRating = ({ rating = 0, onRate }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "filled" : ""}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
