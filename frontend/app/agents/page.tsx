import { getAgents } from '@/lib/api';
import type { Agent } from '@/lib/types';
import Link from 'next/link';
import { Phone, Globe, MapPin } from 'lucide-react';

export default async function AgentsPage() {
  let agents: Agent[] = [];
  try {
    agents = await getAgents();
  } catch {
    agents = [];
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.28em] uppercase mb-4 t-accent">
            Our Team
          </p>
          <span className="section-divider mb-5" />
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light t-heading leading-tight">
            Meet Our Agents
          </h1>
          <p className="text-sm tracking-wide mt-3 t-secondary">
            Experienced real estate professionals — multilingual, market-savvy, results-driven.
          </p>
        </div>

        {agents.length === 0 ? (
          <div
            className="p-16 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,169,110,0.15)' }}
          >
            <p className="font-serif text-xl font-light t-heading mb-2">No agents available</p>
            <p className="text-sm t-secondary">Check back soon.</p>
          </div>
        ) : (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="group relative p-7 transition-colors"
                style={{ background: 'var(--bg-card)' }}
              >
                {/* Stretched link covers entire card */}
                <Link href={`/agents/${agent.id}`} className="absolute inset-0" aria-label={`View ${agent.name}'s profile`} />

                <div className="flex items-start gap-5 mb-6">
                  {/* Square avatar */}
                  <div
                    className="w-16 h-16 shrink-0 overflow-hidden flex items-center justify-center text-xl font-serif font-light t-accent"
                    style={{ border: '1px solid rgba(201,169,110,0.38)', background: 'var(--bg-primary)' }}
                  >
                    {agent.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      agent.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-light t-heading mb-1 leading-snug transition-colors group-hover:text-gold">
                      {agent.name}
                    </h3>
                    {agent.bio && (
                      <p className="text-xs leading-relaxed line-clamp-2 t-secondary">
                        {agent.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="flex flex-col gap-2 text-xs tracking-wide pb-5 mb-5 t-secondary"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  {agent.languages && agent.languages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe size={11} className="t-accent" />
                      <span>{agent.languages.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="t-accent" />
                    <span>{agent.properties} Active Listings</span>
                  </div>
                </div>

                {/* Buttons — relative + z-10 to sit above the stretched link */}
                <div className="relative z-10 flex gap-2">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="flex-1 flex items-center justify-center py-2 text-[10px] tracking-[0.16em] uppercase font-medium badge-gold"
                  >
                    View Profile
                  </Link>
                  <a
                    href={`https://wa.me/${(agent.phone || '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: '#25D366' }}
                    title="WhatsApp agent"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                  <a
                    href={`tel:${agent.phone || ''}`}
                    className="w-11 h-11 flex items-center justify-center transition-colors t-accent"
                    style={{ border: '1px solid rgba(201,169,110,0.38)' }}
                    title="Call agent"
                  >
                    <Phone size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
