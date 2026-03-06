'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Star, StarOff, ChevronLeft, ChevronRight, RefreshCw, Pencil, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import {
  getAdminProperties,
  getAdminPendingProperties,
  forceDeleteProperty,
  toggleFeatured,
  approvePropertyChanges,
  rejectPropertyChanges,
  AdminProperty,
} from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

// Fields to compare between current property and pendingChanges
// Use dot notation (e.g. 'location.emirate') for nested fields
const DIFF_FIELDS: { key: string; label: string; format?: (v: unknown) => string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'price', label: 'Price', format: (v) => v ? `AED ${((v as number) / 1_000_000).toFixed(2)}M` : '—' },
  { key: 'status', label: 'Status' },
  { key: 'propertyType', label: 'Property Type' },
  { key: 'bedrooms', label: 'Bedrooms', format: (v) => String(v ?? '—') },
  { key: 'bathrooms', label: 'Bathrooms', format: (v) => String(v ?? '—') },
  { key: 'squareFt', label: 'Area (sqft)', format: (v) => v ? (v as number).toLocaleString() : '—' },
  { key: 'completionStatus', label: 'Completion Status' },
  { key: 'completionYear', label: 'Completion Year', format: (v) => String(v || '—') },
  { key: 'location.emirate', label: 'Emirate' },
  { key: 'location.area', label: 'Area' },
  { key: 'amenities', label: 'Amenities', format: (v) => Array.isArray(v) ? (v as string[]).join(', ') || '—' : String(v ?? '—') },
];

function getNestedValue(obj: Record<string, unknown> | AdminProperty, key: string): unknown {
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    return ((obj as any)[parent] as any)?.[child];
  }
  return (obj as any)[key];
}

function getDiff(current: AdminProperty, pending: Record<string, unknown>) {
  return DIFF_FIELDS.filter(({ key }) => {
    const pendingParent = key.includes('.') ? key.split('.')[0] : key;
    // If the top-level key isn't present in pending at all, skip
    if (pending[pendingParent] === undefined) return false;
    const cur = String(getNestedValue(current, key) ?? '');
    const prop = String(getNestedValue(pending as any, key) ?? '');
    return cur !== prop;
  });
}

