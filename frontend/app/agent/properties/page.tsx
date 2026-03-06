'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getMyProperties, deleteMyProperty, AgentProperty } from '@/lib/agentApi';
import { useTheme } from '@/contexts/ThemeContext';

export default function AgentPropertiesPage() {
  const { palette } = useTheme();
  const [properties, setProperties] = useState<AgentProperty[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProperties = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyProperties(p);
      setProperties(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load your properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(page); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteMyProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete property.');
    } finally {
      setDeletingId(null);
    }
  };

  const statusColor: Record<string, { bg: string; color: string }> = {
    'for-sale': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    'for-rent': { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    'sold': { bg: 'rgba(136,146,164,0.15)', color: '#8892a4' },
    'pending_review': { bg: 'rgba(201,168,76,0.15)', color: palette.gold },
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>My Properties</h1>
          <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>{total} listing{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/agent/properties/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: palette.gold, color: '#1a1f2e' }}
        >
          <PlusCircle size={16} /> Add Property
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
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-sm" style={{ color: palette.textSecondary }}>No properties yet.</p>
            <Link
              href="/agent/properties/new"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: palette.gold, color: '#1a1f2e' }}
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                  {['Title', 'Type', 'Status', 'Price (AED)', 'Beds', 'Area (sqft)', 'Emirate', 'Featured', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => {
                  const sc = statusColor[prop.status] || { bg: 'rgba(136,146,164,0.15)', color: palette.textSecondary };
                  return (
                    <tr key={prop._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                      <td className="px-4 py-3 font-medium max-w-45 truncate" style={{ color: palette.textPrimary }}>
                        {prop.title}
                      </td>
                      <td className="px-4 py-3 capitalize" style={{ color: palette.textSecondary }}>{prop.propertyType}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textPrimary }}>
                        {prop.price ? `AED ${(prop.price / 1_000_000).toFixed(1)}M` : '—'}
                      </td>
                      <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{prop.bedrooms || '—'}</td>
                      <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{prop.squareFt ? prop.squareFt.toLocaleString() : '—'}</td>
                      <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{prop.location?.emirate || '—'}</td>
                      <td className="px-4 py-3">
                        {prop.isFeatured
                          ? <Star size={15} fill={palette.gold} style={{ color: palette.gold }} />
                          : <span style={{ color: palette.textDim }}>—</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                        {new Date(prop.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/agent/properties/${prop._id}/edit`}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
                          >
                            <Pencil size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(prop._id)}
                            disabled={deletingId === prop._id}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                            style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
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
