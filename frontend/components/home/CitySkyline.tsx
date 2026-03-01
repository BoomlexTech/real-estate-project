'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Deterministic pseudo-random — avoids SSR/client hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Dubai-inspired building silhouettes — 3 depth layers
// Far layer: shorter, closely packed background towers
const FAR_BUILDINGS = [
  { x: 0, w: 60, h: 120 },
  { x: 55, w: 45, h: 95 },
  { x: 95, w: 70, h: 140 },
  { x: 160, w: 40, h: 80 },
  { x: 195, w: 55, h: 130 },
  { x: 245, w: 35, h: 70 },
  { x: 275, w: 80, h: 160 },
  { x: 350, w: 50, h: 110 },
  { x: 395, w: 45, h: 90 },
  { x: 435, w: 65, h: 145 },
  { x: 495, w: 40, h: 75 },
  { x: 530, w: 75, h: 155 },
  { x: 600, w: 50, h: 100 },
  { x: 645, w: 40, h: 85 },
  { x: 680, w: 60, h: 135 },
  { x: 735, w: 45, h: 95 },
  { x: 775, w: 80, h: 165 },
  { x: 850, w: 40, h: 80 },
  { x: 885, w: 60, h: 125 },
  { x: 940, w: 50, h: 105 },
  { x: 985, w: 70, h: 150 },
  { x: 1050, w: 40, h: 78 },
  { x: 1085, w: 55, h: 118 },
  { x: 1135, w: 45, h: 92 },
  { x: 1175, w: 80, h: 168 },
  { x: 1250, w: 50, h: 108 },
  { x: 1295, w: 40, h: 82 },
  { x: 1330, w: 65, h: 138 },
  { x: 1390, w: 55, h: 115 },
  { x: 1440, w: 75, h: 158 },
];

// Mid layer: medium buildings with some architectural detail
const MID_BUILDINGS = [
  { x: 0, w: 90, h: 200, hasSpire: false },
  { x: 85, w: 55, h: 165, hasSpire: false },
  { x: 135, w: 100, h: 245, hasSpire: true },
  { x: 230, w: 65, h: 185, hasSpire: false },
  { x: 290, w: 80, h: 210, hasSpire: false },
  { x: 365, w: 55, h: 170, hasSpire: false },
  { x: 415, w: 110, h: 270, hasSpire: true },
  { x: 520, w: 70, h: 195, hasSpire: false },
  { x: 585, w: 90, h: 230, hasSpire: false },
  { x: 670, w: 55, h: 160, hasSpire: false },
  { x: 720, w: 105, h: 260, hasSpire: true },
  { x: 820, w: 70, h: 200, hasSpire: false },
  { x: 885, w: 85, h: 220, hasSpire: false },
  { x: 965, w: 55, h: 175, hasSpire: false },
  { x: 1015, w: 95, h: 250, hasSpire: true },
  { x: 1105, w: 65, h: 190, hasSpire: false },
  { x: 1165, w: 85, h: 215, hasSpire: false },
  { x: 1245, w: 55, h: 168, hasSpire: false },
  { x: 1295, w: 100, h: 255, hasSpire: true },
  { x: 1390, w: 70, h: 205, hasSpire: false },
  { x: 1455, w: 50, h: 178, hasSpire: false },
];

// Near layer: tall, prominent foreground towers — Burj Khalifa-inspired
const NEAR_BUILDINGS = [
  { x: 30, w: 55, h: 280, hasSpire: false },
  { x: 120, w: 80, h: 360, hasSpire: true, spireH: 60 },
  { x: 240, w: 100, h: 420, hasSpire: true, spireH: 80 },  // tallest
  { x: 380, w: 60, h: 300, hasSpire: false },
  { x: 470, w: 90, h: 385, hasSpire: true, spireH: 70 },
  { x: 600, w: 55, h: 270, hasSpire: false },
  { x: 690, w: 110, h: 440, hasSpire: true, spireH: 90 },  // Burj-like
  { x: 840, w: 65, h: 310, hasSpire: false },
  { x: 940, w: 85, h: 375, hasSpire: true, spireH: 65 },
  { x: 1060, w: 100, h: 410, hasSpire: true, spireH: 75 },
  { x: 1195, w: 55, h: 285, hasSpire: false },
  { x: 1280, w: 90, h: 390, hasSpire: true, spireH: 72 },
  { x: 1400, w: 65, h: 320, hasSpire: false },
];

const VIEWBOX_W = 1520;
const VIEWBOX_H = 500;

