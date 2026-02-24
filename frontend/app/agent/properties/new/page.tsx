'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm, { PropertyFormValues } from '@/components/agent/PropertyForm';
import { createProperty, PropertyPayload } from '@/lib/agentApi';

export default function NewPropertyPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (payload: PropertyPayload) => {
    setServerError('');
    try {
      await createProperty(payload);
      router.replace('/agent/properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create property.';
      setServerError(msg);
    }
  };

  const defaults: Partial<PropertyFormValues> = {
    status: 'for-sale',
    completionStatus: 'ready-to-move',
    emirate: 'Dubai',
    bedrooms: 0,
    bathrooms: 0,
    squareFt: 0,
    ppDown: 0,
    ppOnCompletion: 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>Add New Property</h1>
        <p className="text-sm mt-1" style={{ color: '#8892a4' }}>Fill in the details to list a new property</p>
      </div>

      <div className="max-w-3xl">
        <PropertyForm
          defaultValues={defaults}
          onSubmit={handleSubmit}
          submitLabel="Create Property"
          serverError={serverError}
        />
      </div>
    </div>
  );
}
