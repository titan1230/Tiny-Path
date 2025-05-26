import { nanoid } from "nanoid";

export function generateSlug(): string {
  return nanoid(8);
}

export function validateSlug(slug: string): { isValid: boolean; message: string } {
  if (slug.length < 3) {
    return { isValid: false, message: "URL must be at least 3 characters long" };
  }
  
  if (slug.length > 50) {
    return { isValid: false, message: "URL must be less than 50 characters" };
  }

  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  if (!slugRegex.test(slug)) {
    return { 
      isValid: false, 
      message: "URL can only contain letters, numbers, hyphens, and underscores" 
    };
  }

  const reservedWords = [
    'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'dashboard',
    'app', 'help', 'support', 'about', 'contact', 'privacy', 'terms',
    'blog', 'news', 'login', 'signup', 'register', 'auth', 'oauth',
    'tree', 'link', 'linktree', 'bio', 'profile', 'user', 'account'
  ];
  
  if (reservedWords.includes(slug.toLowerCase())) {
    return { isValid: false, message: "This URL is reserved and cannot be used" };
  }

  return { isValid: true, message: "" };
}

export function formatSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_-]/g, '') 
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}
