'use client';

import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';

interface Props {
  propertyTitle: string;
  onConfirm: (data: { name: string; phone: string; email: string; message: string }) => Promise<void>;
  onClose: () => void;
}

export default function BrochureLeadModal({ propertyTitle, onConfirm, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I am interested in ${propertyTitle}`);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const e: { name?: string; email?: string } = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onConfirm({ name: name.trim(), phone: phone.trim(), email: email.trim(), message: message.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-5 h-5" style={{ color: 'var(--gold)' }} />
            <h2 className="text-lg font-bold t-heading">Download Brochure</h2>
          </div>
          <p className="text-sm t-secondary">Please provide your details to download the brochure.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name *"
              className="input-dark text-sm w-full"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="input-dark text-sm w-full"
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
              className="input-dark text-sm w-full"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="input-dark text-sm w-full resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center text-sm py-3 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
            ) : (
              <><Download className="w-4 h-4" /> Download Brochure</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
