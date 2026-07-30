import { memo, useMemo, useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ─── Scene key resolver ─── */

function getSceneKey(weatherMain = "sunny") {
  if (weatherMain.includes("cloud")) return "clouds";
  if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) return "rain";
  if (weatherMain.includes("thunder")) return "thunderstorm";
  if (weatherMain.includes("snow")) return "snow";
  if (weatherMain.includes("mist") || weatherMain.includes("fog") || weatherMain.includes("haze") || weatherMain.includes("smoke")) return "mist";
  return "clear";
}

/* ─── Seeded random for deterministic particle positions ─── */

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Scene-specific background palettes ─── */

const LIGHT_PALETTES = {
  clear: {
    from: "#FFE9A8", via: "#FFD36B", to: "#FFB347",
    glowTL: "rgba(255,255,255,0.92)", glowBR: "rgba(255,154,60,0.35)",
    accent: "rgba(255,214,107,0.7)",
  },
  clouds: {
    from: "#E8E4DF", via: "#D5D0CA", to: "#C8C2BB",
    glowTL: "rgba(255,255,255,0.72)", glowBR: "rgba(180,175,168,0.25)",
    accent: "rgba(200,195,188,0.4)",
  },
  rain: {
    from: "#8BA4BE", via: "#6B8AAD", to: "#4A6E8F",
    glowTL: "rgba(180,200,220,0.4)", glowBR: "rgba(60,90,120,0.3)",
    accent: "rgba(100,160,220,0.25)",
  },
  thunderstorm: {
    from: "#4A5568", via: "#2D3748", to: "#1A202C",
    glowTL: "rgba(120,140,160,0.3)", glowBR: "rgba(40,50,70,0.35)",
    accent: "rgba(100,120,160,0.2)",
  },
  snow: {
    from: "#E8EDF5", via: "#D4DCE8", to: "#C0CCDA",
    glowTL: "rgba(255,255,255,0.7)", glowBR: "rgba(200,210,225,0.3)",
    accent: "rgba(220,230,245,0.4)",
  },
  mist: {
    from: "#D4D8DD", via: "#C5CAD0", to: "#B8BEC6",
    glowTL: "rgba(255,255,255,0.5)", glowBR: "rgba(180,188,198,0.25)",
    accent: "rgba(200,208,218,0.35)",
  },
};

const DARK_PALETTES = {
  clear: {
    from: "#2B1600", via: "#4A2C00", to: "#6A3D00",
    glowTL: "rgba(255,204,120,0.14)", glowBR: "rgba(255,154,60,0.12)",
    accent: "rgba(255,169,64,0.14)",
  },
  clouds: {
    from: "#1A1E24", via: "#252A32", to: "#323840",
    glowTL: "rgba(160,170,185,0.1)", glowBR: "rgba(100,110,125,0.08)",
    accent: "rgba(130,140,158,0.08)",
  },
  rain: {
    from: "#0F1923", via: "#162030", to: "#1C2A3E",
    glowTL: "rgba(80,130,200,0.1)", glowBR: "rgba(40,80,140,0.12)",
    accent: "rgba(60,110,180,0.08)",
  },
  thunderstorm: {
    from: "#0A0E14", via: "#111720", to: "#18202D",
    glowTL: "rgba(60,80,120,0.1)", glowBR: "rgba(30,40,70,0.12)",
    accent: "rgba(80,100,150,0.08)",
  },
  snow: {
    from: "#141B24", via: "#1C2533", to: "#243042",
    glowTL: "rgba(180,200,230,0.08)", glowBR: "rgba(140,160,200,0.06)",
    accent: "rgba(160,180,220,0.07)",
  },
  mist: {
    from: "#161A20", via: "#1E2228", to: "#262C34",
    glowTL: "rgba(170,180,195,0.08)", glowBR: "rgba(120,130,150,0.06)",
    accent: "rgba(150,160,178,0.06)",
  },
};

/* ─── Particle field ─── */

const ParticleField = memo(function ParticleField({ count, color, seed, reduceMotion }) {
  const particles = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }).map((_, i) => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 1.5 + rand() * 2.5,
      duration: 5 + rand() * 6,
      delay: rand() * 4,
    }));
  }, [count, seed]);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.6 }
              : { opacity: [0.15, 0.75, 0.15], y: [0, -10, 0], x: [0, 5, 0] }
          }
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
});

/* ─── Sun rays ─── */

