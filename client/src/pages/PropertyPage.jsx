import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingCard from '../components/public/BookingCard';
import ReviewCard from '../components/public/ReviewCard';
import StarRating from '../components/public/StarRating';
import ImageGallery from '../components/public/ImageGallery';
import AmenitiesPreview from '../components/public/AmenitiesPreview';
import { UsersIcon, BedIcon } from '../components/Icons';

const PropertyPage = () => {
  const { listingName } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/reviews/public/${encodeURIComponent(listingName)}`);
        setReviews(data);
      } catch (err) {
        setError('Could not load reviews for this property.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicReviews();
  }, [listingName]);

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.averageRating, 0);
    return (total / reviews.length).toFixed(2);
  }, [reviews]);

  return (
    <div className="bg-flex-white">
      
      <ImageGallery />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-flex-dark-green">{listingName}</h1>
        <div className="flex items-center space-x-4 text-flex-text-secondary mt-2">
          <div className="flex items-center space-x-2"><UsersIcon /> <span>2 guests</span></div>
          <span>·</span>
          <div className="flex items-center space-x-2"><BedIcon /> <span>1 bedroom</span></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-12 mt-8">
        <div className="w-full lg:w-2/3 space-y-12">

          <div>
            <p className="text-flex-text-secondary leading-relaxed mt-6">
              This is a placeholder description for the beautiful {listingName}. It has wonderful amenities and is located in a prime location, perfect for your next getaway. We are sure you will enjoy your stay.
            </p>
          </div>

          <AmenitiesPreview />

          <div id="reviews">
            <h2 className="text-2xl font-bold text-flex-dark-green mb-4">
              What our guests are saying
            </h2>

            {loading && <p>Loading reviews...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
              <>
                {reviews.length > 0 ? (
                  <>
                    <div className="flex items-center space-x-2 mb-6">
                      <StarRating rating={overallRating} />
                      <span className="font-bold text-lg">{overallRating}</span>
                      <span className="text-flex-text-secondary">({reviews.length} reviews)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reviews.map(review => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-flex-text-secondary italic">
                    No guest reviews have been approved for display yet.
                  </p>
                )}
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-flex-dark-green mb-4">Where you'll be</h2>
             <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <BookingCard />
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;