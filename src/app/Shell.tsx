import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation } from '../components/Navigation/Navigation'
import { TitleBlock } from '../components/TitleBlock/TitleBlock'
import styles from './Shell.module.css'

/**
 * Page frame: skip link, navigation, the sheet, the title block.
 * On every route change it scrolls to the top (or to a #fragment) and moves
 * focus to the new page, so keyboard and screen-reader users land in the
 * right place.
 */
export function Shell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (location.hash) {
      let id = location.hash.slice(1)
      try {
        id = decodeURIComponent(id)
      } catch {
        // Keep the literal fragment when it is not valid percent encoding.
      }
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname, location.hash])

  return (
    <div className={styles.shell}>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus()
          mainRef.current?.scrollIntoView()
        }}
      >
        Skip to content
      </a>
      <Navigation />
      <div className={styles.page}>
        <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
          <Suspense fallback={<div className={styles.loading} aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </main>
        <TitleBlock />
      </div>
    </div>
  )
}
