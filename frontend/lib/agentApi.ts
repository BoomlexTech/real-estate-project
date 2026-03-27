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
  hasPendingChanges?: boolean;
  brochureUrl?: string;
  brochureDownloadCount?: number;
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
  brochureUrl?: string;
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
  whatsapp?: string;
  photo?: string;
  languages?: string[];
  specialization?: string;
  bio?: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<any> {
  const { data } = await api.put('/agents/profile', payload);
  return data;
}

export interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  property?: { _id: string; title: string; slug: string };
}

export interface InquiriesResponse {
  data: InquiryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getMyInquiries(page = 1): Promise<InquiriesResponse> {
  const { data } = await api.get('/agents/inquiries', { params: { page, limit: 20 } });
  return data;
}

export async function updateMyInquiryStatus(id: string, status: string): Promise<void> {
  await api.patch(`/agents/inquiries/${id}/status`, { status });
}

// ─── Agent Blog Posts ─────────────────────────────────────

export interface AgentBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved';
  submittedByName?: string;
  createdAt: string;
}

export interface AgentBlogPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export interface AgentBlogResponse {
  data: AgentBlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

export async function submitBlogPost(payload: AgentBlogPayload): Promise<AgentBlogPost> {
  const { data } = await api.post('/blog/submit', payload);
  return data.data;
}

export async function getMyBlogPosts(page = 1): Promise<AgentBlogResponse> {
  const { data } = await api.get('/blog/mine', { params: { page, limit: 20 } });
  return data;
}

export async function deleteMyBlogPost(id: string): Promise<void> {
  await api.delete(`/blog/mine/${id}`);
}

// ─── Agent Brochure Analytics ─────────────────────────────
export interface AgentBrochureLead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AgentAnalyticsItem {
  _id: string;
  title: string;
  images: string[];
  leads: AgentBrochureLead[];
}

export async function getMyPropertiesAnalytics(): Promise<AgentAnalyticsItem[]> {
  const { data } = await api.get('/properties/mine/analytics');
  return data.data;
}

export async function deleteAgentBrochureLead(leadId: string): Promise<void> {
  await api.delete(`/properties/mine/analytics/leads/${leadId}`);
}
