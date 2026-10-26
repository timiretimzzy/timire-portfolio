import { Link } from 'react-router-dom'
import { sections } from '../../app/sections'
import { Machine } from '../../components/Machine/Machine'
import { PartsList } from '../../components/ProjectArchive/PartsList'
import { usePageTitle } from '../../hooks/usePageTitle'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import styles from './HomePage.module.css'

const contents: Record<string, string> = {
  '/about': 'Who this is, where he has worked, what he studied.',
  '/projects': 'The parts list in full: commercial products, engineering, research, verification.',
  '/writing': 'Technical notes, research summaries and Rumblings of a Fool.',
  '/experiments': 'Games and prototypes. The loose gear.',
  '/contact': 'Email, phone, WhatsApp, GitHub. No forms, no puzzles.',
}

export function HomePage() {
  usePageTitle()
  // The front sheet shows the main assemblies; the archive has everything.
  const featured = projects.filter((p) =>
    ['fiscalstack', 'fiscalstack-engine', 'fiscalstack-retail', 'fiscalstack-restaurant', 'fiscalstack-lesotho', 'fiscalstack-integrations', 'clubstack', 'zivvvo', 'edustack', 'cricket-odi-prediction', 'stacked', 'speed-roulette', 'typerace', 'chaos-cup'].includes(p.slug),
  )

  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>The Timire Machine</span>
        <span>Operator&rsquo;s manual and parts catalogue</span>
        <span>Sheet 00, front</span>
      </header>

      {/* ---------- Masthead ---------- */}
      <section className={styles.masthead} aria-labelledby="name">
        <h1 id="name" className={`display ${styles.name}`}>
          <span className={styles.given}>{profile.givenName}</span>
          <span className={styles.family}>{profile.familyName}</span>
        </h1>

        <div className={styles.intro}>
          <p className="lede">
            Software engineer, data scientist and founder of{' '}
            <Link to="/projects/fiscalstack">FiscalStack&nbsp;Solutions</Link>, in Harare. A field report on the work,
            numbered and archived.
          </p>
          <p className={styles.body}>
            His main trade is C# and .NET: fiscal engines, Windows tills, club and school systems, and the
            integrations that connect them to tax authorities and to other people&rsquo;s software. Around that sit data
            science, testing, product work and the business of actually selling software. This archive follows the work
            as found: from the first specification, through the live deployment, to the support issue after the launch.
          </p>
          <p className={styles.voice}>
            Compiled from repositories, live products, writing and the subject&rsquo;s own account.
          </p>
        </div>

        <aside className={styles.spec} aria-label="Specification">
          <p className={`mono ${styles.specHead}`}>Specification</p>
          <dl className="spec">
            <dt>Based</dt>
            <dd>{profile.location}</dd>
            <dt>Company</dt>
            <dd>
              <Link to="/projects/fiscalstack">FiscalStack Solutions</Link>
            </dd>
            <dt>Degree</dt>
            <dd>BSc Hons, Data Science and Systems, University of Zimbabwe</dd>
            <dt>Reach</dt>
            <dd>
              <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              <br />
              <a href={profile.contact.whatsappHref}>WhatsApp {profile.contact.phoneDisplay}</a>
            </dd>
          </dl>
          <Link to="/contact" className="go">
            Contact sheet
          </Link>
        </aside>
      </section>

      {/* ---------- Fig. 1 ---------- */}
      <section className={styles.figure} aria-label="The machine">
        <Machine />
      </section>

      {/* ---------- Contents ---------- */}
      <section className="section" aria-labelledby="contents-h">
        <div className={styles.contentsGrid}>
          <div>
            <h2 id="contents-h" className="h2">
              Contents
            </h2>
            <p className={`${styles.contentsNote} muted`}>
              Five sheets after this one. The tabs on the edge of the page go to the same places.
            </p>
          </div>
          <ol className={styles.toc}>
            {sections.map((s) => (
              <li key={s.path}>
                <Link to={s.path} className={styles.tocLink}>
                  <span className={`${styles.tocNum} misreg`} data-text={s.num} aria-hidden="true">
                    {s.num}
                  </span>
                  <span className={styles.tocText}>
                    <span className={styles.tocName}>
                      {s.name} <span className={styles.tocPlain}>/ {s.plain}</span>
                    </span>
                    <span className={styles.tocDesc}>{contents[s.path]}</span>
                  </span>
                  <span className={styles.tocLeader} aria-hidden="true" />
                  <span className={`mono ${styles.tocSheet}`} aria-hidden="true">
                    sh. {s.num}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Parts list ---------- */}
      <section className="section" aria-labelledby="parts-h">
        <div className={styles.partsHead}>
          <h2 id="parts-h" className="h2">
            Principal assemblies
          </h2>
          <p className={`${styles.partsNote}`}>
            The main assemblies of his work so far. Letters in circles are the mechanisms on the ring; each item opens
            its own sheet.
          </p>
        </div>
        <PartsList projects={featured} caption="Parts list, front sheet extract. Full list on sheet 02." />
        <p className={styles.partsMore}>
          <Link to="/projects" className="go">
            All {projects.length} items on sheet 02
          </Link>
        </p>
      </section>
    </div>
  )
}
