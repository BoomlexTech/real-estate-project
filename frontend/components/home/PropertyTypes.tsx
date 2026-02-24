'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const types = [
  // Top row: 3 cards (first wider)
  {
    label: 'APARTMENT',
    href: '/property/apartment',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  {
    label: 'Penthouses',
    href: '/property/penthouse',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  {
    label: 'Villas',
    href: '/property/villa',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  // Bottom row: 4 equal cards
  {
    label: 'Townhouses',
    href: '/property/townhouse',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  {
    label: 'Studios',
    href: '/property/studio',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  {
    label: 'Plot',
    href: '/property/plot',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
  {
    label: 'Mansion',
    href: '/property/mansion',
    image: 'https://media.istockphoto.com/id/2175808798/photo/houses-on-palm-island-in-dubai.jpg?s=612x612&w=0&k=20&c=IS-sQ8O8luKFilHBfjiJLa4e0Q0vYXopk9YDI4F05Q8=',
  },
];

export default function PropertyTypes() {
  return (
    <section className="py-20 px-4" style={{ background: '#1a1f2e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
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
              className={`${i === 0 ? 'sm:col-span-2 lg:col-span-2' : 'lg:col-span-1'} ${i === 2 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <Link
                href={type.href}
                className="group relative block overflow-hidden rounded-2xl"
                style={{ height: '280px' }}
              >
                <Image
                  src={type.image}
                  alt={type.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)', opacity: 0.8 }}
                />
                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl transition-colors duration-300" style={{ border: '1px solid rgba(201,168,76,0.45)' }} />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="text-white text-xl sm:text-2xl font-bold group-hover:text-yellow-400 transition-colors">
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
                className="group relative block overflow-hidden rounded-2xl"
                style={{ height: '260px' }}
              >
                <Image
                  src={type.image}
                  alt={type.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Dark overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)', opacity: 0.8 }}
                />
                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl transition-colors duration-300" style={{ border: '1px solid rgba(201,168,76,0.45)' }} />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="text-white text-lg sm:text-xl font-bold group-hover:text-yellow-400 transition-colors">
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
