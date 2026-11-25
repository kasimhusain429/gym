import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: 'power3.out' });

/** Media queries shared by CSS and gsap.matchMedia so layouts and motion never disagree. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktopMotion: '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
  mobileMotion: '(prefers-reduced-motion: no-preference) and (max-width: 1023.98px)',
} as const;

/**
 * Section headings arrive wide and compress to their set width as they rise
 * through the viewport: the same "under load" gesture as the hero, at a smaller scale.
 * Call inside a gsap.matchMedia(MQ.motion) block so it reverts cleanly.
 */
export function compressHeadings(scope: Element | null, selector = '.h2') {
  if (!scope) return;
  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el) => {
    gsap.fromTo(
      el,
      { '--wdth': 118 },
      {
        '--wdth': 72,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
      },
    );
  });
}

export { gsap, ScrollTrigger, useGSAP };
