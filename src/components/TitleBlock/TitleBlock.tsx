import { useLocation } from 'react-router-dom'
import { sectionForPath, sections } from '../../app/sections'
import { profile } from '../../data/profile'
import styles from './TitleBlock.module.css'

/**
 * The site footer, drawn as the title block of an engineering drawing:
 * what this sheet is, who drew it, when it was last revised, and how to
 * reach him. Contact details are here on every page, on purpose.
 */
export function TitleBlock() {
  const { pathname } = useLocation()
  const section = sectionForPath(pathname)
  const sheet = section?.num ?? '00'
  const title = section ? `${section.name} / ${section.plain}` : 'Front sheet'

  return (
    <footer className={styles.block}>
      <div className={styles.inner}>
        <div className={`${styles.cell} ${styles.title}`}>
          <span className={styles.k}>Title</span>
          <span className={styles.v}>The Timire Machine: {title}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.k}>Sheet</span>
          <span className={styles.v}>
            {sheet} of {String(sections.length).padStart(2, '0')}
          </span>
        </div>
        <div className={styles.cell}>
          <span className={styles.k}>Subject</span>
          <span className={styles.v}>T. Timire</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.k}>Rev.</span>
          <span className={styles.v}>
            <time dateTime={__BUILD_DATE__}>{__BUILD_DATE__}</time>
          </span>
        </div>
        <div className={`${styles.cell} ${styles.contact}`}>
          <span className={styles.k}>Contact</span>
          <span className={styles.v}>
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            <span aria-hidden="true"> / </span>
            <a href={profile.contact.phoneHref}>{profile.contact.phoneDisplay}</a>
            <span aria-hidden="true"> / </span>
            <a href={profile.contact.github} rel="me">
              GitHub
            </a>
            <span aria-hidden="true"> / </span>
            <a href={profile.contact.linkedin} rel="me">
              LinkedIn
            </a>
          </span>
        </div>
        <div className={styles.cell}>
          <span className={styles.k}>Location</span>
          <span className={styles.v}>{profile.location}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.k}>Scale</span>
          <span className={styles.v}>Not to scale</span>
        </div>
      </div>
    </footer>
  )
}
