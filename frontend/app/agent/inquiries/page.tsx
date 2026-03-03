'use client';

import { useEffect, useState } from 'react';
import { getMyInquiries, updateMyInquiryStatus, InquiryItem } from '@/lib/agentApi';
import { Loader2, MessageSquare } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  contacted: { bg: 'rgba(234,179,8,0.15)',   color: '#eab308' },
  closed:    { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
};

export default function AgentInquiriesPage() {
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
        <Loader2 className="animate-spin" style={{ color: '#c9a84c' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Inquiries</h1>
        <p className="text-sm mt-1" style={{ color: '#8892a4' }}>
          Leads received from your listed properties ({inquiries.length})
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare size={40} style={{ color: '#3a4058' }} className="mb-3" />
          <p className="text-sm" style={{ color: '#8892a4' }}>No inquiries yet</p>
          <p className="text-xs mt-1" style={{ color: '#3a4058' }}>
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
                style={{ background: '#242938', border: '1px solid #2e3446' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left: contact + message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: '#e6edf3' }}>{q.name}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {q.status}
                      </span>
                    </div>

                    <p className="text-xs mb-0.5" style={{ color: '#8892a4' }}>
                      <a href={`mailto:${q.email}`} style={{ color: '#8892a4' }}>{q.email}</a>
                      {' · '}
                      <a href={`tel:${q.phone}`} style={{ color: '#8892a4' }}>{q.phone}</a>
                    </p>

                    {q.property && (
                      <p className="text-xs mb-2 font-medium" style={{ color: '#c9a84c' }}>
                        {q.property.title}
                      </p>
                    )}

                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#c9d1d9' }}>
                      {q.message}
                    </p>

                    <p className="text-xs mt-2" style={{ color: '#3a4058' }}>
                      {new Date(q.createdAt).toLocaleDateString('en-AE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Right: status selector */}
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    className="rounded-lg px-3 py-2 text-xs outline-none flex-shrink-0"
                    style={{ background: '#1a1f2e', border: '1px solid #2e3446', color: '#c9d1d9' }}
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
