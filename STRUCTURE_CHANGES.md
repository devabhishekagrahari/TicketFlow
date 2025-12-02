# 📁 Project Structure Changes

## Overview

The project has been restructured to support **easy separate deployment** of frontend and backend while maintaining backward compatibility with monolith deployment.

## What Changed

### ✅ New Files Created

1. **`client/package.json`** - Frontend-specific dependencies and scripts
2. **`server/package.json`** - Backend-specific dependencies and scripts
3. **`client/vite.config.ts`** - Updated frontend build configuration
4. **`script/build-frontend.ts`** - Separate frontend build script
5. **`script/build-backend.ts`** - Separate backend build script
6. **`script/build-monolith.ts`** - Monolith build script (renamed from build.ts)
7. **`client/README.md`** - Frontend documentation
8. **`server/README.md`** - Backend documentation
9. **`DEPLOY_SEPARATE.md`** - Separate deployment guide
10. **`QUICK_START.md`** - Quick reference guide
11. **`.gitignore`** - Updated gitignore for new structure

### 🔄 Updated Files

1. **`package.json`** - Added new scripts for separate builds
2. **`README.md`** - Updated with new structure and deployment options
3. **`vite.config.ts`** - Kept for monolith builds (root level)

## New Project Structure

```
TicketFlow 2/
├── client/                    # Frontend application
│   ├── package.json          # ✨ NEW: Frontend dependencies
│   ├── vite.config.ts        # ✨ UPDATED: Frontend-only config
│   ├── README.md             # ✨ NEW: Frontend docs
│   ├── src/
│   └── ...
├── server/                    # Backend application
│   ├── package.json          # ✨ NEW: Backend dependencies
│   ├── README.md             # ✨ NEW: Backend docs
│   ├── index.ts
│   └── ...
├── script/
│   ├── build-frontend.ts     # ✨ NEW: Frontend build
│   ├── build-backend.ts      # ✨ NEW: Backend build
│   └── build-monolith.ts     # ✨ NEW: Monolith build
├── package.json              # 🔄 UPDATED: New scripts
├── README.md                 # 🔄 UPDATED: New structure
├── DEPLOY_SEPARATE.md        # ✨ NEW: Separate deployment guide
└── QUICK_START.md            # ✨ NEW: Quick reference
```

## Build Outputs

### Separate Deployment
- **Frontend**: `dist/frontend/` (deploy to Vercel, Netlify, etc.)
- **Backend**: `dist/backend/` (deploy to Railway, Render, etc.)

### Monolith Deployment
- **Server**: `dist/index.cjs`
- **Frontend**: `dist/public/` (served by backend)

## New Commands

### Installation
```bash
npm run install:all    # Install root, client, and server dependencies
```

### Development
```bash
npm run dev:client     # Frontend dev server (port 3000)
npm run dev:backend    # Backend dev server (port 5000)
npm run dev            # Monolith dev server (port 5000)
```

### Building
```bash
npm run build:frontend  # Build frontend only → dist/frontend/
npm run build:backend   # Build backend only → dist/backend/
npm run build:all       # Build both separately
npm run build           # Build monolith → dist/index.cjs + dist/public/
```

### Type Checking
```bash
npm run check:frontend  # Check frontend types
npm run check:backend   # Check backend types
npm run check           # Check all types
```

## Deployment Options

### Option 1: Separate Deployment (Recommended)
- **Frontend**: Deploy `dist/frontend/` to static hosting
- **Backend**: Deploy `dist/backend/` to Node.js hosting
- **Benefits**: Better scalability, independent scaling, CDN support

### Option 2: Monolith Deployment
- Deploy entire `dist/` folder to single server
- **Benefits**: Simpler setup, single deployment

## Environment Variables

### Frontend (`client/.env.local`)
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=BusLink
```

### Backend (`server/.env`)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

## Migration Guide

### For Existing Deployments

**Monolith deployments** continue to work:
```bash
npm run build
npm start
```

**To switch to separate deployment:**
1. Build separately: `npm run build:all`
2. Deploy `dist/frontend/` to frontend hosting
3. Deploy `dist/backend/` to backend hosting
4. Set `CORS_ORIGIN` in backend environment
5. Set `VITE_API_URL` in frontend environment

## Benefits

✅ **Easy separate deployment** - Frontend and backend can be deployed independently  
✅ **Better scalability** - Scale frontend and backend separately  
✅ **CDN support** - Frontend can use CDN for static assets  
✅ **Independent updates** - Update frontend or backend without affecting the other  
✅ **Backward compatible** - Monolith deployment still works  
✅ **Clear separation** - Each part has its own dependencies and scripts  

## Documentation

- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Frontend**: [client/README.md](./client/README.md)
- **Backend**: [server/README.md](./server/README.md)
- **Separate Deployment**: [DEPLOY_SEPARATE.md](./DEPLOY_SEPARATE.md)
- **Monolith Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Next Steps

1. **Install dependencies**: `npm run install:all`
2. **Set up environment variables** (see above)
3. **Choose deployment option** (separate or monolith)
4. **Follow deployment guide** for your chosen option

---

**Questions?** Check the documentation files or review the README.md for more details.

