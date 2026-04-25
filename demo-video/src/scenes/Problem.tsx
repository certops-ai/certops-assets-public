import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

const HEADLINE = 'Does your AI actually work in production?';
const SUBTEXT = 'Hallucinations. Drift. Prompt injection. Zero audit trail.';
const CHAR_FRAMES = 2;
const CURSOR_BLINK = 8;

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const chars = Math.min(HEADLINE.length, Math.floor(frame / CHAR_FRAMES));
  const cursorVisible = Math.floor(frame / CURSOR_BLINK) % 2 === 0;
  const typingDone = chars >= HEADLINE.length;

  const subtextOpacity = interpolate(
    frame,
    [HEADLINE.length * CHAR_FRAMES + 15, HEADLINE.length * CHAR_FRAMES + 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Spotlight: fades in as typing starts
  const spotOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '0 120px',
      }}
    >
      {/* Radial spotlight — very subtle green-tinted center glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: spotOpacity,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(5,150,105,0.055) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          fontSize: 68,
          fontWeight: 800,
          color: COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          maxWidth: 900,
          position: 'relative',
        }}
      >
        {HEADLINE.slice(0, chars)}
        <span
          style={{
            opacity: typingDone ? 0 : cursorVisible ? 1 : 0,
            color: COLORS.green,
            marginLeft: 3,
            fontWeight: 300,
          }}
        >
          |
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          fontSize: 20,
          color: COLORS.textSecondary,
          opacity: subtextOpacity,
          fontWeight: 400,
          textAlign: 'center',
          lineHeight: 1.6,
          letterSpacing: '-0.005em',
          position: 'relative',
        }}
      >
        {SUBTEXT}
      </div>
    </AbsoluteFill>
  );
};
