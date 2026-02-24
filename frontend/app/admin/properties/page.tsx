'use client';

import { useEffect, useState } from 'react';
import { Trash2, Star, StarOff, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import {
  getAdminProperties,
  forceDeleteProperty,
  toggleFeatured,
  AdminProperty,
} from '@/lib/adminApi';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProperties = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminProperties(p);
      setProperties(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(page); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      await forceDeleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } finally { setActionLoading(null); }
  };

  const handleToggleFeatured = async (id: string) => {
    setActionLoading(id + '_feature');
    try {
      await toggleFeatured(id);
      setProperties((prev) =>
        prev.map((p) => p._id === id ? { ...p, isFeatured: !p.isFeatured } : p)
      );
    } finally { setActionLoading(null); }
  };

  const statusColor: Record<string, { bg: string; color: string }> = {
    'for-sale': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    'for-rent': { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    'off-plan': { bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
    'ready': { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Properties</h1>
          <p className="text-sm mt-1" style={{ color: '#8892a4' }}>
            {total} total listings
          </p>
        </div>
        <button
          onClick={() => fetchProperties(page)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
          style={{ background: '#242938', border: '1px solid #2e3446', color: '#8892a4' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
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
        ) : properties.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: '#8892a4' }}>No properties found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2e3446' }}>
                  {['Title', 'Type', 'Status', 'Price (AED)', 'Agent', 'Developer', 'Featured', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8892a4' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => {
                  const sc = statusColor[prop.status] || { bg: 'rgba(136,146,164,0.15)', color: '#8892a4' };
                  return (
                    <tr key={prop._id} style={{ borderBottom: '1px solid #2e3446' }}>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate" style={{ color: '#e6edf3' }}>
                        {prop.title}
                      </td>
                      <td className="px-4 py-3 capitalize" style={{ color: '#8892a4' }}>{prop.propertyType}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#c9d1d9' }}>
                        {prop.price ? `AED ${(prop.price / 1_000_000).toFixed(1)}M` : '—'}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#8892a4' }}>{prop.agent?.name || '—'}</td>
                      <td className="px-4 py-3" style={{ color: '#8892a4' }}>{prop.developer?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleFeatured(prop._id)}
                          disabled={actionLoading === prop._id + '_feature'}
                          title={prop.isFeatured ? 'Unfeature' : 'Feature'}
                          className="transition-opacity hover:opacity-70 disabled:opacity-40"
                          style={{ color: prop.isFeatured ? '#c9a84c' : '#4b5563' }}
                        >
                          {prop.isFeatured ? <Star size={16} fill="#c9a84c" /> : <StarOff size={16} />}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8892a4' }}>
                        {new Date(prop.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(prop._id)}
                          disabled={actionLoading === prop._id + '_delete'}
                          title="Delete"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                          style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                        >
                          <Trash2 size={14} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm" style={{ color: '#8892a4' }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
              style={{ background: '#242938', border: '1px solid #2e3446', color: '#8892a4' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
              style={{ background: '#242938', border: '1px solid #2e3446', color: '#8892a4' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
