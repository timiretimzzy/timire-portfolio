import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { articleBySlug, kindLabels } from '../../data/articles'
import { projectBySlug } from '../../data/projects'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatDate } from '../../lib/format'
import NotFoundPage from '../NotFound/NotFoundPage'
import styles from './ArticlePage.module.css'

/**
 * A single piece of writing. Article bodies are Markdown files that ship
 * with the site (src/content/articles); they are authored content, not user
 * input, so rendering them as HTML is safe.
 */
export default function ArticlePage() {
  const { slug = '' } = useParams()
  const article = articleBySlug(slug)
  usePageTitle(article?.title ?? 'Sheet not found', {
    description: article?.summary,
    noIndex: !article,
    type: article && !article.external ? 'article' : 'website',
  })
  const html = useMemo(() => (article ? (marked.parse(article.body, { async: false }) as string) : ''), [article])

  if (!article) return <NotFoundPage />
  if (article.external) {
    return (
      <div className="sheet sheet-enter" style={{ paddingBlock: 'clamp(3rem, 8vw, 6rem)' }}>
        <p className="mono">Rumblings of a Fool</p>
        <h1 className={styles.title} style={{ margin: '1rem 0 1.5rem' }}>
          {article.title}
        </h1>
        <p className="lede" style={{ maxWidth: '30em', marginBottom: '2rem' }}>
          This piece lives on the blog.
        </p>
        <a href={article.external} className="go" rel="noopener">
          Read it there
        </a>
      </div>
    )
  }
  const related = article.related.map(projectBySlug).filter(Boolean)

  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>
          <Link to="/writing">Sheet 03, The Thinking Room</Link>
        </span>
        <span>{kindLabels[article.kind]}</span>
      </header>

      <article className={styles.article}>
        <header className={styles.head}>
          <p className={styles.meta}>
            {kindLabels[article.kind]}
            {article.date && (
              <>
                {' / '}
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </>
            )}
          </p>
          <h1 className={styles.title}>{article.title}</h1>
          {article.summary && <p className={styles.dek}>{article.summary}</p>}
        </header>

        <div className={`prose ${styles.body}`} dangerouslySetInnerHTML={{ __html: html }} />

        {related.length > 0 && (
          <aside className={styles.related} aria-label="Related sheets">
            <p className="mono">Related sheets</p>
            <ul className="plain-list">
              {related.map((p) => (
                <li key={p!.slug}>
                  <Link to={`/projects/${p!.slug}`}>
                    <span className="mono">No. {String(p!.item).padStart(2, '0')}</span> {p!.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <p className={styles.back}>
          <Link to="/writing" className="go">
            Back to the Thinking Room
          </Link>
        </p>
      </article>
    </div>
  )
}
