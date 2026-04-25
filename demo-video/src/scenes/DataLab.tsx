import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

const SLIDES = [
  { src: 'screenshots/datalab-datasets.png', label: 'Your test datasets' },
  { src: 'screenshots/datalab-new-job.png',  label: 'Generate adversarial variants' },
];

const STEP_FRAMES = 98;
const SLIDE_FRAMES = 12;

// Layout math (scene inner: 1152px wide, 640px tall):
// DataLab1 aspect = 3024/1584 = 1.909 → at W=1040: H=545px (most constraining)
// DataLab5 aspect = 3024/1608 = 1.881 → at W=1040: H=553px (clips 8px at bottom, fine)
// SectionLabel(48) + carousel(545) + dots(40) = 633px < 640px ✓
const CAROUSEL_W = 1040;
const CAROUSEL_H = 545;

export const DataLab: React.FC = () => {
  const frame = useCurrentFrame();

  const stepIndex = Math.min(SLIDES.length - 1, Math.floor(frame / STEP_FRAMES));
  const frameInStep = frame % STEP_FRAMES;
  const isSliding = stepIndex < SLIDES.length - 1 && frameInStep >= STEP_FRAMES - SLIDE_FRAMES;
  const slideProgress = isSliding ? (frameInStep - (STEP_FRAMES - SLIDE_FRAMES)) / SLIDE_FRAMES : 0;

  const getTranslateX = (i: number): number => {
    if (i < stepIndex) return -110;
    if (i === stepIndex) return isSliding ? -110 * slideProgress : 0;
    if (i === stepIndex + 1) return isSliding ? 110 - 110 * slideProgress : 110;
    return 110;
  };

  const containerY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const containerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slideFlash = isSliding ? 1 - slideProgress : 0;
  const breathe = (Math.sin(frame * 0.07) + 1) / 2;
  const glowOpacity = containerOpacity * (slideFlash * 0.55 + 0.15 + 0.15 * breathe);

  const taglineOpacity = interpolate(frame, [140, 168], [0, 1], {
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
      <SectionLabel label="Generate adversarial test data" />

      <div
        style={{
          width: CAROUSEL_W,
          height: CAROUSEL_H,
          position: 'relative',
          overflow: 'hidden',
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
          borderRadius: 12,
        }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              transform: `translateX(${getTranslateX(i)}%)`,
              overflow: 'hidden',
            }}
          >
            <BrowserFrame
              src={slide.src}
              glowColor={COLORS.green}
              glowOpacity={i === stepIndex ? glowOpacity : 0}
            />
          </div>
        ))}
      </div>

      {/* Slide indicator dots + current label */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: containerOpacity,
        }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.src} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: i === stepIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === stepIndex ? COLORS.green : COLORS.border,
              }}
            />
            {i === stepIndex && (
              <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>
                {slide.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom tagline — concrete output number */}
      <div
        style={{
          marginTop: 14,
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 500,
          letterSpacing: '0.02em',
          opacity: taglineOpacity,
        }}
      >
        200 rows in. 2,400 adversarial cases out.
      </div>
    </AbsoluteFill>
  );
};
