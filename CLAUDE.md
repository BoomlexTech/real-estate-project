# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Awtad Real Estate** — a Dubai luxury real estate platform with a Next.js 16 frontend and an Express.js backend connected to MongoDB.

## Repository Structure

```
real-estate/
├── backend/          # Express.js API (CommonJS, Node.js)
│   ├── server.js     # Entry point
│   └── src/
│       ├── config/   # MongoDB connection (db.js)
│       ├── controllers/
│       ├── middleware/  # auth.js (JWT), roleAuth.js, errorHandler.js
│       ├── models/   # Mongoose schemas
│       ├── routes/
│       └── seed/     # seed.js, updateImages.js
└── frontend/         # Next.js 16 App Router (TypeScript)
    ├── app/          # Pages (App Router)
    ├── components/
    │   ├── layout/   # Header, Footer, MobileMenu
    │   ├── home/
    │   ├── property/
    │   ├── agent/
    │   ├── auth/
    │   └── common/
    ├── contexts/     # AuthContext.tsx
    └── lib/          # api.ts, types.ts, auth.ts, adminApi.ts, authApi.ts, agentApi.ts
```

## Development Commands

### Backend (run from `backend/`)
```bash
cd backend
npm run dev          # Start server (node server.js) on port 5000
```

### Frontend (run from `frontend/`)
```bash
cd frontend
npm run dev          # Next.js dev server on port 3000
npm run build        # Production build
npm run lint         # ESLint
```

## Environment Variables

**Backend** (`backend/.env`):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWTs
- `PORT` — Server port (default: 5000)
- `CORS_ORIGIN` — Allowed frontend origin (e.g., `http://localhost:3000`)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL` — Backend base URL (default: `http://localhost:5000/api`)

## Architecture

### Backend API Routes
All routes are prefixed with `/api`:
- `/auth` — Login/register for admins and agents
- `/admin` — Admin-only dashboard, agent management, property management, inquiries
- `/properties` — CRUD for properties (public GET, protected POST/PUT/DELETE)
- `/developers` — Developer profiles
- `/agents` — Agent listings
- `/blog` — Blog posts
- `/mortgage` — Mortgage inquiry submission
- `/stats` — Aggregate stats

### Authentication & Authorization
- JWT tokens stored in `localStorage` under key `rc_token`; user info under `rc_user`
- Two roles: `admin` (User model) and `agent` (Agent model)
- Backend middleware chain: `protect` (verifies JWT, attaches `req.user`) → `isAdmin`/`isAgent`/`isApprovedAgent`/`isOwnerOrAdmin`
- Agents require admin approval (`isApproved` flag) before accessing protected routes
- Frontend: `AuthContext` (`contexts/AuthContext.tsx`) holds user/token state; `lib/auth.ts` handles localStorage operations

### Frontend Data Layer
- `lib/api.ts` — Public API calls (properties, developers, agents, blog, stats, mortgage inquiry). Contains `normalizeProperty`, `normalizeAgent`, `normalizeDeveloper`, `normalizeBlogPost` functions that map backend MongoDB fields to frontend TypeScript types.
- `lib/adminApi.ts` — Admin-only API calls (dashboard stats, agent approval, property management, inquiries)
- `lib/authApi.ts` — Auth endpoints (login, register, `getMe`)
- `lib/agentApi.ts` — Agent-specific API calls
- `lib/types.ts` — Shared TypeScript interfaces for `Property`, `Developer`, `Agent`, `BlogPost`, `Stats`, `MortgageInquiry`, `PropertyFilters`, `PaginatedResponse`

### Key Data Mapping Notes
- Backend uses `_id` (MongoDB ObjectId); frontend normalizes to `id`
- Backend field `propertyType` maps to frontend `type`; `squareFt` → `area`; `isFeatured` → `featured`
- `location` is a nested object `{ area, emirate, coordinates }` in the DB; normalized to flat strings in frontend
- Property `status` in the DB includes `'pending_review'` which is not exposed in the frontend `PropertyFilters` type

### Admin Panel
Located at `frontend/app/admin/`. Sections: dashboard, properties, agents, inquiries. Protected routes that check `user.role === 'admin'` via `AuthContext`.

### Next.js Image Domains
Allowed remote image hostnames (configured in `next.config.ts`): `*.awtadrealestate.com`, `images.unsplash.com`, `media.istockphoto.com`, `images.pexels.com`, `localhost`.
