import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Skylimit Visuals",
  description:
    "Get in touch with Skylimit Visuals to discuss your wedding videography and photography needs. Schedule a consultation or send us a message.",
  openGraph: {
    title: "Contact Us | Skylimit Visuals",
    description:
      "Get in touch with Skylimit Visuals to discuss your wedding videography and photography needs. Schedule a consultation or send us a message.",
    url: "https://skylimitvisuals.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
