'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  delay?: number;
}

export default function StatCard({ icon, title, subtitle, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-4 sm:p-7 flex flex-col items-center text-center gap-2 sm:gap-4 transition-colors group"
    >
      {/* Square icon — no border-radius */}
      <div
        className="w-10 h-10 flex items-center justify-center text-sm"
        style={{ border: '1px solid rgba(201,169,110,0.28)', color: '#C9A96E' }}
      >
        {icon}
      </div>
      <div>
        <p className="font-serif text-xl font-light text-white leading-tight mb-1">{title}</p>
        <p className="text-[11px] tracking-[0.08em] leading-relaxed" style={{ color: '#94A3B8' }}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
