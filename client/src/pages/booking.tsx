import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ROUTES, BUSES, generateSeats } from "@/lib/mockData";
import SeatMap from "@/components/seat-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Ticket } from "lucide-react";

export default function Booking() {
  const [, params] = useRoute("/booking/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const routeId = params?.id;
  const route = ROUTES.find(r => r.id === routeId);
  const bus = BUSES.find(b => b.id === route?.busId);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats] = useState(() => bus ? generateSeats(bus.type) : []);
  const [step, setStep] = useState<"seats" | "details" | "payment">("seats");

  if (!route || !bus) return <div>Route not found</div>;

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 5) {
        toast({
          title: "Max 5 seats",
          description: "You can only book up to 5 seats at a time.",
          variant: "destructive"
        });
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const totalPrice = selectedSeats.length * route.price;

  const handlePayment = () => {
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your tickets for ${route.source} to ${route.destination} have been booked.`,
    });
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => window.history.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 'seats' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
            <div className={`h-1 w-16 ${step !== 'seats' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
            <div className={`h-1 w-16 ${step === 'payment' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
          </div>

          {step === "seats" && (
            <Card>
              <CardHeader>
                <CardTitle>Select Seats</CardTitle>
              </CardHeader>
              <CardContent>
                <SeatMap 
                  seats={seats} 
                  selectedSeats={selectedSeats} 
                  onSeatSelect={handleSeatSelect} 
                />
              </CardContent>
            </Card>
          )}

          {step === "details" && (
            <Card>
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input type="number" placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="+1 234 567 8900" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg flex items-center gap-4 cursor-pointer bg-muted/20 border-primary/50">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <div className="font-bold">Credit / Debit Card</div>
                    <div className="text-sm text-muted-foreground">Pay securely with Stripe</div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary"></div>
                </div>
                <div className="p-4 border rounded-lg flex items-center gap-4 cursor-pointer opacity-50">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="font-bold">Google Pay</div>
                    <div className="text-sm text-muted-foreground">Coming soon</div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-2 border-muted"></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-bold text-lg">{bus.name}</h4>
                <p className="text-sm text-muted-foreground">{bus.type}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-bold">{format(parseISO(route.departureTime), "MMM d, HH:mm")}</div>
                  <div className="text-muted-foreground">{route.source}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{format(parseISO(route.arrivalTime), "MMM d, HH:mm")}</div>
                  <div className="text-muted-foreground">{route.destination}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Seat(s)</span>
                  <span className="font-medium">{selectedSeats.join(", ") || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price per seat</span>
                  <span>${route.price}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">${totalPrice}</span>
              </div>
            </CardContent>
            <CardFooter>
              {step === "seats" && (
                <Button 
                  className="w-full font-bold" 
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep("details")}
                >
                  Continue to Details
                </Button>
              )}
              {step === "details" && (
                <Button 
                  className="w-full font-bold" 
                  onClick={() => setStep("payment")}
                >
                  Proceed to Pay
                </Button>
              )}
              {step === "payment" && (
                <Button 
                  className="w-full font-bold bg-green-600 hover:bg-green-700" 
                  onClick={handlePayment}
                >
                  Pay ${totalPrice}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
