import { Link } from 'react-router-dom'
import { EvidenceMark } from '../../components/Evidence/EvidenceMark'
import { Plate } from '../../components/Plate/Plate'
import { education, experience, mechanisms, profile } from '../../data/profile'
import { projectsForMechanism } from '../../data/projects'
import type { Evidence, MechanismId } from '../../data/types'
import { usePageTitle } from '../../hooks/usePageTitle'
import { img } from '../../lib/asset'
import styles from './AboutPage.module.css'

/** What each mechanism contains, in concrete terms. Sources: the dossier and the project files. */
const capabilities: Record<MechanismId, string[]> = {
  A: [
    'Founder-led product development and commercial software delivery',
    'Requirements, prioritisation and business workflow analysis',
    'Pricing, onboarding, implementation and support',
  ],
  B: [
    'C# and .NET: WPF desktop applications, ASP.NET Core, Entity Framework Core',
    'TypeScript and JavaScript: React, Preact, Vite, Expo / React Native and Electron',
    'REST APIs, SQLite, SQL Server and PostgreSQL; data models, integrations and offline-aware workflows',
    'Node.js and Express, with Drizzle ORM',
  ],
  C: [
    'Python: pandas, NumPy, scikit-learn, XGBoost, LightGBM, statsmodels',
    'Cleaning, feature engineering, predictive modelling, model evaluation',
    'Reporting in Power BI and DAX, Excel and VBA',
  ],
  D: [
    'Functional, regression, integration, exploratory, smoke, API and acceptance testing',
    'Automated suites in xUnit and Playwright, including integration tests against real databases',
    'Reproducing and investigating defects; validating data and workflows',
    'Release checks, defect triage and evidence-led test reporting',
  ],
  E: ['Browser games, a deterministic mystery and card-game prototypes; some builds are still marked as experiments'],
  F: ['Quizmaster, adjudicator and trainer', 'Educational events, debate and drama programmes', 'Rumblings of a Fool, his blog'],
}

interface Note {
  text: React.ReactNode
  evidence: Evidence
}

const notes: Note[] = [
  {
    text: (
      <>
        The subject is a software engineer based in Harare. Most of what he builds is C# and .NET: Windows business
        applications, APIs, and the integrations that connect them to systems they were never designed to meet.
      </>
    ),
    evidence: 'inspected',
  },
  {
    text: (
      <>
        He founded and runs <Link to="/projects/fiscalstack">FiscalStack Solutions</Link>. The project files place him
        across product definition, architecture, development and verification; the record distinguishes shipped work
        from code that is still in progress.
      </>
    ),
    evidence: 'inspected',
  },
  {
    text: (
      <>
        His recurring design rule is that a sale must never wait for the network. It appears in the{' '}
        <Link to="/projects/fiscalstack-retail">retail till</Link>, the{' '}
        <Link to="/projects/fiscalstack-lesotho">Lesotho port</Link> and the{' '}
        <Link to="/projects/clubstack">club system</Link> alike.
      </>
    ),
    evidence: 'inspected',
  },
  {
    text: (
      <>
        <Link to="/projects/edustack">EduStack</Link> gives each school a distinct identity and separates the workspaces
        for administrators, teachers, students and parents. The visible workflows are in the file; backend adoption
        figures are not.
      </>
    ),
    evidence: 'inspected',
  },
  {
    text: (
      <>
        He trained as a data scientist. His dissertation tried to predict One Day International cricket results while
        the match was still being played.
      </>
    ),
    evidence: 'stated',
  },
  {
    text: (
      <>
        Outside software, the record includes school quiz tournaments, educational programmes, adjudication and
        writing. The archive keeps the details relevant to the work and leaves the rest in the notebook.
      </>
    ),
    evidence: 'stated',
  },
  {
    text: (
      <>
        Not every entry is a commercial release. The catalogue also contains a static company website, an
        investigative game prototype, a card-game experiment and a support-platform scaffold. Their labels say which
        is which.
      </>
    ),
    evidence: 'inspected',
  },
]

