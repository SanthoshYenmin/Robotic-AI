"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FigurePage() {
  return (
    <main className="bg-white text-black min-h-screen w-full">
      {/* Top Navbar Shadow */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-50 pointer-events-none" />

      {/* Spacer below Navbar */}
      <div className="w-full h-32 md:h-40"></div>

      {/* MAIN SECTION - image and text side by side, image strictly clipped */}
      <div className="w-full flex flex-col md:flex-row items-stretch">

        {/* Left: Image clipped strictly within its half */}
        <div className="w-full md:w-1/2 overflow-hidden flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/images/human-form-module-figure-3-image-v3.webp"
              alt="Figure 03 Full Body"
              width={1000}
              height={3000}
              className="w-[160%] max-w-none h-auto object-contain object-left-top"
              priority
            />
          </motion.div>
        </div>

        {/* Right: All text within the same height as the image */}
        <div className="w-full md:w-1/2 flex flex-col justify-between pl-8 pr-12 md:pl-10 md:pr-20 lg:pl-12 lg:pr-28 py-8">

          {/* Top: Title + Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-[15vh] md:mt-[20vh]"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tighter leading-none mb-6 uppercase">
              Figure 03
            </h1>
            <p className="text-black/80 text-base md:text-lg lg:text-xl font-light leading-snug tracking-tight max-w-lg">
              Figure takes care of household tasks like laundry, cleaning, and doing dishes, all autonomously.
            </p>
          </motion.div>

          {/* Middle: Specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="w-full my-16 md:my-24 -ml-8 md:-ml-10 lg:-ml-12 pr-0"
          >
            <div className="border-b border-black/20 py-6 md:py-8 flex flex-col items-end w-full">
              <span className="text-black/50 text-sm md:text-base font-semibold uppercase tracking-widest mb-1">Height</span>
              <span className="text-5xl md:text-6xl font-light tracking-tighter">5'8"</span>
            </div>
            <div className="border-b border-black/20 py-6 md:py-8 flex flex-col items-end w-full">
              <span className="text-black/50 text-sm md:text-base font-semibold uppercase tracking-widest mb-1">Payload</span>
              <span className="text-5xl md:text-6xl font-light tracking-tighter">20KG</span>
            </div>
            <div className="border-b border-black/20 py-6 md:py-8 flex flex-col items-end w-full">
              <span className="text-black/50 text-sm md:text-base font-semibold uppercase tracking-widest mb-1">Weight</span>
              <span className="text-5xl md:text-6xl font-light tracking-tighter">61KG</span>
            </div>
            <div className="border-b border-black/20 py-6 md:py-8 flex flex-col items-end w-full">
              <span className="text-black/50 text-sm md:text-base font-semibold uppercase tracking-widest mb-1">Runtime</span>
              <span className="text-5xl md:text-6xl font-light tracking-tighter">5HR</span>
            </div>
            <div className="border-b border-black/20 py-6 md:py-8 flex flex-col items-end w-full">
              <span className="text-black/50 text-sm md:text-base font-semibold uppercase tracking-widest mb-1">Speed</span>
              <span className="text-5xl md:text-6xl font-light tracking-tighter">1.2M/S</span>
            </div>
          </motion.div>

          {/* Bottom: CTA - stays within the right column, same height as robot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="pb-16 md:pb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4 uppercase">
              Interact with Figure like you would with a human
            </h2>
            <p className="text-black/80 text-base md:text-lg font-light leading-snug">
              Talk, ask, or delegate. Figure understands and takes action.
            </p>
          </motion.div>

        </div>
      </div>

      {/* VIDEOS SECTION - after the robot image */}
      <div className="w-full bg-white py-8 md:py-16 space-y-8 md:space-y-12 px-4 md:px-0">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="w-full relative"
        >
          <video
            src="/videos/figure-03-01.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
          {/* Overlay Text - bottom right like the screenshot */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 max-w-xs md:max-w-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-3">
              Figure is always evolving
            </h2>
            <p className="text-white text-sm md:text-base font-semibold leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              After meaningful progress in the workforce, Figure is now moving into the home, a more complex environment where Helix, our AI, enables it to learn and adapt to everyday life.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="w-full relative"
        >
          <video
            src="/videos/figure-03-02.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
          {/* Overlay Text - bottom left */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16 max-w-xs md:max-w-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-3">
              Made to move through our world
            </h2>
            <p className="text-white text-sm md:text-base font-semibold leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              Engineered for real homes, Figure navigates stairs, tight corners, and shifting layouts with ease.
            </p>
          </div>
        </motion.div>

      </div>

    </main>
  );
}