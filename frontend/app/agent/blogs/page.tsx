'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMyBlogPosts, deleteMyBlogPost, AgentBlogPost } from '@/lib/agentApi';
import { useTheme } from '@/contexts/ThemeContext';

export default function AgentBlogsPage() {
  const { palette } = useTheme();
  const [posts, setPosts] = useState<AgentBlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyBlogPosts(p);
      setPosts(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load your blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(page); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteMyBlogPost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle: Record<string, { bg: string; color: string }> = {
    pending:  { bg: 'rgba(234,179,8,0.15)',   color: '#eab308' },
    approved: { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>My Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>{total} submission{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/agent/blogs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: palette.gold, color: '#1a1f2e' }}
        >
          <PlusCircle size={16} /> Submit New Post
        </Link>
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
            <p className="text-sm" style={{ color: palette.textSecondary }}>No blog posts yet.</p>
            <Link
              href="/agent/blogs/new"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: palette.gold, color: '#1a1f2e' }}
            >
              Submit your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                  {['Title', 'Category', 'Status', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const ss = statusStyle[post.status] || statusStyle.pending;
                  return (
                    <tr key={post._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                      <td className="px-4 py-3 font-medium max-w-xs truncate" style={{ color: palette.textPrimary }}>{post.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>{post.category}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: ss.bg, color: ss.color }}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                          style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm" style={{ color: palette.textSecondary }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
              style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
              style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
