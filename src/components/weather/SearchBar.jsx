import { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, MapPin, Search } from "lucide-react";

export default function SearchBar({ onSearch, onUseMyLocation, loading }) {
  const [city, setCity] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [ripples, setRipples] = useState([]);
  const reduceMotion = useReducedMotion();
  const rippleIdRef = useRef(0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch(city.trim());
  }

  const addRipple = useCallback((e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleIdRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, [reduceMotion]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      className="sunrise-glow glass-panel mt-8 rounded-[2rem] p-4 md:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B5A00]" />

          {/* Animated focus glow ring */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[1.5rem]"
            animate={
              isFocused
                ? { boxShadow: "0 0 0 4px rgba(245,124,0,0.15), 0 0 20px rgba(245,124,0,0.08)" }
                : { boxShadow: "0 0 0 0px rgba(245,124,0,0), 0 0 0px rgba(245,124,0,0)" }
            }
            transition={{ duration: 0.3 }}
          />

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for a city"
            aria-label="Search for a city"
            className="sunrise-focus h-16 w-full rounded-[1.5rem] border border-white/55 bg-white/55 pl-14 pr-5 text-[16px] font-semibold text-[#3D2200] placeholder:text-[#8B5A00]/70 shadow-[0_14px_40px_rgba(134,73,0,0.1)] backdrop-blur-2xl transition-all duration-300 focus:border-[#f57c00]/40 focus:bg-white/65"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:auto-cols-max lg:grid-flow-col">
          {/* Search button with ripple */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={reduceMotion ? {} : { scale: 1.02, y: -1 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            onClick={addRipple}
            className="sunrise-focus relative inline-flex h-16 items-center justify-center gap-2 overflow-hidden rounded-[1.4rem] bg-gradient-to-r from-[#F57C00] to-[#FF9A3C] px-7 font-semibold text-white shadow-[0_18px_40px_rgba(245,124,0,0.28)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Ripple effects */}
            {ripples.map((r) => (
              <span
                key={r.id}
                className="pointer-events-none absolute rounded-full bg-white/30"
                style={{
                  left: r.x - 5,
                  top: r.y - 5,
                  width: 10,
                  height: 10,
                  animation: "ripple 0.6s ease-out forwards",
                }}
              />
            ))}

            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-5 w-5" />
              </motion.span>
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span>{loading ? "Searching" : "Search"}</span>
          </motion.button>

          {/* Location button with ripple */}
          <motion.button
            type="button"
            onClick={(e) => {
              addRipple(e);
              onUseMyLocation();
            }}
            disabled={loading}
            whileHover={reduceMotion ? {} : { scale: 1.02, y: -1 }}
            whileTap={reduceMotion ? {} : { scale: 0.97 }}
            className="sunrise-focus relative inline-flex h-16 items-center justify-center gap-2 overflow-hidden rounded-[1.4rem] border border-white/55 bg-white/48 px-6 font-semibold text-[#3D2200] shadow-[0_14px_40px_rgba(134,73,0,0.08)] backdrop-blur-2xl transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className="pointer-events-none absolute rounded-full bg-[#F57C00]/20"
                style={{
                  left: r.x - 5,
                  top: r.y - 5,
                  width: 10,
                  height: 10,
                  animation: "ripple 0.6s ease-out forwards",
                }}
              />
            ))}

            <MapPin className="h-5 w-5 text-[#F57C00]" />
            Current Location
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
