import type { CaseSection } from '../../data/types'

/** True when a case-study section has something to show the public. */
export function hasContent(s: CaseSection | undefined) {
  return Boolean(s && (s.body || (s.facts && s.facts.length)))
}
