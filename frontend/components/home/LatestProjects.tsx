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
    <section className="py-20 px-4" style={{ background: '#242938' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
              FEATURED
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Latest Projects In Dubai
            </h2>
          </div>
          <Link
            href="/property"
            className="text-sm font-medium border-b pb-0.5 whitespace-nowrap transition-colors hover:text-yellow-400"
            style={{ color: '#c9a84c', borderColor: '#c9a84c' }}
          >
            View All Properties →
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
