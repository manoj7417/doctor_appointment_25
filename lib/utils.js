import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateDoctorSlug(name, id) {
  // Remove common doctor titles and clean the name
  const cleanName = name
    .replace(/^(dr\.?|doctor)\s+/i, '') // Remove Dr., Dr, Doctor prefixes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Add doctor prefix and ID for uniqueness
  return `dr-${cleanName}-${id}`;
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

// Custom domain utility functions
export function isCustomDoctorDomain(hostname, mainDomains = []) {
  const defaultMainDomains = [
    'localhost',
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1',
    '127.0.0.1:3000',
    'yourdomain.com',
    'www.yourdomain.com',
  ];
  
  const allMainDomains = [...defaultMainDomains, ...mainDomains];
  return !allMainDomains.includes(hostname);
}

export function extractDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Error extracting domain from URL:', error);
    return null;
  }
}

export function normalizeDomain(domain) {
  if (!domain) return null;
  
  // Remove protocol if present
  let normalized = domain.replace(/^https?:\/\//, '');
  
  // Remove www. prefix
  normalized = normalized.replace(/^www\./, '');
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized.toLowerCase();
}

export function getMainDomains() {
  return [
    'localhost',
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1',
    '127.0.0.1:3000',
    // Add your main production domains here
    // 'yourdomain.com',
    // 'www.yourdomain.com',
  ];
}
