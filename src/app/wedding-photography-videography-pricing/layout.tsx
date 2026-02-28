import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Photography & Videography Pricing | Skylimit Visuals",
  description:
    "Wedding photography and videography pricing packages from Skylimit Visuals. Choose from carefully crafted packages designed to capture your special moments.",
  openGraph: {
    title: "Wedding Photography & Videography Pricing | Skylimit Visuals",
    description:
      "Wedding photography and videography pricing packages. Choose from carefully crafted packages designed to capture your special moments.",
    url: "https://skylimitvisuals.com/wedding-photography-videography-pricing",
  },
};

export default function InvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
