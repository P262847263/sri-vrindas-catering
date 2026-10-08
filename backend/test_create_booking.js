const axios = require('axios');

const BASE = 'http://127.0.0.1:3000/api';
const user = {
  userId: 'shyam@gmail.com',
  username: 'Shyam',
  mobile: '8197317345',
  password: 'Password123'
};

async function run() {
  try {
    // Try signup (ignore if exists)
    try {
      const s = await axios.post(`${BASE}/auth/signup`, {
        userId: user.userId,
        username: user.username,
        mobile: user.mobile,
        password: user.password
      });
      console.log('Signup response:', s.status, s.data);
    } catch (e) {
      if (e.response) console.warn('Signup warning:', e.response.status, e.response.data);
      else console.warn('Signup error:', e.message);
    }

    // Login
    const loginRes = await axios.post(`${BASE}/auth/login`, { username: user.userId, password: user.password });
    console.log('Login response status:', loginRes.status);
    const token = loginRes.data.token;
    if (!token) {
      console.error('No token received, cannot create booking');
      return;
    }

    const headers = { headers: { Authorization: `Bearer ${token}` } };

    // Create booking
    const bookingPayload = {
      items: [{ name: 'Test Dish', quantity: 2, category: 'Test' }],
      customerName: 'Shyam Tester',
      phoneNumber: '8197317345',
      address: 'Test Address',
      eventDate: new Date().toISOString(),
      numPeople: 3
    };

    const bRes = await axios.post(`${BASE}/bookings`, bookingPayload, headers);
    console.log('Booking created:', bRes.status, bRes.data);

    // Fetch my bookings
    const myRes = await axios.get(`${BASE}/bookings/my`, headers);
    console.log('My bookings:', myRes.status, myRes.data);
  } catch (err) {
    if (err.response) console.error('Failed:', err.response.status, err.response.data);
    else console.error('Request failed:', err.message);
  }
}

run();
