import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Maps an OpenWeatherMap condition string to one of our scene keys.
 */
function getConditionKey(condition = "") {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "thunderstorm";
  if (c.includes("drizzle") || c.includes("rain")) return "rain";
  if (c.includes("snow")) return "snow";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze") || c.includes("smoke")) return "mist";
  if (c.includes("cloud") || c.includes("overcast")) return "clouds";
  return "clear";
}

/* ─── Individual icon scenes ─── */

function SunIcon({ size, reduceMotion }) {
  const r = size * 0.18;
  const cx = size / 2;
  const cy = size / 2;
  const rayCount = 8;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Rotating rays */}
      <motion.g
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {Array.from({ length: rayCount }).map((_, i) => {
          const angle = (360 / rayCount) * i;
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (r + size * 0.06);
          const y1 = cy + Math.sin(rad) * (r + size * 0.06);
          const x2 = cx + Math.cos(rad) * (r + size * 0.2);
          const y2 = cy + Math.sin(rad) * (r + size * 0.2);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#FFD36B"
              strokeWidth={size * 0.035}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </motion.g>

      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r + size * 0.04} fill="#FFD36B" opacity={0.25} />

      {/* Sun core */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="url(#sunGrad)"
        animate={reduceMotion ? {} : { r: [r, r * 1.06, r] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <defs>
        <radialGradient id="sunGrad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFF7E0" />
          <stop offset="50%" stopColor="#FFD36B" />
          <stop offset="100%" stopColor="#FFB347" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CloudsIcon({ size, reduceMotion }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Back cloud */}
      <motion.g
        animate={reduceMotion ? {} : { x: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx={size * 0.55} cy={size * 0.45} rx={size * 0.28} ry={size * 0.16} fill="#E0E5EC" opacity={0.7} />
        <ellipse cx={size * 0.42} cy={size * 0.48} rx={size * 0.2} ry={size * 0.14} fill="#D5DAE3" opacity={0.7} />
      </motion.g>

      {/* Front cloud */}
      <motion.g
        animate={reduceMotion ? {} : { x: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <ellipse cx={size * 0.4} cy={size * 0.55} rx={size * 0.3} ry={size * 0.18} fill="white" />
        <ellipse cx={size * 0.28} cy={size * 0.58} rx={size * 0.2} ry={size * 0.13} fill="white" />
        <ellipse cx={size * 0.54} cy={size * 0.58} rx={size * 0.22} ry={size * 0.14} fill="#F5F7FA" />
      </motion.g>
    </svg>
  );
}

function RainIcon({ size, reduceMotion }) {
  const drops = useMemo(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      x: size * 0.22 + i * (size * 0.14),
      delay: i * 0.18,
    })), [size]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Cloud */}
      <ellipse cx={size * 0.42} cy={size * 0.35} rx={size * 0.3} ry={size * 0.17} fill="#A0AEC0" />
      <ellipse cx={size * 0.3} cy={size * 0.38} rx={size * 0.2} ry={size * 0.13} fill="#8B99AB" />
      <ellipse cx={size * 0.56} cy={size * 0.38} rx={size * 0.22} ry={size * 0.14} fill="#94A3B8" />

      {/* Rain drops */}
      {drops.map((d, i) => (
        <motion.line
          key={i}
          x1={d.x} y1={size * 0.52}
          x2={d.x - 2} y2={size * 0.52 + size * 0.12}
          stroke="#60A5FA"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          opacity={0.8}
          animate={reduceMotion ? {} : {
            y: [0, size * 0.22, 0],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 0.9 + i * 0.08,
            repeat: Infinity,
            ease: "easeIn",
            delay: d.delay,
          }}
        />
      ))}
    </svg>
  );
}

function ThunderIcon({ size, reduceMotion }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Dark cloud */}
      <ellipse cx={size * 0.42} cy={size * 0.3} rx={size * 0.3} ry={size * 0.16} fill="#64748B" />
      <ellipse cx={size * 0.3} cy={size * 0.33} rx={size * 0.2} ry={size * 0.12} fill="#475569" />
      <ellipse cx={size * 0.56} cy={size * 0.33} rx={size * 0.22} ry={size * 0.13} fill="#586879" />

      {/* Lightning bolt */}
      <motion.polygon
        points={`${size * 0.46},${size * 0.42} ${size * 0.38},${size * 0.58} ${size * 0.44},${size * 0.58} ${size * 0.38},${size * 0.78} ${size * 0.54},${size * 0.52} ${size * 0.47},${size * 0.52} ${size * 0.54},${size * 0.42}`}
        fill="#FBBF24"
        filter="drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))"
        animate={reduceMotion ? { opacity: 0.9 } : { opacity: [0.9, 1, 0.2, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
      />

      {/* Rain drops */}
      {[0.26, 0.62, 0.72].map((xPct, i) => (
        <motion.line
          key={i}
          x1={size * xPct} y1={size * 0.45}
          x2={size * xPct - 1} y2={size * 0.45 + size * 0.1}
          stroke="#93C5FD"
          strokeWidth={size * 0.02}
          strokeLinecap="round"
          opacity={0.6}
          animate={reduceMotion ? {} : { y: [0, size * 0.18, 0], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeIn", delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function SnowIcon({ size, reduceMotion }) {
  const flakes = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      x: size * 0.2 + i * (size * 0.12),
      r: size * 0.018 + (i % 3) * size * 0.008,
      delay: i * 0.3,
      dur: 2 + (i % 3) * 0.5,
    })), [size]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Cloud */}
      <ellipse cx={size * 0.42} cy={size * 0.32} rx={size * 0.28} ry={size * 0.15} fill="#E2E8F0" />
      <ellipse cx={size * 0.3} cy={size * 0.35} rx={size * 0.18} ry={size * 0.11} fill="#CBD5E1" />
      <ellipse cx={size * 0.55} cy={size * 0.35} rx={size * 0.2} ry={size * 0.12} fill="#D9E2EC" />

      {/* Snowflakes */}
      {flakes.map((f, i) => (
        <motion.circle
          key={i}
          cx={f.x} cy={size * 0.5}
          r={f.r}
          fill="white"
          opacity={0.9}
          animate={reduceMotion ? {} : {
            y: [0, size * 0.28],
            x: [0, (i % 2 === 0 ? 1 : -1) * size * 0.04],
            opacity: [0.9, 0.3],
          }}
          transition={{
            duration: f.dur,
            repeat: Infinity,
            ease: "easeIn",
            delay: f.delay,
          }}
        />
      ))}
    </svg>
  );
}

function MistIcon({ size, reduceMotion }) {
  const lines = [
    { y: size * 0.32, w: size * 0.6, op: 0.5 },
    { y: size * 0.44, w: size * 0.7, op: 0.65 },
    { y: size * 0.56, w: size * 0.55, op: 0.45 },
    { y: size * 0.68, w: size * 0.65, op: 0.55 },
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={(size - l.w) / 2} y1={l.y}
          x2={(size - l.w) / 2 + l.w} y2={l.y}
          stroke="#94A3B8"
          strokeWidth={size * 0.04}
          strokeLinecap="round"
          opacity={l.op}
          animate={reduceMotion ? {} : {
            x: [0, i % 2 === 0 ? 6 : -6, 0],
            opacity: [l.op, l.op + 0.15, l.op],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

function MoonIcon({ size, reduceMotion }) {
  const cx = size * 0.45;
  const cy = size * 0.42;
  const r = size * 0.2;

  const stars = useMemo(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      x: size * 0.15 + ((i * 17) % 70) * size * 0.01,
      y: size * 0.15 + ((i * 23) % 50) * size * 0.01,
      r: size * 0.012 + (i % 3) * size * 0.005,
      delay: i * 0.6,
    })), [size]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Moon glow */}
      <circle cx={cx} cy={cy} r={r * 1.6} fill="#BFE2FF" opacity={0.12} />

      {/* Moon body */}
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="url(#moonGrad)"
        animate={reduceMotion ? {} : { r: [r, r * 1.04, r] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Crescent shadow */}
      <circle cx={cx + r * 0.35} cy={cy - r * 0.15} r={r * 0.75} fill="#1E293B" opacity={0.7} />

      {/* Stars */}
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x} cy={s.y} r={s.r}
          fill="white"
          animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        />
      ))}

      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#F0F4FF" />
          <stop offset="60%" stopColor="#D4E4FF" />
          <stop offset="100%" stopColor="#BFD9FF" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Map condition → component ─── */

const ICON_MAP = {
  clear: SunIcon,
  clouds: CloudsIcon,
  rain: RainIcon,
  thunderstorm: ThunderIcon,
  snow: SnowIcon,
  mist: MistIcon,
};

/**
 * Animated weather icon component.
 *
 * @param {string}  condition  – OWM weather condition string (e.g. "Rain", "Clear")
 * @param {number}  size       – pixel size (default 80)
 * @param {boolean} isNight    – whether the icon should show night variant
 * @param {string}  iconCode   – OWM icon code, used as fallback
 * @param {string}  className  – extra CSS class
 */
function AnimatedWeatherIcon({
  condition = "Clear",
  size = 80,
  isNight = false,
  iconCode,
  className = "",
  alt = "Weather icon",
}) {
  const reduceMotion = useReducedMotion();
  const key = getConditionKey(condition);

  // Night clear → moon
  if (key === "clear" && isNight) {
    return (
      <span className={className} role="img" aria-label={alt}>
        <MoonIcon size={size} reduceMotion={reduceMotion} />
      </span>
    );
  }

  const IconComponent = ICON_MAP[key];

  if (!IconComponent) {
    // Fallback to OpenWeatherMap icon
    if (iconCode) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
          alt={alt}
          width={size}
          height={size}
          className={className}
        />
      );
    }
    return null;
  }

  return (
    <span className={className} role="img" aria-label={alt}>
      <IconComponent size={size} reduceMotion={reduceMotion} />
    </span>
  );
}

export default memo(AnimatedWeatherIcon);
