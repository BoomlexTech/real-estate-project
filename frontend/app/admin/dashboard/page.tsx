'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, FileText, Bell, Clock, AlertCircle } from 'lucide-react';
import { getDashboardStats, DashboardStats } from '@/lib/adminApi';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !stats) return <ErrorMsg msg={error || 'No data'} />;

  const cards: StatCard[] = [
    {
      label: 'Total Properties',
      value: stats.totalProperties,
      icon: <Building2 size={22} />,
      accent: '#3b82f6',
    },
    {
      label: 'Active Agents',
      value: stats.totalAgents,
      icon: <Users size={22} />,
      accent: '#22c55e',
      sub: stats.pendingAgents > 0 ? `${stats.pendingAgents} pending approval` : undefined,
    },
    {
      label: 'Mortgage Inquiries',
      value: stats.totalInquiries,
      icon: <FileText size={22} />,
      accent: '#c9a84c',
      sub: stats.pendingInquiries > 0 ? `${stats.pendingInquiries} pending` : undefined,
    },
    {
      label: 'Notifications',
      value: stats.unseenNotifications,
      icon: <Bell size={22} />,
      accent: '#e74c3c',
      sub: stats.unseenNotifications > 0 ? 'Unseen' : 'All caught up',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#8892a4' }}>Overview of your portal activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5"
            style={{ background: '#242938', border: '1px solid #2e3446' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8892a4' }}>
                  {card.label}
                </p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#e6edf3' }}>
                  {card.value}
                </p>
                {card.sub && (
                  <p className="text-xs mt-1" style={{ color: card.accent }}>
                    {card.sub}
                  </p>
                )}
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.accent}20`, color: card.accent }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Review Pending Agents', href: '/admin/agents', color: '#e74c3c', icon: <AlertCircle size={16} />, count: stats.pendingAgents },
          { label: 'Manage Properties', href: '/admin/properties', color: '#3b82f6', icon: <Building2 size={16} />, count: stats.totalProperties },
          { label: 'View Inquiries', href: '/admin/inquiries', color: '#c9a84c', icon: <Clock size={16} />, count: stats.pendingInquiries },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between rounded-xl p-4 transition-opacity hover:opacity-80"
            style={{ background: '#242938', border: `1px solid ${item.color}40` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: '#c9d1d9' }}>{item.label}</span>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: item.color }}
            >
              {item.count}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm" style={{ color: '#e74c3c' }}>{msg}</p>
    </div>
  );
}
