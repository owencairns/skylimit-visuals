import Link from 'next/link';

export default function FilmsCTA() {
  return (
    <div className="bg-stone-200 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium mb-4">
            ARE YOU PASSIONATE ABOUT WEDDING FILMS AS US?
          </h2>
          <p className="text-gray-700 mb-6 md:mb-0">
            Let&apos;s create a beautiful wedding film that captures the essence of your special day.
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="mb-4">
            <p className="text-lg">
              Then let&apos;s chat about your wedding film that will keep the memories of your big day forever!
            </p>
          </div>
          <Link 
            href="/contact" 
            className="inline-block bg-black text-white px-6 py-3 uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors"
          >
            Get A Quote
          </Link>
        </div>
      </div>
    </div>
  );
} 