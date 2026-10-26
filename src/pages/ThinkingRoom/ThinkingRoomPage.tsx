import { Link } from 'react-router-dom'
import { articles, kindLabels, rumblingsEarlierCount, rumblingsHome, shelves } from '../../data/articles'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatDate } from '../../lib/format'
import styles from './ThinkingRoomPage.module.css'

/**
 * Sheet 03, The Thinking Room. Quieter than the rest of the machine:
 * paper, serif type, and an index that says plainly when a shelf is empty.
 */
export default function ThinkingRoomPage() {
  usePageTitle('Writing', {
    description: 'Essays, technical notes, research and Rumblings of a Fool by Tawanda Timire.',
  })
  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>Sheet 03</span>
        <span>The Thinking Room</span>
        <span>Essays, notes and research</span>
      </header>

      <section className={styles.head}>
        <h1 className="h1">
          The Thinking Room
          <span className={styles.plain}>Writing, research and ideas</span>
        </h1>
        <p className={styles.intro}>
          Where the machine is switched off and somebody thinks about it. Technical notes, research summaries, and{' '}
          <em>Rumblings of a Fool</em>, the subject&rsquo;s writing on belief, doubt, science and the other questions that do not
          compile.
        </p>
      </section>

      <div className={styles.shelves}>
        {shelves.map((shelf, i) => {
          const items = articles.filter(shelf.match)
          return (
            <section key={shelf.id} className={styles.shelf} aria-labelledby={`shelf-${shelf.id}`}>
              <p className={styles.shelfNo}>Shelf {i + 1}</p>
              <h2 id={`shelf-${shelf.id}`} className={styles.shelfTitle}>
                {shelf.id === 'rumblings' ? <em>{shelf.title}</em> : shelf.title}
              </h2>
              <p className={styles.shelfDesc}>{shelf.description}</p>
              {items.length > 0 ? (
                <ol className={styles.entries}>
                  {items.map((a) => {
                    const inner = (
                      <>
                        <span className={styles.entryMeta}>
                          {a.external ? 'On the blog' : kindLabels[a.kind]}
                          {a.date && (
                            <>
                              {' / '}
                              <time dateTime={a.date}>{formatDate(a.date)}</time>
                            </>
                          )}
                        </span>
                        <span className={styles.entryTitle}>{a.title}</span>
                        <span className={styles.entrySummary}>{a.summary}</span>
                      </>
                    )
                    return (
                      <li key={a.slug}>
                        {a.external ? (
                          <a href={a.external} className={styles.entry} rel="noopener">
                            {inner}
                          </a>
                        ) : (
                          <Link to={`/writing/${a.slug}`} className={styles.entry}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ol>
              ) : shelf.id === 'research' ? null : (
                <p className={styles.emptyShelf}>Nothing filed here yet.</p>
              )}
              {shelf.id === 'rumblings' && (
                <p className={styles.shelfMore}>
                  Plus {rumblingsEarlierCount} earlier pieces from April 2025.{' '}
                  <a href={rumblingsHome} className="go" rel="noopener">
                    The whole blog
                  </a>
                </p>
              )}
              {shelf.id === 'research' && (
                <ol className={styles.entries}>
                  <li>
                    <Link to="/projects/cricket-odi-prediction" className={styles.entry}>
                      <span className={styles.entryMeta}>Research sheet / BSc Honours, University of Zimbabwe</span>
                      <span className={styles.entryTitle}>Real-time ODI outcome prediction</span>
                      <span className={styles.entrySummary}>
                        Predicting One Day International results while the match is still being played.
                      </span>
                    </Link>
                  </li>
                </ol>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
