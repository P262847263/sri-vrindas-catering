const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({}, { strict: false, timestamps: false });

module.exports = mongoose.model('Record', recordSchema);
