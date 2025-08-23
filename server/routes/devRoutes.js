const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');

const normalizeHostawayReview = (rawReview) => {
    let totalRating = 0;
    let ratingCount = 0;
    const ratings = {};

    if (rawReview.reviewCategory) {
        rawReview.reviewCategory.forEach(cat => {
            ratings[cat.category.toLowerCase().replace(/ /g, '_')] = cat.rating;
            totalRating += cat.rating;
            ratingCount++;
        });
    }

    if (ratingCount === 0 && rawReview.rating) {
        totalRating = rawReview.rating;
        ratingCount = 1;
    }

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    return {
        sourceId: rawReview.id.toString(),
        source: 'Hostaway',
        type: rawReview.type,
        listingName: rawReview.listingName,
        guestName: rawReview.guestName,
        publicReview: rawReview.publicReview,
        submittedAt: new Date(rawReview.submittedAt),
        averageRating: parseFloat(averageRating.toFixed(2)),
        ratings: ratings,
        isApprovedForPublic: false,
    };
};

// @desc    Seed database from Hostaway API, with fallback to local JSON
// @route   POST /api/dev/seed-database
router.post('/seed-database', async (req, res) => {
    try {
        let rawReviews = [];
        try {
            console.log('Attempting to fetch reviews from Hostaway API...');
            const url = 'https://api.hostaway.com/v1/reviews';
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${process.env.HOSTAWAY_API_KEY}`,
                    'X-Hostaway-Account': process.env.HOSTAWAY_ACCOUNT_ID,
                },
            });

            if (response.data && response.data.result && response.data.result.length > 0) {
                console.log('Successfully fetched reviews from Hostaway API.');
                rawReviews = response.data.result;
            } else {
                console.log('Hostaway API returned no reviews. Proceeding with mock data fallback.');
            }
        } catch (apiError) {
            console.error(`Hostaway API Error: ${apiError.message}. Proceeding with mock data fallback.`);
        }

        if (rawReviews.length === 0) {
            console.log('Loading reviews from local mock file...');
            const filePath = path.join(__dirname, '..', 'data', 'reviews.json');
            const reviewsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            rawReviews = reviewsData.result || reviewsData;
        }

        console.log(`Normalizing ${rawReviews.length} reviews...`);
        const normalizedReviews = rawReviews.map(normalizeHostawayReview);

        console.log('Wiping existing reviews from database...');
        await Review.deleteMany({});

        console.log('Inserting new reviews into database...');
        await Review.insertMany(normalizedReviews);

        res.status(201).json({
            message: `Database successfully seeded with ${normalizedReviews.length} reviews.`,
            source: rawReviews.length > 0 && !fs.existsSync ? 'Hostaway API' : 'Mock JSON File'
        });

    } catch (error) {
        console.error('Error during database seed:', error);
        res.status(500).json({ message: 'Failed to seed database.' });
    }
});

module.exports = router;