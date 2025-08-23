import React, { useState } from 'react';
import axios from 'axios';

const AIInsights = ({ reviews }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateInsights = async () => {
    const reviewTexts = reviews
      .filter(r => r.type === 'guest-to-host' && r.publicReview)
      .map(r => r.publicReview);

    if (reviewTexts.length < 2) {
      setError('Need at least two guest reviews with text to generate insights.');
      return;
    }

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const { data } = await axios.post('/api/ai/summarize-reviews', { reviews: reviewTexts });
      setInsights(data);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-subtle border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-flex-dark-green">✨ Review Intelligence</h3>
          <p className="text-sm text-flex-text-secondary">AI-powered summary of guest feedback.</p>
        </div>
        <button
          onClick={handleGenerateInsights}
          disabled={loading}
          className="bg-flex-dark-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {error && <p className="mt-4 text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
      
      {insights && (
        <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-1">Summary</h4>
            <p className="text-sm text-flex-text-primary italic">"{insights.summary}"</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-green-600">✅ Positive Points</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {insights.positive_points.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2 text-orange-600">💡 Areas for Improvement</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {insights.improvement_areas.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;