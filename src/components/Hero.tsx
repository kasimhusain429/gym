import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// --- PARALLAX TUNNEL UTILS ---
const SvgText = ({ z, isMask, highlight }: { z: number, isMask?: boolean, highlight?: boolean }) => {
  const textStyle = { 
    fontSize: 'clamp(3rem, 13vw, 12rem)', 
    fontWeight: 900, 
    fontFamily: 'var(--font-heading)', 
    letterSpacing: '-0.02em',
    filter: highlight ? 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.5))' : 'none'
  };

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: '-50%', left: '-50%', right: '-50%', bottom: '-50%', // Massive overflow to cover rotations
        transform: `translateZ(${z}px)`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {isMask ? (
          <>
            <defs>
              <mask id="front-mask">
                <rect width="100%" height="100%" fill="white" />
                <text x="50%" y="50%" dy="-0.4em" fill="black" textAnchor="middle" dominantBaseline="middle" style={textStyle}>REDEFINE</text>
                <text x="50%" y="50%" dy="0.5em" fill="black" textAnchor="middle" dominantBaseline="middle" style={textStyle}>LIMITS</text>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--color-background)" mask="url(#front-mask)" />
          </>
        ) : (
          <>
            <text x="50%" y="50%" dy="-0.4em" fill="none" stroke={highlight ? "var(--color-primary)" : "rgba(255,255,255,0.15)"} strokeWidth={highlight ? "4" : "3"} textAnchor="middle" dominantBaseline="middle" style={textStyle}>REDEFINE</text>
            <text x="50%" y="50%" dy="0.5em" fill="none" stroke={highlight ? "var(--color-primary)" : "rgba(255,255,255,0.15)"} strokeWidth={highlight ? "4" : "3"} textAnchor="middle" dominantBaseline="middle" style={textStyle}>LIMITS</text>
          </>
        )}
      </svg>
    </div>
  );
};

export default function Hero() {
  // Parallax Mouse Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      className="hero-section" 
      onMouseMove={handleMouseMove}
      style={{ 
        position: 'relative', 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        backgroundColor: 'var(--color-background)',
        display: 'flex'
      }}
    >
      
      {/* FULL SCREEN PANEL: Deep Parallax Typography Tunnel */}
      <div 
        style={{ 
          height: '100%', 
          width: '100%',
          position: 'relative', 
          overflow: 'hidden', 
          perspective: '1200px'
        }}
      >
        <motion.div
          initial={{ translateZ: -600, scale: 0.9 }}
          animate={{ translateZ: 0, scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY
          }}
        >
          {/* Deepest Layer: Cinematic Video */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '-30%', left: '-30%', right: '-30%', bottom: '-30%',
              transform: 'translateZ(-600px)',
              pointerEvents: 'none'
            }}
          >
            {/* Dark vignette blending into brand background */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 20%, var(--color-background) 85%)', zIndex: 10 }} />
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              poster="/images/hero_poster.jpg"
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                filter: 'contrast(1.1) brightness(0.8)' 
              }}
            />
          </div>
          
          {/* Tunnel Outlines */}
          <SvgText z={-400} highlight={true} />
          <SvgText z={-200} />
          <SvgText z={0} />
          <SvgText z={200} />

          {/* Front Solid Mask */}
          <SvgText z={400} isMask={true} />

        </motion.div>
      </div>

      {/* Floating Center CTA (Global) */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '4rem',
          zIndex: 50
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.0 }}
          style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
        >
          <button className="btn-primary" style={{ padding: '1.25rem 3.5rem', borderRadius: '4px', letterSpacing: '0.15em' }}>
            Start the Journey
          </button>

          <motion.div 
            style={{ color: 'var(--color-primary)' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={30} style={{ opacity: 0.8 }} />
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
