import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CaseSection } from '../../components/CaseStudy/CaseSection'
import { hasContent } from '../../components/CaseStudy/hasContent'
import { OwnerNotes } from '../../components/CaseStudy/OwnerNotes'
import { EvidenceMark } from '../../components/Evidence/EvidenceMark'
import { Plate } from '../../components/Plate/Plate'
import { TechnicalDiagram } from '../../components/TechnicalDiagram/TechnicalDiagram'
import { articles } from '../../data/articles'
import { mechanismById, profile } from '../../data/profile'
import { kindLabels, projectBySlug, projects, statusLabels } from '../../data/projects'
import type { Project } from '../../data/types'
import { usePageTitle } from '../../hooks/usePageTitle'
import NotFoundPage from '../NotFound/NotFoundPage'
import styles from '../../components/CaseStudy/CaseStudy.module.css'

const SECTIONS: [keyof Project, string][] = [
  ['role', 'Role of the subject'],
  ['problem', 'Problem and who it is for'],
  ['constraints', 'Requirements and constraints'],
  ['architecture', 'Architecture and technology'],
  ['decisions', 'Implementation decisions'],
  ['challenges', 'Challenges, testing and trade-offs'],
  ['results', 'Results'],
]

function isUndrawn(p: Project) {
  return SECTIONS.every(([k]) => !hasContent(p[k] as Project['role']))
}

