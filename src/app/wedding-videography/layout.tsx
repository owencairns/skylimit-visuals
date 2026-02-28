import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Videography | Skylimit Visuals",
  description:
    "Explore our wedding videography portfolio. We craft cinematic wedding videos with authentic storytelling and timeless style, preserving every meaningful moment. Michigan wedding videographer.",
  openGraph: {
    title: "Wedding Videography | Skylimit Visuals",
    description:
      "Explore our wedding videography portfolio. Cinematic wedding videos with authentic storytelling and timeless style.",
    url: "https://skylimitvisuals.com/wedding-videography",
  },
};

export default function FilmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
