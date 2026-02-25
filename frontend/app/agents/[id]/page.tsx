import { getAgent } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/property/PropertyCard';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import type { Agent, Property } from '@/lib/types';

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let agent: Agent;
  let properties: Property[];

  try {
    const data = await getAgent(id);
    agent = data.agent;
    properties = data.properties;
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#0A0E1A' }}>
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase mb-10 pb-0.5 transition-opacity hover:opacity-70"
          style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
        >
          ← Back to All Agents
        </Link>

        {/* Agent Header Card */}
        <div
          className="p-8 mb-12"
          style={{ background: '#111827', border: '1px solid rgba(201,169,110,0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar — square */}
            <div
              className="w-28 h-28 shrink-0 overflow-hidden flex items-center justify-center text-4xl font-serif font-light"
              style={{ border: '2px solid rgba(201,169,110,0.55)', color: '#C9A96E', background: '#0A0E1A' }}
            >
              {agent!.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agent!.photo} alt={agent!.name} className="w-full h-full object-cover" />
              ) : (
                agent!.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: '#C9A96E' }}>
                Real Estate Agent
              </p>
              <span className="section-divider mb-4" style={{ display: 'inline-block' }} />
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-white mb-4 leading-tight">
                {agent!.name}
              </h1>
              {agent!.bio && (
                <p className="text-sm leading-[1.85] tracking-wide mb-6 max-w-2xl" style={{ color: '#94A3B8' }}>
                  {agent!.bio}
                </p>
              )}

              {/* Details */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
                {agent!.languages && agent!.languages.length > 0 && (
                  <div className="flex items-center gap-2 text-xs tracking-wide" style={{ color: '#94A3B8' }}>
                    <Globe size={12} style={{ color: '#C9A96E' }} />
                    <span>{agent!.languages.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs tracking-wide" style={{ color: '#94A3B8' }}>
                  <MapPin size={12} style={{ color: '#C9A96E' }} />
                  <span>{agent!.properties} Active Listings</span>
                </div>
                <div className="flex items-center gap-2 text-xs tracking-wide" style={{ color: '#94A3B8' }}>
                  <Mail size={12} style={{ color: '#C9A96E' }} />
                  <span>leasing@awtadrealestate.com</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+971547093295"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.16em] uppercase font-medium transition-all"
                  style={{ background: '#C9A96E', color: '#0A0E1A' }}
                >
                  <Phone size={13} />
                  Call Agent
                </a>
                <a
                  href="https://wa.me/971547093295?text=Hi%2C%20I%27m%20interested%20in%20your%20listings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.16em] uppercase font-medium transition-colors"
                  style={{ border: '1px solid rgba(201,169,110,0.55)', color: '#C9A96E' }}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div>
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Portfolio
            </p>
            <span className="section-divider mb-5" />
            <h2 className="font-serif text-3xl font-light text-white">
              Listings by {agent!.name}
              <span className="text-sm font-sans font-light ml-3" style={{ color: '#94A3B8' }}>
                ({properties!.length})
              </span>
            </h2>
          </div>

          {properties!.length === 0 ? (
            <div
              className="p-12 text-center"
              style={{ background: '#111827', border: '1px solid rgba(201,169,110,0.15)' }}
            >
              <p className="text-sm tracking-wide" style={{ color: '#94A3B8' }}>No listings yet</p>
            </div>
          ) : (
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: 'rgba(201,169,110,0.12)' }}
            >
              {properties!.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
