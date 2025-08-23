import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleReviewCard from './GoogleReviewCard';

const GoogleReviewsSection = ({ dataId }) => {
    const [googleData, setGoogleData] = useState({ reviews: [], viewMoreUrl: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!dataId) {
            setLoading(false);
            return;
        }
    
        const fetchGoogleReviews = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/reviews/google/${dataId}`);
                setGoogleData(data);
            } catch (err) {
                setError('Could not load Google reviews at this time.');
            } finally {
                setLoading(false);
            }
        };


        fetchGoogleReviews();
    }, [dataId]);

    if (loading) return <p>Loading Google Reviews...</p>;
    if (error) return <p className="text-orange-500">{error}</p>;
    if (!dataId || !googleData.reviews || googleData.reviews.length === 0) {
        return null;
    }

    return (
        <div id="google-reviews">
            <h2 className="text-2xl font-bold text-flex-dark-green mb-4">
            Guest Reviews from around the web
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- LIMIT reviews to 4 --- */}
                {googleData.reviews.slice(0, 4).map((review, index) => (
                <GoogleReviewCard key={index} review={review} />
                ))}
            </div>
            
            {googleData.viewMoreUrl && (
                <div className="mt-8 text-center">
                <a
                    href={googleData.viewMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-flex-dark-green font-bold py-3 px-6 rounded-lg border-2 border-flex-dark-green hover:bg-flex-dark-green hover:text-white transition-colors"
                >
                    View All on Google
                </a>
                </div>
            )}

        </div>
    );
};

export default GoogleReviewsSection;