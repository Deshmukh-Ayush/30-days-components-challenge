"use client"

import React from "react";
import { motion } from "motion/react";

interface Trace {
  d: string;
  duration: number;
  delay: number;
  repeatDelay: number;
}

const TRACES: Trace[] = [
  { d: "M 0 110 H 220 V 60 H 440 V 110 H 660 V 55 H 880 V 110 H 1200",               duration: 5.5, delay: 0,   repeatDelay: 3.5 },
  { d: "M 0 260 H 160 V 210 H 440 V 260 H 620 V 210 H 880 V 260 H 1060 V 210 H 1200", duration: 6.2, delay: 1.4, repeatDelay: 4.0 },
  { d: "M 0 390 H 220 V 340 H 440 V 390 H 660 V 440 H 880 V 390 H 1060 V 440 H 1200", duration: 5.8, delay: 2.6, repeatDelay: 3.5 },
  { d: "M 220 0 V 60 H 160 V 210 H 220 V 340 H 160 V 500",                            duration: 4.5, delay: 0.8, repeatDelay: 4.5 },
  { d: "M 440 0 V 110 H 460 V 260 H 440 V 390 H 460 V 500",                           duration: 4.8, delay: 2.1, repeatDelay: 4.0 },
  { d: "M 660 0 V 55 H 640 V 210 H 660 V 440 H 640 V 500",                            duration: 5.0, delay: 3.3, repeatDelay: 3.5 },
  { d: "M 880 0 V 110 H 900 V 210 H 880 V 340 H 900 V 500",                           duration: 4.2, delay: 0.5, repeatDelay: 5.0 },
  { d: "M 1060 0 V 210 H 1080 V 390 H 1060 V 500",                                   duration: 4.0, delay: 1.9, repeatDelay: 4.5 },
  { d: "M 0 55 H 160 V 0",                                                             duration: 2.8, delay: 1.0, repeatDelay: 6.0 },
  { d: "M 1080 0 V 60 H 1200",                                                         duration: 3.0, delay: 2.5, repeatDelay: 5.5 },
  { d: "M 0 440 H 160 V 500",                                                          duration: 3.2, delay: 3.8, repeatDelay: 6.0 },
  { d: "M 1060 440 H 1080 V 500",                                                     duration: 2.5, delay: 1.2, repeatDelay: 6.5 },
];

const JUNCTIONS = [
  { cx: 220, cy: 60  }, { cx: 160, cy: 60  },
  { cx: 440, cy: 110 }, { cx: 660, cy: 55  },
  { cx: 880, cy: 110 }, { cx: 160, cy: 210 },
  { cx: 620, cy: 210 }, { cx: 880, cy: 260 },
  { cx: 1060, cy: 210 }, { cx: 220, cy: 340 },
  { cx: 440, cy: 390 }, { cx: 660, cy: 440 },
  { cx: 880, cy: 390 }, { cx: 1060, cy: 390 },
];

const PULSE = 60;
const GAP   = 2000;

type Theme = "dark" | "light";

const THEME = {
  dark: {
    trace:      { stroke: "#3291FF", opacity: 0.08 },
    junction:   { fill: "#3291FF",   opacity: 0.15 },
    pulseBlue:  { stroke: "#3291FF", opacity: 0.5,  width: 1   },
    pulseWhite: { stroke: "#FFFFFF", opacity: 0.7,  width: 0.5 },
  },
  light: {
    trace:      { stroke: "#3291FF", opacity: 0.12 },
    junction:   { fill: "#3291FF",   opacity: 0.2  },
    pulseBlue:  { stroke: "#1a6fd4", opacity: 0.4,  width: 1   },
    pulseWhite: { stroke: "#3291FF", opacity: 0.6,  width: 0.5 },
  },
} satisfies Record<Theme, object>;

interface CircuitBackgroundProps {
  theme?: Theme;
  className?: string;
}

export default function CircuitBackground({
  theme = "dark",
  className = "",
}: CircuitBackgroundProps) {
  const t = THEME[theme];

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Junction pads */}
        {JUNCTIONS.map((j, i) => (
          <circle
            key={i}
            cx={j.cx} cy={j.cy} r={1.5}
            fill={t.junction.fill}
            opacity={t.junction.opacity}
          />
        ))}

        {TRACES.map((trace, i) => (
          <g key={i}>
            {/* Static base trace */}
            <path
              d={trace.d}
              stroke={t.trace.stroke}
              strokeWidth={0.4}
              strokeOpacity={t.trace.opacity}
              fill="none"
            />

            {/* Blue pulse */}
            <motion.path
              d={trace.d}
              stroke={t.pulseBlue.stroke}
              strokeWidth={t.pulseBlue.width}
              strokeLinecap="round"
              strokeOpacity={t.pulseBlue.opacity}
              fill="none"
              strokeDasharray={`${PULSE} ${GAP}`}
              initial={{ strokeDashoffset: GAP + PULSE }}
              animate={{ strokeDashoffset: -GAP }}
              transition={{
                duration: trace.duration,
                delay: trace.delay,
                repeat: Infinity,
                repeatDelay: trace.repeatDelay,
                ease: "linear",
              }}
            />

            {/* White core — shorter, sits ahead of blue */}
            <motion.path
              d={trace.d}
              stroke={t.pulseWhite.stroke}
              strokeWidth={t.pulseWhite.width}
              strokeLinecap="round"
              strokeOpacity={t.pulseWhite.opacity}
              fill="none"
              strokeDasharray={`${PULSE * 0.25} ${GAP}`}
              initial={{ strokeDashoffset: GAP + PULSE * 0.25 }}
              animate={{ strokeDashoffset: -GAP }}
              transition={{
                duration: trace.duration,
                delay: trace.delay,
                repeat: Infinity,
                repeatDelay: trace.repeatDelay,
                ease: "linear",
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}