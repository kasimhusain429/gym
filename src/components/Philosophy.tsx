import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Image Reveal Animations (Scroll 0 to 0.4)
  const clipPath = useTransform(scrollYProgress, [0, 0.4], ["inset(35% 35% 35% 35%)", "inset(0% 0% 0% 0%)"]);
  const filter = useTransform(scrollYProgress, [0, 0.4], ["grayscale(100%) brightness(0.4)", "grayscale(0%) brightness(1)"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);

  // Dark Overlay fades in after image reveals
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  
  // Cinematic Text Staggered Reveal (Scroll 0.45 to 0.8)
  const textOpacity1 = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const textY1 = useTransform(scrollYProgress, [0.45, 0.55], [40, 0]);
  
  const textOpacity2 = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const textY2 = useTransform(scrollYProgress, [0.5, 0.6], [40, 0]);

  const textOpacity3 = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
  const textY3 = useTransform(scrollYProgress, [0.55, 0.65], [40, 0]);
  
  const textOpacity4 = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  return (
    <section ref={containerRef} className="cinematic-section">
      <div className="cinematic-sticky">
        
        {/* Animated Image Wrapper */}
        <motion.div 
          className="cinematic-image-wrapper"
          style={{ 
            clipPath,
            filter,
          }}
        >
          <motion.img 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=3270&auto=format&fit=crop" 
            alt="Premium Gym Atmosphere" 
            className="cinematic-image"
            style={{ scale: imageScale }}
          />
          
          <motion.div 
            className="cinematic-bg-overlay"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        {/* Cinematic Text Content */}
        <div className="cinematic-content">
          <div className="cinematic-content-inner">
            
            <motion.div 
              className="cinematic-meta"
              style={{ opacity: textOpacity1, y: textY1 }}
            >
              Our Ethos
            </motion.div>
            
            <motion.h2 
              className="cinematic-heading"
              style={{ opacity: textOpacity2, y: textY2 }}
            >
              We don't just build bodies.<br/>
              <span className="text-primary" style={{ fontStyle: 'italic', fontWeight: 300 }}>We forge resilience.</span>
            </motion.h2>

            <motion.p 
              className="cinematic-body"
              style={{ opacity: textOpacity3, y: textY3 }}
            >
              Physical transformation is merely the catalyst. We cultivate systems and habits that guarantee consistent growth when willpower is depleted, elevating your entire state of being for a high-performance life.
            </motion.p>
            
            <motion.div 
              className="cinematic-footer"
              style={{ opacity: textOpacity4 }}
            >
              — The Founders
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
