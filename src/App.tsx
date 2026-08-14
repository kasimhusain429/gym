import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Programs from './components/Programs';
import Transformations from './components/Transformations';
import Trainers from './components/Trainers';
import Facilities from './components/Facilities';
import CTA from './components/CTA';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical', 
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-background min-h-screen text-foreground">
      <Hero />
      <Philosophy />
      <Programs />
      <Transformations />
      <Trainers />
      <Facilities />
      <CTA />
    </main>
  );
}

export default App;
