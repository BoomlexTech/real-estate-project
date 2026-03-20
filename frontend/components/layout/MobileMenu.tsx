'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, ChevronDown } from 'lucide-react';
import Logo from '../common/Logo';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

type NavChild = { label: string; href: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

const navLinks: NavLink[] = [
  { label: 'Off-Plan', href: '/off-plan' },
  {
    label: 'Ready to Move In',
    href: '/ready-to-move',
    children: [
      { label: 'Buy', href: '/buy' },
      { label: 'Rent', href: '/rent' },
    ],
  },
  { label: 'Property', href: '/property' },
  { label: 'Developers', href: '/developers' },
  { label: 'Services', href: '/services' },
  { label: 'Agents', href: '/agents' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socials = [
  { href: 'https://facebook.com', Icon: Facebook, color: '#1877F2' },
  { href: 'https://instagram.com', Icon: Instagram, color: '#E4405F' },
  { href: 'https://linkedin.com', Icon: Linkedin, color: '#0A66C2' },
  { href: 'https://youtube.com', Icon: Youtube, color: '#FF0000' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full z-50 lg:hidden flex flex-col"
            style={{
              width: 'min(85vw, 360px)',
              background: 'var(--bg-primary)',
              borderLeft: '1px solid rgba(201,169,110,0.2)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}
            >
              <Logo />
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center transition-colors"
                style={{ color: 'var(--muted-text)', border: '1px solid var(--muted-border)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#C9A96E';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--muted-text)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--muted-border)';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-3">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href || link.children?.some(c => pathname === c.href);
                const isExpanded = expandedItem === link.href;

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.28 }}
                  >
                    {link.children ? (
                      <>
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : link.href)}
                          className="flex items-center justify-between w-full px-6 py-3.5 min-h-11 text-sm tracking-[0.08em] transition-all"
                          style={{
                            color: isActive ? '#C9A96E' : 'var(--text-secondary)',
                            borderLeft: isActive ? '2px solid #C9A96E' : '2px solid transparent',
                            borderBottom: '1px solid var(--drawer-item-border)',
                          }}
                        >
                          {link.label}
                          <ChevronDown
                            className="w-3.5 h-3.5 transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>
                        {isExpanded && (
                          <div style={{ background: 'var(--drawer-expanded-bg)', borderBottom: '1px solid var(--drawer-item-border)' }}>
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className="flex items-center pl-10 pr-6 py-3.5 min-h-11 text-xs tracking-widest transition-colors"
                                style={{
                                  color: pathname === child.href ? '#C9A96E' : 'var(--text-dim)',
                                  borderBottom: '1px solid var(--drawer-item-subborder)',
                                }}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center px-6 py-3.5 min-h-11 text-sm tracking-[0.08em] transition-all"
                        style={{
                          color: isActive ? '#C9A96E' : 'var(--text-secondary)',
                          borderLeft: isActive ? '2px solid #C9A96E' : '2px solid transparent',
                          borderBottom: '1px solid var(--drawer-item-border)',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = '#C9A96E';
                            (e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(201,169,110,0.5)';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.04)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                            (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-5"
              style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}
            >
              {/* Theme Switcher */}
              <div className="mb-5">
                <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--muted-text)' }}>THEME</p>
                <ThemeSwitcher />
              </div>

              {/* CTA */}
              <Link
                href="/property"
                onClick={onClose}
                className="flex items-center justify-center w-full py-3.5 mb-5 text-[11px] tracking-[0.2em] uppercase transition-all"
                style={{
                  border: '1px solid #C9A96E',
                  color: '#C9A96E',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#C9A96E';
                  (e.currentTarget as HTMLElement).style.color = 'var(--bg-primary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#C9A96E';
                }}
              >
                View All Properties
              </Link>

              {/* Contact */}
              <div className="space-y-2.5 mb-5">
                <a
                  href="tel:+971547093295"
                  className="flex items-center gap-2.5 text-xs transition-colors"
                  style={{ color: 'var(--muted-text)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
                >
                  <Phone className="w-3 h-3 shrink-0" style={{ color: '#C9A96E' }} />
                  +971 54 709 3295
                </a>
                <a
                  href="mailto:leasing@awtadrealestate.com"
                  className="flex items-center gap-2.5 text-xs transition-colors"
                  style={{ color: 'var(--muted-text)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-text)')}
                >
                  <Mail className="w-3 h-3 shrink-0" style={{ color: '#C9A96E' }} />
                  leasing@awtadrealestate.com
                </a>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-4 mt-6">
                {socials.map(({ href, Icon, color }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center w-11 h-11 rounded-full transition-transform hover:scale-110"
                    style={{ background: 'var(--social-icon-bg)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: color }} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
