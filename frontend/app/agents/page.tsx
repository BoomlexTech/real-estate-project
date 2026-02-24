import { getAgents } from '@/lib/api';
import type { Agent } from '@/lib/types';
import Image from 'next/image';

export default async function AgentsPage() {
  let agents: Agent[] = [];
  try {
    agents = await getAgents();
  } catch {
    agents = [];
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#1a1f2e' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Agents</h1>
        <p className="text-gray-400 mb-10">Meet our experienced real estate professionals</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-2xl"
              style={{ background: '#232838', border: '1px solid #2d3348' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative" style={{ background: '#1a1f2e' }}>
                  {agent.photo && (
                    <Image src={agent.photo} alt={agent.name} fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{agent.name}</h3>
                  <p className="text-gray-400 text-sm">{agent.bio}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Languages:</span>{' '}
                  <span className="text-white">{agent.languages.join(', ')}</span>
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Active Listings:</span>{' '}
                  <span className="text-white">{agent.properties}</span>
                </p>
              </div>

              <div className="flex gap-3 mt-5">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex-1 text-center py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                  style={{ background: '#c9a84c' }}
                >
                  Call
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex-1 text-center py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-white/5"
                  style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
                >
                  Email
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
