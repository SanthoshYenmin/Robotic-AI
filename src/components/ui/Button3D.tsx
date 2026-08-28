export default function Button3D({ text, onClick, className = "" }: { text: string; onClick?: () => void; className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-4 px-12 py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] ${className}`}
    >
      {/* Background & Hover Effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Border */}
      <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#00f0ff]/50 transition-colors duration-500"></div>
      
      {/* Text */}
      <span className="relative z-10 text-[13px] font-bold text-white uppercase tracking-[0.2em] group-hover:text-[#00f0ff] transition-colors duration-500">
        {text}
      </span>
      
      {/* Arrow Icon */}
      <svg className="w-5 h-5 relative z-10 text-white group-hover:text-[#00f0ff] group-hover:translate-x-2 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
}
