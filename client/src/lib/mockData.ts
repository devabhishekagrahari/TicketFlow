import { addHours, format } from "date-fns";

export interface Bus {
  id: string;
  name: string;
  type: "AC Sleeper" | "AC Seater" | "Non-AC Seater" | "Luxury Volvo";
  plateNumber: string;
  totalSeats: number;
  amenities: string[];
  rating: number;
}

export interface Route {
  id: string;
  busId: string;
  source: string;
  destination: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  isLadies?: boolean;
  type: "sleeper" | "seater";
  price: number;
}

export const CITIES = [
  "New York", "Washington DC", "Boston", "Philadelphia", "Chicago", "Toronto", "Montreal"
];

export const BUSES: Bus[] = [
  {
    id: "bus-1",
    name: "Express Voyager",
    type: "Luxury Volvo",
    plateNumber: "NY-2024-X",
    totalSeats: 40,
    amenities: ["WiFi", "Charging Point", "Water Bottle", "Blanket"],
    rating: 4.8
  },
  {
    id: "bus-2",
    name: "City Connector",
    type: "AC Seater",
    plateNumber: "DC-5502-Y",
    totalSeats: 50,
    amenities: ["WiFi", "Charging Point", "Water Bottle"],
    rating: 4.2
  },
  {
    id: "bus-3",
    name: "Night Rider",
    type: "AC Sleeper",
    plateNumber: "MA-9901-Z",
    totalSeats: 30,
    amenities: ["WiFi", "Charging Point", "Blanket", "Pillow", "Reading Light"],
    rating: 4.5
  }
];

const generateRoutes = () => {
  const routes: Route[] = [];
  const today = new Date();
  
  // Generate some routes for today and tomorrow
  [0, 1].forEach(dayOffset => {
    BUSES.forEach((bus, index) => {
      const baseTime = addHours(today, dayOffset * 24 + 8 + index * 2); // Start at 8 AM, stagger buses
      
      routes.push({
        id: `route-${dayOffset}-${bus.id}-out`,
        busId: bus.id,
        source: "New York",
        destination: "Boston",
        departureTime: baseTime.toISOString(),
        arrivalTime: addHours(baseTime, 4).toISOString(),
        price: bus.type === "Luxury Volvo" ? 45 : bus.type === "AC Sleeper" ? 60 : 30,
        availableSeats: Math.floor(Math.random() * 20) + 5
      });

      routes.push({
        id: `route-${dayOffset}-${bus.id}-in`,
        busId: bus.id,
        source: "Boston",
        destination: "New York",
        departureTime: addHours(baseTime, 6).toISOString(),
        arrivalTime: addHours(baseTime, 10).toISOString(),
        price: bus.type === "Luxury Volvo" ? 45 : bus.type === "AC Sleeper" ? 60 : 30,
        availableSeats: Math.floor(Math.random() * 20) + 5
      });
    });
  });
  return routes;
};

export const ROUTES = generateRoutes();

export const generateSeats = (busType: string): Seat[] => {
  const seats: Seat[] = [];
  const total = busType.includes("Sleeper") ? 30 : 40;
  
  for (let i = 1; i <= total; i++) {
    const isSleeper = busType.includes("Sleeper");
    // Mock some booked seats
    const isBooked = Math.random() < 0.3; 
    const isLadies = !isBooked && Math.random() < 0.1;

    seats.push({
      id: `seat-${i}`,
      number: `${isSleeper ? 'L' : ''}${i}`,
      isBooked,
      isLadies,
      type: isSleeper ? "sleeper" : "seater",
      price: 0 // Base price added at route level
    });
  }
  return seats;
};
