import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Run header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // CERTIFIED stamp — bouncy spring
  const stampProgress = spring({ frame: frame - 30, fps, config: { damping: 8 } });
  const stampOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Certificate screenshot — fades in from right
  const certOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const certX = interpolate(frame, [95, 120], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cert image: starts zoomed into the header area, slowly pulls back
  const certImgScale = interpolate(frame, [95, 240], [1.18, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const certImgY = interpolate(frame, [95, 240], [-8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow on cert screenshot: flashes when it appears, breathes in sync with stamp bounce
  const certFlash = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = (Math.sin((frame - 120) * 0.06) + 1) / 2;
  // Stamp's over-shoot drives an extra glow burst
  const stampOvershoot = Math.max(0, stampProgress - 1);
  const certGlow = certOpacity * (certFlash * 0.5 + 0.2 + 0.2 * breathe + stampOvershoot * 0.4);

  // Subtitle below stamp+cert row
  const subtitleOpacity = interpolate(frame, [115, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Details row
  const detailsOpacity = interpolate(frame, [148, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const detailsY = interpolate(frame, [148, 168], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Trust badge
  const badgeOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '0 60px',
      }}
    >
      {/* Run header */}
      <div
        style={{
          opacity: headerOpacity,
          fontSize: 14,
          color: COLORS.textMuted,
          letterSpacing: '0.04em',
          marginBottom: 32,
          fontFamily: COLORS.monoFont,
        }}
      >
        {'Run '}
        <span style={{ color: COLORS.textSecondary }}>#42</span>
        {' · '}
        <span style={{ color: COLORS.textSecondary }}>rag-pipeline-audit</span>
      </div>

      {/* Main row: stamp + certificate screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Left: CERTIFIED stamp */}
        <div
          style={{
            opacity: stampOpacity,
            transform: `scale(${stampProgress}) rotate(-2deg)`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.green,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '14px 36px',
              border: `5px solid ${COLORS.green}`,
              borderRadius: 8,
              lineHeight: 1,
              boxShadow: `0 0 50px ${COLORS.green}30, inset 0 0 40px ${COLORS.green}06`,
            }}
          >
            CERTIFIED
          </div>
        </div>

        {/* Right: Certificate detail screenshot */}
        <div
          style={{
            flex: 1,
            maxWidth: 560,
            opacity: certOpacity,
            transform: `translateX(${certX}px)`,
          }}
        >
          <BrowserFrame
            src="screenshots/cert-pass.png"
            imageTransform={`scale(${certImgScale}) translateY(${certImgY}%)`}
            imageTransformOrigin="center top"
            glowColor={COLORS.green}
            glowOpacity={certGlow}
          />
        </div>
      </div>

      {/* Subtitle — Certificate of Conformity */}
      <div
        style={{
          opacity: subtitleOpacity,
          marginTop: 28,
          fontSize: 17,
          fontWeight: 500,
          color: COLORS.textPrimary,
          letterSpacing: '-0.005em',
        }}
      >
        Certificate of Conformity{' '}
        <span style={{ color: COLORS.textMuted }}>· cryptographically signed</span>
      </div>

      {/* Details row */}
      <div
        style={{
          opacity: detailsOpacity,
          transform: `translateY(${detailsY}px)`,
          marginTop: 14,
          display: 'flex',
          gap: 28,
          fontSize: 14,
          color: COLORS.textSecondary,
          alignItems: 'center',
        }}
      >
        <span>
          <span style={{ color: COLORS.green, fontWeight: 600 }}>4 / 4</span>
          {' components passed'}
        </span>
        <span style={{ color: COLORS.border }}>|</span>
        <span style={{ fontFamily: COLORS.monoFont, fontSize: 13 }}>
          🔐 ECDSA-SHA256 Signed
        </span>
      </div>

      {/* Trust badge */}
      <div
        style={{
          opacity: badgeOpacity,
          marginTop: 20,
          padding: '10px 22px',
          borderRadius: 32,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.surface,
          fontFamily: COLORS.monoFont,
          fontSize: 13,
          color: COLORS.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: COLORS.green,
            boxShadow: `0 0 8px ${COLORS.green}`,
          }}
        />
        {'certops.com/verify/'}
        <span style={{ color: COLORS.green }}>c7f3a9b142</span>
      </div>
    </AbsoluteFill>
  );
};
