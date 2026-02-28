import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Photography | Skylimit Visuals",
  description:
    "Browse our collection of stunning wedding photography, capturing the most beautiful moments of your special day. Professional wedding photographer in Michigan.",
  openGraph: {
    title: "Wedding Photography | Skylimit Visuals",
    description:
      "Browse our collection of stunning wedding photography, capturing the most beautiful moments of your special day.",
    url: "https://skylimitvisuals.com/wedding-photography",
  },
};

export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
