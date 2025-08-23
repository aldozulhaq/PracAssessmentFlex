const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const axios = require('axios'); 

// @desc    Get all reviews for the manager dashboard
// @route   GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ submittedAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a review's approval status
// @route   PUT /api/reviews/:id
router.put('/:id', async (req, res) => {
  try {
    const { isApprovedForPublic } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      review.isApprovedForPublic = isApprovedForPublic;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get only approved reviews for a specific listing (for the public page)
// @route   GET /api/reviews/public/:listingName
router.get('/public/:listingName', async (req, res) => {
    try {
        const listingName = decodeURIComponent(req.params.listingName);
        const reviews = await Review.find({
            listingName: listingName,
            isApprovedForPublic: true
        }).sort({ submittedAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/google/:dataId', async (req, res) => {
  try {
    const { dataId } = req.params;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'SerpAPI key is not configured.' });
    }

    const endpoint = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${dataId}&api_key=${apiKey}`;
    
    console.log(`Fetching Google Reviews for data_id: ${dataId}`);
    const response = await axios.get(endpoint);

    if (response.data && response.data.reviews) {
      res.json({
        reviews: response.data.reviews,
        viewMoreUrl: response.data.search_metadata?.google_maps_reviews_url
      });
    } else {
      res.json({ reviews: [], viewMoreUrl: null });
    }
  } catch (error) {
    console.error('SerpAPI Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to fetch Google Reviews.' });
  }
});

module.exports = router;