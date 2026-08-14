import { motion } from 'framer-motion';
import { useState } from 'react';

const trainers = [
  { name: 'Marcus Vance', role: 'Head of Strength', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop' },
  { name: 'Elena Rostova', role: 'Yoga Master', img: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop' },
  { name: 'David Chen', role: 'Mobility Specialist', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop' },
];

export default function Trainers() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding trainers-section">
      <div className="container">
        <h2 className="trainers-title">
          THE <span className="text-primary italic">ARCHITECTS</span>
        </h2>
        
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
      </div>
    </section>
  );
}
