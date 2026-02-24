'use client';

import PropertyCard from './PropertyCard';
import { Property } from '@/lib/types';
import { motion } from 'framer-motion';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: '#2d3347', border: '1px solid rgba(201,168,76,0.45)' }}>
      <div className="h-48 w-full" style={{ background: '#3a4058' }} />
      <div className="p-4 space-y-3">
        <div className="h-3 rounded w-2/3" style={{ background: '#3a4058' }} />
        <div className="h-5 rounded w-1/2" style={{ background: '#3a4058' }} />
        <div className="h-4 rounded w-full" style={{ background: '#3a4058' }} />
        <div className="h-3 rounded w-3/4" style={{ background: '#3a4058' }} />
      </div>
    </div>
  );
}

export default function PropertyGrid({ properties, loading, page = 1, totalPages = 1, onPageChange }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🏙️</div>
        <h3 className="text-white text-lg font-semibold mb-2">No Properties Found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: '#2d3347', color: '#9ca3af', border: '1px solid rgba(201,168,76,0.45)' }}
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: p === page ? '#c9a84c' : '#2d3347',
                  color: p === page ? '#1a1f2e' : '#9ca3af',
                  border: `1px solid ${p === page ? '#c9a84c' : 'rgba(201,168,76,0.45)'}`,
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: '#2d3347', color: '#9ca3af', border: '1px solid rgba(201,168,76,0.45)' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
