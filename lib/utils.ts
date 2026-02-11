import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BLOB_BASE =
  "https://oyabyty4jh8sagal.public.blob.vercel-storage.com";
