# BusLink Backend

Express + TypeScript + PostgreSQL backend API for BusLink bus ticket booking platform.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Runs on `http://localhost:5000`

### Build for Production
```bash
npm run build
```

Output: `dist/backend/`

### Environment Variables

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📦 Deployment

### Railway
1. Connect GitHub repository
2. Set root directory: `server/`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add PostgreSQL service
6. Set environment variables

### Render
1. Create Web Service
2. Set root directory: `server`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

### VPS
```bash
npm install --production
npm run build
pm2 start dist/backend/index.cjs --name buslink-api
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema

## 📁 Structure

```
server/
├── index.ts        # Server entry point
├── routes.ts       # API routes
├── auth.ts         # Authentication middleware
├── db.ts           # Database connection
├── storage.ts      # Data access layer
└── static.ts       # Static file serving (monolith only)
```

## 🔒 Security

- Set strong `JWT_SECRET` (32+ characters)
- Configure `CORS_ORIGIN` for frontend domain
- Use HTTPS in production
- Enable database SSL connections
- Never commit `.env` file

## 🌐 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/buses` - List buses
- `GET /api/routes/search` - Search routes
- `POST /api/bookings` - Create booking
- See `API_DOCUMENTATION.md` for complete reference

## 📊 Database

Uses PostgreSQL with Drizzle ORM.

Run migrations:
```bash
npm run db:push
```

Seed data:
```bash
tsx seed.ts
```

