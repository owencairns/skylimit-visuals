import Link from 'next/link';
import Image from 'next/image';
import EditableFirebaseText from '@/components/TextEdit/EditableFirebaseText';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary bg-opacity-50 backdrop-blur-sm border-t border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src="/img/logos/slv-logo-icon.webp" alt="Logo" width={32} height={32} />
            <EditableFirebaseText
              collection="text-content"
              document="footer"
              field="logo-text"
              defaultText="Sky Limit Visuals"
              className="font-vogue text-2xl text-brand-blue"
            />
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6">
            <Link href="https://www.facebook.com/Skylimitvisuals/" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/facebook.svg" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="https://www.instagram.com/skylimitvisuals/" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/instagram.svg" alt="Instagram" width={24} height={24} />
            </Link>

            <Link href="https://www.youtube.com/@skylimitvisuals" className="text-brand-blue/80 hover:text-brand-blue">
              <Image src="/social/youtube.svg" alt="YouTube" width={24} height={24} />
            </Link>
          </div>

          {/* Location and Copyright */}
          <div className="text-center text-brand-blue/80 text-sm">
            <EditableFirebaseText
              collection="text-content"
              document="footer"
              field="location"
              defaultText="Based in Grand Rapids, Michigan | Available for Travel"
              className="text-brand-blue/80"
            />
            <EditableFirebaseText
              collection="text-content"
              document="footer"
              field="copyright"
              defaultText={`© ${new Date().getFullYear()} Sky Limit Visuals`}
              className="mt-2 text-brand-blue/80"
            />
          </div>
        </div>
      </div>
    </footer>
  );
} 