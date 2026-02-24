'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { loginAdmin, loginAgent } from '@/lib/authApi';

type Tab = 'admin' | 'agent';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('agent');
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const switchTab = (t: Tab) => {
    setTab(t);
    setServerError('');
    reset();
  };

  const onSubmit = async ({ email, password }: FormValues) => {
    setServerError('');
    try {
      const res = tab === 'admin'
        ? await loginAdmin(email, password)
        : await loginAgent(email, password);
      login(res.token, res.user);
      router.replace(res.user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1a1f2e' }}>
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#c9a84c' }}>Real Capital</h1>
          <p className="mt-1 text-sm" style={{ color: '#8892a4' }}>Portal Access</p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: '#242938', border: '1px solid #2e3446' }}>
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #2e3446' }}>
            {(['agent', 'admin'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-4 text-sm font-semibold transition-colors capitalize"
                style={{
                  color: tab === t ? '#c9a84c' : '#8892a4',
                  borderBottom: tab === t ? '2px solid #c9a84c' : '2px solid transparent',
                  background: 'transparent',
                }}
              >
                {t === 'admin' ? 'Admin' : 'Agent'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: '#1a1f2e',
                  border: errors.email ? '1px solid #e74c3c' : '1px solid #2e3446',
                  color: '#e6edf3',
                }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: '#1a1f2e',
                  border: errors.password ? '1px solid #e74c3c' : '1px solid #2e3446',
                  color: '#e6edf3',
                }}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c' }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ background: '#c9a84c', color: '#1a1f2e' }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>

            {tab === 'agent' && (
              <p className="text-center text-sm" style={{ color: '#8892a4' }}>
                Not registered?{' '}
                <a href="/signup" className="font-medium hover:underline" style={{ color: '#c9a84c' }}>
                  Apply as an Agent
                </a>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
