import { places } from '../../data/places'
import { profile } from '../../data/profile'
import { usePageTitle } from '../../hooks/usePageTitle'
import styles from './ContactPage.module.css'

/**
 * Sheet 05, The Next Variable. No form, no puzzle: every way to reach
 * Tawanda is a plain link, readable without clicking anything.
 */
export default function ContactPage() {
  usePageTitle('Contact', {
    description: 'Contact Tawanda Timire in Harare about software engineering, FiscalStack products, integrations, data work, testing and educational events.',
  })
  const c = profile.contact
  const lines = [
    { k: 'Email', v: c.email, href: `mailto:${c.email}`, note: 'Best for anything with detail in it.' },
    { k: 'Phone', v: c.phoneDisplay, href: c.phoneHref, note: 'Zimbabwe, CAT (UTC+2).' },
    { k: 'WhatsApp', v: c.phoneDisplay, href: c.whatsappHref, note: 'Same number.' },
    { k: 'GitHub', v: `github.com/${c.githubHandle}`, href: c.github, note: 'Code that is public.' },
    { k: 'LinkedIn', v: 'linkedin.com/in/tawanda-timire-91137b149', href: c.linkedin!, note: 'Professional profile and contact history.' },
  ]
  const socialLinks = [
    { label: 'Instagram', href: c.instagram, note: 'Photos and updates.' },
    { label: 'X', href: c.x, note: 'Short-form notes and links.' },
    { label: 'Facebook', href: c.facebook, note: 'Personal profile and community links.' },
  ]

  return (
    <div className="sheet sheet-enter">
      <header className="running-head">
        <span>Sheet 05</span>
        <span>The Next Variable</span>
        <span>Contact, hiring and collaboration</span>
      </header>

      <section className={styles.head}>
        <h1 className="h1">
          The Next Variable
          <span className={styles.plain}>Contact</span>
        </h1>
        <p className={styles.intro}>
          The archive ends where the subject can be reached. If you are hiring, need a fiscal till or a club system, or
          need software to talk to software it was not designed for, send the inquiry directly to Tawanda Timire.
        </p>
      </section>

      <section aria-labelledby="lines-h" className={styles.board}>
        <h2 id="lines-h" className="visually-hidden">
          Contact details
        </h2>
        <ul className={styles.lines}>
          {lines.map((l, i) => (
            <li key={l.k} className={styles.line}>
              <span className={styles.jack} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.k}>{l.k}</span>
              <a className={styles.v} href={l.href} rel={l.k === 'GitHub' || l.k === 'LinkedIn' ? 'me' : undefined}>
                {l.v}
              </a>
              <span className={styles.note}>{l.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="useful-h">
        <div className={styles.split}>
          <div>
            <h2 id="useful-h" className="h2">
              Engage him for
            </h2>
          </div>
          <ul className={styles.useful}>
            <li>
              <strong>Software engineering roles and contracts</strong> in C# and .NET: APIs, business applications,
              Windows desktop software.
            </li>
            <li>
              <strong>Integration work</strong>: connecting systems to fiscal requirements, devices, or each other.
            </li>
            <li>
              <strong>Data work</strong>: analysis, predictive modelling, reporting that someone will actually read.
            </li>
            <li>
              <strong>Testing and verification</strong>: functional, regression, API and acceptance testing.
            </li>
            <li>
              <strong>Speaking, quizzes and adjudication</strong> for schools and educational events.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="elsewhere-h">
        <div className={styles.split}>
          <div>
            <h2 id="elsewhere-h" className="h2">
              Elsewhere
            </h2>
          </div>
          <div>
            <p className={styles.companyNote}>
              His writing and his experiments remain catalogued on their own addresses.
            </p>
            <ul className={styles.sites}>
              <li>
                <a href={places.blog} rel="noopener">
                  Rumblings of a Fool
                </a>
                <span className="muted"> The blog</span>
              </li>
              <li>
                <a href={places.stacked} rel="noopener">
                  STACKED
                </a>
                <span className="muted"> Stacking game, playable</span>
              </li>
              <li>
                <a href={places.speedRoulette} rel="noopener">
                  Reaction Speed Roulette
                </a>
                <span className="muted"> Reaction game, playable</span>
              </li>
              <li>
                <a href={places.typeRace} rel="noopener">
                  TypeRace
                </a>
                <span className="muted"> Typing race, playable</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="social-h">
        <div className={styles.split}>
          <div>
            <h2 id="social-h" className="h2">
              Social profiles
            </h2>
          </div>
          <div>
            <ul className={styles.sites}>
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} rel="noopener noreferrer">
                    {s.label}
                  </a>
                  <span className="muted"> {s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="company-h">
        <div className={styles.split}>
          <div>
            <h2 id="company-h" className="h2">
              For FiscalStack
            </h2>
          </div>
          <div>
            <p className={styles.companyNote}>
              For FiscalStack work in a business, the company has its own front door as well; either route reaches the same subject.
            </p>
            <ul className={styles.sites}>
              {profile.companySites.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener">
                    {s.label}
                  </a>
                  <span className="muted"> {s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
