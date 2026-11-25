import { useRef, type CSSProperties } from 'react';
import { BAR_LOAD, DISCIPLINES, PLATES, type Discipline } from '../data/club';
import { compressHeadings, gsap, MQ, useGSAP } from '../lib/motion';
import { Button, Photo } from './ui';

/** Competition colour code: red 25, blue 20, yellow 15, green 10. */
const plateKg = (d: Discipline) => BAR_LOAD.find((b) => b.plate === d.plate)?.kg ?? 0;

const nameLines = (name: string) => (name.includes('&') ? [name.slice(0, name.indexOf('&') + 1), name.slice(name.indexOf('&') + 2)] : name.split(' '));

function Plate({ d }: { d: Discipline }) {
  const rim = `rim-${d.id}`;
  const marking = `ULTRAFIT — ${d.name} — ${plateKg(d)} KG — `;
  return (
    <div className="plate" aria-hidden="true">
      <div className="plate__photo">
        <Photo name={d.img} alt="" sizes="(min-width: 1024px) 44vw, 86vw" />
      </div>
      <svg className="plate__rim" viewBox="0 0 400 400">
        <defs>
          <path id={rim} d="M200,200 m-184,0 a184,184 0 1,1 368,0 a184,184 0 1,1 -368,0" />
        </defs>
        <circle cx="200" cy="200" r="189" fill="none" stroke={PLATES[d.plate].hex} strokeWidth="22" />
        <circle cx="200" cy="200" r="177.5" fill="none" stroke="rgba(231,229,225,0.35)" strokeWidth="1" />
        <text fill={PLATES[d.plate].ink}>
          <textPath href={`#${rim}`} textLength="1150" lengthAdjust="spacing">
            {marking.repeat(2)}
          </textPath>
        </text>
      </svg>
      <div className="plate__hub" />
    </div>
  );
}

export function Disciplines({ onEnquire }: { onEnquire: (disciplineId: string) => void }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: the session runs sideways. Plates roll as they travel across the screen.
      mm.add(MQ.desktopMotion, () => {
        const track = root.current!.querySelector<HTMLElement>('.disc__track')!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.disc__pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>('.disc').forEach((panel) => {
          const pass = { trigger: panel, containerAnimation: travel, start: 'left right', end: 'right left', scrub: true };
          gsap.fromTo(panel.querySelector('.plate__rim'), { rotate: -100 }, { rotate: 100, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: pass });
          gsap.fromTo(panel.querySelector('.plate__photo img'), { xPercent: -6, scale: 1.18 }, { xPercent: 6, scale: 1.18, ease: 'none', scrollTrigger: pass });
          gsap.fromTo(
            panel.querySelector('.disc__name'),
            { '--wdth': 125 },
            { '--wdth': 66, ease: 'none', scrollTrigger: { ...pass, end: 'left 15%' } },
          );
        });
      });

      // Mobile: a vertical run of plates, each rolling as it passes.
      mm.add(MQ.mobileMotion, () => {
        gsap.utils.toArray<HTMLElement>('.disc').forEach((panel) => {
          const pass = { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true };
          gsap.fromTo(panel.querySelector('.plate__rim'), { rotate: -80 }, { rotate: 80, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: pass });
          gsap.fromTo(
            panel.querySelector('.disc__name'),
            { '--wdth': 118 },
            { '--wdth': 66, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 85%', end: 'top 25%', scrub: true } },
          );
        });
      });

      mm.add(MQ.motion, () => compressHeadings(root.current));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="disciplines" id="disciplines" ref={root} aria-labelledby="disciplines-title">
      <div className="disc__pin">
        <div className="disc__track">
          <header className="disc__intro">
            <h2 className="h2" id="disciplines-title">
              <span>Choose your</span>
              <span>discipline</span>
            </h2>
            <p className="lead">Four ways to train, colour-coded like the plates on a competition bar.</p>
            <ul className="legend meta" aria-label="Colour key">
              {DISCIPLINES.map((d) => (
                <li key={d.id}>
                  <i style={{ '--plate': PLATES[d.plate].hex } as CSSProperties} aria-hidden="true" />
                  {d.name}
                </li>
              ))}
            </ul>
          </header>

          {DISCIPLINES.map((d) => (
            <article
              key={d.id}
              className="disc"
              aria-labelledby={`disc-${d.id}`}
              style={{ '--plate': PLATES[d.plate].hex, '--plate-ink': PLATES[d.plate].ink } as CSSProperties}
            >
              <Plate d={d} />
              <h3 className="disc__name" id={`disc-${d.id}`} aria-label={d.name}>
                {nameLines(d.name).map((line) => (
                  <span key={line} aria-hidden="true">
                    {line}
                  </span>
                ))}
              </h3>
              <div className="disc__body">
                <p className="disc__line">{d.line}</p>
                <ul className="disc__focus" aria-label={`${d.name} focus`}>
                  {d.focus.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button plate={d.plate} onClick={() => onEnquire(d.id)}>
                  Enquire about {d.name}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
