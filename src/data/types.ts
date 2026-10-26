/**
 * Typed content model for the portfolio.
 *
 * Everything the site says about a project comes from these records. Layout
 * code never hard-codes project facts, so adding or correcting a project
 * means editing data, not components.
 */

/** The six mechanisms of the Timire Machine. Each is a discipline. */
export type MechanismId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Mechanism {
  id: MechanismId
  /** Plain-language discipline name. Always shown first. */
  label: string
  /** One word for the key legend on the machine. */
  shortLabel: string
  /** The machine-part name used in the drawing. Secondary. */
  partName: string
  /** One sentence on what this part of the work covers. */
  summary: string
}

export type ProjectKind =
  | 'commercial'
  | 'engineering'
  | 'research'
  | 'qa'
  | 'game'
  | 'education'

/**
 * Lifecycle status, as far as it is known.
 * `unconfirmed` is used when nobody has yet checked the evidence.
 */
export type ProjectStatus =
  | 'operating'
  | 'live'
  | 'built'
  | 'in-development'
  | 'prototype'
  | 'completed'
  | 'unconfirmed'

/**
 * Where a statement comes from.
 * - `verified`: observed on a live public page, with the date.
 * - `inspected`: read in the project's own files (documentation, source tree,
 *   test reports) shown to the researcher, with the date of those files.
 * - `stated`: given by Tawanda in the project brief, not yet checked.
 * - `pending`: nothing known yet; the slot is waiting for material.
 */
export type Evidence = 'verified' | 'inspected' | 'stated' | 'pending'

export interface Fact {
  text: string
  evidence: Evidence
}

export interface ProjectLink {
  label: string
  href: string
  kind: 'product' | 'repository' | 'documentation' | 'company' | 'other'
}

export interface Plate {
  /** Imported image URL. Omit for an empty plate awaiting material. */
  src?: string
  alt: string
  caption: string
  /** Illustrations are never presented as screenshots. */
  nature: 'screenshot' | 'photograph' | 'illustration' | 'diagram' | 'awaiting'
  width?: number
  height?: number
}

export interface CaseSection {
  /** Free text; may contain several paragraphs separated by blank lines. */
  body?: string
  facts?: Fact[]
  /** What is still needed to complete this section. */
  awaiting?: string[]
}

export interface Project {
  slug: string
  /** Held back from the published site (no publishable content yet). */
  hidden?: boolean
  /** Bill-of-materials item number, used for cross-references in drawings. */
  item: number
  name: string
  /** Optional parent project slug (for FiscalStack product lines). */
  parent?: string
  kind: ProjectKind
  mechanisms: MechanismId[]
  status: ProjectStatus
  statusEvidence: Evidence
  /** One line for the parts list. */
  summary: string
  /** Accent used for the project's own visual world. */
  accent: 'ink' | 'cobalt' | 'chartreuse' | 'signal'
  role: CaseSection
  problem: CaseSection
  constraints: CaseSection
  architecture: CaseSection
  decisions: CaseSection
  challenges: CaseSection
  results: CaseSection
  stack: { name: string; evidence: Evidence }[]
  links: ProjectLink[]
  plates: Plate[]
  related: string[]
  /** Optional diagram id rendered by TechnicalDiagram. */
  diagram?: 'fiscal-problem-space' | 'zivvvo-layers'
  /** Shown in the Experiments section as well as the archive. */
  experiment?: {
    playable: 'playable' | 'working' | 'prototype' | 'archived' | 'unconfirmed'
    tagline: string
  }
}

export interface Article {
  slug: string
  title: string
  /** ISO date, or undefined when the piece has no publication date. */
  date?: string
  series?: string
  kind: 'essay' | 'technical' | 'research-summary' | 'site-note'
  summary: string
  body: string
  related: string[]
  /** Published elsewhere (e.g. the blog); the entry links out instead of to a page here. */
  external?: string
}
