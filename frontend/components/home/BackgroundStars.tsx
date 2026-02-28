'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
    id: number;
    top: string;
    left: string;
    size: number;
    duration: number;
    delay: number;
}

export default function BackgroundStars() {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        // Generate 150 random stars on mount to avoid hydration mismatch
        const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2.5 + 1, // 1px to 3.5px
            duration: Math.random() * 3 + 2, // 2s to 5s
            delay: Math.random() * 2, // 0s to 2s
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-80">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.4)', // Faint glow
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: star.delay,
                    }}
                />
            ))}
        </div>
    );
}
