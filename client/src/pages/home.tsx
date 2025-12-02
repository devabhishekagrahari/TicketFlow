import { motion } from "framer-motion";
import BusSearch from "@/components/bus-search";
import { ShieldCheck, Clock, Award } from "lucide-react";
import heroImage from '@assets/generated_images/modern_scenic_bus_travel_illustration.png';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Scenic Bus Travel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="container relative z-10 px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg">
              Journey with Comfort <br/> <span className="text-accent">Arrive in Style</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
              Book premium bus tickets for intercity travel across the country. 
              Reliable service, luxury coaches, and seamless booking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BusSearch />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">Why Choose BusLink?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We prioritize your safety and comfort above everything else. Experience the difference with our premium fleet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Our buses are sanitized before every trip and equipped with GPS tracking for your safety.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border/50">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Time Departure</h3>
              <p className="text-muted-foreground">
                We respect your time. 98% of our buses depart and arrive exactly as scheduled.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border/50">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Comfort</h3>
              <p className="text-muted-foreground">
                Enjoy extra legroom, reclining seats, and complimentary snacks on selected routes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
