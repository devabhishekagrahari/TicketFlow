# 🚀 BusLink Deployment Checklist

This checklist will guide you through deploying your BusLink application step by step.

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 20.x or higher installed
- [ ] PostgreSQL database provisioned (local or cloud)
- [ ] Database credentials ready
- [ ] Domain name ready (if using custom domain)

### 2. Database Setup
- [ ] PostgreSQL database created
- [ ] Database user created with proper permissions
- [ ] Connection string ready (`DATABASE_URL`)
- [ ] Database accessible from deployment server

### 3. Environment Variables
- [ ] `.env` file created (use `.env.example` as template)
- [ ] `DATABASE_URL` configured correctly
- [ ] `JWT_SECRET` set to a strong random value (min 32 chars)
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` configured (default: 5000)
- [ ] `CORS_ORIGIN` configured (if deploying frontend separately)

### 4. Code Preparation
- [ ] All code committed to git
- [ ] Dependencies installed (`npm install`)
- [ ] TypeScript compilation successful (`npm run check`)
- [ ] No critical bugs or errors

---

## 🏗️ Deployment Options

### Option A: Monolith Deployment (Recommended for Start)
**Single server serving both frontend and backend**

**Pros:**
- Simpler setup
- Single server to manage
- No CORS issues
- Lower cost

**Cons:**
- Less scalable
- Frontend and backend coupled

**Steps:**
1. [ ] Build the application: `npm run build`
2. [ ] Push database schema: `npm run db:push`
3. [ ] Seed initial data (optional): `tsx server/seed.ts`
4. [ ] Start production server: `npm start`
5. [ ] Or use PM2: `pm2 start dist/index.cjs --name buslink`

### Option B: Separate Frontend/Backend Deployment
**Frontend on static hosting, backend on Node.js server**

**Pros:**
- Better scalability
- Can use CDN for frontend
- Independent scaling

**Cons:**
- More complex setup
- Need to configure CORS
- Two deployments to manage

**Backend Steps:**
1. [ ] Set `CORS_ORIGIN` in `.env` to your frontend domain
2. [ ] Build backend: `npm run build`
3. [ ] Push database schema: `npm run db:push`
4. [ ] Deploy `dist/` folder to Node.js server
5. [ ] Start server: `npm start` or use PM2

**Frontend Steps:**
1. [ ] Set `VITE_API_URL` in `.env.production` to backend URL
2. [ ] Build frontend: `cd client && npm run build`
3. [ ] Deploy `dist/public/` to static hosting (Vercel, Netlify, S3, etc.)

---

## 🌐 Platform-Specific Guides

### Deploying to Railway
1. [ ] Create Railway account
2. [ ] Create new project
3. [ ] Connect GitHub repository
4. [ ] Add PostgreSQL service
5. [ ] Set environment variables:
   - `DATABASE_URL` (from PostgreSQL service)
   - `JWT_SECRET` (generate strong random string)
   - `NODE_ENV=production`
   - `PORT` (Railway sets this automatically)
6. [ ] Deploy (Railway auto-builds and deploys)
7. [ ] Run database migrations: `npm run db:push` (via Railway CLI or console)

### Deploying to Render
1. [ ] Create Render account
2. [ ] Create new Web Service
3. [ ] Connect GitHub repository
4. [ ] Build command: `npm run build`
5. [ ] Start command: `npm start`
6. [ ] Add PostgreSQL database service
7. [ ] Set environment variables (same as Railway)
8. [ ] Deploy

### Deploying to DigitalOcean App Platform
1. [ ] Create DigitalOcean account
2. [ ] Create new App
3. [ ] Connect GitHub repository
4. [ ] Add PostgreSQL database component
5. [ ] Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
6. [ ] Set environment variables
7. [ ] Deploy

### Deploying to VPS (Ubuntu/Debian)
1. [ ] Set up Ubuntu server (20.04+)
2. [ ] Install Node.js 20.x:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. [ ] Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```
4. [ ] Clone repository:
   ```bash
   git clone <your-repo-url>
   cd bus-booking-app
   ```
5. [ ] Install dependencies:
   ```bash
   npm install --production
   ```
6. [ ] Create `.env` file with production values
7. [ ] Build application:
   ```bash
   npm run build
   ```
8. [ ] Push database schema:
   ```bash
   npm run db:push
   ```
9. [ ] Install PM2:
   ```bash
   npm install -g pm2
   ```
10. [ ] Start application:
    ```bash
    pm2 start dist/index.cjs --name buslink
    pm2 startup
    pm2 save
    ```
11. [ ] Set up Nginx reverse proxy (see Nginx config below)
12. [ ] Set up SSL with Let's Encrypt

### Nginx Configuration (for VPS)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 Security Checklist

- [ ] `JWT_SECRET` is a strong random value (32+ characters)
- [ ] Database password is strong and unique
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] HTTPS/SSL enabled (Let's Encrypt or cloud provider SSL)
- [ ] CORS configured correctly (if separate frontend/backend)
- [ ] Database allows connections only from your server IP
- [ ] Firewall configured (only necessary ports open)
- [ ] Regular backups scheduled
- [ ] Monitoring/logging set up

---

## 🧪 Post-Deployment Testing

- [ ] Application loads in browser
- [ ] API endpoints respond correctly
- [ ] User registration works
- [ ] User login works
- [ ] Bus search works
- [ ] Booking creation works
- [ ] Admin dashboard accessible (if admin user exists)
- [ ] Agent dashboard accessible (if agent user exists)
- [ ] Database queries execute correctly
- [ ] Static files (images, CSS, JS) load correctly
- [ ] No console errors in browser
- [ ] No server errors in logs

---

## 📊 Monitoring & Maintenance

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure log rotation
- [ ] Set up database backups (daily recommended)
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Set up alerts for critical errors
- [ ] Regular dependency updates (`npm audit`)

---

## 🐛 Troubleshooting

### Application won't start
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running and accessible
- Check `JWT_SECRET` is set
- Verify port is not in use
- Check logs: `pm2 logs buslink` or check platform logs

### Database connection errors
- Verify database credentials
- Check network firewall rules
- Ensure PostgreSQL allows remote connections
- Test connection string manually: `psql $DATABASE_URL`

### Frontend can't reach API
- Check `VITE_API_URL` is correct (if separate deployment)
- Verify CORS is configured correctly
- Check API server is running
- Inspect browser console for errors
- Check network tab for failed requests

### Static files not loading
- Verify build completed successfully
- Check `dist/public` folder exists
- Verify file permissions
- Check Nginx/static hosting configuration

---

## 📝 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run check            # Type check

# Production
npm run build            # Build for production
npm run db:push          # Push database schema
npm start                # Start production server

# Database
tsx server/seed.ts       # Seed initial data

# PM2 (if using)
pm2 start dist/index.cjs --name buslink
pm2 logs buslink
pm2 restart buslink
pm2 stop buslink
pm2 delete buslink
```

---

## 🎯 Next Steps After Deployment

1. [ ] Test all user flows (register, login, search, book)
2. [ ] Create admin account and test admin features
3. [ ] Create agent account and test agent features
4. [ ] Set up monitoring and alerts
5. [ ] Schedule regular backups
6. [ ] Document your deployment process
7. [ ] Set up CI/CD pipeline (optional)
8. [ ] Configure custom domain (if needed)
9. [ ] Set up SSL certificate
10. [ ] Test performance and optimize if needed

---

## 📞 Support

If you encounter issues:
1. Check server logs
2. Check browser console
3. Verify environment variables
4. Test database connectivity
5. Review deployment platform logs
6. Check this checklist again

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
For technical details, see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)

