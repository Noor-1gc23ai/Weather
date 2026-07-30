import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Droplets, Gauge, Moon, Sun, Thermometer, Wind } from "lucide-react";
import { formatTempInUnit } from "../../utils/formatters";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function WeatherDetails({ weather, unit }) {
  if (!weather) return null;

  const reduceMotion = useReducedMotion();
  const { main, wind } = weather;

  const details = [
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Humidity",
      value: `${main?.humidity ?? "--"}%`,
    },
    {
      icon: <Wind className="h-6 w-6" />,
      title: "Wind Speed",
      value: `${wind?.speed ?? "--"} m/s`,
    },
    {
      icon: (
        <ArrowUp
          className="h-6 w-6"
          style={{ transform: `rotate(${wind?.deg ?? 0}deg)` }}
        />
      ),
      title: "Wind Direction",
      value: `${wind?.deg ?? "--"}°`,
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: "Pressure",
      value: `${main?.pressure ?? "--"} hPa`,
    },
    {
      icon: <Thermometer className="h-6 w-6" />,
      title: "Feels Like",
      value: formatTempInUnit(main?.feels_like, unit),
    },
    {
      icon: <Sun className="h-6 w-6" />,
      title: "Max Temp",
      value: formatTempInUnit(main?.temp_max, unit),
    },
    {
      icon: <Moon className="h-6 w-6" />,
      title: "Min Temp",
      value: formatTempInUnit(main?.temp_min, unit),
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {details.map((item, idx) => (
        <motion.div
          key={item.title}
          variants={cardVariants}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduceMotion ? {} : {
            y: -7,
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 18 },
          }}
          className="sunrise-glow glass-panel premium-card weather-glow-hover shimmer-sweep rounded-[1.6rem] p-5"
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.15 + idx * 0.06,
                type: "spring",
                stiffness: 250,
              }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/45 text-[#F57C00] shadow-[0_14px_30px_rgba(134,73,0,0.08)]"
            >
              {item.icon}
            </motion.div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8B5A00]">
                {item.title}
              </p>
              <h3 className="mt-1 text-2xl font-black text-[#3D2200] md:text-[1.7rem]">
                {item.value}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
