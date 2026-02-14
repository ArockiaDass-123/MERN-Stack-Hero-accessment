const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Get all events with search and filters
router.get('/', async (req, res) => {
    try {
        const { search, category, location, date } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { organizer: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (location) query.location = location;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const events = await Event.find(query);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single event with registration status
router.get('/:id', optionalProtect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        let isRegistered = false;
        if (req.user) {
            const registration = await Registration.findOne({
                user: req.user._id,
                event: event._id
            });
            isRegistered = !!registration;
        }

        res.json({ ...event._doc, isRegistered });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Register for an event
router.post('/:id/register', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'Event sold out' });
        }

        const alreadyRegistered = await Registration.findOne({
            user: req.user._id,
            event: event._id
        });

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        const registration = await Registration.create({
            user: req.user._id,
            event: event._id
        });

        if (registration) {
            event.availableSeats -= 1;
            await event.save();
            res.status(201).json({ message: 'Successfully registered' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Cancel registration
router.post('/:id/cancel', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const registration = await Registration.findOneAndDelete({
            user: req.user._id,
            event: req.params.id
        });

        if (registration) {
            const event = await Event.findById(req.params.id);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
            res.json({ message: 'Registration cancelled' });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ message: 'Cancellation failed', error: error.message });
    }
});

// Get user registrations (Dashboard)
router.get('/user/my-events', protect, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id }).populate('event');
        // Filter out null events in case an event was deleted but registration remains
        const events = registrations
            .filter(reg => reg.event !== null)
            .map(reg => reg.event);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Fetch failed' });
    }
});

module.exports = router;
