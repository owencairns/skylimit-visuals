import Image from 'next/image';
import Link from 'next/link';

export default function IntroSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src="/images/investment/bride-bouquet.jpg"
          alt="Bride holding bouquet"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-6">WEDDING VIDEOGRAPHY PACKAGES</h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Your wedding film is one of the tangible memories you get to keep from your big day. 
            Once you&apos;ve eaten the cake and your epic dances have ended, you&apos;ll be able to relive 
            these moments again through your wedding film. This film is a big deal! That&apos;s why it&apos;s 
            so important to hire a wedding videographer to film all the beautiful moments you 
            never want to forget.
          </p>
          
          <p>
            In order to provide our clients with the best service, we only commit to a limited 
            number of weddings each year. Our wedding videography package prices start at 
            $4000, with most clients investing between $4000 - $7000.
          </p>
          
          <p>
            If you&apos;re interested in the cost of a wedding videographer for an elopement, please send 
            us an email. Our elopement packages created based on the elopement&apos;s location. We 
            love to travel!
          </p>
          
          <p>
            We also offer <Link href="/live-stream" className="text-blue-600 hover:underline">Live Stream services</Link> for your special day. Please reach out for the quote.
          </p>
        </div>
      </div>
    </div>
  );
} 