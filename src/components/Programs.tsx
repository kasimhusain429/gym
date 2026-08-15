import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const programs = [
  { id: "01", title: 'HIIT & STRENGTH', desc: 'Maximize caloric burn and muscle growth.', img: '/images/prog_hiit.jpg' },
  { id: "02", title: 'POWER YOGA', desc: 'Builds heat, endurance, and flexibility.', img: '/images/prog_yoga.jpg' },
  { id: "03", title: 'RECOVERY', desc: 'Active mobility and deep tissue techniques.', img: '/images/prog_recovery.jpg' },
  { id: "04", title: 'COACHING', desc: '1-on-1 bespoke programming tailored to you.', img: '/images/prog_coaching.jpg' },
];

function DesktopProgramsGallery() {
  const [active, setActive] = useState<number>(0);
  return (
    <div className="programs-gallery">
      {programs.map((program, index) => (
        <motion.div
          key={program.id}
          className={`program-gallery-card ${active === index ? 'active' : ''}`}
          onMouseEnter={() => setActive(index)}
          layout
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
        >
          <div
            className="program-gallery-bg"
            style={{ backgroundImage: `url(${program.img})` }}
          />
          <div className="program-gallery-overlay" />

          <div className="program-gallery-content">
            <div className="program-gallery-number">{program.id}</div>
            <div className="program-gallery-text-wrapper">
              <motion.h3 layout="position" className="program-gallery-title">{program.title}</motion.h3>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="program-gallery-desc"
                >
                  {program.desc}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MobileProgramsDeck() {
  const [cards, setCards] = useState(programs);

  const handleDragEnd = (_event: any, info: any) => {
    if (Math.abs(info.offset.x) > 80) {
      setCards((prev) => {
        const newCards = [...prev];
        const swipedCard = newCards.shift();
        if (swipedCard) newCards.push(swipedCard);
        return newCards;
      });
    }
  };

  return (
    <div className="mobile-deck-container">
      <AnimatePresence mode="popLayout">
        {cards.map((program, index) => {
          const isTop = index === 0;
          return (
            <motion.div
              key={program.id}
              className="mobile-deck-card"
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={isTop ? handleDragEnd : undefined}
              layout
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1 - index * 0.05,
                y: index * 15,
                zIndex: cards.length - index,
                opacity: 1 - index * 0.1
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="program-gallery-bg"
                style={{ backgroundImage: `url(${program.img})` }}
              />
              <div className="program-gallery-overlay" />

              <div className="program-gallery-content">
                <div className="program-gallery-number">{program.id}</div>
                <div className="program-gallery-text-wrapper">
                  <h3 className="program-gallery-title">{program.title}</h3>
                  <p className="program-gallery-desc" style={{ maxWidth: '100%' }}>{program.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function Programs() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <section className="programs-21st">
      <div className="container">
        <div className="programs-21st-header">
          <h2>CURATED <span className="text-primary italic">DISCIPLINES</span></h2>
          <p className="programs-21st-subtitle">
            {isDesktop ? 'Hover to explore our training modalities.' : 'Swipe to explore our training modalities.'}
          </p>
        </div>
        
        {isDesktop ? <DesktopProgramsGallery /> : <MobileProgramsDeck />}
      </div>
    </section>
  );
}
