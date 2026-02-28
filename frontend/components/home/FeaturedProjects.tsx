'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Property } from '@/lib/types';
import { getProperties } from '@/lib/api';
import PropertyCard from '../property/PropertyCard';
import useIsMobile from '@/lib/useIsMobile';

export default function FeaturedProjects() {
    const [projects, setProjects] = useState<Property[]>([]);
    const [startIdx, setStartIdx] = useState(0);
    const isMobile = useIsMobile();
    const visible = isMobile ? 2 : 3;

    useEffect(() => {
        getProperties({ sort: 'featured', limit: 10 })
            .then((res) => setProjects(res.data))
            .catch(() => setProjects([]));
    }, []);

    const visibleProjects = projects.slice(startIdx, startIdx + visible);
    const canPrev = startIdx > 0;
    const canNext = startIdx + visible < projects.length;

    return (
        <section className="py-16 sm:py-20 lg:py-28 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-16 gap-4 sm:gap-0"
                >
                    <div>
                        <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
                            Explore
                        </p>
                        <span className="section-divider mb-5" />
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.08]">
                            Featured Projects<br />
                            <span style={{ color: '#C9A96E' }}>In Dubai</span>
                        </h2>
                    </div>

                    {/* Navigation arrows — square outline */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                            style={{ border: '1px solid rgba(201,169,110,0.38)' }}
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setStartIdx((p) => Math.min(projects.length - visible, p + 1))}
                            disabled={!canNext}
                            className="w-10 h-10 flex items-center justify-center text-white text-base transition-all disabled:opacity-25"
                            style={{ border: '1px solid rgba(201,169,110,0.38)' }}
                        >
                            →
                        </button>
                    </div>
                </motion.div>

                {/* Grid with thin gold gap lines */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                    {visibleProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                            style={{ padding: '0.5rem' }}
                        >
                            <PropertyCard property={project} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
