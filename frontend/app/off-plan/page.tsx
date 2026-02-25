import Link from 'next/link';

export const metadata = {
  title: 'Off-Plan Properties in Dubai',
  description: 'Invest in off-plan properties in Dubai. Best payment plans and pre-launch prices with Awtad Real Estate.',
};

const projects = [
  { name: 'Binghatti Etherea', location: 'JVC', price: 'AED 765K', plan: '70/30', completion: 'Q4 2027' },
  { name: 'Emaar Creek Waters', location: 'Dubai Creek', price: 'AED 1.2M', plan: '60/40', completion: 'Q2 2027' },
  { name: 'DAMAC Lagoons', location: 'Dubai', price: 'AED 2.1M', plan: '70/30', completion: 'Q1 2027' },
  { name: 'Nakheel Rixos', location: 'Palm Jebel Ali', price: 'AED 4.5M', plan: '80/20', completion: '2028' },
];

export default function OffPlanPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: '#1a1f2e' }}>
      <div className="px-4 py-16 text-center" style={{ background: '#242938' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>INVEST EARLY</p>
        <h1 className="text-4xl font-bold text-white mb-4">Off-Plan Properties in Dubai</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Get the best prices before completion. Our off-plan properties come with flexible payment plans from Dubai&apos;s top developers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: '💰', title: 'Lower Entry Price', desc: 'Buy at pre-launch prices before the market appreciates.' },
            { icon: '📅', title: 'Flexible Payment Plans', desc: 'Pay in installments during construction — typically 70/30 or 60/40.' },
            { icon: '📈', title: 'Higher ROI Potential', desc: 'Capital appreciation from launch to completion can be 15-30%.' },
          ].map((b) => (
            <div key={b.title} className="card-dark p-6 text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-white font-semibold mb-2">{b.title}</h3>
              <p className="text-gray-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-6">Featured Off-Plan Projects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {projects.map((p) => (
            <div key={p.name} className="card-dark p-5">
              <div
                className="h-32 rounded-lg mb-4 flex items-end p-3"
                style={{ background: 'linear-gradient(135deg, #0f1829 0%, #1a2a4a 100%)' }}
              >
                <span
                  className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: '#7c3aed', color: 'white' }}
                >
                  OFF-PLAN
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{p.location}</p>
              <p className="font-bold mb-3" style={{ color: '#c9a84c' }}>{p.price}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span>{p.plan} Plan</span>
                <span>·</span>
                <span>{p.completion}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/property?status=off-plan" className="btn-gold inline-flex">
            View All Off-Plan Properties →
          </Link>
        </div>
      </div>
    </div>
  );
}
