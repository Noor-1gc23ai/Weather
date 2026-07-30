import { useCallback } from "react";

/**
 * Ported from legacy app.js -> the window.onload geolocation block:
 *
 *   navigator.geolocation
 *     ? navigator.geolocation.getCurrentPosition(
 *         pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
 *         () => fetchWeather("Delhi")
 *       )
 *     : fetchWeather("Delhi");
 *
 * Exposes a single `locate()` function that resolves with { latitude, longitude }
 * or rejects if geolocation is unsupported/denied, so callers decide the fallback.
 */
export default function useGeolocation() {
  const locate = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          reject(new Error("Unable to retrieve your location."));
        }
      );
    });
  }, []);

  return { locate };
}
