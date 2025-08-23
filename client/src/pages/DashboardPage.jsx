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
    <div>
      <h1 className="text-3xl font-bold text-flex-text mb-6">Manager Dashboard</h1>
      <StatsCards reviews={reviews} />
      <p className="mb-4">
        
      </p>
      <ReviewsTable data={reviews} onUpdateReview={handleUpdateReview} />
    </div>
  );
};

export default DashboardPage;