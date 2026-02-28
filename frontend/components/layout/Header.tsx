'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Phone, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Logo from '../common/Logo';

const navLinks = [
  { label: 'BUY', href: '/buy' },
  { label: 'RENT', href: '/rent' },
  { label: 'OFF-PLAN', href: '/off-plan' },
  { label: 'READY-TO-MOVE', href: '/ready-to-move' },
  { label: 'PROPERTY', href: '/property' },
  { label: 'DEVELOPERS', href: '/developers' },
  { label: 'SERVICES', href: '/services' },
  { label: 'AGENTS', href: '/agents' },
  { label: 'BLOG', href: '/blog' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin') || (pathname?.startsWith('/agent') && !pathname?.startsWith('/agents'))) return null;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-400"
        style={{
          background: scrolled ? 'rgba(10,14,26,0.98)' : 'rgba(10,14,26,0.82)',
          backdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 1px 0 rgba(201,169,110,0.18)' : 'none',
          borderBottom: '1px solid rgba(201,169,110,0.55)',
        }}
      >
        {/* Top Bar */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-2 text-xs border-b"
          style={{ borderColor: 'rgba(201,169,110,0.55)', background: 'rgba(10,14,26,0.55)' }}
        >
          <div className="flex items-center gap-7">
            <a href="https://wa.me/971547093295?text=I'm%20interrested%20about%20this%20property" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.06em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#25D366')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <svg className="w-3.5 h-3.5 fill-current" style={{ color: '#25D366' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </a>
            <a href="tel:+971547093295" className="flex items-center gap-2 transition-colors" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.06em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <Phone className="w-3.5 h-3.5" style={{ color: '#C9A96E' }} />
              +971 54 709 3295
            </a>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-85"
                style={{ background: '#1877F2' }}
              >
                <Facebook className="w-3.5 h-3.5" />
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-85"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-85"
                style={{ background: '#0A66C2' }}
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium transition-opacity hover:opacity-85"
                style={{ background: '#FF0000' }}
              >
                <Youtube className="w-3.5 h-3.5" />
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between px-5 lg:px-8 py-2.5">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
