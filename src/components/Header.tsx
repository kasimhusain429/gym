import { useCallback, useEffect, useState } from 'react';
import { BAR_LOAD, SECTIONS } from '../data/club';
import { ScrollTrigger, useGSAP } from '../lib/motion';
import { useScroll } from '../lib/scroll';
import { Menu } from './Menu';
import { Barbell, Button, barWeight } from './ui';

const ORDER: string[] = SECTIONS.map((s) => s.id);

export function Header({ onPass }: { onPass: () => void }) {
  const { scrollTo } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(y > 40);
        setHidden(self.direction === 1 && y > window.innerHeight * 0.8);
      },
    });
  });

  // Which section crosses the middle of the viewport decides how loaded the bar is.
  useEffect(() => {
    const targets = ['top', ...ORDER].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeIndex = active ? ORDER.indexOf(active) : -1;
  const loaded = BAR_LOAD.filter((b) => ORDER.indexOf(b.section) <= activeIndex).length;
  const kg = barWeight(loaded);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const navigate = useCallback(
    (id: string) => {
      setMenuOpen(false);
      requestAnimationFrame(() => scrollTo(id));
    },
    [scrollTo],
  );
  const passFromMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(onPass);
  }, [onPass]);

  return (
    <>
      <header className={`header${solid ? ' is-solid' : ''}${hidden && !menuOpen ? ' is-hidden' : ''}`}>
        <div className="wrap header__inner">
          <a
            href="#top"
            className="wordmark"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
          >
            ULTRAFIT
          </a>
          <div className="header__bar" aria-hidden="true" title={`${kg} kg on the bar`}>
            <Barbell loaded={loaded} />
            <span className="meta barbell__kg">{kg} kg</span>
          </div>
          <div className="header__actions">
            <Button size="sm" onClick={onPass}>
              Claim your pass
            </Button>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="menu-btn__icon" aria-hidden="true">
                <i />
                <i />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>
      <Menu open={menuOpen} onClose={closeMenu} onNavigate={navigate} onPass={passFromMenu} />
    </>
  );
}
