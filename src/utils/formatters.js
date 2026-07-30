export function formatDate(ts) {
  return new Date(ts * 1000).toLocaleString();
}

export function formatWeatherDateTime(ts, timezoneOffset = 0) {
  const date = new Date((ts + timezoneOffset) * 1000);

  return {
    date: date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function formatSunTime(ts, timezoneOffset = 0) {
  return new Date((ts + timezoneOffset) * 1000).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTemp(c) {
  return `${Math.round(c)}°C`;
}

/**
 * Ported from legacy app.js -> the el("temp").onclick toggle handler.
 * Converts a Celsius value to Fahrenheit.
 */
export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Ported from legacy app.js -> the el("temp").onclick toggle handler.
 * Converts a Fahrenheit value back to Celsius.
 */
export function fahrenheitToCelsius(f) {
  return Math.round(((f - 32) * 5) / 9);
}

/**
 * Formats a Celsius value in the requested unit ("C" or "F").
 */
export function formatTempInUnit(celsiusValue, unit) {
  if (unit === "F") {
    return `${celsiusToFahrenheit(celsiusValue)}°F`;
  }
  return `${Math.round(celsiusValue)}°C`;
}
