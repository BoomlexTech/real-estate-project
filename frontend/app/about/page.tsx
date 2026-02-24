import Link from 'next/link';

export const metadata = {
  title: 'About Real Capital',
  description: "Dubai's premier luxury real estate agency. Learn about our story, team, and values.",
};

const stats = [
  { value: 'AED 11B+', label: 'Total Sales Volume' },
  { value: '10,000+', label: 'Happy Clients' },
  { value: '18+', label: 'Languages Spoken' },
  { value: '4', label: 'Offices in Dubai' },
];

const values = [
  { icon: '🤝', title: 'Trust & Integrity', desc: 'We operate with complete transparency. No hidden fees, no misleading information — ever.' },
  { icon: '🌟', title: 'Excellence', desc: 'We deliver a luxury experience at every touchpoint, from the first call to the final handover.' },
  { icon: '🌍', title: 'Global Reach', desc: 'Our multilingual team serves clients from 50+ countries, with offices in 4 Dubai locations.' },
  { icon: '📊', title: 'Data-Driven', desc: 'Every recommendation is backed by real market data, ROI analysis, and trend forecasting.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: '#1a1f2e' }}>
      {/* Hero */}
      <div className="px-4 py-16 text-center" style={{ background: '#242938' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>OUR STORY</p>
        <h1 className="text-4xl font-bold text-white mb-4">About Real Capital</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Founded with a vision to redefine luxury real estate in Dubai, Real Capital has grown to become one of the emirate&apos;s most trusted property agencies, with over AED 11 Billion in completed transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="py-14 px-4" style={{ background: '#1a1f2e' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-dark p-6 text-center">
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#c9a84c' }}>{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="py-14 px-4" style={{ background: '#242938' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              Real Capital was established with a singular mission: to make Dubai&apos;s dynamic real estate market accessible, transparent, and profitable for every client — whether a first-time buyer or a seasoned investor.
            </p>
            <p>
              We are official sales partners of Dubai&apos;s top developers including Emaar, DAMAC, Meraas, and Aldar. This gives our clients exclusive access to pre-launch pricing, the best payment plans, and developer-direct deals not available elsewhere.
            </p>
            <p>
              Our team of 50+ multilingual specialists speaks 18+ languages and has helped over 10,000 clients from more than 50 countries find their perfect property in the UAE.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-14 px-4" style={{ background: '#1a1f2e' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card-dark p-6 text-center">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 text-center" style={{ background: '#242938' }}>
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Property?</h2>
        <p className="text-gray-400 text-sm mb-6">Our experts are ready to help you navigate Dubai&apos;s property market.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/property" className="btn-gold">Browse Properties →</Link>
          <Link href="/contact" className="px-6 py-2.5 rounded-md text-sm font-semibold text-white border transition-colors hover:bg-white/10" style={{ borderColor: '#3a4058' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
