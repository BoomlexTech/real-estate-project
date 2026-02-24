'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';

export default function BrandedResidences() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    const visible = 3;

    useEffect(() => {
        // Fetch branded / luxury properties (penthouses + high-price)
        getProperties({ sort: 'price_desc', limit: 10 })
            .then((res) => setProperties(res.data))
            .catch(() => setProperties([]));
    }, []);

    const visibleProps = properties.slice(startIdx, startIdx + visible);
    const canPrev = startIdx > 0;
    const canNext = startIdx + visible < properties.length;

    return (
        <section className="py-20 px-4" style={{ background: '#242938' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-[380px_1fr] gap-12">
                    {/* Left Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
                            LUXURY LIVING
                        </p>
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                            Branded Residences
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Discover exclusive branded residences from world-renowned luxury brands.
                            Each property offers bespoke design, five-star amenities, and unparalleled lifestyle experiences.
                        </p>
                        <Link href="/property" className="btn-gold inline-flex text-sm">
                            View All Properties →
                        </Link>

                        {/* Carousel arrows */}
                        <div className="flex gap-2 mt-8">
                            <button
                                onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                                disabled={!canPrev}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
                                style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                            >←</button>
                            <button
                                onClick={() => setStartIdx((p) => Math.min(properties.length - visible, p + 1))}
                                disabled={!canNext}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
                                style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                            >→</button>
                        </div>
                    </motion.div>

                    {/* Right Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {visibleProps.map((prop, i) => (
                            <motion.div
                                key={prop.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/property/${prop.slug}`} className="group block">
                                    <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1f2e', border: '1px solid rgba(201,168,76,0.45)' }}>
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={prop.images[0] || '/placeholder.jpg'}
                                                alt={prop.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                            <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase" style={{ background: '#c9a84c', color: '#1a1f2e' }}>
                                                {prop.type.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-white font-bold group-hover:text-yellow-400 transition-colors">{prop.title}</h3>
                                            <p className="text-gray-500 text-xs mt-1">{prop.location}, {prop.emirate}</p>
                                            <p className="text-sm font-bold mt-2" style={{ color: '#c9a84c' }}>{prop.priceLabel}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
