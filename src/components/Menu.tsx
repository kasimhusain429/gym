import { AnimatePresence, domAnimation, LazyMotion, m as motion } from 'motion/react';
import { useEffect, useRef, type CSSProperties } from 'react';
import { BAR_LOAD, PLATES, SECTIONS } from '../data/club';
import { useScroll } from '../lib/scroll';
import { Button } from './ui';

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onPass: () => void;
};

const plateFor = (id: string) => {
  const load = BAR_LOAD.find((b) => b.section === id);
  if (!load || load.plate === 'chalk') return 'var(--chalk)';
  return PLATES[load.plate].hex;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export function Menu({ open, onClose, onNavigate, onPass }: Props) {
  const { lock, reduced } = useScroll();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lock(true);
    const returnFocus = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('.menu__link')?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>('button, a[href]');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      lock(false);
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open, lock, onClose]);

  const d = reduced ? 0 : 1;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="site-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
            initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }}
            animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            exit={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            transition={{ duration: 0.8 * d, ease: EASE_IN_OUT }}
          >
            <div className="wrap menu__top">
              <span className="wordmark" aria-hidden="true">
                ULTRAFIT
              </span>
              <button type="button" className="menu-btn" onClick={onClose}>
                Close
              </button>
            </div>
            <ul className="wrap menu__list">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: '70%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: (0.28 + i * 0.05) * d, duration: 0.8 * d, ease: EASE_OUT }}
                >
                  <button
                    type="button"
                    className="menu__link"
                    style={{ '--plate': plateFor(s.id) } as CSSProperties}
                    onClick={() => onNavigate(s.id)}
                  >
                    <i aria-hidden="true" />
                    {s.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="wrap menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 * d, duration: 0.5 * d }}
            >
              <p className="meta" style={{ margin: 0 }}>
                HIIT & Strength, Power Yoga, Recovery and 1-on-1 Coaching
              </p>
              <Button onClick={onPass}>Claim your pass</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
