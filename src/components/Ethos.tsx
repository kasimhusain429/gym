import { useRef } from 'react';
import { gsap, MQ, useGSAP } from '../lib/motion';
import { Photo } from './ui';

const STATEMENT = "We don't just build bodies. We forge resilience.";

export function Ethos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // the statement is read into existence, word by word, as you scroll
        gsap.fromTo(
          '.ethos__word',
          // unread words stay at 3.2:1 contrast on chalk, so the statement is legible before it's "read"
          { color: '#7f7d79' },
          {
            color: '#1b1b1d',
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '.ethos__statement', start: 'top 82%', end: 'bottom 48%', scrub: true },
          },
        );
        // the photo opens from a thin bar line, echoing the hero
        const trigger = { trigger: '.ethos__figure', start: 'top 92%', end: 'center 55%', scrub: true };
        gsap.fromTo(
          '.ethos__figure',
          { clipPath: 'inset(47% 0% 47% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: trigger },
        );
        gsap.fromTo('.ethos__figure img', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: trigger });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="ethos chalk" id="ethos" ref={root} aria-label="Our ethos">
      <div className="wrap">
        <p className="ethos__statement">
          {STATEMENT.split(' ').map((word, i) => (
            <span className="ethos__word" key={i}>
              {word}
            </span>
          ))}
        </p>
        <figure className="ethos__figure">
          <Photo
            name="phil_image"
            alt="A member squatting a loaded barbell under the Iron & Grit wall"
            sizes="(min-width: 1680px) 1568px, 100vw"
            eager
          />
        </figure>
      </div>
    </section>
  );
}
