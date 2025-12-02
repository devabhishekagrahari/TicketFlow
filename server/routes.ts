import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate, 
  authorize, 
  hashPassword, 
  verifyPassword, 
  generateToken,
  type AuthRequest 
} from "./auth";
import {
  insertUserSchema,
  insertAgentSchema,
  insertBusSchema,
  insertRouteSchema,
  insertBookingSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ==================== BUS ROUTES ====================
  
  // Get all buses
  app.get("/api/buses", async (req: Request, res: Response) => {
    try {
      const buses = await storage.getAllBuses();
      res.json(buses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buses" });
    }
  });

  // Get bus by ID
  app.get("/api/buses/:id", async (req: Request, res: Response) => {
    try {
      const bus = await storage.getBusById(parseInt(req.params.id));
      if (!bus) {
        return res.status(404).json({ error: "Bus not found" });
      }
      res.json(bus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus" });
    }
  });

  // Create bus (admin only)
  app.post("/api/buses", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertBusSchema.parse(req.body);
      const bus = await storage.createBus(validatedData);
      res.status(201).json(bus);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create bus" });
    }
  });

  // Update bus (admin only)
  app.patch("/api/buses/:id", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const bus = await storage.updateBus(parseInt(req.params.id), req.body);
      if (!bus) {
        return res.status(404).json({ error: "Bus not found" });
      }
      res.json(bus);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bus" });
    }
  });

  // Delete bus (admin only)
  app.delete("/api/buses/:id", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const success = await storage.deleteBus(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Bus not found" });
      }
      res.json({ message: "Bus deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bus" });
    }
  });

  // ==================== ROUTE ROUTES ====================
  
  // Search routes
  app.get("/api/routes/search", async (req: Request, res: Response) => {
    try {
      const { source, destination, date } = req.query;
      
      if (!source || !destination) {
        return res.status(400).json({ error: "Source and destination required" });
      }

      const searchDate = date ? new Date(date as string) : undefined;
      const routes = await storage.searchRoutes(
        source as string, 
        destination as string, 
        searchDate
      );
      
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to search routes" });
    }
  });

  // Get all routes
  app.get("/api/routes", async (req: Request, res: Response) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  // Get route by ID
  app.get("/api/routes/:id", async (req: Request, res: Response) => {
    try {
      const route = await storage.getRouteById(parseInt(req.params.id));
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch route" });
    }
  });

  // Create route (admin only)
  app.post("/api/routes", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.status(201).json(route);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create route" });
    }
  });

  // Update route (admin only)
  app.patch("/api/routes/:id", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const route = await storage.updateRoute(parseInt(req.params.id), req.body);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to update route" });
    }
  });

  // Delete route (admin only)
  app.delete("/api/routes/:id", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const success = await storage.deleteRoute(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.json({ message: "Route deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete route" });
    }
  });

  // ==================== BOOKING ROUTES ====================
  
  // Create booking
  app.post("/api/bookings", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check route availability
      const route = await storage.getRouteById(validatedData.routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      if (route.availableSeats < validatedData.seatNumbers.length) {
        return res.status(400).json({ error: "Not enough seats available" });
      }

      // Calculate commission if booked by agent
      let commissionAmount = "0.00";
      let agentId = validatedData.agentId || null;

      if (req.user!.role === "agent") {
        const agent = await storage.getAgentByUserId(req.user!.userId);
        if (agent && agent.isApproved) {
          agentId = agent.id;
          const total = parseFloat(validatedData.totalAmount);
          const commission = (total * parseFloat(agent.commissionRate)) / 100;
          commissionAmount = commission.toFixed(2);
        }
      }

      // Create booking
      const booking = await storage.createBooking({
        ...validatedData,
        userId: req.user!.userId,
        agentId: agentId,
      });

      // Update booking with commission amount if applicable
      let finalBooking = booking;
      if (commissionAmount !== "0.00") {
        const updated = await storage.updateBooking(booking.id, {
          commissionAmount: commissionAmount as any,
        });
        if (updated) finalBooking = updated;
      }

      // Update route available seats
      await storage.updateRoute(route.id, {
        availableSeats: route.availableSeats - validatedData.seatNumbers.length,
      });

      // Update agent stats if applicable
      if (agentId) {
        const agent = await storage.getAgentById(agentId);
        if (agent) {
          await storage.updateAgent(agentId, {
            totalBookings: agent.totalBookings + 1,
            totalEarnings: (parseFloat(agent.totalEarnings) + parseFloat(commissionAmount)).toFixed(2),
          });
        }
      }

      res.status(201).json(finalBooking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Get user bookings
  app.get("/api/bookings/my", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const bookings = await storage.getUserBookings(req.user!.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const booking = await storage.getBookingById(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Check authorization
      if (booking.userId !== req.user!.userId && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  // Cancel booking
  app.patch("/api/bookings/:id/cancel", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const booking = await storage.getBookingById(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Check authorization
      if (booking.userId !== req.user!.userId && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (booking.status === "cancelled") {
        return res.status(400).json({ error: "Booking already cancelled" });
      }

      const success = await storage.cancelBooking(parseInt(req.params.id));
      
      // Restore seats to route
      const route = await storage.getRouteById(booking.routeId);
      if (route) {
        await storage.updateRoute(route.id, {
          availableSeats: route.availableSeats + booking.seatNumbers.length,
        });
      }

      res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // ==================== AGENT ROUTES ====================
  
  // Get all agents (admin only)
  app.get("/api/agents", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Get agent dashboard stats
  app.get("/api/agents/dashboard", authenticate, authorize("agent", "admin"), async (req: AuthRequest, res: Response) => {
    try {
      const agent = await storage.getAgentByUserId(req.user!.userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent profile not found" });
      }

      const bookings = await storage.getAgentBookings(agent.id);

      res.json({
        agent,
        bookings,
        stats: {
          totalBookings: agent.totalBookings,
          totalEarnings: agent.totalEarnings,
          commissionRate: agent.commissionRate,
          recentBookings: bookings.slice(0, 10),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent dashboard" });
    }
  });

  // Create agent profile
  app.post("/api/agents", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = insertAgentSchema.parse({
        ...req.body,
        userId: req.user!.userId,
      });

      const existingAgent = await storage.getAgentByUserId(req.user!.userId);
      if (existingAgent) {
        return res.status(400).json({ error: "Agent profile already exists" });
      }

      const agent = await storage.createAgent(validatedData);
      
      // Update user role to agent
      await storage.updateUser(req.user!.userId, { role: "agent" });

      res.status(201).json(agent);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create agent profile" });
    }
  });

  // Approve agent (admin only)
  app.patch("/api/agents/:id/approve", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const agent = await storage.updateAgent(parseInt(req.params.id), { isApproved: true });
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve agent" });
    }
  });

  // Update agent commission (admin only)
  app.patch("/api/agents/:id/commission", authenticate, authorize("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { commissionRate } = req.body;
      if (!commissionRate || isNaN(parseFloat(commissionRate))) {
        return res.status(400).json({ error: "Valid commission rate required" });
      }

      const agent = await storage.updateAgent(parseInt(req.params.id), { 
        commissionRate: parseFloat(commissionRate).toFixed(2) 
      });
      
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update commission" });
    }
  });

  return httpServer;
}
