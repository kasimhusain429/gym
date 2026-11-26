import { useRef, useState } from 'react';
import { SPACES } from '../data/club';
import { gsap, MQ, useGSAP } from '../lib/motion';
import { useScroll } from '../lib/scroll';
import { Photo } from './ui';

export function Spaces() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useScroll();
  const [index, setIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const spaces = gsap.utils.toArray<HTMLElement>('.space');
        // explicit four-value insets: browsers shorten "inset(50% 0% 50% 0%)", which breaks interpolation
        const CLOSED = 'inset(50% 0% 50% 0%)';
        const OPEN = 'inset(0% 0% 0% 0%)';
        gsap.set(spaces.slice(1).map((s) => s.querySelectorAll('.space__cap > *')), { autoAlpha: 0, yPercent: 40 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.spaces__pin',
            start: 'top top',
            end: () => `+=${(spaces.length - 1) * window.innerHeight * 1.15}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setIndex(Math.min(spaces.length - 1, Math.round(self.progress * (spaces.length - 1) + 0.1))),
          },
        });

        // each room opens from the bar line over the one before it
        spaces.forEach((space, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.fromTo(space, { clipPath: CLOSED }, { clipPath: OPEN, ease: 'power2.inOut', duration: 1, immediateRender: true }, at)
            .fromTo(space.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1, ease: 'power2.out' }, at)
            .to(spaces[i - 1].querySelector('img'), { scale: 1.12, duration: 1 }, at)
            .to(spaces[i - 1].querySelectorAll('.space__cap > *'), { autoAlpha: 0, yPercent: -30, duration: 0.35 }, at)
            .to(space.querySelectorAll('.space__cap > *'), { autoAlpha: 1, yPercent: 0, stagger: 0.08, duration: 0.45, ease: 'power3.out' }, at + 0.55);
        });
        tl.to({}, { duration: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className={`spaces${reduced ? ' spaces--static' : ''}`} id="spaces" ref={root} aria-labelledby="spaces-title">
      <div className="spaces__pin">
        <div className="spaces__title">
          <h2 id="spaces-title">Engineered for greatness</h2>
          <ol className="spaces__index meta" aria-hidden="true">
            {SPACES.map((s, i) => (
              <li key={s.id} className={i === index ? 'is-active' : undefined}>
                {s.name}
              </li>
            ))}
          </ol>
        </div>
        <div className="spaces__stage">
          {SPACES.map((s, i) => (
            <figure className="space" key={s.id}>
              <Photo name={s.img} alt={s.alt} sizes="100vw" eager />
              <figcaption className="space__cap">
                <h3 className="space__name">{s.name}</h3>
                <p className="space__line">{s.line}</p>
              </figcaption>
              {i === 0 && <span className="sr-only">Three spaces follow.</span>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
