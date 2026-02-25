import axios from 'axios';
import type {
  Property,
  Developer,
  Agent,
  BlogPost,
  Stats,
  MortgageInquiry,
  PropertyFilters,
  PaginatedResponse,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request when available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize backend property → frontend Property
function normalizeProperty(p: any): Property {
  return {
    id: p._id || p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    priceLabel: p.priceLabel || `AED ${(p.price / 1000000).toFixed(1)}M`,
    type: p.propertyType || p.type,
    status: p.status,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    area: p.squareFt || p.area || 0,
    location: p.location?.area || p.location || '',
    emirate: p.location?.emirate || p.emirate || 'Dubai',
    developer: typeof p.developer === 'object' ? p.developer?.name : p.developer || '',
    developerLogo: typeof p.developer === 'object' ? p.developer?.logo : undefined,
    completionDate: p.completionYear || p.completionDate || '',
    paymentPlan: p.paymentPlan?.description || p.paymentPlan || '',
    description: p.description || '',
    images: p.images || [],
    amenities: p.amenities || [],
    floorPlan: p.floorPlanImages?.[0] || p.floorPlan,
    latitude: p.location?.coordinates?.lat,
    longitude: p.location?.coordinates?.lng,
    agent: p.agent ? normalizeAgent(p.agent) : undefined,
    featured: p.isFeatured || p.featured || false,
    createdAt: p.createdAt,
  };
}

// Normalize backend agent → frontend Agent
function normalizeAgent(a: any): Agent {
  if (!a) return {} as Agent;
  return {
    id: String(a._id || a.id || ''),
    name: a.name || '',
    photo: a.photo || '',
    phone: a.phone || '',
    whatsapp: a.phone || '',
    email: a.email || '',
    languages: a.languages || [],
    properties: a.propertyCount || a.assignedProperties?.length || 0,
    bio: a.bio || a.specialization || '',
  };
}

// Normalize backend developer → frontend Developer
function normalizeDeveloper(d: any): Developer {
  return {
    id: d._id || d.id,
    slug: d.slug,
    name: d.name,
    logo: d.logo || '',
    description: d.description || '',
    properties: d.propertyCount || d.projectsCount || 0,
    projects: (d.properties || []).map(normalizeProperty),
    established: d.createdAt,
    website: d.website,
  };
}

// Normalize backend blog → frontend BlogPost
function normalizeBlogPost(b: any): BlogPost {
  return {
    id: b._id || b.id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt || '',
    content: b.content || '',
    image: b.coverImage || b.image || '',
    author: b.author || 'Awtad Real Estate Editorial',
    publishedAt: b.publishedAt || b.createdAt,
    category: b.category || 'Market Insights',
    tags: b.tags || [],
  };
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get('/properties', { params: filters });
  return {
    ...data,
    data: (data.data || []).map(normalizeProperty),
  };
}

export async function getProperty(slug: string): Promise<Property> {
  const { data } = await api.get(`/properties/${slug}`);
  return normalizeProperty(data);
}

export async function getDevelopers(): Promise<Developer[]> {
  const { data } = await api.get('/developers');
  return (data || []).map(normalizeDeveloper);
}

export async function getDeveloper(slug: string): Promise<Developer> {
  const { data } = await api.get(`/developers/${slug}`);
  return normalizeDeveloper(data);
}

export async function getAgents(): Promise<Agent[]> {
  const { data } = await api.get('/agents');
  return (data || []).map(normalizeAgent);
}

export async function getAgent(id: string): Promise<{ agent: Agent; properties: Property[] }> {
  const { data } = await api.get(`/agents/${id}`);
  return {
    agent: normalizeAgent(data.agent),
    properties: (data.properties || []).map(normalizeProperty),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await api.get('/blog');
  return (data || []).map(normalizeBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const { data } = await api.get(`/blog/${slug}`);
  return normalizeBlogPost(data);
}

export async function submitMortgageInquiry(formData: MortgageInquiry): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/mortgage/inquiry', {
    fullName: formData.name,
    phone: formData.phone,
    email: formData.email,
    loanAmountAED: formData.loanAmount,
  });
  return data;
}

export async function getStats(): Promise<Stats> {
  const { data } = await api.get('/stats');
  return data;
}

export default api;
