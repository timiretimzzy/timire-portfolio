/**
 * Resolve a file under public/images/ against the deployed base path,
 * so the site works from a domain root or a sub-folder.
 */
export function img(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  return `${base}images/${path.replace(/^\/+/, '')}`
}
