import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'
import type { Project } from '../../data/types'
import { usePageTitle } from '../../hooks/usePageTitle'
import styles from './ExperimentsPage.module.css'

const PLAY_LABEL: Record<NonNullable<Project['experiment']>['playable'], string> = {
  playable: 'Playable',
  working: 'Working',
  prototype: 'Prototype',
  archived: 'Archived',
  unconfirmed: 'Status to be confirmed',
}

/**
 * Sheet 04, The Experiments. The one sheet where the rules loosen:
 * signal orange, cartridges on a shelf, things that move when you reach for them.
 * Every cartridge with a live build has a Play button that goes straight to it.
 */
export default function ExperimentsPage() {
  usePageTitle('Experiments', {
    description: 'Play STACKED, Reaction Speed Roulette and TypeRace, browser games from Tawanda Timire, and inspect the Timire Machine.',
  })
  const games = projects.filter((p) => p.experiment)

  return (
    <div className={styles.ground}>
      <div className="sheet sheet-enter">
        <header className={`running-head ${styles.head}`}>
          <span>Sheet 04</span>
          <span>The Experiments</span>
          <span>The loose gear</span>
        </header>

        <section className={styles.intro}>
          <h1 className={styles.title}>
            <span>The</span>
            <span className={styles.titleBig}>Experiments</span>
          </h1>
          <div className={styles.introText}>
            <p>
              Games, prototypes and product bets. This is the part of the machine that is allowed to rattle, so the
              sheet looks different on purpose. Some are ready to play; others still have a test label on the crate.
            </p>
            <p className={styles.legendNote}>Every cartridge says what state it is in:</p>
            <ul className={styles.legend}>
              {[...new Set([...games.map((g) => PLAY_LABEL[g.experiment!.playable]), 'Working'])].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </section>

        <ul className={styles.shelf} aria-label="Experiments">
          {games.map((g, i) => {
            const play = g.links.find((l) => l.kind === 'product')
            return (
              <li key={g.slug} className={styles.slot} style={{ ['--tilt' as string]: `${i % 2 ? 1.4 : -1.1}deg` }}>
                <article className={styles.cart} aria-labelledby={`cart-${g.slug}`}>
                  <span className={styles.cartTop} aria-hidden="true">
                    <span>TM-89</span>
                    <span>Cartridge {String(g.item).padStart(2, '0')}</span>
                  </span>
                  <span className={styles.label}>
                    <span className={styles.stripes} aria-hidden="true" />
                    {g.plates[0]?.src && (
                      <img src={g.plates[0].src} alt="" width={240} height={150} loading="lazy" className={styles.cover} />
                    )}
                    <h2 id={`cart-${g.slug}`} className={styles.cartName}>
                      {g.name}
                    </h2>
                    <span className={styles.tagline}>{g.experiment!.tagline}</span>
                  </span>
                  <span className={styles.cartFoot}>
                    <span className={styles.stamp}>{PLAY_LABEL[g.experiment!.playable]}</span>
                    <span className={styles.actions}>
                      <Link to={`/projects/${g.slug}`} className={styles.open}>
                        Sheet
                      </Link>
                      {play && (
                        <a href={play.href} className={styles.play} rel="noopener">
                          Play <span className="visually-hidden">{g.name}</span>
                        </a>
                      )}
                    </span>
                  </span>
                </article>
              </li>
            )
          })}

          {/* The machine on the front sheet is itself an experiment, and it works. */}
          <li className={styles.slot} style={{ ['--tilt' as string]: '-0.6deg' }}>
            <article className={`${styles.cart} ${styles.cartPaper}`} aria-labelledby="cart-machine">
              <span className={styles.cartTop} aria-hidden="true">
                <span>TM-89</span>
                <span>Cartridge 00</span>
              </span>
              <span className={styles.label}>
                <span className={styles.stripes} aria-hidden="true" />
                <span className={styles.ringMini} aria-hidden="true" />
                <h2 id="cart-machine" className={styles.cartName}>
                  The Timire Machine
                </h2>
                <span className={styles.tagline}>
                  The index ring on the front sheet. Six mechanisms, one pointer, a paper tape.
                </span>
              </span>
              <span className={styles.cartFoot}>
                <span className={styles.stamp}>Working</span>
                <span className={styles.actions}>
                  <Link to="/?m=E" className={styles.play}>
                    Turn the ring
                  </Link>
                </span>
              </span>
            </article>
          </li>
        </ul>

        <p className={styles.footnote}>
          Cartridge art drawn for this study, not taken from the games. The games themselves are one tap away.
        </p>
      </div>
    </div>
  )
}
