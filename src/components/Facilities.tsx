import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Facilities() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section ref={containerRef} className="facilities-section">
      <div className="container facilities-header">
        <h2>
          AN ENVIRONMENT <br/>
          <span className="text-accent italic">ENGINEERED FOR GREATNESS</span>
        </h2>
      </div>

      <div className="facilities-grid">
        <motion.div 
          className="facility-card facility-card-1"
          style={{ y: y1 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop" 
            alt="Gym weights"
            className="facility-img" 
          />
        </motion.div>
        
        <motion.div 
          className="facility-card facility-card-2"
          style={{ y: y2 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop" 
            alt="Studio space"
            className="facility-img" 
          />
        </motion.div>
        
        <motion.div 
          className="facility-card facility-card-3"
          style={{ y: y3 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=800&auto=format&fit=crop" 
            alt="Yoga class"
            className="facility-img" 
          />
        </motion.div>
      </div>
    </section>
  );
}
