import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sunrise,
  Sunset,
  ThermometerSun,
} from "lucide-react";
import {
  formatSunTime,
  formatTempInUnit,
  formatWeatherDateTime,
} from "../../utils/formatters";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon";

/* ─── Weather-reactive palette for the icon showcase ─── */

const ICON_PANEL_STYLES = {
  clear: {
    gradient: "from-[#FFF4D6]/80 via-[#FFE8B2]/75 to-[#FFD36B]/70",
    glow1: "bg-[#FFD36B]/70",
    glow2: "bg-white/50",
    glow3: "bg-[#FF9A3C]/45",
  },
  clouds: {
    gradient: "from-[#E8ECF0]/80 via-[#D8DEE6]/75 to-[#C8CED8]/70",
    glow1: "bg-[#B0BAC8]/50",
    glow2: "bg-white/40",
    glow3: "bg-[#94A3B8]/35",
  },
  rain: {
    gradient: "from-[#D0DDE8]/80 via-[#B8C8D8]/75 to-[#8BA4BE]/70",
    glow1: "bg-[#60A5FA]/40",
    glow2: "bg-[#93C5FD]/30",
    glow3: "bg-[#3B82F6]/25",
  },
  thunderstorm: {
    gradient: "from-[#64748B]/60 via-[#475569]/55 to-[#334155]/50",
    glow1: "bg-[#FBBF24]/30",
    glow2: "bg-[#94A3B8]/25",
    glow3: "bg-[#64748B]/30",
  },
  snow: {
    gradient: "from-[#EDF2F7]/80 via-[#E2E8F0]/75 to-[#CBD5E1]/70",
    glow1: "bg-[#BFE2FF]/50",
    glow2: "bg-white/50",
    glow3: "bg-[#D4E4FF]/40",
  },
  mist: {
    gradient: "from-[#E2E8EE]/75 via-[#D5DCE4]/70 to-[#C8D0DA]/65",
    glow1: "bg-[#94A3B8]/35",
    glow2: "bg-white/35",
    glow3: "bg-[#B0BAC8]/30",
  },
};

function getIconPanelStyle(weatherMain) {
  const m = (weatherMain || "").toLowerCase();
  if (m.includes("thunder")) return ICON_PANEL_STYLES.thunderstorm;
  if (m.includes("rain") || m.includes("drizzle")) return ICON_PANEL_STYLES.rain;
  if (m.includes("snow")) return ICON_PANEL_STYLES.snow;
  if (m.includes("cloud")) return ICON_PANEL_STYLES.clouds;
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return ICON_PANEL_STYLES.mist;
  return ICON_PANEL_STYLES.clear;
}

/* ─── Stagger animation variants ─── */

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const pillTransition = { duration: 0.35, ease: "easeOut" };

/* ─── Stat card sub-component ─── */

function StatCard({ icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="weather-glow-hover shimmer-sweep rounded-[1.4rem] border border-white/45 bg-white/40 px-4 py-4 backdrop-blur-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 text-[#8B5A00]">
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: delay + 0.1, type: "spring", stiffness: 200 }}
        >
          {icon}
        </motion.span>
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black text-[#3D2200]">{value}</p>
    </motion.div>
  );
}

