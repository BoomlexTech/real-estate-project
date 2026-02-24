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
      className="card-dark p-6 flex flex-col items-center text-center gap-3 hover:border-yellow-500/40 transition-colors group"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
        style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-white font-bold text-base leading-tight">{title}</p>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </motion.div>
  );
}
