import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import SearchBar from "./components/weather/SearchBar";
import CurrentWeather from "./components/weather/CurrentWeather";
import WeatherDetails from "./components/weather/WeatherDetails";
import Forecast from "./components/weather/Forecast";
import HourlyForecast from "./components/weather/HourlyForecast";
import WeatherBackground from "./components/weather/WeatherBackground";
import Loading from "./components/common/Loading";
import ErrorMessage from "./components/common/ErrorMessage";

import useWeather from "./hooks/useWeather";
import useTempUnit from "./hooks/useTempUnit";
import useTheme from "./hooks/useTheme";

/* ─── Weather-reactive root background colors ─── */

const ROOT_BG = {
  light: {
    clear: "#FFE9A8",
    clouds: "#E2DEDA",
    rain: "#8BA4BE",
    thunderstorm: "#4A5568",
    snow: "#E2E8F0",
    mist: "#D0D5DC",
  },
  dark: {
    clear: "#2B1600",
    clouds: "#1A1E24",
    rain: "#0F1923",
    thunderstorm: "#0A0E14",
    snow: "#141B24",
    mist: "#161A20",
  },
};

function getSceneKey(weatherMain = "") {
  const m = weatherMain.toLowerCase();
  if (m.includes("thunder")) return "thunderstorm";
  if (m.includes("rain") || m.includes("drizzle")) return "rain";
  if (m.includes("snow")) return "snow";
  if (m.includes("cloud")) return "clouds";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze") || m.includes("smoke")) return "mist";
  return "clear";
}

/* ─── Section animation variants ─── */

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function App() {
  const { weather, forecast, loading, error, search, useMyLocation } =
    useWeather("Bengaluru");

  const { unit, toggleUnit } = useTempUnit("C");
  const { mode, setMode } = useTheme();

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  const dailyForecast = forecast?.list
    ?.filter((item) => item.dt_txt.includes("12:00"))
    .slice(0, 5);

  const weatherMain = weather?.weather?.[0]?.main?.toLowerCase() ?? "sunny";
  const weatherIcon = weather?.weather?.[0]?.icon ?? "01d";

  const sceneKey = getSceneKey(weatherMain);
  const rootBg = useMemo(() => {
    const palette = mode === "dark" ? ROOT_BG.dark : ROOT_BG.light;
    return palette[sceneKey] || palette.clear;
  }, [mode, sceneKey]);

  useEffect(() => {
    document.body.classList.toggle("dark", mode === "dark");

    return () => {
      document.body.classList.remove("dark");
    };
  }, [mode]);

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      animate={{ backgroundColor: rootBg }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <WeatherBackground mode={mode} weatherMain={weatherMain} weatherIcon={weatherIcon} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Navbar mode={mode} onToggleMode={toggleMode} />

        <SearchBar
          onSearch={search}
          onUseMyLocation={useMyLocation}
          loading={loading}
        />

        <AnimatePresence mode="wait">
          {loading ? <Loading key="loading" /> : null}
        </AnimatePresence>

        <ErrorMessage message={error} />

        <AnimatePresence mode="wait">
          {!loading && weather ? (
            <motion.main
              key={weather.id ?? weather.name}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 12 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.08 },
                },
              }}
              className="pb-8"
            >
              <motion.div variants={sectionVariants} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <CurrentWeather
                  weather={weather}
                  unit={unit}
                  onToggleUnit={toggleUnit}
                />
              </motion.div>

              <motion.div variants={sectionVariants} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <WeatherDetails weather={weather} unit={unit} />
              </motion.div>

              {forecast?.list ? (
                <motion.section
                  variants={sectionVariants}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10"
                >
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#8B5A00]">Forecast</p>
                      <h2 className="mt-1 text-2xl font-black text-[#3D2200] md:text-3xl">Next Hours</h2>
                    </div>
                  </div>

                  <HourlyForecast hours={forecast.list} unit={unit} />

                  <div className="mb-4 mt-10 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#8B5A00]">Outlook</p>
                      <h2 className="mt-1 text-2xl font-black text-[#3D2200] md:text-3xl">5-Day Forecast</h2>
                    </div>
                  </div>

                  <Forecast days={dailyForecast} unit={unit} />
                </motion.section>
              ) : null}
            </motion.main>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}