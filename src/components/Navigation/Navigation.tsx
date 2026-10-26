import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { sections } from '../../app/sections'
import styles from './Navigation.module.css'

/**
 * Primary navigation.
 *
 * Wide screens: binder divider tabs hanging off the right edge of the sheet.
 * Narrow screens: a compact bar with an Index button that opens the same list.
 * It is one <nav> in both cases, so there is one set of links in the DOM.
 */
export function Navigation() {
  const location = useLocation()
  // The index is open for the page it was opened on; navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === location.pathname
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(open) : v
    setOpenOn(next ? location.pathname : null)
  }
  const listId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className={styles.nav} aria-label="Primary" data-open={open || undefined}>
      <div className={styles.bar}>
        <Link to="/" className={styles.home}>
          <span className={styles.homeMark} aria-hidden="true">
            TT
          </span>
          <span className={styles.homeName}>Tawanda Timire</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.toggleLabel}>{open ? 'Close index' : 'Index'}</span>
          <span className={styles.toggleRange} aria-hidden="true">
            01&ndash;05
          </span>
        </button>
      </div>

      <ol className={styles.tabs} id={listId}>
        {sections.map((s) => (
          <li key={s.path}>
            <NavLink
              to={s.path}
              className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
              aria-label={`${s.plain} (${s.name})`}
            >
              <span className={styles.tabNum} aria-hidden="true">
                {s.num}
              </span>
              <span className={styles.tabName}>{s.name}</span>
              <span className={styles.tabPlain}>{s.plain}</span>
              <span className={styles.lamp} aria-hidden="true" />
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  )
}
