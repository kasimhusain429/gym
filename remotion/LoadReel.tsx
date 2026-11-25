import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from 'remotion';

/**
 * "Under Load" hero reel.
 * Hard cuts on a steady 1s pulse, each shot pushing in like a camera
 * leaning into the lift. The grade is baked in so the site needs no
 * CSS filters on the video. Loops cleanly: the last frame cuts to the first shot.
 */

type Shot = {
  src: string;
  /** focal point (0-1) used when cropping, so the athlete stays in frame */
  focusX: number;
  focusY: number;
  from: number;
  to: number;
};

const SHOT_FRAMES = 30;

const SHOTS: Shot[] = [
  { src: 'images/hero_poster.jpg', focusX: 0.42, focusY: 0.55, from: 1.0, to: 1.07 },
  { src: 'images/prog_hiit.jpg', focusX: 0.62, focusY: 0.5, from: 1.08, to: 1.02 },
  { src: 'images/phil_image.jpg', focusX: 0.5, focusY: 0.55, from: 1.0, to: 1.08 },
  { src: 'images/prog_coaching.jpg', focusX: 0.55, focusY: 0.55, from: 1.06, to: 1.0 },
  { src: 'images/fac_gym.jpg', focusX: 0.5, focusY: 0.55, from: 1.0, to: 1.07 },
  { src: 'images/prog_yoga.jpg', focusX: 0.42, focusY: 0.5, from: 1.07, to: 1.01 },
];

export const REEL_DURATION = SHOTS.length * SHOT_FRAMES;

type Props = { orientation: 'wide' | 'tall' };

const ShotView = ({ shot }: { shot: Shot }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SHOT_FRAMES], [shot.from, shot.to], {
    extrapolateRight: 'clamp',
  });
  // brief exposure "kick" on each cut
  const kick = interpolate(frame, [0, 4], [0.22, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1B1B1D', overflow: 'hidden' }}>
      <Img
        src={staticFile(shot.src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${shot.focusX * 100}% ${shot.focusY * 100}%`,
          transformOrigin: `${shot.focusX * 100}% ${shot.focusY * 100}%`,
          transform: `scale(${scale})`,
          filter: 'contrast(1.12) saturate(0.78) brightness(0.82)',
        }}
      />
      <AbsoluteFill style={{ backgroundColor: '#E7E5E1', opacity: kick }} />
    </AbsoluteFill>
  );
};

const Grain = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const x = Math.floor(random(`gx${seed}`) * 200);
  const y = Math.floor(random(`gy${seed}`) * 200);
  return (
    <AbsoluteFill
      style={{
        opacity: 0.16,
        mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundPosition: `${x}px ${y}px`,
      }}
    />
  );
};

export const LoadReel = ({ orientation }: Props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#1B1B1D' }}>
      {SHOTS.map((shot, i) => (
        <Sequence key={shot.src} from={i * SHOT_FRAMES} durationInFrames={SHOT_FRAMES}>
          <ShotView shot={shot} />
        </Sequence>
      ))}
      {/* cool shadow wash to sit the warm tungsten photos into the rubber palette */}
      <AbsoluteFill
        style={{
          background:
            orientation === 'wide'
              ? 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 35%, rgba(18,18,20,0.65) 100%)'
              : 'radial-gradient(ellipse 90% 60% at 50% 45%, transparent 30%, rgba(18,18,20,0.7) 100%)',
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};
