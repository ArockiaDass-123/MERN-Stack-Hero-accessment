require('dotenv').config();
const mongoose = require('mongoose');

async function fixUserIndexes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const User = mongoose.connection.collection('users');

        console.log('Current indexes:');
        const indexes = await User.indexes();
        console.log(JSON.stringify(indexes, null, 2));

        console.log('\nDropping username index if it exists...');
        try {
            await User.dropIndex('username_1');
            console.log('Dropped username_1 index');
        } catch (err) {
            console.log('No username_1 index to drop:', err.message);
        }

        console.log('\nFinal indexes:');
        const finalIndexes = await User.indexes();
        console.log(JSON.stringify(finalIndexes, null, 2));

        await mongoose.connection.close();
        console.log('\nDone!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUserIndexes();
