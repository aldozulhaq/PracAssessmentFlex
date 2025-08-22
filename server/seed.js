const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./models/Review');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

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
      ratingCount = 1; // Assume one rating
  }
  
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

  return {
    sourceId: rawReview.id.toString(),
    source: 'Hostaway',
    listingName: rawReview.listingName,
    guestName: rawReview.guestName,
    publicReview: rawReview.publicReview,
    submittedAt: new Date(rawReview.submittedAt),
    averageRating: parseFloat(averageRating.toFixed(2)),
    ratings: ratings,
    isApprovedForPublic: false, // Default state
  };
};

const importData = async () => {
  try {
    await Review.deleteMany(); // Clear existing reviews

    const filePath = path.join(__dirname, 'data', 'reviews.json');
    const reviewsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const rawReviews = reviewsData.result || reviewsData;

    const normalizedReviews = rawReviews.map(normalizeHostawayReview);

    await Review.insertMany(normalizedReviews);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await importData();
};

seedDatabase();