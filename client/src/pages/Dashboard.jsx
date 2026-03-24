import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { Clock, History, CalendarDays, XCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendationsLoading, setRecommendationsLoading] = useState(true);
    const [hasHistory, setHasHistory] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchMyEvents();
        if (user?._id) {
            fetchRecommendations();
        }
    }, [user?._id]);

    const fetchMyEvents = async () => {
        try {
            const data = await eventService.getMyEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching my events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        try {
            setRecommendationsLoading(true);
            const data = await eventService.getRecommendations(user._id);
            if (data.hasHistory) {
                setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
                setHasHistory(true);
            } else {
                setRecommendations([]);
                setHasHistory(false);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
            setHasHistory(false);
        } finally {
            setRecommendationsLoading(false);
        }
    };

    const today = new Date();
    const safeEvents = Array.isArray(events) ? events : [];
    const upcomingEvents = safeEvents.filter(e => e && e.date && new Date(e.date) >= today);
    const pastEvents = safeEvents.filter(e => e && e.date && new Date(e.date) < today);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><div className="spinner"></div></div>;

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>User Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Here are your registered events.</p>
            </div>

            {/* AI Recommendations Section */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.5rem' }}>
                    <Sparkles size={24} color="var(--primary)" /> Recommended for You
                </h2>

                {recommendationsLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : hasHistory ? (
                    recommendations.length > 0 ? (
                        <div className="grid grid-cols-3">
                            {recommendations.map(event => (
                                <div key={event._id}>
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No matching recommendations found. Check back later!</p>
                        </div>
                    )
                ) : (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>Register for events to get personalized recommendations</p>
                    </div>
                )}
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.5rem' }}>
                    <CalendarDays size={24} color="var(--primary)" /> Upcoming Events Summary
                </h2>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-3">
                        {upcomingEvents.map(event => (
                            <div key={event._id} style={{ position: 'relative' }}>
                                <EventCard event={event} />
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to cancel?')) {
                                            await eventService.cancel(event._id);
                                            fetchMyEvents();
                                        }
                                    }}
                                    style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'var(--error)', color: 'white', padding: '0.5rem', borderRadius: '50%', zIndex: 10 }}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No upcoming events registered.</p>
                    </div>
                )}
            </section>

            <section>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.5rem' }}>
                    <History size={24} color="var(--text-muted)" /> Past Event History
                </h2>
                {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-3" style={{ opacity: 0.7 }}>
                        {pastEvents.map(event => <EventCard key={event._id} event={event} />)}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No past event history found.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
