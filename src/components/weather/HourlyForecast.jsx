import { motion, useReducedMotion } from "framer-motion";
import { formatTempInUnit } from "../../utils/formatters";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function HourlyForecast({ hours, unit, timezoneOffset = 0 }) {
  if (!hours) return null;

  const reduceMotion = useReducedMotion();
  const currentCityHour = new Date((Date.now() / 1000 + timezoneOffset) * 1000).getUTCHours();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-4 overflow-x-auto scroll-snap-x pb-3 [scrollbar-width:thin]"
    >
      <div className="flex gap-4 pr-2">
        {hours.slice(0, 12).map((h, idx) => {
          const hourValue = new Date((h.dt + timezoneOffset) * 1000).getUTCHours();
          const isCurrentHour = hourValue === currentCityHour;
          const condition = h.weather?.[0]?.main ?? "Clear";
          const isNight = h.weather?.[0]?.icon?.endsWith("n") ?? false;

          return (
            <motion.article
              key={h.dt}
              variants={cardVariants}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? {} : {
                y: -7,
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 18 },
              }}
              className={`sunrise-glow glass-panel premium-card weather-glow-hover shimmer-sweep min-w-[9rem] rounded-[1.35rem] p-4 text-center ${
                isCurrentHour
                  ? "border-[#F57C00]/45 bg-white/72 shadow-[0_22px_48px_rgba(245,124,0,0.22)]"
                  : ""
              }`}
              style={isCurrentHour && !reduceMotion ? { animation: "currentHourPulse 3s ease-in-out infinite" } : {}}
            >
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#8B5A00]">
                {new Date(h.dt * 1000).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 flex items-center justify-center">
                <motion.div
                  animate={reduceMotion ? {} : {
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: isCurrentHour ? 2.4 : 4.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.1,
                  }}
                >
                  <AnimatedWeatherIcon
                    condition={condition}
                    isNight={isNight}
                    iconCode={h.weather[0].icon}
                    size={56}
                    alt={h.weather[0].description}
                    className="drop-shadow-[0_12px_18px_rgba(134,73,0,0.15)]"
                  />
                </motion.div>
              </div>

              <div className={`mt-2 text-2xl font-black ${isCurrentHour ? "text-[#F57C00]" : "text-[#3D2200]"}`}>
                {formatTempInUnit(h.main.temp, unit)}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#8B5A00]">
                <span>{Math.round(h.wind?.speed ?? 0)} m/s wind</span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
