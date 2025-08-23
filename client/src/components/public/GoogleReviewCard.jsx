import React from 'react';
import StarRating from './StarRating';

const truncateText = (text, wordLimit = 25) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

const GoogleReviewCard = ({ review }) => {
    const truncatedSnippet = truncateText(review.snippet);
    
    return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center mb-4">
        <img src={review.user.thumbnail} alt={review.user.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-bold text-flex-dark-green">{review.user.name}</p>
          <p className="text-sm text-flex-text-secondary">{review.date}</p>
        </div>
      </div>
      <div className="mb-4">
        <StarRating rating={review.rating} maxRating={5} />
      </div>
      <p className="text-flex-text-secondary leading-relaxed flex-grow">
        "{truncatedSnippet}"
      </p>
    </div>
  );
};

export default GoogleReviewCard;