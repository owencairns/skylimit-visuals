import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Skylimit Visuals",
  description:
    "Meet Noah Ike and Reagan Berce, the creative team behind Skylimit Visuals. Michigan wedding videographers and photographers with over a decade of combined experience.",
  openGraph: {
    title: "About Us | Skylimit Visuals",
    description:
      "Meet Noah Ike and Reagan Berce, the creative team behind Skylimit Visuals. Michigan wedding videographers and photographers with over a decade of combined experience.",
    url: "https://skylimitvisuals.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
