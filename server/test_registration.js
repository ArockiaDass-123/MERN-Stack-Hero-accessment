require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOne({ name: 'vinith' });
        const event = await Event.findOne({ name: /Yoga/i });

        if (!user || !event) {
            console.log('User or Event not found');
            process.exit(1);
        }

        console.log(`Testing registration for User: ${user.name} and Event: ${event.name}`);

        // Check if already registered
        const existing = await Registration.findOne({ user: user._id, event: event._id });
        if (existing) {
            console.log('User already registered. Deleting registration to test fresh...');
            await Registration.deleteOne({ _id: existing._id });
        }

        // Attempt registration
        const registration = await Registration.create({
            user: user._id,
            event: event._id
        });

        if (registration) {
            console.log('Registration success in script!');
            // Simulate count update
            event.availableSeats -= 1;
            await event.save();
            console.log('Event seat update success!');
        }

        process.exit();
    } catch (err) {
        console.error('Registration test FAILED:');
        console.error(err);
        process.exit(1);
    }
}
test();
