import React from 'react';
import { Link } from 'react-router-dom';

const RatingBreakdown = ({ label, rating }) => (
  <div className="flex justify-between text-sm">
    <span className="text-flex-text-secondary">{label}</span>
    <span className="font-medium text-flex-dark-green">{rating}/10</span>
  </div>
);

const ReviewDetailCard = ({ review }) => {
  const hasRatings = review.ratings && Object.keys(review.ratings).length > 0;

  return (
    <div className="bg-flex-cream p-6 rounded-md shadow-inner grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div className={hasRatings ? "md:col-span-2" : "md:col-span-3"}>
        <h4 className="font-semibold text-flex-dark-green mb-2">Full Review</h4>
        <p className="text-sm text-flex-text-primary leading-relaxed prose prose-sm">
          {review.publicReview || <span className="italic text-gray-400">No public review left.</span>}
        </p>
      </div>
      
      {hasRatings && (
        <div className="md:col-span-1">
          <h4 className="font-semibold text-flex-dark-green mb-2">Rating Breakdown</h4>
          <div className="space-y-2 border-t pt-2">
            {review.ratings.cleanliness && <RatingBreakdown label="Cleanliness" rating={review.ratings.cleanliness} />}
            {review.ratings.communication && <RatingBreakdown label="Communication" rating={review.ratings.communication} />}
            {review.ratings.checkin && <RatingBreakdown label="Check-in" rating={review.ratings.checkin} />}
            {review.ratings.accuracy && <RatingBreakdown label="Accuracy" rating={review.ratings.accuracy} />}
            {review.ratings.location && <RatingBreakdown label="Location" rating={review.ratings.location} />}
            {review.ratings.value && <RatingBreakdown label="Value" rating={review.ratings.value} />}
            {review.ratings.respect_house_rules && <RatingBreakdown label="Respect House Rules" rating={review.ratings.respect_house_rules} />}
          </div>
        </div>
      )}

      <div className="col-span-1 md:col-span-3 flex justify-end pt-4 border-t border-white/50">
        <Link
          to={`/property/${encodeURIComponent(review.listingName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium bg-white text-flex-dark-green px-3 py-1 rounded-full shadow-sm hover:bg-gray-100 transition-colors border border-gray-200"
        >
          View Public Page ↗
        </Link>
      </div>
    </div>
  );
};

export default ReviewDetailCard;