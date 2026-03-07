'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Star } from 'lucide-react';
import { getAgentReviews, AgentReview } from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          fill={s <= rating ? 'var(--gold)' : 'transparent'}
          style={{ color: 'var(--gold)' }}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { palette } = useTheme();
  const [reviews, setReviews] = useState<AgentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAgentReviews();
      setReviews(data);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Agent Reviews</h1>
          <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>All reviews submitted by visitors</p>
        </div>
        <button
          onClick={fetchReviews}
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
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: palette.textSecondary }}>No reviews yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.border}` }}>
                  {['Agent', 'Reviewer', 'Email', 'Rating', 'Comment', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                    <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: palette.textPrimary }}>
                      {review.agent?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                      {review.reviewerName}
                    </td>
                    <td className="px-4 py-3" style={{ color: palette.textSecondary }}>
                      {review.reviewerEmail}
                    </td>
                    <td className="px-4 py-3">
                      <StarDisplay rating={review.rating} />
                    </td>
                    <td className="px-4 py-3 max-w-xs" style={{ color: palette.textSecondary }}>
                      <span className="line-clamp-2">{review.comment}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: palette.textSecondary }}>
                      {new Date(review.createdAt).toLocaleDateString()}
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
