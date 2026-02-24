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
    <section className="py-20 px-4" style={{ background: '#1a1f2e' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
            OUR PARTNERS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Top Developers In Dubai
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {developers.map((dev, i) => (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/developers/${dev.slug}`}
                className="card-dark p-5 flex-col items-center text-center gap-2 hover:border-yellow-500/40 transition-all group block"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black transition-colors"
                  style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}
                >
                  {dev.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">{dev.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{dev.properties}+ Projects</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: '#c9a84c' }}
          >
            View All Developers →
          </Link>
        </div>
      </div>
    </section>
  );
}
