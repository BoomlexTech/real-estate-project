'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Option { label: string; value: string }

const emirateOptions: Option[] = [
  { label: 'All Emirates', value: '' },
  { label: 'Dubai', value: 'Dubai' },
  { label: 'Abu Dhabi', value: 'Abu Dhabi' },
  { label: 'Sharjah', value: 'Sharjah' },
  { label: 'Ajman', value: 'Ajman' },
  { label: 'Ras Al Khaimah', value: 'Ras Al Khaimah' },
];

const locationOptions: Option[] = [
  { label: 'All Locations', value: '' },
  { label: 'Downtown Dubai', value: 'Downtown Dubai' },
  { label: 'Dubai Marina', value: 'Dubai Marina' },
  { label: 'JVC', value: 'JVC' },
  { label: 'Palm Jumeirah', value: 'Palm Jumeirah' },
  { label: 'Business Bay', value: 'Business Bay' },
  { label: 'JBR', value: 'JBR' },
  { label: 'DIFC', value: 'DIFC' },
  { label: 'Jumeirah', value: 'Jumeirah' },
];

const developerOptions: Option[] = [
  { label: 'All Developers', value: '' },
  { label: 'Emaar', value: 'Emaar' },
  { label: 'Damac', value: 'Damac' },
  { label: 'Meraas', value: 'Meraas' },
  { label: 'Aldar', value: 'Aldar' },
  { label: 'Dubai Properties', value: 'Dubai Properties' },
  { label: 'Sobha', value: 'Sobha' },
  { label: 'Nakheel', value: 'Nakheel' },
];

const typeOptions: Option[] = [
  { label: 'All Types', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Studio', value: 'studio' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Mansion', value: 'mansion' },
  { label: 'Plot', value: 'plot' },
];

const bedroomOptions: Option[] = [
  { label: 'Any Beds', value: '' },
  { label: 'Studio', value: '0' },
  { label: '1 BR', value: '1' },
  { label: '2 BR', value: '2' },
  { label: '3 BR', value: '3' },
  { label: '4 BR', value: '4' },
  { label: '5+ BR', value: '5' },
];

const statusOptions: Option[] = [
  { label: 'Any Status', value: '' },
  { label: 'Off-Plan', value: 'off-plan' },
  { label: 'Ready to Move', value: 'ready' },
  { label: 'For Sale', value: 'for-sale' },
  { label: 'For Rent', value: 'for-rent' },
];

// Value format: "min-max", "-max" for under, "min-" for over
const priceOptions: Option[] = [
  { label: 'Any Price', value: '' },
  { label: 'Under 500K AED', value: '-500000' },
  { label: '500K – 1M AED', value: '500000-1000000' },
  { label: '1M – 2M AED', value: '1000000-2000000' },
  { label: '2M – 5M AED', value: '2000000-5000000' },
  { label: '5M+ AED', value: '5000000-' },
];

export default function PropertySearch() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    emirate: '',
    location: '',
    developer: '',
    type: '',
    bedrooms: '',
    price: '',
    status: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.emirate) params.set('emirate', filters.emirate);
    if (filters.location) params.set('location', filters.location);
    if (filters.developer) params.set('developer', filters.developer);
    if (filters.type) params.set('type', filters.type);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.status) params.set('status', filters.status);
    if (filters.price) {
      const [min, max] = filters.price.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    router.push(`/property?${params.toString()}`);
  };

  return (
    <section
      className="relative z-20 py-16 sm:py-20 px-4"
      style={{ background: '#0f1523' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 sm:p-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: '#C9A96E' }}>
              Property Search
            </p>
            <span className="section-divider mx-auto mb-5" />
            <h2
              className="font-serif text-3xl sm:text-4xl font-light text-white mb-2 leading-tight"
            >
              Find Your Ideal Property
            </h2>
            <p className="text-xs tracking-[0.08em]" style={{ color: '#94A3B8' }}>
              Dubai&apos;s finest properties — curated for discerning buyers
            </p>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <SelectField label="Emirates" options={emirateOptions} value={filters.emirate} onChange={set('emirate')} />
            <SelectField label="Location" options={locationOptions} value={filters.location} onChange={set('location')} />
            <SelectField label="Developer" options={developerOptions} value={filters.developer} onChange={set('developer')} />
            <SelectField label="Property Type" options={typeOptions} value={filters.type} onChange={set('type')} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <SelectField label="Bedrooms" options={bedroomOptions} value={filters.bedrooms} onChange={set('bedrooms')} />
            <SelectField label="Price Range" options={priceOptions} value={filters.price} onChange={set('price')} />
            <SelectField label="Status" options={statusOptions} value={filters.status} onChange={set('status')} />
          </div>

          {/* Search button — full width, animated */}
          <motion.button
            onClick={handleSearch}
            whileHover={{ scale: 1.03, backgroundColor: '#C9A96E', color: '#0A0E1A', boxShadow: '0 0 24px rgba(201,169,110,0.4)' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full flex items-center justify-center gap-2.5"
            style={{
              border: '1px solid #C9A96E',
              color: '#C9A96E',
              background: 'transparent',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              padding: '0.9375rem 2rem',
            }}
          >
            <Search className="w-3.5 h-3.5" />
            Find Properties
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label: _label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="select-dark pr-8 text-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value || opt.label} value={opt.value} style={{ background: '#0d1117', color: '#e2c992' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
