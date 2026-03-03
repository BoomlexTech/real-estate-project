'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import {
  getContactMessages,
  updateContactMessageStatus,
  ContactMessage,
  ContactMessageStatus,
} from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

type FilterStatus = 'all' | ContactMessageStatus;

const STATUS_OPTIONS: ContactMessageStatus[] = ['new', 'read', 'replied'];

const statusStyle: Record<ContactMessageStatus, { bg: string; color: string }> = {
  new:     { bg: 'rgba(231,76,60,0.15)',   color: '#e74c3c' },
  read:    { bg: 'rgba(201,168,76,0.15)',  color: '#c9a84c' },
  replied: { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
};

export default function AdminContactMessagesPage() {
  const { palette } = useTheme();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = async (p: number, s: FilterStatus) => {
    setLoading(true);
    setError('');
    try {
      const res = await getContactMessages(p, s === 'all' ? undefined : s);
      setMessages(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(page, filterStatus); }, [page, filterStatus]);

  const handleStatusChange = async (id: string, status: ContactMessageStatus) => {
    setUpdatingId(id);
    try {
      await updateContactMessageStatus(id, status);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status } : m));
    } finally { setUpdatingId(null); }
  };

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all',     label: 'All' },
    { key: 'new',     label: 'New' },
    { key: 'read',    label: 'Read' },
    { key: 'replied', label: 'Replied' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Contact Messages</h1>
          <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>{total} total messages</p>
        </div>
        <button
          onClick={() => fetchMessages(page, filterStatus)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
          style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setPage(1); setFilterStatus(t.key); }}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              background: filterStatus === t.key ? palette.gold : 'transparent',
              color: filterStatus === t.key ? palette.pageBg : palette.textSecondary,
            }}
          >
            {t.label}
          </button>
        ))}
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
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: palette.textSecondary }}>No messages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                  {['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date', 'Update Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => {
                  const ss = statusStyle[msg.status];
                  return (
                    <tr key={msg._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                      <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: palette.textPrimary }}>{msg.name}</td>
                      <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{msg.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>{msg.phone || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textPrimary }}>{msg.subject || '—'}</td>
                      <td className="px-4 py-3 max-w-xs" style={{ color: palette.textSecondary }}>
                        <span title={msg.message}>{msg.message.length > 60 ? msg.message.slice(0, 60) + '…' : msg.message}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: ss.bg, color: ss.color }}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={msg.status}
                          disabled={updatingId === msg._id}
                          onChange={(e) => handleStatusChange(msg._id, e.target.value as ContactMessageStatus)}
                          className="rounded-md px-2 py-1 text-xs outline-none disabled:opacity-50"
                          style={{ background: palette.inputBg, border: `1px solid ${palette.border}`, color: palette.textPrimary }}
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
