import Link from 'next/link';

export const metadata = {
  title: 'About Awtad Real Estate',
  description: "Dubai's premier luxury real estate agency. Learn about our story, team, and values.",
};

const stats = [
  { value: 'AED 11B+', label: 'Total Sales Volume' },
  { value: '10,000+', label: 'Happy Clients' },
  { value: '18+', label: 'Languages Spoken' },
  { value: '3', label: 'Offices in Dubai' },
];

const reviews = [
  {
    name: 'Ahmed Al Mansoori',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'Awtad helped me find my dream apartment in Downtown Dubai. Their multilingual team was professional and made the entire process seamless. Highly recommend!',
    property: 'Downtown Dubai Apartment',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text: 'As a foreign investor, I was nervous about buying in Dubai. Awtad guided me through every step — from legal checks to handover. Exceptional service.',
    property: 'JVC Investment Villa',
  },
  {
    name: 'James Whitfield',
    location: 'London, UK',
    rating: 5,
    text: 'I\'ve worked with agencies in London and New York, but Awtad stands out for their market knowledge and transparency. Closed my off-plan deal in 3 days.',
    property: 'Business Bay Off-Plan Unit',
  },
  {
    name: 'Fatima Al Zaabi',
    location: 'Abu Dhabi, UAE',
    rating: 5,
    text: 'Rented a stunning penthouse in Marina through Awtad. No hidden fees, no surprises. The agent was patient and genuinely cared about what I needed.',
    property: 'Dubai Marina Penthouse',
  },
  {
    name: 'Sergei Volkov',
    location: 'Moscow, Russia',
    rating: 5,
    text: 'Awtad found me an off-plan unit with the best payment plan I\'ve seen across 6 agencies. Their ROI analysis was spot-on. Already referring friends.',
    property: 'Creek Harbour Studio',
  },
  {
    name: 'Layla Hassan',
    location: 'Cairo, Egypt',
    rating: 5,
    text: 'Quick, efficient, and honest. My agent answered every question in Arabic and English. Got a ready-to-move villa well within my budget. Five stars.',
    property: 'Arabian Ranches Villa',
  },
];

const values = [
  { icon: '🤝', title: 'Trust & Integrity', desc: 'We operate with complete transparency. No hidden fees, no misleading information — ever.' },
  { icon: '🌟', title: 'Excellence', desc: 'We deliver a luxury experience at every touchpoint, from the first call to the final handover.' },
  { icon: '🌍', title: 'Global Reach', desc: 'Our multilingual team serves clients from 50+ countries, with offices in 4 Dubai locations.' },
  { icon: '📊', title: 'Data-Driven', desc: 'Every recommendation is backed by real market data, ROI analysis, and trend forecasting.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="px-4 py-16 text-center" style={{ background: 'var(--bg-secondary)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 t-accent">OUR STORY</p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light t-heading mb-4 leading-tight">About Awtad Real Estate</h1>
        <p className="t-secondary max-w-2xl mx-auto text-sm leading-relaxed">
          Founded with a vision to redefine luxury real estate in Dubai, Awtad Real Estate has grown to become one of the emirate&apos;s most trusted property agencies, with over AED 11 Billion in completed transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="py-14 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-dark p-6 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-light mb-1 t-accent">{s.value}</p>
              <p className="t-secondary text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="py-14 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-light t-heading mb-6 leading-tight">Our Story</h2>
          <div className="space-y-4 t-secondary text-sm leading-relaxed">
            <p>
              Awtad Real Estate was established with a singular mission: to make Dubai&apos;s dynamic real estate market accessible, transparent, and profitable for every client — whether a first-time buyer or a seasoned investor.
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
      <div className="py-14 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl font-light t-heading mb-8 text-center leading-tight">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card-dark p-6 text-center">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="t-heading font-semibold mb-2">{v.title}</h3>
                <p className="t-secondary text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="py-14 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 t-accent text-center">Client Reviews</p>
          <h2 className="font-serif text-2xl font-light t-heading mb-10 text-center leading-tight">What Our Clients Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="card-dark p-6 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#C9A96E">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.375 2.45c-.784.57-1.838-.196-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.633 9.394c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  ))}
                </div>
                {/* Text */}
                <p className="t-secondary text-xs leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
                {/* Property tag */}
                <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(201,169,110,0.6)' }}>{r.property}</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(201,169,110,0.12)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold t-heading" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold t-heading">{r.name}</p>
                    <p className="text-[10px] t-secondary">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 text-center" style={{ background: 'var(--bg-primary)' }}>
        <h2 className="font-serif text-2xl font-light t-heading mb-4 leading-tight">Ready to Find Your Property?</h2>
        <p className="t-secondary text-sm mb-6">Our experts are ready to help you navigate Dubai&apos;s property market.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/property" className="btn-gold">Browse Properties →</Link>
          <Link href="/contact" className="px-6 py-2.5 rounded-md text-sm font-semibold t-heading border transition-colors hover:opacity-80" style={{ borderColor: 'var(--border-color)' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
