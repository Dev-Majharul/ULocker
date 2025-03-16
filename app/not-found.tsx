"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
      {/* Animated background grid lines */}
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

      <div className="relative z-10 text-center">
        <div className="mb-8 inline-block p-6 rounded-full bg-black/80 border-4 border-pink-500 shadow-lg shadow-pink-500/20">
          <Shield className="w-20 h-20 text-pink-500" />
        </div>
        
        <h1 className="text-8xl font-bold mb-6 cyberpunk-text relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            404
          </span>
          <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-cyan-500/30 to-pink-500/30 opacity-70 z-[-1]"></div>
        </h1>
        
        <h2 className="text-3xl font-bold mb-6 cyberpunk-text">ACCESS DENIED</h2>
        
        <p className="text-xl max-w-md mx-auto mb-10 text-gray-300">
          The digital realm you seek has been classified or doesn't exist in this sector.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/')}
            className="px-6 py-4 text-lg font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-pink-500/30 rounded-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            RETURN TO HOMEBASE
          </Button>
        </div>
      </div>
      
      {/* Glitch effect */}
      <div className="fixed inset-0 pointer-events-none" style={{ mixBlendMode: 'overlay' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={`glitch-${i}`}
            className="absolute w-full h-1 bg-cyan-500/20"
            style={{
              top: `${20 + (i * 30)}%`,
              left: 0,
              opacity: 0.7,
              animation: `scanner ${2 + i}s ease-in-out infinite alternate ${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
} 