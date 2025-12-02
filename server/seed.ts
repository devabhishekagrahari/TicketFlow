import { db } from "./db";
import { users, buses, routes, agents } from "@shared/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create admin user
    const hashedPassword = await hashPassword("admin123");
    const [admin] = await db.insert(users).values({
      email: "admin@buslink.com",
      password: hashedPassword,
      fullName: "Admin User",
      phone: "+1234567890",
      role: "admin",
    }).returning();
    console.log("✅ Admin user created");

    // Create sample customer
    const customerPassword = await hashPassword("customer123");
    const [customer] = await db.insert(users).values({
      email: "customer@example.com",
      password: customerPassword,
      fullName: "John Customer",
      phone: "+1987654321",
      role: "customer",
    }).returning();
    console.log("✅ Sample customer created");

    // Create sample agent
    const agentPassword = await hashPassword("agent123");
    const [agentUser] = await db.insert(users).values({
      email: "agent@buslink.com",
      password: agentPassword,
      fullName: "Travel Agent Pro",
      phone: "+1122334455",
      role: "agent",
    }).returning();

    await db.insert(agents).values({
      userId: agentUser.id,
      commissionRate: "8.00",
      isApproved: true,
    });
    console.log("✅ Sample agent created");

    // Create buses
    const [bus1] = await db.insert(buses).values({
      name: "Express Voyager",
      type: "Luxury Volvo",
      plateNumber: "NY-2024-X",
      totalSeats: 40,
      amenities: ["WiFi", "Charging Point", "Water Bottle", "Blanket"],
      rating: "4.8",
    }).returning();

    const [bus2] = await db.insert(buses).values({
      name: "City Connector",
      type: "AC Seater",
      plateNumber: "DC-5502-Y",
      totalSeats: 50,
      amenities: ["WiFi", "Charging Point", "Water Bottle"],
      rating: "4.2",
    }).returning();

    const [bus3] = await db.insert(buses).values({
      name: "Night Rider",
      type: "AC Sleeper",
      plateNumber: "MA-9901-Z",
      totalSeats: 30,
      amenities: ["WiFi", "Charging Point", "Blanket", "Pillow", "Reading Light"],
      rating: "4.5",
    }).returning();
    console.log("✅ Sample buses created");

    // Create routes for next 2 days
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const routesToCreate = [];

    // Today's routes
    [bus1, bus2, bus3].forEach((bus, index) => {
      const departureTime = new Date(today);
      departureTime.setHours(8 + index * 2, 0, 0, 0);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + 4);

      routesToCreate.push({
        busId: bus.id,
        source: "New York",
        destination: "Boston",
        departureTime,
        arrivalTime,
        price: bus.type === "Luxury Volvo" ? "45.00" : bus.type === "AC Sleeper" ? "60.00" : "30.00",
        availableSeats: bus.totalSeats - Math.floor(Math.random() * 10),
      });

      const returnDeparture = new Date(departureTime);
      returnDeparture.setHours(returnDeparture.getHours() + 6);
      const returnArrival = new Date(returnDeparture);
      returnArrival.setHours(returnArrival.getHours() + 4);

      routesToCreate.push({
        busId: bus.id,
        source: "Boston",
        destination: "New York",
        departureTime: returnDeparture,
        arrivalTime: returnArrival,
        price: bus.type === "Luxury Volvo" ? "45.00" : bus.type === "AC Sleeper" ? "60.00" : "30.00",
        availableSeats: bus.totalSeats - Math.floor(Math.random() * 10),
      });
    });

    // Tomorrow's routes
    [bus1, bus2, bus3].forEach((bus, index) => {
      const departureTime = new Date(tomorrow);
      departureTime.setHours(9 + index * 2, 0, 0, 0);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + 4);

      routesToCreate.push({
        busId: bus.id,
        source: "New York",
        destination: "Washington DC",
        departureTime,
        arrivalTime,
        price: bus.type === "Luxury Volvo" ? "55.00" : bus.type === "AC Sleeper" ? "70.00" : "35.00",
        availableSeats: bus.totalSeats - Math.floor(Math.random() * 10),
      });
    });

    await db.insert(routes).values(routesToCreate);
    console.log("✅ Sample routes created");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("Admin:");
    console.log("  Email: admin@buslink.com");
    console.log("  Password: admin123");
    console.log("\nAgent:");
    console.log("  Email: agent@buslink.com");
    console.log("  Password: agent123");
    console.log("\nCustomer:");
    console.log("  Email: customer@example.com");
    console.log("  Password: customer123");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
  
  process.exit(0);
}

seed();
