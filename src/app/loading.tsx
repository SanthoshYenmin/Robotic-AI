export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Abstract Core Pulse */}
        <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mb-8 relative">
           <div className="w-2 h-2 bg-[#00f0ff] rounded-full animate-ping absolute"></div>
           <div className="w-2 h-2 bg-[#00f0ff] rounded-full"></div>
        </div>
        
        {/* Typography */}
        <div className="text-center">
          <span className="text-[#00f0ff] font-mono text-xs uppercase tracking-[0.3em] block mb-2">System Init</span>
          <h2 className="text-white text-sm font-light uppercase tracking-widest">Loading Hardware</h2>
        </div>
        
        {/* Loading Bar */}
        <div className="mt-8 w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#00f0ff] w-full origin-left animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
