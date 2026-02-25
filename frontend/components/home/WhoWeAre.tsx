'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import StatCard from '../common/StatCard';

const stats = [
  {
    icon: '✦',
    title: 'Top Selling Partner',
    subtitle: 'EMAAR, DAMAC, Meraas, Aldar',
  },
  {
    icon: '✦',
    title: 'AED 11 Billion',
    subtitle: 'Total real estate transacted',
  },
  {
    icon: '✦',
    title: '18+ Languages',
    subtitle: 'Multilingual expert team',
  },
  {
    icon: '✦',
    title: '4 Offices',
    subtitle: 'Located across Dubai & UAE',
  },
];

const services = [
  {
    title: "Buyer's Agent",
    desc: 'We represent buyers exclusively, ensuring you secure the finest property at optimal terms.',
    label: '01',
  },
  {
    title: 'Investment Portfolio',
    desc: 'Expert guidance to build a profitable real estate investment portfolio across the UAE.',
    label: '02',
  },
  {
    title: "Seller's Agent",
    desc: 'Maximum exposure and bespoke pricing strategy to achieve the best sale outcome.',
    label: '03',
  },
];

export default function WhoWeAre() {
  return (
    <>
      {/* Stats Section */}
      <section className="py-20 px-4" style={{ background: '#0f1523' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(201,169,110,0.12)' }}>
            {stats.map((stat, i) => (
              <StatCard
                key={stat.title}
                icon={<span className="text-sm font-light" style={{ color: '#C9A96E' }}>{stat.icon}</span>}
                title={stat.title}
                subtitle={stat.subtitle}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-28 px-4" style={{ background: '#0A0E1A' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Sharp-cornered image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900"
                  alt="Dubai Skyline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.55) 0%, transparent 65%)' }}
                />
                {/* Badge — bottom left */}
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <span
                    className="px-3 py-1.5 text-[10px] tracking-[0.22em] uppercase"
                    style={{ border: '1px solid rgba(201,169,110,0.55)', color: '#C9A96E' }}
                  >
                    Dubai Real Estate
                  </span>
                </div>
              </div>

              {/* Floating stat — sharp corners, offset */}
              <div
                className="absolute -bottom-6 -right-6 px-6 py-5 shadow-xl"
                style={{ background: '#111827', border: '1px solid rgba(201,169,110,0.25)' }}
              >
                <p className="font-serif text-3xl font-light" style={{ color: '#C9A96E' }}>11B+</p>
                <p className="text-[10px] tracking-[0.14em] uppercase mt-1" style={{ color: '#94A3B8' }}>
                  AED in Sales
                </p>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.28em] uppercase mb-5" style={{ color: '#C9A96E' }}>
                Who We Are
              </p>
              <span className="section-divider mb-6" />
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-white mb-8 leading-[1.1]">
                Navigating Dubai&apos;s{' '}
                <span style={{ color: '#C9A96E' }}>Real Estate</span>{' '}
                with Precision
              </h2>
              <div className="space-y-5 mb-10" style={{ color: '#94A3B8' }}>
                <p className="text-sm leading-[1.85] tracking-wide">
                  Dubai&apos;s real estate market is one of the most dynamic and fast-paced in the world. With thousands of listings, new developments launching daily, and complex regulatory frameworks, navigating the market without expert guidance can be overwhelming.
                </p>
                <p className="text-sm leading-[1.85] tracking-wide">
                  At Awtad Real Estate, we simplify this complexity. Our multilingual team with deep local knowledge has helped thousands of clients from 18+ countries find their ideal property — for living, investment, or portfolio growth.
                </p>
              </div>

              {/* Service Cards — outlined, sharp, numbered */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(201,169,110,0.12)' }}>
                {services.map((svc, i) => (
                  <motion.div
                    key={svc.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="p-5 transition-colors"
                    style={{ background: '#111827' }}
                  >
                    <p className="font-serif text-2xl font-light mb-3" style={{ color: 'rgba(201,169,110,0.35)' }}>
                      {svc.label}
                    </p>
                    <h4 className="text-white text-sm font-light tracking-wide mb-2">{svc.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(148,163,184,0.65)' }}>{svc.desc}</p>
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
