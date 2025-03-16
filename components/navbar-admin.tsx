"use client";

import { useState } from "react";
import { Menu, Sun, Moon, Shield, CreditCard, Database, Key, Monitor, Users, Activity, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const adminLinks = [
    { name: "Dashboard", href: "/admin-dashboard?tab=overview", icon: Activity },
    { name: "Users", href: "/admin-dashboard?tab=users", icon: Users },
    { name: "Security", href: "/admin-dashboard?tab=security", icon: Shield },
    { name: "Vault Access", href: "/password-manager", icon: Database },
  ];

  return (
    <nav className="bg-black/80 text-foreground p-4 m-4 flex items-center justify-between shadow-lg relative rounded-lg transition-all ease-in-out border-2 border-pink-500 hover:border-cyan-500 hover:shadow-cyan-500">
      <div className="flex items-center gap-4">
        <Menu
          className="h-6 w-6 md:hidden cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 text-pink-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        />
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-pink-500" />
          <h1 className="text-2xl font-bold tracking-wide cyberpunk-text">ADMIN CONTROLS</h1>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
        {adminLinks.map(({ name, href, icon: Icon }) => (
          <Button
            key={name}
            variant="ghost"
            onClick={() => router.push(href)}
            className={cn(
              "text-foreground flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:scale-105",
              pathname === href.split('?')[0] && "bg-gradient-to-r from-pink-500 to-purple-500"
            )}
          >
            <Icon className="h-5 w-5" /> <span className="cyberpunk-text">{name}</span>
          </Button>
        ))}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 md:hidden">
          <div className="bg-black/90 border-2 border-pink-500 rounded-lg shadow-lg shadow-pink-500/20 p-4 m-4">
            <div className="space-y-3">
              {adminLinks.map(({ name, href, icon: Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  onClick={() => {
                    router.push(href);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full justify-start text-foreground flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:shadow-lg",
                    pathname === href.split('?')[0] && "bg-gradient-to-r from-pink-500 to-purple-500"
                  )}
                >
                  <Icon className="h-5 w-5" /> <span className="cyberpunk-text">{name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Controls */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          className="text-foreground flex items-center gap-2 transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg py-2 px-4 rounded-lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button
          variant="outline"
          className="text-foreground flex items-center gap-2 transition duration-300 ease-in-out border-pink-500 text-pink-500 hover:bg-pink-500/20 py-2 px-4 rounded-lg"
          onClick={() => router.push("/")}
        >
          <Lock className="h-5 w-5" />
          <span className="hidden sm:inline">Exit Admin</span>
        </Button>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
