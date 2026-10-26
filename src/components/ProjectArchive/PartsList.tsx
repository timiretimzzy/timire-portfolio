import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { kindLabels, statusLabels } from '../../data/projects'
import { EvidenceMark } from '../Evidence/EvidenceMark'
import styles from './PartsList.module.css'

interface Props {
  projects: Project[]
  caption: string
  /** Mechanism to mark in the Mech. column, if any. */
  mark?: string
}

/**
 * The bill of materials: projects as rows in a parts list, the way a manual
 * lists components. Becomes stacked entries on narrow screens.
 */
export function PartsList({ projects, caption, mark }: Props) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.colItem}>
              Item
            </th>
            <th scope="col">Part</th>
            <th scope="col" className={styles.colKind}>
              Kind
            </th>
            <th scope="col" className={styles.colMech}>
              Mech.
            </th>
            <th scope="col" className={styles.colStatus}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} className={p.parent ? styles.child : undefined}>
              <td className={styles.colItem} data-label="Item">
                {String(p.item).padStart(2, '0')}
              </td>
              <th scope="row" className={styles.part}>
                <Link to={`/projects/${p.slug}`} className={styles.partLink}>
                  {p.name}
                </Link>
                <span className={styles.summary}>{p.summary}</span>
              </th>
              <td className={styles.colKind} data-label="Kind">
                {kindLabels[p.kind]}
              </td>
              <td className={styles.colMech} data-label="Mechanisms">
                {p.mechanisms.map((m) => (
                  <span key={m} className={m === mark ? `${styles.mech} ${styles.mechOn}` : styles.mech}>
                    {m}
                  </span>
                ))}
              </td>
              <td className={styles.colStatus} data-label="Status">
                {statusLabels[p.status]}
                <EvidenceMark evidence={p.statusEvidence} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
