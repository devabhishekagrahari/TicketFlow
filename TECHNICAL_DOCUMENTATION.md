# BusLink - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [API Architecture](#api-architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Architecture](#frontend-architecture)
7. [Business Logic](#business-logic)
8. [File Structure](#file-structure)
9. [Development Workflow](#development-workflow)
10. [Production Considerations](#production-considerations)

---

## System Architecture

### High-Level Overview
BusLink is a **full-stack bus ticket booking platform** with clear separation between frontend and backend, enabling independent deployment while sharing TypeScript types for type safety.

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  React SPA + Wouter Router + React Query + Tailwind     │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS/REST API
                      │ (JSON)
┌─────────────────────▼───────────────────────────────────┐
│                   Express API Server                     │
│   Auth Middleware + Route Handlers + Business Logic     │
└─────────────────────┬───────────────────────────────────┘
                      │ Drizzle ORM
                      │ (SQL)
┌─────────────────────▼───────────────────────────────────┐
│                 PostgreSQL Database                      │
│   Users + Buses + Routes + Bookings + Agents            │
└─────────────────────────────────────────────────────────┘
```

### Separation of Concerns
- **Frontend**: Presentation logic, user interactions, routing
- **Backend**: Business logic, validation, data access
- **Database**: Persistent storage with relational integrity
- **Shared**: Type definitions and schemas shared across layers

---

## Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Wouter | 3.x | Lightweight routing |
| React Query | 5.x | Server state management |
| Shadcn/UI | Latest | Component library |
| Framer Motion | 11.x | Animations |
| Zod | 3.x | Runtime validation |

### Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20.x | JavaScript runtime |
| Express | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| PostgreSQL | 14+ | Relational database |
| Drizzle ORM | Latest | Type-safe ORM |
| JWT | 9.x | Token authentication |
| bcryptjs | 2.x | Password hashing |
| Zod | 3.x | Schema validation |

### Build & Development
| Technology | Purpose |
|-----------|---------|
| esbuild | Fast backend bundling |
| tsx | TypeScript execution |
| Drizzle Kit | Database migrations |

---

## Database Design

### Entity Relationship Diagram
```
Users (1) ──── (0..1) Agents
  │
  │ (1)
  │
  │ (*)
Bookings ──── (*) Routes ──── (1) Buses
```

### Complete Database Schema
See `shared/schema.ts` for full implementation with Drizzle ORM.

**Tables:**
- **users**: Authentication & user profiles (email, password, role)
- **buses**: Fleet management (name, type, seats, amenities)
- **routes**: Journey details (source, destination, timing, pricing)
- **bookings**: Reservation records (passenger info, seats, payment)
- **agents**: Agent profiles (commission rates, earnings tracking)

---

## API Architecture

### RESTful Design Principles
- Resource-based URLs (`/api/buses`, not `/api/get-buses`)
- HTTP verbs for actions (GET, POST, PATCH, DELETE)
- Consistent response formats
- Proper status codes (200, 201, 400, 401, 403, 404, 500)

### Middleware Stack
```typescript
app.use(express.json())           // Parse JSON bodies
app.use(cors())                   // CORS headers
app.use(authenticate)             // JWT validation (protected routes)
app.use(authorize('role'))        // Role-based access (admin/agent routes)
```

### Complete API Endpoints
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed reference.

**Endpoint Categories:**
- `/api/auth/*` - Authentication & user management
- `/api/buses/*` - Bus fleet operations
- `/api/routes/*` - Route search & management
- `/api/bookings/*` - Ticket booking & cancellation
- `/api/agents/*` - Agent dashboard & operations

---

## Authentication & Authorization

### JWT Token Flow
1. User submits credentials
2. Server validates against database
3. Server generates JWT with payload (userId, email, role)
4. Client stores token in localStorage
5. Client sends token in Authorization header
6. Server validates token on each request

### Password Security
- bcrypt hashing with 10 salt rounds
- Password never stored in plain text
- Comparison done server-side only

### Role-Based Access Control (RBAC)
- **Public routes**: Bus/route search (no auth)
- **Authenticated routes**: Bookings (any logged-in user)
- **Agent routes**: Agent dashboard (agent or admin)
- **Admin routes**: Fleet/agent management (admin only)

---

## Frontend Architecture

### Component Structure
```
components/
├── ui/                    # Shadcn/UI base components
├── Layout.tsx             # Main layout with navigation
├── BusCard.tsx            # Bus result card
├── SeatSelector.tsx       # Interactive seat selection
└── BookingCard.tsx        # Booking display

pages/
├── HomePage.tsx           # Search form
├── SearchResults.tsx      # Route listing
├── BookingPage.tsx        # Seat selection & checkout
├── CustomerDashboard.tsx  # Customer bookings
├── AgentDashboard.tsx     # Agent stats & bookings
└── AdminDashboard.tsx     # Admin controls
```

### State Management
- **Server State**: React Query for API data caching
- **Global Auth**: Context API for user session
- **Local UI State**: useState for component interactions

### API Integration
Custom API client (`client/src/lib/api.ts`) with:
- Automatic token injection
- Type-safe request/response handling
- Error handling and logging

---

## Business Logic

### Booking Flow
1. User searches routes
2. System queries available routes
3. User selects route and seats
4. Backend validates availability
5. Creates booking record
6. Updates route seat count
7. Calculates commission (if agent)
8. Returns confirmation

### Commission Calculation
```typescript
if (user.role === 'agent' && agent.isApproved) {
  commission = totalAmount * (commissionRate / 100)
  agent.totalEarnings += commission
  agent.totalBookings += 1
}
```

### Seat Management
- Decremented on booking creation
- Restored on booking cancellation
- Validated before each booking

---

## File Structure

```
project-root/
├── client/                      # Frontend React app
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── pages/               # Page components
│   │   ├── lib/                 # Utilities & API client
│   │   ├── App.tsx              # Router config
│   │   └── main.tsx             # Entry point
│   └── index.html
├── server/                      # Backend Express app
│   ├── auth.ts                 # JWT & middleware
│   ├── db.ts                   # Database connection
│   ├── storage.ts              # Data access layer
│   ├── routes.ts               # API endpoints
│   ├── seed.ts                 # Database seeder
│   └── index.ts                # Server entry
├── shared/                      # Shared types
│   └── schema.ts               # Drizzle ORM schema
├── README.md
├── DEPLOYMENT_GUIDE.md
├── API_DOCUMENTATION.md
└── TECHNICAL_DOCUMENTATION.md
```

---

## Development Workflow

### Local Development
```bash
# Install & setup
npm install
cp .env.example .env

# Database setup
npm run db:push
tsx server/seed.ts

# Start dev server
npm run dev
```

### Database Management
```bash
# Push schema changes
npm run db:push

# Force push if needed
npm run db:push --force
```

---

## Production Considerations

### Security
- Strong JWT secret (32+ characters)
- HTTPS in production
- CORS configured for allowed origins
- Input validation with Zod
- Parameterized SQL queries
- Environment variables for secrets

### Performance
- Database indexes on frequent queries
- Connection pooling with Neon
- React Query caching
- Code splitting (automatic with Vite)

### Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Separate frontend/backend deployment
- Database setup (PostgreSQL)
- Environment configuration
- SSL certificates
- Process management (PM2)

---

## Test Accounts

**Admin:**
- Email: admin@buslink.com
- Password: admin123

**Agent:**
- Email: agent@buslink.com
- Password: agent123

**Customer:**
- Email: customer@example.com
- Password: customer123

---

For complete API reference, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).  
For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
