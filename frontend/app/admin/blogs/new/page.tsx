'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createBlogPost } from '@/lib/adminApi';

const CATEGORIES = ['Market Insights', 'Investment', 'Lifestyle', 'News', 'Tips & Guides'];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    author: 'Awtad Real Estate Editorial',
    category: 'Market Insights',
    tags: '',
    content: '',
    isFeatured: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const autoSlug = title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    setForm((prev) => ({ ...prev, title, slug: autoSlug }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isFeatured: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createBlogPost({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        publishedAt: new Date().toISOString(),
      });
      router.push('/admin/blogs');
    } catch {
      setError('Failed to create blog post. The slug may already be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: '#1a1f2e',
    border: '1px solid #2e3446',
    color: '#e6edf3',
    borderRadius: 8,
    padding: '8px 12px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties;

  const labelStyle = { color: '#8892a4', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/blogs" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: '#8892a4' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <span style={{ color: '#2e3446' }}>|</span>
        <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl p-6" style={{ background: '#242938', border: '1px solid #2e3446' }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input name="title" value={form.title} onChange={handleTitleChange} required placeholder="Post title" style={inputStyle} />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required placeholder="url-friendly-slug" style={inputStyle} />
          <p className="text-xs mt-1" style={{ color: '#8892a4' }}>Auto-generated from title. Must be unique.</p>
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short summary shown in the blog listing..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Cover Image */}
        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." style={inputStyle} />
        </div>

        {/* Author + Category row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Author</label>
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="dubai, investment, property (comma-separated)" style={inputStyle} />
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>Content *</label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={12} placeholder="Write your blog post content here..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
          <p className="text-xs mt-1" style={{ color: '#8892a4' }}>Each line break becomes a new paragraph on the public site.</p>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={handleCheckbox} className="w-4 h-4 rounded" style={{ accentColor: '#c9a84c' }} />
          <label htmlFor="isFeatured" className="text-sm cursor-pointer" style={{ color: '#e6edf3' }}>Mark as featured post</label>
        </div>

        {error && <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: '#c9a84c', color: '#1a1f2e' }}
          >
            {submitting ? 'Publishing…' : 'Publish Post'}
          </button>
          <Link
            href="/admin/blogs"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ background: '#1a1f2e', border: '1px solid #2e3446', color: '#8892a4' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
