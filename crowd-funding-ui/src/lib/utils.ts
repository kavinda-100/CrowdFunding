import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Unix timestamp to a human-readable date string
 * @param timestamp - Unix timestamp as string (from blockchain)
 * @param options - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string or "Invalid Date" if timestamp is invalid
 *
 * @example
 * ```typescript
 * formatTimestamp("1692849600") // "Aug 24, 2023"
 * formatTimestamp("1692849600", {
 *   month: "long",
 *   day: "numeric",
 *   year: "numeric"
 * }) // "August 24, 2023"
 * ```
 */
export function formatTimestamp(
  timestamp: string | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  if (!timestamp) return "Unknown Date";

  try {
    const date = new Date(parseInt(timestamp) * 1000);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid Date";
  }
}
