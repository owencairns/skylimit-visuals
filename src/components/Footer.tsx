import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-brand-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src="/img/logos/slv-logo-icon.webp" alt="Logo" width={32} height={32} />
            <span className="font-vogue text-2xl text-brand-blue">Sky Limit Visuals</span>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6">
            <Link href="https://facebook.com" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/facebook.svg" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="https://instagram.com" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="https://pinterest.com" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/pinterest.svg" alt="Pinterest" width={24} height={24} />
            </Link>
            <Link href="https://youtube.com" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/youtube.svg" alt="YouTube" width={24} height={24} />
            </Link>
          </div>

          {/* Location and Copyright */}
          <div className="text-center text-brand-blue/80 text-sm">
            <p>Based in Grand Rapids, Michigan | Available for Travel</p>
            <p className="mt-2">© {new Date().getFullYear()} Sky Limit Visuals</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 