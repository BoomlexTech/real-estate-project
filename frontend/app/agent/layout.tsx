'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, PlusCircle, LogOut, Menu, User, MessageSquare, FileText } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
// import ThemeToggle from '@/components/common/ThemeToggle';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { palette } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navItems = [
    { label: 'Dashboard',     href: '/agent/dashboard',      icon: <LayoutDashboard size={18} /> },
    { label: 'My Properties', href: '/agent/properties',     icon: <Building2 size={18} /> },
    { label: 'Inquiries',     href: '/agent/inquiries',      icon: <MessageSquare size={18} /> },
    { label: 'My Blogs',      href: '/agent/blogs',          icon: <FileText size={18} /> },
    { label: 'Add Property',  href: '/agent/properties/new', icon: <PlusCircle size={18} /> },
    { label: 'Profile',       href: '/agent/profile',        icon: <User size={18} /> },
  ];

  const Sidebar = (
    <aside
      className="flex flex-col h-full"
      style={{ background: palette.cardBg, borderRight: `1px solid ${palette.border}`, width: 240 }}
    >
      {/* Brand */}
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${palette.border}` }}>
        <span className="text-xl font-bold" style={{ color: palette.gold }}>Awtad Real Estate</span>
        <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>Agent Portal</p>
      </div>

      {/* Agent name */}
      {user && (
        <div className="px-6 py-3" style={{ borderBottom: `1px solid ${palette.border}` }}>
          <p className="text-xs font-medium" style={{ color: palette.textSecondary }}>Logged in as</p>
          <p className="text-sm font-semibold truncate mt-0.5" style={{ color: palette.textPrimary }}>{user.name || user.email}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href ||
            (item.href === '/agent/properties' && pathname.startsWith('/agent/properties') && pathname !== '/agent/properties/new') ||
            (item.href === '/agent/blogs' && pathname.startsWith('/agent/blogs'));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? palette.gold : palette.textSecondary,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme + Logout */}
      <div className="px-3 pb-6" style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 16 }}>
        {/* <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs" style={{ color: palette.textSecondary }}>Theme</span>
          <ThemeToggle />
        </div> */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: palette.textSecondary }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <ProtectedRoute role="agent">
      <div className="flex h-screen overflow-hidden" style={{ background: palette.pageBg }}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col shrink-0" style={{ width: 240 }}>
          {Sidebar}
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="shrink-0" style={{ width: 240 }}>{Sidebar}</div>
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
            style={{ background: palette.cardBg, borderBottom: `1px solid ${palette.border}` }}
          >
            <button onClick={() => setSidebarOpen(true)} style={{ color: palette.textSecondary }}>
              <Menu size={22} />
            </button>
            <span className="font-bold text-sm flex-1" style={{ color: palette.gold }}>Awtad Real Estate Agent</span>
            {/* <ThemeToggle /> */}
          </div>

          <main className="flex-1 overflow-y-auto p-3 sm:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
