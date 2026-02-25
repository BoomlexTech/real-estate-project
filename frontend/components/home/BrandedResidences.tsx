'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';
import PropertyCard from '../property/PropertyCard';

export default function BrandedResidences() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    const visible = 3;

    useEffect(() => {
        getProperties({ sort: 'price_desc', limit: 10 })
            .then((res) => setProperties(res.data))
            .catch(() => setProperties([]));
    }, []);

    const visibleProps = properties.slice(startIdx, startIdx + visible);
    const canPrev = startIdx > 0;
    const canNext = startIdx + visible < properties.length;

    return (
        <section className="py-28 px-4" style={{ background: '#0f1523' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6"
                >
                    <div>
                        <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
                            Luxury Living
                        </p>
                        <span className="section-divider mb-5" />
                        <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-[1.08]">
                            Branded Residences<br />
                            <span style={{ color: '#C9A96E' }}>In Dubai</span>
                        </h2>
                        <p className="text-sm leading-[1.85] tracking-wide mt-4 max-w-sm" style={{ color: '#94A3B8' }}>
                            Exclusive branded residences from world-renowned luxury names — bespoke design, five-star amenities, unparalleled lifestyle.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <Link
                                href="/property"
                                className="text-[10px] tracking-[0.2em] uppercase transition-colors pb-0.5"
                                style={{ color: '#C9A96E', borderBottom: '1px solid rgba(201,169,110,0.4)' }}
                            >
                                View All Properties →
                            </Link>
                            {/* Navigation arrows */}
                            <div className="flex gap-2 ml-2">
                                <button
                                    onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                                    disabled={!canPrev}
                                    className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                                    style={{ border: '1px solid rgba(201,169,110,0.38)' }}
                                >←</button>
                                <button
                                    onClick={() => setStartIdx((p) => Math.min(properties.length - visible, p + 1))}
                                    disabled={!canNext}
                                    className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                                    style={{ border: '1px solid rgba(201,169,110,0.38)' }}
                                >→</button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid with thin gold gap lines */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
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
        </section>
    );
}
