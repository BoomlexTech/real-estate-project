import Link from 'next/link';

export const metadata = {
  title: 'Buy Property in Dubai',
  description: 'Find properties for sale in Dubai. Apartments, villas, penthouses and more with Real Capital.',
};

export default function BuyPage() {
  const types = [
    { label: 'Apartments', href: '/property/apartment', count: '1,200+' },
    { label: 'Villas', href: '/property/villa', count: '430+' },
    { label: 'Penthouses', href: '/property/penthouse', count: '85+' },
    { label: 'Townhouses', href: '/property/townhouse', count: '320+' },
    { label: 'Studios', href: '/property/studio', count: '680+' },
    { label: 'Mansions', href: '/property/mansion', count: '40+' },
  ];

  return (
    <div className="min-h-screen pt-24" style={{ background: '#1a1f2e' }}>
      {/* Hero */}
      <div className="px-4 py-16 text-center" style={{ background: '#242938' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>FOR SALE</p>
        <h1 className="text-4xl font-bold text-white mb-4">Buy Property in Dubai</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Explore thousands of properties for sale across Dubai. From affordable studios to ultra-luxury mansions, find your perfect match.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-white mb-6">Browse by Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {types.map((t) => (
            <Link
              key={t.href}
              href={`${t.href}?status=for-sale`}
              className="card-dark p-5 text-center hover:border-yellow-500/40 transition-all group block"
            >
              <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">{t.label}</p>
              <p className="text-gray-500 text-xs mt-1">{t.count} listings</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/property?status=for-sale" className="btn-gold inline-flex">
            Browse All Properties For Sale →
          </Link>
        </div>
      </div>
    </div>
  );
}
