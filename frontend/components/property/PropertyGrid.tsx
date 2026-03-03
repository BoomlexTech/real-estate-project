'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--skeleton-bg)', border: '1px solid var(--border-gold)' }}>
      <div className="h-48 w-full" style={{ background: 'var(--skeleton-shine)' }} />
      <div className="p-4 space-y-3">
        <div className="h-3 rounded w-2/3" style={{ background: 'var(--skeleton-shine)' }} />
        <div className="h-5 rounded w-1/2" style={{ background: 'var(--skeleton-shine)' }} />
        <div className="h-4 rounded w-full" style={{ background: 'var(--skeleton-shine)' }} />
        <div className="h-3 rounded w-3/4" style={{ background: 'var(--skeleton-shine)' }} />
      </div>
    </div>
  );
}

export default function PropertyGrid({ properties, loading, page = 1, totalPages = 1, onPageChange }: PropertyGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(p: number) {
    if (onPageChange) { onPageChange(p); return; }
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
        <h3 className="t-heading text-lg font-semibold mb-2">No Properties Found</h3>
        <p className="t-secondary text-sm">Try adjusting your filters to see more results.</p>
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
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: 'var(--skeleton-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-gold)' }}
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: p === page ? 'var(--gold)' : 'var(--skeleton-bg)',
                  color: p === page ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${p === page ? 'var(--gold)' : 'var(--border-gold)'}`,
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: 'var(--skeleton-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-gold)' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
