'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  MessageSquare,
  Home,
  BookOpen,
  LogOut,
  Menu,
  X,
  Settings,
  Star,
  TrendingUp,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { getDashboardStats } from '@/lib/adminApi';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { palette } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAgents, setPendingAgents] = useState(0);

  useEffect(() => {
    getDashboardStats()
      .then((s) => setPendingAgents(s.pendingAgents))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Agents', href: '/admin/agents', icon: <Users size={18} />, badge: pendingAgents },
    { label: 'Properties', href: '/admin/properties', icon: <Building2 size={18} /> },
    { label: 'Inquiries', href: '/admin/inquiries', icon: <FileText size={18} /> },
    { label: 'Contact Messages', href: '/admin/contact-messages', icon: <MessageSquare size={18} /> },
    { label: 'Property Inquiries', href: '/admin/property-inquiries', icon: <Home size={18} /> },
    { label: 'Blog Posts', href: '/admin/blogs', icon: <BookOpen size={18} /> },
    { label: 'Agent Reviews', href: '/admin/reviews', icon: <Star size={18} /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <TrendingUp size={18} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const Sidebar = (
    <aside
      className="flex flex-col h-full"
      style={{ background: palette.cardBg, borderRight: `1px solid ${palette.border}`, width: 240 }}
    >
      {/* Brand */}
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${palette.border}` }}>
        <span className="text-xl font-bold" style={{ color: palette.gold }}>Awtad Real Estate</span>
        <p className="text-xs mt-0.5" style={{ color: palette.textSecondary }}>Admin Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
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
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#e74c3c', color: '#fff', minWidth: 20, textAlign: 'center' }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme + Logout */}
      <div className="px-3 pb-6" style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 16 }}>
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs" style={{ color: palette.textSecondary }}>Theme</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: palette.textSecondary }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <ProtectedRoute role="admin">
      <div className="flex h-screen overflow-hidden" style={{ background: palette.pageBg }}>
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col shrink-0" style={{ width: 240 }}>
          {Sidebar}
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="shrink-0"
              style={{ width: 240 }}
            >
              {Sidebar}
            </div>
            <div
              className="flex-1"
              style={{ background: 'var(--overlay-bg)' }}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar (mobile only) */}
          <div
            className="md:hidden flex items-center gap-3 px-4 py-3"
            style={{ background: palette.cardBg, borderBottom: `1px solid ${palette.border}` }}
          >
            <button onClick={() => setSidebarOpen(true)} style={{ color: palette.textSecondary }}>
              <Menu size={22} />
            </button>
            <span className="font-bold text-sm flex-1" style={{ color: palette.gold }}>Awtad Real Estate Admin</span>
            <ThemeToggle />
          </div>

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
