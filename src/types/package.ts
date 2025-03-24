export type PackageFeature = {
  text: string;
  note?: string;
};

export type Package = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  price: string;
  features: PackageFeature[];
  type: "videography" | "photography";
  order: number;
  isNew?: boolean;
};
