import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default mongoose.model('Urls', UrlSchema);
