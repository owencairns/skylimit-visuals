export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  createdAt: string;
  isNew?: boolean;
}
