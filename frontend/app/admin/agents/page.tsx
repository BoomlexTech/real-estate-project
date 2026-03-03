'use client';

import { useEffect, useState } from 'react';
import { Check, X, Trash2, RefreshCw } from 'lucide-react';
import {
  getAgents,
  approveAgent,
  rejectAgent,
  deleteAgent,
  AdminAgent,
} from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

type FilterTab = 'all' | 'pending' | 'approved';

export default function AdminAgentsPage() {
  const { palette } = useTheme();
  const [agents, setAgents] = useState<AdminAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgents = async (filter: FilterTab) => {
    setLoading(true);
    setError('');
    try {
      const approved = filter === 'all' ? undefined : filter === 'approved';
      const data = await getAgents(approved);
      setAgents(data);
    } catch {
      setError('Failed to load agents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(tab); }, [tab]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      await approveAgent(id);
      setAgents((prev) => prev.map((a) => a._id === id ? { ...a, isApproved: true } : a));
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '_reject');
    try {
      await rejectAgent(id);
      setAgents((prev) => prev.map((a) => a._id === id ? { ...a, isApproved: false } : a));
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this agent? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      await deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a._id !== id));
    } finally { setActionLoading(null); }
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Agents</h1>
          <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>Manage agent accounts and approvals</p>
        </div>
        <button
          onClick={() => fetchAgents(tab)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-70"
          style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, color: palette.textSecondary }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              background: tab === t.key ? palette.gold : 'transparent',
              color: tab === t.key ? palette.pageBg : palette.textSecondary,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: palette.textSecondary }}>No agents found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                  {['Name', 'Email', 'Phone', 'Specialization', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                    <td className="px-4 py-3 font-medium" style={{ color: palette.textPrimary }}>{agent.name}</td>
                    <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{agent.email}</td>
                    <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{agent.phone || '—'}</td>
                    <td className="px-4 py-3" style={{ color: palette.textSecondary }}>{agent.specialization || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={agent.isApproved
                          ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e' }
                          : { background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                      >
                        {agent.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!agent.isApproved ? (
                          <button
                            onClick={() => handleApprove(agent._id)}
                            disabled={actionLoading === agent._id + '_approve'}
                            title="Approve"
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
                          >
                            <Check size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(agent._id)}
                            disabled={actionLoading === agent._id + '_reject'}
                            title="Revoke approval"
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                            style={{ background: `${palette.gold}26`, color: palette.gold }}
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(agent._id)}
                          disabled={actionLoading === agent._id + '_delete'}
                          title="Delete"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
                          style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c' }}
                        >
                          <Trash2 size={14} />
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
