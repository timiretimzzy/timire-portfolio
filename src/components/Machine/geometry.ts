/** Geometry for the index ring. Angles in degrees, SVG convention (0 = east, clockwise). */

export const C = 320 // centre of the 640 x 640 drawing
export const SECTORS = 6
export const SECTOR_DEG = 360 / SECTORS

export function polar(r: number, deg: number, cx = C, cy = C): [number, number] {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

export function pt(r: number, deg: number): string {
  const [x, y] = polar(r, deg)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

/** Mid-angle of sector i in the disc's own coordinates. Sector 0 starts at the top. */
export function sectorMid(i: number): number {
  return -90 + i * SECTOR_DEG
}

/** An annular wedge between radii r0 and r1, from a0 to a1 degrees. */
export function wedge(r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0
  return [
    `M ${pt(r1, a0)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)}`,
    `L ${pt(r0, a1)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)}`,
    'Z',
  ].join(' ')
}

/** Open arc used as a text path, running clockwise so text reads upright at the top. */
export function arcPath(r: number, a0: number, a1: number): string {
  return `M ${pt(r, a0)} A ${r} ${r} 0 0 1 ${pt(r, a1)}`
}

/**
 * Shortest signed rotation from `from` to `to`, so the ring never spins
 * the long way round.
 */
export function shortestTurn(from: number, to: number): number {
  let d = (to - from) % 360
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return from + d
}
