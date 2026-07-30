import { useState, useCallback } from "react";

/**
 * Ported from legacy app.js -> the isCelsius flag + el("temp").onclick toggle.
 * Centralizes the unit so every component (CurrentWeather, WeatherDetails,
 * Forecast, HourlyForecast) can read/toggle the same °C / °F state.
 */
export default function useTempUnit(initial = "C") {
  const [unit, setUnit] = useState(initial);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  }, []);

  return { unit, toggleUnit };
}
