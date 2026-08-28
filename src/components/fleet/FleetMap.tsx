"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const facilities = [
  { id: "FAC-A", name: "FACTORY A", bots: 32, x: 20, y: 30, status: "NOMINAL", task: "ASSEMBLY", health: 98, battery: 74 },
  { id: "WH-B", name: "WAREHOUSE B", bots: 47, x: 70, y: 50, status: "NOMINAL", task: "SORTATION", health: 95, battery: 62 },
  { id: "LOG-C", name: "LOGISTICS C", bots: 28, x: 40, y: 70, status: "MAINTENANCE", task: "LOADING", health: 88, battery: 41 },
];

export default function FleetMap() {
  const [activeFacility, setActiveFacility] = useState(facilities[0]);

  return (
    <section className="h-[80vh] min-h-[600px] w-full bg-[#050505] relative overflow-hidden flex">
      {/* Interactive Map Area */}
      <div className="flex-[2] relative border-r border-white/5">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        
        {/* Animated Radar Sweep */}
        <motion.div 
          className="absolute inset-0 origin-center opacity-10"
          style={{ background: "conic-gradient(from 0deg, transparent 70%, #00f0ff 100%)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute inset-0 z-10 p-12">
          {facilities.map((fac) => (
            <div 
              key={fac.id}
              className="absolute group cursor-pointer"
              style={{ left: `${fac.x}%`, top: `${fac.y}%` }}
              onClick={() => setActiveFacility(fac)}
            >
              {/* Node Point */}
              <div className={`w-4 h-4 rounded-full relative z-10 transition-colors duration-300 flex items-center justify-center ${activeFacility.id === fac.id ? 'bg-[#00f0ff]' : 'bg-white/20 group-hover:bg-[#00f0ff]/50'}`}>
                 <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              
              {/* Pulse */}
              {activeFacility.id === fac.id && (
                <div className="absolute inset-0 bg-[#00f0ff] rounded-full animate-ping opacity-50"></div>
              )}

              {/* Label */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap">
                <span className={`font-mono text-xs font-bold uppercase tracking-widest block ${activeFacility.id === fac.id ? 'text-[#00f0ff]' : 'text-gray-500 group-hover:text-white'}`}>
                  {fac.name}
                </span>
                <span className="font-mono text-[10px] text-gray-600 block">{fac.bots} UNITS ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Dashboard */}
      <div className="flex-1 bg-[#0a0a0a] p-8 flex flex-col relative z-20">
        <h2 className="text-white font-mono text-xs uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
          Telemetry Data
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFacility.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest block mb-1">Target Sector</span>
              <h3 className="text-3xl text-white font-bold uppercase tracking-tight">{activeFacility.name}</h3>
              <div className="mt-2 inline-flex items-center gap-2 border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-2 py-1 rounded-sm">
                <div className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse"></div>
                <span className="text-[#00f0ff] font-mono text-[10px] uppercase tracking-widest">{activeFacility.bots} Active Units</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/5 bg-white/5 p-4 rounded-sm">
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest block mb-2">Fleet Health</span>
                <span className="text-2xl text-white font-mono">{activeFacility.health}%</span>
              </div>
              <div className="border border-white/5 bg-white/5 p-4 rounded-sm">
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest block mb-2">Avg Battery</span>
                <span className="text-2xl text-white font-mono">{activeFacility.battery}%</span>
              </div>
              <div className="border border-white/5 bg-white/5 p-4 rounded-sm col-span-2">
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest block mb-2">Primary Task</span>
                <span className="text-lg text-white font-mono">{activeFacility.task}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest block mb-2">Status Log</span>
              <div className="bg-black border border-white/10 p-4 font-mono text-[10px] text-gray-400 h-32 overflow-y-auto custom-scrollbar">
                <p className="mb-2"><span className="text-[#00f0ff]">[SYSTEM]</span> Connectivity nominal.</p>
                <p className="mb-2"><span className="text-[#00f0ff]">[SYSTEM]</span> Load balancing optimal.</p>
                <p className="mb-2"><span className="text-white">[FLEET]</span> {activeFacility.bots} units reporting for {activeFacility.task}.</p>
                <p className="mb-2"><span className="text-yellow-500">[ALERT]</span> Unit #42 charging requested.</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

