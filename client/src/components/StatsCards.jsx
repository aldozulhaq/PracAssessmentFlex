import React, { useMemo } from 'react';

const StatCard = ({ title, value, subtext }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
    <p className="text-3xl font-bold text-flex-text mt-2">{value}</p>
    {subtext && <p className="text-gray-400 text-sm mt-1">{subtext}</p>}
  </div>
);


const StatsCards = ({ reviews }) => {
  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { totalReviews: 0, approvedReviews: 0, averageRating: 0, pendingReviews: 0 };
    }

    const guestReviews = reviews.filter(r => r.type === 'guest-to-host');
    const totalReviews = guestReviews.length;
    const approvedReviews = guestReviews.filter(r => r.isApprovedForPublic).length;
    const pendingReviews = totalReviews - approvedReviews;
    const totalRating = guestReviews.reduce((acc, r) => acc + r.averageRating, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : 0;
    
    return { totalReviews, approvedReviews, averageRating, pendingReviews };
  }, [reviews]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Guest Reviews" value={stats.totalReviews} />
      <StatCard title="Average Rating" value={stats.averageRating} subtext="from guest reviews" />
      <StatCard title="Reviews to Approve" value={stats.pendingReviews} />
      <StatCard title="Approved for Website" value={stats.approvedReviews} />
    </div>
    
  );
};

export default StatsCards;