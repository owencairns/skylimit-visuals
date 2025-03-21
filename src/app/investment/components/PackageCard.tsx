import Image from 'next/image';
import Link from 'next/link';

export type PackageFeature = {
  text: string;
  note?: string;
};

export type PackageType = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  features: PackageFeature[];
};

interface PackageCardProps {
  package: PackageType;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const { title, subtitle, imageUrl, features } = pkg;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-square mb-6 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${title} package`}
          fill
          className="object-cover"
        />
      </div>
      
      <h3 className="text-2xl font-medium text-center mb-1">{title}</h3>
      <p className="text-sm uppercase tracking-wider text-center mb-6">{subtitle}</p>
      
      <ul className="space-y-3 text-center mb-8">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-700">
            {feature.text}
            {feature.note && (
              <span className="block text-xs text-gray-500 mt-1 italic">
                {feature.note}
              </span>
            )}
          </li>
        ))}
      </ul>
      
      <Link 
        href="/contact" 
        className="inline-block border border-black px-6 py-2 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors"
      >
        Book Now
      </Link>
    </div>
  );
} 