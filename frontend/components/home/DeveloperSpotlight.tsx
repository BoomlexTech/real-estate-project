'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getDevelopers } from '@/lib/api';
import useIsMobile from '@/lib/useIsMobile';

interface Dev {
  id: string;
  slug: string;
  name: string;
  logo: string;
  properties: number;
}

export default function DeveloperSpotlight() {
  const [developers, setDevelopers] = useState<Dev[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    getDevelopers()
      .then((devs) =>
        setDevelopers(
          devs.map((d) => ({ id: d.id, slug: d.slug, name: d.name, logo: d.logo || '', properties: d.properties }))
        )
      )
      .catch(() => setDevelopers([]));
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-8 sm:mb-16 gap-4"
        >
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Our Partners
            </p>
            <span className="section-divider mx-auto mb-5" />
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.08]">
              Top Developers<br />
              <span style={{ color: '#C9A96E' }}>In Dubai</span>
            </h2>
          </div>
          <Link
            href="/developers"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5 whitespace-nowrap"
            style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
          >
            View All Developers →
          </Link>
        </motion.div>
      </div>

      {/* Continuous Marquee Track - Full Width with Fade Edges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative flex whitespace-nowrap overflow-hidden py-4 w-full"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          borderTop: 'none',
          borderBottom: 'none',
        }}
      >
        <div className="flex animate-marquee-ease min-w-max hover:[animation-play-state:paused] gap-4">
          {/* Duplicate array for infinite seamless scroll */}
          {[...developers, ...developers, ...developers, ...developers].map((dev, i) => (
            <motion.div
              key={`${dev.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (i % developers.length) * 0.06, ease: 'easeOut' }}
              className="w-50 sm:w-60 shrink-0"
            >
              <Link
                href={`/developers/${dev.slug}`}
                className="glass-card flex flex-col items-center justify-center text-center gap-3 p-6 h-full transition-colors group"
                style={{ borderTop: 'none', borderBottom: 'none' }}
              >
                <motion.div
                  className="w-24 h-24 lg:w-28 lg:h-28 rounded-full relative overflow-hidden flex items-center justify-center text-xl lg:text-3xl font-light mb-2"
                  style={{ border: '1px solid rgba(201,169,110,0.28)', background: '#111827' }}
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(201,169,110,0)',
                      '0 0 16px rgba(201,169,110,0.3)',
                      '0 0 0px rgba(201,169,110,0)',
                    ],
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 0 2px #C9A96E, 0 0 22px rgba(201,169,110,0.5)',
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (i % developers.length) * 0.2,
                    scale: { type: 'spring', stiffness: 300, damping: 20, duration: undefined },
                    boxShadow: { duration: 0.2 },
                  }}
                >
                  {dev.logo ? (
                    <Image
                      src={dev.logo}
                      alt={dev.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
                      sizes="(max-width: 1024px) 96px, 112px"
                    />
                  ) : (
                    <span style={{ color: '#C9A96E' }}>{dev.name.charAt(0)}</span>
                  )}
                </motion.div>
                <div>
                  <p
                    className="text-white text-xs tracking-wide font-light transition-colors group-hover:text-gold whitespace-normal"
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
      </motion.div>
    </section>
  );
}
