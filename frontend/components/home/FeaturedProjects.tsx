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
                    className="relative flex flex-col items-center text-center mb-8 sm:mb-16 gap-4"
                >
                    <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: '#C9A96E' }}>
                        Explore
                    </p>
                    <span className="section-divider mx-auto" />
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light t-heading leading-[1.08]">
                        Featured Projects<br />
                        <span style={{ color: '#C9A96E' }}>In Dubai</span>
                    </h2>

                    {/* Navigation arrows — floated top-right */}
                    <div className="absolute top-0 right-0 flex gap-2">
                        <button
                            onClick={() => setStartIdx((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-11 h-11 flex items-center justify-center t-heading text-base transition-all disabled:opacity-25"
                            style={{ border: '1px solid rgba(201,169,110,0.38)', borderRadius: '6px' }}
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setStartIdx((p) => Math.min(projects.length - visible, p + 1))}
                            disabled={!canNext}
                            className="w-11 h-11 flex items-center justify-center t-heading text-base transition-all disabled:opacity-25"
                            style={{ border: '1px solid rgba(201,169,110,0.38)', borderRadius: '6px' }}
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
