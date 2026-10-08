const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String },
  mobile: { type: String },
  password: { type: String, required: true },
  // saved favorites: array of MenuItem ObjectIds
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
