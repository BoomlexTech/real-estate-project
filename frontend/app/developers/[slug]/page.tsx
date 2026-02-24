import { getDeveloper } from '@/lib/api';
import PropertyGrid from '@/components/property/PropertyGrid';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let developer;
  try {
    developer = await getDeveloper(slug);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#1a1f2e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0" style={{ background: '#232838' }}>
            {developer.logo && (
              <Image src={developer.logo} alt={developer.name} fill className="object-cover" sizes="80px" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{developer.name}</h1>
            <p className="text-gray-400 mt-2 max-w-2xl">{developer.description}</p>
            {developer.website && (
              <Link href={developer.website} target="_blank" className="text-sm mt-2 inline-block" style={{ color: '#c9a84c' }}>
                Visit Website →
              </Link>
            )}
          </div>
        </div>

        {/* Properties */}
        <h2 className="text-2xl font-bold text-white mb-6">Properties by {developer.name}</h2>
        {developer.projects.length > 0 ? (
          <PropertyGrid
            properties={developer.projects}
            page={1}
            totalPages={1}
          />
        ) : (
          <p className="text-gray-400">No properties listed yet.</p>
        )}
      </div>
    </main>
  );
}
