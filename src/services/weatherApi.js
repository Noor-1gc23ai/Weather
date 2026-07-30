import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Current weather by city name.
 * Ported from legacy app.js -> fetchWeather(city)
 */
export async function getCurrentWeather(city) {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
}

/**
 * Current weather by latitude/longitude (geolocation).
 * Ported from legacy app.js -> fetchByCoords(lat, lon)
 */
export async function getCurrentWeatherByCoords(lat, lon) {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
}

/**
 * 5-day / 3-hour forecast by latitude/longitude.
 * Ported from legacy app.js -> fetchForecast(lat, lon)
 */
export async function getForecast(lat, lon) {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
}
