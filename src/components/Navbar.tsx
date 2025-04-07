"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Handle pathname changes
  useEffect(() => {
    const onHomePage = pathname === '/';
    setIsHomePage(onHomePage);
  }, [pathname]);
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Consider "scrolled" when user has scrolled down 50px or more
      const isScrolled = window.scrollY > 50;
      
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Error signing out:', error);
    }
  };
  
  // Determine link size classes based on scroll position and page
  const linkSizeClasses = (!scrolled && isHomePage) 
    ? 'text-base lg:text-xl' // Bigger when at top of home page
    : 'text-lg lg:text-base'; // Smaller when scrolled or on other pages
  
  // Determine link color classes based on scroll position and page
  const linkColorClass = (!scrolled && isHomePage)
    ? 'text-white' // White text when navbar is transparent
    : '';
  
  return (
    <>
      <nav className={`w-full fixed top-0 z-[100] transition-all duration-300 font-serif ${
        scrolled 
          ? 'bg-primary backdrop-blur-sm shadow-md' 
          : isHomePage 
            ? 'bg-transparent' 
            : 'bg-primary backdrop-blur-sm'
      }`}>
        <div className="mx-auto px-0 sm:px-2">
          {/* Grid layout with three columns */}
          <div className={`grid grid-cols-3 items-center transition-all duration-300 ${scrolled || !isHomePage ? 'h-16' : 'h-20'}`}>
            {/* Left column - Logo */}
            <div className="flex items-center pl-4 sm:pl-6 lg:pl-8">
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/img/logos/slv-logo-icon.webp" 
                  alt="Sky Limit Visuals Logo" 
                  width={65}  
                  height={65} 
                  className={`rounded-full transition-transform duration-300 ${scrolled || !isHomePage ? 'scale-90' : 'scale-100'}`}
                />
              </Link>
              
              {/* Logo for medium screens (hidden on 2xl and up) */}
              <div className="hidden md:flex 2xl:hidden ml-3 items-center">
                <Image 
                  src="/img/logos/skylimit-oneline.svg" 
                  alt="Sky Limit Visuals" 
                  width={180}  
                  height={30}
                  className={`transition-opacity duration-300 ${(!isHomePage || scrolled) ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
              
              {/* Logo for mobile screens - moved to center column */}
            </div>
            
            {/* Center column - Logo with fade animation */}
            <div className="flex justify-center items-center">
              {/* Mobile logo (centered) */}
              <div className="md:hidden">
                <Image 
                  src="/img/logos/skylimit-oneline.svg" 
                  alt="Sky Limit Visuals" 
                  width={200}  
                  height={35}
                  className={`transition-opacity duration-300 ${(!isHomePage || scrolled) ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
              {/* Desktop centered logo (only on screens larger than 1400px) */}
              <div className="hidden 2xl:block">
                <Image 
                  src="/img/logos/skylimit-oneline.svg" 
                  alt="Sky Limit Visuals" 
                  width={240}  
                  height={35}
                  className={`transition-opacity duration-300 ${(!isHomePage || scrolled) ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            </div>
            
            {/* Right column - Navigation Links */}
            <div className="hidden md:flex items-center justify-end space-x-2 lg:space-x-4 pr-4 sm:pr-6 lg:pr-8">
              <Link 
                href="/" 
                className={`${pathname === '/' ? 'text-secondary' : linkColorClass || 'text-white'} hover:text-secondary transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
              >
                Home
              </Link>
              <Link 
                href="/films" 
                className={`${pathname === '/films' ? 'text-secondary' : linkColorClass || 'text-white'} hover:text-secondary transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
              >
                Films
              </Link>
              <Link 
                href="/photos" 
                className={`${pathname === '/photos' ? 'text-secondary' : linkColorClass || 'text-white'} hover:text-secondary transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
              >
                Photos
              </Link>
              <Link 
                href="/investment" 
                className={`${pathname === '/investment' ? 'text-secondary' : linkColorClass || 'text-white'} hover:text-secondary transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
              >
                Investment
              </Link>
              <Link 
                href="/about" 
                className={`${pathname === '/about' ? 'text-secondary' : linkColorClass || 'text-white'} hover:text-secondary transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
              >
                About
              </Link>
              {user ? (
                <button 
                  onClick={handleSignOut}
                  className={`${!scrolled && isHomePage ? 'bg-white/90 hover:bg-white' : 'bg-white hover:bg-secondary'} text-primary px-3 py-2 rounded transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
                >
                  Sign Out
                </button>
              ) : (
                <Link 
                  href="/contact" 
                  className={`${!scrolled && isHomePage ? 'bg-white/90 hover:bg-white' : 'bg-white hover:bg-secondary'} text-primary px-3 py-2 rounded transition-all duration-300 whitespace-nowrap ${linkSizeClasses}`}
                >
                  Contact
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex justify-end pr-4 sm:pr-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-secondary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
} 