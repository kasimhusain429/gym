import { useRef } from 'react';
import { CONTACT, MANTRAS } from '../data/club';
import { compressHeadings, gsap, MQ, ScrollTrigger, useGSAP } from '../lib/motion';
import { EnquiryForm, type Prefill } from './EnquiryForm';

function MantraSet() {
  return (
    <>
      {[...MANTRAS, ...MANTRAS].map((m, i) => (
        <span className="marquee__item" key={i}>
          {m}
          <i />
        </span>
      ))}
    </>
  );
}

export function Join({ prefill }: { prefill: Prefill }) {
  const root = useRef<HTMLElement>(null);
  const contact = Object.entries({
    Address: CONTACT.address,
    Hours: CONTACT.hours,
    Phone: CONTACT.phone,
    Email: CONTACT.email,
  }).filter((entry): entry is [string, string] => !!entry[1]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        compressHeadings(root.current);
        // the mantra band runs on its own and surges with scroll speed
        const loop = gsap.to('.marquee__row', { xPercent: -50, ease: 'none', duration: 32, repeat: -1 });
        ScrollTrigger.create({
          trigger: '.marquee',
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 6);
            gsap.to(loop, {
              timeScale: boost,
              duration: 0.15,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true });
              },
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="join" id="join" ref={root} aria-labelledby="join-title">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__row">
          <MantraSet />
          <MantraSet />
        </div>
      </div>
      <div className="wrap">
        <h2 className="h2 join__title" id="join-title">
          <span>Ready to</span>
          <span>commit?</span>
        </h2>
        <div className="join__grid">
          <div className="join__aside">
            <p className="lead">Claim your pass. Tell us how you want to train and the team will take it from there.</p>
            <ol className="join__steps">
              <li>Send this form with what you want to train.</li>
              <li>We reply with membership rates and a time to come in.</li>
              <li>Walk in, meet your coach, start training.</li>
            </ol>
            {contact.length > 0 && (
              <dl className="contact">
                {contact.map(([label, value]) => (
                  <div key={label}>
                    <dt className="meta">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <EnquiryForm prefill={prefill} />
        </div>
      </div>
    </section>
  );
}
