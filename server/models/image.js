import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
});

// Static method to get unique categories
imageSchema.statics.getUniqueCategories = async function() {
  return this.distinct('category');
};

// Static method to find images by category
imageSchema.statics.findByCategory = async function(category, limit) {
  return this.find({ category, isActive: true })
    .limit(limit)
    .select('_id url category');
};

export const imageModel = mongoose.model('Image', imageSchema);