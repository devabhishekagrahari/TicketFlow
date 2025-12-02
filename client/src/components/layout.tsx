import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bus, LayoutDashboard, LogOut, MapPin, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [userRole, setUserRole] = useState<"customer" | "agent" | "admin">("customer");

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Bus className="h-6 w-6" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">BusLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </Link>
            <Link href="/search" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/search' ? 'text-primary' : 'text-muted-foreground'}`}>
              Book Tickets
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              My Bookings
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Support
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher for Prototype Demo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{userRole} View</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setUserRole("customer"); setLocation("/"); }}>
                  Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setUserRole("agent"); setLocation("/agent"); }}>
                  Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setUserRole("admin"); setLocation("/admin"); }}>
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Bus className="h-4 w-4" />
                </div>
                <span className="font-heading text-lg font-bold">BusLink</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium bus booking experience for modern travelers. Safety, comfort, and punctuality guaranteed.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> 123 Travel St, NY</li>
                <li>support@buslink.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 BusLink Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
