const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      userId: 'shyam@gmail.com',
      username: 'Shyam',
      mobile: '8197317345',
      password: 'Password123'
    });
    console.log('Status:', res.status, 'Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status, 'data:', err.response.data);
    } else {
      console.error('Request failed:', err.message);
    }
  }
}
run();
