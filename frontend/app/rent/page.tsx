import Link from 'next/link';

export const metadata = {
  title: 'Rent Property in Dubai',
  description: 'Find properties for rent in Dubai. Apartments, villas, studios and more with Awtad Real Estate.',
};

export default function RentPage() {
  const locations = [
    { label: 'Dubai Marina', count: '340+' },
    { label: 'Downtown Dubai', count: '280+' },
    { label: 'JVC', count: '420+' },
    { label: 'Business Bay', count: '360+' },
    { label: 'Palm Jumeirah', count: '120+' },
    { label: 'JBR', count: '180+' },
  ];

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 py-16 text-center" style={{ background: 'var(--bg-secondary)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>FOR RENT</p>
        <h1 className="text-4xl font-bold text-white mb-4">Rent Property in Dubai</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Find your ideal rental property in Dubai&apos;s most sought-after neighborhoods. Annual and monthly options available.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-white mb-6">Popular Rental Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {locations.map((loc) => (
            <Link
              key={loc.label}
              href={`/property?status=for-rent&location=${loc.label.toLowerCase().replace(/\s/g, '-')}`}
              className="card-dark p-5 text-center hover:border-yellow-500/40 transition-all group block"
            >
              <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">{loc.label}</p>
              <p className="text-gray-500 text-xs mt-1">{loc.count} rentals</p>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/property?status=for-rent" className="btn-gold inline-flex">
            Browse All Rentals →
          </Link>
        </div>
      </div>
    </div>
  );
}
