import { useLocation, Link } from "wouter";
import { ROUTES, BUSES } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ArrowRight, Clock, MapPin, Wifi, Coffee, Search } from "lucide-react";
import BusSearch from "@/components/bus-search";

export default function SearchResults() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const from = params.get('from');
  const to = params.get('to');

  // In a real app, we would filter by API
  const filteredRoutes = ROUTES.filter(route => 
    (!from || route.source === from) && 
    (!to || route.destination === to)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BusSearch className="shadow-sm border" />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold">
          {from} to {to}
        </h2>
        <p className="text-muted-foreground">{filteredRoutes.length} buses found</p>
      </div>

      <div className="space-y-4">
        {filteredRoutes.map(route => {
          const bus = BUSES.find(b => b.id === route.busId);
          if (!bus) return null;

          return (
            <Card key={route.id} className="overflow-hidden hover:shadow-md transition-all group border-border/60">
              <div className="flex flex-col md:flex-row">
                {/* Left: Bus Info */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {bus.name}
                        <Badge variant="secondary" className="text-xs font-normal">{bus.type}</Badge>
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">★ {bus.rating}</span>
                        <span>• {bus.totalSeats} Seats</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">${route.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mb-6">
                    <div>
                      <div className="text-lg font-bold">{format(parseISO(route.departureTime), "HH:mm")}</div>
                      <div className="text-sm text-muted-foreground">{route.source}</div>
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col px-4">
                      <div className="w-full h-[1px] bg-border relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full">
                        4h 00m
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{format(parseISO(route.arrivalTime), "HH:mm")}</div>
                      <div className="text-sm text-muted-foreground">{route.destination}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {bus.amenities.includes("WiFi") && <Badge variant="outline" className="gap-1"><Wifi className="h-3 w-3"/> WiFi</Badge>}
                    {bus.amenities.includes("Water Bottle") && <Badge variant="outline" className="gap-1"><Coffee className="h-3 w-3"/> Water</Badge>}
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="bg-muted/30 p-6 flex flex-col justify-center items-center border-l border-border/50 md:w-48 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Seats Available</div>
                    <div className="text-xl font-bold text-foreground">{route.availableSeats}</div>
                  </div>
                  <Link href={`/booking/${route.id}`} className="w-full">
                    <Button className="w-full font-bold shadow-lg shadow-primary/20">Select Seats</Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredRoutes.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No buses found</h3>
            <p className="text-muted-foreground">Try searching for a different date or route.</p>
          </div>
        )}
      </div>
    </div>
  );
}
