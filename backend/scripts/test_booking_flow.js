const axios = require('axios');
(async () => {
  try {
    const BASE = 'http://127.0.0.1:3000/api';
    // Signup (ignore errors if user exists)
    try {
      const s = await axios.post(`${BASE}/auth/signup`, { userId: 'tester1', username: 'Tester One', mobile: '+911234567890', password: 'testpass' });
      console.log('Signup:', s.status);
    } catch (e) {
      if (e.response) console.log('Signup response:', e.response.status, e.response.data);
      else console.log('Signup error', e.message);
    }

    // Login
    const login = await axios.post(`${BASE}/auth/login`, { username: 'tester1', password: 'testpass' });
    const token = login.data && login.data.token;
    console.log('Login token:', !!token);

    const client = axios.create({ baseURL: BASE, headers: { Authorization: `Bearer ${token}` } });

    // Create booking
    const bookingPayload = {
      items: [{ name: 'Paneer Butter Masala', quantity: 2, price: 200 }],
      customerName: 'Tester One',
      phoneNumber: '+911234567890',
      address: 'Test address',
      numPeople: 4
    };
    const created = await client.post('/bookings', bookingPayload);
    console.log('Create booking status:', created.status);
    console.log('Created booking id:', created.data && created.data._id);

    // Get my bookings
    const mine = await client.get('/bookings/my');
    console.log('My bookings count:', Array.isArray(mine.data) ? mine.data.length : 'unexpected');
    console.log(JSON.stringify(mine.data, null, 2));
  } catch (err) {
    console.error('Test flow failed', err.response ? err.response.data || err.response.statusText : err.message);
    process.exit(2);
  }
})();
