'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import {
  getInquiries,
  updateInquiryStatus,
  Inquiry,
  InquiryStatus,
} from '@/lib/adminApi';

type FilterStatus = 'all' | InquiryStatus;

const STATUS_OPTIONS: InquiryStatus[] = ['pending', 'contacted', 'approved'];

const statusStyle: Record<InquiryStatus, { bg: string; color: string }> = {
  pending: { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' },
  contacted: { bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
  approved: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async (p: number, s: FilterStatus) => {
    setLoading(true);
    setError('');
    try {
      const res = await getInquiries(p, s === 'all' ? undefined : s);
      setInquiries(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(page, filterStatus); }, [page, filterStatus]);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, status } : i));
    } finally { setUpdatingId(null); }
  };

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'approved', label: 'Approved' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Mortgage Inquiries</h1>
          <p className="text-sm mt-1" style={{ color: '#8892a4' }}>{total} total inquiries</p>
        </div>
        <button
          onClick={() => fetchInquiries(page, filterStatus)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
          style={{ background: '#242938', border: '1px solid #2e3446', color: '#8892a4' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: '#242938', border: '1px solid #2e3446' }}>
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setPage(1); setFilterStatus(t.key); }}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              background: filterStatus === t.key ? '#c9a84c' : 'transparent',
              color: filterStatus === t.key ? '#1a1f2e' : '#8892a4',
            }}
          >
            {t.label}
          </button>
        ))}
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
        ) : inquiries.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: '#8892a4' }}>No inquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2e3446' }}>
                  {['Name', 'Email', 'Phone', 'Loan Amount (AED)', 'Status', 'Date', 'Update Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8892a4' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => {
                  const ss = statusStyle[inq.status];
                  return (
                    <tr key={inq._id} style={{ borderBottom: '1px solid #2e3446' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#e6edf3' }}>{inq.fullName}</td>
                      <td className="px-4 py-3" style={{ color: '#8892a4' }}>{inq.email}</td>
                      <td className="px-4 py-3" style={{ color: '#8892a4' }}>{inq.phone || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#c9d1d9' }}>
                        {inq.loanAmountAED ? `AED ${inq.loanAmountAED.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: ss.bg, color: ss.color }}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8892a4' }}>
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq._id}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value as InquiryStatus)}
                          className="rounded-md px-2 py-1 text-xs outline-none disabled:opacity-50"
                          style={{
                            background: '#1a1f2e',
                            border: '1px solid #2e3446',
                            color: '#c9d1d9',
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
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
