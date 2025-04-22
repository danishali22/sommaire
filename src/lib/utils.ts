import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Badge not rendering
// Upload thing error:- error occurred while uploading UploadThingError: Failed to run middleware