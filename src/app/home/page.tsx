'use client';

import Link from 'next/link';
import TestimonialCarousel from './components/TestimonialCarousel';
import EditableFirebaseImage from '@/components/ImageUpload/EditableFirebaseImage';
import EditableFirebaseText from '@/components/TextEdit/EditableFirebaseText';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="w-full h-full relative">
              {/* Firebase Hero Image */}
              <EditableFirebaseImage 
                id="hero-main"
                className="w-full h-full object-cover"
                priority={true}
                alt="Sky Limit Visuals Hero Image"
                videoControls={false}
                videoAutoPlay={true}
                videoMuted={true}
                videoLoop={true}
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full text-white">
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="hero-title-1"
            defaultText="SKY LIMIT"
            className="text-7xl md:text-9xl font-vogue tracking-wider text-center mb-4"
            as="h1"
          />
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="hero-title-2"
            defaultText="VISUALS"
            className="text-6xl md:text-8xl font-vogue tracking-wider text-center"
            as="h2"
          />
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="bg-brand-blue py-16">
        <div className="max-w-4xl mx-auto text-center">
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="what-we-offer-title"
            defaultText="What We Offer"
            className="text-3xl md:text-4xl text-white font-serif"
            as="h2"
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="sub-hero-paragraph"
            defaultText="Out of eight billion people in the world, you chose to be with one. And they chose to be with you, so the adventure begins. We are Los Angeles wedding videographers and we want to learn your story. How you met. Your favorite memory together. We want to create a film that will capture exactly who you are and will keep the memories of your big day forever!"
            className="text-lg md:text-xl text-brand-blue/80 leading-relaxed"
          />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Films */}
            <div className="relative h-[500px] group overflow-hidden">
              <div className="absolute inset-0">
                {/* Firebase Services Image */}
                <EditableFirebaseImage 
                  id="services-1"
                  className="w-full h-full object-cover"
                  alt="Wedding Films"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-5xl font-serif mb-4">Films</h3>
                <p className="text-xl uppercase tracking-widest">BROWSE</p>
                <Link href="/films" className="absolute inset-0 z-10">
                  <span className="sr-only">View Films</span>
                </Link>
              </div>
            </div>

            {/* Investment */}
            <div className="relative h-[500px] group overflow-hidden">
              <div className="absolute inset-0">
                {/* Firebase Services Image */}
                <EditableFirebaseImage 
                  id="services-2"
                  className="w-full h-full object-cover"
                  alt="Investment Options"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-5xl font-serif mb-4">Investment</h3>
                <p className="text-xl uppercase tracking-widest">EXPLORE</p>
                <Link href="/investment" className="absolute inset-0 z-10">
                  <span className="sr-only">View Investment Options</span>
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="relative h-[500px] group overflow-hidden">
              <div className="absolute inset-0">
                {/* Firebase Services Image */}
                <EditableFirebaseImage 
                  id="services-3"
                  className="w-full h-full object-cover"
                  alt="Contact Us"
                />
              </div>
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/50"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-5xl font-serif mb-4">Contact</h3>
                <p className="text-xl uppercase tracking-widest">GET IN TOUCH</p>
                <Link href="/contact" className="absolute inset-0 z-10">
                  <span className="sr-only">Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="testimonials-title"
            defaultText="What Our Clients Say"
            className="text-4xl md:text-5xl font-serif text-center mb-12 text-brand-blue"
            as="h2"
          />
          <TestimonialCarousel />
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <EditableFirebaseText
            collection="text-content"
            document="home"
            field="team-title"
            defaultText="Lifelong Friends"
            className="text-4xl md:text-5xl font-serif text-brand-blue text-center mb-16"
            as="h2"
          />
          
          {/* About Us with Single Image and Paragraph */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              {/* Team Image */}
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <EditableFirebaseImage 
                  id="team-main"
                  className="w-full h-full object-cover"
                  alt="Sky Limit Visuals Team"
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <EditableFirebaseText
                collection="text-content"
                document="home"
                field="team-paragraph"
                defaultText="We are Noah and Reagan, the creative minds behind Sky Limit Visuals. With our combined experience of over a decade in videography and photography, we've dedicated ourselves to capturing life's most precious moments. Our passion for storytelling drives us to create films that not only document events but also convey the emotions and connections that make each celebration unique."
                className="text-lg text-brand-blue/80 leading-relaxed mb-6"
              />
              <Link href="/about" className="inline-block px-6 py-2 border-2 border-brand-blue rounded-full text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300">
                <EditableFirebaseText
                  collection="text-content"
                  document="home"
                  field="team-button-text"
                  defaultText="Learn More About Us"
                  className=""
                  as="span"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 