export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceLabel: string;
  type: 'apartment' | 'penthouse' | 'villa' | 'duplex' | 'townhouse' | 'studio' | 'plot' | 'mansion' |
  'hotel-apartment' | 'sky-villa' | 'full-floor' | 'half-floor' | 'premium-villa' |
  'apartment-private-pool' | 'studio-pool' | 'simplex-sea-views' | 'twin-villa' |
  'standalone-villa' | 'duplex-maid' | 'apartment-maid' | 'semi-detached' | 'suite' |
  'sky-mansion' | 'villa-basement' | 'office' | 'commercial';
  status: 'for-sale' | 'for-rent' | 'off-plan' | 'ready';
  bedrooms: number;
  bathrooms: number;
  area: number; // sqft
  location: string;
  emirate: string;
  developer: string;
  developerLogo?: string;
  completionDate?: string;
  paymentPlan?: string | { downPayment: number; onCompletion: number; description: string };
  description: string;
  images: string[];
  amenities: string[];
  floorPlan?: string;
  brochureUrl?: string;
  latitude?: number;
  longitude?: number;
  agent?: Agent;
  featured: boolean;
  createdAt: string;
}

export interface Developer {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  properties: number;
  projects: Property[];
  established?: string;
  website?: string;
}

export interface Agent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  languages: string[];
  properties: number;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

export interface Stats {
  totalSold: string;
  languages: number;
  offices: number;
  partners: string[];
}

export interface MortgageInquiry {
  name: string;
  phone: string;
  email: string;
  loanAmount: number;
  message?: string;
}

export interface PropertyFilters {
  type?: string;
  bedrooms?: string;
  minPrice?: number;
  maxPrice?: number;
  emirate?: string;
  location?: string;
  completionStatus?: string;
  developer?: string;
  status?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