export default function AboutPage() {
  usePageTitle('About', {
    description: 'Tawanda Timire is a software engineer and data scientist in Harare, Zimbabwe. Read about his experience, education, capabilities and work.',
  })
  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>Sheet 01</span>
        <span>The Specimen</span>
        <span>Field notes on the subject</span>
      </header>

      {/* ---------- Opening: field notes + specimen label ---------- */}
      <section className={styles.opening}>
        <div className={styles.titleCol}>
          <h1 className="h1">
            The Specimen
            <span className={styles.plain}>About Tawanda Timire</span>
          </h1>
          <p className={styles.method}>
            This file records what can be established about the subject from his work: the systems in his
            repositories, the products he has put online, his writing and the account he gives of himself when the
            archive is opened.
          </p>
          <ol className={styles.fieldNotes}>
            {notes.map((n, i) => (
              <li key={i}>
                <span className={styles.noteNo}>Obs. {String(i + 1).padStart(2, '0')}</span>
                <p>
                  {n.text}
                  <EvidenceMark evidence={n.evidence} compact />
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.labelCol}>
          {profile.portrait ? (
            <Plate
              number="01.1"
              plate={{ src: img(profile.portrait), alt: 'Photograph of Tawanda Timire.', caption: 'The subject, photographed.', nature: 'photograph' }}
            />
          ) : import.meta.env.DEV ? (
            <Plate
              number="01.1"
              plate={{ alt: 'Reserved plate for a photograph of Tawanda Timire.', caption: 'The subject, photographed.', nature: 'awaiting' }}
            />
          ) : null}
          <div className={styles.label} role="group" aria-label="Specimen label">
            <p className={styles.labelHead}>
              <span>Specimen label</span>
              <span>No. TT-01</span>
            </p>
            <dl className={styles.labelList}>
              <dt>Name</dt>
              <dd>{profile.name}</dd>
              <dt>Collected</dt>
              <dd>{profile.location}</dd>
              <dt>Habitat</dt>
              <dd>C# / .NET, APIs, Windows business systems, tax authorities</dd>
              <dt>Also found in</dt>
              <dd>Data science, QA, product, small-business operations, school quiz halls, field days</dd>
              <dt>Behaviour</dt>
              <dd>Records test results and engineering decisions</dd>
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
                <br />
                <a href={profile.contact.whatsappHref}>{profile.contact.phoneDisplay}</a>
              </dd>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- Mechanisms in detail ---------- */}
      <section className="section" aria-labelledby="mech-h">
        <div className={styles.secHead}>
          <h2 id="mech-h" className="h2">
            Capabilities, by mechanism
          </h2>
          <p className="muted">
            The same six parts as the ring on the front sheet, with what each contains and the projects in which it was
            observed.
          </p>
        </div>
        <ol className={styles.mechList}>
          {mechanisms.map((m) => {
            const used = projectsForMechanism(m.id)
            return (
              <li key={m.id} className={styles.mech}>
                <p className={styles.mechId} aria-hidden="true">
                  {m.id}
                </p>
                <div className={styles.mechBody}>
                  <h3 className="h3">
                    {m.label} <span className={styles.part}>{m.partName}</span>
                  </h3>
                  <ul className={styles.caps}>
                    {capabilities[m.id].map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  {used.length > 0 && (
                    <p className={styles.used}>
                      <span className="mono">Observed in:</span>{' '}
                      {used.map((p, i) => (
                        <span key={p.slug}>
                          {i > 0 && ', '}
                          <Link to={`/projects/${p.slug}`}>{p.name}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ---------- Logbook ---------- */}
      <section className="section" aria-labelledby="log-h">
        <div className={styles.secHead}>
          <h2 id="log-h" className="h2">
            Logbook
          </h2>
          <p className="muted">
            Employment and study, newest first, as given by the subject.
          </p>
        </div>
        <div className={styles.logGrid}>
          <div>
            <h3 className={styles.logTitle}>Work</h3>
            <ol className={styles.log}>
              {experience.map((e) => (
                <li key={e.org}>
                  <p className={styles.logPeriod}>{e.period ?? (e.org === 'FiscalStack Solutions' ? 'Current' : 'n.d.')}</p>
                  <div>
                    <p className={styles.logOrg}>{e.org}</p>
                    <p className={styles.logRole}>
                      {e.role}
                      {e.place && <span className="muted">, {e.place}</span>}
                      <EvidenceMark evidence={e.evidence} compact />
                    </p>
                    <p className={styles.logNotes}>{e.notes}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className={styles.logTitle}>Study</h3>
            <ol className={styles.log}>
              {education.map((e) => (
                <li key={e.institution}>
                  <p className={styles.logPeriod}>{e.period}</p>
                  <div>
                    <p className={styles.logOrg}>{e.institution}</p>
                    <p className={styles.logRole}>{e.award}</p>
                    <p className={styles.logNotes}>
                      {e.note}{' '}
                      {e.institution === 'University of Zimbabwe' && (
                        <Link to="/projects/cricket-odi-prediction">Research sheet</Link>
                      )}
                    </p>
                  </div>
                </li>
              ))}
              <li>
                <p className={styles.logPeriod}>2017</p>
                <div>
                  <p className={styles.logOrg}>St Anthony&rsquo;s High School</p>
                  <p className={styles.logRole}>A-level: Mathematics, Physics, Chemistry</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Outside the machine ---------- */}
      <section className="section" aria-labelledby="int-h">
        <div className={styles.interests}>
          <h2 id="int-h" className="h2">
            Outside the machine
          </h2>
          <ul className={styles.interestList}>
            {profile.interests.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className={styles.interestNote}>
            Interests as reported by the subject. Some of them turn into writing, collected in{' '}
            <Link to="/writing">the Thinking Room</Link>.
          </p>
        </div>
      </section>

      {/* ---------- Reaching the subject ---------- */}
      <section className="section" aria-labelledby="reach-h">
        <div className={styles.reach}>
          <h2 id="reach-h" className="h2">
            Reaching the subject
          </h2>
          <p>
            For work, hiring, a product demonstration or anything on these sheets, contact Tawanda Timire directly:{' '}
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>, phone or WhatsApp{' '}
            <a href={profile.contact.whatsappHref}>{profile.contact.phoneDisplay}</a>.{' '}
            <Link to="/contact" className="go">
              Contact sheet
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
