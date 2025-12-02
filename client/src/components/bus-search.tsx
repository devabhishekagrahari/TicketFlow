import { useState } from "react";
import { useLocation } from "wouter";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/lib/mockData";

export default function BusSearch({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  const handleSearch = () => {
    if (!source || !destination) return;
    setLocation(`/search?from=${source}&to=${destination}&date=${date?.toISOString()}`);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl shadow-black/5 border border-border/50 relative z-10", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From</label>
          <Select onValueChange={setSource} defaultValue={source}>
            <SelectTrigger className="h-12 border-muted bg-muted/30 focus:ring-primary/20">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="Select Source" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={`source-${city}`} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</label>
          <Select onValueChange={setDestination} defaultValue={destination}>
            <SelectTrigger className="h-12 border-muted bg-muted/30 focus:ring-primary/20">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="Select Destination" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CITIES.filter(c => c !== source).map((city) => (
                <SelectItem key={`dest-${city}`} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-muted bg-muted/30 hover:bg-muted/50",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-transparent select-none uppercase tracking-wider">Action</label>
          <Button 
            className="w-full h-12 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
            onClick={handleSearch}
          >
            Search Buses
          </Button>
        </div>
      </div>
    </div>
  );
}
