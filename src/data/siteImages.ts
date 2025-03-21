import { SiteImage, ImageCollection } from "../types/image";

// This array contains information about all images used on the site
// The actual image URLs will be fetched from Firebase Storage
export const siteImages: SiteImage[] = [
  // HOME PAGE
  {
    id: "hero-main",
    name: "hero-main",
    path: "/home/hero-main.mp4",
    alt: "Sky Limit Visuals Hero Video",
    page: "home",
    section: "hero",
    priority: true,
    width: 1920,
    height: 1080,
    type: "video",
    mimeType: "video/mp4",
  },
  {
    id: "services-1",
    name: "services-1",
    path: "/home/services-1.webp",
    alt: "Films Services",
    page: "home",
    section: "services",
    width: 800,
    height: 600,
    type: "image",
  },
  {
    id: "services-2",
    name: "services-2",
    path: "/home/services-2.webp",
    alt: "Investment Services",
    page: "home",
    section: "services",
    width: 800,
    height: 600,
    type: "image",
  },
  {
    id: "services-3",
    name: "services-3",
    path: "/home/services-3.webp",
    alt: "Contact Services",
    page: "home",
    section: "services",
    width: 800,
    height: 600,
    type: "image",
  },
  {
    id: "team-main",
    name: "team-main",
    path: "/home/team-main.webp",
    alt: "Sky Limit Visuals Team",
    page: "home",
    section: "team",
    width: 500,
    height: 500,
    type: "image",
  },
  // Testimonial Images
  {
    id: "testimonial-1",
    name: "testimonial-1",
    path: "/home/testimonial-1.webp",
    alt: "Testimonial 1",
    page: "home",
    section: "testimonials",
    width: 600,
    height: 800,
    type: "image",
  },
  {
    id: "testimonial-2",
    name: "testimonial-2",
    path: "/home/testimonial-2.webp",
    alt: "Testimonial 2",
    page: "home",
    section: "testimonials",
    width: 600,
    height: 800,
    type: "image",
  },
  {
    id: "testimonial-3",
    name: "testimonial-3",
    path: "/home/testimonial-3.webp",
    alt: "Testimonial 3",
    page: "home",
    section: "testimonials",
    width: 600,
    height: 800,
    type: "image",
  },
  // Placeholder for dynamic testimonial images
  {
    id: "testimonial-placeholder",
    name: "testimonial-placeholder",
    path: "/images/placeholder.jpg",
    alt: "Testimonial Placeholder",
    page: "home",
    section: "testimonials",
    width: 600,
    height: 800,
    type: "image",
  },

  // ABOUT PAGE
  {
    id: "about-hero",
    name: "about-hero",
    path: "/about/about-hero.webp",
    alt: "About Sky Limit Visuals Hero",
    page: "about",
    section: "hero",
    width: 1920,
    height: 1080,
    type: "image",
  },
  {
    id: "about-team-1",
    name: "about-team-1",
    path: "/about/about-team-1.webp",
    alt: "Team Member 1",
    page: "about",
    section: "team",
    width: 800,
    height: 1000,
    type: "image",
  },
  {
    id: "about-team-2",
    name: "about-team-2",
    path: "/about/about-team-2.webp",
    alt: "Team Member 2",
    page: "about",
    section: "team",
    width: 800,
    height: 1000,
    type: "image",
  },
  {
    id: "noah-portrait",
    name: "noah-portrait",
    path: "/about/noah-portrait.webp",
    alt: "Noah Ike",
    page: "about",
    section: "team",
    width: 1000,
    height: 1000,
    type: "image",
  },
  {
    id: "reagan-portrait",
    name: "reagan-portrait",
    path: "/about/reagan-portrait.webp",
    alt: "Reagan Berce",
    page: "about",
    section: "team",
    width: 1000,
    height: 1000,
    type: "image",
  },

  // FILMS PAGE
  {
    id: "films-hero",
    name: "films-hero",
    path: "/films/films-hero.webp",
    alt: "Films Hero Image",
    page: "films",
    section: "hero",
    width: 1920,
    height: 1080,
    type: "image",
  },

  // PHOTOS PAGE
  {
    id: "photos-hero",
    name: "photos-hero",
    path: "/photos/photos-hero.webp",
    alt: "Photos Hero Image",
    page: "photos",
    section: "hero",
    width: 1920,
    height: 1080,
    type: "image",
  },

  // INVESTMENT PAGE
  {
    id: "investment-hero",
    name: "investment-hero",
    path: "/investment/investment-hero.webp",
    alt: "Investment Hero Image",
    page: "investment",
    section: "hero",
    width: 1920,
    height: 1080,
    type: "image",
  },

  // CONTACT PAGE
  {
    id: "contact-hero",
    name: "contact-hero",
    path: "/contact/contact-hero.webp",
    alt: "Contact Hero Image",
    page: "contact",
    section: "hero",
    width: 1920,
    height: 1080,
    type: "image",
  },
];

// Group images by page for easier access
export const imagesByPage: ImageCollection = siteImages.reduce(
  (acc: ImageCollection, image) => {
    if (!acc[image.page]) {
      acc[image.page] = [];
    }
    acc[image.page].push(image);
    return acc;
  },
  {}
);

// Group images by section for backward compatibility
export const imagesBySection: ImageCollection = siteImages.reduce(
  (acc: ImageCollection, image) => {
    if (!acc[image.section]) {
      acc[image.section] = [];
    }
    acc[image.section].push(image);
    return acc;
  },
  {}
);
