import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/motion';
import { useScroll } from '../lib/scroll';

const SEEN_KEY = 'ultrafit:intro-seen';

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * One orchestrated load moment: the wordmark compresses as a bar fills,
 * then the screen splits along that bar line to reveal the hero.
 * Plays once per session and never with reduced motion.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const { reduced, lock } = useScroll();
  const root = useRef<HTMLDivElement>(null);
  const [skip] = useState(() => reduced || hasSeenIntro());
  const [locked, setLocked] = useState(!skip);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    if (skip) onDone();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!locked) return;
    window.scrollTo(0, 0);
    lock(true);
    return () => lock(false);
  }, [locked, lock]);

  useGSAP(
    () => {
      if (skip) return;
      const tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });
      tl.to('.intro__bar > i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' })
        .to('.intro__word', { '--wdth': 62, duration: 0.9, ease: 'power3.inOut' }, 0)
        .to('.intro__center', { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, '+=0.05')
        .add(() => {
          setLocked(false);
          onDone();
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {
            /* storage unavailable: intro simply plays again next visit */
          }
        })
        .to('.intro__half--top', { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '<')
        .to('.intro__half--bottom', { yPercent: 100, duration: 1.05, ease: 'expo.inOut' }, '<');

      const timeout = new Promise((resolve) => setTimeout(resolve, 800));
      Promise.race([document.fonts.ready, timeout]).then(() => tl.play());
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bottom" />
      <div className="intro__center">
        <div className="intro__word">ULTRAFIT</div>
        <div className="intro__bar">
          <i />
        </div>
      </div>
    </div>
  );
}
