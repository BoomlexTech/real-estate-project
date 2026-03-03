'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAdminBlogPost, updateBlogPost, AdminBlogPost } from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

const CATEGORIES = ['Market Insights', 'Investment', 'Lifestyle', 'News', 'Tips & Guides'];

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { palette } = useTheme();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    author: '',
    category: 'Market Insights',
    tags: '',
    content: '',
    isFeatured: false,
  });

  useEffect(() => {
    getAdminBlogPost(id)
      .then((post: AdminBlogPost) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          coverImage: post.coverImage || '',
          author: post.author,
          category: post.category,
          tags: (post.tags || []).join(', '),
          content: post.content,
          isFeatured: post.isFeatured,
        });
      })
      .catch(() => setError('Failed to load blog post.'))
      .finally(() => setLoading(false));
  }, [id]);

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
      await updateBlogPost(id, {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      router.push('/admin/blogs');
    } catch {
      setError('Failed to update blog post.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: palette.inputBg,
    border: `1px solid ${palette.border}`,
    color: palette.textPrimary,
    borderRadius: 8,
    padding: '8px 12px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties;

  const labelStyle = { color: palette.textSecondary, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/blogs" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: palette.textSecondary }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <span style={{ color: palette.border }}>|</span>
        <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Edit Blog Post</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 rounded-xl" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
        </div>
      ) : error && !form.title ? (
        <div className="flex items-center justify-center h-48 rounded-xl" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl p-6" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Post title" style={inputStyle} />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required placeholder="url-friendly-slug" style={inputStyle} />
            <p className="text-xs mt-1" style={{ color: palette.textSecondary }}>Changing the slug will break existing links to this post.</p>
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

          {/* Author + Category */}
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
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={handleCheckbox} className="w-4 h-4 rounded" style={{ accentColor: palette.gold }} />
            <label htmlFor="isFeatured" className="text-sm cursor-pointer" style={{ color: palette.textPrimary }}>Mark as featured post</label>
          </div>

          {error && <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: palette.gold, color: palette.pageBg }}
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <Link
              href="/admin/blogs"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ background: palette.inputBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
