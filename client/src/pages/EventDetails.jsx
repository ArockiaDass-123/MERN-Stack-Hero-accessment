import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, Info, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const data = await eventService.getEvent(id);
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
            setStatus({ type: 'error', message: 'Failed to load event details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        setStatus({ type: '', message: '' });

        try {
            await eventService.register(id);
            setStatus({ type: 'success', message: 'You have successfully registered!' });
            fetchEvent();
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Registration failed.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async () => {
        setRegistering(true);
        setStatus({ type: '', message: '' });

        try {
            await eventService.cancel(id);
            setStatus({ type: 'success', message: 'Registration cancelled.' });
            fetchEvent();
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Cancellation failed.' });
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><div className="spinner"></div></div>;
    if (!event) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Event not found</h2></div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="fade-in">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline"
                style={{ border: 'none', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}
            >
                <ArrowLeft size={18} /> Back to browsing
            </button>

            <div className="grid grid-cols-2" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                            {event.category}
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>{event.name}</h1>

                        <div className="glass-card" style={{ padding: '2rem', display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Calendar size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 600 }}>Date & Time</p>
                                    <p style={{ color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleString()}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MapPin size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 600 }}>Location</p>
                                    <p style={{ color: 'var(--text-muted)' }}>{event.location}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Users size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 600 }}>Availability</p>
                                    <p style={{ color: isSoldOut ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                                        {isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{event.description}</p>
                    </motion.div>
                </div>

                <div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'sticky', top: '7rem' }}>
                        <div style={{ height: '300px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
                            <img src={event.image} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            {status.message && (
                                <div style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', backgroundColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--success)' : 'var(--error)' }}>
                                    {status.message}
                                </div>
                            )}
                            <button
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    backgroundColor: event.isRegistered ? 'var(--error)' : 'var(--primary)',
                                    opacity: registering ? 0.7 : 1
                                }}
                                disabled={(!event.isRegistered && isSoldOut) || registering}
                                onClick={event.isRegistered ? handleUnregister : handleRegister}
                            >
                                {registering ? 'Processing...' :
                                    !user ? 'Login to Register' :
                                        event.isRegistered ? 'Unregister' :
                                            isSoldOut ? 'Sold Out' : 'Register Now'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
