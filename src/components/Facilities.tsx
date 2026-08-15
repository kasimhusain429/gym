import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const facilities = [
  { id: 1, title: 'Gym Floor', img: '/images/fac_gym.jpg' },
  { id: 2, title: 'Yoga Studio', img: '/images/fac_studio.jpg' },
  { id: 3, title: 'Recovery Room', img: '/images/fac_locker.jpg' },
];

function DesktopFacilities() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div ref={containerRef} className="facilities-grid">
      <motion.div className="facility-card facility-card-1" style={{ y: y1 }}>
        <img src={facilities[0].img} alt={facilities[0].title} className="facility-img" />
      </motion.div>
      <motion.div className="facility-card facility-card-2" style={{ y: y2 }}>
        <img src={facilities[1].img} alt={facilities[1].title} className="facility-img" />
      </motion.div>
      <motion.div className="facility-card facility-card-3" style={{ y: y3 }}>
        <img src={facilities[2].img} alt={facilities[2].title} className="facility-img" />
      </motion.div>
    </div>
  );
}

function MobileFacilities() {
  const [selectedFac, setSelectedFac] = useState<typeof facilities[0] | null>(null);

  return (
    <>
      <div className="mobile-grid">
        {facilities.map((fac) => (
          <motion.div
            key={fac.id}
            className="mobile-grid-item"
            onClick={() => setSelectedFac(fac)}
            whileTap={{ scale: 0.95 }}
            layoutId={`fac-img-${fac.id}`}
          >
            <img src={fac.img} alt={fac.title} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedFac && (
          <motion.div
            className="glass-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-modal-backdrop" onClick={() => setSelectedFac(null)} />
            <motion.div
              className="glass-modal-content"
              layoutId={`fac-img-${selectedFac.id}`}
            >
              <img src={selectedFac.img} alt={selectedFac.title} />

              <motion.button
                className="glass-modal-close"
                onClick={() => setSelectedFac(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              >
                <X size={24} />
              </motion.button>

              <motion.div
                className="glass-modal-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              >
                <h3 style={{ fontSize: '2rem' }}>{selectedFac.title}</h3>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Facilities() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <section className="facilities-section">
      <div className="container facilities-header">
        <h2>
          AN ENVIRONMENT <br />
          <span className="text-accent italic">ENGINEERED FOR GREATNESS</span>
        </h2>
      </div>

      {isDesktop ? (
        <DesktopFacilities />
      ) : (
        <div className="container">
          <MobileFacilities />
        </div>
      )}
    </section>
  );
}
