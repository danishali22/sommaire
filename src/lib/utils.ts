import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileName(url: string): string {
  const fileName = url.split("/").pop() || "";

  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Badge not rendering
// dialog render issue
// delete summary not working  -> delete should be on that page not with dialog
// style summary/[id] page
// dashboard sekeleton
// there should be no errors on console