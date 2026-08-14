import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const results = [
  { metric: "+40%", label: "Strength Increase", desc: "Average member strength gain in 90 days." },
  { metric: "-12%", label: "Body Fat", desc: "Average body fat reduction across all members." },
  { metric: "100+", label: "Classes Weekly", desc: "A schedule designed for any lifestyle." },
];

export default function Transformations() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  return (
    <section ref={ref} className="section-padding transformations-section">
      <div className="container transformations-container">
        <div className="transformations-header">
          <motion.h2 
            className="transformations-title"
            style={{ opacity: scrollYProgress, y: useTransform(scrollYProgress, [0, 1], [100, 0]) }}
          >
            NOT JUST SWEAT. <br/>
            <span className="text-primary italic">MEASURABLE IMPACT.</span>
          </motion.h2>
          
          <motion.p 
            className="text-muted transformations-desc"
            style={{ opacity: scrollYProgress }}
          >
            We don't guess. We track, analyze, and optimize your performance to guarantee results that last.
          </motion.p>
        </div>

        <div className="transformations-grid">
          {results.map((result, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="transformation-item"
            >
              <span className="transformation-metric">
                {result.metric}
              </span>
              <h3 className="transformation-label">{result.label}</h3>
              <p className="text-muted transformation-text">{result.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="transformations-bg-text-wrapper">
        <motion.span 
          className="transformations-bg-text"
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, -500]) }}
        >
          TRANSFORM TRANSFORM TRANSFORM
        </motion.span>
      </div>
    </section>
  );
}
