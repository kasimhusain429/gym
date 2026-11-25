import { useRef } from 'react';
import { RESULTS } from '../data/club';
import { compressHeadings, gsap, MQ, useGSAP } from '../lib/motion';
import { Odometer } from './Odometer';

export function Results() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        compressHeadings(root.current);
        // rules draw across as each figure arrives
        gsap.utils.toArray<HTMLElement>('.result').forEach((row) => {
          gsap.fromTo(
            row,
            { '--rule': 0 },
            { '--rule': 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%', once: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="results chalk" id="results" ref={root} aria-labelledby="results-title">
      <div className="wrap">
        <header className="results__head">
          <h2 className="h2" id="results-title">
            <span>Measurable</span>
            <span>impact</span>
          </h2>
          <p className="lead">We don't guess. We track, analyze and optimize your performance for results that last.</p>
        </header>
        {RESULTS.map((r) => (
          <div className="result" key={r.id}>
            <Odometer value={r.value} sign={r.sign} unit={r.unit} />
            <p className="result__label">{r.label}</p>
          </div>
        ))}
        <p className="results__note meta">Averages reported by ULTRAFIT.</p>
      </div>
    </section>
  );
}
