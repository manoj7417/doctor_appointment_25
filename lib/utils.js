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

export function validateSubdomain(subdomain) {
  if (!subdomain) return { isValid: true, message: "" };

  // Subdomain validation rules
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

  if (subdomain.length < 3) {
    return { isValid: false, message: "Subdomain must be at least 3 characters long" };
  }

  if (subdomain.length > 63) {
    return { isValid: false, message: "Subdomain must be less than 63 characters" };
  }

  if (!subdomainRegex.test(subdomain)) {
    return { isValid: false, message: "Subdomain can only contain lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen." };
  }

  return { isValid: true, message: "" };
}

export function validateCustomDomain(domain) {
  if (!domain) return { isValid: true, message: "" };

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;

  if (!domainRegex.test(domain)) {
    return { isValid: false, message: "Please enter a valid domain name" };
  }

  // Check for common TLDs
  const validTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.in', '.co', '.io', '.me', '.info'];
  const hasValidTLD = validTLDs.some(tld => domain.toLowerCase().endsWith(tld));

  if (!hasValidTLD) {
    return { isValid: false, message: "Please include a valid top-level domain (e.g., .com, .org, .in)" };
  }

  return { isValid: true, message: "" };
}



export function validateDomain(domain) {
  if (!domain) return { isValid: true, message: "" };

  // Domain validation rules (without www)
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

  if (domain.length < 3) {
    return { isValid: false, message: "Domain must be at least 3 characters long" };
  }

  if (domain.length > 63) {
    return { isValid: false, message: "Domain must be less than 63 characters" };
  }

  if (!domainRegex.test(domain)) {
    return { isValid: false, message: "Domain can only contain lowercase letters, numbers, hyphens, and dots. Cannot start or end with a hyphen or dot." };
  }

  // Check for common TLDs
  const validTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.in', '.co', '.io', '.me', '.info'];
  const hasValidTLD = validTLDs.some(tld => domain.toLowerCase().endsWith(tld));

  if (!hasValidTLD) {
    return { isValid: false, message: "Please include a valid top-level domain (e.g., .com, .org, .in)" };
  }

  return { isValid: true, message: "" };
}
