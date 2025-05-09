import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate password strength on a scale of 0-100
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length contributes up to 40% of strength
  score += Math.min(40, password.length * 2);
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/[0-9]/.test(password)) score += 10; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) score += 15; // special chars
  
  // Variety of characters (more different characters = better)
  const uniqueChars = new Set(password.split('')).size;
  score += Math.min(15, uniqueChars);
  
  return Math.min(100, score);
}

/**
 * Get strength label based on score
 */
export function getStrengthLabel(score: number): "weak" | "medium" | "strong" {
  if (score >= 70) return "strong";
  if (score >= 40) return "medium";
  return "weak";
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 30) {
    return past.toLocaleDateString();
  } else if (diffInDays > 0) {
    return `${diffInDays}d ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h ago`;
  } else if (diffInMins > 0) {
    return `${diffInMins}m ago`;
  } else {
    return 'Just now';
  }
}
