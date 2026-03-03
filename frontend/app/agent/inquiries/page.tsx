'use client';

import { useEffect, useState } from 'react';
import { getMyInquiries, updateMyInquiryStatus, InquiryItem } from '@/lib/agentApi';
import { Loader2, MessageSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  contacted: { bg: 'rgba(234,179,8,0.15)',   color: '#eab308' },
  closed:    { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
};

export default function AgentInquiriesPage() {
  const { palette } = useTheme();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInquiries(1)
      .then((res) => setInquiries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateMyInquiryStatus(id, status);
      setInquiries((prev) =>
        prev.map((q) => q._id === id ? { ...q, status: status as InquiryItem['status'] } : q)
      );
    } catch {
      // silent — dropdown will revert visually on next render
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" style={{ color: palette.gold }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Inquiries</h1>
        <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>
          Leads received from your listed properties ({inquiries.length})
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare size={40} style={{ color: palette.textDim }} className="mb-3" />
          <p className="text-sm" style={{ color: palette.textSecondary }}>No inquiries yet</p>
          <p className="text-xs mt-1" style={{ color: palette.textDim }}>
            Inquiries submitted on your properties will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q) => {
            const s = STATUS_COLORS[q.status] || STATUS_COLORS.new;
            return (
              <div
                key={q._id}
                className="rounded-xl p-5"
                style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left: contact + message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: palette.textPrimary }}>{q.name}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {q.status}
                      </span>
                    </div>

                    <p className="text-xs mb-0.5" style={{ color: palette.textSecondary }}>
                      <a href={`mailto:${q.email}`} style={{ color: palette.textSecondary }}>{q.email}</a>
                      {' · '}
                      <a href={`tel:${q.phone}`} style={{ color: palette.textSecondary }}>{q.phone}</a>
                    </p>

                    {q.property && (
                      <p className="text-xs mb-2 font-medium" style={{ color: palette.gold }}>
                        {q.property.title}
                      </p>
                    )}

                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: palette.textPrimary }}>
                      {q.message}
                    </p>

                    <p className="text-xs mt-2" style={{ color: palette.textDim }}>
                      {new Date(q.createdAt).toLocaleDateString('en-AE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Right: status selector */}
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    className="rounded-lg px-3 py-2 text-xs outline-none shrink-0"
                    style={{ background: palette.inputBg, border: `1px solid ${palette.border}`, color: palette.textPrimary }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