function FarLayer() {
  return (
    <g opacity="0.55">
      {FAR_BUILDINGS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={VIEWBOX_H - b.h}
          width={b.w}
          height={b.h}
          fill="rgba(201,169,110,0.32)"
        />
      ))}
    </g>
  );
}

function MidLayer() {
  return (
    <g opacity="0.8">
      {MID_BUILDINGS.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={VIEWBOX_H - b.h}
            width={b.w}
            height={b.h}
            fill="rgba(20,28,48,0.75)"
            stroke="rgba(201,169,110,0.45)"
            strokeWidth="0.5"
          />
          {/* Window grid */}
          {Array.from({ length: Math.floor(b.h / 18) }).map((_, row) =>
            Array.from({ length: Math.floor(b.w / 16) }).map((_, col) => (
              <rect
                key={`w-${row}-${col}`}
                x={b.x + 5 + col * 16}
                y={VIEWBOX_H - b.h + 8 + row * 18}
                width={6}
                height={9}
                fill={seededRandom(i * 10000 + row * 100 + col) > 0.55 ? 'rgba(201,169,110,0.65)' : 'rgba(201,169,110,0.14)'}
                rx={0.5}
              />
            ))
          )}
          {b.hasSpire && (
            <polygon
              points={`${b.x + b.w / 2 - 4},${VIEWBOX_H - b.h} ${b.x + b.w / 2 + 4},${VIEWBOX_H - b.h} ${b.x + b.w / 2},${VIEWBOX_H - b.h - 28}`}
              fill="rgba(201,169,110,0.7)"
            />
          )}
        </g>
      ))}
    </g>
  );
}

function NearLayer() {
  return (
    <g>
      {NEAR_BUILDINGS.map((b, i) => {
        const spireH = b.spireH ?? 0;
        return (
          <g key={i}>
            {/* Main tower body */}
            <rect
              x={b.x}
              y={VIEWBOX_H - b.h}
              width={b.w}
              height={b.h}
              fill="rgba(16,22,40,0.82)"
              stroke="rgba(201,169,110,0.6)"
              strokeWidth="0.8"
            />
            {/* Setback detail — upper third narrowing */}
            <rect
              x={b.x + b.w * 0.15}
              y={VIEWBOX_H - b.h}
              width={b.w * 0.7}
              height={b.h * 0.35}
              fill="rgba(16,22,40,0.82)"
              stroke="rgba(201,169,110,0.4)"
              strokeWidth="0.5"
            />
            {/* Window grid */}
            {Array.from({ length: Math.floor((b.h * 0.6) / 20) }).map((_, row) =>
              Array.from({ length: Math.floor(b.w / 18) }).map((_, col) => (
                <rect
                  key={`w-${row}-${col}`}
                  x={b.x + 6 + col * 18}
                  y={VIEWBOX_H - b.h * 0.6 + row * 20}
                  width={7}
                  height={11}
                  fill={seededRandom(i * 10000 + row * 100 + col) > 0.45 ? 'rgba(201,169,110,0.75)' : 'rgba(201,169,110,0.16)'}
                  rx={0.5}
                />
              ))
            )}
            {/* Spire */}
            {b.hasSpire && (
              <>
                <line
                  x1={b.x + b.w / 2}
                  y1={VIEWBOX_H - b.h}
                  x2={b.x + b.w / 2}
                  y2={VIEWBOX_H - b.h - spireH}
                  stroke="rgba(201,169,110,0.9)"
                  strokeWidth="1.5"
                />
                {/* Spire tip glow dot */}
                <circle
                  cx={b.x + b.w / 2}
                  cy={VIEWBOX_H - b.h - spireH}
                  r="2"
                  fill="#C9A96E"
                  opacity="0.9"
                />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function CitySkyline() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax — each layer moves at different speed as user scrolls
  const farY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const nearY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);

  // Fade in on scroll into view
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0.4]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden" style={{ background: '#0A0E1A' }}>

      <motion.div
        style={{ opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201,169,110,0.0)" />
              <stop offset="100%" stopColor="rgba(201,169,110,0.12)" />
            </linearGradient>
          </defs>

          {/* Sky background tint */}
          <rect x="0" y="0" width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#skyGrad)" />

          {/* Far layer — slowest parallax */}
          <motion.g style={{ y: farY }}>
            <FarLayer />
          </motion.g>

          {/* Mid layer */}
          <motion.g style={{ y: midY }}>
            <MidLayer />
          </motion.g>

          {/* Near layer — fastest parallax */}
          <motion.g style={{ y: nearY }}>
            <NearLayer />
          </motion.g>

        </svg>
      </motion.div>

    </div>
  );
}
