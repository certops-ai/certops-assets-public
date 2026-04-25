import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { SectionLabel } from '../components/SectionLabel';

const METRICS = [
  { id: 'cosine-similarity', name: 'Cosine Similarity', type: 'DETERMINISTIC', score: 0.87, threshold: 0.75 },
  { id: 'hallucination', name: 'Hallucination', type: 'LLM JUDGE', score: 0.91, threshold: 0.85 },
  { id: 'rouge-l', name: 'ROUGE-L', type: 'DETERMINISTIC', score: 0.83, threshold: 0.70 },
  { id: 'answer-relevance', name: 'Answer Relevance', type: 'LLM JUDGE', score: 0.89, threshold: 0.80 },
] as const;

const STAGGER = 18;

type MetricType = typeof METRICS[number];

const MetricCard: React.FC<{
  metric: MetricType;
  delay: number;
  frame: number;
  fps: number;
}> = ({ metric, delay, frame, fps }) => {
  const cardProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const barProgress = spring({
    frame: frame - delay - 12,
    fps,
    config: { damping: 200 },
  });

  const scoreColor = metric.score >= 0.85 ? COLORS.green : '#f59e0b';
  const passFail = metric.score >= metric.threshold;

  const displayScore = Math.min(metric.score, barProgress * metric.score);

  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        padding: '28px',
        opacity: cardProgress,
        transform: `translateY(${interpolate(cardProgress, [0, 1], [20, 0])}px) scale(${interpolate(cardProgress, [0, 1], [0.94, 1])})`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: 8,
              letterSpacing: '-0.01em',
            }}
          >
            {metric.name}
          </div>
          <div
            style={{
              display: 'inline-flex',
              padding: '3px 10px',
              borderRadius: 6,
              background: metric.type === 'DETERMINISTIC' ? '#dbeafe' : '#ede9fe',
              color: metric.type === 'DETERMINISTIC' ? '#1d4ed8' : '#6d28d9',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {metric.type}
          </div>
        </div>
        {/* Hero score — larger and bolder */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: scoreColor,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayScore.toFixed(2)}
        </div>
      </div>

      {/* Score bar */}
      <div
        style={{
          height: 6,
          background: '#e2e8f0',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barProgress * metric.score * 100}%`,
            background: `linear-gradient(90deg, ${scoreColor}60, ${scoreColor})`,
            borderRadius: 3,
          }}
        />
      </div>

      {/* Threshold row */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>
          Threshold: {metric.threshold}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: passFail ? COLORS.green : '#ef4444',
            letterSpacing: '0.02em',
          }}
        >
          {passFail ? '✓ PASS' : '✗ FAIL'}
        </span>
      </div>
    </div>
  );
};

export const Metrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const taglineOpacity = interpolate(frame, [115, 140], [0, 1], {
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
      <SectionLabel label="Multi-tier scoring" />

      {/* 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          width: '100%',
        }}
      >
        {METRICS.map((metric, i) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            delay={i * STAGGER}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>

      {/* Bottom tagline — 3 evaluation tiers */}
      <div
        style={{
          marginTop: 22,
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 500,
          letterSpacing: '0.02em',
          opacity: taglineOpacity,
        }}
      >
        Deterministic gates · LLM judges · Regression checks
      </div>
    </AbsoluteFill>
  );
};
