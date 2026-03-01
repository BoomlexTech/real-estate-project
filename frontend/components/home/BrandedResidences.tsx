'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';
import PropertyCard from '../property/PropertyCard';
import useIsMobile from '@/lib/useIsMobile';

export default function BrandedResidences() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    const isMobile = useIsMobile();
    const visible = isMobile ? 1 : 2;

    useEffect(() => {
        getProperties({ sort: 'price_desc', limit: 10 })
            .then((res) => setProperties(res.data))
            .catch(() => setProperties([]));
    }, []);

    const visibleProps = properties.slice(startIdx, startIdx + visible);
    const canPrev = startIdx > 0;
    const canNext = startIdx + visible < properties.length;

    return (
        <section className="py-16 sm:py-20 lg:py-28 px-4 section-grain texture-dot-grid" style={{ background: 'var(--bg-section-alt)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-16 lg:items-start">

                    {/* Left: text + controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1 mb-10 lg:mb-0 lg:sticky lg:top-28"
                    >
                        <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
                            Luxury Living
                        </p>
                        <span className="section-divider mb-5" />
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.08] mb-5">
                            Branded Residences<br />
                            <span style={{ color: '#C9A96E' }}>In Dubai</span>
                        </h2>
                        <p className="text-sm leading-[1.85] tracking-wide mb-8" style={{ color: '#94A3B8' }}>
                            Exclusive branded residences from world-renowned luxury names — bespoke design, five-star amenities, unparalleled lifestyle.
                        </p>
                        <Link
                            href="/property"
                            className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5 inline-block mb-8"
                            style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
                        >
                            View All Properties →
                        </Link>
                        {/* Navigation arrows */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                                disabled={!canPrev}
                                className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                                style={{ border: '1px solid rgba(201,169,110,0.38)', borderRadius: '6px' }}
                            >←</button>
                            <button
                                onClick={() => setStartIdx((p) => Math.min(properties.length - visible, p + 1))}
                                disabled={!canNext}
                                className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                                style={{ border: '1px solid rgba(201,169,110,0.38)', borderRadius: '6px' }}
                            >→</button>
                        </div>
                    </motion.div>

                    {/* Right: property cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2">
                        {visibleProps.map((prop, i) => (
                            <motion.div
                                key={prop.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                                style={{ padding: '0.5rem' }}
                            >
                                <PropertyCard property={prop} />
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
