import Image from 'next/image';
import Link from 'next/link';
import { Package } from '@/types/package';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const { title, subtitle, description, imageUrl, price, features } = pkg;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${title} package`}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-medium text-brand-blue mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">{subtitle}</p>
        )}
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="text-2xl font-medium text-brand-blue mb-6">{price}</div>
        
        <div className="flex-1">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-gray-700">{feature.text}</span>
                  {feature.note && (
                    <span className="block text-xs text-gray-500 mt-1 italic">
                      {feature.note}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <Link 
          href="/contact" 
          className="mt-6 inline-block w-full text-center bg-brand-blue text-white px-6 py-3 rounded-md hover:bg-brand-blue/90 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
} 