export default function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const project = projectBySlug(slug)
  usePageTitle(project?.name ?? 'Sheet not found', { description: project?.summary, noIndex: !project })

  if (!project) return <NotFoundPage />

  const view = params.get('view') === 'data' ? 'data' : 'full'
  const parent = project.parent ? projectBySlug(project.parent) : undefined
  const children = projects.filter((p) => p.parent === project.slug)
  const related = project.related.map(projectBySlug).filter(Boolean) as Project[]
  const writing = articles.filter((a) => a.related.includes(project.slug))
  const undrawn = isUndrawn(project)
  const itemNo = String(project.item).padStart(2, '0')

  const setView = (v: 'full' | 'data') => {
    const next = new URLSearchParams(params)
    if (v === 'full') next.delete('view')
    else next.set('view', 'data')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const allAwaiting = import.meta.env.DEV
    ? SECTIONS.flatMap(([k]) => (project[k] as Project['role']).awaiting ?? [])
    : []
  const plates = import.meta.env.DEV ? project.plates : project.plates.filter((pl) => pl.src)
  const visibleSections = SECTIONS.filter(([key]) => {
    if (import.meta.env.DEV) return true
    if (hasContent(project[key] as Project['role'])) return true
    return key === 'architecture' && (Boolean(project.diagram) || children.length > 0)
  })

  return (
    <article className={`${styles.page} sheet-enter`} data-accent={project.accent}>
      {/* ---------- Project band: each project gets its own ground ---------- */}
      <header className={styles.band}>
        <div className="sheet">
          <div className={styles.bandHead}>
            <span>Sheet 02.{itemNo}</span>
            <span>
              <Link to="/projects">The Machinery</Link> / {kindLabels[project.kind]}
            </span>
          </div>
          <div className={styles.bandGrid}>
            <p className={styles.itemNo} aria-hidden="true">
              <span className="misreg" data-text={itemNo}>
                {itemNo}
              </span>
            </p>
            <div className={styles.titleBlock}>
              {parent && (
                <p className={styles.parent}>
                  Sub-assembly of <Link to={`/projects/${parent.slug}`}>{parent.name}</Link>
                </p>
              )}
              <h1 className="h1">{project.name}</h1>
              <p className={styles.summary}>{project.summary}</p>
              <p className={styles.statusLine}>
                <span className="stamp">{statusLabels[project.status]}</span>
                {project.statusEvidence !== 'verified' && <EvidenceMark evidence={project.statusEvidence} />}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="sheet">
        <div className={styles.toolbar}>
          <div role="group" aria-label="Reading view" className={styles.viewSwitch}>
            <button type="button" aria-pressed={view === 'full'} onClick={() => setView('full')}>
              Full sheet
            </button>
            <button type="button" aria-pressed={view === 'data'} onClick={() => setView('data')}>
              Data sheet
            </button>
          </div>
          <p className="mono muted">
            {view === 'full' ? 'The full study of this system.' : 'The short version, for people with a shortlist.'}
          </p>
        </div>

        <div className={styles.layout}>
          {/* ---------- Main column ---------- */}
          <div className={styles.main}>
            {view === 'data' ? (
              <DataSheet project={project} />
            ) : import.meta.env.DEV && undrawn ? (
              <section className={styles.undrawn} aria-label="Sheet not yet drawn">
                <p className={styles.undrawnHead}>This sheet is not drawn yet.</p>
                <p>
                  {project.name} is on the parts list because it is real work. Its write-up will be done from the
                  repository and its tests, not guessed from its name, so for now this page holds the place.
                </p>
                <OwnerNotes items={allAwaiting} />
              </section>
            ) : (
              <>
                {visibleSections.map(([key, title], i) => (
                  <CaseSection key={key} n={i + 1} title={title} data={project[key] as Project['role']}>
                    {key === 'architecture' && project.diagram && <TechnicalDiagram id={project.diagram} />}
                    {key === 'architecture' && children.length > 0 && (
                      <ul className={styles.children}>
                        {children.map((c) => (
                          <li key={c.slug}>
                            <Link to={`/projects/${c.slug}`}>
                              <span className="mono">No. {String(c.item).padStart(2, '0')}</span> {c.name}
                            </Link>
                            <span className="muted"> {c.summary}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CaseSection>
                ))}
              </>
            )}

            {plates.length > 0 && (
              <section className={styles.plates} aria-labelledby="plates-h">
                <h2 id="plates-h" className={styles.sectionHead}>
                  <span className={styles.sectionNum}>Pl.</span>
                  <span>Plates</span>
                </h2>
                <div className={styles.plateGrid}>
                  {plates.map((pl, i) => (
                    <Plate key={i} plate={pl} number={`${itemNo}.${i + 1}`} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ---------- Margin: specification ---------- */}
          <aside className={styles.margin} aria-label="Specification">
            <dl className="spec">
              <dt>Item</dt>
              <dd>No. {itemNo}</dd>
              <dt>Kind</dt>
              <dd>{kindLabels[project.kind]}</dd>
              <dt>Status</dt>
              <dd>
                {statusLabels[project.status]}
                <EvidenceMark evidence={project.statusEvidence} compact />
              </dd>
              <dt>Mechanisms</dt>
              <dd>
                <ul className="plain-list">
                  {project.mechanisms.map((m) => (
                    <li key={m}>
                      <Link to={`/?m=${m}`}>
                        {m}. {mechanismById(m)?.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
              {project.stack.length > 0 && (
                <>
                  <dt>Stack</dt>
                  <dd>
                    <ul className="plain-list">
                      {project.stack.map((s) => (
                        <li key={s.name}>{s.name}</li>
                      ))}
                    </ul>
                    {project.stack.every((s) => s.evidence === 'stated') && <EvidenceMark evidence="stated" compact />}
                  </dd>
                </>
              )}
              {project.links.length > 0 && (
                <>
                  <dt>Links</dt>
                  <dd>
                    <ul className="plain-list">
                      {project.links.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} rel="noopener">
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}
            </dl>

            <section className={styles.enquiry} aria-labelledby="enq-h">
              <p id="enq-h" className={styles.enquiryHead}>
                {project.kind === 'commercial' || project.parent === 'fiscalstack' ? 'Enquiries about this system' : 'Contact the subject'}
              </p>
              <p className={styles.enquiryText}>
                Tawanda Timire
                <br />
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
                <br />
                <a href={profile.contact.whatsappHref}>WhatsApp {profile.contact.phoneDisplay}</a>
              </p>
            </section>

            {(related.length > 0 || writing.length > 0) && (
              <nav className={styles.related} aria-label="Related sheets">
                <p className={styles.relatedHead}>See also</p>
                <ul className="plain-list">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link to={`/projects/${r.slug}`}>
                        <span className="mono">{String(r.item).padStart(2, '0')}</span> {r.name}
                      </Link>
                    </li>
                  ))}
                  {writing.map((a) => (
                    <li key={a.slug}>
                      <Link to={`/writing/${a.slug}`}>
                        <span className="mono">Wr.</span> {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>

        <nav className={styles.pager} aria-label="Adjacent sheets">
          <Pager project={project} />
        </nav>
      </div>
    </article>
  )
}

function DataSheet({ project }: { project: Project }) {
  const lines = SECTIONS.map(([k, title]) => {
    const s = project[k] as Project['role']
    const first = s.body?.split(/\n{2,}/)[0] ?? s.facts?.map((f) => f.text).join(' ')
    return { title, text: first }
  }).filter((l) => l.text)
  return (
    <section className={styles.dataSheet} aria-label="Data sheet">
      {lines.length === 0 ? null : (
        <dl className="spec">
          {lines.map((l) => (
            <div key={l.title} style={{ display: 'contents' }}>
              <dt>{l.title}</dt>
              <dd>{l.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

function Pager({ project }: { project: Project }) {
  const sorted = [...projects].sort((a, b) => a.item - b.item)
  const i = sorted.findIndex((p) => p.slug === project.slug)
  const prev = sorted[i - 1]
  const next = sorted[i + 1]
  return (
    <>
      {prev ? (
        <Link to={`/projects/${prev.slug}`} className={styles.pagerLink}>
          <span className="mono">Previous, No. {String(prev.item).padStart(2, '0')}</span>
          <span>{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/projects/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
          <span className="mono">Next, No. {String(next.item).padStart(2, '0')}</span>
          <span>{next.name}</span>
        </Link>
      ) : (
        <span />
      )}
    </>
  )
}
