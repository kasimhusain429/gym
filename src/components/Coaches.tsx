import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { COACHES, DISCIPLINES, PLATES } from '../data/club';
import { compressHeadings, gsap, MQ, useGSAP } from '../lib/motion';
import { Button, Photo } from './ui';

type Props = { onBook: (coachId: string, disciplineId: string) => void };

export function Coaches({ onBook }: Props) {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const coach = COACHES[active];
  const discipline = DISCIPLINES.find((d) => d.id === coach.disciplineId);

  const select = (i: number) => {
    if (i === active) return;
    setPrevious(active);
    setActive(i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (i + keys[e.key] + COACHES.length) % COACHES.length;
    select(next);
    tabs.current[next]?.focus();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => compressHeadings(root.current));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="coaches" id="coaches" ref={root} aria-labelledby="coaches-title">
      <div className="wrap">
        <header className="coaches__head">
          <h2 className="h2" id="coaches-title">
            <span>The</span>
            <span>architects</span>
          </h2>
          <p className="lead">Three coaches, three specialisms. Pick who you want in your corner.</p>
        </header>

        <div className="coaches__grid">
          <ul className="coach-list" role="tablist" aria-label="Coaches" aria-orientation="vertical">
            {COACHES.map((c, i) => (
              <li key={c.id} role="presentation">
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`coach-tab-${c.id}`}
                  aria-selected={i === active}
                  aria-controls="coach-panel"
                  tabIndex={i === active ? 0 : -1}
                  className="coach-tab"
                  style={{ '--plate': PLATES[c.plate].hex } as CSSProperties}
                  onClick={() => select(i)}
                  onMouseEnter={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="coach-tab__plate" aria-hidden="true" />
                  <span className="coach-tab__name">{c.first}</span>
                  <span className="coach-tab__role meta">
                    {c.first} {c.last}, {c.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            className="coach-card"
            id="coach-panel"
            role="tabpanel"
            aria-labelledby={`coach-tab-${coach.id}`}
            style={{ '--plate': PLATES[coach.plate].hex, '--plate-ink': PLATES[coach.plate].ink } as CSSProperties}
          >
            <div className="coach-frame">
              {COACHES.map((c, i) => (
                <Photo
                  key={c.id}
                  name={c.img}
                  portrait
                  eager
                  alt={i === active ? `${c.first} ${c.last}, ${c.role}` : ''}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={i === active ? 'is-active' : i === previous ? 'was-active' : undefined}
                />
              ))}
            </div>
            <div className="coach-card__info">
              <p>
                {coach.role}
                {discipline ? `, ${discipline.name}` : ''}
              </p>
              <Button plate={coach.plate} onClick={() => onBook(coach.id, coach.disciplineId)}>
                Train with {coach.first}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
