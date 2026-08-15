import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';


const trainers = [
  { name: 'Marcus Vance', role: 'Head of Strength', img: '/images/trainer_marcus.jpg' },
  { name: 'Elena Rostova', role: 'Yoga Master', img: '/images/trainer_elena.jpg' },
  { name: 'David Chen', role: 'Mobility Specialist', img: '/images/trainer_david.jpg' },
];

function DesktopTrainers() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="trainers-list">
      {trainers.map((trainer, i) => (
        <div 
          key={i}
          className="trainer-row group"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <motion.div 
            className="trainer-img-container"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ 
              opacity: hoveredIndex === i ? 1 : 0,
              scale: hoveredIndex === i ? 1 : 0.8,
              rotate: hoveredIndex === i ? (i % 2 === 0 ? 5 : -5) : -10
            }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <img src={trainer.img} alt={trainer.name} className="trainer-img" />
          </motion.div>

          <div className="trainer-name-wrapper">
            <h3 className="trainer-name">{trainer.name}</h3>
          </div>
          
          <div className="text-muted trainer-role">
            {trainer.role}
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileTrainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<typeof trainers[0]>(trainers[0]);

  return (
    <div className="mobile-trainer-container">
      <div className="mobile-trainer-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTrainer.name}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="mobile-trainer-hero-img-wrap"
          >
            <img src={selectedTrainer.img} alt={selectedTrainer.name} />
            <div className="mobile-trainer-hero-overlay">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {selectedTrainer.name}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {selectedTrainer.role}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mobile-trainer-avatars">
        {trainers.map((trainer) => (
          <button
            key={trainer.name}
            className={`mobile-trainer-avatar ${selectedTrainer.name === trainer.name ? 'active' : ''}`}
            onClick={() => setSelectedTrainer(trainer)}
          >
            <img src={trainer.img} alt={trainer.name} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Trainers() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <section className="section-padding trainers-section">
      <div className="container">
        <h2 className="trainers-title">
          THE <span className="text-primary italic">ARCHITECTS</span>
        </h2>
        {isDesktop ? <DesktopTrainers /> : <MobileTrainers />}
      </div>
    </section>
  );
}
