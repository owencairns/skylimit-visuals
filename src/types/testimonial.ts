export interface Testimonial {
  id: number;
  quote: string;
  description: string;
  client: string;
  imageId: string;
  imagePath?: string;
  imageUrl?: string;
  isNew?: boolean;
}
