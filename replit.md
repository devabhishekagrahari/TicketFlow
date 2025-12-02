# BusLink - Bus Ticket Booking Application

## Overview

BusLink is a full-stack bus ticket booking platform that enables customers to search and book bus tickets, agents to manage bookings and earn commissions, and administrators to manage the entire fleet and route network. The application provides role-based access control with three distinct user types (customers, agents, admins), interactive seat selection, and real-time booking management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- Built with React 19 and TypeScript for type safety and modern React features
- Vite as the build tool for fast development and optimized production builds
- Single Page Application (SPA) architecture with client-side routing

**Routing & Navigation**
- Uses Wouter for lightweight, hook-based routing instead of React Router
- Routes are defined in `client/src/App.tsx` with distinct pages for home, search results, booking, agent dashboard, and admin dashboard
- Layout component wraps all pages providing consistent navigation and role-switching functionality

**State Management**
- React Query (@tanstack/react-query) for server state management and API data caching
- Local component state using React hooks for UI interactions
- Authentication context (`client/src/lib/auth-context.tsx`) manages user session and authentication state globally

**UI Component System**
- Shadcn/UI components built on Radix UI primitives provide accessible, unstyled foundation
- Tailwind CSS v4 for utility-first styling with custom design tokens
- Custom design system with HSL-based color variables supporting light/dark themes
- Primary colors: Deep Teal (primary) and Warm Orange (accent)
- Typography: DM Sans for body text, Outfit for headings
- Framer Motion for animations and page transitions

**Design Patterns**
- Component composition with slot patterns for flexible UI construction
- Controlled components for form inputs with React Hook Form integration ready
- API client (`client/src/lib/api.ts`) integrates with backend REST endpoints
- Authentication context manages user session state globally

### Backend Architecture

**Framework & Runtime**
- Node.js with Express.js web framework
- TypeScript for type safety across the entire backend
- ESModule format for modern JavaScript module support

**API Design**
- RESTful API architecture with resource-based endpoints
- Endpoints organized by feature area (auth, buses, routes, bookings, agents)
- JWT-based stateless authentication with Bearer token scheme
- Role-based authorization middleware enforces access control per endpoint

**Database Layer**
- PostgreSQL as the relational database
- Drizzle ORM for type-safe database queries and schema management
- Neon serverless PostgreSQL driver for connection pooling
- Database schema defined in `shared/schema.ts` with Drizzle's schema builder
- Migration support through Drizzle Kit

**Data Models**
- Users table with role-based differentiation (customer, agent, admin)
- Agents table extending users with commission tracking
- Buses table for fleet management with types, amenities, and ratings
- Routes table connecting buses to source/destination with pricing
- Bookings table managing reservations with seat selection and payment status
- Enums for type safety: user roles, bus types, booking status, payment status

**Authentication & Security**
- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- Middleware-based authentication checking for protected routes
- Role-based authorization middleware to restrict admin/agent-only endpoints
- Separation of public and authenticated API endpoints

**Storage Pattern**
- Repository pattern implemented in `server/storage.ts`
- IStorage interface defines all database operations as contracts
- Drizzle ORM queries wrapped in repository methods for abstraction
- Centralized data access logic makes testing and maintenance easier

### Build & Deployment

**Development Mode**
- Vite dev server for frontend with hot module replacement
- Backend runs with tsx for TypeScript execution without compilation
- Separate scripts for client and server development

**Production Build**
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to single `dist/index.cjs` file
- Dependency bundling strategy uses allowlist for critical packages to reduce cold start times
- Static file serving from Express in production mode

**Environment Configuration**
- Environment variables for database connection, JWT secret, and server configuration
- Different configurations for development and production environments
- Database URL required, throws error if not provisioned

## External Dependencies

### Database
- **PostgreSQL**: Primary relational database (version 14+)
- **Neon Serverless**: PostgreSQL driver with WebSocket support for serverless environments
- **Drizzle ORM**: Type-safe ORM for schema definition and queries
- Connection pooling through Neon's Pool implementation

### Authentication & Security
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and verification

### Frontend Libraries
- **React Query**: Server state management, caching, and synchronization
- **Wouter**: Lightweight routing library
- **Framer Motion**: Animation library for transitions and interactions
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tabs, etc.)
- **date-fns**: Date formatting and manipulation

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **clsx & tailwind-merge**: Conditional className utilities
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration tool

### Build Plugins (Replit-specific)
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code navigation in Replit IDE
- `@replit/vite-plugin-dev-banner`: Development mode banner

### APIs & Integrations
- Full backend API implemented with Express and PostgreSQL
- API client (`client/src/lib/api.ts`) fully integrated with backend
- RESTful endpoints documented in `API_DOCUMENTATION.md`
- Database seeded with test users (admin@buslink.com, agent@buslink.com, customer@example.com)
- No third-party payment gateway integrated yet (structure supports future integration)

## Recent Changes (December 2, 2025)

### Full-Stack Backend Implementation
- ✅ Complete database schema pushed to PostgreSQL
- ✅ All API endpoints implemented in `server/routes.ts`
- ✅ JWT authentication and role-based authorization
- ✅ Business logic for bookings, seat management, and commissions
- ✅ Database seeded with sample users, buses, and routes
- ✅ API client created and integrated with frontend auth context
- ✅ Comprehensive documentation created (README, API docs, Deployment guide, Technical docs)

### Test Credentials
All accounts use format: `{role}123` as password
- **Admin**: admin@buslink.com / admin123
- **Agent**: agent@buslink.com / agent123
- **Customer**: customer@example.com / customer123

### Deployment Ready
The application is now production-ready with:
- Separate frontend/backend deployment capability
- Complete API documentation for integration
- Step-by-step deployment guide for various hosting platforms
- Security best practices implemented (JWT, bcrypt, CORS, input validation)