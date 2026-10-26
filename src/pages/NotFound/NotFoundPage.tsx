import { Link, useLocation } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Sheet not found', {
    description: 'The requested sheet does not exist in The Timire Machine.',
    noIndex: true,
  })
  const { pathname } = useLocation()
  return (
    <div className="sheet sheet-enter" style={{ paddingBlock: 'clamp(3rem, 8vw, 7rem)' }}>
      <p className="mono">Error 404 / no such sheet</p>
      <h1 className="h1" style={{ margin: '1rem 0 1.5rem' }}>
        This sheet is missing from the binder.
      </h1>
      <p className="lede" style={{ maxWidth: '28em', marginBottom: '2rem' }}>
        Nothing is filed at <code className="mono">{pathname}</code>. It may have been renamed, or it never existed.
      </p>
      <p>
        <Link to="/" className="go">
          Front sheet
        </Link>{' '}
        &nbsp;{' '}
        <Link to="/projects" className="go">
          Parts list
        </Link>
      </p>
    </div>
  )
}
