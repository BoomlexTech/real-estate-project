'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, ChevronDown } from 'lucide-react';
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

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/agent')) return null;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(26,31,46,0.98)' : 'rgba(26,31,46,0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Top Bar */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs border-b"
          style={{ borderColor: '#2d3347', background: 'rgba(20,25,40,0.9)' }}
        >
          <div className="flex items-center gap-5">
            <a href="mailto:info@realcapital.ae" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
              <Mail className="w-3 h-3" />
              info@realcapital.ae
            </a>
            <a href="tel:+97143456789" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              +971 4 345 6789
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400 cursor-pointer hover:text-white transition-colors">
              <span>🇬🇧</span>
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link px-3 xl:px-4 py-1 text-xs xl:text-sm whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
