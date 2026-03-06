'use client';

import { useForm, Controller } from 'react-hook-form';
import { PropertyPayload } from '@/lib/agentApi';
import ImageUploadField from './ImageUploadField';

export interface PropertyFormValues {
  title: string;
  description: string;
  price: number;
  propertyType: string;
  status: string;
  completionStatus: string;
  completionYear: string;
  bedrooms: number;
  bathrooms: number;
  squareFt: number;
  emirate: string;
  area: string;
  ppDown: number;
  ppOnCompletion: number;
  ppDescription: string;
  images: string[];  // array of image URLs
  amenities: string; // comma-separated
  brochureUrl: string;
}

const PROPERTY_TYPES = [
  'apartment', 'penthouse', 'villa', 'duplex', 'townhouse', 'studio', 'plot', 'mansion',
  'hotel-apartment', 'sky-villa', 'full-floor', 'half-floor', 'premium-villa',
  'apartment-private-pool', 'studio-pool', 'simplex-sea-views', 'twin-villa', 'standalone-villa',
  'duplex-maid', 'apartment-maid', 'semi-detached', 'suite', 'sky-mansion',
  'villa-basement', 'office', 'commercial',
];

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const STATUSES = [
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
  { value: 'pending_review', label: 'Pending Review' },
];

const COMPLETION_STATUSES = [
  { value: 'ready-to-move', label: 'Ready to Move' },
  { value: 'off-plan', label: 'Off-Plan' },
];

interface Props {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (payload: PropertyPayload) => Promise<void>;
  submitLabel?: string;
  serverError?: string;
  extraStatuses?: string[];
}

const inputStyle = (hasError?: boolean) => ({
  background: '#1a1f2e',
  border: hasError ? '1px solid #e74c3c' : '1px solid #2e3446',
  color: '#e6edf3',
});

export default function PropertyForm({ defaultValues, onSubmit, submitLabel = 'Save Property', serverError, extraStatuses = [] }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({ defaultValues });

  const handleFormSubmit = async (values: PropertyFormValues) => {
    const payload: PropertyPayload = {
      title: values.title,
      description: values.description || '',
      price: Number(values.price),
      propertyType: values.propertyType,
      status: values.status,
      completionStatus: values.completionStatus,
      completionYear: values.completionYear || '',
      bedrooms: Number(values.bedrooms) || 0,
      bathrooms: Number(values.bathrooms) || 0,
      squareFt: Number(values.squareFt) || 0,
      location: { area: values.area || '', emirate: values.emirate || 'Dubai' },
      paymentPlan: {
        downPayment: Number(values.ppDown) || 0,
        onCompletion: Number(values.ppOnCompletion) || 0,
        description: values.ppDescription || '',
      },
      images: values.images ?? [],
      amenities: values.amenities ? values.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [],
      brochureUrl: values.brochureUrl || '',
    };
    await onSubmit(payload);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#8892a4' }}>{title}</h3>
      <div className="rounded-xl p-5 space-y-4" style={{ background: '#1e2436', border: '1px solid #2e3446' }}>
        {children}
      </div>
    </div>
  );

  const Field = ({
    label, required, children, error,
  }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9d1d9' }}>
        {label}{required && <span style={{ color: '#e74c3c' }}> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#e74c3c' }}>{error}</p>}
    </div>
  );

  const inputCls = 'w-full rounded-lg px-4 py-2.5 text-sm outline-none';
  const selectCls = 'w-full rounded-lg px-4 py-2.5 text-sm outline-none';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Basic Info */}
      <Section title="Basic Information">
        <Field label="Title" required error={errors.title?.message}>
          <input
            type="text"
            placeholder="e.g. Luxury 2BR Apartment in Downtown Dubai"
            className={inputCls}
            style={inputStyle(!!errors.title)}
            {...register('title', { required: 'Title is required' })}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property Type" required error={errors.propertyType?.message}>
            <select
              className={selectCls}
              style={inputStyle(!!errors.propertyType)}
              {...register('propertyType', { required: 'Property type is required' })}
            >
              <option value="">Select type…</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </Field>

          <Field label="Listing Status" required error={errors.status?.message}>
            <select
              className={selectCls}
              style={inputStyle(!!errors.status)}
              {...register('status', { required: 'Status is required' })}
            >
              <option value="">Select status…</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
              {extraStatuses.map((s) => (
                <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={4}
            placeholder="Describe the property…"
            className={inputCls + ' resize-none'}
            style={inputStyle()}
            {...register('description')}
          />
        </Field>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <Field label="Price (AED)" required error={errors.price?.message}>
          <input
            type="number"
            min={0}
            placeholder="e.g. 2500000"
            className={inputCls}
            style={inputStyle(!!errors.price)}
            {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be positive' } })}
          />
        </Field>
      </Section>

      {/* Details */}
      <Section title="Property Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Bedrooms">
            <input type="number" min={0} className={inputCls} style={inputStyle()} placeholder="0" {...register('bedrooms')} />
          </Field>
          <Field label="Bathrooms">
            <input type="number" min={0} className={inputCls} style={inputStyle()} placeholder="0" {...register('bathrooms')} />
          </Field>
          <Field label="Area (sqft)">
            <input type="number" min={0} className={inputCls} style={inputStyle()} placeholder="0" {...register('squareFt')} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Completion Status">
            <select className={selectCls} style={inputStyle()} {...register('completionStatus')}>
              {COMPLETION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Completion Year">
            <input type="text" placeholder="e.g. 2026" className={inputCls} style={inputStyle()} {...register('completionYear')} />
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Emirate">
            <select className={selectCls} style={inputStyle()} {...register('emirate')}>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Field>
          <Field label="Area / Neighbourhood">
            <input type="text" placeholder="e.g. Downtown Dubai, Palm Jumeirah…" className={inputCls} style={inputStyle()} {...register('area')} />
          </Field>
        </div>
      </Section>

      {/* Payment Plan */}
      <Section title="Payment Plan">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Down Payment %">
            <input type="number" min={0} max={100} placeholder="20" className={inputCls} style={inputStyle()} {...register('ppDown')} />
          </Field>
          <Field label="On Completion %">
            <input type="number" min={0} max={100} placeholder="80" className={inputCls} style={inputStyle()} {...register('ppOnCompletion')} />
          </Field>
          <Field label="Payment Plan Description">
            <input type="text" placeholder="e.g. 20/80 plan" className={inputCls} style={inputStyle()} {...register('ppDescription')} />
          </Field>
        </div>
      </Section>

      {/* Media */}
      <Section title="Images & Amenities">
        <Field label="Images">
          <Controller
            name="images"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <ImageUploadField value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>

        <Field label="Amenities">
          <input
            type="text"
            placeholder="Pool, Gym, Parking, Balcony…"
            className={inputCls}
            style={inputStyle()}
            {...register('amenities')}
          />
          <p className="mt-1 text-xs" style={{ color: '#8892a4' }}>Separate with commas</p>
        </Field>

        <Field label="Brochure URL (PDF)">
          <input
            type="url"
            placeholder="https://example.com/brochure.pdf"
            className={inputCls}
            style={inputStyle()}
            {...register('brochureUrl')}
          />
          <p className="mt-1 text-xs" style={{ color: '#8892a4' }}>Optional. If set, a Download Brochure button will appear on the property page.</p>
        </Field>
      </Section>

      {serverError && (
        <div
          className="mb-4 rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c' }}
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ background: '#c9a84c', color: '#1a1f2e' }}
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
