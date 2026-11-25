import { useCallback, useEffect, useState } from 'react';
import { Coaches } from './components/Coaches';
import { Disciplines } from './components/Disciplines';
import type { Prefill } from './components/EnquiryForm';
import { Ethos } from './components/Ethos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Join } from './components/Join';
import { Membership } from './components/Membership';
import { Results } from './components/Results';
import { Spaces } from './components/Spaces';
import { ScrollTrigger } from './lib/motion';
import { ScrollProvider, useScroll } from './lib/scroll';

function Site() {
  const { scrollTo } = useScroll();
  const [introDone, setIntroDone] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({ n: 0 });

  // Webfont metrics change heights and widths; re-measure every trigger once they land.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  /** Every call to action leads to the same enquiry form, pre-filled with what the visitor was looking at. */
  const requestPass = useCallback(
    (next: Omit<Prefill, 'n'> = {}) => {
      setPrefill((prev) => ({ ...next, n: prev.n + 1 }));
      scrollTo('join');
    },
    [scrollTo],
  );

  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <a className="skip-link" href="#join">
        Skip to the enquiry form
      </a>
      <Intro onDone={onIntroDone} />
      <Header onPass={() => requestPass()} />
      <main>
        <Hero ready={introDone} onPass={() => requestPass()} onExplore={() => scrollTo('disciplines')} />
        <Ethos />
        <Disciplines onEnquire={(discipline) => requestPass({ discipline })} />
        <Results />
        <Coaches onBook={(coach, discipline) => requestPass({ coach, discipline, pathway: 'coaching' })} />
        <Spaces />
        <Membership onEnquire={(pathway) => requestPass({ pathway })} />
        <Join prefill={prefill} />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

export default function App() {
  return (
    <ScrollProvider>
      <Site />
    </ScrollProvider>
  );
}
