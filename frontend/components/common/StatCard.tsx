'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  title: string;
  subtitle: string;
  progress?: number;
  delay?: number;
}

function useCountUp(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, inView]);

  return count;
}

export default function StatCard({
  icon,
  value,
  suffix = '',
  prefix = '',
  title,
  subtitle,
  progress = 75,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(value, 2, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      className="relative group cursor-default overflow-hidden h-full"
    >
      {/* Gold gradient top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-500 group-hover:h-0.75"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A96E 50%, transparent 100%)' }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(201,169,110,0.08) 0%, transparent 70%)' }}
      />

      {/* Card content */}
      <div className="relative h-full p-5 sm:p-8 flex flex-col items-center justify-between text-center gap-3 sm:gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.10)', borderRadius: '1rem' }}>
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Icon with continuous pulse glow */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
              style={{
                border: '1px solid rgba(201,169,110,0.3)',
                background: 'rgba(201,169,110,0.04)',
                borderRadius: '8px',
              }}
              animate={{
                boxShadow: [
                  '0 0 0px rgba(201,169,110,0)',
                  '0 0 12px rgba(201,169,110,0.25)',
                  '0 0 0px rgba(201,169,110,0)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.5,
              }}
            >
              <div className="text-base sm:text-lg" style={{ color: '#C9A96E' }}>{icon}</div>
            </motion.div>
            {/* Corner accents */}
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: '#C9A96E' }} />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderColor: '#C9A96E' }} />
          </div>

          {/* Animated counter */}
          <div>
            <p
              className="font-serif text-2xl sm:text-3xl font-light leading-tight mb-0.5"
              style={{ color: '#000000' }}
            >
              {prefix}{count.toLocaleString()}{suffix}
            </p>
            <p className="text-xs sm:text-sm font-light tracking-wide mb-1" style={{ color: '#000000' }}>{title}</p>
            <p className="text-[10px] sm:text-[11px] tracking-widest leading-relaxed" style={{ color: '#222222' }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Luxury progress bar with continuous shimmer */}
        <div className="w-full mt-auto pt-2">
          <div
            className="w-full h-0.5 relative overflow-hidden"
            style={{ background: 'rgba(201,169,110,0.1)' }}
          >
            {/* Fill bar */}
            <motion.div
              className="absolute inset-y-0 left-0"
              initial={{ width: 0 }}
              animate={isInView ? { width: `${progress}%` } : { width: 0 }}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, rgba(201,169,110,0.3) 0%, #C9A96E 100%)',
              }}
            />
            {/* Continuous shimmer sweep */}
            <motion.div
              className="absolute inset-y-0 w-12"
              animate={{ left: ['-3rem', '110%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
                delay: delay + 1.5,
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
