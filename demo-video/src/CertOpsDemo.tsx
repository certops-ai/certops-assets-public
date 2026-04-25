import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Audio } from '@remotion/media';
import { inter } from './fonts';
import { SCENE_DURATIONS, TRANSITION_FRAMES } from './constants';
import { Problem } from './scenes/Problem';
import { Identity } from './scenes/Identity';
import { Dashboard } from './scenes/Dashboard';
import { WizardShowcase } from './scenes/WizardShowcase';
import { DataLab } from './scenes/DataLab';
import { AdversarialHero } from './scenes/AdversarialHero';
import { MutationTypes } from './scenes/MutationTypes';
import { Config } from './scenes/Config';
import { Engine } from './scenes/Engine';
import { TerminalScene } from './scenes/TerminalScene';
import { Metrics } from './scenes/Metrics';
import { Verdict } from './scenes/Verdict';
import { CTA } from './scenes/CTA';

const FADE = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const CertOpsDemo: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: inter, background: '#f7f7f5' }}>
      <Audio
        src={staticFile('music/background.mp3')}
        loop
        volume={(f) =>
          interpolate(
            f,
            [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames],
            [0, 0.3, 0.3, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />

      {/* Scale 1280×720 design up to fill 1920×1080 canvas */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1280,
          height: 720,
          transformOrigin: 'top left',
          transform: 'scale(1.5)',
        }}
      >
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.problem}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.identity}>
          <Identity />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.dashboard}>
          <Dashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.config}>
          <Config />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.adversarialHero}>
          <AdversarialHero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.mutationTypes}>
          <MutationTypes />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.datalab}>
          <DataLab />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.wizard}>
          <WizardShowcase />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.engine}>
          <Engine />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.terminal}>
          <TerminalScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.metrics}>
          <Metrics />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.verdict}>
          <Verdict />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      </div>
    </AbsoluteFill>
  );
};
