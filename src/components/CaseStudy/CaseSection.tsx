import type { ReactNode } from 'react'
import type { CaseSection as Data } from '../../data/types'
import { EvidenceMark } from '../Evidence/EvidenceMark'
import { OwnerNotes } from './OwnerNotes'
import { hasContent } from './hasContent'
import styles from './CaseStudy.module.css'

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  )
}

/** One numbered section of a case study. Empty sections say so in one line. */
export function CaseSection({ n, title, data, children }: { n: number; title: string; data?: Data; children?: ReactNode }) {
  const empty = !hasContent(data) && !children
  // Published builds leave out sections with nothing to say yet.
  if (empty && !import.meta.env.DEV) return null
  return (
    <section className={styles.section} aria-labelledby={`cs-${n}`}>
      <h2 id={`cs-${n}`} className={styles.sectionHead}>
        <span className={styles.sectionNum}>{String(n).padStart(2, '0')}</span>
        <span>{title}</span>
      </h2>
      <div className={styles.sectionBody}>
        {data?.body && (
          <div className="prose">
            <Paragraphs text={data.body} />
          </div>
        )}
        {data?.facts && data.facts.length > 0 && (
          <ul className={styles.facts}>
            {data.facts.map((f) => (
              <li key={f.text}>
                {f.text}
                <EvidenceMark evidence={f.evidence} compact />
              </li>
            ))}
          </ul>
        )}
        {children}
        {import.meta.env.DEV && empty && <p className={styles.toFollow}>To follow.</p>}
        {import.meta.env.DEV && <OwnerNotes items={data?.awaiting} />}
      </div>
    </section>
  )
}
