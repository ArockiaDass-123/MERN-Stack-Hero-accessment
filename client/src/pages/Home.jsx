import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, MapPin, Calendar } from 'lucide-react';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync filters with URL params
    const filters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        location: searchParams.get('location') || '',
        date: searchParams.get('date') || ''
    };

    const categories = ['Technology', 'Entertainment', 'Business', 'Health', 'Food', 'Art'];
    const locations = ['San Francisco, CA', 'Austin, TX', 'New York, NY', 'Bali, Indonesia', 'London, UK', 'Berlin, Germany', 'Tokyo, Japan', 'Miami, FL', 'Seattle, WA', 'Addis Ababa, Ethiopia'];

    useEffect(() => {
        fetchEvents();
    }, [searchParams]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventService.getEvents(filters);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        if (e.target.value) {
            newParams.set(e.target.name, e.target.value);
        } else {
            newParams.delete(e.target.name);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem'
                }}>
                    <Sparkles size={16} /> Discover Extraordinary Experiences
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Connect with the <span style={{ color: 'var(--primary)' }}>Events</span> That Matter to You
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Explore a curated collection of tech summits, music festivals, networking sessions, and creative workshops worldwide.
                </p>
            </section>

            {/* Search & Filters */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search events..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'var(--text)'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Filter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'var(--text)',
                                appearance: 'none'
                            }}
                        >
                            <option value="">Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <MapPin style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'var(--text)',
                                appearance: 'none'
                            }}
                        >
                            <option value="">Locations</option>
                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Calendar style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'var(--text)',
                                appearance: 'none'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Event Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading events...</p>
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-3">
                    {events.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h3>No events found matching your criteria</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try clearing your filters or searching for something else.</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1.5rem' }}
                        onClick={() => setSearchParams({})}
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
