import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DEFAULT_DESCRIPTION =
  'Tawanda Timire: software engineer, data scientist and founder of FiscalStack Solutions, in Harare, Zimbabwe. C#/.NET, APIs, Windows business systems, integrations, data science and QA.'

interface MetadataOptions {
  description?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

function setCanonical(href?: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    link?.remove()
    document.head.querySelector('meta[property="og:url"]')?.remove()
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.append(link)
  }
  link.href = href
  setMeta('property', 'og:url', href)
}

function canonicalOrigin() {
  const configured = import.meta.env.VITE_SITE_URL
  if (!configured || import.meta.env.MODE === 'static' || import.meta.env.VITE_ROUTER === 'hash') return undefined
  try {
    const url = new URL(configured)
    if (!['http:', 'https:'].includes(url.protocol)) return undefined
    if (url.pathname !== '/' || url.search || url.hash) return undefined
    return url.origin
  } catch {
    return undefined
  }
}

/** Sets the document title, search metadata and social sharing text for a route. */
export function usePageTitle(title?: string, options: MetadataOptions = {}) {
  const { pathname } = useLocation()
  const description = options.description ?? DEFAULT_DESCRIPTION
  const noIndex = options.noIndex ?? false
  const type = options.type ?? 'website'

  useEffect(() => {
    const fullTitle = title ? `${title} | Tawanda Timire` : 'Tawanda Timire | software, data, business'
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', 'The Timire Machine')
    setMeta('name', 'twitter:card', 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)

    const origin = canonicalOrigin()
    setCanonical(origin && !noIndex ? new URL(pathname, origin).href : undefined)
  }, [description, noIndex, pathname, title, type])
}
