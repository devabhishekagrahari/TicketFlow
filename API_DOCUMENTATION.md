# BusLink API Documentation

## Base URL
```
Production: https://api.yourdomain.com
Development: http://localhost:5000
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User
**GET** `/api/auth/me`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

---

## Bus Endpoints

### Get All Buses
**GET** `/api/buses`

Retrieve all active buses.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Express Voyager",
    "type": "Luxury Volvo",
    "plateNumber": "NY-2024-X",
    "totalSeats": 40,
    "amenities": ["WiFi", "Charging Point", "Water Bottle"],
    "rating": "4.8",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

---

### Get Bus by ID
**GET** `/api/buses/:id`

Get details of a specific bus.

**Response (200):**
```json
{
  "id": 1,
  "name": "Express Voyager",
  "type": "Luxury Volvo",
  "plateNumber": "NY-2024-X",
  "totalSeats": 40,
  "amenities": ["WiFi", "Charging Point"],
  "rating": "4.8",
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

### Create Bus (Admin Only)
**POST** `/api/buses`

Create a new bus.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Night Express",
  "type": "AC Sleeper",
  "plateNumber": "CA-1234-A",
  "totalSeats": 35,
  "amenities": ["WiFi", "Blanket", "Pillow"]
}
```

**Response (201):**
```json
{
  "id": 4,
  "name": "Night Express",
  "type": "AC Sleeper",
  "plateNumber": "CA-1234-A",
  "totalSeats": 35,
  "amenities": ["WiFi", "Blanket", "Pillow"],
  "rating": "4.0",
  "isActive": true,
  "createdAt": "2025-01-15T14:30:00Z"
}
```

---

## Route Endpoints

### Search Routes
**GET** `/api/routes/search`

Search for routes by source, destination, and optional date.

**Query Parameters:**
- `source` (required): Source city
- `destination` (required): Destination city
- `date` (optional): Date in ISO format (YYYY-MM-DD)

**Example:**
```
GET /api/routes/search?source=New York&destination=Boston&date=2025-01-20
```

**Response (200):**
```json
[
  {
    "id": 1,
    "busId": 1,
    "source": "New York",
    "destination": "Boston",
    "departureTime": "2025-01-20T08:00:00Z",
    "arrivalTime": "2025-01-20T12:00:00Z",
    "price": "45.00",
    "availableSeats": 35,
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

---

### Get All Routes
**GET** `/api/routes`

Get all active routes.

**Response (200):**
```json
[
  {
    "id": 1,
    "busId": 1,
    "source": "New York",
    "destination": "Boston",
    "departureTime": "2025-01-20T08:00:00Z",
    "arrivalTime": "2025-01-20T12:00:00Z",
    "price": "45.00",
    "availableSeats": 35,
    "isActive": true
  }
]
```

---

### Create Route (Admin Only)
**POST** `/api/routes`

Create a new route.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "busId": 1,
  "source": "New York",
  "destination": "Philadelphia",
  "departureTime": "2025-01-21T09:00:00Z",
  "arrivalTime": "2025-01-21T11:30:00Z",
  "price": "35.00",
  "availableSeats": 40
}
```

**Response (201):**
```json
{
  "id": 10,
  "busId": 1,
  "source": "New York",
  "destination": "Philadelphia",
  "departureTime": "2025-01-21T09:00:00Z",
  "arrivalTime": "2025-01-21T11:30:00Z",
  "price": "35.00",
  "availableSeats": 40,
  "isActive": true,
  "createdAt": "2025-01-15T15:00:00Z"
}
```

---

## Booking Endpoints

### Create Booking
**POST** `/api/bookings`

Create a new booking.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "routeId": 1,
  "passengerName": "Jane Smith",
  "passengerAge": 28,
  "passengerEmail": "jane@example.com",
  "passengerPhone": "+1987654321",
  "seatNumbers": ["A1", "A2"],
  "totalAmount": "90.00",
  "agentId": null
}
```

**Response (201):**
```json
{
  "id": 1,
  "bookingNumber": "BK-1705334400-567",
  "routeId": 1,
  "userId": 2,
  "agentId": null,
  "passengerName": "Jane Smith",
  "passengerAge": 28,
  "passengerEmail": "jane@example.com",
  "passengerPhone": "+1987654321",
  "seatNumbers": ["A1", "A2"],
  "totalAmount": "90.00",
  "commissionAmount": "0.00",
  "status": "pending",
  "paymentStatus": "pending",
  "bookingDate": "2025-01-15T15:30:00Z",
  "createdAt": "2025-01-15T15:30:00Z"
}
```

---

### Get User Bookings
**GET** `/api/bookings/my`

Get all bookings for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "bookingNumber": "BK-1705334400-567",
    "routeId": 1,
    "passengerName": "Jane Smith",
    "seatNumbers": ["A1", "A2"],
    "totalAmount": "90.00",
    "status": "confirmed",
    "bookingDate": "2025-01-15T15:30:00Z"
  }
]
```

---

### Cancel Booking
**PATCH** `/api/bookings/:id/cancel`

Cancel a booking and restore seats.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Booking cancelled successfully"
}
```

---

## Agent Endpoints

### Get Agent Dashboard
**GET** `/api/agents/dashboard`

Get agent statistics and recent bookings.

**Headers:**
```
Authorization: Bearer <agent-token>
```

**Response (200):**
```json
{
  "agent": {
    "id": 1,
    "userId": 3,
    "commissionRate": "8.00",
    "totalEarnings": "1240.50",
    "totalBookings": 45,
    "isApproved": true
  },
  "bookings": [...],
  "stats": {
    "totalBookings": 45,
    "totalEarnings": "1240.50",
    "commissionRate": "8.00",
    "recentBookings": [...]
  }
}
```

---

### Create Agent Profile
**POST** `/api/agents`

Create agent profile for current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "commissionRate": "8.00"
}
```

**Response (201):**
```json
{
  "id": 2,
  "userId": 5,
  "commissionRate": "8.00",
  "totalEarnings": "0.00",
  "totalBookings": 0,
  "isApproved": false,
  "createdAt": "2025-01-15T16:00:00Z"
}
```

---

### Approve Agent (Admin Only)
**PATCH** `/api/agents/:id/approve`

Approve an agent to start earning commissions.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "id": 2,
  "userId": 5,
  "commissionRate": "8.00",
  "isApproved": true
}
```

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per IP for unauthenticated endpoints
- 1000 requests per minute per user for authenticated endpoints

---

## Data Types

### User Roles
- `customer` - Regular user who books tickets
- `agent` - Travel agent who books for customers and earns commission
- `admin` - Administrator with full access

### Bus Types
- `AC Sleeper`
- `AC Seater`
- `Non-AC Seater`
- `Luxury Volvo`

### Booking Status
- `pending` - Booking created, payment pending
- `confirmed` - Payment confirmed
- `cancelled` - Booking cancelled
- `completed` - Trip completed

### Payment Status
- `pending` - Payment not yet processed
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Webhooks (Future Feature)

Coming soon: Webhook support for real-time notifications on booking events.