export default function AdminPropertiesPage() {
  const { palette } = useTheme();

  // — Main table state —
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // — Pending approvals state —
  const [pendingProperties, setPendingProperties] = useState<AdminProperty[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const fetchProperties = useCallback(async (p: number) => {
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
  }, []);

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await getAdminPendingProperties();
      setPendingProperties(res);
    } finally {
      setPendingLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(page); }, [page, fetchProperties]);
  useEffect(() => { fetchPending(); }, [fetchPending]);

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

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      await approvePropertyChanges(id);
      setPendingProperties((prev) => prev.filter((p) => p._id !== id));
      setProperties((prev) =>
        prev.map((p) => p._id === id ? { ...p, hasPendingChanges: false, pendingChanges: null } : p)
      );
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '_reject');
    try {
      await rejectPropertyChanges(id);
      setPendingProperties((prev) => prev.filter((p) => p._id !== id));
      setProperties((prev) =>
        prev.map((p) => p._id === id ? { ...p, hasPendingChanges: false, pendingChanges: null } : p)
      );
    } finally { setActionLoading(null); }
  };

  const statusColor: Record<string, { bg: string; color: string }> = {
    'for-sale': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    'for-rent': { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    'off-plan': { bg: 'rgba(201,168,76,0.15)', color: palette.gold },
    'ready': { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
    'pending_review': { bg: 'rgba(201,168,76,0.15)', color: palette.gold },
    'sold': { bg: 'rgba(136,146,164,0.15)', color: '#8892a4' },
  };

  return (
    <div className="space-y-8">

      {/* ── Section A: Pending Approvals ─────────────────── */}
      {(pendingLoading || pendingProperties.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} style={{ color: '#eab308' }} />
            <h2 className="text-base font-semibold" style={{ color: palette.textPrimary }}>
              Pending Approvals
            </h2>
            {!pendingLoading && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}
              >
                {pendingProperties.length}
              </span>
            )}
          </div>

          {pendingLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#eab308', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingProperties.map((prop) => {
                const pending = (prop.pendingChanges || {}) as Record<string, unknown>;
                const diffs = getDiff(prop, pending);
                const isActing = actionLoading === prop._id + '_approve' || actionLoading === prop._id + '_reject';
                return (
                  <div
                    key={prop._id}
                    className="rounded-xl p-5"
                    style={{
                      background: palette.cardBg,
                      border: `1px solid rgba(234,179,8,0.3)`,
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: palette.textPrimary }}>{prop.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>
                          Agent: {prop.agent?.name || '—'} &middot; Submitted {new Date(prop.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(prop._id)}
                          disabled={isActing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(prop._id)}
                          disabled={isActing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </div>

                    {/* Diff table */}
                    {diffs.length > 0 ? (
                      <div className="rounded-lg overflow-hidden text-xs" style={{ border: `1px solid ${palette.border}` }}>
                        <table className="w-full">
                          <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${palette.border}` }}>
                              <th className="px-3 py-2 text-left font-semibold" style={{ color: palette.textSecondary, width: '25%' }}>Field</th>
                              <th className="px-3 py-2 text-left font-semibold" style={{ color: palette.textSecondary, width: '37.5%' }}>Current</th>
                              <th className="px-3 py-2 text-left font-semibold" style={{ color: '#eab308', width: '37.5%' }}>Proposed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diffs.map(({ key, label, format }) => {
                              const cur = getNestedValue(prop, key);
                              const next = getNestedValue(pending as any, key);
                              const fmt = format ?? ((v: unknown) => String(v ?? '—'));
                              return (
                                <tr key={key} style={{ borderBottom: `1px solid ${palette.border}` }}>
                                  <td className="px-3 py-2 font-medium" style={{ color: palette.textSecondary }}>{label}</td>
                                  <td className="px-3 py-2" style={{ color: palette.textSecondary }}>{fmt(cur)}</td>
                                  <td className="px-3 py-2 font-semibold" style={{ color: palette.textPrimary }}>{fmt(next)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs" style={{ color: palette.textSecondary }}>No tracked field changes detected.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Section B: All Properties Table ─────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold" style={{ color: palette.textPrimary }}>All Properties</h2>
            <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>{total} total listings</p>
          </div>
          <button
            onClick={() => { fetchProperties(page); fetchPending(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
            style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
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
            <div className="flex items-center justify-center h-48">
              <p className="text-sm" style={{ color: palette.textSecondary }}>No properties found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                    {['Title', 'Type', 'Status', 'Price (AED)', 'Agent', 'Developer', 'Featured', 'Date', 'Actions'].map((h) => (
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
                        <td className="px-4 py-3 font-medium max-w-50 truncate" style={{ color: palette.textPrimary }}>
                          {prop.title}
                        </td>
                        <td className="px-4 py-3 capitalize" style={{ color: palette.textSecondary }}>{prop.propertyType}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>
                              {prop.status}
                            </span>
                            {prop.hasPendingChanges && (
                              <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textPrimary }}>
                          {prop.price ? `AED ${(prop.price / 1_000_000).toFixed(1)}M` : '—'}
                        </td>
                        <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{prop.agent?.name || '—'}</td>
                        <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{prop.developer?.name || '—'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleFeatured(prop._id)}
                            disabled={actionLoading === prop._id + '_feature'}
                            title={prop.isFeatured ? 'Unfeature' : 'Feature'}
                            className="transition-opacity hover:opacity-70 disabled:opacity-40"
                            style={{ color: prop.isFeatured ? palette.gold : palette.textDim }}
                          >
                            {prop.isFeatured ? <Star size={16} fill={palette.gold} /> : <StarOff size={16} />}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                          {new Date(prop.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/properties/${prop._id}/edit`}
                              title="Edit"
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70"
                              style={{ background: 'rgba(201,168,76,0.15)', color: palette.gold }}
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(prop._id)}
                              disabled={actionLoading === prop._id + '_delete'}
                              title="Delete"
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                              style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                            >
                              <Trash2 size={14} />
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
    </div>
  );
}