export default function CurrentWeather({ weather, unit, onToggleUnit }) {
  if (!weather) return null;

  const reduceMotion = useReducedMotion();

  const iconCode = weather.weather?.[0]?.icon;
  const description = weather.weather?.[0]?.description;
  const weatherMain = weather.weather?.[0]?.main ?? "Clear";
  const isNight = iconCode?.endsWith("n") ?? false;
  const { date, time } = formatWeatherDateTime(weather.dt, weather.timezone ?? 0);
  const sunrise = formatSunTime(weather.sys?.sunrise, weather.timezone ?? 0);
  const sunset = formatSunTime(weather.sys?.sunset, weather.timezone ?? 0);

  const iconPanelStyle = getIconPanelStyle(weatherMain);

  const targetTemperature = useMemo(() => {
    const value = weather.main?.temp;
    if (typeof value !== "number") return "--";
    return unit === "F" ? Math.round((value * 9) / 5 + 32) : Math.round(value);
  }, [weather.main?.temp, unit]);

  const [displayTemperature, setDisplayTemperature] = useState(targetTemperature);

  useEffect(() => {
    if (typeof targetTemperature !== "number") {
      setDisplayTemperature(targetTemperature);
      return;
    }

    if (reduceMotion) {
      setDisplayTemperature(targetTemperature);
      return;
    }

    let frameId;
    const startTime = performance.now();
    const startValue = typeof displayTemperature === "number" ? displayTemperature : targetTemperature;
    const duration = 900;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (targetTemperature - startValue) * eased;
      setDisplayTemperature(Math.round(nextValue));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    }

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [targetTemperature, reduceMotion]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      className="mt-8 rounded-[2.25rem] border border-white/45 bg-gradient-to-br from-[#FFF4D6]/92 via-[#FFE8B2]/90 to-[#FFD36B]/84 p-5 shadow-[0_28px_80px_rgba(134,73,0,0.2)] backdrop-blur-3xl md:p-7"
      style={{ animation: reduceMotion ? "none" : "glowPulse 5s ease-in-out infinite" }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="relative z-10 space-y-5">
          {/* Info pills with stagger */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#8B5A00]"
          >
            <motion.span
              variants={pillVariants}
              transition={pillTransition}
              className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-xl"
            >
              <ThermometerSun className="h-4 w-4 text-[#F57C00]" />
              {weatherMain}
            </motion.span>
            <motion.span
              variants={pillVariants}
              transition={pillTransition}
              className="rounded-full border border-white/50 bg-white/45 px-4 py-2 backdrop-blur-xl"
            >
              {date}
            </motion.span>
            <motion.span
              variants={pillVariants}
              transition={pillTransition}
              className="rounded-full border border-white/50 bg-white/45 px-4 py-2 backdrop-blur-xl"
            >
              {time}
            </motion.span>
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base font-semibold uppercase tracking-[0.24em] text-[#6B3E00] md:text-lg"
            >
              {weather.name}
              {weather.sys?.country ? `, ${weather.sys.country}` : ""}
            </motion.p>

            <button
              type="button"
              onClick={onToggleUnit}
              title="Toggle temperature unit"
              className="sunrise-focus mt-2 inline-flex items-end gap-3 text-left transition-transform duration-300 hover:scale-[1.01]"
            >
              <motion.span
                key={`temp-${targetTemperature}-${unit}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[4.5rem] font-black leading-none tracking-[-0.08em] text-[#3D2200] md:text-[6.4rem] lg:text-[7.5rem]"
              >
                {typeof displayTemperature === "number" ? `${displayTemperature}°${unit}` : formatTempInUnit(weather.main?.temp, unit)}
              </motion.span>
              <span className="pb-4 text-base font-bold uppercase tracking-[0.36em] text-[#8B5A00] md:text-lg">
                tap to switch
              </span>
            </button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-2xl text-xl font-semibold capitalize text-[#6B3E00] md:text-[1.65rem]"
            >
              {description}
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#8B5A00] md:text-base"
            >
              <motion.span variants={pillVariants} transition={pillTransition} className="rounded-full border border-white/45 bg-white/45 px-4 py-2 backdrop-blur-xl">
                Feels like {formatTempInUnit(weather.main?.feels_like, unit)}
              </motion.span>
              <motion.span variants={pillVariants} transition={pillTransition} className="rounded-full border border-white/45 bg-white/45 px-4 py-2 backdrop-blur-xl">
                Humidity {weather.main?.humidity ?? "--"}%
              </motion.span>
              <motion.span variants={pillVariants} transition={pillTransition} className="rounded-full border border-white/45 bg-white/45 px-4 py-2 backdrop-blur-xl">
                Wind {Math.round(weather.wind?.speed ?? 0)} m/s
              </motion.span>
            </motion.div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Sunrise className="h-5 w-5 text-[#F57C00]" />}
              label="Sunrise"
              value={sunrise}
              delay={0.25}
            />
            <StatCard
              icon={<Sunset className="h-5 w-5 text-[#FF9A3C]" />}
              label="Sunset"
              value={sunset}
              delay={0.32}
            />
            <StatCard
              icon={<ArrowUpRight className="h-5 w-5 text-[#F57C00]" />}
              label="Max"
              value={formatTempInUnit(weather.main?.temp_max, unit)}
              delay={0.39}
            />
            <StatCard
              icon={<ArrowDownLeft className="h-5 w-5 text-[#8B5A00]" />}
              label="Min"
              value={formatTempInUnit(weather.main?.temp_min, unit)}
              delay={0.46}
            />
          </div>
        </div>

        {/* ── Icon showcase panel ── */}
        <motion.div
          className="relative z-10 flex items-center justify-center lg:justify-end"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`relative flex h-[21rem] w-full max-w-[22rem] items-center justify-center rounded-[2rem] border border-white/45 bg-gradient-to-br ${iconPanelStyle.gradient} p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl md:h-[24rem]`}>
            {/* Reactive ambient glows */}
            <motion.div
              className={`absolute left-6 top-6 h-20 w-20 rounded-full ${iconPanelStyle.glow1} blur-2xl`}
              animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={`absolute right-8 top-8 h-24 w-24 rounded-full ${iconPanelStyle.glow2} blur-3xl`}
              animate={reduceMotion ? {} : { scale: [1, 1.1, 1], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className={`absolute bottom-8 left-12 h-20 w-20 rounded-full ${iconPanelStyle.glow3} blur-3xl`}
              animate={reduceMotion ? {} : { scale: [1, 1.12, 1], x: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className="absolute inset-x-10 top-12 h-28 rounded-full bg-white/30 blur-2xl animate-cloud-drift" />
            <div className="absolute inset-x-8 top-20 h-20 rounded-full bg-white/28 blur-2xl animate-cloud-drift" style={{ animationDirection: "reverse" }} />
            <div className="absolute bottom-10 left-8 right-8 h-20 rounded-full bg-[#fff4d6]/55 blur-xl" />

            {/* Animated weather icon */}
            <motion.div
              initial={{ scale: 0.85, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatedWeatherIcon
                  condition={weatherMain}
                  isNight={isNight}
                  iconCode={iconCode}
                  size={200}
                  alt={description || "Weather illustration"}
                  className="drop-shadow-[0_32px_60px_rgba(126,63,0,0.28)]"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
