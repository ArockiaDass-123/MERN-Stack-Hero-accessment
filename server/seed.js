require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

const mockEvents = [
    {
        name: "Tech Innovators Summit 2026",
        organizer: "Bellcorp Engineering",
        location: "San Francisco, CA",
        date: new Date("2026-05-15T09:00:00Z"),
        description: "A deep dive into the latest AI and Cloud technologies.",
        capacity: 200,
        availableSeats: 200,
        category: "Technology",
        tags: ["AI", "Cloud", "Future"],
        image: "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Global Music Festival",
        organizer: "Harmony Events",
        location: "Austin, TX",
        date: new Date("2026-06-10T18:00:00Z"),
        description: "Experience the best of world music and local artists.",
        capacity: 500,
        availableSeats: 450,
        category: "Entertainment",
        tags: ["Music", "Festival", "Live"],
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Professional Networking Brunch",
        organizer: "Career Boost",
        location: "New York, NY",
        date: new Date("2026-04-20T10:00:00Z"),
        description: "Connect with industry leaders and like-minded professionals.",
        capacity: 50,
        availableSeats: 15,
        category: "Business",
        tags: ["Networking", "Career", "Brunch"],
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Yoga & Mindfulness Retreat",
        organizer: "Zen Living",
        location: "Bali, Indonesia",
        date: new Date("2026-07-01T08:00:00Z"),
        description: "A week-long journey to inner peace and physical wellness.",
        capacity: 30,
        availableSeats: 5,
        category: "Health",
        tags: ["Yoga", "Zen", "Wellness"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Chef's Table: Modern Fusion",
        organizer: "Culinary Masters",
        location: "London, UK",
        date: new Date("2026-03-12T19:00:00Z"),
        description: "An exclusive dining experience featuring 7 experimental courses.",
        capacity: 20,
        availableSeats: 2,
        category: "Food",
        tags: ["Fine Dining", "Fusion", "Gourmet"],
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Startup Pitch Night",
        organizer: "Venture Capital Hub",
        location: "Berlin, Germany",
        date: new Date("2026-05-02T18:30:00Z"),
        description: "Early-stage startups pitch to a panel of expert investors.",
        capacity: 100,
        availableSeats: 100,
        category: "Business",
        tags: ["Startup", "Pitch", "VC"],
        image: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Digital Art Expo",
        organizer: "Creative Pulse",
        location: "Tokyo, Japan",
        date: new Date("2026-08-15T10:00:00Z"),
        description: "Interactive installations and NFT galleries from global artists.",
        capacity: 150,
        availableSeats: 150,
        category: "Art",
        tags: ["Digital Art", "NFT", "Interactive"],
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Salsa Night in the Plaza",
        organizer: "Dance Community",
        location: "Miami, FL",
        date: new Date("2026-04-12T20:00:00Z"),
        description: "Free beginner lesson followed by open dancing under the stars.",
        capacity: 300,
        availableSeats: 300,
        category: "Entertainment",
        tags: ["Dance", "Salsa", "Social"],
        image: "https://images.unsplash.com/photo-1524156869117-e9608e0b57e0?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "AI for Sustainability Workshop",
        organizer: "Green Tech Initiative",
        location: "Seattle, WA",
        date: new Date("2026-03-30T13:00:00Z"),
        description: "Hands-on workshop on using ML models for climate solutions.",
        capacity: 40,
        availableSeats: 40,
        category: "Technology",
        tags: ["AI", "GreenTech", "Workshop"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "The History of Coffee: Tasting Tour",
        organizer: "Roasters Coop",
        location: "Addis Ababa, Ethiopia",
        date: new Date("2026-09-20T11:00:00Z"),
        description: "Trace the origins of coffee with expert-guided cupping sessions.",
        capacity: 15,
        availableSeats: 8,
        category: "Food",
        tags: ["Coffee", "Tasting", "Origins"],
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Future Cities Hackathon",
        organizer: "Urban Tech",
        location: "Berlin, Germany",
        date: new Date("2026-10-05T09:00:00Z"),
        description: "Build the future of urban living in this 48-hour hackathon.",
        capacity: 100,
        availableSeats: 100,
        category: "Technology",
        tags: ["Hackathon", "UrbanTech", "Coding"],
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Indie Rock Night",
        organizer: "Record Shop",
        location: "London, UK",
        date: new Date("2026-03-25T20:00:00Z"),
        description: "Local indie bands showcase their latest hits.",
        capacity: 80,
        availableSeats: 50,
        category: "Entertainment",
        tags: ["Rock", "Indie", "Live Music"],
        image: "https://images.unsplash.com/photo-1514525253361-bee2fd3c6052?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "E-commerce Strategy Workshop",
        organizer: "Retail Experts",
        location: "Austin, TX",
        date: new Date("2026-04-15T10:00:00Z"),
        description: "Learn how to scale your online business from industry leaders.",
        capacity: 60,
        availableSeats: 60,
        category: "Business",
        tags: ["E-commerce", "Strategy", "Retail"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Mediterranean Cooking Class",
        organizer: "Olive & Vine",
        location: "Athens, Greece",
        date: new Date("2026-11-12T18:30:00Z"),
        description: "Master the art of healthy and delicious Mediterranean cuisine.",
        capacity: 25,
        availableSeats: 12,
        category: "Food",
        tags: ["Cooking", "Healthy", "Mediterranean"],
        image: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=800"
    },
    // Past events for history testing
    {
        name: "2024 Tech Expo",
        organizer: "Global Events",
        location: "San Francisco, CA",
        date: new Date("2024-11-20T10:00:00Z"),
        description: "Looking back at the tech that defined 2024.",
        capacity: 1000,
        availableSeats: 0,
        category: "Technology",
        tags: ["Expo", "History", "Archive"],
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Winter Jazz Night 2024",
        organizer: "Jazz Club",
        location: "New York, NY",
        date: new Date("2024-12-15T19:00:00Z"),
        description: "A cozy evening of jazz in the heart of the city.",
        capacity: 100,
        availableSeats: 0,
        category: "Entertainment",
        tags: ["Jazz", "Winter", "Music"],
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Mindfulness Summit 2025",
        organizer: "Peace Org",
        location: "Seattle, WA",
        date: new Date("2025-01-10T09:00:00Z"),
        description: "Start the year with clarity and focus.",
        capacity: 200,
        availableSeats: 0,
        category: "Health",
        tags: ["Mindfulness", "Summit", "2025"],
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Art Basel 2024",
        organizer: "Art World",
        location: "Miami, FL",
        date: new Date("2024-12-05T10:00:00Z"),
        description: "The premier art show for modern and contemporary art.",
        capacity: 5000,
        availableSeats: 0,
        category: "Art",
        tags: ["Art", "Basel", "Modern"],
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "International Food Fair 2024",
        organizer: "World Flavors",
        location: "San Francisco, CA",
        date: new Date("2024-10-15T11:00:00Z"),
        description: "Taste the world in one place.",
        capacity: 3000,
        availableSeats: 0,
        category: "Food",
        tags: ["Food", "Fair", "Global"],
        image: "https://images.unsplash.com/photo-1488459711612-da6793616236?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Blockchain Revolution 2024",
        organizer: "Crypto Hub",
        location: "Berlin, Germany",
        date: new Date("2024-09-20T09:00:00Z"),
        description: "The impact of blockchain on every industry.",
        capacity: 500,
        availableSeats: 0,
        category: "Technology",
        tags: ["Blockchain", "Crypto", "Future"],
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        await Event.deleteMany({});
        console.log('Existing events cleared.');

        await Event.insertMany(mockEvents);
        console.log('Mock events seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
