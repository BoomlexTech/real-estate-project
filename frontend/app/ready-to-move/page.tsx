import Link from 'next/link';

export const metadata = {
  title: 'Ready to Move Properties in Dubai',
  description: 'Find ready to move properties in Dubai. Move in immediately with Awtad Real Estate.',
};

export default function ReadyToMovePage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: '#1a1f2e' }}>
      <div className="px-4 py-16 text-center" style={{ background: '#242938' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>IMMEDIATE POSSESSION</p>
        <h1 className="text-4xl font-bold text-white mb-4">Ready to Move Properties</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          No waiting — move into your new home immediately. Browse our selection of ready-to-move-in properties across Dubai.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="card-dark p-8">
            <h2 className="text-xl font-bold text-white mb-4">Why Choose Ready-to-Move?</h2>
            <ul className="space-y-3">
              {[
                'No construction risk — see exactly what you get',
                'Immediate rental income if investing',
                'Move in the same month as purchase',
                'Already has service charge history',
                'Can view actual unit before buying',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span style={{ color: '#c9a84c' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Popular Areas</h2>
              <div className="grid grid-cols-2 gap-2">
                {['Downtown Dubai', 'Dubai Marina', 'JBR', 'Palm Jumeirah', 'Business Bay', 'DIFC'].map((area) => (
                  <Link
                    key={area}
                    href={`/property?status=ready&location=${area.toLowerCase().replace(/\s/g, '-')}`}
                    className="text-sm text-gray-300 hover:text-yellow-400 transition-colors py-1"
                  >
                    → {area}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/property?status=ready" className="btn-gold mt-6 inline-flex self-start">
              Browse Ready Properties →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
