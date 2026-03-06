'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitBlogPost, AgentBlogPayload } from '@/lib/agentApi';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORIES = ['Market Insights', 'Investment', 'Lifestyle', 'News', 'Tips & Guides'];

export default function AgentNewBlogPage() {
  const router = useRouter();
  const { palette } = useTheme();
  const { user } = useAuth();

  const [form, setForm] = useState<AgentBlogPayload>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    author: user?.name || '',
    category: 'Market Insights',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (field: keyof AgentBlogPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload: AgentBlogPayload = {
        ...form,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await submitBlogPost(payload);
      setSuccess('Your blog post has been submitted for admin review.');
      setTimeout(() => router.replace('/agent/blogs'), 1800);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit post.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: palette.inputBg || palette.cardBg,
    border: `1px solid ${palette.border}`,
    color: palette.textPrimary,
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties;

  const labelStyle = { color: palette.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' } as React.CSSProperties;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Submit Blog Post</h1>
        <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>
          Your post will be reviewed by an admin before going live.
        </p>
      </div>

      {success && (
        <div
          className="mb-4 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Enter a compelling title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="A short summary (shown in blog listings)"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input
            style={inputStyle}
            value={form.coverImage}
            onChange={(e) => set('coverImage', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Author & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Author</label>
            <input
              style={inputStyle}
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={inputStyle}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            style={inputStyle}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Dubai, Investment, Luxury"
          />
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>Content *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 280, fontFamily: 'monospace' }}
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder="Write your article here. Each line break will be treated as a new paragraph."
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: palette.gold, color: '#1a1f2e' }}
          >
            {submitting ? 'Submitting…' : 'Submit for Review'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
            style={{ background: 'transparent', border: `1px solid ${palette.border}`, color: palette.textSecondary }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
