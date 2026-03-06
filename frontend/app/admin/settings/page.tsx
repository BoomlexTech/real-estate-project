'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings, updateSiteSettings } from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminSettingsPage() {
  const { palette } = useTheme();
  const [companyBrochureUrl, setCompanyBrochureUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteSettings()
      .then((s) => setCompanyBrochureUrl(s.companyBrochureUrl))
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateSiteSettings({ companyBrochureUrl });
      setSuccess('Settings saved successfully.');
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: palette.inputBg || palette.cardBg,
    border: `1px solid ${palette.border}`,
    color: palette.textPrimary,
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: palette.textSecondary }}>Site-wide configuration</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="max-w-xl">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: palette.cardBg, border: `1px solid ${palette.border}` }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: palette.textSecondary }}>Brochure</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: palette.textPrimary }}>
                Company Brochure URL (PDF)
              </label>
              <input
                type="url"
                value={companyBrochureUrl}
                onChange={(e) => setCompanyBrochureUrl(e.target.value)}
                placeholder="https://example.com/company-brochure.pdf"
                style={inputStyle}
              />
              <p className="mt-1.5 text-xs" style={{ color: palette.textSecondary }}>
                Used as the fallback brochure for any property that doesn&apos;t have its own brochure URL set.
              </p>
            </div>

            {success && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
              >
                {success}
              </div>
            )}

            {error && (
              <p className="text-sm" style={{ color: '#e74c3c' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: palette.gold, color: '#1a1f2e' }}
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
