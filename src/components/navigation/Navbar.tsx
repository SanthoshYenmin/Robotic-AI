"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Intelligence", href: "/intelligence" },
    { name: "Technology", href: "/technology" },
    { name: "Solutions", href: "/solutions" },
    { name: "Fleet", href: "/fleet" },
    { name: "Deployment", href: "/deployment" },
    { name: "Figure", href: "/figure" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4 bg-black/50 backdrop-blur-md border-b border-white/10" : "py-8 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Minimal Logo (Staggered Squares) */}
        <Link href="/" className="flex flex-col items-start gap-[2px] group relative w-5 h-8 justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <div className="w-2.5 h-2.5 bg-white rounded-[1px] ml-2.5 transition-transform duration-500 group-hover:scale-90 shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-white rounded-[1px] transition-transform duration-500 group-hover:scale-90 shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-white rounded-[1px] transition-transform duration-500 group-hover:scale-90 shadow-sm"></div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-[family-name:var(--font-sans)] font-semibold tracking-wider uppercase transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle (Removed Order Button) */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (Framer Motion) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5 py-8 px-6 flex flex-col gap-8 shadow-2xl"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-[0.2em] uppercase border-b border-white/5 pb-4 ${isActive ? 'text-[#00f0ff]' : 'text-gray-300'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="text-sm text-black bg-white px-6 py-4 text-center tracking-[0.2em] uppercase font-bold mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Order Nova
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
