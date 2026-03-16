'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PropertyCard from '../property/PropertyCard';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';
import useIsMobile from '@/lib/useIsMobile';

export default function LatestProjects() {
  const [properties, setProperties] = useState<Property[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    getProperties({ sort: 'newest', limit: 6 })
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  return (
    <section className="section-shell px-4 section-grain texture-dot-grid" style={{ background: 'var(--bg-section-alt)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-intro"
        >
          <p className="section-kicker">New To Market</p>
          <span className="section-divider mx-auto" />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light t-heading leading-[1.08]">
            Latest Projects
            <br />
            <span className="t-accent">In Dubai</span>
          </h2>
          <p className="page-intro-copy max-w-2xl">
            Fresh opportunities, newly launched addresses, and current listings worth your attention right now.
          </p>
          <Link
            href="/property"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5 whitespace-nowrap focus-ring rounded-sm"
            style={{ color: 'var(--gold-text)', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
          >
            View All Properties
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {(isMobile ? properties.slice(0, 3) : properties).map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
              style={{ padding: '0.5rem' }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
