import { getDevelopers } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default async function DevelopersPage() {
  let developers: Awaited<ReturnType<typeof getDevelopers>> = [];
  try {
    developers = await getDevelopers();
  } catch {
    developers = [];
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold t-heading mb-2">Top Developers in Dubai</h1>
        <p className="t-secondary mb-10">Explore projects from the region&apos;s leading developers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <Link
              key={dev.id}
              href={`/developers/${dev.slug}`}
              className="group block p-6 rounded-2xl transition-all hover:scale-[1.02] card-white"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,169,110,0.28)' }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 relative" style={{ background: 'var(--bg-primary)' }}>
                {dev.logo && (
                  <Image src={dev.logo} alt={dev.name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <h3 className="t-heading text-lg font-bold group-hover:text-yellow-400 transition-colors">
                {dev.name}
              </h3>
              <p className="t-secondary text-sm mt-1 line-clamp-2">{dev.description}</p>
              <p className="text-sm mt-3 t-accent">
                {dev.properties} Projects
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
