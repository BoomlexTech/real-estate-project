'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 z-50 lg:hidden flex flex-col"
            style={{ background: '#242938' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#3a4058' }}>
              <Image
                src="/pnglogo.png"
                alt="Awtad Real Estate and Brokerage"
                width={130}
                height={54}
                className="object-contain h-9 w-auto"
              />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-3.5 text-white hover:bg-white/5 hover:text-yellow-400 transition-colors text-sm font-medium border-b"
                  style={{ borderColor: '#3a4058' }}
                >
                  {link.label}
                  <ChevronDown className="w-4 h-4 rotate-[-90deg] opacity-40" />
                </Link>
              ))}
            </nav>

            {/* Contact */}
            <div className="p-5 border-t space-y-3" style={{ borderColor: '#3a4058' }}>
              <a href="tel:+971547093295" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <span>📞</span> +971 54 709 3295
              </a>
              <a href="mailto:leasing@awtadrealestate.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <span>✉️</span> leasing@awtadrealestate.com
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
