import { getProperties } from '@/lib/api';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyGrid from '@/components/property/PropertyGrid';

export default async function PropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  let result;
  try {
    // Map 'off-plan' / 'ready' status values to completionStatus without
    // mutating the read-only searchParams object.
    const isCompletionFilter =
      params.status === 'off-plan' ||
      params.status === 'ready' ||
      params.status === 'ready-to-move';

    const completionStatus = isCompletionFilter
      ? params.status === 'off-plan' ? 'off-plan' : 'ready-to-move'
      : params.completionStatus;

    const statusFilter = isCompletionFilter ? undefined : params.status;

    result = await getProperties({
      type: params.type,
      bedrooms: params.bedrooms,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      emirate: params.emirate,
      location: params.location,
      completionStatus,
      developer: params.developer,
      status: statusFilter,
      sort: params.sort as any,
      page,
      limit: 12,
    });
  } catch {
    result = { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          {params.type
            ? `${params.type.charAt(0).toUpperCase() + params.type.slice(1)} Properties`
            : 'All Properties'}
        </h1>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <PropertyFilters />
          <PropertyGrid
            properties={result.data}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
          />
        </div>
      </div>
    </main>
  );
}
