import styles from './CaseStudy.module.css'

/**
 * Notes for the site owner about missing material. Rendered only in
 * development builds; the published site never shows them. The same items
 * remain out of public copy until there is evidence.
 */
export function OwnerNotes({ items }: { items?: string[] }) {
  if (!import.meta.env.DEV || !items || items.length === 0) return null
  return (
    <aside className={styles.owner} aria-label="Owner notes (development only)">
      <p className={styles.ownerHead}>Owner note, dev build only</p>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </aside>
  )
}
