import React from 'react';

const Rating = ({ rating }) => {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return <div className="product-rating">{stars}</div>;
}

export default Rating;
