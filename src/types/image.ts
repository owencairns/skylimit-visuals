export interface SiteImage {
  id: string;
  name: string;
  path: string; // Path in Firebase Storage
  url?: string; // URL will be populated when fetched
  alt: string;
  page: "home" | "about" | "films" | "photos" | "investment" | "contact"; // Page where the image is used
  section: string; // Section within the page (e.g., "hero", "services", "team")
  priority?: boolean; // For Next.js Image priority loading
  width: number;
  height: number;
  type: "image" | "video"; // Type of media
  mimeType?: string; // MIME type for the file
}

export interface ImageCollection {
  [key: string]: SiteImage[];
}
