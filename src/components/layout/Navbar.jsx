import { motion } from "framer-motion";
import { CloudSun, Moon, Sun } from "lucide-react";

export default function Navbar({ mode, onToggleMode }) {
  const isDark = mode === "dark";

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`sunrise-glow glass-panel ${isDark ? "glass-panel-dark" : ""} flex items-center justify-between gap-4 rounded-[2rem] px-5 py-4 md:px-6 md:py-5`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F57C00] via-[#FF9A3C] to-[#FFD36B] shadow-[0_18px_40px_rgba(245,124,0,0.28)]">
          <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md" />
          <CloudSun className="relative h-7 w-7 text-[#fff8e5]" />
        </div>

        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.32em] ${isDark ? "text-[#ffdca1]" : "text-[#8B5A00]"}`}>
            Sunrise Weather
          </p>
          <h1 className={`text-2xl font-extrabold md:text-3xl ${isDark ? "text-[#fff3cf]" : "text-[#3D2200]"}`}>
            Weather, elevated.
          </h1>
          <p className={`text-sm ${isDark ? "text-[#f5d8a0]/80" : "text-[#6B3E00]"}`}>
            A premium live forecast for every hour of the day.
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onToggleMode}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`sunrise-focus inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition-colors md:px-5 ${isDark ? "border-white/15 bg-white/8 text-[#fff0cc]" : "border-white/50 bg-white/55 text-[#3D2200]"}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? "bg-[#FFB347]/16" : "bg-[#fff2c7]"}`}>
          {isDark ? <Sun className="h-5 w-5 text-[#ffd36b]" /> : <Moon className="h-5 w-5 text-[#8B5A00]" />}
        </span>
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </motion.button>
    </motion.header>
  );
}
