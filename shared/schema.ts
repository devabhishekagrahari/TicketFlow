import { pgTable, text, serial, integer, timestamp, boolean, decimal, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["customer", "agent", "admin"]);
export const busTypeEnum = pgEnum("bus_type", ["AC Sleeper", "AC Seater", "Non-AC Seater", "Luxury Volvo"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").default("customer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Agents Table (extends users with commission info)
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("8.00").notNull(),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalBookings: integer("total_bookings").default(0).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Buses Table
export const buses = pgTable("buses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: busTypeEnum("type").notNull(),
  plateNumber: varchar("plate_number", { length: 50 }).notNull().unique(),
  totalSeats: integer("total_seats").notNull(),
  amenities: text("amenities").array().default([]).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Routes Table
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  busId: integer("bus_id").references(() => buses.id).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSeats: integer("available_seats").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingNumber: varchar("booking_number", { length: 50 }).notNull().unique(),
  routeId: integer("route_id").references(() => routes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  agentId: integer("agent_id").references(() => agents.id),
  passengerName: varchar("passenger_name", { length: 255 }).notNull(),
  passengerAge: integer("passenger_age").notNull(),
  passengerEmail: varchar("passenger_email", { length: 255 }).notNull(),
  passengerPhone: varchar("passenger_phone", { length: 20 }).notNull(),
  seatNumbers: text("seat_numbers").array().notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).default("0.00"),
  status: bookingStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  agent: one(agents, {
    fields: [users.id],
    references: [agents.userId],
  }),
  bookings: many(bookings),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const busesRelations = relations(buses, ({ many }) => ({
  routes: many(routes),
}));

export const routesRelations = relations(routes, ({ one, many }) => ({
  bus: one(buses, {
    fields: [routes.busId],
    references: [buses.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  route: one(routes, {
    fields: [bookings.routeId],
    references: [routes.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [bookings.agentId],
    references: [agents.id],
  }),
}));

// Zod Schemas for Validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["customer", "agent", "admin"]).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true, isActive: true });

export const insertAgentSchema = createInsertSchema(agents, {
  commissionRate: z.string().regex(/^\d+\.\d{2}$/),
}).omit({ id: true, createdAt: true, totalEarnings: true, totalBookings: true, isApproved: true });

export const insertBusSchema = createInsertSchema(buses, {
  name: z.string().min(2),
  plateNumber: z.string().min(5),
  totalSeats: z.number().min(10).max(60),
  amenities: z.array(z.string()).optional(),
}).omit({ id: true, createdAt: true, isActive: true, rating: true });

export const insertRouteSchema = createInsertSchema(routes, {
  price: z.string().regex(/^\d+(\.\d{2})?$/),
  availableSeats: z.number().min(0),
}).omit({ id: true, createdAt: true, isActive: true });

export const insertBookingSchema = createInsertSchema(bookings, {
  passengerName: z.string().min(2),
  passengerAge: z.number().min(1).max(120),
  passengerEmail: z.string().email(),
  passengerPhone: z.string().min(10),
  seatNumbers: z.array(z.string()).min(1).max(5),
  totalAmount: z.string().regex(/^\d+(\.\d{2})?$/),
}).omit({ id: true, createdAt: true, bookingDate: true, status: true, paymentStatus: true, commissionAmount: true, bookingNumber: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type Bus = typeof buses.$inferSelect;
export type InsertBus = z.infer<typeof insertBusSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
