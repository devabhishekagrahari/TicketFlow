import { useState } from "react";
import { Seat } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

export default function SeatMap({ seats, selectedSeats, onSeatSelect }: SeatMapProps) {
  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm">
      <div className="mb-8 flex justify-between items-center text-sm text-muted-foreground px-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted-foreground/20 border-transparent"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary border-primary"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-100 border-pink-200"></div>
          <span>Ladies</span>
        </div>
      </div>

      <div className="relative w-full max-w-[300px] mx-auto bg-muted/10 rounded-3xl border-2 border-muted p-4 pb-12">
        {/* Driver Seat */}
        <div className="absolute top-4 right-4 w-8 h-8 border-2 border-muted-foreground/30 rounded-md flex items-center justify-center mb-8">
          <span className="text-[10px] font-bold text-muted-foreground">D</span>
        </div>

        <div className="mt-16 grid grid-cols-4 gap-x-4 gap-y-4">
          {/* Aisle */}
          <div className="col-span-4 flex justify-center mb-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Front</span>
          </div>

          {seats.map((seat, index) => {
            const isSelected = selectedSeats.includes(seat.id);
            
            return (
              <motion.button
                whileHover={!seat.isBooked ? { scale: 1.1 } : {}}
                whileTap={!seat.isBooked ? { scale: 0.95 } : {}}
                key={seat.id}
                onClick={() => !seat.isBooked && onSeatSelect(seat.id)}
                disabled={seat.isBooked}
                className={cn(
                  "relative h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium transition-colors",
                  // Aisle Logic (Gap after 2 seats)
                  (index % 4 === 1) ? "mr-4" : "",
                  
                  seat.isBooked 
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                    : isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2"
                      : seat.isLadies
                        ? "bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-200"
                        : "bg-white border border-input hover:border-primary hover:text-primary"
                )}
              >
                {seat.number}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
