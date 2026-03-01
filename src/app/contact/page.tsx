"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPhone, FiMail, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi';
import { InlineWidget } from 'react-calendly';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      sessionStorage.setItem('contactFormSubmitted', 'true');
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-stone-50">
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
                prefill={{
                  email: formData.email,
                  name: formData.name,
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
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-blue/80 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-brand-blue/50" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-transparent"
                      placeholder="John & Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-blue/80 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-brand-blue/50" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-brand-blue/80 mb-1">
                    Service Interested In
                  </label>
                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="Wedding Film">Wedding Film</option>
                      <option value="Engagement Session">Engagement Session</option>
                      <option value="Elopement">Elopement</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-brand-blue/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-brand-blue/80 mb-1">
                    Event Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-brand-blue/50" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-blue/80 mb-1">
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FiMessageSquare className="h-5 w-5 text-brand-blue/50" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-transparent"
                      placeholder="Tell us about your special day..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-200 ease-in-out flex justify-center"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
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
