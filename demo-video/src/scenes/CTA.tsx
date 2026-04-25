import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const thesisOpacity = interpolate(frame, [42, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const ctaOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Orb breathes in sync with main entry
  const orbOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        overflow: 'hidden',
      }}
    >
      {/* Large background orb — green radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(5,150,105,0.09) 0%, rgba(5,150,105,0.03) 45%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          pointerEvents: 'none',
          opacity: orbOpacity,
        }}
      />

      {/* Domain */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoProgress})`,
          fontSize: 100,
          fontWeight: 900,
          letterSpacing: '-0.045em',
          lineHeight: 1,
          position: 'relative',
        }}
      >
        <span style={{ color: COLORS.textPrimary }}>cert</span>
        <span style={{ color: COLORS.green }}>ops</span>
        <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>.com</span>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          marginTop: 20,
          fontSize: 22,
          color: COLORS.textSecondary,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          position: 'relative',
        }}
      >
        The Universal AI Verifier
      </div>

      {/* Thesis line — closes the loop on Problem */}
      <div
        style={{
          opacity: thesisOpacity,
          marginTop: 14,
          fontSize: 15,
          color: COLORS.textMuted,
          fontStyle: 'italic',
          letterSpacing: '0.005em',
          position: 'relative',
        }}
      >
        From “Deploy and Hope” to “Certify and Ship.”
      </div>

      {/* CTA pill */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaProgress})`,
          marginTop: 52,
          padding: '16px 40px',
          borderRadius: 10,
          background: COLORS.green,
          color: 'white',
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: '-0.005em',
          boxShadow: `0 8px 32px rgba(5,150,105,0.3), 0 2px 8px rgba(5,150,105,0.2)`,
          position: 'relative',
        }}
      >
        Start verifying your AI today →
      </div>

      {/* Sub-tagline */}
      <div
        style={{
          opacity: ctaOpacity * 0.55,
          marginTop: 18,
          fontSize: 13,
          color: COLORS.textMuted,
          letterSpacing: '0.01em',
          position: 'relative',
        }}
      >
        No agent rebuilds. No SDK lock-in. Just verify.
      </div>
    </AbsoluteFill>
  );
};
