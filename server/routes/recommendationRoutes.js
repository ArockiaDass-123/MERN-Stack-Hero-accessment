const express = require('express');
const router = express.Router();
const { Anthropic } = require('@anthropic-ai/sdk');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Get AI-powered event recommendations for a user
router.get('/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify that the user is requesting their own recommendations
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Fetch user's registration history
        const registrations = await Registration.find({ user: userId }).populate('event');
        
        // If no history, return message
        if (registrations.length === 0) {
            return res.json({
                hasHistory: false,
                message: 'Register for events to get personalized recommendations',
                recommendations: []
            });
        }

        // Extract past events from registrations
        const pastEvents = registrations
            .map(reg => reg.event)
            .filter(event => event && new Date(event.date) < new Date());

        // If no past events, return message
        if (pastEvents.length === 0) {
            return res.json({
                hasHistory: false,
                message: 'Attend events to get better personalized recommendations',
                recommendations: []
            });
        }

        // Build history string for Claude
        const eventHistory = pastEvents
            .map(event => `
Title: ${event.name}
Category: ${event.category}
Description: ${event.description}
Tags: ${event.tags.join(', ')}
            `.trim())
            .join('\n---\n');

        // Fetch all upcoming events
        const now = new Date();
        const upcomingEvents = await Event.find({
            date: { $gte: now }
        });

        if (upcomingEvents.length === 0) {
            return res.json({
                hasHistory: true,
                message: 'No upcoming events available',
                recommendations: []
            });
        }

        // Build upcoming events list for Claude
        const upcomingEventsList = upcomingEvents
            .map(event => `
ID: ${event._id}
Title: ${event.name}
Category: ${event.category}
Description: ${event.description}
Tags: ${event.tags.join(', ')}
            `.trim())
            .join('\n---\n');

        // Call Claude API for recommendations
        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20250805',
            max_tokens: 1024,
            system: `You are an event recommendation agent. Based on the user's past event registrations, identify their top 2-3 interest categories. Then from the list of all upcoming events provided, return the top 5 most relevant event IDs as a JSON array. Only return the JSON array, nothing else. Format: ["eventId1", "eventId2", "eventId3", "eventId4", "eventId5"]`,
            messages: [
                {
                    role: 'user',
                    content: `Past events attended:
${eventHistory}

Upcoming events available:
${upcomingEventsList}

Based on the user's past registrations, recommend the top 5 most relevant upcoming events.`
                }
            ]
        });

        // Parse Claude's response
        let recommendedIds = [];
        try {
            const responseText = message.content[0].text;
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[.*\]/s);
            if (jsonMatch) {
                recommendedIds = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('Error parsing Claude response:', parseError);
            return res.status(500).json({ message: 'Error processing recommendations' });
        }

        // Fetch the recommended event objects
        const recommendedEvents = [];
        for (const id of recommendedIds) {
            try {
                const event = await Event.findById(id);
                if (event) {
                    recommendedEvents.push(event);
                }
            } catch (error) {
                console.error(`Error fetching event ${id}:`, error);
            }
        }

        res.json({
            hasHistory: true,
            recommendations: recommendedEvents
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
});

module.exports = router;
