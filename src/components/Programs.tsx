import { useState } from 'react';
import { motion } from 'framer-motion';

const programs = [
  { id: "01", title: 'HIIT & STRENGTH', desc: 'Maximize caloric burn and muscle growth.', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop' },
  { id: "02", title: 'POWER YOGA', desc: 'Builds heat, endurance, and flexibility.', img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop' },
  { id: "03", title: 'RECOVERY', desc: 'Active mobility and deep tissue techniques.', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop' },
  { id: "04", title: 'COACHING', desc: '1-on-1 bespoke programming tailored to you.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop' },
];

export default function Programs() {
  const [active, setActive] = useState<number>(0);

  return (
    <section className="programs-21st">
      <div className="container">
        <div className="programs-21st-header">
          <h2>CURATED <span className="text-primary italic">DISCIPLINES</span></h2>
          <p className="programs-21st-subtitle">Hover to explore our training modalities.</p>
        </div>

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
      </div>
    </section>
  );
}
