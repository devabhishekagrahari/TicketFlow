# Bus Ticket Booking App - Deployment Guide

## Overview
This guide explains how to deploy the frontend and backend **separately** for production environments.

## Architecture
- **Frontend**: React + Vite (Static SPA)
- **Backend**: Node.js + Express + PostgreSQL
- **Communication**: REST APIs over HTTPS

---

## Backend Deployment

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 14+ database
- Server with public IP (VPS/Cloud)

### Environment Variables
Create a `.env` file in your backend server:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
PGHOST=your-db-host.com
PGPORT=5432
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGDATABASE=buslink_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NODE_ENV=production

# Server
PORT=5000
```

### Deployment Steps

#### 1. Clone Backend Code
```bash
git clone <your-repo-url>
cd bus-booking-backend
```

#### 2. Install Dependencies
```bash
npm install --production
```

#### 3. Build the Application
```bash
npm run build
```

#### 4. Push Database Schema
```bash
npm run db:push
```

#### 5. Seed Initial Data (Optional)
```bash
tsx server/seed.ts
```

#### 6. Start Production Server
```bash
npm start
```

### Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start app with PM2
pm2 start dist/index.cjs --name buslink-api

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

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

### SSL Certificate (Using Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Frontend Deployment

### Environment Variables
Create `.env.production` in your frontend directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=BusLink
```

### Deployment Steps

#### 1. Update API Base URL
Edit `client/src/lib/api.ts` to use environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

#### 2. Build for Production
```bash
cd client
npm install
npm run build
```

This creates an optimized `dist/` folder.

#### 3. Deploy to Static Hosting

##### Option A: Vercel
```bash
npm install -g vercel
vercel --prod
```

##### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

##### Option C: AWS S3 + CloudFront
```bash
# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

##### Option D: Nginx (Self-Hosted)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/buslink/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

Copy built files:
```bash
sudo mkdir -p /var/www/buslink
sudo cp -r dist/* /var/www/buslink/
```

---

## Database Setup (PostgreSQL)

### Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE buslink_db;
CREATE USER buslink_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE buslink_db TO buslink_user;
\q
```

### Managed Database Services
- **AWS RDS**: Use PostgreSQL engine
- **Digital Ocean**: Managed Databases
- **Supabase**: Provides PostgreSQL with built-in APIs
- **Neon**: Serverless PostgreSQL

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `POST /api/buses` - Create bus (admin only)
- `PATCH /api/buses/:id` - Update bus (admin only)
- `DELETE /api/buses/:id` - Delete bus (admin only)

### Routes
- `GET /api/routes/search?source=X&destination=Y&date=Z` - Search routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Create route (admin only)
- `PATCH /api/routes/:id` - Update route (admin only)
- `DELETE /api/routes/:id` - Delete route (admin only)

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings/my` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (requires auth)

### Agents
- `GET /api/agents` - Get all agents (admin only)
- `GET /api/agents/dashboard` - Get agent dashboard (agent/admin only)
- `POST /api/agents` - Create agent profile (requires auth)
- `PATCH /api/agents/:id/approve` - Approve agent (admin only)
- `PATCH /api/agents/:id/commission` - Update commission (admin only)

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set up CORS to allow only your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL connections in production
- [ ] Implement rate limiting on API endpoints
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Keep dependencies updated

---

## CORS Configuration (Backend)

Update `server/index.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Monitoring & Logs

### Backend Logs (PM2)
```bash
pm2 logs buslink-api
pm2 monit
```

### Error Tracking
Consider integrating:
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (APM)

---

## Scaling Considerations

### Backend Horizontal Scaling
- Use load balancer (e.g., Nginx, AWS ELB)
- Ensure session state is stateless (JWT)
- Use Redis for caching if needed

### Database Optimization
- Create indexes on frequently queried columns
- Use connection pooling
- Consider read replicas for heavy traffic

---

## Test Accounts

After seeding the database, use these credentials:

**Admin:**
- Email: `admin@buslink.com`
- Password: `admin123`

**Agent:**
- Email: `agent@buslink.com`
- Password: `agent123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

---

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify JWT_SECRET is set
- Check port 5000 is not in use

### Frontend can't reach API
- Check VITE_API_URL is correct
- Verify CORS is configured
- Check API server is running
- Inspect browser console for errors

### Database connection errors
- Verify credentials
- Check network firewall rules
- Ensure PostgreSQL allows remote connections
- Test connection string manually

---

## Support & Updates

For production issues:
1. Check server logs: `pm2 logs buslink-api`
2. Verify environment variables
3. Test API endpoints with Postman
4. Check database connectivity

---

## License
MIT License - See LICENSE file for details
