import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Skylimit Visuals",
  description: "Professional Wedding Videography Services",
  icons: {
    icon: "/img/logos/slv-logo-icon.webp",
  },
  metadataBase: new URL('https://skylimitvisuals.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skylimitvisuals.com',
    title: 'Skylimit Visuals',
    description: 'Professional Wedding Videography Services',
    siteName: 'Skylimit Visuals',
    images: [
      {
        url: '/img/logos/slv-logo-icon.webp',
        width: 1200,
        height: 630,
        alt: 'Skylimit Visuals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skylimit Visuals',
    description: 'Professional Wedding Videography Services',
    images: ['/img/logos/slv-logo-icon.webp'],
    creator: '@skylimitvisuals',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-white">{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
