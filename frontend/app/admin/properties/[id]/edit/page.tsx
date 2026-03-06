'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PropertyForm, { PropertyFormValues } from '@/components/agent/PropertyForm';
import { AgentProperty, PropertyPayload } from '@/lib/agentApi';
import { getAdminPropertyById, updateAdminProperty } from '@/lib/adminApi';
import { useTheme } from '@/contexts/ThemeContext';

// Admin has an additional 'sold' status option
const ADMIN_EXTRA_STATUSES = ['sold'];

export default function AdminEditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { palette } = useTheme();
  const [property, setProperty] = useState<AgentProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getAdminPropertyById(id)
      .then(setProperty)
      .catch(() => setFetchError('Property not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload: PropertyPayload) => {
    setServerError('');
    try {
      await updateAdminProperty(id, payload);
      router.replace('/admin/properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update property.';
      setServerError(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: palette.gold, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (fetchError || !property) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: '#e74c3c' }}>{fetchError || 'Property not found.'}</p>
      </div>
    );
  }

  const defaults: PropertyFormValues = {
    title: property.title,
    description: property.description || '',
    price: property.price,
    propertyType: property.propertyType,
    status: property.status,
    completionStatus: property.completionStatus || 'ready-to-move',
    completionYear: property.completionYear || '',
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    squareFt: property.squareFt ?? 0,
    emirate: property.location?.emirate || 'Dubai',
    area: property.location?.area || '',
    ppDown: property.paymentPlan?.downPayment ?? 0,
    ppOnCompletion: property.paymentPlan?.onCompletion ?? 0,
    ppDescription: property.paymentPlan?.description || '',
    images: property.images || [],
    amenities: (property.amenities || []).join(', '),
    brochureUrl: property.brochureUrl || '',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: palette.textPrimary }}>Edit Property</h1>
        <p className="text-sm mt-1 truncate max-w-md" style={{ color: palette.textSecondary }}>{property.title}</p>
        {property.hasPendingChanges && (
          <div
            className="mt-3 px-4 py-2.5 rounded-lg text-sm"
            style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#eab308' }}
          >
            This property has pending agent changes awaiting approval.
          </div>
        )}
      </div>

      <div className="max-w-3xl">
        <PropertyForm
          defaultValues={defaults}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          serverError={serverError}
          extraStatuses={ADMIN_EXTRA_STATUSES}
        />
      </div>
    </div>
  );
}
