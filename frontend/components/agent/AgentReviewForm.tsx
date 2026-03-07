'use client';

import { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { submitAgentReview } from '@/lib/api';

interface Props {
  agentId: string;
  agentName: string;
}

export default function AgentReviewForm({ agentId, agentName }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await submitAgentReview(agentId, { reviewerName, reviewerEmail, rating, comment });
      setSubmitted(true);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <p className="text-[10px] tracking-[0.28em] uppercase mb-4 t-accent">Leave a Review</p>
      <span className="section-divider mb-5" style={{ display: 'block' }} />
      <h2 className="font-serif text-3xl font-light t-heading mb-8">
        Rate {agentName}
      </h2>

      <div
        className="p-8 max-w-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,169,110,0.2)' }}
      >
        {submitted ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <CheckCircle className="w-12 h-12" style={{ color: 'var(--gold)' }} />
            <p className="font-serif text-2xl font-light t-heading">Thank you for your review!</p>
            <p className="text-sm t-secondary">Your feedback has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-xs tracking-widest uppercase t-secondary mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className="w-7 h-7"
                      fill={(hovered || rating) >= star ? 'var(--gold)' : 'transparent'}
                      style={{ color: 'var(--gold)' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase t-secondary mb-1.5">Your Name</label>
                <input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                  placeholder="Full name"
                  className="input-dark text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase t-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="input-dark text-sm w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase t-secondary mb-1.5">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                placeholder="Share your experience working with this agent…"
                className="input-dark text-sm w-full resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold justify-center text-sm py-3 px-8 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
