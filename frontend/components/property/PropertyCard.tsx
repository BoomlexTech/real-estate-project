'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Maximize2, Phone } from 'lucide-react';
import { Property } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface PropertyCardProps {
  property: Property;
}

const statusLabels: Record<string, string> = {
  'for-sale': 'For Sale',
  'for-rent': 'For Rent',
  'off-plan': 'Off-Plan',
  ready: 'Ready',
  sold: 'Sold',
  rented: 'Rented',
};

const typeLabels: Record<string, string> = {
  apartment: 'APMT',
  villa: 'VILLA',
  penthouse: 'PENT',
  townhouse: 'TOWN',
  studio: 'STUDIO',
  duplex: 'DUPLEX',
  mansion: 'MANSION',
  plot: 'PLOT',
  commercial: 'COMM',
};

function PlaceholderImage({ type }: { type: string }) {
  const colors: Record<string, [string, string]> = {
    apartment: ['#0A0E1A', '#111827'],
    villa: ['#080f0d', '#0f1a14'],
    penthouse: ['#0f0a1a', '#1a1127'],
    townhouse: ['#111008', '#1a1a10'],
    studio: ['#080f18', '#0f1a27'],
    mansion: ['#100809', '#1a0f10'],
    plot: ['#091008', '#0f1a10'],
    commercial: ['#08090f', '#0f1027'],
  };
  const [c1, c2] = colors[type] || colors.apartment;

  return (
    <div
      className="w-full aspect-video relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
    >
      <svg viewBox="0 0 400 225" className="absolute inset-0 w-full h-full opacity-40">
        <rect x="60" y="40" width="50" height="185" fill="rgba(255,255,255,0.04)" />
        <rect x="120" y="15" width="80" height="210" fill="rgba(255,255,255,0.06)" />
        <rect x="210" y="50" width="50" height="175" fill="rgba(255,255,255,0.04)" />
        <rect x="270" y="30" width="70" height="195" fill="rgba(255,255,255,0.05)" />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={125 + c * 22} y={24 + r * 48} width="12" height="22" fill="rgba(201,169,110,0.22)" />
          ))
        )}
      </svg>
    </div>
  );
}

function CardCarousel({ images, type, status }: { images: string[]; type: string; status: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  if (!images || images.length === 0) {
    return <PlaceholderImage type={type} />;
  }

  return (
    <div
      className="relative w-full aspect-video overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
            className="object-cover property-card-img"
          />
        </div>
      ))}

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.7) 0%, transparent 55%)' }}
      />

      {/* Status badge — outline only, no fill */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase rounded"
          style={{ border: '1px solid rgba(201,169,110,0.55)', color: '#C9A96E', background: '#000' }}
        >
          {statusLabels[status] || (status || 'available').toUpperCase()}
        </span>
      </div>

      {/* Type badge — outline, subtle */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase rounded"
          style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: '#000' }}
        >
          {typeLabels[type] || (type || 'property').toUpperCase()}
        </span>
      </div>

      {/* Slide indicators — thin lines */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
              className="transition-all duration-300"
              style={{
                width: i === current ? '18px' : '6px',
                height: '1px',
                background: i === current ? '#C9A96E' : 'rgba(255,255,255,0.38)',
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
      className="property-card-wrapper group flex flex-col h-full transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_50px_rgba(201,169,110,0.45),0_0_100px_rgba(201,169,110,0.18)]"
      style={{ '--tw-ring-color': 'rgba(201,169,110,0.3)' } as React.CSSProperties}
    >
      <div className="property-card-content glass-card flex flex-col flex-1 overflow-hidden">
        {/* Image Carousel */}
        <Link href={`/property/${property.slug}`} className="block overflow-hidden" onClick={() => trackEvent('property_card_click', { property_id: property.id, property_title: property.title, property_type: property.type, property_status: property.status, price: property.price, emirate: property.emirate, bedrooms: property.bedrooms })}>
          <CardCarousel
            images={property.images ?? []}
            type={property.type}
            status={property.status}
          />
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3 h-3 shrink-0" style={{ color: 'var(--gold)' }} />
            <span className="text-xs tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>
              {property.location}, {property.emirate}
            </span>
          </div>

          {/* Price — serif, large, light weight */}
          <p className="font-serif text-2xl font-light mb-1 leading-tight" style={{ color: 'var(--gold)' }}>
            {property.priceLabel}
          </p>

          {/* Title */}
          <Link href={`/property/${property.slug}`} onClick={() => trackEvent('property_card_click', { property_id: property.id, property_title: property.title, property_type: property.type, property_status: property.status, price: property.price, emirate: property.emirate, bedrooms: property.bedrooms })}>
            <h3
              className="text-sm mb-4 line-clamp-2 leading-relaxed tracking-wide transition-colors hover:text-gold"
              style={{ color: 'var(--text-primary)', fontWeight: 400 }}
            >
              {property.title}
            </h3>
          </Link>

          {/* Stats */}
          <div
            className="flex items-center gap-5 text-xs mb-4 pb-4"
            style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <div className="flex items-center gap-1.5">
              <Bed className="w-3 h-3" />
              <span>{property.bedrooms} BR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
            {property.developer && (
              <div className="ml-auto text-[11px] tracking-wide" style={{ color: 'var(--text-secondary)', opacity: 0.65 }}>
                {property.developer}
              </div>
            )}
          </div>

          {/* Payment plan / completion tags */}
          {(property.paymentPlan || property.completionDate) && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {property.paymentPlan && (
                <span
                  className="text-[10px] px-2 py-0.5 tracking-widest uppercase rounded"
                  style={{ border: '1px solid var(--border-gold)', color: 'var(--gold)' }}
                >
                  {typeof property.paymentPlan === 'object'
                    ? `${property.paymentPlan.downPayment}/${property.paymentPlan.onCompletion} Plan`
                    : `${property.paymentPlan}% Plan`}
                </span>
              )}
              {property.completionDate && (
                <span
                  className="text-[10px] px-2 py-0.5 tracking-widest uppercase rounded"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.65)' }}
                >
                  {property.completionDate}
                </span>
              )}
            </div>
          )}

          {/* Agent */}
          {property.agent && (
            <div
              className="flex items-center justify-between mt-auto pt-4"
              style={{ borderTop: '1px solid var(--border-color)' }}
            >
              <Link
                href={`/agents/${property.agent.id}`}
                className="flex items-center gap-2.5 min-w-0 group/agent"
                title={`View ${property.agent.name}'s profile`}
                onClick={() => trackEvent('agent_profile_click', { agent_id: property.agent!.id, agent_name: property.agent!.name, source: 'property_card' })}
              >
                <div
                  className="w-7 h-7 rounded-full overflow-hidden shrink-0 border"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-gold)' }}
                >
                  {property.agent.photo ? (
                    <img src={property.agent.photo} alt={property.agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold" style={{ color: 'var(--gold)' }}>
                      {property.agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-xs tracking-wide truncate max-w-22 transition-colors group-hover/agent:text-gold" style={{ color: 'var(--text-secondary)' }}>
                  {property.agent.name}
                </span>
              </Link>
              <div className="flex gap-2">
                <a
                  href="https://wa.me/971547093295?text=I'm%20interrested%20about%20this%20property"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px' }}
                  title="WhatsApp agent"
                  onClick={() => trackEvent('whatsapp_click', { source: 'property_card', property_id: property.id, agent_name: property.agent!.name })}
                >
                  <svg className="w-3.5 h-3.5 fill-current text-green-500" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px' }}
                  title="Call agent"
                  onClick={() => trackEvent('call_click', { source: 'property_card', property_id: property.id })}
                >
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
