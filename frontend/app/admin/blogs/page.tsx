'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, RefreshCw, Plus, Star } from 'lucide-react';
import { getAdminBlogPosts, deleteAdminBlogPost, AdminBlogPost } from '@/lib/adminApi';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminBlogPosts();
      setPosts(res.data);
    } catch {
      setError('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: '#8892a4' }}>Create, edit, and delete blog articles</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
            style={{ background: '#242938', border: '1px solid #2e3446', color: '#8892a4' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: '#c9a84c', color: '#1a1f2e' }}
          >
            <Plus size={14} /> New Post
          </Link>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#242938', border: '1px solid #2e3446' }}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-sm" style={{ color: '#8892a4' }}>No blog posts yet.</p>
            <Link
              href="/admin/blogs/new"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#c9a84c', color: '#1a1f2e' }}
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2e3446' }}>
                  {['Title', 'Category', 'Author', 'Featured', 'Published', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8892a4' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid #2e3446' }}>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="font-medium line-clamp-1" style={{ color: '#e6edf3' }}>{post.title}</span>
                      <span className="text-xs block mt-0.5" style={{ color: '#8892a4' }}>{post.slug}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8892a4' }}>{post.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8892a4' }}>{post.author}</td>
                    <td className="px-4 py-3">
                      {post.isFeatured ? (
                        <Star size={14} className="fill-current" style={{ color: '#c9a84c' }} />
                      ) : (
                        <span style={{ color: '#3a4058' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8892a4' }}>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blogs/${post._id}/edit`}
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70"
                          style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}
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
  );
}
