import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ReviewsTable from '../components/ReviewsTable';
import StatsCards from '../components/StatsCards';

const DashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/reviews');
        setReviews(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  const handleUpdateReview = (updatedReview) => {
    setReviews(currentReviews => 
      currentReviews.map(review => 
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-flex-dark-green">Manager Dashboard</h1>
        <p className="mt-2 text-flex-text-secondary">
          Review, filter, and approve guest reviews for public display.
        </p>
      </div>
      
      <StatsCards reviews={reviews} />
      
      {/* We can wrap the table in a container for a title */}
      <div>
         <h2 className="text-2xl font-bold text-flex-dark-green mb-4">All Reviews</h2>
         <ReviewsTable data={reviews} onUpdateReview={handleUpdateReview} />
      </div>
    </div>
  );
};

export default DashboardPage;