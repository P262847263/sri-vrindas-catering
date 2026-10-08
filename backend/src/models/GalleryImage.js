const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
module.exports = GalleryImage;
