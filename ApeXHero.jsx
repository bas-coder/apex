// ApeXHero.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Premium hero for the "ApeX" financial / crypto syndicate.
// Stack: React + Tailwind CSS + Framer Motion.
//
// SETUP (once, in your app):
//   1. npm i framer-motion
//   2. Add Michroma in index.html <head>:
//        <link rel="preconnect" href="https://fonts.googleapis.com">
//        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//        <link href="https://fonts.googleapis.com/css2?family=Michroma&display=swap" rel="stylesheet">
//      (or add `@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');` to your CSS)
//   3. tailwind.config.js → theme.extend.fontFamily.michroma = ['Michroma','sans-serif']
//      Then use `font-michroma`. (Below we also fall back to inline style so it works with zero config.)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = ["The Manifesto", "GreenLight", "Base"];
const EMBER_COLORS = ["#00FF66", "#00FF66", "#FFB800", "#FF5100"];

/* Subtle burning-lion ember field — green + fiery accents drifting upward. */
function EmberField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const make = () => ({
      x: Math.random() * window.innerWidth * dpr,
      y: Math.random() * window.innerHeight * dpr,
      vy: 0.2 + Math.random() * 0.7,
      r: (Math.random() * 1.9 + 0.5) * dpr,
      color: EMBER_COLORS[(Math.random() * EMBER_COLORS.length) | 0],
      alpha: 0.08 + Math.random() * 0.32,
      life: Math.random() * 6.28,
      seed: Math.random() * 6.28,
    });

    const particles = Array.from({ length: 46 }, make);
    let raf;

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.y -= p.vy * dpr;
        p.x += Math.sin(p.y * 0.0018 + p.seed) * 0.35 * dpr;
        p.life += 0.006;
        if (p.y < -24 * dpr) {
          Object.assign(p, make());
          p.y = h + 24 * dpr;
        }
        const a = p.alpha * (0.45 + 0.55 * Math.sin(p.life));
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 4.5;
        ctx.globalAlpha = Math.max(0, Math.min(a, 0.55));
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

export default function ApeXHero() {
  const michroma = { fontFamily: "'Michroma', sans-serif" };

  return (
    <section
      style={michroma}
      className="font-michroma relative h-screen w-screen overflow-visible bg-black text-white"
    >
      {/* Plain black background */}

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-0 z-[3] flex items-center justify-between px-10 py-7"
      >
        {/* Logo — the X carries the fiery accent + ember dot */}
        <div className="flex select-none items-center text-[22px] tracking-tight">
          <span className="text-white">Ape</span>
          <span className="text-[#FFB800]">X</span>
        </div>

        {/* Links + CTA */}
        <div className="flex items-center gap-9">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="border-b border-transparent pb-1 text-[11px] text-slate-300 no-underline transition-all duration-300 hover:border-[#00FF66] hover:text-[#00FF66] hover:[text-shadow:0_0_14px_rgba(0,255,102,0.6)]"
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            className="rounded-[4px] border border-[#95D43F] bg-[#95D43F] px-5 py-[11px] text-[11px] tracking-[0.22em] text-black no-underline transition-all duration-300 hover:bg-[#9EC116] hover:border-[#9EC116] hover:[box-shadow:0_0_26px_rgba(0,255,102,0.45)]"
          >
            Join the Pride
          </a>
        </div>
      </motion.nav>

      {/* ── TAGLINE (above hero, left-aligned, logo-size) ─────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-24 z-[2] px-10"
      >
        <div
          style={michroma}
          className="text-[22px] tracking-tight text-[#F3F4F6]"
        >
          RESULTS OVER EXCUSES
        </div>
      </motion.div>

      {/* ── MASSIVE HEADLINE (absolute bottom, 40px padding) ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-10 z-[2] px-7"
      >
        <div className="relative w-full text-center">
          <div
            style={michroma}
            className="whitespace-nowrap text-[#F3F4F6] text-[6vw] leading-[0.9] tracking-[-0.06em]"
          >
            REACH THE APEX
          </div>
        </div>
      </motion.div>

      {/* ── HEADING + DESCRIPTION (below hero) ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-[-140px] z-[2] px-10"
      >
        <div className="max-w-2xl">
          <h2
            style={michroma}
            className="text-[3vw] leading-tight text-[#F3F4F6] mb-3"
          >
            THE APEX COLLECTIVE
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-400">
            A global pride of individuals tired of the status quo. If one eats, we all eat.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
