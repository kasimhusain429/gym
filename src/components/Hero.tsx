import { useEffect, useRef, useState } from 'react';
import { gsap, MQ, useGSAP } from '../lib/motion';
import { useScroll } from '../lib/scroll';
import { Button } from './ui';

const LINES = ['Redefine', 'limits'];

type Props = {
  ready: boolean;
  onPass: () => void;
  onExplore: () => void;
};

export function Hero({ ready, onPass, onExplore }: Props) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reduced } = useScroll();
  const [tall] = useState(() => window.matchMedia('(max-aspect-ratio: 1/1)').matches);
  const reel = tall ? 'tall' : 'wide';
  const poster = `/video/poster-${reel}.webp`;

  // Play the reel only after the intro, and only while the hero is on screen.
  useEffect(() => {
    const el = video.current;
    if (!el || !ready || reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ready, reduced]);

  /*
   * Entrance and scroll motion drive separate, nested layers so they compose
   * instead of fighting: entrance → .hero__media / .hero__line / .hero__foot > *,
   * scroll → .hero__frame / .hero__title / .hero__foot.
   */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // hidden start state, set before first paint
        gsap.set('.hero__char > span', { yPercent: 108 });
        gsap.set('.hero__line', { '--wdth': 125 });
        gsap.set('.hero__media', { clipPath: 'inset(49.5% 0% 49.5% 0%)' });
        gsap.set('.hero__foot > *', { autoAlpha: 0, y: 24 });

        // Scroll: put the hero under load. Type compresses, the frame squeezes to a band.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.hero__pin',
              start: 'top top',
              end: '+=85%',
              pin: true,
              scrub: true,
              anticipatePin: 1,
            },
          })
          .fromTo('.hero__title', { '--wdth': 100 }, { '--wdth': 62, ease: 'none' }, 0)
          .fromTo(
            '.hero__frame',
            { clipPath: 'inset(0% 0% 0% 0%)' },
            { clipPath: 'inset(16% 0% 30% 0%)', ease: 'none' },
            0,
          )
          .fromTo('.hero__foot', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, ease: 'none', duration: 0.4 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Entrance: the bar-line slit opens, then the headline settles from wide to its set width.
        gsap
          .timeline()
          .to('.hero__media', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut' })
          .fromTo('.hero__frame', { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, 0.25)
          .to('.hero__char > span', { yPercent: 0, duration: 1.2, stagger: 0.035, ease: 'expo.out' }, 0.6)
          .to('.hero__line', { '--wdth': 100, duration: 1.7, ease: 'expo.out', clearProps: '--wdth' }, 0.6)
          .to('.hero__foot > *', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.05);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__pin">
        <div className="hero__media">
          <div className="hero__frame">
            {reduced ? (
              <img src={poster} alt="" width={tall ? 720 : 1280} height={tall ? 1280 : 720} fetchPriority="high" />
            ) : (
              <video
                ref={video}
                muted
                loop
                playsInline
                preload="metadata"
                poster={poster}
                aria-hidden="true"
                src={`/video/load-reel-${reel}.mp4`}
              />
            )}
          </div>
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <h1 className="hero__title" id="hero-title">
          <span className="sr-only">Redefine limits</span>
          {LINES.map((line, li) => (
            <span key={line} className={`hero__line hero__line--${li ? 'b' : 'a'}`} aria-hidden="true">
              {[...line].map((ch, i) => (
                <span className="hero__char" key={i}>
                  <span>{ch}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="hero__foot">
          <p className="lead hero__lead">
            HIIT & Strength, Power Yoga, Recovery and 1-on-1 Coaching, under one roof.
          </p>
          <div className="hero__ctas">
            <Button onClick={onPass}>Claim your pass</Button>
            <Button variant="ghost" onClick={onExplore}>
              Explore disciplines
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
