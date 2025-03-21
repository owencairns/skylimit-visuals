import PackageCard, { PackageType } from './PackageCard';
import { packages } from '../data/packages';

export default function PackagesSection() {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-medium text-center mb-12">VIDEOGRAPHY PACKAGES</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {packages.map((pkg: PackageType) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>
    </div>
  );
} 