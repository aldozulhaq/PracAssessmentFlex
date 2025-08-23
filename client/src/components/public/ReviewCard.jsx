import React from 'react';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center mb-4">
        {/* Placeholder for guest avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
        <div>
          <p className="font-bold text-flex-dark-green">{review.guestName}</p>
          <p className="text-sm text-flex-text-secondary">
            {new Date(review.submittedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <StarRating rating={review.averageRating} />
      </div>
      <p className="text-flex-text-secondary leading-relaxed">
        "{review.publicReview}"
      </p>
    </div>
  );
};

export default ReviewCard;