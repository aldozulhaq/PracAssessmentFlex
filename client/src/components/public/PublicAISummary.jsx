import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PublicAISummary = ({ reviews }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewTexts = reviews.map(r => r.publicReview).filter(Boolean);
    if (reviewTexts.length < 2) {
      setLoading(false);
      return;
    }

    const generateSummary = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post('/api/ai/summarize-public-reviews', { reviews: reviewTexts });
        setSummary(data);
      } catch (err) {
        console.error("Failed to generate public AI summary", err);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [reviews]);

  if (loading) {
    return (
      <div className="text-center p-6 bg-flex-cream rounded-lg">
        <p className="font-semibold text-flex-dark-green animate-pulse">✨ Generating a personal summary for you...</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-flex-cream p-6 rounded-lg border border-yellow-200">
      <h3 className="text-xl font-bold text-flex-dark-green mb-3">Guest Experience Summary</h3>
      <p className="text-flex-text-secondary italic mb-4">"{summary.summary_paragraph}"</p>
      <div>
        <h4 className="font-semibold text-flex-text-primary mb-2">Guests consistently loved:</h4>
        <ul className="space-y-2">
          {summary.key_highlights.map((highlight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✔</span>
              <span className="text-flex-text-secondary">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicAISummary;