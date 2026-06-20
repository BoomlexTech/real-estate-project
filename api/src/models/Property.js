const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  priceMin: { type: Number },
  priceMax: { type: Number },
  priceLabel: { type: String },
  location: {
    area: { type: String, default: '' },
    emirate: { type: String, default: 'Dubai', enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'] },
    coordinates: { lat: Number, lng: Number },
  },
  propertyType: {
    type: String,
    required: true,
    enum: [
      'apartment', 'penthouse', 'villa', 'duplex', 'townhouse', 'studio', 'plot', 'mansion',
      'hotel-apartment', 'sky-villa', 'full-floor', 'half-floor', 'premium-villa',
      'apartment-private-pool', 'studio-pool', 'simplex-sea-views', 'twin-villa',
      'standalone-villa', 'duplex-maid', 'apartment-maid', 'semi-detached', 'suite',
      'sky-mansion', 'villa-basement', 'office', 'commercial',
    ],
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  squareFt: { type: Number, default: 0 },
  completionYear: { type: String, default: '' },
  completionStatus: { type: String, enum: ['off-plan', 'ready-to-move'], default: 'ready-to-move' },
  paymentPlan: {
    downPayment: { type: Number, default: 0 },
    onCompletion: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  images: [{ type: String }],
  floorPlanImages: [{ type: String }],
  amenities: [{ type: String }],
  status: { type: String, enum: ['for-sale', 'for-rent', 'sold', 'pending_review'], default: 'for-sale' },
  isFeatured: { type: Boolean, default: false },
  brochureUrl: { type: String, default: '' },
  brochureDownloadCount: { type: Number, default: 0 },
  hasPendingChanges: { type: Boolean, default: false },
  pendingChanges: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

propertySchema.index({ 'location.emirate': 1, propertyType: 1, completionStatus: 1, price: 1 });
propertySchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Property', propertySchema);
