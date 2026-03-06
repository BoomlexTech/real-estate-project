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
                    className="flex-1 text-center py-2 text-[10px] tracking-[0.16em] uppercase font-medium badge-gold"
                  >
                    View Profile
                  </Link>
                  <a
                    href="tel:+971547093295"
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
