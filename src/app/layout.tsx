import type { Metadata } from "next";
import Script from "next/script";
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
    title: 'Skylimit Visuals - Professional Wedding Videography',
    description: 'Capture your special day with cinematic wedding films. Professional wedding videography services that tell your unique love story.',
    siteName: 'Skylimit Visuals',
    images: [
      {
        url: '/img/logos/slv-logo-icon.webp',
        width: 1200,
        height: 630,
        alt: 'Skylimit Visuals - Wedding Videography',
        type: 'image/webp',
      },
    ],
    countryName: 'United States',
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17901774533"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17901774533');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Skylimit Visuals",
              description:
                "Professional wedding videography and photography services in Michigan. Cinematic wedding films and stunning photography that tell your unique love story.",
              url: "https://skylimitvisuals.com",
              logo: "https://skylimitvisuals.com/img/logos/slv-logo-icon.webp",
              image: "https://skylimitvisuals.com/img/logos/slv-logo-icon.webp",
              telephone: "616-805-9578",
              email: "skylimitvisuals@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressRegion: "MI",
                addressCountry: "US",
              },
              areaServed: {
                "@type": "State",
                name: "Michigan",
              },
              sameAs: [
                "https://www.facebook.com/Skylimitvisuals/",
                "https://www.instagram.com/skylimitvisuals/",
                "https://www.youtube.com/@skylimitvisuals",
              ],
              priceRange: "$$",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Wedding Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Wedding Videography",
                      description:
                        "Cinematic wedding films with authentic storytelling and timeless style.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Wedding Photography",
                      description:
                        "Stunning wedding photography capturing the most beautiful moments of your special day.",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
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
