'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Phone, Facebook, Instagram, Linkedin, Youtube, ChevronDown } from 'lucide-react';
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
        borderBottom: '1px solid rgba(201,168,76,0.45)',
        }}
      >
        {/* Top Bar */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs border-b"
          style={{ borderColor: '#2d3347', background: 'rgba(20,25,40,0.9)' }}
        >
          <div className="flex items-center gap-5">
            <a href="https://faq.whatsapp.com/5913398998672934" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            <a href="tel:+971547093295" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              +971 54 709 3295
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
