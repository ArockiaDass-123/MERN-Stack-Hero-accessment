require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('registrations');

        const indexes = await collection.indexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        for (const index of indexes) {
            if (index.name !== '_id_') {
                console.log(`Dropping index: ${index.name}`);
                await collection.dropIndex(index.name);
            }
        }

        console.log('Indexes dropped. Mongoose will recreate them on next run.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
