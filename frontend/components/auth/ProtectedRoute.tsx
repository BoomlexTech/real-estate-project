'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  role: 'admin' | 'agent';
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Logged in but wrong role — send to their own dashboard
    if (user.role !== role) {
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard');
    }
  }, [user, loading, role, router]);

  // Show spinner while resolving auth or while redirecting
  if (loading || !user || user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
