'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const types = [
  // Top row: 3 cards (first wider)
  {
    label: 'APARTMENT',
    href: '/property?type=apartment',
    image: 'https://images.pexels.com/photos/30707660/pexels-photo-30707660.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  {
    label: 'Penthouses',
    href: '/property?type=penthouse',
    image: 'https://images.pexels.com/photos/15994062/pexels-photo-15994062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  {
    label: 'Villas',
    href: '/property?type=villa',
    image: 'https://images.pexels.com/photos/4497544/pexels-photo-4497544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  // Bottom row: 4 equal cards
  {
    label: 'Townhouses',
    href: '/property?type=townhouse',
    image: 'https://images.pexels.com/photos/31771226/pexels-photo-31771226.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  {
    label: 'Studios',
    href: '/property?type=studio',
    image: 'https://images.pexels.com/photos/34188580/pexels-photo-34188580.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  {
    label: 'Plot',
    href: '/property?type=plot',
    image: 'https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
  {
    label: 'Mansion',
    href: '/property?type=mansion',
    image: 'https://images.pexels.com/photos/10514386/pexels-photo-10514386.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
  },
];

export default function PropertyTypes() {
  return (
    <section className="py-20 px-4 section-grain texture-dot-grid" style={{ background: 'var(--bg-section-alt)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-light t-heading leading-tight">
            Explore New Properties In Dubai By Type
          </h2>
        </motion.div>

        {/* Top Row: 3 cards — first one wider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
          {types.slice(0, 3).map((type, i) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`col-span-1 ${i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''} ${i === 2 ? 'lg:col-span-2' : ''}`}
            >
              <Link
                href={type.href}
                className="group relative block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,169,110,0.28)]"
                style={{ height: '280px' }}
              >
                <Image
                  src={type.image}
                  alt={type.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Dark overlay — continuous breathing */}
                <motion.div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }}
                  animate={{ opacity: [0.8, 0.95, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                />
                {/* Border glow on hover — continuous breathing */}
                <motion.div
                  className="absolute inset-0 rounded-2xl transition-colors duration-300"
                  style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                  animate={{ borderColor: ['rgba(201,168,76,0.2)', 'rgba(201,168,76,0.5)', 'rgba(201,168,76,0.2)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="text-white text-xl sm:text-2xl font-bold group-hover:text-gold transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">Great Deals Available</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Row: 4 equal cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {types.slice(3).map((type, i) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 3) * 0.1 }}
            >
              <Link
                href={type.href}
                className="group relative block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,169,110,0.28)]"
                style={{ height: '260px' }}
              >
                <Image
                  src={type.image}
                  alt={type.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Dark overlay — continuous breathing */}
                <motion.div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }}
                  animate={{ opacity: [0.8, 0.95, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: (i + 3) * 0.15 }}
                />
                {/* Border glow on hover — continuous breathing */}
                <motion.div
                  className="absolute inset-0 rounded-2xl transition-colors duration-300"
                  style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                  animate={{ borderColor: ['rgba(201,168,76,0.2)', 'rgba(201,168,76,0.5)', 'rgba(201,168,76,0.2)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: (i + 3) * 0.2 }}
                />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="text-white text-lg sm:text-xl font-bold group-hover:text-gold transition-colors">
                    {type.label}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">Great Deals Available</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
