import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sunrise-glow glass-panel mt-8 overflow-hidden rounded-[2rem] p-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F57C00] to-[#FFB347] text-white shadow-[0_18px_40px_rgba(245,124,0,0.26)] animate-sun-pulse">
          <CloudSun className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8B5A00]">Loading forecast</p>
          <p className="mt-1 text-xl font-black text-[#3D2200]">Preparing live weather layers</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.7rem] border border-white/45 bg-gradient-to-br from-white/60 via-white/40 to-[#fff0c4]/70 p-5 backdrop-blur-2xl">
          <div className="h-5 w-40 rounded-full bg-gradient-to-r from-[#f6d47b] via-[#ffeab5] to-[#f6d47b] animate-shimmer" />
          <div className="mt-4 h-24 rounded-[1.4rem] bg-gradient-to-r from-white/60 via-[#fff7dc] to-white/60 animate-shimmer" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 rounded-[1.2rem] bg-white/65 animate-shimmer" />
            <div className="h-16 rounded-[1.2rem] bg-white/65 animate-shimmer" />
            <div className="h-16 rounded-[1.2rem] bg-white/65 animate-shimmer" />
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-white/45 bg-white/55 p-5 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-white/80 via-[#fff4d1] to-white/70 animate-shimmer" />
            <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-white/80 via-[#fff4d1] to-white/70 animate-shimmer" />
            <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-white/80 via-[#fff4d1] to-white/70 animate-shimmer" />
            <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-white/80 via-[#fff4d1] to-white/70 animate-shimmer" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
