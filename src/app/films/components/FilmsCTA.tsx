import Link from 'next/link';
import EditableFirebaseText from '@/components/TextEdit/EditableFirebaseText';

export default function FilmsCTA() {
  return (
    <div className="bg-stone-200 py-12 px-4 sm:px-6 lg:px-8 mt-16 mb-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium mb-4">
            <EditableFirebaseText
              collection="text-content"
              document="films"
              field="cta-heading"
              defaultText="ARE YOU PASSIONATE ABOUT WEDDING FILMS AS US?"
              className="inline"
            />
          </h2>
          <EditableFirebaseText
            collection="text-content"
            document="films"
            field="cta-subheading"
            defaultText="Let's create a beautiful wedding film that captures the essence of your special day."
            className="text-gray-700 mb-6 md:mb-0 block"
          />
        </div>
        <div className="text-center md:text-right">
          <div className="mb-4">
            <EditableFirebaseText
              collection="text-content"
              document="films"
              field="cta-description"
              defaultText="Then let's chat about your wedding film that will keep the memories of your big day forever!"
              className="text-lg block"
            />
          </div>
          <Link 
            href="/contact" 
            className="inline-block bg-black text-white px-6 py-3 uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors"
          >
            <EditableFirebaseText
              collection="text-content"
              document="films"
              field="cta-button"
              defaultText="Get A Quote"
              className="inline"
            />
          </Link>
        </div>
      </div>
    </div>
  );
} 