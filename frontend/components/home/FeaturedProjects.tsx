'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';

export default function FeaturedProjects() {
    const [projects, setProjects] = useState<Property[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    const visible = 3;

    useEffect(() => {
        getProperties({ sort: 'featured', limit: 10 })
            .then((res) => setProjects(res.data))
            .catch(() => setProjects([]));
    }, []);

    const visibleProjects = projects.slice(startIdx, startIdx + visible);
    const canPrev = startIdx > 0;
    const canNext = startIdx + visible < projects.length;

    return (
        <section className="py-20 px-4" style={{ background: '#1a1f2e' }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
                            EXPLORE
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Featured Projects In Dubai
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
                            style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setStartIdx((p) => Math.min(projects.length - visible, p + 1))}
                            disabled={!canNext}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition disabled:opacity-30"
                            style={{ border: '1px solid rgba(201,168,76,0.45)' }}
                        >
                            →
                        </button>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {visibleProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="h-full"
                        >
                            <Link href={`/property/${project.slug}`} className="group block h-full">
                                <div className="rounded-2xl overflow-hidden h-full flex flex-col" style={{ background: '#232838', border: '1px solid rgba(201,168,76,0.45)' }}>
                                    <div className="relative h-56 overflow-hidden shrink-0">
                                        <Image
                                            src={project.images[0] || '/placeholder.jpg'}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full" style={{ background: '#c9a84c', color: '#1a1f2e' }}>
                                            {project.status === 'for-sale' ? 'FOR SALE' : project.status === 'for-rent' ? 'FOR RENT' : project.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{project.location}, {project.emirate}</p>
                                        <div className="flex items-center gap-4 mt-3 text-gray-400 text-xs">
                                            {project.bedrooms > 0 && <span>🛏 {project.bedrooms} Beds</span>}
                                            <span>📐 {project.area.toLocaleString()} sqft</span>
                                            {project.developer && <span>🏗 {project.developer}</span>}
                                        </div>
                                        <p className="text-lg font-bold mt-auto pt-3" style={{ color: '#c9a84c' }}>{project.priceLabel}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
