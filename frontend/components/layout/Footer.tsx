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

  if (pathname?.startsWith('/admin') || (pathname?.startsWith('/agent') && !pathname?.startsWith('/agents'))) return null;

  return (
    <footer style={{ background: '#070B15', borderTop: '1px solid rgba(201,169,110,0.14)' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Col 1: Logo + Description */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/final.png"
                alt="Awtad Real Estate and Brokerage"
                width={140}
                height={58}
                className="object-contain h-10 w-auto"
              />
            </div>
            <p className="text-xs leading-[1.85] mb-5 tracking-wide" style={{ color: '#94A3B8' }}>
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
                  style={{ background: '#1E293B' }}
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
            <h4 className="text-white font-light text-xs mb-5 tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Popular Emirates</h4>
            <ul className="space-y-2">
              {emirates.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs tracking-wide transition-colors" style={{ color: '#94A3B8' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Developers */}
          <div>
            <h4 className="text-white font-light text-xs mb-5 tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Developers</h4>
            <ul className="space-y-2">
              {developers.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs tracking-wide transition-colors" style={{ color: '#94A3B8' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Property Types */}
          <div>
            <h4 className="text-white font-light text-xs mb-5 tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Popular Projects</h4>
            <ul className="space-y-2">
              {propertyTypes.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs tracking-wide transition-colors" style={{ color: '#94A3B8' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-light text-xs mb-5 tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-xs leading-relaxed tracking-wide" style={{ color: '#94A3B8' }}>Office 2301, Vision Tower, Business Bay, PO Box 445372, Dubai, UAE</p>
                </div>
              </div>
              <div className="hidden md:flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-xs leading-relaxed tracking-wide" style={{ color: '#94A3B8' }}>Office 1102, Tower B, Prime Business Centre, JVC, Dubai, UAE</p>
                </div>
              </div>
              <div className="hidden md:flex gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                <div>
                  <p className="text-xs leading-relaxed tracking-wide" style={{ color: '#94A3B8' }}>Ground Floor, Namaa Building, Rashideya, Behind Grand Mall, Ajman, UAE</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#c9a84c' }} />
                <a href="tel:+971547093295" className="text-xs tracking-wide transition-colors" style={{ color: '#94A3B8' }}>+971 54 709 3295</a>
              </div>
              <div className="flex gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#c9a84c' }} />
                <a href="mailto:leasing@awtadrealestate.com" className="text-xs tracking-wide transition-colors" style={{ color: '#94A3B8' }}>leasing@awtadrealestate.com</a>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['Feefo', 'Google ★★★★★', 'Great Place to Work'].map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] px-2 py-1 tracking-[0.1em] rounded"
                  style={{ border: '1px solid rgba(201,169,110,0.18)', color: 'rgba(148,163,184,0.55)', background: 'rgba(201,169,110,0.04)' }}
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
        className="border-t px-4 py-5"
        style={{ borderColor: 'rgba(201,169,110,0.1)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.12em]" style={{ color: 'rgba(148,163,184,0.5)' }}>
            © {currentYear} Awtad Real Estate — All Rights Reserved
          </p>
          <div className="flex items-center gap-6">
            {['Terms & Conditions', 'Privacy Policy', 'Career'].map((label, i) => (
              <Link
                key={i}
                href={i === 0 ? '/terms' : i === 1 ? '/privacy' : '/career'}
                className="text-[10px] tracking-[0.14em] uppercase transition-colors"
                style={{ color: 'rgba(148,163,184,0.45)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,169,110,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.45)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
