import api from './api';

export interface AgentProperty {
  _id: string;
  title: string;
  slug: string;
  propertyType: string;
  status: string;
  completionStatus: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFt: number;
  isFeatured: boolean;
  images: string[];
  amenities: string[];
  developer?: { name: string } | null;
  location: { area: string; emirate: string };
  description: string;
  completionYear: string;
  paymentPlan: { downPayment: number; onCompletion: number; description: string };
  createdAt: string;
}

export interface MyPropertiesResponse {
  data: AgentProperty[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getMyProperties(page = 1): Promise<MyPropertiesResponse> {
  const { data } = await api.get('/properties/mine', { params: { page, limit: 20 } });
  return data;
}

export interface PropertyPayload {
  title: string;
  description?: string;
  price: number;
  propertyType: string;
  status: string;
  completionStatus?: string;
  completionYear?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFt?: number;
  location?: { area: string; emirate: string };
  paymentPlan?: { downPayment: number; onCompletion: number; description: string };
  developer?: string | null;  // Developer ObjectId (optional)
  images?: string[];
  amenities?: string[];
}

export async function createProperty(payload: PropertyPayload): Promise<AgentProperty> {
  const { data } = await api.post('/properties', payload);
  return data.data;
}

export async function updateProperty(id: string, payload: Partial<PropertyPayload>): Promise<AgentProperty> {
  const { data } = await api.put(`/properties/${id}`, payload);
  return data.data;
}

export async function deleteMyProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}

export async function getPropertyById(id: string): Promise<AgentProperty> {
  const { data } = await api.get(`/properties/id/${id}`);
  return data.data;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  photo?: string;
  languages?: string[];
  specialization?: string;
  bio?: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<any> {
  const { data } = await api.put('/agents/profile', payload);
  return data;
}
