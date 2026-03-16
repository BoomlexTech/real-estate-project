'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Star, MessageSquare } from 'lucide-react';
import { getMyProperties, getMyInquiries, MyPropertiesResponse } from '@/lib/agentApi';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const { palette } = useTheme();
  const [stats, setStats] = useState<{ total: number; featured: number; newInquiries: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProperties(1), getMyInquiries(1)])
      .then(([props, inquiries]: [MyPropertiesResponse, any]) => {
        const featured = props.data.filter((p) => p.isFeatured).length;
        const newInquiries = inquiries.data.filter((q: any) => q.status === 'new').length;
        setStats({ total: props.total, featured, newInquiries });
      })
      .catch(() => setStats({ total: 0, featured: 0, newInquiries: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="surface-panel p-5 sm:p-6 mb-6">
        <h1 className="portal-section-title" style={{ color: palette.textPrimary }}>
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="portal-subtle mt-1">Track listings, respond to leads, and keep your profile and content moving.</p>
        <div className="info-pills mt-4">
          <span className="info-pill">{loading ? '...' : stats?.total ?? 0} active listings</span>
          <span className="info-pill">{loading ? '...' : stats?.newInquiries ?? 0} new inquiries</span>
          <span className="info-pill">{loading ? '...' : stats?.featured ?? 0} featured listings</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: palette.textSecondary }}>My Listings</p>
              <p className="text-3xl font-bold mt-1" style={{ color: palette.textPrimary }}>
                {loading ? '—' : stats?.total ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: palette.textSecondary }}>Featured</p>
              <p className="text-3xl font-bold mt-1" style={{ color: palette.textPrimary }}>
                {loading ? '—' : stats?.featured ?? 0}
              </p>
              <p className="text-xs mt-1" style={{ color: palette.gold }}>Admin-boosted listings</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', color: palette.gold }}>
              <Star size={20} />
            </div>
          </div>
        </div>

        <Link
          href="/agent/inquiries"
          className="rounded-xl p-5 transition-opacity hover:opacity-80"
          style={{ background: palette.cardBg, border: `1px solid ${palette.border}`, display: 'block' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: palette.textSecondary }}>New Inquiries</p>
              <p className="text-3xl font-bold mt-1" style={{ color: palette.textPrimary }}>
                {loading ? '—' : stats?.newInquiries ?? 0}
              </p>
              <p className="text-xs mt-1" style={{ color: '#3b82f6' }}>Uncontacted leads</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
              <MessageSquare size={20} />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: palette.textSecondary }}>Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/agent/properties/new"
          className="flex items-center gap-4 rounded-xl p-4 transition-opacity hover:opacity-80"
          style={{ background: palette.cardBg, border: `1px solid ${palette.borderAccent}` }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.15)', color: palette.gold }}>
            <PlusCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: palette.textPrimary }}>Add New Property</p>
            <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>List a new property for sale or rent</p>
          </div>
        </Link>

        <Link
          href="/agent/properties"
          className="flex items-center gap-4 rounded-xl p-4 transition-opacity hover:opacity-80"
          style={{ background: palette.cardBg, border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: palette.textPrimary }}>View My Listings</p>
            <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>Manage and edit your properties</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
