const axios = require('axios');
(async () => {
  try {
    const base = 'http://localhost:3000/api';
    const u = Date.now();
    console.log('signup...');
    const signup = await axios.post(base + '/auth/signup', { userId: 'test' + u, username: 'test' + u, mobile: '9999999999', password: 'password' });
    console.log('signup response:', signup.data);
    console.log('login...');
    const login = await axios.post(base + '/auth/login', { username: 'test' + u, password: 'password' });
    console.log('login response:', login.data);
    const token = login.data.token;
    console.log('placing order...');
    const order = await axios.post(base + '/orders', { items: [{ name: 'Veg Pulao', quantity: 2, category: 'Main Course' }], customerName: 'Auto Test', phoneNumber: '9999999999', whatsapp: '9999999999' }, { headers: { Authorization: 'Bearer ' + token } });
    console.log('order response:', order.data);
  } catch (e) {
      const err = e;
      if (err && err.response) {
        console.error('error status:', err.response.status);
        console.error('error data:', JSON.stringify(err.response.data));
      } else {
        console.error('error message:', err.message || err);
      }
    process.exit(1);
  }
})();
