# 🚀 Deploying Frontend and Backend Separately

This guide explains how to deploy the BusLink application with frontend and backend on separate platforms.

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon, Supabase, AWS RDS, etc.)
- Frontend hosting account (Vercel, Netlify, etc.)
- Backend hosting account (Railway, Render, DigitalOcean, etc.)

## 🏗️ Project Structure

```
TicketFlow 2/
├── client/              # Frontend (React + Vite)
│   ├── package.json     # Frontend dependencies
│   ├── vite.config.ts   # Frontend build config
│   └── src/
├── server/              # Backend (Express + Node.js)
│   ├── package.json     # Backend dependencies
│   └── index.ts
├── shared/              # Shared code (types, schemas)
└── package.json         # Root (workspace scripts)
```

## 🔧 Setup Steps

### 1. Install Dependencies

From the root directory:
```bash
npm run install:all
```

Or manually:
```bash
npm install              # Root dependencies
cd client && npm install # Frontend dependencies
cd ../server && npm install # Backend dependencies
```

### 2. Build Separately

**Build Frontend:**
```bash
npm run build:frontend
# Output: dist/frontend/
```

**Build Backend:**
```bash
npm run build:backend
# Output: dist/backend/
```

**Build Both:**
```bash
npm run build:all
```

---

## 🌐 Backend Deployment

### Step 1: Prepare Backend

1. **Set up environment variables** in your hosting platform:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db
   JWT_SECRET=your-strong-random-secret-min-32-chars
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Build the backend:**
   ```bash
   cd server
   npm run build
   ```

3. **Deploy `dist/backend/` folder** to your hosting platform

### Step 2: Deploy to Platform

#### Option A: Railway
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory to `server/`
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add PostgreSQL service
7. Set environment variables
8. Deploy

#### Option B: Render
1. Create new Web Service
2. Connect repository
3. Set root directory: `server`
4. Build command: `npm run build`
5. Start command: `npm start`
6. Add PostgreSQL database
7. Set environment variables
8. Deploy

#### Option C: DigitalOcean App Platform
1. Create new App
2. Connect repository
3. Add component:
   - Type: Web Service
   - Source: `server/`
   - Build command: `npm run build`
   - Run command: `npm start`
4. Add PostgreSQL database component
5. Set environment variables
6. Deploy

#### Option D: VPS (Ubuntu)
```bash
# On your server
cd /var/www
git clone <your-repo-url> buslink
cd buslink/server

# Install dependencies
npm install --production

# Build
npm run build

# Set up environment
cp .env.example .env
# Edit .env with your values

# Use PM2
npm install -g pm2
pm2 start dist/backend/index.cjs --name buslink-api
pm2 save
pm2 startup
```

### Step 3: Database Setup

After backend is deployed:
```bash
# SSH into server or use platform console
npm run db:push
```

Or run migrations manually if your platform supports it.

### Step 4: Test Backend

```bash
# Test API endpoint
curl https://api.yourdomain.com/api/buses

# Should return JSON response
```

---

## 🎨 Frontend Deployment

### Step 1: Prepare Frontend

1. **Set environment variables** for production build:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

2. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy `dist/frontend/` folder** to static hosting

### Step 2: Deploy to Platform

#### Option A: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://api.yourdomain.com
```

Or connect GitHub repo:
1. Import project on Vercel
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist/frontend`
5. Set environment variable: `VITE_API_URL`
6. Deploy

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd client
netlify deploy --prod --dir=dist/frontend

# Set environment variables in Netlify dashboard
```

Or connect GitHub repo:
1. Add new site on Netlify
2. Connect repository
3. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist/frontend`
4. Set environment variable: `VITE_API_URL`
5. Deploy

#### Option C: AWS S3 + CloudFront
```bash
# Build frontend
cd client
npm run build

# Upload to S3
aws s3 sync dist/frontend/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Option D: GitHub Pages
```bash
cd client
npm run build

# Copy dist/frontend/* to gh-pages branch
# Or use gh-pages package
npm install --save-dev gh-pages
# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist/frontend"
```

### Step 3: Configure CORS

Make sure your backend has `CORS_ORIGIN` set to your frontend domain:
```env
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

---

## 🔒 Security Checklist

### Backend
- [ ] `JWT_SECRET` is strong and random (32+ chars)
- [ ] Database credentials are secure
- [ ] `CORS_ORIGIN` is set to frontend domain only
- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] Database SSL enabled

### Frontend
- [ ] `VITE_API_URL` points to backend API
- [ ] No secrets in frontend code
- [ ] HTTPS enabled
- [ ] Proper CORS headers from backend

---

## 🧪 Testing Separate Deployment

### Test Backend
```bash
# Test API endpoint
curl https://api.yourdomain.com/api/buses

# Test with CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.yourdomain.com/api/buses
```

### Test Frontend
1. Open frontend URL in browser
2. Check browser console for errors
3. Test API calls (login, search, etc.)
4. Verify CORS headers in Network tab

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend.com
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=BusLink
```

---

## 🐛 Troubleshooting

### Frontend can't reach backend
- Check `VITE_API_URL` is correct
- Verify backend is running
- Check CORS configuration
- Inspect browser console for errors
- Check Network tab for failed requests

### CORS errors
- Verify `CORS_ORIGIN` includes frontend domain
- Check backend logs for CORS issues
- Ensure backend allows OPTIONS requests
- Verify credentials are set correctly

### Build errors
- Run `npm run install:all` to install all dependencies
- Check Node.js version (20+)
- Verify all environment variables are set
- Check platform-specific build logs

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is accessible from backend server
- Ensure database SSL is configured
- Test connection manually: `psql $DATABASE_URL`

---

## 🚀 Quick Deploy Commands

### Backend
```bash
cd server
npm install
npm run build
# Deploy dist/backend/ to your platform
```

### Frontend
```bash
cd client
npm install
VITE_API_URL=https://api.yourdomain.com npm run build
# Deploy dist/frontend/ to your platform
```

---

## 📚 Additional Resources

- [Backend Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

---

**Need help?** Check the troubleshooting section or review platform-specific documentation.

