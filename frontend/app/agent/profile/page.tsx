'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, UpdateProfilePayload } from '@/lib/agentApi';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AgentProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const [form, setForm] = useState({
        name: '',
        phone: '',
        photo: '',
        languages: '',
        specialization: '',
        bio: '',
    });

    // Load current profile
    useEffect(() => {
        api.get('/auth/me').then(({ data }) => {
            const u = data.user;
            const agentId = u.id || u._id;

            if (!agentId) {
                console.error('No agent ID found for user');
                setLoading(false);
                return;
            }

            // Also fetch full agent data from the agents endpoint
            api.get(`/agents/${agentId}`).then(({ data: agentData }) => {
                const a = agentData.agent;
                setForm({
                    name: a.name || '',
                    phone: a.phone || '',
                    photo: a.photo || '',
                    languages: (a.languages || []).join(', '),
                    specialization: a.specialization || '',
                    bio: a.bio || '',
                });
                setLoading(false);
            }).catch(() => {
                // Fallback to user data
                setForm((prev) => ({ ...prev, name: u.name || '', }));
                setLoading(false);
            });
        }).catch(() => setLoading(false));
    }, []);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFeedback(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setFeedback(null);
        try {
            const payload: UpdateProfilePayload = {
                name: form.name,
                phone: form.phone,
                photo: form.photo,
                languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
                specialization: form.specialization,
                bio: form.bio,
            };
            await updateProfile(payload);
            setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
        } catch (err: any) {
            setFeedback({ type: 'error', msg: err?.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#c9a84c' }} />
            </div>
        );
    }

    const inputStyle = {
        background: '#1a1f2e',
        border: '1px solid #2e3446',
        color: '#e6edf3',
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#e6edf3' }}>My Profile</h1>
            <p className="text-sm mb-8" style={{ color: '#8892a4' }}>Update your personal info and photo</p>

            {/* Photo preview */}
            {form.photo && (
                <div className="mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2" style={{ borderColor: '#c9a84c' }}>
                        <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}

            <div className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Full Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Phone Number</label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+971 54 000 0000"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                    />
                </div>

                {/* Photo URL */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Photo URL</label>
                    <input
                        type="url"
                        value={form.photo}
                        onChange={(e) => handleChange('photo', e.target.value)}
                        placeholder="https://example.com/my-photo.jpg"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                    />
                    <p className="text-xs mt-1" style={{ color: '#8892a4' }}>Paste a direct URL to your profile photo</p>
                </div>

                {/* Languages */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Languages</label>
                    <input
                        type="text"
                        value={form.languages}
                        onChange={(e) => handleChange('languages', e.target.value)}
                        placeholder="English, Arabic, Hindi"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                    />
                    <p className="text-xs mt-1" style={{ color: '#8892a4' }}>Comma-separated list of languages you speak</p>
                </div>

                {/* Specialization */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Specialization</label>
                    <input
                        type="text"
                        value={form.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        placeholder="Luxury Villas, Off-Plan Properties, etc."
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Tell visitors about yourself and your experience..."
                        rows={4}
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
                        style={inputStyle}
                    />
                </div>

                {/* Feedback */}
                {feedback && (
                    <div
                        className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
                        style={{
                            background: feedback.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(231,76,60,0.12)',
                            border: `1px solid ${feedback.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(231,76,60,0.3)'}`,
                            color: feedback.type === 'success' ? '#22c55e' : '#e74c3c',
                        }}
                    >
                        {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {feedback.msg}
                    </div>
                )}

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
                    style={{ background: '#c9a84c', color: '#1a1f2e' }}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving…' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
}
