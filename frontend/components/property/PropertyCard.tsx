'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Maximize2, Phone } from 'lucide-react';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  'for-sale': { bg: '#1d4ed8', text: '#fff' },
  'for-rent': { bg: '#059669', text: '#fff' },
  'off-plan': { bg: '#7c3aed', text: '#fff' },
  'ready': { bg: '#c9a84c', text: '#1a1f2e' },
};

const statusLabels: Record<string, string> = {
  'for-sale': 'FOR SALE',
  'for-rent': 'FOR RENT',
  'off-plan': 'OFF-PLAN',
  'ready': 'READY',
};

const typeLabels: Record<string, string> = {
  apartment: 'APT',
  villa: 'VILLA',
  penthouse: 'PH',
  townhouse: 'TH',
  studio: 'STUDIO',
  mansion: 'MANSION',
  plot: 'PLOT',
  commercial: 'COMM',
};

// Fallback SVG placeholder when no images available
function PlaceholderImage({ type, status }: { type: string; status: string }) {
  const colors: Record<string, [string, string]> = {
    apartment: ['#0f1829', '#1a2a4a'],
    villa: ['#0a1a10', '#152a1e'],
    penthouse: ['#1a0f29', '#2a1a4a'],
    townhouse: ['#1a150f', '#2a2015'],
    studio: ['#0f1520', '#1a2030'],
    mansion: ['#1a1015', '#2a1520'],
    plot: ['#101a0f', '#1a2a15'],
    commercial: ['#0f1020', '#1a2030'],
  };
  const [c1, c2] = colors[type] || colors.apartment;

  return (
    <div
      className="w-full h-48 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
    >
      <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-50">
        <rect x="60" y="60" width="50" height="140" fill="rgba(255,255,255,0.06)" />
        <rect x="120" y="30" width="80" height="170" fill="rgba(255,255,255,0.08)" />
        <rect x="210" y="70" width="50" height="130" fill="rgba(255,255,255,0.05)" />
        <rect x="270" y="50" width="70" height="150" fill="rgba(255,255,255,0.07)" />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={125 + c * 22} y={40 + r * 38} width="12" height="22" fill="rgba(201,168,76,0.35)" rx="1" />
          ))
        )}
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{ background: 'linear-gradient(to top, rgba(45,51,71,0.9), transparent)' }}
      />
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span
          className="px-2 py-0.5 text-xs font-bold rounded"
          style={{ background: statusColors[status]?.bg || '#c9a84c', color: statusColors[status]?.text || '#1a1f2e' }}
        >
          {statusLabels[status] || status.toUpperCase()}
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <span
          className="px-2 py-0.5 text-xs font-medium rounded"
          style={{ background: 'rgba(0,0,0,0.5)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {typeLabels[type] || type.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// Auto-playing image carousel
function CardCarousel({ images, type, status }: { images: string[]; type: string; status: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  if (!images || images.length === 0) {
    return <PlaceholderImage type={type} status={status} />;
  }

  return (
    <div
      className="relative w-full h-48 overflow-hidden bg-[#0f1829]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(26,31,46,0.65) 0%, transparent 50%)' }}
      />

      {/* Status badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="px-2 py-0.5 text-xs font-bold rounded"
          style={{ background: statusColors[status]?.bg || '#c9a84c', color: statusColors[status]?.text || '#1a1f2e' }}
        >
          {statusLabels[status] || status.toUpperCase()}
        </span>
      </div>

      {/* Type badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="px-2 py-0.5 text-xs font-medium rounded"
          style={{ background: 'rgba(0,0,0,0.55)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {typeLabels[type] || type.toUpperCase()}
        </span>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '16px' : '6px',
                height: '6px',
                background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.45)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div
      className="property-card group rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: '#2d3347', border: '1px solid rgba(201,168,76,0.45)' }}
    >
      {/* Carousel */}
      <Link href={`/property/${property.slug}`} className="block overflow-hidden">
        <CardCarousel
          images={property.images ?? []}
          type={property.type}
          status={property.status}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <MapPin className="w-3 h-3" style={{ color: '#c9a84c' }} />
          <span>{property.location}, {property.emirate}</span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold mb-1" style={{ color: '#c9a84c' }}>
          {property.priceLabel}
        </p>

        {/* Title */}
        <Link href={`/property/${property.slug}`}>
          <h3 className="text-white font-semibold text-sm mb-3 line-clamp-2 hover:text-yellow-400 transition-colors leading-snug">
            {property.title}
          </h3>
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 pb-3" style={{ borderBottom: '1px solid #3a4058' }}>
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            <span>{property.bedrooms} BR</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-gray-500">{property.developer}</span>
          </div>
        </div>

        {/* Payment plan / completion */}
        {(property.paymentPlan || property.completionDate) && (
          <div className="flex gap-2 mb-3">
            {property.paymentPlan && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}
              >
                {typeof property.paymentPlan === 'object'
                  ? `${property.paymentPlan.downPayment}/${property.paymentPlan.onCompletion} Plan`
                  : `${property.paymentPlan}% Plan`}
              </span>
            )}
            {property.completionDate && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {property.completionDate}
              </span>
            )}
          </div>
        )}

        {/* Agent */}
        {property.agent && (
          <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid #3a4058' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: 'rgba(201,168,76,0.2)', color: '#c9a84c' }}
              >
                {property.agent.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-300 truncate max-w-20">{property.agent.name}</span>
            </div>
            <div className="flex gap-1.5">
              <a
                href={`tel:${property.agent.phone}`}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#3a4058' }}
                title="Call"
              >
                <Phone className="w-3.5 h-3.5 text-gray-300" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
