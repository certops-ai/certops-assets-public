import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { SectionLabel } from '../components/SectionLabel';

const STEPS = [
  {
    id: 'attack',
    label: 'ATTACK',
    icon: '⚡',
    activateAt: 15,
    desc: 'Sending 247 requests',
    sub: 'to target endpoints',
    color: '#3b82f6',
  },
  {
    id: 'grade',
    label: 'GRADE',
    icon: '◈',
    activateAt: 65,
    desc: 'Evaluating responses',
    sub: 'with 3 LLM judges',
    color: '#8b5cf6',
  },
  {
    id: 'decide',
    label: 'DECIDE',
    icon: '✓',
    activateAt: 115,
    desc: 'Gate evaluation',
    sub: 'complete',
    color: COLORS.green,
  },
];

export const Engine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // DECIDE activates at 115, springs settled ~130 → tagline waits 15f more (0.5s hold)
  const subtitleOpacity = interpolate(frame, [145, 168], [0, 1], {
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
      <SectionLabel label="Attack — Grade — Decide" />

      {/* Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {STEPS.map((step, i) => {
          const activated = frame >= step.activateAt;
          const activationProgress = spring({
            frame: frame - step.activateAt,
            fps,
            config: { damping: 200 },
          });

          const cardOpacity = activated
            ? interpolate(activationProgress, [0, 1], [0.3, 1])
            : 0.15;

          const statusOpacity = interpolate(
            frame,
            [step.activateAt + 10, step.activateAt + 25],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          return (
            <>
              {/* Card */}
              <div
                key={step.id}
                style={{
                  flex: 1,
                  // Colored gradient tint from top when active — the "breath" effect
                  background: activated
                    ? `linear-gradient(180deg, ${step.color}08 0%, ${COLORS.surface} 55%)`
                    : COLORS.surface,
                  borderRadius: 16,
                  border: `1.5px solid ${activated ? step.color + '50' : COLORS.border}`,
                  padding: '32px 28px',
                  opacity: cardOpacity,
                  boxShadow: activated
                    ? `0 0 24px ${step.color}22, 0 4px 16px rgba(0,0,0,0.06)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontSize: 11,
                    color: step.color,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 16,
                    opacity: activated ? 1 : 0.4,
                  }}
                >
                  {`0${i + 1}`}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: `${step.color}12`,
                    border: `1px solid ${step.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    fontSize: 24,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLORS.textPrimary,
                    letterSpacing: '0.04em',
                    marginBottom: 12,
                  }}
                >
                  {step.label}
                </div>

                {/* Status */}
                <div style={{ opacity: statusOpacity }}>
                  <div style={{ fontSize: 13, color: step.color, fontWeight: 500 }}>
                    {step.desc}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
                    {step.sub}
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="32" height="12" viewBox="0 0 32 12">
                    <line
                      x1="0" y1="6" x2="24" y2="6"
                      stroke={COLORS.border}
                      strokeWidth="1.5"
                    />
                    <polygon points="24,2 32,6 24,10" fill={COLORS.border} />
                  </svg>
                </div>
              )}
            </>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          marginTop: 48,
          fontSize: 14,
          color: COLORS.textMuted,
          opacity: subtitleOpacity,
          letterSpacing: '0.03em',
          fontWeight: 500,
        }}
      >
        Automated · Reproducible · Blocking
      </div>
    </AbsoluteFill>
  );
};
