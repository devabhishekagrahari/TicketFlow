# BusLink - Bus Ticket Booking Application

A modern, full-stack bus ticket booking platform built with the MERN stack (modified: PostgreSQL instead of MongoDB). This application supports multiple user roles (Customers, Agents, Admins) with features like real-time seat selection, commission management, and comprehensive booking workflows.

## 🚀 Features

### For Customers
- 🔍 Search buses by route, date, and time
- 💺 Interactive seat selection interface
- 💳 Secure booking process
- 📧 E-ticket generation
- 📜 Booking history
- ❌ Easy cancellation

### For Agents
- 👤 Dedicated agent dashboard
- 📊 Commission tracking
- 💰 Earnings overview
- 🎟️ Book tickets for customers
- 📈 Performance analytics

### For Admins
- 🚌 Fleet management (Add/Edit/Delete buses)
- 🗺️ Route management
- 👥 Agent approval system
- 💵 Commission rate configuration
- 📊 Sales & revenue reports

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Wouter** - Lightweight routing
- **React Query** - Server state management
- **Shadcn/UI** - Component library
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+ 
- npm or yarn

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bus-booking-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/buslink_db
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=buslink_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server
NODE_ENV=development
PORT=5000
```

### 4. Database Setup
```bash
# Push schema to database
npm run db:push

# Seed initial data (optional but recommended)
tsx server/seed.ts
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:5000/api`

## 🧪 Test Accounts

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@buslink.com | admin123 |
| Agent | agent@buslink.com | agent123 |
| Customer | customer@example.com | customer123 |

## 📁 Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                 # Backend Express application
│   ├── auth.ts            # Authentication middleware
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   ├── seed.ts            # Database seeder
│   └── index.ts           # Server entry point
├── shared/                 # Shared code (types, schemas)
│   └── schema.ts          # Drizzle ORM schema
├── DEPLOYMENT_GUIDE.md    # Detailed deployment instructions
├── API_DOCUMENTATION.md   # Complete API reference
└── TECHNICAL_DOCUMENTATION.md  # Technical overview
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Buses
- `GET /api/buses` - List all buses
- `POST /api/buses` - Create bus (admin)
- `PATCH /api/buses/:id` - Update bus (admin)

### Routes
- `GET /api/routes/search` - Search routes
- `POST /api/routes` - Create route (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Agents
- `GET /api/agents/dashboard` - Agent dashboard
- `POST /api/agents` - Create agent profile
- `PATCH /api/agents/:id/approve` - Approve agent (admin)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🚀 Deployment

For production deployment with separate frontend and backend:

1. **Backend**: Deploy to any Node.js hosting (AWS, DigitalOcean, Heroku)
2. **Frontend**: Deploy to static hosting (Vercel, Netlify, S3)
3. **Database**: Use managed PostgreSQL (AWS RDS, Supabase, Neon)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Environment variable protection

## 🎨 Design System

- **Primary Color**: Deep Teal (#0891B2)
- **Accent Color**: Warm Orange (#F97316)
- **Typography**: DM Sans (body), Outfit (headings)
- **Theme**: Light mode with dark mode support

## 📊 Database Schema

### Users
- Authentication and profile information
- Role-based access (customer/agent/admin)

### Buses
- Fleet information (name, type, seats, amenities)
- Rating system

### Routes
- Source/destination mapping
- Timing and pricing
- Seat availability

### Bookings
- Passenger details
- Seat assignments
- Payment tracking
- Commission calculations

### Agents
- Commission rates
- Earnings tracking
- Approval workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push schema changes to database
npm run check        # TypeScript type checking
```

## 📖 Documentation

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Architecture and tech stack details
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions

## 🐛 Known Issues

None at the moment. Report issues on GitHub.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For support, email support@buslink.com or open an issue on GitHub.

---

**Made with ❤️ using React, Express, and PostgreSQL**