function SunRays({ reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute"
      style={{
        left: "8%",
        top: "4%",
        width: "22rem",
        height: "22rem",
        background: "conic-gradient(from 0deg, rgba(255,211,107,0.12) 0deg, transparent 30deg, rgba(255,211,107,0.08) 60deg, transparent 90deg, rgba(255,211,107,0.12) 120deg, transparent 150deg, rgba(255,211,107,0.08) 180deg, transparent 210deg, rgba(255,211,107,0.12) 240deg, transparent 270deg, rgba(255,211,107,0.08) 300deg, transparent 330deg, rgba(255,211,107,0.12) 360deg)",
        borderRadius: "50%",
        filter: "blur(8px)",
      }}
      animate={reduceMotion ? {} : { rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Sun glow orb ─── */

function SunGlow({ reduceMotion }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          left: "10%",
          top: "8%",
          width: "12rem",
          height: "12rem",
          background: "radial-gradient(circle, rgba(255,211,107,0.6) 0%, rgba(255,179,71,0.3) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={reduceMotion ? { opacity: 0.8 } : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Heat shimmer */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 50%, rgba(255,230,170,0.06) 70%, transparent 90%)",
        }}
        animate={reduceMotion ? {} : { scaleY: [1, 1.01, 0.99, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ─── Cloud shapes ─── */

function CloudLayer({ top, left, width, height, opacity, speed, direction, blur, reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full"
      style={{
        top,
        left,
        width,
        height,
        background: `rgba(255,255,255,${opacity})`,
        filter: `blur(${blur || "40px"})`,
      }}
      animate={reduceMotion ? { opacity: opacity * 0.8 } : { x: [0, direction * 40, 0] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Rain scene ─── */

const RainDrops = memo(function RainDrops({ count, reduceMotion }) {
  const drops = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }).map((_, i) => ({
      left: rand() * 100,
      height: 16 + rand() * 30,
      speed: 0.6 + rand() * 0.6,
      delay: rand() * 2,
      opacity: 0.3 + rand() * 0.5,
    }));
  }, [count]);

  if (reduceMotion) {
    return (
      <div aria-hidden="true" className="absolute inset-0 opacity-40">
        {drops.slice(0, 12).map((d, i) => (
          <span
            key={i}
            className="absolute w-px rounded-full bg-white/50"
            style={{ left: `${d.left}%`, top: "30%", height: d.height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {drops.map((d, i) => (
        <motion.span
          key={i}
          className="absolute w-px rounded-full bg-gradient-to-b from-white/60 to-white/20"
          style={{
            left: `${d.left}%`,
            height: d.height,
            top: "-40px",
          }}
          animate={{ y: ["0vh", "110vh"] }}
          transition={{
            duration: d.speed,
            repeat: Infinity,
            ease: "linear",
            delay: d.delay,
          }}
        />
      ))}
    </div>
  );
});

/* ─── Lightning ─── */

function Lightning({ reduceMotion }) {
  const [flash, setFlash] = useState(false);
  const timerRef = useRef(null);

  const scheduleFlash = useCallback(() => {
    const delay = 4000 + Math.random() * 8000;
    timerRef.current = setTimeout(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
        scheduleFlash();
      }, 200);
    }, delay);
  }, []);

  useEffect(() => {
    if (!reduceMotion) {
      scheduleFlash();
    }
    return () => clearTimeout(timerRef.current);
  }, [reduceMotion, scheduleFlash]);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-75"
      style={{
        backgroundColor: flash ? "rgba(255,255,255,0.2)" : "transparent",
        boxShadow: flash ? "inset 0 0 120px rgba(255,255,255,0.3)" : "none",
      }}
    />
  );
}

/* ─── Snow particles ─── */

const SnowParticles = memo(function SnowParticles({ count, reduceMotion }) {
  const flakes = useMemo(() => {
    const rand = seededRandom(77);
    return Array.from({ length: count }).map((_, i) => {
      const sizeClass = i % 3;
      return {
        left: rand() * 100,
        size: sizeClass === 0 ? 3 : sizeClass === 1 ? 5 : 7,
        speed: sizeClass === 0 ? 6 : sizeClass === 1 ? 8 : 11,
        drift: (rand() - 0.5) * 60,
        delay: rand() * 6,
        opacity: 0.5 + rand() * 0.4,
      };
    });
  }, [count]);

  if (reduceMotion) {
    return (
      <div aria-hidden="true" className="absolute inset-0 opacity-50">
        {flakes.slice(0, 15).map((f, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${f.left}%`, top: `${20 + (i * 4)}%`, width: f.size, height: f.size, opacity: f.opacity }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            top: "-10px",
            width: f.size,
            height: f.size,
            "--snow-drift": `${f.drift}px`,
          }}
          animate={{
            y: [0, window.innerHeight + 40],
            x: [0, f.drift * 0.5, f.drift, f.drift * 0.5, 0],
            rotate: [0, 360],
            opacity: [0, f.opacity, f.opacity, 0],
          }}
          transition={{
            duration: f.speed,
            repeat: Infinity,
            ease: "linear",
            delay: f.delay,
          }}
        />
      ))}
    </div>
  );
});

/* ─── Fog layers ─── */

function FogLayers({ reduceMotion }) {
  const layers = [
    { top: "10%", h: "8rem", opacity: 0.2, speed: 24, dir: 1 },
    { top: "28%", h: "10rem", opacity: 0.28, speed: 30, dir: -1 },
    { top: "48%", h: "9rem", opacity: 0.22, speed: 20, dir: 1 },
    { top: "68%", h: "12rem", opacity: 0.3, speed: 34, dir: -1 },
    { top: "82%", h: "8rem", opacity: 0.18, speed: 28, dir: 1 },
  ];

  return (
    <>
      {layers.map((l, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            top: l.top,
            left: "-15%",
            right: "-15%",
            height: l.h,
            background: `rgba(255,255,255,${l.opacity})`,
            filter: "blur(50px)",
          }}
          animate={reduceMotion ? { opacity: l.opacity * 0.7 } : { x: [0, l.dir * 50, 0] }}
          transition={{ duration: l.speed, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

/* ─── Night stars ─── */

const NightStars = memo(function NightStars({ reduceMotion }) {
  const stars = useMemo(() => {
    const rand = seededRandom(99);
    return Array.from({ length: 40 }).map((_, i) => ({
      left: rand() * 100,
      top: 4 + rand() * 65,
      size: 1 + rand() * 2,
      duration: 2 + rand() * 4,
      delay: rand() * 5,
      glowSize: 4 + rand() * 8,
    }));
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.glowSize}px rgba(255,255,255,0.7)`,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : { opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.2, 0.8] }
          }
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
});

/* ─── Moon glow ─── */

function MoonGlow({ reduceMotion }) {
  return (
    <>
      {/* Moon disc */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          left: "12%",
          top: "10%",
          width: "7rem",
          height: "7rem",
          background: "radial-gradient(circle at 35% 35%, #F0F4FF 0%, #D4E4FF 50%, #BFD9FF 100%)",
          boxShadow: "0 0 60px rgba(191,226,255,0.4), 0 0 120px rgba(191,226,255,0.2)",
        }}
        animate={
          reduceMotion
            ? { opacity: 0.85 }
            : { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.82] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Crescent shadow */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          left: "calc(12% + 2rem)",
          top: "calc(10% - 0.5rem)",
          width: "5rem",
          height: "5rem",
          background: "rgba(15,25,35,0.7)",
          filter: "blur(2px)",
        }}
      />
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          left: "6%",
          top: "5%",
          width: "16rem",
          height: "16rem",
          background: "radial-gradient(circle, rgba(191,226,255,0.15) 0%, transparent 60%)",
          filter: "blur(30px)",
        }}
        animate={reduceMotion ? {} : { scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ─── Layered background glow system ─── */

function BackgroundGlows({ palette, reduceMotion }) {
  return (
    <>
      {/* Top-left primary glow */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          top: "-15%",
          left: "-10%",
          width: "32rem",
          height: "32rem",
          background: `radial-gradient(circle, ${palette.glowTL}, transparent 60%)`,
          filter: "blur(80px)",
        }}
        animate={reduceMotion ? { opacity: 0.7 } : { x: [0, 30, 0], y: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-right secondary glow */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          bottom: "-20%",
          right: "-8%",
          width: "38rem",
          height: "38rem",
          background: `radial-gradient(circle, ${palette.glowBR}, transparent 55%)`,
          filter: "blur(100px)",
        }}
        animate={reduceMotion ? { opacity: 0.6 } : { x: [0, -25, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center ambient fill */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          top: "30%",
          left: "25%",
          width: "30rem",
          height: "30rem",
          background: `radial-gradient(circle, ${palette.accent}, transparent 50%)`,
          filter: "blur(90px)",
        }}
        animate={reduceMotion ? { opacity: 0.5 } : { scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ─── Scene transition wrapper ─── */

const sceneTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 1.2, ease: "easeInOut" },
};

/* ─── Main component ─── */

function WeatherBackground({ mode, weatherMain, weatherIcon }) {
  const reduceMotion = useReducedMotion();
  const sceneKey = getSceneKey(weatherMain);
  const isNight = weatherIcon?.endsWith("n");

  const isDark = mode === "dark";
  const palettes = isDark ? DARK_PALETTES : LIGHT_PALETTES;
  const palette = palettes[sceneKey] || palettes.clear;

  /* Wet glass overlay for rain/thunderstorm */
  const showWetGlass = sceneKey === "rain" || sceneKey === "thunderstorm";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 45%, ${palette.to} 100%)`,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Layered glow system – always active */}
      <BackgroundGlows palette={palette} reduceMotion={reduceMotion} />

      {/* Top highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.35)"}, transparent 30%)`,
          opacity: 0.6,
        }}
      />

      {/* Side light streak */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: "linear-gradient(120deg, rgba(255,255,255,0.22), transparent 20%, transparent 80%, rgba(255,255,255,0.16))",
          opacity: isDark ? 0.08 : 0.35,
        }}
      />

      {/* Scene-specific elements with cross-fade */}
      <AnimatePresence mode="wait">
        {/* ── Clear / Sunny ── */}
        {sceneKey === "clear" && !isNight ? (
          <motion.div key="scene-clear" {...sceneTransition} className="absolute inset-0">
            <SunRays reduceMotion={reduceMotion} />
            <SunGlow reduceMotion={reduceMotion} />
            <ParticleField count={30} color="rgba(255,211,107,0.7)" seed={7} reduceMotion={reduceMotion} />
          </motion.div>
        ) : null}

        {/* ── Clouds ── */}
        {sceneKey === "clouds" ? (
          <motion.div key="scene-clouds" {...sceneTransition} className="absolute inset-0">
            <CloudLayer top="8%" left="3%" width="22rem" height="7rem" opacity={0.25} speed={22} direction={1} reduceMotion={reduceMotion} />
            <CloudLayer top="18%" left="55%" width="18rem" height="6rem" opacity={0.2} speed={28} direction={-1} reduceMotion={reduceMotion} />
            <CloudLayer top="35%" left="15%" width="16rem" height="5rem" opacity={0.18} speed={32} direction={1} blur="35px" reduceMotion={reduceMotion} />
            <CloudLayer top="50%" left="65%" width="14rem" height="5rem" opacity={0.15} speed={26} direction={-1} blur="45px" reduceMotion={reduceMotion} />
            <CloudLayer top="65%" left="30%" width="20rem" height="6rem" opacity={0.12} speed={36} direction={1} blur="50px" reduceMotion={reduceMotion} />
            <ParticleField count={12} color="rgba(255,255,255,0.5)" seed={13} reduceMotion={reduceMotion} />
          </motion.div>
        ) : null}

        {/* ── Rain ── */}
        {sceneKey === "rain" ? (
          <motion.div key="scene-rain" {...sceneTransition} className="absolute inset-0">
            <RainDrops count={65} reduceMotion={reduceMotion} />
            <div className="absolute inset-0 bg-slate-900/12" />
          </motion.div>
        ) : null}

        {/* ── Thunderstorm ── */}
        {sceneKey === "thunderstorm" ? (
          <motion.div key="scene-thunder" {...sceneTransition} className="absolute inset-0">
            <RainDrops count={80} reduceMotion={reduceMotion} />
            <Lightning reduceMotion={reduceMotion} />
            <div className="absolute inset-0 bg-slate-950/18" />
          </motion.div>
        ) : null}

        {/* ── Snow ── */}
        {sceneKey === "snow" ? (
          <motion.div key="scene-snow" {...sceneTransition} className="absolute inset-0">
            <SnowParticles count={45} reduceMotion={reduceMotion} />
            {/* Icy vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(200,215,235,0.15) 100%)",
              }}
            />
          </motion.div>
        ) : null}

        {/* ── Mist / Fog ── */}
        {sceneKey === "mist" ? (
          <motion.div key="scene-mist" {...sceneTransition} className="absolute inset-0">
            <FogLayers reduceMotion={reduceMotion} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Night overlay (additive, not scene-exclusive) ── */}
      {isNight ? (
        <motion.div
          key="night-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Dark wash */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(5,10,20,0.5) 0%, rgba(10,15,30,0.3) 100%)"
                : "linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(30,41,59,0.2) 100%)",
            }}
          />
          <NightStars reduceMotion={reduceMotion} />
          <MoonGlow reduceMotion={reduceMotion} />
        </motion.div>
      ) : null}

      {/* Wet glass overlay for rain/storm */}
      {showWetGlass ? (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(1px) saturate(0.9)",
            WebkitBackdropFilter: "blur(1px) saturate(0.9)",
          }}
        />
      ) : null}
    </div>
  );
}

export default memo(WeatherBackground);