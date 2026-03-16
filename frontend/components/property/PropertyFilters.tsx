'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { PropertyFilters as Filters } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

// Values must match the propertyType enum in the Property model (hyphen-separated)
const types: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Villa', value: 'villa' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Studio', value: 'studio' },
  { label: 'Plot', value: 'plot' },
  { label: 'Mansion', value: 'mansion' },
  { label: 'Hotel Apartment', value: 'hotel-apartment' },
  { label: 'Sky Villa', value: 'sky-villa' },
  { label: 'Full Floor', value: 'full-floor' },
  { label: 'Half Floor', value: 'half-floor' },
  { label: 'Premium Villa', value: 'premium-villa' },
  { label: 'Apt + Pool', value: 'apartment-private-pool' },
  { label: 'Studio + Pool', value: 'studio-pool' },
  { label: 'Simplex Sea Views', value: 'simplex-sea-views' },
  { label: 'Twin Villa', value: 'twin-villa' },
  { label: 'Standalone Villa', value: 'standalone-villa' },
  { label: 'Office', value: 'office' },
  { label: 'Commercial', value: 'commercial' },
];
// Values must be numeric strings matching the bedrooms field (0 = studio)
const bedrooms: { label: string; value: string }[] = [
  { label: 'Any', value: '' },
  { label: 'Studio', value: '0' },
  { label: '1 BR', value: '1' },
  { label: '2 BR', value: '2' },
  { label: '3 BR', value: '3' },
  { label: '4 BR', value: '4' },
  { label: '5+ BR', value: '5' },
];
const emirates = ['All Emirates', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'];
const statuses = ['All', 'For Sale', 'For Rent', 'Off-Plan', 'Ready'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

interface Props {
  onFilterChange?: (filters: Filters) => void;
}

export default function PropertyFilters({ onFilterChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobile, setShowMobile] = useState(false);

  const filters: Filters = {
    type: searchParams.get('type') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    emirate: searchParams.get('emirate') || '',
    status: searchParams.get('status') || '',
    sort: (searchParams.get('sort') as Filters['sort']) || 'featured',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  };

  const apply = (newFilters: Filters) => {
    onFilterChange?.(newFilters);
    const params = new URLSearchParams();
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.bedrooms) params.set('bedrooms', newFilters.bedrooms);
    if (newFilters.emirate) params.set('emirate', newFilters.emirate);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    router.push(`/property?${params.toString()}`, { scroll: false });
  };

  const set = (key: keyof Filters, value: string | number | undefined) => {
    trackEvent('filter_applied', { filter_name: key, filter_value: value });
    apply({ ...filters, [key]: value });
  };

  const reset = () => apply({ sort: 'featured' });

  const activeCount = [filters.type, filters.bedrooms, filters.emirate, filters.status, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="flex items-center gap-2 px-4 py-3 min-h-11 rounded-lg text-sm font-medium"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)' }}
        >
          <SlidersHorizontal className="w-4 h-4" style={{ color: '#c9a84c' }} />
          Filters {activeCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-xs badge-gold">{activeCount}</span>}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${showMobile ? 'block' : 'hidden'} lg:block rounded-xl p-5 space-y-5`}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <SlidersHorizontal className="w-4 h-4" style={{ color: '#c9a84c' }} />
            Filters
          </h3>
          {activeCount > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-xs t-secondary hover:opacity-80 transition-colors">
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Sort */}
        <FilterGroup label="Sort By">
          <select
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value as Filters['sort'])}
            className="select-dark text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Status */}
        <FilterGroup label="Status">
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => {
              const val = s === 'All' ? '' : s.toLowerCase().replace(/\s+/g, '-');
              const active = filters.status === val;
              return (
                <button
                  key={s}
                  onClick={() => set('status', val)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--gold)' : 'var(--bg-secondary)',
                    color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--gold)' : 'var(--border-gold)'}`,
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Property Type */}
        <FilterGroup label="Property Type">
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => {
              const active = filters.type === t.value;
              return (
                <button
                  key={t.value || 'all'}
                  onClick={() => set('type', t.value)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--gold)' : 'var(--bg-secondary)',
                    color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--gold)' : 'var(--border-gold)'}`,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Bedrooms */}
        <FilterGroup label="Bedrooms">
          <div className="flex flex-wrap gap-1.5">
            {bedrooms.map((b) => {
              const active = filters.bedrooms === b.value;
              return (
                <button
                  key={b.value || 'any'}
                  onClick={() => set('bedrooms', b.value)}
                  className="w-11 h-11 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: active ? 'var(--gold)' : 'var(--bg-secondary)',
                    color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--gold)' : 'var(--border-gold)'}`,
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Emirate */}
        <FilterGroup label="Emirate">
          <select
            value={filters.emirate}
            onChange={(e) => set('emirate', e.target.value)}
            className="select-dark text-sm"
          >
            {emirates.map((e) => (
              <option key={e} value={e === 'All Emirates' ? '' : e}>{e}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Price Range */}
        <FilterGroup label="Price Range (AED)">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => set('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input-dark text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => set('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input-dark text-sm"
            />
          </div>
        </FilterGroup>
      </div>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider t-secondary mb-2.5">{label}</p>
      {children}
    </div>
  );
}
