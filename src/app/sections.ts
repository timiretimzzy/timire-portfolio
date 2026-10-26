/**
 * Information architecture. Visible names are the machine's; URLs, page
 * titles and accessible names stay plain so nobody needs a decoder ring.
 */
export interface SectionDef {
  num: string
  name: string
  plain: string
  path: string
}

export const sections: SectionDef[] = [
  { num: '01', name: 'The Specimen', plain: 'About', path: '/about' },
  { num: '02', name: 'The Machinery', plain: 'Projects', path: '/projects' },
  { num: '03', name: 'The Thinking Room', plain: 'Writing', path: '/writing' },
  { num: '04', name: 'The Experiments', plain: 'Experiments', path: '/experiments' },
  { num: '05', name: 'The Next Variable', plain: 'Contact', path: '/contact' },
]

export function sectionForPath(pathname: string): SectionDef | undefined {
  return sections.find((s) => pathname === s.path || pathname.startsWith(s.path + '/'))
}

/** Sheet number shown in running heads and title blocks. */
export function sheetNumber(pathname: string): string {
  return sectionForPath(pathname)?.num ?? '00'
}
