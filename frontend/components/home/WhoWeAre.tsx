'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import StatCard from '../common/StatCard';

const stats = [
  {
    icon: '🤝',
    title: 'Top Selling Partner',
    subtitle: 'EMAAR, DAMAC, Meraas, Aldar',
  },
  {
    icon: '💰',
    title: 'AED 11 Billion',
    subtitle: 'The total amount of real estate sold',
  },
  {
    icon: '🌍',
    title: '18+ Languages',
    subtitle: 'We speak the most popular languages',
  },
  {
    icon: '🏢',
    title: '4 Offices In Dubai',
    subtitle: 'Located in four key areas across Dubai',
  },
];

const services = [
  {
    title: "Buyer's Agent",
    desc: 'We represent buyers exclusively, ensuring you get the best deal on your dream property.',
    icon: '🏠',
  },
  {
    title: 'Investment Portfolio',
    desc: 'Expert guidance to build a profitable real estate investment portfolio in Dubai.',
    icon: '📈',
  },
  {
    title: "Seller's Agent",
    desc: 'Maximum exposure and optimal pricing strategy to sell your property fast.',
    icon: '🔑',
  },
];

export default function WhoWeAre() {
  return (
    <>
      {/* Stats Section */}
      <section className="py-16 px-4" style={{ background: '#1a1f2e' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.title}
                icon={<span className="text-2xl">{stat.icon}</span>}
                title={stat.title}
                subtitle={stat.subtitle}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4" style={{ background: '#242938' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-4/3">
                <Image
                  src="https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900"
                  alt="Dubai Marina Skyline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.6) 0%, transparent 60%)' }}
                />
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <span
                    className="inline-block px-3 py-1.5 text-xs font-bold rounded-full"
                    style={{ background: '#c9a84c', color: '#1a1f2e' }}
                  >
                    DUBAI REAL ESTATE
                  </span>
                </div>
              </div>

              {/* Floating stat card */}
              <div
                className="absolute -bottom-5 -right-5 card-dark px-5 py-4 shadow-xl"
              >
                <p className="text-2xl font-bold" style={{ color: '#c9a84c' }}>11B+</p>
                <p className="text-xs text-gray-400 mt-0.5">AED in sales</p>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>WHO WE ARE</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                What Makes Dubai Real Estate{' '}
                <span style={{ color: '#c9a84c' }}>Challenging?</span>
              </h2>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  Dubai&apos;s real estate market is one of the most dynamic and fast-paced in the world. With thousands of listings, new developments launching daily, and complex regulatory frameworks, navigating the market without expert guidance can be overwhelming.
                </p>
                <p>
                  At Real Capital, we simplify this complexity. Our team of multilingual experts with deep local knowledge has helped thousands of clients from 18+ countries find their perfect property — whether for living, investment, or portfolio diversification.
                </p>
                <p>
                  From off-plan developments with flexible payment plans to ready-to-move luxury properties, we offer comprehensive end-to-end services tailored to your unique needs and goals.
                </p>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {services.map((svc, i) => (
                  <motion.div
                    key={svc.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="card-dark p-4 hover:border-yellow-500/40 transition-colors"
                  >
                    <div className="text-2xl mb-2">{svc.icon}</div>
                    <h4 className="text-white font-semibold text-sm mb-1">{svc.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{svc.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
