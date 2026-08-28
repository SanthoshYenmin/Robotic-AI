export default function Badge3D({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center justify-center px-8 py-3 mb-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00f0ff] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
        {text}
      </span>
    </div>
  );
}
