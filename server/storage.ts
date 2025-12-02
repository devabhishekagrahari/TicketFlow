import { 
  users, agents, buses, routes, bookings,
  type User, type InsertUser,
  type Agent, type InsertAgent,
  type Bus, type InsertBus,
  type Route, type InsertRoute,
  type Booking, type InsertBooking
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Agents
  getAgentById(id: number): Promise<Agent | undefined>;
  getAgentByUserId(userId: number): Promise<Agent | undefined>;
  getAllAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, updates: Partial<Agent>): Promise<Agent | undefined>;
  
  // Buses
  getBusById(id: number): Promise<Bus | undefined>;
  getAllBuses(activeOnly?: boolean): Promise<Bus[]>;
  createBus(bus: InsertBus): Promise<Bus>;
  updateBus(id: number, updates: Partial<Bus>): Promise<Bus | undefined>;
  deleteBus(id: number): Promise<boolean>;
  
  // Routes
  getRouteById(id: number): Promise<Route | undefined>;
  searchRoutes(source: string, destination: string, date?: Date): Promise<Route[]>;
  getAllRoutes(): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: number, updates: Partial<Route>): Promise<Route | undefined>;
  deleteRoute(id: number): Promise<boolean>;
  
  // Bookings
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingByNumber(bookingNumber: string): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getAgentBookings(agentId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;
  cancelBooking(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Agents
  async getAgentById(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentByUserId(userId: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.userId, userId));
    return agent;
  }

  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents).orderBy(desc(agents.totalEarnings));
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: number, updates: Partial<Agent>): Promise<Agent | undefined> {
    const [agent] = await db
      .update(agents)
      .set(updates)
      .where(eq(agents.id, id))
      .returning();
    return agent;
  }

  // Buses
  async getBusById(id: number): Promise<Bus | undefined> {
    const [bus] = await db.select().from(buses).where(eq(buses.id, id));
    return bus;
  }

  async getAllBuses(activeOnly = true): Promise<Bus[]> {
    if (activeOnly) {
      return await db.select().from(buses).where(eq(buses.isActive, true));
    }
    return await db.select().from(buses);
  }

  async createBus(insertBus: InsertBus): Promise<Bus> {
    const [bus] = await db.insert(buses).values(insertBus).returning();
    return bus;
  }

  async updateBus(id: number, updates: Partial<Bus>): Promise<Bus | undefined> {
    const [bus] = await db
      .update(buses)
      .set(updates)
      .where(eq(buses.id, id))
      .returning();
    return bus;
  }

  async deleteBus(id: number): Promise<boolean> {
    const [bus] = await db
      .update(buses)
      .set({ isActive: false })
      .where(eq(buses.id, id))
      .returning();
    return !!bus;
  }

  // Routes
  async getRouteById(id: number): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route;
  }

  async searchRoutes(source: string, destination: string, date?: Date): Promise<Route[]> {
    let query = db.select().from(routes).where(
      and(
        eq(routes.source, source),
        eq(routes.destination, destination),
        eq(routes.isActive, true)
      )
    );

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query = db.select().from(routes).where(
        and(
          eq(routes.source, source),
          eq(routes.destination, destination),
          eq(routes.isActive, true),
          gte(routes.departureTime, startOfDay),
          sql`${routes.departureTime} <= ${endOfDay}`
        )
      );
    }

    return await query;
  }

  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const [route] = await db.insert(routes).values(insertRoute).returning();
    return route;
  }

  async updateRoute(id: number, updates: Partial<Route>): Promise<Route | undefined> {
    const [route] = await db
      .update(routes)
      .set(updates)
      .where(eq(routes.id, id))
      .returning();
    return route;
  }

  async deleteRoute(id: number): Promise<boolean> {
    const [route] = await db
      .update(routes)
      .set({ isActive: false })
      .where(eq(routes.id, id))
      .returning();
    return !!route;
  }

  // Bookings
  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingByNumber(bookingNumber: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingNumber, bookingNumber));
    return booking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.bookingDate));
  }

  async getAgentBookings(agentId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.agentId, agentId))
      .orderBy(desc(bookings.bookingDate));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingNumber = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [booking] = await db
      .insert(bookings)
      .values({ ...insertBooking, bookingNumber })
      .returning();
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async cancelBooking(id: number): Promise<boolean> {
    const [booking] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();
    return !!booking;
  }
}

export const storage = new DatabaseStorage();
