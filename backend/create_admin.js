const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load Admin model from backend src
const Admin = require(path.join(__dirname, 'src', 'models', 'Admin'));

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sri-vrindas';

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: node create_admin.js <username> <password>');
    process.exit(1);
  }

  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await Admin.findOneAndUpdate(
      { username },
      { username, password: hash, isSuperAdmin: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Admin upserted:', { id: result._id.toString(), username: result.username });
    console.log('You can now sign in at /admin-login with the credentials you provided.');
  } catch (err) {
    console.error('Failed to create admin:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
