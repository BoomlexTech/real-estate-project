'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getDevelopers } from '@/lib/api';

interface Dev {
  id: string;
  slug: string;
  name: string;
  properties: number;
}

export default function DeveloperSpotlight() {
  const [developers, setDevelopers] = useState<Dev[]>([]);

  useEffect(() => {
    getDevelopers()
      .then((devs) =>
        setDevelopers(
          devs.map((d) => ({ id: d.id, slug: d.slug, name: d.name, properties: d.properties }))
        )
      )
      .catch(() => setDevelopers([]));
  }, []);

  return (
    <section className="py-28 px-4" style={{ background: '#0A0E1A' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Our Partners
            </p>
            <span className="section-divider mb-5" />
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-[1.08]">
              Top Developers<br />
              <span style={{ color: '#C9A96E' }}>In Dubai</span>
            </h2>
          </div>
          <Link
            href="/developers"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5 whitespace-nowrap self-end sm:self-auto"
            style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
          >
            View All Developers →
          </Link>
        </motion.div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px"
          style={{ background: 'rgba(201,169,110,0.12)' }}
        >
          {developers.map((dev, i) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <Link
                href={`/developers/${dev.slug}`}
                className="flex flex-col items-center text-center gap-3 p-6 transition-colors group"
                style={{ background: '#111827' }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center text-sm font-light transition-colors"
                  style={{ border: '1px solid rgba(201,169,110,0.28)', color: '#C9A96E' }}
                >
                  {dev.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-white text-xs tracking-wide font-light transition-colors group-hover:text-gold"
                  >
                    {dev.name}
                  </p>
                  <p className="text-[10px] tracking-[0.08em] mt-1" style={{ color: '#94A3B8' }}>
                    {dev.properties}+ Projects
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
