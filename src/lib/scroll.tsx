import Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { gsap, ScrollTrigger } from './motion';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(cb: () => void) {
  const mql = window.matchMedia(REDUCE_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  );
}

type ScrollApi = {
  reduced: boolean;
  scrollTo: (target: string | number) => void;
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

/**
 * Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger and Lenis
 * share a single frame loop. Disabled entirely for reduced motion; touch
 * devices keep native scrolling (Lenis' default).
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.11, smoothWheel: true });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (target: string | number) => {
      if (typeof target === 'number') {
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      const el = document.getElementById(target);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { duration: 1.6 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    },
    [lenis, reduced],
  );

  const lock = useCallback(
    (locked: boolean) => {
      document.documentElement.classList.toggle('is-locked', locked);
      if (lenis) {
        if (locked) lenis.stop();
        else lenis.start();
      }
    },
    [lenis],
  );

  const value = useMemo(() => ({ reduced, scrollTo, lock }), [reduced, scrollTo, lock]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScroll must be used inside ScrollProvider');
  return ctx;
}
