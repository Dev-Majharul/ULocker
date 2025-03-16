import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/password-manager(.*)',
  '/admin-dashboard(.*)'
]);

// Middleware that adds security headers and handles authentication
export default clerkMiddleware(async (auth, req) => {
  // Comprehensive security headers
  const headers = new Headers(req.headers);
  
  // Content Security Policy - restrict content sources
  headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; connect-src 'self' https://*.clerk.accounts.dev; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;");
  
  // Prevent site from being embedded in iframes (clickjacking protection)
  headers.set("X-Frame-Options", "DENY");
  
  // Enable browser HTTPS enforcement (HSTS)
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  
  // Prevent browsers from MIME-sniffing responses
  headers.set("X-Content-Type-Options", "nosniff");
  
  // Control browser features like camera, microphone, location
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  
  // Enable browser XSS protection
  headers.set("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy to limit information sent with requests
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Get client IP securely from headers (for rate limiting implementation)
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                  req.headers.get('x-real-ip') || 
                  '127.0.0.1';
  
  // Check if the requested path requires authentication
  if (isProtectedRoute(req)) {
    // Protect the route - this will handle redirecting to sign-in if needed
    await auth.protect();
  }
  
  // Log security events (consider implementing secure logging to a dedicated service)
  console.log(`[SECURITY] ${new Date().toISOString()} - Request`, {
    path: req.nextUrl.pathname,
    ip: clientIp,
    userAgent: req.headers.get('user-agent') ?? "unknown",
  });
  
  return NextResponse.next({
    request: { headers }
  });
});

// Configure middleware to run on specific routes
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(css|js|ico|jpg|png|svg|webp)).*)',
  ],
};