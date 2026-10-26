import type { Evidence } from '../../data/types'
import styles from './EvidenceMark.module.css'

const TEXT: Record<Evidence, { short: string; long: string }> = {
  verified: { short: 'observed', long: 'Observed by the researcher on a live public page; the date is given in the text.' },
  inspected: { short: 'from the files', long: 'Read by the researcher in the project\u2019s own documentation, source tree or test reports.' },
  stated: { short: 'per subject', long: 'The subject\u2019s own account; not yet independently checked.' },
  pending: { short: 'not obtained', long: 'Material not yet obtained.' },
}

/**
 * A small provenance mark: where a statement comes from.
 * The explanation is in the visible text and in the title for pointer users;
 * nothing essential is hover-only.
 */
export function EvidenceMark({ evidence, compact = false }: { evidence: Evidence; compact?: boolean }) {
  // Provenance is an editing aid for the site owner. The published site
  // carries no source labels; they appear only in development builds.
  if (!import.meta.env.DEV) return null
  const t = TEXT[evidence]
  return (
    <span className={compact ? `${styles.mark} ${styles.compact}` : styles.mark} data-evidence={evidence} title={t.long}>
      {t.short}
    </span>
  )
}

