"use client";

import { useRouter } from "next/navigation";
import { Shield, Lock, Key, Database, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const features = [
    { 
      icon: Shield, 
      title: "Secure Vault", 
      description: "Store all your credentials behind military-grade encryption" 
    },
    { 
      icon: Key, 
      title: "Password Generator", 
      description: "Create strong, unique passwords that are impossible to crack" 
    },
    { 
      icon: CreditCard, 
      title: "Card Storage", 
      description: "Safely store and manage your payment information" 
    },
    { 
      icon: Database, 
      title: "Autofill", 
      description: "Fill in forms automatically with your stored credentials" 
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center text-center mb-20 pt-10">
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-bold cyberpunk-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                SECURE VAULT
              </span>
            </h1>
            <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-cyan-500/30 to-pink-500/30 opacity-70 z-[-1]"></div>
          </div>

          <p className="text-xl max-w-2xl mb-10">
            The ultra-secure password manager with futuristic cyberpunk design. 
            Protect your digital identity in style.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Button 
              onClick={() => router.push('/password-manager')}
              className="px-6 py-6 text-lg font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-pink-500/30 rounded-lg"
            >
              OPEN VAULT
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => router.push('/admin-dashboard')}
              variant="outline"
              className="px-6 py-6 text-lg font-bold border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500/20 transition-all duration-300"
            >
              ADMIN PANEL
              <Lock className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Background grid effect */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 grid grid-cols-24 gap-0.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={`v-${i}`} className="h-full w-[1px] bg-cyan-500" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-24 gap-0.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={`h-${i}`} className="w-full h-[1px] bg-pink-500" />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out"
              >
                <div className="mb-4 p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 w-fit">
                  <Icon className="h-8 w-8 text-cyan-500 group-hover:text-pink-500 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 cyberpunk-text">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative z-10 p-8 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4 cyberpunk-text">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              READY TO SECURE YOUR DIGITAL LIFE?
            </span>
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands who trust Secure Vault with their most sensitive information.
            Your security is our priority.
          </p>
          <Button 
            onClick={() => router.push('/password-manager')}
            className="px-8 py-6 text-lg font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-pink-500/30 rounded-lg"
          >
            GET STARTED NOW
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Animated dots */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={`dot-${i}`} 
              className="absolute w-1 h-1 rounded-full bg-cyan-500"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `pulse ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
