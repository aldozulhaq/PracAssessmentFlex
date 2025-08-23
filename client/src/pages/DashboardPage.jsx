import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import ReviewsTable from '../components/ReviewsTable';
import StatsCards from '../components/StatsCards';
import DashboardCharts from '../components/DashboardCharts';

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

   const chartData = useMemo(() => {
    const guestReviews = reviews.filter(r => r.type === 'guest-to-host');
    if (guestReviews.length === 0) return null;

    const monthlyData = guestReviews.reduce((acc, review) => {
      const month = new Date(review.submittedAt).toISOString().slice(0, 7); // "YYYY-MM"
      if (!acc[month]) {
        acc[month] = { count: 0, totalRating: 0, reviews: 0 };
      }
      acc[month].count++;
      acc[month].totalRating += review.averageRating;
      acc[month].reviews++;
      return acc;
    }, {});
    const timeSeriesData = Object.keys(monthlyData).sort().map(month => ({
      name: month,
      reviews: monthlyData[month].count,
      averageRating: (monthlyData[month].totalRating / monthlyData[month].reviews).toFixed(2),
    }));

    const propertyData = guestReviews.reduce((acc, review) => {
      const name = review.listingName;
      if (!acc[name]) {
        acc[name] = { totalRating: 0, count: 0 };
      }
      acc[name].totalRating += review.averageRating;
      acc[name].count++;
      return acc;
    }, {});
    const propertyPerformanceData = Object.keys(propertyData).map(name => ({
      name,
      averageRating: parseFloat((propertyData[name].totalRating / propertyData[name].count).toFixed(2)),
    })).sort((a, b) => b.averageRating - a.averageRating);

    const categoryTotals = { cleanliness: { total: 0, count: 0 }, communication: { total: 0, count: 0 }, respect_house_rules: { total: 0, count: 0 }, accuracy: { total: 0, count: 0 }, location: { total: 0, count: 0 }, value: { total: 0, count: 0 } };
    guestReviews.forEach(review => {
        for (const category in review.ratings) {
            if (categoryTotals[category]) {
                categoryTotals[category].total += review.ratings[category];
                categoryTotals[category].count++;
            }
        }
    });
    const subRatingData = Object.keys(categoryTotals).map(category => ({
      subject: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
      A: categoryTotals[category].count > 0 ? parseFloat((categoryTotals[category].total / categoryTotals[category].count).toFixed(2)) : 0,
      fullMark: 10,
    }));
    
    return { timeSeriesData, propertyPerformanceData, subRatingData };
  }, [reviews]);

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

      {chartData && <DashboardCharts chartData={chartData} />}
      
      {/* We can wrap the table in a container for a title */}
      <div>
         <h2 className="text-2xl font-bold text-flex-dark-green mb-4">All Reviews</h2>
         <ReviewsTable data={reviews} onUpdateReview={handleUpdateReview} />
      </div>
    </div>
  );
};

export default DashboardPage;