import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    const isSoldOut = event.availableSeats <= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ position: 'relative', height: '200px' }}>
                <img
                    src={event.image || 'https://via.placeholder.com/400x200?text=Event'}
                    alt={event.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'var(--glass)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                    border: '1px solid var(--glass-border)'
                }}>
                    {event.category}
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1 }}>
                    {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                </p>

                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <Calendar size={16} color="var(--primary)" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span>{event.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <Users size={16} color="var(--primary)" />
                        <span style={{ color: isSoldOut ? 'var(--error)' : 'inherit' }}>
                            {isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}
                        </span>
                    </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {event.tags.map(tag => (
                            <span key={tag} style={{
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.6rem',
                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                color: 'var(--text-muted)',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)'
                            }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <Link to={`/event/${event._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    View Details <ChevronRight size={18} />
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
