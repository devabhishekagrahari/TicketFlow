# 🚀 Quick Start Guide

## Installation

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

## Development

### Run Frontend Only
```bash
npm run dev:client
# Opens on http://localhost:3000
```

### Run Backend Only
```bash
npm run dev:backend
# Runs on http://localhost:5000
```

### Run Both (Monolith)
```bash
npm run dev
# Backend serves frontend on http://localhost:5000
```

## Building

### Build Frontend Separately
```bash
npm run build:frontend
# Output: dist/frontend/
```

### Build Backend Separately
```bash
npm run build:backend
# Output: dist/backend/
```

### Build Both Separately
```bash
npm run build:all
```

### Build Monolith (Together)
```bash
npm run build
# Output: dist/index.cjs + dist/public/
```

## Environment Setup

### Frontend Environment
Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

### Backend Environment
Create `server/.env`:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Database Setup

```bash
# Push schema to database
npm run db:push

# Seed initial data
tsx server/seed.ts
```

## Deployment

### Separate Deployment (Recommended)
- **Frontend**: See [DEPLOY_SEPARATE.md](./DEPLOY_SEPARATE.md)
- **Backend**: See [DEPLOY_SEPARATE.md](./DEPLOY_SEPARATE.md)

### Monolith Deployment
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Project Structure

```
TicketFlow 2/
├── client/          # Frontend (React + Vite)
│   ├── package.json
│   └── src/
├── server/          # Backend (Express + Node)
│   ├── package.json
│   └── index.ts
├── shared/          # Shared types/schemas
└── package.json     # Root workspace
```

## Common Commands

```bash
# Type checking
npm run check              # All
npm run check:frontend     # Frontend only
npm run check:backend      # Backend only

# Development
npm run dev:client         # Frontend dev server
npm run dev:backend        # Backend dev server

# Building
npm run build:frontend     # Build frontend
npm run build:backend      # Build backend
npm run build:all          # Build both
npm run build              # Build monolith
```

## Need Help?

- **Frontend**: See [client/README.md](./client/README.md)
- **Backend**: See [server/README.md](./server/README.md)
- **Deployment**: See [DEPLOY_SEPARATE.md](./DEPLOY_SEPARATE.md)
- **API Docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

