import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from "@/components/theme-provider"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Scanner effect overlay */}
            <div className="scanner-effect"></div>
            
            <Navbar/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}