'use client';

import { useEffect, useState } from 'react';
import {
  getMyPropertiesAnalytics,
  deleteAgentBrochureLead,
  AgentAnalyticsItem,
  AgentBrochureLead,
} from '@/lib/agentApi';
import { useTheme } from '@/contexts/ThemeContext';
import {
  TrendingUp, ChevronDown, ChevronUp, Trash2,
  Users, Building2, FileDown, Mail, Phone, MessageSquare, Calendar,
} from 'lucide-react';

export default function AgentAnalyticsPage() {
  const { palette } = useTheme();
  const [items, setItems] = useState<AgentAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getMyPropertiesAnalytics()
      .then((data) =>
        setItems([
          ...data.filter((i) => i.leads.length > 0).sort((a, b) => b.leads.length - a.leads.length),
          ...data.filter((i) => i.leads.length === 0),
        ])
      )
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) =>
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleDelete = async (leadId: string, propertyId: string) => {
    setDeleting(leadId);
    try {
      await deleteAgentBrochureLead(leadId);
      setItems((prev) =>
        prev.map((item) =>
          item._id === propertyId ? { ...item, leads: item.leads.filter((l) => l._id !== leadId) } : item
        )
      );
    } finally {
      setDeleting(null);
    }
  };

  const totalLeads  = items.reduce((s, i) => s + i.leads.length, 0);
  const activeProps = items.filter((i) => i.leads.length > 0).length;
  const totalProps  = items.length;

  return (
    <div className="space-y-6">

      {/* ── Page title ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} style={{ color: palette.gold }} />
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Brochure Analytics</h1>
        </div>
        <p className="text-sm" style={{ color: palette.textSecondary }}>
          Leads captured when visitors download your property brochures · auto-expire after 30 days
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Users size={18} />, label: 'Total Leads', value: totalLeads, accent: true },
          { icon: <Building2 size={18} />, label: 'Properties with Leads', value: activeProps, accent: false },
          { icon: <FileDown size={18} />, label: 'My Properties', value: totalProps, accent: false },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: s.accent ? 'rgba(201,168,76,0.10)' : palette.cardBg,
              border: `1px solid ${s.accent ? palette.borderAccent : palette.border}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: s.accent ? 'rgba(201,168,76,0.18)' : palette.pageBg, color: s.accent ? palette.gold : palette.textSecondary }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: s.accent ? palette.gold : palette.textPrimary }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
        </div>
      )}
      {error && (
        <div className="text-center py-16 rounded-2xl" style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {!loading && !error && totalLeads === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ background: palette.cardBg, border: `1px dashed ${palette.border}` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: palette.pageBg }}>
            <FileDown size={28} style={{ color: palette.textSecondary }} />
          </div>
          <p className="font-semibold text-sm mb-1" style={{ color: palette.textPrimary }}>No leads yet</p>
          <p className="text-xs" style={{ color: palette.textSecondary }}>Leads will appear here when visitors download your property brochures.</p>
        </div>
      )}

      {/* ── Property cards ── */}
      {!loading && !error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => {
            const isOpen = expanded.has(item._id);
            const hasLeads = item.leads.length > 0;
            return (
              <div
                key={item._id}
                className="rounded-2xl overflow-hidden"
                style={{
                  border: `1px solid ${hasLeads ? palette.borderAccent : palette.border}`,
                  boxShadow: hasLeads ? '0 2px 24px rgba(201,168,76,0.06)' : 'none',
                }}
              >
                {/* Property header */}
                <button
                  onClick={() => hasLeads && toggle(item._id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left ${hasLeads ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ background: palette.cardBg }}
                >
                  <div className="shrink-0 relative">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover"
                        style={{ border: `1px solid ${palette.border}` }}
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ background: palette.pageBg, border: `1px solid ${palette.border}` }}
                      >
                        <Building2 size={22} style={{ color: palette.textSecondary }} />
                      </div>
                    )}
                    {hasLeads && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: palette.gold, color: palette.pageBg }}
                      >
                        {item.leads.length}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: palette.textPrimary }}>{item.title}</p>
                    <p className="text-xs mt-1" style={{ color: hasLeads ? palette.gold : palette.textSecondary }}>
                      {hasLeads ? `${item.leads.length} lead${item.leads.length !== 1 ? 's' : ''} captured` : 'No leads yet'}
                    </p>
                  </div>

                  {hasLeads && (
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(201,168,76,0.10)', color: palette.gold }}
                    >
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </button>

                {/* Lead cards */}
                {isOpen && hasLeads && (
                  <div style={{ borderTop: `1px solid ${palette.border}`, background: palette.pageBg }}>
                    <div className="px-5 py-3 flex items-center gap-2">
                      <Users size={13} style={{ color: palette.gold }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.textSecondary }}>
                        Leads — {item.leads.length}
                      </span>
                    </div>
                    <div className="px-4 pb-4 grid sm:grid-cols-2 gap-3">
                      {item.leads.map((lead) => (
                        <LeadCard
                          key={lead._id}
                          lead={lead}
                          palette={palette}
                          deleting={deleting}
                          onDelete={() => handleDelete(lead._id, item._id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  palette,
  deleting,
  onDelete,
}: {
  lead: AgentBrochureLead;
  palette: Record<string, string>;
  deleting: string | null;
  onDelete: () => void;
}) {
  const initials = lead.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: 'rgba(201,168,76,0.15)', color: palette.gold }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: palette.textPrimary }}>{lead.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar size={10} style={{ color: palette.textSecondary }} />
            <span className="text-xs" style={{ color: palette.textSecondary }}>
              {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          disabled={deleting === lead._id}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30 shrink-0"
          style={{ background: 'rgba(220,53,69,0.10)', color: '#e05252' }}
          title="Delete lead"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="space-y-1.5">
        {lead.email && (
          <div className="flex items-center gap-2">
            <Mail size={12} style={{ color: palette.gold, flexShrink: 0 }} />
            <span className="text-xs truncate" style={{ color: palette.textSecondary }}>{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} style={{ color: palette.gold, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: palette.textSecondary }}>{lead.phone}</span>
          </div>
        )}
        {lead.message && (
          <div className="flex items-start gap-2 mt-1">
            <MessageSquare size={12} style={{ color: palette.gold, flexShrink: 0, marginTop: 2 }} />
            <span className="text-xs line-clamp-2" style={{ color: palette.textSecondary }}>{lead.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
