import { motion, useReducedMotion } from "framer-motion";
import { formatTempInUnit } from "../../utils/formatters";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function Forecast({ days, unit }) {
  if (!days) return null;

  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {days.map((d, idx) => {
        const condition = d.weather?.[0]?.main ?? "Clear";
        const isNight = d.weather?.[0]?.icon?.endsWith("n") ?? false;

        return (
          <motion.div
            key={d.dt}
            variants={cardVariants}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? {} : {
              y: -7,
              scale: 1.03,
              transition: { type: "spring", stiffness: 400, damping: 18 },
            }}
            className="sunrise-glow glass-panel premium-card weather-glow-hover shimmer-sweep rounded-[1.5rem] p-4 text-center"
          >
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#8B5A00]">
              {new Date(d.dt * 1000).toLocaleDateString(undefined, {
                weekday: "short",
              })}
            </div>

            <div className="mt-2 flex items-center justify-center">
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -4, 0] }}
                transition={{
                  duration: 4 + idx * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.15,
                }}
              >
                <AnimatedWeatherIcon
                  condition={condition}
                  isNight={isNight}
                  iconCode={d.weather[0].icon}
                  size={64}
                  alt={d.weather[0].description}
                  className="drop-shadow-[0_18px_24px_rgba(134,73,0,0.18)]"
                />
              </motion.div>
            </div>

            <div className="mt-2 text-2xl font-black text-[#3D2200]">
              {formatTempInUnit(d.main.temp, unit)}
            </div>
            <p className="mt-1 text-sm font-semibold capitalize text-[#8B5A00]">
              {d.weather[0].description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
