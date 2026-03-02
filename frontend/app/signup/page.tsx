'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { registerAgent, RegisterAgentPayload } from '@/lib/authApi';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  languages: string;
  specialization: string;
  bio: string;
}

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    const payload: RegisterAgentPayload = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
      languages: values.languages
        ? values.languages.split(',').map((l) => l.trim()).filter(Boolean)
        : undefined,
      specialization: values.specialization || undefined,
      bio: values.bio || undefined,
    };
    try {
      await registerAgent(payload);
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md text-center space-y-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
            style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid #c9a84c' }}
          >
            ✓
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Application Submitted!</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your agent application has been received. An admin will review and approve your account
            shortly. You&apos;ll be able to log in once approved.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-block px-8 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#c9a84c', color: '#1a1f2e' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#c9a84c' }}>Awtad Real Estate</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Agent Application</p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="px-8 pt-6 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Create Agent Account</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Your application will be reviewed by an admin before activation.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            {/* Row: name + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: errors.name ? '1px solid #e74c3c' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Email <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: errors.email ? '1px solid #e74c3c' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
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
            </div>

            {/* Row: password + confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Password <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: errors.password ? '1px solid #e74c3c' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Confirm Password <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: errors.confirmPassword ? '1px solid #e74c3c' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === watch('password') || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>Phone</label>
              <input
                type="tel"
                placeholder="+971 50 000 0000"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                {...register('phone')}
              />
            </div>

            {/* Row: languages + specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Languages
                </label>
                <input
                  type="text"
                  placeholder="English, Arabic, Russian"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  {...register('languages')}
                />
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Comma-separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="Luxury Villas, Off-Plan…"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  {...register('specialization')}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-body)' }}>Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about your experience…"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                {...register('bio')}
              />
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
              {isSubmitting ? 'Submitting…' : 'Submit Application'}
            </button>

            <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <a href="/login" className="font-medium hover:underline" style={{ color: '#c9a84c' }}>
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
