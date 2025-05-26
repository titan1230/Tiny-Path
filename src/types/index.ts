export interface Link {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
  clickCount?: number;
}

export interface Profile {
  id: string;
  name: string;
  username: string;
  slug?: string;
  avatar?: string;
  background: string;
  title?: string;
  description?: string;
  isPublic: boolean;
  viewCount?: number;
}

export interface BackgroundOption {
  name: string;
  class: string;
}

export interface BackgroundOptions {
  gradients: BackgroundOption[];
  solids: BackgroundOption[];
}

export interface SlugValidation {
  isValid: boolean;
  isAvailable: boolean;
  message: string;
}
