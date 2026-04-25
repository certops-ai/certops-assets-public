import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel (PASS) slides in from left
  const leftX = interpolate(frame, [10, 35], [-60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leftOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Right panel (FAIL) slides in from right
  const rightX = interpolate(frame, [25, 50], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Verdict pills spring in
  const passLabelProgress = spring({ frame: frame - 40, fps, config: { damping: 20, stiffness: 200 } });
  const failLabelProgress = spring({ frame: frame - 55, fps, config: { damping: 20, stiffness: 200 } });

  // Ken Burns zoom
  const leftImgScale = interpolate(frame, [40, 180], [1.0, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightImgScale = interpolate(frame, [55, 180], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Green glow on PASS panel: flashes as it lands, then breathes
  const leftFlash = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = (Math.sin(frame * 0.065) + 1) / 2;
  const leftGlow = leftOpacity * (leftFlash * 0.6 + 0.15 + 0.15 * breathe);

  // Red glow on FAIL panel: flashes as it lands, then holds dim
  const rightFlash = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightGlowFade = interpolate(frame, [70, 100], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightGlow = rightOpacity * rightFlash * rightGlowFade;

  const pipelineOpacity = interpolate(frame, [120, 148], [0, 1], {
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
        padding: '40px 64px',
      }}
    >
      <SectionLabel label="Wired into your CI/CD" />

      {/* Split layout */}
      <div style={{ display: 'flex', gap: 20, width: '100%', alignItems: 'flex-start' }}>
        {/* Left — PASS (green glow) */}
        <div style={{ flex: 1, opacity: leftOpacity, transform: `translateX(${leftX}px)` }}>
          <div
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'center',
              opacity: passLabelProgress,
              transform: `scale(${passLabelProgress})`,
            }}
          >
            <div
              style={{
                padding: '6px 20px',
                borderRadius: 24,
                background: '#dcfce7',
                border: `1px solid ${COLORS.green}`,
                color: COLORS.green,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              ✓ CERTIFIED
            </div>
          </div>
          <BrowserFrame
            src="screenshots/terminal-pass.png"
            imageTransform={`scale(${leftImgScale})`}
            imageTransformOrigin="top left"
            glowColor={COLORS.green}
            glowOpacity={leftGlow}
          />
        </div>

        {/* Right — FAIL (red glow) */}
        <div style={{ flex: 1, opacity: rightOpacity, transform: `translateX(${rightX}px)` }}>
          <div
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'center',
              opacity: failLabelProgress,
              transform: `scale(${failLabelProgress})`,
            }}
          >
            <div
              style={{
                padding: '6px 20px',
                borderRadius: 24,
                background: '#fef2f2',
                border: '1px solid #ef4444',
                color: '#ef4444',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              ✗ REJECTED
            </div>
          </div>
          <BrowserFrame
            src="screenshots/terminal-fail.png"
            imageTransform={`scale(${rightImgScale})`}
            imageTransformOrigin="top left"
            glowColor="#ef4444"
            glowOpacity={rightGlow}
          />
        </div>
      </div>

      {/* Pipeline diagram */}
      <div
        style={{
          marginTop: 22,
          fontSize: 13,
          color: COLORS.textMuted,
          fontFamily: COLORS.monoFont,
          letterSpacing: '0.02em',
          opacity: pipelineOpacity,
        }}
      >
        Build → Deploy (Staging) →{' '}
        <span style={{ color: COLORS.green, fontWeight: 600 }}>Certify</span>{' '}
        → Promote
      </div>
    </AbsoluteFill>
  );
};
