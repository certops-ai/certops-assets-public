import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

// 12 mutation types in 2-column layout, typewriter reveal on dark background
const MUTATIONS = [
  // Left column
  { name: 'out_of_scope',      desc: 'asks adjacent but forbidden topics' },
  { name: 'false_premise',     desc: 'embeds factually wrong assumptions' },
  { name: 'confidence_trap',   desc: 'demands certainty on ambiguity' },
  { name: 'contradictory',     desc: 'conflicts with known domain rules' },
  { name: 'authority_claim',   desc: 'claims special permission or role' },
  { name: 'prompt_probe',      desc: 'attempts to extract system prompt' },
  // Right column
  { name: 'persona_override',  desc: 'tries to redefine AI identity' },
  { name: 'escalation_bypass', desc: 'applies pressure to skip handoffs' },
  { name: 'context_bleed',     desc: 'accesses out-of-scope user data' },
  { name: 'staleness_probe',   desc: 'asks about time-sensitive data' },
  { name: 'tool_misuse',       desc: 'invokes agent tools unintentionally' },
  { name: 'injection_payload', desc: 'embeds instructions inside content' },
];

// Left column = indices 0–5, Right column = indices 6–11
// Both cells in a row start typing simultaneously, staggered by ROW_INTERVAL
const ROW_INTERVAL = 18;
const CHARS_PER_FRAME = 2;
const START_FRAME = 28;

const rowStart = (rowIndex: number) => START_FRAME + rowIndex * ROW_INTERVAL;
const nameFinishedAt = (name: string, rowIndex: number) =>
  rowStart(rowIndex) + Math.ceil(name.length / CHARS_PER_FRAME);

// Last row finishes: row 5 → rowStart(5) + ~9 = 28+90+9 = 127
const ALL_DONE_FRAME = 130;

export const MutationTypes: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [ALL_DONE_FRAME, ALL_DONE_FRAME + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const renderCell = (item: (typeof MUTATIONS)[number], rowIndex: number) => {
    const rStart = rowStart(rowIndex);
    const elapsed = Math.max(0, frame - rStart);
    const visibleChars = Math.min(item.name.length, elapsed * CHARS_PER_FRAME);
    const displayName = item.name.slice(0, visibleChars);

    const finishedAt = nameFinishedAt(item.name, rowIndex);
    const descOpacity = interpolate(frame, [finishedAt, finishedAt + 14], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const isTyping = visibleChars > 0 && visibleChars < item.name.length;
    const cursorVisible = isTyping || (frame < finishedAt + 4 && visibleChars === item.name.length);

    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minHeight: 28 }}>
        {/* Bullet — fades in when row starts */}
        <span
          style={{
            color: COLORS.green,
            fontSize: 14,
            fontFamily: COLORS.monoFont,
            flexShrink: 0,
            opacity: elapsed > 0 ? 1 : 0,
          }}
        >
          ✦
        </span>

        {/* Mutation name — typewriter */}
        <span
          style={{
            color: '#e2e8f0',
            fontSize: 14,
            fontFamily: COLORS.monoFont,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {displayName}
          {cursorVisible && (
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 13,
                background: COLORS.green,
                marginLeft: 1,
                verticalAlign: 'text-bottom',
                opacity: 0.85,
              }}
            />
          )}
        </span>

        {/* Description — fades in after name is done */}
        <span
          style={{
            color: COLORS.terminalComment,
            fontSize: 12,
            fontFamily: COLORS.monoFont,
            opacity: descOpacity,
          }}
        >
          — {item.desc}
        </span>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: COLORS.terminalBg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '48px 80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 32,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.green,
            fontFamily: COLORS.monoFont,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'rgba(5,150,105,0.1)',
            border: '1px solid rgba(5,150,105,0.25)',
            borderRadius: 100,
            padding: '5px 14px 5px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: COLORS.green,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          12 Attack Mutations
        </span>
      </div>

      {/* 2-column grid */}
      <div style={{ display: 'flex', gap: 48 }}>
        {/* Left column — items 0–5 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {MUTATIONS.slice(0, 6).map((item, i) => (
            <div key={item.name}>{renderCell(item, i)}</div>
          ))}
        </div>

        {/* Right column — items 6–11 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {MUTATIONS.slice(6).map((item, i) => (
            <div key={item.name}>{renderCell(item, i)}</div>
          ))}
        </div>
      </div>

      {/* Tagline — fades in after all mutations appear */}
      <div
        style={{
          marginTop: 36,
          fontSize: 13,
          color: COLORS.terminalComment,
          fontFamily: COLORS.monoFont,
          opacity: taglineOpacity,
          letterSpacing: '0.02em',
        }}
      >
        Every mutation is domain-grounded. Every output is a first-class test dataset.
      </div>
    </AbsoluteFill>
  );
};
