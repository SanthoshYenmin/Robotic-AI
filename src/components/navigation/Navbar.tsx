"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("ABOUT");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Simple section tracking based on scroll position (for demo purposes)
      // Ideally, use IntersectionObserver for sections
      const sections = ["projects", "process", "technology", "systems", "about"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 300) {
          const names: Record<string, string> = {
            "about": "ABOUT",
            "systems": "SYSTEMS",
            "technology": "TECHNOLOGY",
            "process": "PROCESS",
            "projects": "PROJECTS"
          };
          setActiveMenu(names[section]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "FIGURE", href: "/figure" },
  ];

  const handleNavClick = (name: string, href: string) => {
    setActiveMenu(name);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes scanline {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-scanline {
          animation: scanline 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
      
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        style={{ padding: scrolled ? '1rem 0' : '1.5rem 0' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-[#050505]/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,240,255,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto spx flex items-center justify-between">
          {/* Left: ROBOTICS */}
          <Link href="/" className="font-mono text-base md:text-lg tracking-[0.3em] font-bold text-white relative group">
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-white group-hover:bg-[#00f0ff] transition-colors" />
              ROBOTICS
            </span>
          </Link>

          {/* Center: HUD Menu */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = activeMenu === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.name, link.href)}
                  className="group relative font-mono text-xs tracking-[0.25em] transition-colors duration-300 flex items-center gap-2"
                >
                  {/* Active Sensor Dot */}
                  <span 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive ? "bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" : "bg-white/20 group-hover:bg-[#00f0ff]/50"
                    }`} 
                  />
                  <span className={isActive ? "text-[#00f0ff]" : "text-white/60 group-hover:text-white"}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>



          {/* Mobile Toggle */}
          <button
            style={{ padding: '0.5rem' }}
            className="md:hidden text-[#00f0ff] flex items-center gap-2 font-mono text-xs tracking-widest hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "CLOSE [X]" : "MENU [=]"}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="md:hidden fixed top-[60px] left-0 right-0 bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 overflow-hidden z-40"
            >
              {navLinks.map((link) => {
                const isActive = activeMenu === link.name;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex flex-col items-center gap-4"
                    onClick={() => handleNavClick(link.name, link.href)}
                  >
                    <span 
                      className={`w-2 h-2 transition-all duration-300 ${
                        isActive ? "bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" : "bg-transparent border border-white/30"
                      }`} 
                    />
                    <span className={`text-sm md:text-base font-mono tracking-[0.3em] uppercase ${isActive ? 'text-[#00f0ff]' : 'text-gray-300'}`}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}

            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

