import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateDoctorSlug(name, id) {
  // Convert name to lowercase and replace spaces with hyphens
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens

  // Add doctor prefix and ID for uniqueness
  return `dr-${slug}-${id}`;
}

export function extractDoctorIdFromSlug(slug) {
  // Extract the ID from the slug (last part after the last hyphen)
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
