import api from './api';

// ─── Dashboard ────────────────────────────────────────────
export interface DashboardStats {
  totalProperties: number;
  totalAgents: number;
  pendingAgents: number;
  totalInquiries: number;
  pendingInquiries: number;
  unseenNotifications: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

// ─── Agents ───────────────────────────────────────────────
export interface AdminAgent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isApproved: boolean;
  specialization?: string;
  languages?: string[];
  bio?: string;
  createdAt: string;
}

export async function getAgents(approved?: boolean): Promise<AdminAgent[]> {
  // Backend compares with string equality ('true'/'false'), so convert explicitly
  const params = approved !== undefined ? { approved: String(approved) } : {};
  const { data } = await api.get('/admin/agents', { params });
  return data.data;
}

export async function approveAgent(id: string): Promise<void> {
  await api.patch(`/admin/agents/${id}/approve`);
}

export async function rejectAgent(id: string): Promise<void> {
  await api.patch(`/admin/agents/${id}/reject`);
}

export async function deleteAgent(id: string): Promise<void> {
  await api.delete(`/admin/agents/${id}`);
}

// ─── Properties ───────────────────────────────────────────
export interface AdminProperty {
  _id: string;
  title: string;
  slug: string;
  propertyType: string;  // matches Property model field name
  status: string;
  price: number;
  isFeatured: boolean;
  agent?: { name: string; email: string };
  developer?: { name: string };
  createdAt: string;
}

export interface AdminPropertiesResponse {
  data: AdminProperty[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAdminProperties(page = 1): Promise<AdminPropertiesResponse> {
  const { data } = await api.get('/admin/properties', { params: { page, limit: 20 } });
  return data;
}

export async function forceDeleteProperty(id: string): Promise<void> {
  await api.delete(`/admin/properties/${id}`);
}

export async function toggleFeatured(id: string): Promise<void> {
  await api.patch(`/properties/${id}/feature`);
}

// ─── Inquiries ────────────────────────────────────────────
export type InquiryStatus = 'pending' | 'contacted' | 'approved';

// Matches MortgageInquiry Mongoose model exactly
export interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  loanAmountAED: number;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiriesResponse {
  data: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getInquiries(page = 1, status?: InquiryStatus): Promise<InquiriesResponse> {
  const params: Record<string, any> = { page, limit: 20 };
  if (status) params.status = status;
  const { data } = await api.get('/admin/inquiries', { params });
  return data;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await api.patch(`/admin/inquiries/${id}/status`, { status });
}

// ─── Contact Messages ─────────────────────────────────────
export type ContactMessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface ContactMessagesResponse {
  data: ContactMessage[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getContactMessages(page = 1, status?: ContactMessageStatus): Promise<ContactMessagesResponse> {
  const params: Record<string, any> = { page, limit: 20 };
  if (status) params.status = status;
  const { data } = await api.get('/admin/contact-messages', { params });
  return data;
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus): Promise<void> {
  await api.patch(`/admin/contact-messages/${id}/status`, { status });
}

// ─── Property Inquiries ───────────────────────────────────
export type PropertyInquiryStatus = 'new' | 'contacted' | 'closed';

export interface PropertyInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: { _id: string; title: string };
  agent?: { _id: string; name: string; email: string };
  status: PropertyInquiryStatus;
  createdAt: string;
}

export interface PropertyInquiriesResponse {
  data: PropertyInquiry[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getPropertyInquiries(page = 1, status?: PropertyInquiryStatus): Promise<PropertyInquiriesResponse> {
  const params: Record<string, any> = { page, limit: 20 };
  if (status) params.status = status;
  const { data } = await api.get('/admin/property-inquiries', { params });
  return data;
}

export async function updatePropertyInquiryStatus(id: string, status: PropertyInquiryStatus): Promise<void> {
  await api.patch(`/admin/property-inquiries/${id}/status`, { status });
}
