const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const Admin = require(path.join(__dirname, 'src', 'models', 'Admin'));
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sri-vrindas';

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: node check_admin_creds.js <username> <password>');
    process.exit(1);
  }

  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found for username:', username);
      process.exitCode = 2;
      return;
    }
    console.log('Found admin:', { id: admin._id.toString(), username: admin.username });
    const match = await bcrypt.compare(password, admin.password);
    console.log('Password match:', match);
  } catch (err) {
    console.error('Error checking credentials:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
