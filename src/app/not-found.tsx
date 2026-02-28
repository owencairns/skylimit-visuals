import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl md:text-8xl font-serif text-brand-blue mb-4">404</h1>
        <p className="text-xl md:text-2xl text-brand-blue/80 mb-2">Page Not Found</p>
        <p className="text-brand-blue/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-brand-blue text-white px-8 py-3 rounded-md hover:bg-brand-blue/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-block border border-brand-blue text-brand-blue px-8 py-3 rounded-md hover:bg-brand-blue hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
