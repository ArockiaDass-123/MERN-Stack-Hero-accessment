require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetPassword(email, newPassword) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }
        user.password = newPassword;
        await user.save();
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

const email = process.argv[2];
const password = process.argv[3] || 'password123';

if (!email) {
    console.log('Usage: node reset_password.js <email> [new_password]');
    process.exit(1);
}

resetPassword(email, password);
