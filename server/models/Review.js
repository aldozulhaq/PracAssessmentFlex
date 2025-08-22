const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  sourceId: { type: String, required: true, unique: true }, // Will have unique IDs for each review coming from different sources, nice to have
  source: { type: String, required: true, enum: ['Hostaway', 'Google'] },
  listingName: { type: String, required: true },
  guestName: { type: String, required: true },
  publicReview: { type: String, default: '' },
  submittedAt: { type: Date, required: true },
  averageRating: { type: Number, required: true },
  ratings: {
    cleanliness: Number,
    communication: Number,
    respect_house_rules: Number,
    checkin: Number,
    accuracy: Number,
    location: Number,
    value: Number,
  },
  isApprovedForPublic: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);