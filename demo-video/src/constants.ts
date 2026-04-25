export const COLORS = {
  bg: '#f7f7f5',         // warm off-white — depth without harshness
  surface: '#ffffff',    // cards sit on top of bg
  border: '#e5e5e2',     // warm-tinted border
  green: '#059669',
  textPrimary: '#09090b',   // Radix zinc-950 — richest black
  textSecondary: '#52525b',  // zinc-600
  textMuted: '#a1a1aa',     // zinc-400
  terminalBg: '#0d1117',
  terminalHeader: '#161b22',
  terminalBorder: '#30363d',
  terminalComment: '#8b949e',
  monoFont: "'Courier New', monospace",
} as const;

export const SCENE_DURATIONS = {
  problem: 210,          // 7s — extended hold after subtext
  identity: 150,         // 5s
  dashboard: 210,        // 7s
  wizard: 210,           // 7s
  adversarialHero: 150,  // 5s — big-type hero reveal
  mutationTypes: 210,    // 7s — 12 mutation types typewriter
  datalab: 210,          // 7s — DataLab: datasets + new job carousel
  config: 150,           // 5s (shortened)
  engine: 180,           // 6s — extended hold after DECIDE
  terminal: 180,         // 6s
  metrics: 150,          // 5s (shortened)
  verdict: 240,          // 8s (extended)
  cta: 150,              // 5s
} as const;

export const TRANSITION_FRAMES = 15;

// 2400 - 12 * 15 = 2220 frames = 74 seconds
export const TOTAL_DURATION =
  Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENE_DURATIONS).length - 1) * TRANSITION_FRAMES;
