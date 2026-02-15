const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing registration endpoint...');
        const response = await axios.post('https://mern-stack-hero-accessment.onrender.com/api/auth/signup', {
            name: 'Test User',
            email: 'testuser' + Date.now() + '@example.com',
            password: 'Test123!'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testRegistration();
