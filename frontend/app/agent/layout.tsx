'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, PlusCircle, LogOut, Menu } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/agent/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Properties', href: '/agent/properties', icon: <Building2 size={18} /> },
    { label: 'Add Property', href: '/agent/properties/new', icon: <PlusCircle size={18} /> },
  ];

  const Sidebar = (
    <aside
      className="flex flex-col h-full"
      style={{ background: '#242938', borderRight: '1px solid #2e3446', width: 240 }}
    >
      {/* Brand */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #2e3446' }}>
        <span className="text-xl font-bold" style={{ color: '#c9a84c' }}>Awtad Real Estate</span>
        <p className="text-xs mt-0.5" style={{ color: '#8892a4' }}>Agent Portal</p>
      </div>

      {/* Agent name */}
      {user && (
        <div className="px-6 py-3" style={{ borderBottom: '1px solid #2e3446' }}>
          <p className="text-xs font-medium" style={{ color: '#8892a4' }}>Logged in as</p>
          <p className="text-sm font-semibold truncate mt-0.5" style={{ color: '#c9d1d9' }}>{user.name || user.email}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href ||
            (item.href === '/agent/properties' && pathname.startsWith('/agent/properties') && pathname !== '/agent/properties/new');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? '#c9a84c' : '#8892a4',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6" style={{ borderTop: '1px solid #2e3446', paddingTop: 16 }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#8892a4' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <ProtectedRoute role="agent">
      <div className="flex h-screen overflow-hidden" style={{ background: '#1a1f2e' }}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col flex-shrink-0" style={{ width: 240 }}>
          {Sidebar}
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="flex-shrink-0" style={{ width: 240 }}>{Sidebar}</div>
            <div
              className="flex-1"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar mobile */}
          <div
            className="md:hidden flex items-center gap-3 px-4 py-3"
            style={{ background: '#242938', borderBottom: '1px solid #2e3446' }}
          >
            <button onClick={() => setSidebarOpen(true)} style={{ color: '#8892a4' }}>
              <Menu size={22} />
            </button>
            <span className="font-bold text-sm" style={{ color: '#c9a84c' }}>Awtad Real Estate Agent</span>
          </div>

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
