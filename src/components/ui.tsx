import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { BAR_LOAD, PLATES, type PlateId } from '../data/club';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'chalk' | 'ghost' | 'ink';
  size?: 'md' | 'sm';
  plate?: PlateId;
};

/** Pill button whose label rolls over as a plate-coloured fill rises behind it. */
export function Button({ variant = 'chalk', size = 'md', plate, className, children, style, ...rest }: ButtonProps) {
  const cls = ['btn', variant !== 'chalk' && `btn--${variant}`, size === 'sm' && 'btn--sm', className]
    .filter(Boolean)
    .join(' ');
  const plateStyle = plate
    ? ({ '--plate': PLATES[plate].hex, '--plate-ink': PLATES[plate].ink } as CSSProperties)
    : undefined;
  return (
    <button type="button" className={cls} style={{ ...plateStyle, ...style }} {...rest}>
      <span className="btn__disc" aria-hidden="true" />
      <span className="btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </button>
  );
}

type PhotoProps = {
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  portrait?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Responsive WebP image generated from the club's original photography. */
export function Photo({ name, alt, sizes = '100vw', priority, portrait, className, style }: PhotoProps) {
  const big = portrait ? 896 : 1376;
  return (
    <img
      src={`/img/${name}-1376.webp`}
      srcSet={`/img/${name}-720.webp 720w, /img/${name}-1376.webp ${big}w`}
      sizes={sizes}
      alt={alt}
      width={portrait ? 896 : 1376}
      height={portrait ? 1200 : 768}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={style}
    />
  );
}

const plateFill = (p: PlateId | 'chalk') => (p === 'chalk' ? '#E7E5E1' : PLATES[p].hex);

/**
 * Side view of a loaded barbell sleeve. `loaded` plates slide on from the right.
 * Used as the header's scroll-progress indicator and in the form's success state.
 */
export function Barbell({ loaded, width = 132, height = 30 }: { loaded: number; width?: number; height?: number }) {
  const cy = height / 2;
  let x = 34;
  const plates = BAR_LOAD.map((p, i) => {
    const w = i < 2 ? 6 : i < 4 ? 5 : 4;
    const rect = { x, w, h: (p.h / 26) * (height - 2), plate: p.plate, i };
    x += w + 1.5;
    return rect;
  });
  return (
    <svg className="barbell" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <rect x="0" y={cy - 1.25} width={width - 4} height="2.5" rx="1.25" fill="#6F6E73" />
      <rect x="24" y={cy - 6} width="6" height="12" rx="1.5" fill="#E7E5E1" />
      <rect x="31" y={cy - 2.5} width={width - 35} height="5" rx="2" fill="#8A898E" />
      {plates.map((p) => (
        <rect
          key={p.i}
          className={`barbell__plate${p.i < loaded ? ' is-on' : ''}`}
          x={p.x}
          y={cy - p.h / 2}
          width={p.w}
          height={p.h}
          rx="1.5"
          fill={plateFill(p.plate)}
          style={{ transitionDelay: `${p.i < loaded ? 0 : 0}ms` }}
        />
      ))}
    </svg>
  );
}

/** Total weight on the bar: 20 kg bar plus every loaded plate, mirrored on both sides. */
export function barWeight(loaded: number) {
  const plates = BAR_LOAD.slice(0, loaded).reduce((sum, p) => sum + p.kg, 0);
  return 20 + plates * 2;
}
