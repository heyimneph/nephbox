import React, { useState } from 'react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Basic validation
    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('Please fill out all fields.');
            return false;
        }
        // Simple email regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError('Please enter a valid email address.');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSuccess('Message sent! I’ll get back to you soon.');
                setForm({ name: '', email: '', message: '' });
            } else {
                setError('Failed to send. Please try again later.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        }
        setLoading(false);
    };

    return (
        <section id="contact" className={styles['contact-section']}>
            <h2>Contact</h2>
            <form className={styles['contact-form']} onSubmit={handleSubmit} autoComplete="off">
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </label>
                <label>
                    Message
                    <textarea
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message'}
                </button>
                {error && <div className={styles['form-error']}>{error}</div>}
                {success && <div className={styles['form-success']}>{success}</div>}
            </form>
        </section>
    );
}
