"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("01 ABOUT");
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
            "about": "01 ABOUT",
            "systems": "02 SYSTEMS",
            "technology": "03 TECHNOLOGY",
            "process": "04 PROCESS",
            "projects": "05 PROJECTS"
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
    { name: "01 ABOUT", href: "/about" },
    { name: "02 SYSTEMS", href: "/#systems" },
    { name: "03 TECHNOLOGY", href: "/#technology" },
    { name: "04 PROCESS", href: "/#process" },
    { name: "05 PROJECTS", href: "/#projects" },
    { name: "06 FIGURE", href: "/figure" },
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
        className={`fixed top-4 md:top-6 left-4 md:left-8 right-4 md:right-8 z-50 transition-all duration-700 rounded-2xl border ${
          scrolled
            ? "bg-[#020810]/80 backdrop-blur-xl border-[#00f0ff]/20 py-4 shadow-[0_8px_30px_rgba(0,240,255,0.05)]"
            : "bg-transparent border-transparent py-6"
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

          {/* Right: LET'S BUILD */}
          <Link 
            href="#build"
            className="hidden md:flex items-center gap-3 border border-[#00f0ff]/40 px-8 py-3 text-xs font-mono tracking-[0.3em] uppercase text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all duration-500 relative overflow-hidden group"
          >
            {/* Scanline hover animation */}
            <div className="absolute inset-0 w-[50%] bg-white/30 -translate-x-full group-hover:animate-scanline" />
            <span className="relative z-10 font-bold">LET'S BUILD &rarr;</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[#00f0ff] px-5 py-2.5 flex items-center gap-2 font-mono text-xs tracking-widest border border-white/20 bg-black/50"
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
              className="md:hidden fixed top-[70px] left-0 right-0 bg-[#020810]/95 backdrop-blur-2xl border-t border-[#00f0ff]/20 flex flex-col items-center justify-center gap-10 overflow-hidden z-40"
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
              <Link
                href="#build"
                className="mt-10 border border-[#00f0ff] text-[#00f0ff] px-12 py-5 text-sm md:text-base font-mono tracking-[0.4em] uppercase font-bold hover:bg-[#00f0ff] hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                LET'S BUILD &rarr;
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

