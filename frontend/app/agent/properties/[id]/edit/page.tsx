'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PropertyForm, { PropertyFormValues } from '@/components/agent/PropertyForm';
import { getPropertyById, updateProperty, PropertyPayload, AgentProperty } from '@/lib/agentApi';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<AgentProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    getPropertyById(id)
      .then(setProperty)
      .catch(() => setFetchError('Property not found or you do not have access.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload: PropertyPayload) => {
    setServerError('');
    try {
      await updateProperty(id, payload);
      router.refresh();
      router.replace('/agent/properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update property.';
      setServerError(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
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
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Edit Property</h1>
        <p className="text-sm mt-1 truncate max-w-md" style={{ color: '#8892a4' }}>{property.title}</p>
      </div>

      <div className="max-w-3xl">
        <PropertyForm
          defaultValues={defaults}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          serverError={serverError}
        />
      </div>
    </div>
  );
}
