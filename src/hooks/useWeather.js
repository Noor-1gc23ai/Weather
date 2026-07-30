import { useCallback, useEffect, useState } from "react";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
} from "../services/weatherApi";
import useGeolocation from "./useGeolocation";

/**
 * Central weather data hook.
 *
 * Ported from legacy app.js:
 *   - window.onload geolocation-first bootstrap (falls back to defaultCity)
 *   - fetchWeather(city) / fetchByCoords(lat, lon)
 *   - fetchForecast(lat, lon)
 *
 * Exposes both the data and the actions the UI needs (search, useMyLocation).
 */
export default function useWeather(defaultCity = "Bengaluru") {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { locate } = useGeolocation();

  const loadForecastFor = useCallback(async (lat, lon) => {
    try {
      const data = await getForecast(lat, lon);
      setForecast(data);
    } catch {
      // Forecast failing shouldn't block showing current weather.
      setForecast(null);
    }
  }, []);

  const applyWeather = useCallback(
    async (data) => {
      setWeather(data);
      if (data?.coord) {
        await loadForecastFor(data.coord.lat, data.coord.lon);
      }
    },
    [loadForecastFor]
  );

  const search = useCallback(
    async (city) => {
      if (!city) return;
      setLoading(true);
      setError("");
      try {
        const data = await getCurrentWeather(city);
        await applyWeather(data);
      } catch {
        setError("City not found. Please check the spelling and try again.");
      } finally {
        setLoading(false);
      }
    },
    [applyWeather]
  );

  const useMyLocation = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { latitude, longitude } = await locate();
      const data = await getCurrentWeatherByCoords(latitude, longitude);
      await applyWeather(data);
    } catch {
      setError("Location unavailable — showing default city instead.");
      await search(defaultCity);
    } finally {
      setLoading(false);
    }
  }, [locate, applyWeather, search, defaultCity]);

  // On mount: try geolocation first, fall back to the default city.
  // Ported from legacy app.js -> window.onload
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      setError("");
      try {
        const { latitude, longitude } = await locate();
        if (cancelled) return;
        const data = await getCurrentWeatherByCoords(latitude, longitude);
        if (cancelled) return;
        await applyWeather(data);
      } catch {
        if (cancelled) return;
        await search(defaultCity);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount, like the legacy window.onload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { weather, forecast, loading, error, search, useMyLocation };
}
