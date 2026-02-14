require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const events = await Event.find({}, 'name _id availableSeats');
        console.log('Current Events in DB:');
        events.forEach(e => {
            console.log(`- ${e.name} (ID: ${e._id}, Seats: ${e.availableSeats})`);
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
