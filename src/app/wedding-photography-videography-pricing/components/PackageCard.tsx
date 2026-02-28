import Image from 'next/image';
import Link from 'next/link';
import { Package } from '@/types/package';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const { title, subtitle, description, imageUrl, price, features } = pkg;

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl || '/images/placeholder-package.jpg'}
          alt={`${title} package`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Title & Price */}
        <div className="mb-4">
          <h3 className="text-2xl font-medium text-brand-blue">{title}</h3>
          {subtitle && (
            <p className="text-sm uppercase tracking-wider text-gray-500 mt-1">{subtitle}</p>
          )}
          <div className="text-2xl font-medium text-brand-blue mt-2">{price}</div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">{description}</p>
        
        {/* Features */}
        <div className="flex-1 mb-6">
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
        
        {/* CTA Button */}
        <Link 
          href="/contact" 
          className="block w-full text-center bg-brand-blue text-white px-6 py-3 rounded-md hover:bg-brand-blue/90 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
} 