import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { mechanisms } from '../../data/profile'
import { projectsForMechanism, statusLabels } from '../../data/projects'
import { EvidenceMark } from '../Evidence/EvidenceMark'
import { IndexRing } from './IndexRing'
import { SECTOR_DEG, shortestTurn } from './geometry'
import styles from './Machine.module.css'

type View = 'elevation' | 'schematic'

const PARTS = [
  'Index pointer and lamp',
  'Bezel, graduated 000 to 330',
  'Index ring, six sectors',
  'Hub and retaining screw',
  'Drive shaft to readout unit',
]

/**
 * The Timire Machine (Fig. 1 on the front sheet).
 *
 * Choose a mechanism with the keys, the arrow keys, or by clicking a sector
 * of the ring. The ring turns that sector under the pointer, the readout
 * names it, and the paper tape lists the work that uses it. The selection
 * lives in the URL (?m=C) so it survives refreshes and can be shared.
 */
export function Machine() {
  const [params, setParams] = useSearchParams()
  const fromUrl = mechanisms.findIndex((m) => m.id === params.get('m'))
  const selected = fromUrl >= 0 ? fromUrl : 1 // B, software architecture: the main identity
  // Ring angle follows the selection, always turning the short way.
  // Adjusted during render (not in an effect) so there is no extra pass.
  const [turn, setTurn] = useState({ sel: selected, angle: -selected * SECTOR_DEG })
  if (turn.sel !== selected) {
    setTurn({ sel: selected, angle: shortestTurn(turn.angle, -selected * SECTOR_DEG) })
  }
  const angle = turn.angle
  const [view, setView] = useState<View>('elevation')
  const keysRef = useRef<(HTMLButtonElement | null)[]>([])

  const select = useCallback(
    (i: number, focus = false) => {
      const next = new URLSearchParams(params)
      next.set('m', mechanisms[i].id)
      setParams(next, { replace: true, preventScrollReset: true })
      if (focus) keysRef.current[i]?.focus()
    },
    [params, setParams],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = mechanisms.length
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (selected + 1) % n
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (selected - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next !== null) {
      e.preventDefault()
      select(next, true)
    }
  }

  const mech = mechanisms[selected]
  const tape = projectsForMechanism(mech.id)

  return (
    <figure className={styles.figure} data-view={view} aria-labelledby="fig1-caption">
      <div className={styles.head}>
        <p className={styles.figNo}>
          <span className="mono">Fig. 1</span>
          <span className={styles.figTitle}>The Timire Machine, Mk&nbsp;II</span>
          <span className="mono">{view === 'elevation' ? 'Elevation' : 'Schematic'}</span>
        </p>
        <div className={styles.viewSwitch} role="group" aria-label="Drawing view">
          {(['elevation', 'schematic'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={styles.viewBtn}
            >
              {v === 'elevation' ? 'Elevation' : 'Schematic'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.ringWrap}>
          <IndexRing mechanisms={mechanisms} selected={selected} angle={angle} onSelect={(i) => select(i)} />
        </div>

        <div className={styles.housing}>
          <div className={styles.badge} aria-hidden="true">
            <span>Model TM-89</span>
            <span>Readout unit</span>
          </div>

          <div className={`${styles.crt} tex-crt`} aria-live="polite" aria-atomic="true">
            <p className={styles.crtLine}>
              Mechanism {mech.id} / {mechanisms.length}
            </p>
            <p className={styles.crtName}>{mech.label}</p>
            <p className={styles.crtLine}>Part: {mech.partName}</p>
            <p className={styles.crtSummary}>{mech.summary}</p>
            <p className={styles.crtLine}>
              {tape.length} {tape.length === 1 ? 'entry' : 'entries'} on the tape
            </p>
          </div>

          <div
            className={styles.keys}
            role="radiogroup"
            aria-label="Select a mechanism"
            onKeyDown={onKeyDown}
          >
            {mechanisms.map((m, i) => (
              <button
                key={m.id}
                ref={(el) => {
                  keysRef.current[i] = el
                }}
                type="button"
                role="radio"
                aria-checked={i === selected}
                tabIndex={i === selected ? 0 : -1}
                className={styles.key}
                onClick={() => select(i)}
              >
                <span className={styles.keyLamp} aria-hidden="true" />
                <span className={styles.keyCap}>{m.id}</span>
                <span className={styles.keyLegend}>{m.shortLabel}</span>
              </button>
            ))}
          </div>

          <div className={styles.slot} aria-hidden="true" />
          <div className={styles.vents} aria-hidden="true" />
        </div>

        <div className={styles.tapeWrap}>
          <h2 className={styles.tapeHead}>
            <span className="mono">Tape out</span>
            <span>{mech.label}</span>
          </h2>
          <ol className={styles.tape}>
            {tape.map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`} className={styles.tapeLink}>
                  <span className={styles.tapeItem}>No. {String(p.item).padStart(2, '0')}</span>
                  <span className={styles.tapeName}>{p.name}</span>
                  <span className={styles.tapeStatus}>
                    {statusLabels[p.status]}
                    {p.statusEvidence === 'stated' && <EvidenceMark evidence="stated" compact />}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Link to={`/projects?m=${mech.id}`} className="go">
            Parts list for mechanism {mech.id}
          </Link>
        </div>
      </div>

      <figcaption id="fig1-caption" className={styles.caption}>
        <span className="mono">Fig. 1.</span> The Timire Machine. Six mechanisms on one ring; turn it with the keys
        to see which work uses which. {view === 'schematic' && 'Schematic view: line drawing with part callouts.'}
      </figcaption>

      {view === 'schematic' && (
        <ol className={styles.legend} aria-label="Part callouts">
          {PARTS.map((p, i) => (
            <li key={p}>
              <span className={styles.legendNum}>{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      )}
    </figure>
  )
}
