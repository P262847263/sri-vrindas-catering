const mongoose = require('mongoose');
const User = require('./src/models/User.js');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sri-vrindas';

async function main() {
  await mongoose.connect(MONGO_URI);
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node check_user.js <userId>');
    process.exit(2);
  }
  const user = await User.findOne({ userId }).lean();
  if (!user) {
    console.log('No user with userId:', userId);
  } else {
    console.log('Found user:', { userId: user.userId, username: user.username, mobile: user.mobile, _id: user._id });
  }
  mongoose.connection.close();
}

main().catch(err => { console.error(err); process.exit(1); });
