import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextRequest } from 'next/server'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a secure random password using cryptographically strong random values
export function generatePassword(
  length = 16,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_-+=<>?";

  let charset = "";
  if (includeUppercase) charset += uppercaseChars;
  if (includeLowercase) charset += lowercaseChars;
  if (includeNumbers) charset += numberChars;
  if (includeSymbols) charset += symbolChars;

  // Fallback to lowercase if nothing was selected
  if (charset === "") charset = lowercaseChars;

  // Ensure we have at least one character from each selected group
  let password = "";
  
  if (includeUppercase) {
    password += uppercaseChars.charAt(secureRandomInt(0, uppercaseChars.length - 1));
  }
  
  if (includeLowercase) {
    password += lowercaseChars.charAt(secureRandomInt(0, lowercaseChars.length - 1));
  }
  
  if (includeNumbers) {
    password += numberChars.charAt(secureRandomInt(0, numberChars.length - 1));
  }
  
  if (includeSymbols) {
    password += symbolChars.charAt(secureRandomInt(0, symbolChars.length - 1));
  }
  
  // Fill the rest of the password with random characters
  const remainingLength = Math.max(0, length - password.length);
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = secureRandomInt(0, charset.length - 1);
    password += charset[randomIndex];
  }
  
  // Shuffle the password to ensure random order of guaranteed characters
  return shuffleString(password);
}

// Generate cryptographically secure random integer between min and max (inclusive)
function secureRandomInt(min: number, max: number): number {
  // Ensure max is inclusive
  max = max + 1;
  const range = max - min;
  
  // For small ranges, we can use a simple approach
  if (range <= 256) {
    const randomBytes = crypto.randomBytes(1);
    return (randomBytes[0] % range) + min;
  }
  
  // For larger ranges, we need a different approach to avoid bias
  const bitsNeeded = Math.ceil(Math.log2(range));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = Math.pow(2, bitsNeeded) - 1;
  
  let randomValue;
  do {
    const randomBytes = crypto.randomBytes(bytesNeeded);
    // Convert bytes to a number
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) + randomBytes[i];
    }
    randomValue = randomValue & mask; // Apply mask
  } while (randomValue >= range);
  
  return randomValue + min;
}

// Shuffle a string using Fisher-Yates algorithm with secure random
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = secureRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Calculate password strength score (0-100)
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length - strong emphasis on longer passwords
  score += Math.min(password.length * 4, 40);
  
  // Character variety
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  
  const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
  score += varietyCount * 10;
  
  // Penalize repeating characters
  const repeats = password.length - new Set(password).size;
  score -= repeats * 2;
  
  // Bonus for middle numbers/symbols
  const middleSymbolsOrNumbers = password.slice(1, -1).replace(/[A-Za-z]/g, '').length;
  score += middleSymbolsOrNumbers * 2;
  
  // Penalty for sequential patterns (123, abc, etc)
  if (/(?:012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    score -= 5;
  }
  
  // Penalty for repeated patterns
  if (/(.)\1\1/.test(password)) { // Three or more identical characters in a row
    score -= 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Get visual strength indicator
export function getPasswordStrengthText(score: number): {
  text: string;
  color: string;
} {
  if (score >= 80) return { text: "VERY STRONG", color: "text-green-500" };
  if (score >= 60) return { text: "STRONG", color: "text-cyan-500" };
  if (score >= 40) return { text: "MODERATE", color: "text-yellow-500" };
  if (score >= 20) return { text: "WEAK", color: "text-orange-500" };
  return { text: "VERY WEAK", color: "text-red-500" };
}

// Mask credential (show only first and last characters)
export function maskCredential(text: string, visibleChars = 2): string {
  if (!text || text.length <= visibleChars * 2) return text;
  
  const firstPart = text.substring(0, visibleChars);
  const lastPart = text.substring(text.length - visibleChars);
  const middlePart = "•".repeat(Math.min(text.length - (visibleChars * 2), 8));
  
  return `${firstPart}${middlePart}${lastPart}`;
}

// Add security audit trail with enhanced information
export function logSecurityEvent(event: string, req: NextRequest, metadata?: Record<string, unknown>) {
  // Get client IP from various headers, prioritizing x-forwarded-for
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 
             req.headers.get('x-real-ip') ?? 
             "unknown";
  
  // Log the event with additional security context
  const timestamp = new Date().toISOString();
  const requestId = crypto.randomUUID(); // Generate a unique ID for this event
  
  console.log(JSON.stringify({
    level: "INFO",
    timestamp,
    requestId,
    event,
    ip,
    path: req.nextUrl.pathname,
    method: req.method,
    userAgent: req.headers.get('user-agent') ?? "unknown",
    referer: req.headers.get('referer') ?? "none",
    ...metadata
  }));
  
  // In a production environment, you would want to send this to a secure logging service
  // or a SIEM system rather than just console.log
}
