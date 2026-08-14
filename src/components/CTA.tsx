import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <motion.h2 
          className="cta-title text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          READY TO <br/>
          <span className="italic">COMMIT?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="cta-btn group">
            <span className="cta-btn-text">
              Claim Your Pass <ArrowRight className="cta-btn-icon" size={28} />
            </span>
            <div className="cta-btn-bg" />
          </button>
        </motion.div>
      </div>
      
      <div className="cta-footer">
        <motion.div 
          className="cta-marquee"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <span className="marquee-item">NO EXCUSES</span> • 
          <span className="marquee-item">PURE PERFORMANCE</span> • 
          <span className="marquee-item">ELEVATE YOUR STATE</span> • 
          <span className="marquee-item">NO EXCUSES</span> • 
          <span className="marquee-item">PURE PERFORMANCE</span> • 
          <span className="marquee-item">ELEVATE YOUR STATE</span> • 
          <span className="marquee-item">NO EXCUSES</span> • 
          <span className="marquee-item">PURE PERFORMANCE</span> • 
          <span className="marquee-item">ELEVATE YOUR STATE</span> • 
        </motion.div>
      </div>
    </section>
  );
}
