"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { RefreshCw, Menu, Compass, Users } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import MainNav from "@/components/MainNav";
import { useStore } from "@/store/useStore";
import { useRef, useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const { fetchPlayers } = useStore();
  const hasRequestedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleRefresh = () => {
    hasRequestedRef.current = false;
    fetchPlayers();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-lg sm:text-xl font-bold font-heading text-amber-700 dark:text-primary">
                Golden<span className="text-amber-600">Scout</span>
              </span>
            </Link>
          </div>
          
          {/* Tablet ve Masaüstü Navigasyon */}
          <div className="hidden sm:flex items-center justify-center flex-1 px-4">
            <MainNav />
          </div>

          {/* Sağ taraf butonlar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobil Navigasyon - Sadece çok küçük ekranlarda */}
            <div className="sm:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Menü</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <div className="flex flex-col gap-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-amber-700 dark:text-primary">
                        Golden<span className="text-amber-600">Scout</span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        
                        return (
                          <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-md",
                              isActive 
                                ? "bg-amber-100 text-amber-700 dark:bg-primary/10 dark:text-primary" 
                                : "text-muted-foreground hover:bg-background/80"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Yenile</span>
            </Button>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

// Navigasyon öğeleri
const navItems = [
  {
    name: "Keşfet",
    href: "/",
    icon: Compass,
  },
  {
    name: "Tüm Oyuncular",
    href: "/players",
    icon: Users,
  },
];