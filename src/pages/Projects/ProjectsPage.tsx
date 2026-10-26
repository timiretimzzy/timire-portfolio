import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PartsList } from '../../components/ProjectArchive/PartsList'
import { mechanisms } from '../../data/profile'
import { kindLabels, projects, statusLabels } from '../../data/projects'
import type { Project } from '../../data/types'
import { usePageTitle } from '../../hooks/usePageTitle'
import styles from './ProjectsPage.module.css'

type FilterKey = 'kind' | 'm' | 'status'

/**
 * Sheet 02, The Machinery: the full parts list with filters by kind,
 * mechanism and status. Filters live in the URL, so a filtered list can be
 * bookmarked or sent to someone.
 */
export default function ProjectsPage() {
  usePageTitle('Projects', {
    description: 'Commercial software, integrations, data research, QA and experiments by Tawanda Timire, including FiscalStack, ClubStack, Zivvvo and Chaos Cup.',
  })
  const [params] = useSearchParams()
  const requestedKind = params.get('kind')
  const requestedMechanism = params.get('m')
  const requestedStatus = params.get('status')
  const kind = (Object.keys(kindLabels) as Project['kind'][]).find((k) => k === requestedKind)
  const m = mechanisms.find((mechanism) => mechanism.id === requestedMechanism)?.id
  const usedStatuses = [...new Set(projects.map((p) => p.status))]
  const status = usedStatuses.find((s) => s === requestedStatus)

  const shown = projects
    .filter((p) => !kind || p.kind === kind)
    .filter((p) => !m || p.mechanisms.includes(m))
    .filter((p) => !status || p.status === status)

  const href = (key: FilterKey, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || next.get(key) === value) next.delete(key)
    else next.set(key, value)
    const q = next.toString()
    return q ? `/projects?${q}` : '/projects'
  }

  const describe = [
    kind && kindLabels[kind],
    m && `mechanism ${m}`,
    status && statusLabels[status].toLowerCase(),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>Sheet 02</span>
        <span>The Machinery</span>
        <span>Parts catalogue, complete</span>
      </header>

      <section className={styles.head}>
        <h1 className="h1">
          The Machinery
          <span className={styles.plain}>Projects and technical work</span>
        </h1>
        <p className={styles.intro}>
          Everything on the parts list: the commercial products he builds and runs, engineering and integration work,
          research, verification and the odd experiment. Product lines under FiscalStack are indented under the company.
          Each item opens its own sheet.
        </p>
      </section>

      <section className={styles.filters} aria-label="Filter the parts list">
        <FilterRow label="Kind">
          {(Object.keys(kindLabels) as Project['kind'][]).map((k) => (
            <FilterLink key={k} to={href('kind', k)} on={kind === k}>
              {kindLabels[k]}
            </FilterLink>
          ))}
        </FilterRow>
        <FilterRow label="Mechanism">
          {mechanisms.map((x) => (
            <FilterLink key={x.id} to={href('m', x.id)} on={m === x.id}>
              <span className={styles.mech}>{x.id}</span> {x.label}
            </FilterLink>
          ))}
        </FilterRow>
        <FilterRow label="Status">
          {usedStatuses.map((s) => (
            <FilterLink key={s} to={href('status', s)} on={status === s}>
              {statusLabels[s]}
            </FilterLink>
          ))}
        </FilterRow>
        <p className={styles.count} role="status">
          {shown.length} of {projects.length} items{describe && `: ${describe}`}.{' '}
          {(kind || m || status) && (
            <Link to="/projects" className={styles.clear}>
              Clear filters
            </Link>
          )}
        </p>
      </section>

      <section className={styles.list}>
        {shown.length > 0 ? (
          <PartsList projects={shown} caption="Parts list, sheet 02." mark={m ?? undefined} />
        ) : (
          <p className={styles.empty}>Nothing on the list matches all of those at once. Loosen a filter.</p>
        )}
      </section>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.row}>
      <p className={styles.rowLabel}>{label}</p>
      <ul className={styles.options}>{children}</ul>
    </div>
  )
}

function FilterLink({ to, on, children }: { to: string; on: boolean; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className={styles.option} aria-current={on ? 'true' : undefined}>
        {children}
      </Link>
    </li>
  )
}
