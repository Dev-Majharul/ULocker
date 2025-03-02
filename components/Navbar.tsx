

"use client";

import { useState } from "react";
import { Menu, User, Settings, Home, LogOut, Key, Bookmark, Monitor, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes"; // Import useTheme for dark mode
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignInButton, SignedOut, SignUpButton, SignedIn, UserButton, UserProfile } from '@clerk/nextjs'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme(); // Use ShadCN UI's theme system

  const navLinks = [
    { name: "Admin Dashboard", href: "/admin-dashboard", icon: Monitor },
    { name: "Saved Links", href: "/saved-links", icon: Bookmark },
    { name: "Generate Pass", href: "/generate-pass", icon: Key },
  ];

  return (
    <nav className="bg-background text-foreground p-4 m-4 flex items-center justify-between shadow-lg relative rounded-lg transition-all ease-in-out border-2 border-transparent hover:border-cyan-500 hover:shadow-cyan-500">
      <div className="flex items-center gap-4">
        <Menu
          className="h-6 w-6 md:hidden cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 text-pink-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        />
        <h1 className="text-2xl font-bold tracking-wide cyberpunk-text">Admin Dashboard</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navLinks.map(({ name, href, icon: Icon }) => (
          <Button
            key={name}
            variant="ghost"
            className={cn(
              "text-foreground flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:scale-105",
              pathname === href && "bg-gradient-to-r from-pink-500 to-purple-500"
            )}
          >
            <Icon className="h-5 w-5" /> <span className="cyberpunk-text">{name}</span>
          </Button>
        ))}
      </div>

      {/* Right-Side Controls */}
        <div className = "flex items-center gap-6">
        <Button
          variant="ghost"
          className="text-foreground flex items-center gap-2 transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg py-2 px-4 rounded-lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        
        
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        
        </div>
    </nav>
  );
}

