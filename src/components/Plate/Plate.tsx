import type { Plate as PlateData } from '../../data/types'
import styles from './Plate.module.css'

const NATURE: Record<PlateData['nature'], string> = {
  screenshot: 'Screenshot',
  photograph: 'Photograph',
  illustration: 'Illustration',
  diagram: 'Diagram',
  awaiting: import.meta.env.DEV ? 'Plate reserved' : '',
}

/**
 * A numbered plate. Real images show as they are; illustrations are marked
 * as illustrations; an empty plate is a deliberate reserved frame and says
 * so, rather than pretending to be a screenshot.
 */
export function Plate({ plate, number }: { plate: PlateData; number: string }) {
  // Reserved frames are for the owner's eyes only; the published site skips them.
  if (!plate.src && !import.meta.env.DEV) return null
  const isPixel = plate.nature === 'illustration'
  return (
    <figure className={styles.plate} data-nature={plate.nature}>
      <div className={styles.frame}>
        {plate.src ? (
          <img
            src={plate.src}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            loading="lazy"
            decoding="async"
            className={isPixel ? styles.pixel : styles.img}
          />
        ) : import.meta.env.DEV ? (
          <div className={`${styles.reserved} tex-halftone`} role="img" aria-label={plate.alt}>
            <span className={styles.cross} aria-hidden="true" />
            <span className={styles.reservedText}>
              <span className="mono">Plate {number}</span>
              <span className={styles.reservedTitle}>Reserved</span>
            </span>
          </div>
        ) : null}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.num}>Pl. {number}</span>
        <span className={styles.kind}>{NATURE[plate.nature]}.</span> {plate.caption}
      </figcaption>
    </figure>
  )
}
