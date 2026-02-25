'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PropertyCard from '../property/PropertyCard';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';

export default function LatestProjects() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties({ sort: 'newest', limit: 6 })
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  return (
    <section className="py-28 px-4" style={{ background: '#0f1523' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Featured
            </p>
            <span className="section-divider mb-5" />
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-[1.08]">
              Latest Projects<br />
              <span style={{ color: '#C9A96E' }}>In Dubai</span>
            </h2>
          </div>
          <Link
            href="/property"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5 whitespace-nowrap self-end sm:self-auto"
            style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
          >
            View All Properties →
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(201,169,110,0.12)' }}>
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
