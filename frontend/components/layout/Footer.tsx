'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const emirates = [
  { label: 'Properties in Dubai', href: '/property?emirate=dubai' },
  { label: 'Properties in Abu Dhabi', href: '/property?emirate=abu-dhabi' },
  { label: 'Properties in Sharjah', href: '/property?emirate=sharjah' },
  { label: 'Properties in Ajman', href: '/property?emirate=ajman' },
  { label: 'Properties in Ras Al Khaimah', href: '/property?emirate=rak' },
  { label: 'See All', href: '/property' },
];

const developers = [
  { label: 'Emaar', href: '/developers/emaar' },
  { label: 'Damac', href: '/developers/damac' },
  { label: 'Dubai Properties', href: '/developers/dubai-properties' },
  { label: 'Meraas', href: '/developers/meraas' },
  { label: 'Dubai Holding', href: '/developers/dubai-holding' },
];

const propertyTypes = [
  { label: 'Apartment', href: '/property/apartment' },
  { label: 'Penthouses', href: '/property/penthouse' },
  { label: 'Villas', href: '/property/villa' },
  { label: 'Duplexes', href: '/property/duplex' },
  { label: 'Townhouses', href: '/property/townhouse' },
  { label: 'Studios', href: '/property/studio' },
  { label: 'Commercial', href: '/property/commercial' },
  { label: 'See All', href: '/property' },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/agent')) return null;

  return (
    <footer style={{ background: '#0f1320', borderTop: '1px solid #2d3347' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Logo + Description */}
          <div className="lg:col-span-1">
            <div className="mb-4 inline-flex bg-white rounded-md px-2 py-1.5">
              <Image
                src="/logo2.png"
                alt="Awtad Real Estate and Brokerage"
                width={140}
                height={58}
                className="object-contain h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Dubai&apos;s leading luxury real estate agency. We help clients buy, sell, and invest in premium properties across the UAE.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: 'https://facebook.com' },
                { Icon: Instagram, href: 'https://instagram.com' },
                { Icon: Linkedin, href: 'https://linkedin.com' },
                { Icon: Youtube, href: 'https://youtube.com' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: '#2d3347' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#c9a84c')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2d3347')}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Popular Emirates */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Popular Emirates</h4>
            <ul className="space-y-2">
              {emirates.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Developers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Developers</h4>
            <ul className="space-y-2">
              {developers.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Property Types */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Popular Projects</h4>
            <ul className="space-y-2">
              {propertyTypes.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-gray-400 text-xs leading-relaxed">Office 2301, Vision Tower, Business Bay, PO Box 445372, Dubai, UAE</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-gray-400 text-xs leading-relaxed">Office 1102, Tower B, Prime Business Centre, JVC, Dubai, UAE</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-gray-400 text-xs leading-relaxed">Ground Floor, Namaa Building, Rashideya, Behind Grand Mall, Ajman, UAE</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#c9a84c' }} />
                <a href="tel:+971547093295" className="text-gray-400 hover:text-white text-xs transition-colors">+971 54 709 3295</a>
              </div>
              <div className="flex gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#c9a84c' }} />
                <a href="mailto:leasing@awtadrealestate.com" className="text-gray-400 hover:text-white text-xs transition-colors">leasing@awtadrealestate.com</a>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['Feefo', 'Google ★★★★★', 'Great Place to Work'].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-2 py-1 rounded border text-gray-400"
                  style={{ borderColor: '#3a4058', background: '#1a1f2e' }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t px-4 py-4"
        style={{ borderColor: '#2d3347' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {currentYear} AWTAD REAL ESTATE All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">TERMS & CONDITIONS</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">PRIVACY & POLICY</Link>
            <Link href="/career" className="hover:text-gray-300 transition-colors">CAREER</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
