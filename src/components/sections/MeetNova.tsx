"use client";

import RevealText from "@/components/animations/RevealText";

export default function MeetNova() {
  const specs = [
    { label: "HEIGHT", value: "178 CM" },
    { label: "PAYLOAD", value: "25 KG" },
    { label: "RUNTIME", value: "8 HRS" },
    { label: "DOF", value: "52" },
  ];

  return (
    <section className="py-32 md:py-48 bg-transparent relative border-t border-white/5 pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24 pointer-events-auto">
        {/* Text Content */}
        <div className="flex-1">
          <RevealText>
            <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tight mb-8">
              Meet Nova.
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-2xl text-gray-400 font-light mb-16 max-w-lg">
              A general-purpose humanoid built for the real world.
            </p>
          </RevealText>

          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {specs.map((spec, index) => (
              <RevealText key={spec.label} delay={0.3 + index * 0.1}>
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-600">
                    {spec.label}
                  </span>
                  <span className="text-3xl md:text-4xl font-light font-mono text-white">
                    {spec.value}
                  </span>
                </div>
              </RevealText>
            ))}
          </div>
        </div>

        {/* Visual / 3D Target Area */}
        <div className="flex-1 min-h-[600px] relative flex items-center justify-center pointer-events-none">
          {/* This area is left empty because the GlobalCanvas 3D robot will be positioned here by GSAP */}
        </div>
      </div>
    </section>
  );
}
