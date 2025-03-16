"use client";

import { useState } from "react";
import { Menu, Sun, Moon, Shield, CreditCard, Database, Key, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignInButton, SignedOut, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme(); // Use ShadCN UI's theme system

  const navLinks = [
    { name: "Admin Dashboard", href: "/admin-dashboard", icon: Monitor },
    { name: "Password Manager", href: "/password-manager", icon: Shield },
    { name: "Generate Pass", href: "/password-manager?tab=generate", icon: Key },
    { name: "Saved Cards", href: "/password-manager?tab=cards", icon: CreditCard },
    { name: "Saved Passwords", href: "/password-manager?tab=passwords", icon: Database },
  ];

  return (
    <nav className="bg-background text-foreground p-4 m-4 flex items-center justify-between shadow-lg relative rounded-lg transition-all ease-in-out border-2 border-transparent hover:border-cyan-500 hover:shadow-cyan-500">
      <div className="flex items-center gap-4">
        <Menu
          className="h-6 w-6 md:hidden cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 text-pink-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        />
        <h1 className="text-2xl font-bold tracking-wide cyberpunk-text">SECURE VAULT</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {navLinks.map(({ name, href, icon: Icon }) => (
          <Button
            key={name}
            variant="ghost"
            aria-label={`Navigate to ${name}`}
            className={cn(
              "text-foreground flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:scale-105",
              pathname.startsWith(href.split('?')[0]) && "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
            )}
          >
            <Icon className="h-5 w-5 transition-colors duration-300" /> <span className="cyberpunk-text">{name}</span>
          </Button>
        ))}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 md:hidden">
          <div className="bg-black/90 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 p-4 m-4 backdrop-blur-lg">
            <div className="space-y-3">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  aria-label={`Navigate to ${name}`}
                  className={cn(
                    "w-full justify-start text-foreground flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg",
                    pathname.startsWith(href.split('?')[0]) && "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 transition-colors duration-300" /> <span className="cyberpunk-text">{name}</span>
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
          variant="ghost"
          className="relative group"
        >
          <Shield className="h-5 w-5 text-cyan-500" />
          <span className="absolute -right-1 -top-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </span>
        </Button>

        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                card: "bg-black border-2 border-cyan-500",
                footer: "hidden"
              }
            }}
            afterSignOutUrl="/"
            afterSwitchSessionUrl="/password-manager"
          />
        </SignedIn>
      </div>
    </nav>
  );
}

