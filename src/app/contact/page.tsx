"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiPhone, FiMail } from 'react-icons/fi';
import { InlineWidget } from 'react-calendly';
import Script from 'next/script';

export default function ContactPage() {
  const router = useRouter();
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for HubSpot form submission to redirect to thank-you page
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'hsFormCallback' &&
        event.data?.eventName === 'onFormSubmitted'
      ) {
        sessionStorage.setItem('contactFormSubmitted', 'true');
        router.push('/thank-you');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      <Script
        src="https://js-na2.hsforms.net/forms/embed/243672196.js"
        strategy="afterInteractive"
      />

      <div className="max-w-7xl mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-4">Get In Touch</h1>
          <p className="text-lg text-brand-blue/70 max-w-2xl mx-auto">
            Schedule a consultation or send us a message. We&apos;d love to hear about your special day.
          </p>
          <div className="w-24 h-px bg-brand-blue/30 mx-auto mt-6"></div>
        </div>

        {/* Calendly Section */}
        <div className="mb-24 -mx-4 sm:-mx-6 lg:-mx-8 bg-white shadow-lg border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="py-8 text-center">
              <h2 className="text-3xl font-serif text-brand-blue mb-3">Schedule a Consultation</h2>
              <p className="text-brand-blue/70">
                Book a time to discuss your vision and how we can create the perfect wedding film for your special day.
              </p>
            </div>
            <div className="calendly-inline-widget">
              <InlineWidget
                url="https://calendly.com/skylimitvisuals/follow-up-discussion"
                styles={{
                  height: '600px',
                  width: '100%',
                }}
                pageSettings={{
                  backgroundColor: 'ffffff',
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: '1e40af',
                  textColor: '1e3a8a'
                }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-8 py-3 bg-white text-lg font-medium text-brand-blue/70 rounded-full border border-gray-200 shadow-sm">
              OR
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* HubSpot Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-serif text-brand-blue mb-6">Send Us a Message</h2>
            <div
              ref={formContainerRef}
              className="hs-form-frame"
              data-region="na2"
              data-form-id="115f7d3d-7a34-4afc-adca-15d39582ea0d"
              data-portal-id="243672196"
            />
          </div>

          {/* Contact Information */}
          <div className="lg:pl-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
              <h2 className="text-3xl font-serif text-brand-blue mb-8">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <FiPhone className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-brand-blue">Phone</h3>
                    <p className="mt-1 text-brand-blue/70">
                      <a href="tel:6168059578" className="hover:text-brand-blue">616-805-9578</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <FiMail className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-brand-blue">Email</h3>
                    <p className="mt-1 text-brand-blue/70">
                      <a href="mailto:skylimitvisuals@gmail.com" className="hover:text-brand-blue">skylimitvisuals@gmail.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-serif text-brand-blue mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/Skylimitvisuals/" className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/skylimitvisuals/" className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/@skylimitvisuals" className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for Calendly */}
      <style jsx global>{`
        .calendly-inline-widget {
          font-family: inherit !important;
        }

        .calendly-inline-widget * {
          font-family: inherit !important;
        }

        /* Override Calendly's default styles */
        .calendly-inline-widget .calendarBox {
          border-radius: 0.75rem !important;
          border: 1px solid #f3f4f6 !important;
        }

        .calendly-inline-widget .button {
          border-radius: 0.5rem !important;
          transition: all 0.2s !important;
        }

        .calendly-inline-widget .button:hover {
          opacity: 0.9 !important;
        }

        /* Custom scrollbar for Webkit browsers */
        .calendly-inline-widget ::-webkit-scrollbar {
          width: 8px;
        }

        .calendly-inline-widget ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .calendly-inline-widget ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .calendly-inline-widget ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </main>
  );
}
