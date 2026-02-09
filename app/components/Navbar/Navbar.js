"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from './CUDA.svg'
import SearchBar from './Searchbar.js' 
import BookmarkBtn from "./BookmarkBtn";
import { useRef, useEffect, useState, Suspense } from "react"; 

export default function Navbar() {
  
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Auto-close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Scroll Visibility Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false); 
      } else {
        setIsVisible(true);  
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock Body Scroll
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
    <nav className={`
        Navbar px-site py-1.5 flex justify-between items-center font-body 
        fixed top-0 left-0 w-full bg-transparent
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 z-40' : 'opacity-0 -z-10'}
    `}>
      
      {/* LOGO */}
      <div className="shrink-0 relative z-50"> 
        <Link href="/">
          <img src={Logo.src} alt="CUDA LOGO" className="w-24 h-18"/> 
        </Link>
      </div>

      {/* SEARCH BAR */}
      <Suspense fallback={<div className="w-64 h-10 bg-gray-200 rounded-full" />}>
          <SearchBar/>
      </Suspense>

      {/* --- DESKTOP LINKS (Rectangle Buttons) --- */}
      <div className="hidden md:flex items-center gap-4 font-body">
        <BookmarkBtn />
        <Link href="/contact" className="px-4 py-1.5 rounded-lg transition-all duration-200 hover:bg-[#FFA443] hover:text-black"> 
            Contact 
        </Link>
        <Link href="/admin/dashboard" className="px-4 py-1.5 rounded-lg transition-all duration-200 hover:bg-[#FFA443] hover:text-black"> 
            Dashboard
        </Link>
      </div>

      {/* --- MOBILE HAMBURGER --- */}
      <button 
        className="md:hidden relative z-[60] p-2 text-black hover:bg-[#FFA443] rounded-md transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
            // CLOSE X
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ) : (
            // MENU LINES
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        )}
      </button>

    </nav>

    {/* --- MOBILE MENU OVERLAY --- */}
    <div className={`
        fixed inset-0 bg-[#fff8f0] z-50 flex flex-col items-center justify-center gap-10
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
        md:hidden
    `}>
        
        <div className="transform scale-[1.5] origin-center mb-4">
            <BookmarkBtn />
        </div>

        {/* HOME LINK acting as Close/Reset */}
        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading font-normal text-black hover:bg-[#FFA443] px-6 py-2 rounded-xl transition-colors">
            Home
        </Link>

        <Link href="/contact" className="text-3xl font-heading font-normal text-black hover:bg-[#FFA443] px-6 py-2 rounded-xl transition-colors">
            Contact
        </Link>
        <Link href="/admin/dashboard" className="text-3xl font-heading font-normal text-black hover:bg-[#FFA443] px-6 py-2 rounded-xl transition-colors">
            Dashboard
        </Link>

    </div>
    </>
  )
}