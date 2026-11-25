import { Composition } from 'remotion';
import { LoadReel, REEL_DURATION } from './LoadReel';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="LoadReelWide"
        component={LoadReel}
        durationInFrames={REEL_DURATION}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ orientation: 'wide' as const }}
      />
      <Composition
        id="LoadReelTall"
        component={LoadReel}
        durationInFrames={REEL_DURATION}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{ orientation: 'tall' as const }}
      />
    </>
  );
};
