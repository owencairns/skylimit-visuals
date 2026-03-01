import Link from 'next/link';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-3xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="flex justify-center mb-6">
            <FiCheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-4">
            Thank You!
          </h1>

          <p className="text-lg text-brand-blue/70 mb-8 max-w-md mx-auto">
            Your message has been sent successfully. We&apos;ll be in touch soon to discuss your special day.
          </p>

          <div className="w-24 h-px bg-brand-blue/30 mx-auto mb-8"></div>

          <p className="text-brand-blue/60 mb-8">
            In the meantime, feel free to explore our work or follow us on social media.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/wedding-videography"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors duration-200"
            >
              View Our Films
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
