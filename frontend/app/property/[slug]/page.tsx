import { getProperty, getProperties } from '@/lib/api';
import PropertyDetail from '@/components/property/PropertyDetail';
import PropertyGrid from '@/components/property/PropertyGrid';
import { notFound } from 'next/navigation';

// Property type labels for type listing pages
const typeLabels: Record<string, string> = {
  apartment: 'Apartments', penthouse: 'Penthouses', villa: 'Villas',
  duplex: 'Duplexes', townhouse: 'Townhouses', studio: 'Studios',
  plot: 'Plots', mansion: 'Mansions', 'hotel-apartment': 'Hotel Apartments',
  'sky-villa': 'Sky Villas', 'full-floor': 'Full Floor', 'half-floor': 'Half Floor',
  'premium-villa': 'Premium Villas', 'apartment-private-pool': 'Apartments with Private Pool',
  'studio-pool': 'Studios with Pool', 'simplex-sea-views': 'Simplex Sea Views',
  'twin-villa': 'Twin Villas', 'standalone-villa': 'Standalone Villas',
  'duplex-maid': 'Duplex + Maid', 'apartment-maid': 'Apartment + Maid',
  'semi-detached': 'Semi Detached', suite: 'Suites', 'sky-mansion': 'Sky Mansions',
  'villa-basement': 'Villa + Basement', office: 'Offices', commercial: 'Commercial Properties',
};

const knownTypes = Object.keys(typeLabels);

export default async function PropertySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check if slug is a property type → show listing
  if (knownTypes.includes(slug)) {
    let result;
    try {
      result = await getProperties({ type: slug, limit: 20 });
    } catch {
      result = { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }

    return (
      <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#0A0E1A' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {typeLabels[slug] || slug}
          </h1>
          <p className="text-gray-400 mb-8">{result.total} properties found</p>
          <PropertyGrid
            properties={result.data}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
          />
        </div>
      </main>
    );
  }

  // Otherwise, show property detail
  try {
    const property = await getProperty(slug);
    return <PropertyDetail property={property} />;
  } catch {
    notFound();
  }
}
