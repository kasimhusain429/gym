import { useRef } from 'react';
import { PATHWAYS, PLATES, type PlateId } from '../data/club';
import { compressHeadings, gsap, MQ, useGSAP } from '../lib/motion';
import { Button } from './ui';

/** Each pathway is drawn as a bar loaded with the disciplines it includes. */
function MiniBar({ plates }: { plates: PlateId[] }) {
  return (
    <svg className="mini-bar" viewBox="0 0 168 56" aria-hidden="true">
      <rect x="0" y="26.5" width="164" height="3" rx="1.5" fill="#1B1B1D" />
      <rect x="22" y="19" width="6" height="18" rx="1.5" fill="#1B1B1D" />
      {plates.map((p, i) => (
        <g className="mini-bar__in" key={p}>
          <rect
            className="mini-bar__plate"
            style={{ ['--i' as string]: i }}
            x={32 + i * 13}
            y="3"
            width="11"
            height="50"
            rx="2.5"
            fill={PLATES[p].hex}
          />
        </g>
      ))}
    </svg>
  );
}

export function Membership({ onEnquire }: { onEnquire: (pathwayId: string) => void }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        compressHeadings(root.current);
        gsap.utils.toArray<HTMLElement>('.path').forEach((row) => {
          gsap.from(row.querySelectorAll('.mini-bar__in'), {
            x: 70,
            opacity: 0,
            stagger: 0.09,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 82%', once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="membership chalk" id="membership" ref={root} aria-labelledby="membership-title">
      <div className="wrap">
        <header className="membership__head">
          <h2 className="h2" id="membership-title">
            <span>Find your</span>
            <span>way in</span>
          </h2>
          <p className="lead">
            Every membership starts with a conversation about how you train. Rates are shared when you enquire.
          </p>
        </header>
        <ul className="paths">
          {PATHWAYS.map((p) => (
            <li className="path" key={p.id}>
              <MiniBar plates={p.plates} />
              <div>
                <h3 className="path__name">{p.name}</h3>
                <p className="path__summary">{p.summary}</p>
              </div>
              <ul className="path__includes" aria-label={`${p.name} includes`}>
                {p.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button variant="ink" onClick={() => onEnquire(p.id)}>
                Enquire about {p.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
