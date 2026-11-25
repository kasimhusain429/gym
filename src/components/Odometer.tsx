import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/motion';

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const CELL_EM = 0.86; // keep in sync with .odo__reel > span height

type Props = { value: number; sign: string; unit: string };

/**
 * Mechanical drum counter. Only the units drum is driven; every other drum
 * turns only while the drum below it rolls from 9 to 0, so 39 → 40 carries
 * the tens drum over together, like a real counter.
 */
export function Odometer({ value, sign, unit }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const digits = String(value).length;

  useGSAP(
    () => {
      const reels = gsap.utils.toArray<HTMLElement>('.odo__reel', root.current);
      const render = (v: number) => {
        reels.forEach((reel, idx) => {
          const place = 10 ** (digits - 1 - idx);
          let pos: number;
          if (place === 1) {
            pos = v % 10;
          } else {
            const below = v % place;
            pos = Math.floor(v / place) % 10;
            if (below > place - 1) pos += below - (place - 1);
          }
          reel.style.transform = `translate3d(0, ${-pos * CELL_EM}em, 0)`;
        });
      };

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { v: 0 };
        render(0);
        gsap.to(state, {
          v: value,
          duration: 2.4,
          ease: 'power3.out',
          onUpdate: () => render(state.v),
          scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => render(value));
      return () => mm.revert();
    },
    { scope: root, dependencies: [value] },
  );

  return (
    <span className="odo" ref={root}>
      <span className="sr-only">
        {sign}
        {value}
        {unit}
      </span>
      <span aria-hidden="true" style={{ display: 'contents' }}>
        {sign && <span className="odo__affix">{sign}</span>}
        {Array.from({ length: digits }, (_, i) => (
          <span className="odo__drum" key={i}>
            <span className="odo__reel">
              {CELLS.map((n, c) => (
                <span key={c}>{n}</span>
              ))}
            </span>
          </span>
        ))}
        <span className="odo__affix odo__affix--unit">{unit}</span>
      </span>
    </span>
  );
}
