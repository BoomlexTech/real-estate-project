import Link from 'next/link';

export const metadata = {
  title: 'Real Estate Services',
  description: 'Comprehensive real estate services in Dubai — buying, selling, renting, mortgage, and investment advisory.',
};

const services = [
  {
    icon: '🏠',
    title: "Buyer's Agent",
    desc: 'Our dedicated buyer agents represent your interests exclusively. We negotiate the best price, handle due diligence, and ensure a smooth transaction from search to keys.',
    features: ['Property search & shortlisting', 'Price negotiation', 'Due diligence & legal checks', 'Transaction management'],
  },
  {
    icon: '🔑',
    title: "Seller's Agent",
    desc: 'Maximum exposure for your property through our extensive network, digital marketing, and 18,000+ international buyer database.',
    features: ['Market valuation', 'Professional photography', 'Multi-channel marketing', 'Viewing management'],
  },
  {
    icon: '📈',
    title: 'Investment Advisory',
    desc: 'Build a high-performing real estate portfolio in Dubai with expert ROI analysis, market timing, and off-plan investment strategies.',
    features: ['ROI analysis', 'Off-plan investment', 'Portfolio management', 'Market timing advice'],
  },
  {
    icon: '🏦',
    title: 'Mortgage Advisory',
    desc: 'Access 20+ partner banks and lenders. Our mortgage advisors find the best rates and handle the entire application process.',
    features: ['Rate comparison', 'Pre-approval assistance', 'Application management', 'Zero broker fees'],
  },
  {
    icon: '📋',
    title: 'Property Management',
    desc: 'Stress-free management of your investment property — from tenant sourcing to maintenance coordination and rent collection.',
    features: ['Tenant screening', 'Rent collection', 'Maintenance coordination', 'Financial reporting'],
  },
  {
    icon: '⚖️',
    title: 'Legal & Documentation',
    desc: 'Expert guidance through UAE property law, DLD registration, NOC procedures, and all legal documentation requirements.',
    features: ['DLD registration', 'NOC processing', 'Contract review', 'Ownership transfer'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24" style={{ background: '#1a1f2e' }}>
      <div className="px-4 py-16 text-center" style={{ background: '#242938' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>WHAT WE OFFER</p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4 leading-tight">Our Services</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          End-to-end real estate services tailored to buyers, sellers, investors, and landlords in Dubai and the UAE.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div key={svc.title} className="card-dark p-6 hover:border-yellow-500/30 transition-all">
              <div className="text-3xl mb-4">{svc.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{svc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{svc.desc}</p>
              <ul className="space-y-1.5">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                    <span style={{ color: '#c9a84c' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/contact" className="btn-gold inline-flex">
            Get a Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
