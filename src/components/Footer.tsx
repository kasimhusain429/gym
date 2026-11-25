import { useRef } from 'react';
import { SECTIONS } from '../data/club';
import { gsap, MQ, useGSAP } from '../lib/motion';
import { useScroll } from '../lib/scroll';

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // the load comes off: the wordmark releases from compressed to full width
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '.footer__word',
          { '--wdth': 62 },
          { '--wdth': 125, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer className="footer" ref={root}>
      <div className="wrap footer__top">
        <nav aria-label="Footer">
          <ul className="footer__nav">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollTo(s.id)}>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="footer__top-link" onClick={() => scrollTo(0)}>
          Back to top
        </button>
      </div>
      <span className="footer__word" aria-hidden="true">
        ULTRAFIT
      </span>
      <div className="wrap footer__legal meta">
        <span>© {new Date().getFullYear()} ULTRAFIT</span>
        <span>Performance & Recovery Club</span>
      </div>
    </footer>
  );
}
