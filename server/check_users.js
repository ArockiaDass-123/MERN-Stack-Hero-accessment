require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'name email');
        console.log('Current Users in DB:');
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email})`);
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
