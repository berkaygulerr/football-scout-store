"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Compass, Users } from "lucide-react";

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

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-1.5 rounded-full",
              isActive 
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/15" 
                : "text-muted-foreground hover:bg-background/80",
              // Responsive padding
              "h-8 px-3 sm:h-9 sm:px-4"
            )}
          >
            <Link href={item.href} className="flex items-center">
              <Icon className="h-4 w-4" />
              <span className="ml-1.5 text-sm">{item.name}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}