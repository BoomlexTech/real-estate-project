'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, RefreshCw, Plus, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  getAdminBlogPosts, deleteAdminBlogPost, getAdminPendingBlogs,
  approveBlog, rejectBlog, AdminBlogPost,
} from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminBlogsPage() {
  const { palette } = useTheme();

  // — Published posts —
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // — Pending submissions —
  const [pendingPosts, setPendingPosts] = useState<AdminBlogPost[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminBlogPosts();
      setPosts(res.data.filter((p) => p.status !== 'pending'));
    } catch {
      setError('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await getAdminPendingBlogs();
      setPendingPosts(res);
    } finally {
      setPendingLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); fetchPending(); }, [fetchPosts, fetchPending]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteAdminBlogPost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      await approveBlog(id);
      setPendingPosts((prev) => prev.filter((p) => p._id !== id));
      fetchPosts();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '_reject');
    try {
      await rejectBlog(id);
      setPendingPosts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── Section A: Pending Blog Submissions ──────────── */}
      {(pendingLoading || pendingPosts.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} style={{ color: '#eab308' }} />
            <h2 className="text-base font-semibold" style={{ color: palette.textPrimary }}>
              Pending Blog Submissions
            </h2>
            {!pendingLoading && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}
              >
                {pendingPosts.length}
              </span>
            )}
          </div>

          {pendingLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#eab308', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingPosts.map((post) => {
                const isActing = actionLoading === post._id + '_approve' || actionLoading === post._id + '_reject';
                return (
                  <div
                    key={post._id}
                    className="rounded-xl p-5"
                    style={{ background: palette.cardBg, border: '1px solid rgba(234,179,8,0.3)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: palette.textPrimary }}>{post.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>
                          By {post.submittedByName || post.author} &middot; {post.category} &middot; Submitted {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        {post.excerpt && (
                          <p className="text-xs mt-2 line-clamp-2" style={{ color: palette.textSecondary }}>{post.excerpt}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(post._id)}
                          disabled={isActing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(post._id)}
                          disabled={isActing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Section B: Published Blog Posts ──────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold" style={{ color: palette.textPrimary }}>Published Posts</h2>
            <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>Create, edit, and delete blog articles</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { fetchPosts(); fetchPending(); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
              style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <Link
              href="/admin/blogs/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: palette.gold, color: palette.pageBg }}
            >
              <Plus size={14} /> New Post
            </Link>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <p className="text-sm" style={{ color: palette.textSecondary }}>No published blog posts yet.</p>
              <Link
                href="/admin/blogs/new"
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: palette.gold, color: palette.pageBg }}
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                    {['Title', 'Category', 'Author', 'Featured', 'Published', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="font-medium line-clamp-1" style={{ color: palette.textPrimary }}>{post.title}</span>
                        <span className="text-xs block mt-0.5" style={{ color: palette.textSecondary }}>{post.slug}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>{post.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>{post.author}</td>
                      <td className="px-4 py-3">
                        {post.isFeatured ? (
                          <Star size={14} className="fill-current" style={{ color: palette.gold }} />
                        ) : (
                          <span style={{ color: palette.textDim }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/blogs/${post._id}/edit`}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70"
                            style={{ background: `${palette.gold}26`, color: palette.gold }}
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            disabled={deletingId === post._id}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                            style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
