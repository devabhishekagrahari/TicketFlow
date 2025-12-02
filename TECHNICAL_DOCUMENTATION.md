# Bus Ticket Booking Application - Technical Documentation

## 1. Project Overview
This is a high-fidelity, industry-ready frontend prototype for a Bus Ticket Booking Application. It is designed to demonstrate the core workflows for three distinct user roles: **Customers**, **Agents**, and **Admins**.

The application focuses on a modern, clean aesthetic with a "Teal & Warm Orange" color palette, providing a premium user experience similar to top-tier travel platforms.

## 2. Tech Stack

### Core Framework
- **React 19**: The latest version of the library for building user interfaces.
- **TypeScript**: Used for type safety and better developer experience.
- **Vite**: Next-generation frontend tooling for fast development and building.

### Styling & Design
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **Custom Design System**:
  - **Fonts**: `DM Sans` (Body) and `Outfit` (Headings) via Google Fonts.
  - **Colors**: Custom HSL variables defined in `index.css` for theming support (Light/Dark mode ready).
  - **Glassmorphism**: Custom utility classes for translucent UI elements.
- **Lucide React**: Consistent and clean icon set.
- **Framer Motion**: For smooth page transitions and micro-interactions.

### Routing & State
- **Wouter**: A minimalist, hook-based router for modern React apps (lighter alternative to React Router).
- **React Query (@tanstack/react-query)**: For managing server state (mocked in this prototype).
- **React Hook Form**: For efficient form management (ready for integration).

### UI Components
- **Shadcn/UI (Radix Primitives)**: Accessible, unstyled components used as a foundation for:
  - Dialogs / Modals
  - Dropdowns
  - Cards
  - Inputs & Selects
  - Tabs
  - Toasts

## 3. Architecture & Implementation Details

### Frontend-Only Architecture
This project is a "Mockup Mode" prototype. It runs entirely in the browser without a backend server.
- **Mock Data**: All data (Buses, Routes, Seats) is generated in `client/src/lib/mockData.ts`.
- **State Persistence**: Currently uses in-memory state (refreshes on reload).

### Key Modules

#### 1. Layout & Navigation
- **`client/src/components/layout.tsx`**: Wraps the application. Includes a responsive Navbar with a **Role Switcher** (Customer/Agent/Admin) to easily demo different views without logging in.

#### 2. Customer Booking Flow
- **Home (`pages/home.tsx`)**: Features a cinematic Hero section with a generated illustration and a search widget.
- **Search Results (`pages/search-results.tsx`)**: Displays available buses. Uses `BusSearch` component for filtering.
- **Seat Selection (`components/seat-map.tsx`)**: A visual representation of the bus layout. Handles seat selection logic (max 5 seats, booked/ladies seat logic).
- **Booking Process (`pages/booking.tsx`)**: A multi-step wizard (Seats -> Details -> Payment).

#### 3. Dashboards
- **Agent Dashboard (`pages/agent-dashboard.tsx`)**:
  - Displays earnings, commission rates, and recent bookings.
  - Uses `Recharts` (ready) or simple card layouts for metrics.
- **Admin Dashboard (`pages/admin-dashboard.tsx`)**:
  - Tabbed interface to manage Buses, Routes, and Agents.
  - Table views for data management.

## 4. Folder Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable Shadcn UI components
│   │   ├── bus-search.tsx # Search widget
│   │   ├── seat-map.tsx   # Interactive seat selection
│   │   └── layout.tsx     # Main app wrapper
│   ├── lib/
│   │   ├── mockData.ts    # Static data generators
│   │   └── utils.ts       # Helper functions (cn, etc.)
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── search-results.tsx
│   │   ├── booking.tsx
│   │   ├── agent-dashboard.tsx
│   │   └── admin-dashboard.tsx
│   ├── App.tsx            # Routing configuration
│   └── index.css          # Global styles & Tailwind config
└── index.html             # Entry point
```

## 5. Future Integration Steps (For Full Stack)

To graduate this app to a full-stack production application:
1.  **Backend Setup**: Set up an Express.js server in the `server/` directory.
2.  **Database**: Connect to PostgreSQL (using Drizzle ORM).
3.  **API Routes**: Replace `mockData.ts` with actual API calls (`fetch` or `axios`) in React Query hooks.
4.  **Authentication**: Implement Passport.js or JWT for secure Customer/Agent/Admin login.
5.  **Payments**: Integrate Stripe or Razorpay in the payment step of `booking.tsx`.
