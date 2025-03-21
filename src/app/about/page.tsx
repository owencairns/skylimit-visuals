'use client';

import EditableFirebaseImage from '@/components/ImageUpload/EditableFirebaseImage';
import EditableFirebaseText from '@/components/TextEdit/EditableFirebaseText';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <EditableFirebaseText
          collection="text-content"
          document="about"
          field="team-title"
          defaultText="Meet The Team"
          className="text-4xl md:text-5xl font-vogue mb-16 text-center"
          as="h2"
        />
        
        {/* Noah's Bio */}
        <div className="flex flex-col md:flex-row gap-8 mb-20">
          <div className="md:w-2/5">
            <div className="aspect-square bg-gray-200 relative rounded-lg overflow-hidden">
              <EditableFirebaseImage 
                id="noah-portrait"
                className="w-full h-full object-cover"
                alt="Noah Ike"
                priority={true}
                width={1000}
                height={1000}
              />
            </div>
          </div>
          
          <div className="md:w-3/5">
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="noah-name"
              defaultText="Noah Ike"
              className="text-3xl md:text-4xl font-serif text-brand-blue mb-2"
              as="h3"
            />
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="noah-title"
              defaultText="Co-Owner"
              className="text-xl text-brand-blue/70 mb-6"
              as="p"
            />
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="noah-bio"
              defaultText="Hey, I'm Noah! A passionate filmmaker and photographer in my final year at Grand Valley State University, pursuing a bachelor's degree in Film and Video. With over 5 years of professional experience, I thrive on capturing captivating visuals that tell compelling stories. From initial planning to final post-production, I absolutely love bringing ideas and visions to life by putting all the pieces together."
              className="text-lg text-brand-blue/80 leading-relaxed"
            />
          </div>
        </div>
        
        {/* Reagan's Bio */}
        <div className="flex flex-col md:flex-row-reverse gap-8">
          <div className="md:w-2/5">
            <div className="aspect-square bg-gray-200 relative rounded-lg overflow-hidden">
              <EditableFirebaseImage 
                id="reagan-portrait"
                className="w-full h-full object-cover"
                alt="Reagan Berce"
                priority={true}
                width={1000}
                height={1000}
              />
            </div>
          </div>
          
          <div className="md:w-3/5">
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="reagan-name"
              defaultText="Reagan Berce"
              className="text-3xl md:text-4xl font-serif text-brand-blue mb-2"
              as="h3"
            />
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="reagan-title"
              defaultText="Co-Owner"
              className="text-xl text-brand-blue/70 mb-6"
              as="p"
            />
            <EditableFirebaseText
              collection="text-content"
              document="about"
              field="reagan-bio"
              defaultText="Hello! I'm Reagan, a seasoned videographer and photographer. I've been in the industry for over seven years, focusing on bringing the most significant moments to life. My goal is to tell stories, capture those important moments, and make the process effortless for our clients."
              className="text-lg text-brand-blue/80 leading-relaxed"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
